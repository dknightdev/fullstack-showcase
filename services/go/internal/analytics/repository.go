package analytics

import (
	"context"
	"time"
)

type Repository interface {
	GetSummary(ctx context.Context, from *time.Time, to *time.Time) (*SummaryResponse, error)
	GetSales(ctx context.Context, from time.Time, to time.Time, interval SalesInterval) (*SalesResponse, error)
	GetTopProducts(ctx context.Context, from time.Time, to time.Time, limit int) (*TopProductsResponse, error)
	GetOrders(ctx context.Context, from time.Time, to time.Time) (*OrdersResponse, error)
}
