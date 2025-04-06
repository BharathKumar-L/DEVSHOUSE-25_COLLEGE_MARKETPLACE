package main

import (
	"crypto/rand"
	"encoding/hex"
	"fmt"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"time"

	"marketplace/models"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"golang.org/x/crypto/bcrypt"
	"gopkg.in/gomail.v2"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

type SignupRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required,min=6"`
	Name     string `json:"name" binding:"required"`
	College  string `json:"college" binding:"required"`
}

type VerifyOTPRequest struct {
	Email string `json:"email" binding:"required,email"`
	OTP   string `json:"otp" binding:"required"`
}

type CheckEmailRequest struct {
	Email string `json:"email" binding:"required,email"`
}

type CreateProductRequest struct {
	Title       string  `json:"title" binding:"required"`
	Description string  `json:"description" binding:"required"`
	Price       float64 `json:"price" binding:"required"`
	Category    string  `json:"category" binding:"required"`
	Condition   string  `json:"condition" binding:"required"`
	ImageURL    string  `json:"imageUrl"`
	Location    string  `json:"location"`
	ContactInfo string  `json:"contactInfo"`
	College     string  `json:"college" binding:"required"`
}

type LoginRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

var db *gorm.DB
var mailer *gomail.Dialer

func init() {
	// Load environment variables
	if err := godotenv.Load(); err != nil {
		log.Fatal("Error loading .env file")
	}

	// Initialize database
	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=disable",
		os.Getenv("DB_HOST"),
		os.Getenv("DB_USER"),
		os.Getenv("DB_PASSWORD"),
		os.Getenv("DB_NAME"),
		os.Getenv("DB_PORT"),
	)

	var err error
	db, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	// Auto migrate the schema
	db.AutoMigrate(&models.User{}, &models.Product{}, &models.Transaction{})

	// Update products table to add college column with default value
	db.Exec("ALTER TABLE products ADD COLUMN college text DEFAULT 'default'")
	db.Exec("UPDATE products SET college = 'default' WHERE college IS NULL")
	db.Exec("ALTER TABLE products ALTER COLUMN college SET NOT NULL")

	// Seed the database with sample data
	seedDatabase()

	// Initialize email dialer
	mailer = gomail.NewDialer(
		"smtp.gmail.com",
		587,
		os.Getenv("EMAIL_USER"),
		os.Getenv("EMAIL_PASSWORD"),
	)
}

func generateOTP() string {
	bytes := make([]byte, 3)
	rand.Read(bytes)
	return hex.EncodeToString(bytes)
}

func sendOTPEmail(email, otp string) error {
	log.Printf("Attempting to send OTP email to: %s", email)

	// Verify email configuration
	emailUser := os.Getenv("EMAIL_USER")
	emailPass := os.Getenv("EMAIL_PASSWORD")

	if emailUser == "" || emailPass == "" {
		log.Printf("Email configuration missing. EMAIL_USER: %v, EMAIL_PASSWORD: %v",
			emailUser != "", emailPass != "")
		return fmt.Errorf("email configuration missing")
	}

	m := gomail.NewMessage()
	m.SetHeader("From", emailUser)
	m.SetHeader("To", email)
	m.SetHeader("Subject", "Your OTP for Marketplace Signup")

	body := fmt.Sprintf("Your OTP for signup is: %s\nThis OTP will expire in 10 minutes.", otp)
	m.SetBody("text/plain", body)

	// Create a new dialer for each email to ensure fresh connection
	d := gomail.NewDialer("smtp.gmail.com", 587, emailUser, emailPass)

	if err := d.DialAndSend(m); err != nil {
		log.Printf("Error sending email: %v", err)
		return fmt.Errorf("failed to send email: %v", err)
	}

	log.Printf("OTP email sent successfully to %s", email)
	return nil
}

