package main

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"net/smtp"
	"os"
	"time"

	"college-marketplace/db"
	"college-marketplace/handlers"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

type User struct {
	Email    string `json:"email"`
	Password string `json:"password"`
	Name     string `json:"name"`
	OTP      string `json:"otp"`
}

func main() {
	// Load environment variables
	if err := godotenv.Load(); err != nil {
		log.Fatal("Error loading .env file")
	}

	// Initialize database
	if err := db.InitDB(); err != nil {
		log.Fatal("Error initializing database:", err)
	}

	// Initialize Gin router
	r := gin.Default()

	// Configure CORS
	config := cors.DefaultConfig()
	config.AllowOrigins = []string{"http://localhost:3000"} // Update with your frontend URL
	config.AllowCredentials = true
	r.Use(cors.New(config))

	// Define routes
	api := r.Group("/api")
	{
		// Auth routes
		api.POST("/send-otp", sendOTP)
		api.POST("/verify-otp", verifyOTP)
		api.POST("/register", handlers.RegisterUser)
		api.POST("/login", handlers.LoginUser)

		// User routes
		api.GET("/users/:id", handlers.GetUserProfile)
		api.PUT("/users/:id", handlers.UpdateUserProfile)

		// Product routes
		api.POST("/products", handlers.CreateProduct)
		api.GET("/products", handlers.GetProducts)
		api.GET("/products/:id", handlers.GetProduct)
		api.PUT("/products/:id", handlers.UpdateProduct)
		api.DELETE("/products/:id", handlers.DeleteProduct)

		// Chat routes
		api.POST("/chats", handlers.CreateChat)
		api.GET("/chats/:id", handlers.GetChat)
		api.GET("/chats/user/:userId", handlers.GetUserChats)

		// Message routes
		api.POST("/messages", handlers.CreateMessage)
		api.GET("/messages/:chatId", handlers.GetChatMessages)
	}

	// Start server
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	log.Printf("🚀 Server starting on port %s", port)
	if err := r.Run(":" + port); err != nil {
		log.Fatal("Error starting server:", err)
	}
}

func sendOTP(c *gin.Context) {
	var user User
	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	otp := generateOTP()
	expiresAt := time.Now().Add(10 * time.Minute)

	// Update or insert the OTP
	_, err := db.DB.Exec(`
		INSERT INTO otp_verifications (email, otp, expires_at)
		VALUES ($1, $2, $3)
		ON CONFLICT (email) 
		DO UPDATE SET otp = $2, expires_at = $3
	`, user.Email, otp, expiresAt)

	if err != nil {
		log.Printf("❌ Failed to store OTP: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to store OTP"})
		return
	}

	log.Printf("✅ OTP stored successfully for email: %s", user.Email)

	// Send the OTP via email
	if err := sendEmail(user.Email, otp); err != nil {
		log.Printf("❌ Failed to send email: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to send OTP email"})
		return
	}

	log.Printf("✅ OTP sent successfully to email: %s", user.Email)
	c.JSON(http.StatusOK, gin.H{"message": "OTP sent successfully"})
}

func verifyOTP(c *gin.Context) {
	var user User
	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	log.Printf("🔍 Verifying OTP for email: %s", user.Email)
	log.Printf("📝 Received OTP: %s", user.OTP)

	// Query the database for the OTP
	var storedOTP string
	var expiresAt time.Time
	err := db.DB.QueryRow(`
		SELECT otp, expires_at
		FROM otp_verifications
		WHERE email = $1
	`, user.Email).Scan(&storedOTP, &expiresAt)

	if err != nil {
		if err == sql.ErrNoRows {
			log.Printf("❌ No OTP found for email: %s", user.Email)
			c.JSON(http.StatusUnauthorized, gin.H{"error": "No OTP found for this email. Please request a new one."})
		} else {
			log.Printf("❌ Database error: %v", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		}
		return
	}

	log.Printf("✅ Found stored OTP: %s", storedOTP)
	log.Printf("⏰ OTP expires at: %v", expiresAt)

	// Check if OTP has expired
	if time.Now().After(expiresAt) {
		log.Printf("⚠️ OTP has expired for email: %s", user.Email)
		c.JSON(http.StatusUnauthorized, gin.H{"error": "OTP has expired. Please request a new one."})
		return
	}

	if storedOTP != user.OTP {
		log.Printf("❌ OTP mismatch for %s", user.Email)
		log.Printf("Expected: %s, Got: %s", storedOTP, user.OTP)
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid OTP"})
		return
	}

	log.Printf("✅ OTP verified successfully for email: %s", user.Email)
	c.JSON(http.StatusOK, gin.H{"message": "OTP verified successfully"})
}

func generateOTP() string {
	// Generate a 6-digit random number between 100000 and 999999
	otp := 100000 + time.Now().UnixNano()%900000
	return fmt.Sprintf("%06d", otp)
}

func sendEmail(to, otp string) error {
	from := os.Getenv("SMTP_EMAIL")
	password := os.Getenv("SMTP_PASSWORD")
	smtpHost := os.Getenv("SMTP_HOST")
	smtpPort := "587"

	// Validate environment variables
	if from == "" || password == "" || smtpHost == "" {
		log.Printf("❌ Missing email configuration: SMTP_EMAIL=%v, SMTP_HOST=%v, SMTP_PASSWORD=%v",
			from != "", smtpHost != "", password != "")
		return fmt.Errorf("missing email configuration")
	}

	// Message
	subject := "Your OTP for College Marketplace"
	body := fmt.Sprintf(`
Hello!

Your OTP for College Marketplace is: %s

This OTP will expire in 10 minutes.

Best regards,
College Marketplace Team
`, otp)

	message := fmt.Sprintf("From: %s\r\nTo: %s\r\nSubject: %s\r\nMIME-Version: 1.0\r\nContent-Type: text/plain; charset=UTF-8\r\n\r\n%s",
		from, to, subject, body)

	// Authentication
	auth := smtp.PlainAuth("", from, password, smtpHost)

	// Send email
	log.Printf("📧 Attempting to send email to: %s", to)
	log.Printf("📧 Using SMTP server: %s:%s", smtpHost, smtpPort)

	err := smtp.SendMail(smtpHost+":"+smtpPort, auth, from, []string{to}, []byte(message))
	if err != nil {
		log.Printf("❌ Failed to send email: %v", err)
		return fmt.Errorf("failed to send email: %v", err)
	}

	log.Printf("✅ Email sent successfully to: %s", to)
	return nil
}
