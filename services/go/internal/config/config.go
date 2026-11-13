package config

import (
	"fmt"
	"os"
	"strconv"
)

type Config struct {
	Port        string
	DatabaseURL string
	Environment string
}

func Load() (*Config, error) {
	port := os.Getenv("PORT")

	if port == "" {
		port = "8080"
	}

	portNumber, err := strconv.Atoi(port)
	if err != nil || portNumber < 1 || portNumber > 65535 {
		return nil, fmt.Errorf("invalid PORT value: %q", port)
	}

	environment := os.Getenv("APP_ENV")

	if environment == "" {
		environment = "development"
	}

	if environment != "development" && environment != "production" {
		return nil, fmt.Errorf("invalid APP_ENV value: %q", environment)
	}

	return &Config{
		Port:        port,
		DatabaseURL: os.Getenv("DATABASE_URL"),
		Environment: environment,
	}, nil
}