func signup(c *gin.Context) {
	var req SignupRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		log.Printf("Error binding JSON: %v", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	log.Printf("Received signup request: %+v", req)

	// Extract college name from email domain
	// Format: username@college.edu.in
	emailParts := strings.Split(req.Email, "@")
	if len(emailParts) != 2 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid email format"})
		return
	}

	domainParts := strings.Split(emailParts[1], ".")
	if len(domainParts) < 3 || domainParts[1] != "edu" || domainParts[2] != "in" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Email must be in the format username@collegename.edu.in"})
		return
	}

	// Handle college names with multiple words (e.g., "indian-institute" -> "Indian Institute")
	collegeName := strings.Title(strings.ReplaceAll(domainParts[0], "-", " "))
	log.Printf("Extracted college name from email: %s", collegeName)

	// Check if user already exists
	var existingUser models.User
	if result := db.Where("email = ?", req.Email).First(&existingUser); result.Error == nil {
		c.JSON(http.StatusConflict, gin.H{"error": "Email already registered"})
		return
	}

	// Generate OTP
	otp := generateOTP()
	otpExpiry := time.Now().Add(10 * time.Minute)

	// Hash password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error processing password"})
		return
	}

	// Create user with the college name from email domain
	user := models.User{
		Email:      req.Email,
		Password:   string(hashedPassword),
		Name:       req.Name,
		College:    collegeName, // Use the extracted college name
		OTP:        otp,
		OTPExpiry:  otpExpiry,
		IsVerified: false,
	}

	log.Printf("Creating user with data: %+v", user)

	if err := db.Create(&user).Error; err != nil {
		log.Printf("Error creating user: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error creating user"})
		return
	}

	// Send OTP email
	if err := sendOTPEmail(req.Email, otp); err != nil {
		// If email fails, delete the user
		db.Delete(&user)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error sending OTP email"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "OTP sent successfully"})
}

func verifyOTP(c *gin.Context) {
	var req VerifyOTPRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var user models.User
	if result := db.Where("email = ?", req.Email).First(&user); result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	if user.OTP != req.OTP {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid OTP"})
		return
	}

	if time.Now().After(user.OTPExpiry) {
		c.JSON(http.StatusBadRequest, gin.H{"error": "OTP has expired"})
		return
	}

	// Update user verification status
	user.IsVerified = true
	user.OTP = "" // Clear the OTP after successful verification
	if err := db.Save(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error updating user status"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Email verified successfully"})
}

func checkEmail(c *gin.Context) {
	var req CheckEmailRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		log.Printf("Error binding JSON: %v", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var user models.User
	if result := db.Where("email = ?", req.Email).First(&user); result.Error != nil {
		log.Printf("Email not found: %v", result.Error)
		c.JSON(http.StatusNotFound, gin.H{"error": "Email not found"})
		return
	}

	// Return a simple JSON response
	response := gin.H{
		"exists":  true,
		"message": "Email exists",
	}

	log.Printf("Sending response: %+v", response)
	c.JSON(http.StatusOK, response)
}

func createProduct(c *gin.Context) {
	var req CreateProductRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		log.Printf("Error binding JSON: %v", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request data. Please check all fields are correct."})
		return
	}

	// Get user from session
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	// Validate required fields
	if req.Title == "" || req.Description == "" || req.Price <= 0 || req.Category == "" || req.Condition == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "All fields are required"})
		return
	}

	product := models.Product{
		Title:       req.Title,
		Description: req.Description,
		Price:       req.Price,
		Category:    req.Category,
		Condition:   req.Condition,
		ImageURL:    req.ImageURL,
		UserID:      userID.(uint),
		Location:    req.Location,
		ContactInfo: req.ContactInfo,
		Status:      "available", // Set initial status
		College:     req.College, // Add college field
	}

	if err := db.Create(&product).Error; err != nil {
		log.Printf("Error creating product: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error creating product"})
		return
	}

	log.Printf("Product created successfully: %+v", product)
	c.JSON(http.StatusCreated, product)
}

func getUserProducts(c *gin.Context) {
	// Get user ID from session/token (you'll need to implement this)
	userID := uint(1) // Temporary hardcoded user ID for testing

	var products []models.Product
	if err := db.Where("user_id = ?", userID).Find(&products).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error fetching products"})
		return
	}

	c.JSON(http.StatusOK, products)
}

