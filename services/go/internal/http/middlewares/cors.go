package middlewares

import (
	"net/http"
	"strings"
)

func CORS(allowedOrigins []string) func(http.Handler) http.Handler {
	origins := make(map[string]struct{}, len(allowedOrigins))

	for _, origin := range allowedOrigins {
		origins[origin] = struct{}{}
	}

	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			origin := r.Header.Get("Origin")

			w.Header().Add("Vary", "Origin")

			_, allowed := origins[origin]

			if allowed {
				w.Header().Set("Access-Control-Allow-Origin", origin)
		}

			if r.Method == http.MethodOptions && origin != "" {
				if !allowed {
					http.Error(w, "Origin not allowed", http.StatusForbidden)
					return
				}

				requestedMethod := r.Header.Get("Access-Control-Request-Method")

				if requestedMethod != http.MethodGet {
					http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
					return
				}

				requestedHeaders := strings.Split(r.Header.Get("Access-Control-Request-Headers"), ",")
				allowedHeaders := map[string]struct{}{
					"content-type":  {},
					"authorization": {},
				}

				for _, header := range requestedHeaders {
					header = strings.ToLower(strings.TrimSpace(header))

					if header == "" {
						continue
					}

					if _, ok := allowedHeaders[header]; !ok {
						http.Error(w, "Header not allowed", http.StatusForbidden)
						return
					}
				}

				w.Header().Set("Access-Control-Allow-Methods", "GET, OPTIONS")
				w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
				w.Header().Set("Access-Control-Max-Age", "600")
				w.WriteHeader(http.StatusNoContent)
				return
			}

			next.ServeHTTP(w, r)
		})
	}
}
