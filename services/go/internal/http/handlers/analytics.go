package handlers

import (
	"encoding/json"
	"net/http"

	"portfolio-analytics/internal/analytics"
)

type AnalyticsHandler struct {
	service *analytics.Service
}

func NewAnalyticsHandler(service *analytics.Service) *AnalyticsHandler {
	return &AnalyticsHandler{
		service: service,
	}
}

func (h *AnalyticsHandler) GetSummary(w http.ResponseWriter, r *http.Request) error {
	summary, err := h.service.GetSummary(
		r.Context(),
		r.URL.Query().Get("from"),
		r.URL.Query().Get("to"),
	)
	if err != nil {
		return err
	}

	w.Header().Set("Content-Type", "application/json")

	return json.NewEncoder(w).Encode(summary)
}

func (h *AnalyticsHandler) GetSales(w http.ResponseWriter, r *http.Request) error {
	sales, err := h.service.GetSales(
		r.Context(),
		r.URL.Query().Get("from"),
		r.URL.Query().Get("to"),
		r.URL.Query().Get("interval"),
	)
	if err != nil {
		return err
	}

	w.Header().Set("Content-Type", "application/json")

	return json.NewEncoder(w).Encode(sales)
}

func (h *AnalyticsHandler) GetTopProducts(w http.ResponseWriter, r *http.Request) error {
	products, err := h.service.GetTopProducts(
		r.Context(),
		r.URL.Query().Get("from"),
		r.URL.Query().Get("to"),
		r.URL.Query().Get("limit"),
	)
	if err != nil {
		return err
	}

	w.Header().Set("Content-Type", "application/json")

	return json.NewEncoder(w).Encode(products)
}

func (h *AnalyticsHandler) GetOrders(w http.ResponseWriter, r *http.Request) error {
	orders, err := h.service.GetOrders(
		r.Context(),
		r.URL.Query().Get("from"),
		r.URL.Query().Get("to"),
	)
	if err != nil {
		return err
	}

	w.Header().Set("Content-Type", "application/json")

	return json.NewEncoder(w).Encode(orders)
}
