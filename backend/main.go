package main

import (
	"fmt"
	"net/http"
)

func main() {
	http.HandleFunc("/generate-otp", generateOTPHandler)
	http.HandleFunc("/verify-otp", verifyOTPHandler)

	fmt.Println("Server is running on http://localhost:8080")
	http.ListenAndServe(":8080", nil)
}

func generateOTPHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	email := r.FormValue("email")
	otp, err := GenerateOTP(email)
	if err != nil {
		http.Error(w, "Failed to generate OTP", http.StatusInternalServerError)
		return
	}

	fmt.Fprintf(w, "OTP %s sent to %s", otp, email)
}

func verifyOTPHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	email := r.FormValue("email")
	otp := r.FormValue("otp")

	if VerifyOTP(email, otp) {
		fmt.Fprintln(w, "OTP verified successfully")
	} else {
		http.Error(w, "Invalid OTP", http.StatusUnauthorized)
	}
}
