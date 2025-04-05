package handlers

import (
	"college-marketplace/db"
	"college-marketplace/models"
	"database/sql"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
)

// RegisterUser handles user registration
func RegisterUser(c *gin.Context) {
	var user models.User
	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Hash the password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.PasswordHash), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to hash password"})
		return
	}

	// Generate UUID for the user
	user.ID = uuid.New()
	user.PasswordHash = string(hashedPassword)
	user.CreatedAt = time.Now()

	// Insert user into database
	_, err = db.DB.Exec(`
		INSERT INTO users (id, name, email, password_hash, college_id, is_admin, created_at)
		VALUES ($1, $2, $3, $4, $5, $6, $7)
	`, user.ID, user.Name, user.Email, user.PasswordHash, user.CollegeID, user.IsAdmin, user.CreatedAt)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create user"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "User registered successfully", "user": user})
}

// LoginUser handles user login
func LoginUser(c *gin.Context) {
	var loginData struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}

	if err := c.ShouldBindJSON(&loginData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var user models.User
	err := db.DB.QueryRow(`
		SELECT id, name, email, password_hash, college_id, is_admin
		FROM users
		WHERE email = $1
	`, loginData.Email).Scan(&user.ID, &user.Name, &user.Email, &user.PasswordHash, &user.CollegeID, &user.IsAdmin)

	if err != nil {
		if err == sql.ErrNoRows {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid email or password"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		}
		return
	}

	// Compare password hash
	err = bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(loginData.Password))
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid email or password"})
		return
	}

	// Remove password hash from response
	user.PasswordHash = ""

	c.JSON(http.StatusOK, gin.H{"message": "Login successful", "user": user})
}

// GetUserProfile retrieves user profile
func GetUserProfile(c *gin.Context) {
	userID := c.Param("id")

	var user models.User
	err := db.DB.QueryRow(`
		SELECT id, name, email, college_id, is_admin, created_at
		FROM users
		WHERE id = $1
	`, userID).Scan(&user.ID, &user.Name, &user.Email, &user.CollegeID, &user.IsAdmin, &user.CreatedAt)

	if err != nil {
		if err == sql.ErrNoRows {
			c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		}
		return
	}

	c.JSON(http.StatusOK, user)
}

// UpdateUserProfile updates user profile
func UpdateUserProfile(c *gin.Context) {
	userID := c.Param("id")

	var user models.User
	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	_, err := db.DB.Exec(`
		UPDATE users
		SET name = $1, email = $2
		WHERE id = $3
	`, user.Name, user.Email, userID)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update user"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "User updated successfully"})
}

// Product handlers
func CreateProduct(c *gin.Context) {
	var product models.Product
	if err := c.ShouldBindJSON(&product); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	product.ID = uuid.New()
	product.CreatedAt = time.Now()

	_, err := db.DB.Exec(`
		INSERT INTO products (id, title, description, price, category, images, user_id, college_id, is_active, created_at)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
	`, product.ID, product.Title, product.Description, product.Price, product.Category, product.Images, product.UserID, product.CollegeID, product.IsActive, product.CreatedAt)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create product"})
		return
	}

	c.JSON(http.StatusOK, product)
}

func GetProducts(c *gin.Context) {
	rows, err := db.DB.Query(`
		SELECT id, title, description, price, category, images, user_id, college_id, is_active, created_at
		FROM products
		WHERE is_active = true
	`)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch products"})
		return
	}
	defer rows.Close()

	var products []models.Product
	for rows.Next() {
		var product models.Product
		err := rows.Scan(&product.ID, &product.Title, &product.Description, &product.Price, &product.Category, &product.Images, &product.UserID, &product.CollegeID, &product.IsActive, &product.CreatedAt)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to scan product"})
			return
		}
		products = append(products, product)
	}

	c.JSON(http.StatusOK, products)
}

