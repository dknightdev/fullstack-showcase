package middlewares

import (
	"encoding/json"
	"math"
	"net"
	"net/http"
	"strings"
	"sync"
	"time"

	"golang.org/x/time/rate"
)

type clientLimiter struct {
	limiter  *rate.Limiter
	lastSeen time.Time
}

type RateLimiter struct {
	mu          sync.Mutex
	clients     map[string]*clientLimiter
	rate        rate.Limit
	burst       int
	environment string
	lastCleanup time.Time
}

func NewRateLimiter(requestsPerSecond float64, burst int, environment string) *RateLimiter {
	return &RateLimiter{
		clients:     make(map[string]*clientLimiter),
		rate:        rate.Limit(requestsPerSecond),
		burst:       burst,
		environment: environment,
		lastCleanup: time.Now(),
	}
}

func (rl *RateLimiter) Middleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if !strings.HasPrefix(r.URL.Path, "/api/analytics/") {
			next.ServeHTTP(w, r)
			return
		}

		clientIP := rl.getClientIP(r)

		if clientIP == "" {
			writeRateLimitError(w, http.StatusInternalServerError, "Unable to identify client")
			return
		}

		now := time.Now()

		rl.mu.Lock()

		if now.Sub(rl.lastCleanup) >= time.Minute {
			for ip, client := range rl.clients {
				if now.Sub(client.lastSeen) > 3*time.Minute {
					delete(rl.clients, ip)
				}
			}

			rl.lastCleanup = now
		}

		client, exists := rl.clients[clientIP]

		if !exists {
			client = &clientLimiter{
				limiter: rate.NewLimiter(rl.rate, rl.burst),
			}

			rl.clients[clientIP] = client
		}

		client.lastSeen = now
		allowed := client.limiter.Allow()

		rl.mu.Unlock()

		if !allowed {
			w.Header().Set("Retry-After", "1")
			writeRateLimitError(w, http.StatusTooManyRequests, "Too many requests")
			return
		}

		next.ServeHTTP(w, r)
	})
}

func (rl *RateLimiter) getClientIP(r *http.Request) string {
	if rl.environment == "production" {
		if ip := net.ParseIP(strings.TrimSpace(r.Header.Get("CF-Connecting-IP"))); ip != nil {
			return ip.String()
		}
	}

	host, _, err := net.SplitHostPort(r.RemoteAddr)

	if err != nil {
		return ""
	}

	ip := net.ParseIP(host)

	if ip == nil {
		return ""
	}

	return ip.String()
}

func writeRateLimitError(w http.ResponseWriter, status int, detail string) {
	w.Header().Set("Content-Type", "application/problem+json")
	w.WriteHeader(status)

	response := struct {
		Type   string `json:"type"`
		Title  string `json:"title"`
		Status int    `json:"status"`
		Detail string `json:"detail"`
	}{
		Type:   "about:blank",
		Title:  http.StatusText(status),
		Status: status,
		Detail: detail,
	}

	_ = json.NewEncoder(w).Encode(response)
}

func (rl *RateLimiter) RetryAfter() int {
	return int(math.Ceil(1 / float64(rl.rate)))
}