func getProduct(c *gin.Context) {
	id := c.Param("id")

	var product models.Product
	if result := db.First(&product, id); result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Product not found"})
		return
	}

	c.JSON(http.StatusOK, product)
}

func updateProduct(c *gin.Context) {
	id := c.Param("id")

	var product models.Product
	if result := db.First(&product, id); result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Product not found"})
		return
	}

	var req CreateProductRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Update product fields
	product.Title = req.Title
	product.Description = req.Description
	product.Price = req.Price
	product.Category = req.Category
	product.Condition = req.Condition
	product.ImageURL = req.ImageURL
	product.Location = req.Location
	product.ContactInfo = req.ContactInfo

	if err := db.Save(&product).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error updating product"})
		return
	}

	c.JSON(http.StatusOK, product)
}

func deleteProduct(c *gin.Context) {
	id := c.Param("id")
	log.Printf("Attempting to delete product with ID: %s", id)

	var product models.Product
	if result := db.First(&product, id); result.Error != nil {
		log.Printf("Error finding product: %v", result.Error)
		c.JSON(http.StatusNotFound, gin.H{"error": "Product not found"})
		return
	}

	// Log the product details before deletion
	log.Printf("Found product to delete: %+v", product)

	if err := db.Delete(&product).Error; err != nil {
		log.Printf("Error deleting product: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": fmt.Sprintf("Error deleting product: %v", err)})
		return
	}

	log.Printf("Successfully deleted product with ID: %s", id)
	c.Header("Content-Type", "application/json")
	c.JSON(http.StatusOK, gin.H{"message": "Product deleted successfully"})
}

func uploadImage(c *gin.Context) {
	file, err := c.FormFile("image")
	if err != nil {
		log.Printf("Error getting file from form: %v", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "No file uploaded"})
		return
	}

	// Generate unique filename
	ext := filepath.Ext(file.Filename)
	filename := fmt.Sprintf("%d%s", time.Now().UnixNano(), ext)

	// Get absolute path for uploads directory
	uploadsDir := "uploads"
	absPath, err := filepath.Abs(uploadsDir)
	if err != nil {
		log.Printf("Error getting absolute path: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to process upload path"})
		return
	}

	// Ensure uploads directory exists
	if err := os.MkdirAll(absPath, 0755); err != nil {
		log.Printf("Error creating uploads directory: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create uploads directory"})
		return
	}

	// Save the file
	dst := filepath.Join(absPath, filename)
	log.Printf("Saving file to: %s", dst)
	if err := c.SaveUploadedFile(file, dst); err != nil {
		log.Printf("Error saving file: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save file"})
		return
	}

	// Return the file path that can be used to access the image
	imageURL := fmt.Sprintf("/uploads/%s", filename)
	log.Printf("File saved successfully. URL: %s", imageURL)
	c.JSON(http.StatusOK, gin.H{"imageUrl": imageURL})
}

func getProductsByCollege(c *gin.Context) {
	college := c.Query("college")

	var products []models.Product
	var result *gorm.DB

	if college == "" {
		// If no college is specified, return all available products
		result = db.Where("status = ?", "available").Find(&products)
	} else {
		// If college is specified, filter by college
		result = db.Table("products").
			Select("products.*").
			Joins("LEFT JOIN users ON products.user_id = users.id").
			Where("users.college = ? AND products.status = ?", college, "available").
			Find(&products)
	}

	if result.Error != nil {
		log.Printf("Error fetching products: %v", result.Error)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch products"})
		return
	}

	c.JSON(http.StatusOK, products)
}

// GetTransactions returns all transactions for the current user
func GetTransactions(c *gin.Context) {
	userID := c.GetUint("userID")
	if userID == 0 {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	var transactions []struct {
		ID           uint      `json:"id"`
		ProductTitle string    `json:"productTitle"`
		Amount       float64   `json:"amount"`
		Status       string    `json:"status"`
		CreatedAt    time.Time `json:"createdAt"`
	}

	result := db.Table("transactions").
		Select("transactions.id, products.title as product_title, transactions.amount, transactions.status, transactions.created_at").
		Joins("LEFT JOIN products ON transactions.product_id = products.id").
		Where("transactions.buyer_id = ? OR transactions.seller_id = ?", userID, userID).
		Order("transactions.created_at DESC").
		Find(&transactions)

	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch transactions"})
		return
	}

	c.JSON(http.StatusOK, transactions)
}

