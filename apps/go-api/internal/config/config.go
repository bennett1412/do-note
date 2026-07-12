package config

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

type Config struct {
	Port        string
	DatabaseURL string
}

func Load() *Config {
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, reading from environment variables")
	}

	port := getEnv("PORT", "8080")
	dbUrl := getEnv("DATABASE_URL", "")

	if dbUrl == "" {
		log.Fatal("Database url not present")
	}

	return &Config{
		port,
		dbUrl,
	}
}

func getEnv(key, defaultValue string) string {
	if value, exists := os.LookupEnv(key); exists {
		return value
	}

	return defaultValue
}
