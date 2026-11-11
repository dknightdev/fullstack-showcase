package handlers

import (
	"net/http"

	"portfolio-analytics/docs"
)

func OpenAPISpec() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/yaml; charset=utf-8")
		w.Write(docs.OpenAPI)
	}
}
