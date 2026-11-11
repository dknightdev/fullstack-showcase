package http

import (
	"context"
	"errors"
	"log/slog"
	"net/http"

	"portfolio-analytics/internal/analytics"
)

type HandlerFunc func(w http.ResponseWriter, r *http.Request) error

func Adapt(handler HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		err := handler(w, r)
		if err == nil {
			return
		}

		if r.Context().Err() != nil && errors.Is(err, context.Canceled) {
			return
		}

		var validationError *analytics.ValidationError

		if errors.As(err, &validationError) {
			WriteProblem(
				w,
				http.StatusBadRequest,
				"Solicitud inválida",
				validationError.Error(),
			)
			return
		}

		slog.Error(
			"Error no controlado procesando HTTP request",
			"method", r.Method,
			"path", r.URL.Path,
			"error", err,
		)

		WriteProblem(
			w,
			http.StatusInternalServerError,
			"Error interno del servidor",
			"Ocurrió un error inesperado. Intente nuevamente más tarde.",
		)
	}
}
