package models

import (
	"gorm.io/gorm"
)

type Transaction struct {
	gorm.Model
	ProductID uint    `gorm:"not null"`
	Product   Product `gorm:"foreignKey:ProductID"`
	BuyerID   uint    `gorm:"not null"`
	Buyer     User    `gorm:"foreignKey:BuyerID"`
	SellerID  uint    `gorm:"not null"`
	Seller    User    `gorm:"foreignKey:SellerID"`
	Amount    float64 `gorm:"not null"`
	Status    string  `gorm:"default:'pending'"` // pending, completed, cancelled
}
