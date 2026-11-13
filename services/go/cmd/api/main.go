package main

import (
	"context"
	"log"
	"log/slog"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	_ "github.com/joho/godotenv/autoload"
	"github.com/swaggest/swgui/v5emb"

	"portfolio-analytics/internal/analytics"
	"portfolio-analytics/internal/config"
	apihttp "portfolio-analytics/internal/http"
	"portfolio-analytics/internal/http/handlers"
	"portfolio-analytics/internal/http/middlewares"
	"portfolio-analytics/internal/postgres"
)

func main() {
	cfg, err := config.Load()
	if err != nil {
		log.Fatal(err)
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)

	pool, err := postgres.NewPool(ctx, cfg.DatabaseURL)

	cancel()

	if err != nil {
		log.Fatal(err)
	}

	defer pool.Close()

	analyticsRepository := postgres.NewAnalyticsRepository(pool)
	analyticsService := analytics.NewService(analyticsRepository)
	analyticsHandler := handlers.NewAnalyticsHandler(analyticsService)

	mux := http.NewServeMux()

	mux.HandleFunc("GET /health", handlers.Health())
	mux.HandleFunc("GET /health/ready", handlers.Readiness(pool))

	mux.HandleFunc("GET /openapi.yaml", handlers.OpenAPISpec())
	mux.Handle("GET /swagger/", v5emb.New(
		"Portfolio Analytics API",
		"/openapi.yaml",
		"/swagger/",
	))

	mux.Handle("GET /api/analytics/summary", apihttp.Adapt(analyticsHandler.GetSummary))
	mux.Handle("GET /api/analytics/sales", apihttp.Adapt(analyticsHandler.GetSales))
	mux.Handle("GET /api/analytics/top-products", apihttp.Adapt(analyticsHandler.GetTopProducts))
	mux.Handle("GET /api/analytics/orders", apihttp.Adapt(analyticsHandler.GetOrders))


	var allowedOrigins []string

	switch cfg.Environment {
		case "development":
			allowedOrigins = []string{
				"http://localhost:5173",
			}
		case "production":
			allowedOrigins = []string{
				"https://dubancaballero.dev",
				"https://www.dubancaballero.dev",
			}
	}

	rateLimiter := middlewares.NewRateLimiter(1, 60, cfg.Environment)

	handler := middlewares.CORS(allowedOrigins)(
		rateLimiter.Middleware(mux),
	)

	server := &http.Server{
		Addr:              ":" + cfg.Port,
		Handler:           handler,
		ReadHeaderTimeout: 5 * time.Second,
		MaxHeaderBytes:    1 << 20,
	}

	ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
	defer stop()

	serverErrors := make(chan error, 1)

	go func() {
		slog.Info("Analytics API started", "port", cfg.Port)
		serverErrors <- server.ListenAndServe()
	}()

	select {
	case err := <-serverErrors:
		if err != nil && err != http.ErrServerClosed {
			slog.Error("HTTP server failed", "error", err)
			os.Exit(1)
		}
	case <-ctx.Done():
		slog.Info("Shutdown signal received")
	}

	shutdownCtx, cancelShutdown := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancelShutdown()

	if err := server.Shutdown(shutdownCtx); err != nil {
		slog.Error("Graceful shutdown failed", "error", err)

		if err := server.Close(); err != nil {
			slog.Error("Forced server close failed", "error", err)
		}
	}

	slog.Info("Analytics API stopped")
}