// CreateTransaction creates a new transaction
func CreateTransaction(c *gin.Context) {
	userID := c.GetUint("userID")
	if userID == 0 {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	var input struct {
		ProductID uint    `json:"productId" binding:"required"`
		Amount    float64 `json:"amount" binding:"required"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Start a transaction
	tx := db.Begin()

	// Get the product
	var product models.Product
	if err := tx.First(&product, input.ProductID).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusNotFound, gin.H{"error": "Product not found"})
		return
	}

	// Check if product is available
	if product.Status != "available" {
		tx.Rollback()
		c.JSON(http.StatusBadRequest, gin.H{"error": "Product is not available"})
		return
	}

	// Create the transaction
	transaction := models.Transaction{
		ProductID: input.ProductID,
		BuyerID:   userID,
		SellerID:  product.UserID,
		Amount:    input.Amount,
		Status:    "pending",
	}

	if err := tx.Create(&transaction).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create transaction"})
		return
	}

	// Update product status
	if err := tx.Model(&product).Update("status", "reserved").Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update product status"})
		return
	}

	// Commit the transaction
	if err := tx.Commit().Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to commit transaction"})
		return
	}

	c.JSON(http.StatusOK, transaction)
}

func getTransactions(c *gin.Context) {
	// Get user ID from session cookie
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	var transactions []struct {
		ID           uint      `json:"id"`
		ProductTitle string    `json:"productTitle"`
		Amount       float64   `json:"amount"`
		Status       string    `json:"status"`
		CreatedAt    time.Time `json:"createdAt"`
	}

	result := db.Table("transactions").
		Select("transactions.id, products.title as product_title, transactions.amount, transactions.status, transactions.created_at").
		Joins("LEFT JOIN products ON transactions.product_id = products.id").
		Where("transactions.buyer_id = ? OR transactions.seller_id = ?", userID, userID).
		Order("transactions.created_at DESC").
		Find(&transactions)

	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch transactions"})
		return
	}

	c.JSON(http.StatusOK, transactions)
}

func login(c *gin.Context) {
	log.Println("Login request received")

	var req LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		log.Printf("Error binding login request: %v", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	log.Printf("Login attempt for email: %s", req.Email)

	// Extract college name from email
	// Format: username@collegename.edu.in
	emailParts := strings.Split(req.Email, "@")
	if len(emailParts) != 2 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid email format"})
		return
	}

	domainParts := strings.Split(emailParts[1], ".")
	if len(domainParts) < 3 || domainParts[1] != "edu" || domainParts[2] != "in" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Email must be in the format username@collegename.edu.in"})
		return
	}

	// Handle college names with multiple words (e.g., "indian-institute" -> "Indian Institute")
	collegeName := strings.Title(strings.ReplaceAll(domainParts[0], "-", " "))
	log.Printf("Extracted college name from email: %s", collegeName)

	var user models.User
	if result := db.Where("email = ?", req.Email).First(&user); result.Error != nil {
		log.Printf("User not found for email: %s", req.Email)
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid email or password"})
		return
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.Password)); err != nil {
		log.Printf("Invalid password for email: %s", req.Email)
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid email or password"})
		return
	}

	if !user.IsVerified {
		log.Printf("Unverified user attempt: %s", req.Email)
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Please verify your email first"})
		return
	}

	// Set user ID in session
	c.Set("userID", user.ID)

	// Return user data without sensitive information
	userData := map[string]interface{}{
		"id":         user.ID,
		"email":      user.Email,
		"name":       user.Name,
		"college":    collegeName, // Use the extracted college name from email
		"isVerified": user.IsVerified,
	}

	log.Printf("Successful login for user: %s with college: %s", user.Email, collegeName)
	c.JSON(http.StatusOK, userData)
}

func seedDatabase() {
	// Check if we already have products
	var count int64
	db.Model(&models.Product{}).Count(&count)
	if count > 0 {
		log.Println("Database already has products, skipping seed")
		return
	}

	// Create a test user if it doesn't exist
	var user models.User
	if result := db.Where("email = ?", "test@example.com").First(&user); result.Error != nil {
		user = models.User{
			Email:      "test@example.com",
			Password:   "$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy", // password: 123456
			Name:       "Test User",
			College:    "Example College",
			IsVerified: true,
		}
		if err := db.Create(&user).Error; err != nil {
			log.Printf("Error creating test user: %v", err)
			return
		}
		log.Println("Created test user")
	}

	// Create sample products
	sampleProducts := []models.Product{
		{
			Title:       "Introduction to Computer Science Textbook",
			Description: "Used textbook for CS101. Good condition with some highlighting.",
			Price:       25.99,
			Category:    "textbooks",
			Condition:   "good",
			ImageURL:    "/uploads/textbook.jpg",
			UserID:      user.ID,
			Status:      "available",
			Location:    "Main Campus Library",
			ContactInfo: "test@example.com",
		},
		{
			Title:       "MacBook Pro 2019",
			Description: "Selling my MacBook Pro. Works perfectly, just upgraded to a newer model.",
			Price:       899.99,
			Category:    "electronics",
			Condition:   "like new",
			ImageURL:    "/uploads/macbook.jpg",
			UserID:      user.ID,
			Status:      "available",
			Location:    "Student Housing",
			ContactInfo: "test@example.com",
		},
		{
			Title:       "Desk Lamp",
			Description: "LED desk lamp with adjustable brightness. Perfect for studying.",
			Price:       15.50,
			Category:    "furniture",
			Condition:   "new",
			ImageURL:    "/uploads/lamp.jpg",
			UserID:      user.ID,
			Status:      "available",
			Location:    "Engineering Building",
			ContactInfo: "test@example.com",
		},
	}

	for _, product := range sampleProducts {
		if err := db.Create(&product).Error; err != nil {
			log.Printf("Error creating product: %v", err)
			continue
		}
		log.Printf("Created product: %s", product.Title)
	}

	log.Println("Database seeding completed")
}

func main() {
	r := gin.Default()

	// Configure CORS
	config := cors.DefaultConfig()
	config.AllowOrigins = []string{"http://localhost:3000"}
	config.AllowMethods = []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"}
	config.AllowHeaders = []string{"Origin", "Content-Type", "Accept", "Authorization"}
	config.AllowCredentials = true

	r.Use(cors.New(config))

	// Create uploads directory if it doesn't exist
	if err := os.MkdirAll("uploads", 0755); err != nil {
		log.Fatal("Failed to create uploads directory:", err)
	}

	// Serve static files from the uploads directory with proper headers
	r.Static("/uploads", "./uploads")
	r.Use(func(c *gin.Context) {
		if strings.HasPrefix(c.Request.URL.Path, "/uploads/") {
			c.Header("Cache-Control", "public, max-age=31536000")
		}
		c.Next()
	})

	// Auto migrate the schema
	db.AutoMigrate(&models.User{}, &models.Product{}, &models.Transaction{})

	// Routes
	r.POST("/api/signup", signup)
	r.POST("/api/verify-otp", verifyOTP)
	r.POST("/api/check-email", checkEmail)
	r.POST("/api/login", login)

	// Product routes
	r.POST("/api/products", createProduct)
	r.GET("/api/products", getProductsByCollege)
	r.GET("/api/products/user", getUserProducts)
	r.GET("/api/products/:id", getProduct)
	r.PUT("/api/products/:id", updateProduct)
	r.DELETE("/api/products/:id", deleteProduct)

	// File upload route
	r.POST("/api/upload", uploadImage)

	// Transaction endpoints
	r.GET("/api/transactions", getTransactions)
	r.POST("/api/transactions", CreateTransaction)

	// Start server
	if err := r.Run(":8080"); err != nil {
		log.Fatal("Failed to start server:", err)
	}
}
