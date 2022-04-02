package config

import (
	"fmt"
	"log"
	"os"

	"github.com/joho/godotenv"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"

	"gin_gorm_jwt/modal"
)

//this function is used to setup connection to database
func SetupDBConnection() *gorm.DB {

	errEnv := godotenv.Load()
	if errEnv != nil {
		panic("Failed to load .env")
	}

	dbUser := os.Getenv("DB_USER_NAME")
	dbPass := os.Getenv("DB_PASS")
	dbName := os.Getenv("DB_NAME")
	dbHost := os.Getenv("DB_HOST")

	//connection string
	dsn := fmt.Sprintf("%s:%s@tcp(%s)/%s?charset=utf8mb4&parseTime=True&loc=Local", dbUser, dbPass, dbHost, dbName)
	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})

	if err != nil {
		panic("Failed to connect to database")
	}
	log.Println("Successfully connected to database...!!!")

	//migrating defined modals to DB table
	db.AutoMigrate(&modal.Book{}, &modal.Auther{})
	return db

}

//this function is used to close connection to database
func CloseDBConnection(db *gorm.DB) {
	dbMySql, err := db.DB()
	if err != nil {
		panic("Failed to close connection.")
	}

	dbMySql.Close()
}
