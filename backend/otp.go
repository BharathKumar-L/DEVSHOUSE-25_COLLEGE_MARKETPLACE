package main

import (
	"crypto/rand"
	"encoding/base32"
	"fmt"
	"net/smtp"
	"time"
)

var otpStore = make(map[string]string)

// GenerateOTP generates a random OTP and sends it to the user's email
func GenerateOTP(email string) (string, error) {
	otp := make([]byte, 5)
	_, err := rand.Read(otp)
	if err != nil {
		return "", err
	}

	otpCode := base32.StdEncoding.EncodeToString(otp)
	otpStore[email] = otpCode

	// Send OTP via email
	smtpHost := "smtp.example.com"
	smtpPort := "587"
	senderEmail := "your-email@example.com"
	senderPassword := "your-email-password"

	auth := smtp.PlainAuth("", senderEmail, senderPassword, smtpHost)

	msg := []byte(fmt.Sprintf("Subject: Your OTP Code\n\nYour OTP code is %s", otpCode))

	err = smtp.SendMail(smtpHost+":"+smtpPort, auth, senderEmail, []string{email}, msg)
	if err != nil {
		return "", err
	}

	return otpCode, nil
}

// VerifyOTP verifies the OTP entered by the user
func VerifyOTP(email, otp string) bool {
	storedOtp, exists := otpStore[email]
	if !exists {
		return false
	}

	return storedOtp == otp
}

// Clean up expired OTPs
func cleanupExpiredOTPs() {
	ticker := time.NewTicker(5 * time.Minute)
	defer ticker.Stop()

	for {
		<-ticker.C
		for email := range otpStore {
			if time.Since(time.Now()) > 5*time.Minute {
				delete(otpStore, email)
			}
		}
	}
}

func init() {
	go cleanupExpiredOTPs()
}
