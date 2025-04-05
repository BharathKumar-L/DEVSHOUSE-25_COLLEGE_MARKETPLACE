package models

import (
	"gorm.io/gorm"
)

type Product struct {
	gorm.Model
	Title       string  `gorm:"not null"`
	Description string  `gorm:"type:text"`
	Price       float64 `gorm:"not null"`
	Category    string  `gorm:"not null"`
	Condition   string  `gorm:"not null"`
	ImageURL    string
	UserID      uint   `gorm:"not null"`
	User        User   `gorm:"foreignKey:UserID"`
	Status      string `gorm:"default:'available'"` // available, sold, reserved
	Location    string
	ContactInfo string
}
