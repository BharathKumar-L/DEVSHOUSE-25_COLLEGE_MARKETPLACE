package db

import (
	"database/sql"
	"fmt"
	"log"
	"os"

	_ "github.com/lib/pq"
)

var DB *sql.DB

func InitDB() error {
	// Database connection string
	connStr := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=disable",
		os.Getenv("DB_HOST"),
		os.Getenv("DB_PORT"),
		os.Getenv("DB_USER"),
		os.Getenv("DB_PASSWORD"),
		os.Getenv("DB_NAME"),
	)

	log.Printf("Attempting to connect to PostgreSQL database at %s:%s...", os.Getenv("DB_HOST"), os.Getenv("DB_PORT"))

	// Connect to PostgreSQL
	var err error
	DB, err = sql.Open("postgres", connStr)
	if err != nil {
		log.Printf("❌ Failed to open database connection: %v", err)
		return fmt.Errorf("error connecting to database: %v", err)
	}

	// Test the connection
	if err = DB.Ping(); err != nil {
		log.Printf("❌ Failed to ping database: %v", err)
		return fmt.Errorf("error pinging database: %v", err)
	}

	log.Printf("✅ Successfully connected to PostgreSQL database '%s'", os.Getenv("DB_NAME"))

	// Create database if it doesn't exist
	_, err = DB.Exec(`
		CREATE TABLE IF NOT EXISTS otp_verifications (
			email VARCHAR(255) PRIMARY KEY,
			otp VARCHAR(10) NOT NULL,
			created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
			expires_at TIMESTAMP NOT NULL
		);
	`)
	if err != nil {
		log.Printf("❌ Failed to create otp_verifications table: %v", err)
		return fmt.Errorf("error creating otp_verifications table: %v", err)
	}

	log.Printf("✅ Successfully initialized database tables")
	return nil
}
