package models

import (
	"time"

	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	Email      string `gorm:"unique;not null"`
	Password   string `gorm:"not null"`
	Name       string `gorm:"not null"`
	OTP        string `gorm:"size:6"`
	OTPExpiry  time.Time
	IsVerified bool      `gorm:"default:false"`
	Products   []Product `gorm:"foreignKey:UserID"`
}
