package main

import (
	"fmt"
	"log"
	"net/http"
	"net/smtp"
	"os"
	"time"

	"college-marketplace/db"

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
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"},
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	// Routes
	r.POST("/api/send-otp", sendOTP)
	r.POST("/api/verify-otp", verifyOTP)
	r.POST("/api/register", registerUser)

	// Start server
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	r.Run(":" + port)
}

func sendOTP(c *gin.Context) {
	var user User
	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Generate OTP
	otp := generateOTP()
	log.Printf("Generated OTP: %s for email: %s", otp, user.Email)

	// Store OTP in database with expiration
	expiresAt := time.Now().Add(10 * time.Minute)
	_, err := db.DB.Exec(`
		INSERT INTO otp_verifications (email, otp, expires_at)
		VALUES ($1, $2, $3)
		ON CONFLICT (email) DO UPDATE
		SET otp = $2, created_at = CURRENT_TIMESTAMP, expires_at = $3
	`, user.Email, otp, expiresAt)
	if err != nil {
		log.Printf("Failed to store OTP: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to store OTP"})
		return
	}

	// Send OTP via email
	if err := sendEmail(user.Email, otp); err != nil {
		log.Printf("Failed to send email: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to send OTP"})
		return
	}

	log.Printf("OTP sent successfully to %s", user.Email)
	c.JSON(http.StatusOK, gin.H{"message": "OTP sent successfully"})
}

func verifyOTP(c *gin.Context) {
	var user User
	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	log.Printf("Verifying OTP for email: %s", user.Email)
	log.Printf("Received OTP: %s", user.OTP)

	// Query the database for the OTP
	var storedOTP string
	var expiresAt time.Time
	err := db.DB.QueryRow(`
		SELECT otp, expires_at
		FROM otp_verifications
		WHERE email = $1 AND expires_at > CURRENT_TIMESTAMP
	`, user.Email).Scan(&storedOTP, &expiresAt)

	if err != nil {
		log.Printf("No valid OTP found for email: %s", user.Email)
		c.JSON(http.StatusUnauthorized, gin.H{"error": "No valid OTP found for this email"})
		return
	}

	if storedOTP != user.OTP {
		log.Printf("OTP mismatch for %s. Expected: %s, Got: %s", user.Email, storedOTP, user.OTP)
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid OTP"})
		return
	}

	// Delete the OTP after successful verification
	_, err = db.DB.Exec("DELETE FROM otp_verifications WHERE email = $1", user.Email)
	if err != nil {
		log.Printf("Failed to delete OTP after verification: %v", err)
	}

	log.Printf("OTP verified successfully for email: %s", user.Email)
	c.JSON(http.StatusOK, gin.H{"message": "OTP verified successfully"})
}

func registerUser(c *gin.Context) {
	var user User
	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Verify OTP first
	var storedOTP string
	err := db.DB.QueryRow(`
		SELECT otp
		FROM otp_verifications
		WHERE email = $1 AND expires_at > CURRENT_TIMESTAMP
	`, user.Email).Scan(&storedOTP)

	if err != nil {
		log.Printf("No valid OTP found for email: %s", user.Email)
		c.JSON(http.StatusUnauthorized, gin.H{"error": "No valid OTP found for this email"})
		return
	}

	if storedOTP != user.OTP {
		log.Printf("OTP mismatch for %s. Expected: %s, Got: %s", user.Email, storedOTP, user.OTP)
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid OTP"})
		return
	}

	// Here you would typically save the user to a database
	// For now, we'll just return success
	c.JSON(http.StatusOK, gin.H{"message": "User registered successfully"})
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

	// Message
	subject := "Your OTP for College Marketplace"
	body := fmt.Sprintf("Your OTP is: %s\n\nThis OTP will expire in 10 minutes.", otp)
	message := fmt.Sprintf("From: %s\r\nTo: %s\r\nSubject: %s\r\n\r\n%s", from, to, subject, body)

	// Authentication
	auth := smtp.PlainAuth("", from, password, smtpHost)

	// Send email
	log.Printf("Attempting to send email to: %s", to)
	err := smtp.SendMail(smtpHost+":"+smtpPort, auth, from, []string{to}, []byte(message))
	if err != nil {
		log.Printf("Failed to send email: %v", err)
		return fmt.Errorf("failed to send email: %v", err)
	}

	log.Println("Email sent successfully")
	return nil
}