func GetProduct(c *gin.Context) {
	id := c.Param("id")
	var product models.Product

	err := db.DB.QueryRow(`
		SELECT id, title, description, price, category, images, user_id, college_id, is_active, created_at
		FROM products
		WHERE id = $1
	`, id).Scan(&product.ID, &product.Title, &product.Description, &product.Price, &product.Category, &product.Images, &product.UserID, &product.CollegeID, &product.IsActive, &product.CreatedAt)

	if err != nil {
		if err == sql.ErrNoRows {
			c.JSON(http.StatusNotFound, gin.H{"error": "Product not found"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		}
		return
	}

	c.JSON(http.StatusOK, product)
}

func UpdateProduct(c *gin.Context) {
	id := c.Param("id")
	var product models.Product

	if err := c.ShouldBindJSON(&product); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	_, err := db.DB.Exec(`
		UPDATE products
		SET title = $1, description = $2, price = $3, category = $4, images = $5, is_active = $6
		WHERE id = $7
	`, product.Title, product.Description, product.Price, product.Category, product.Images, product.IsActive, id)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update product"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Product updated successfully"})
}

func DeleteProduct(c *gin.Context) {
	id := c.Param("id")

	_, err := db.DB.Exec(`
		UPDATE products
		SET is_active = false
		WHERE id = $1
	`, id)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete product"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Product deleted successfully"})
}

// Chat handlers
func CreateChat(c *gin.Context) {
	var chat models.Chat
	if err := c.ShouldBindJSON(&chat); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	chat.ID = uuid.New()
	chat.CreatedAt = time.Now()

	_, err := db.DB.Exec(`
		INSERT INTO chats (id, user1_id, user2_id, created_at)
		VALUES ($1, $2, $3, $4)
	`, chat.ID, chat.User1ID, chat.User2ID, chat.CreatedAt)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create chat"})
		return
	}

	c.JSON(http.StatusOK, chat)
}

func GetChat(c *gin.Context) {
	id := c.Param("id")
	var chat models.Chat

	err := db.DB.QueryRow(`
		SELECT id, user1_id, user2_id, created_at
		FROM chats
		WHERE id = $1
	`, id).Scan(&chat.ID, &chat.User1ID, &chat.User2ID, &chat.CreatedAt)

	if err != nil {
		if err == sql.ErrNoRows {
			c.JSON(http.StatusNotFound, gin.H{"error": "Chat not found"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		}
		return
	}

	c.JSON(http.StatusOK, chat)
}

func GetUserChats(c *gin.Context) {
	userID := c.Param("userId")
	rows, err := db.DB.Query(`
		SELECT id, user1_id, user2_id, created_at
		FROM chats
		WHERE user1_id = $1 OR user2_id = $1
	`, userID)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch chats"})
		return
	}
	defer rows.Close()

	var chats []models.Chat
	for rows.Next() {
		var chat models.Chat
		err := rows.Scan(&chat.ID, &chat.User1ID, &chat.User2ID, &chat.CreatedAt)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to scan chat"})
			return
		}
		chats = append(chats, chat)
	}

	c.JSON(http.StatusOK, chats)
}

// Message handlers
func CreateMessage(c *gin.Context) {
	var message models.Message
	if err := c.ShouldBindJSON(&message); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	message.ID = uuid.New()
	message.Timestamp = time.Now()

	_, err := db.DB.Exec(`
		INSERT INTO messages (id, chat_id, sender_id, content, timestamp, is_read)
		VALUES ($1, $2, $3, $4, $5, $6)
	`, message.ID, message.ChatID, message.SenderID, message.Content, message.Timestamp, message.IsRead)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create message"})
		return
	}

	c.JSON(http.StatusOK, message)
}

func GetChatMessages(c *gin.Context) {
	chatID := c.Param("chatId")
	rows, err := db.DB.Query(`
		SELECT id, chat_id, sender_id, content, timestamp, is_read
		FROM messages
		WHERE chat_id = $1
		ORDER BY timestamp ASC
	`, chatID)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch messages"})
		return
	}
	defer rows.Close()

	var messages []models.Message
	for rows.Next() {
		var message models.Message
		err := rows.Scan(&message.ID, &message.ChatID, &message.SenderID, &message.Content, &message.Timestamp, &message.IsRead)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to scan message"})
			return
		}
		messages = append(messages, message)
	}

	c.JSON(http.StatusOK, messages)
}
