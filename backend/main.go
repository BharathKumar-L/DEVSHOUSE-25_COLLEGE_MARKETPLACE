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
	db.AutoMigrate(&models.User{}, &models.Product{})

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
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

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

	// Create user
	user := models.User{
		Email:      req.Email,
		Password:   string(hashedPassword),
		Name:       req.Name,
		OTP:        otp,
		OTPExpiry:  otpExpiry,
		IsVerified: false,
	}

	if err := db.Create(&user).Error; err != nil {
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

	// Get user ID from session/token (you'll need to implement this)
	userID := uint(1) // Temporary hardcoded user ID for testing

	product := models.Product{
		Title:       req.Title,
		Description: req.Description,
		Price:       req.Price,
		Category:    req.Category,
		Condition:   req.Condition,
		ImageURL:    req.ImageURL,
		UserID:      userID,
		Location:    req.Location,
		ContactInfo: req.ContactInfo,
	}

	if err := db.Create(&product).Error; err != nil {
		log.Printf("Error creating product: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error creating product"})
		return
	}

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
	db.AutoMigrate(&models.User{}, &models.Product{})

	// Routes
	r.POST("/signup", signup)
	r.POST("/verify-otp", verifyOTP)
	r.POST("/check-email", checkEmail)

	// Product routes
	r.POST("/products", createProduct)
	r.GET("/products/user", getUserProducts)
	r.GET("/products/:id", getProduct)
	r.PUT("/products/:id", updateProduct)
	r.DELETE("/products/:id", deleteProduct)

	// File upload route
	r.POST("/upload", uploadImage)

	// Start server
	if err := r.Run(":8080"); err != nil {
		log.Fatal("Failed to start server:", err)
	}
}
