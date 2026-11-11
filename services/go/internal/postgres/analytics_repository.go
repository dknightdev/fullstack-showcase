package postgres

import (
	"context"
	"fmt"
	"time"

	"portfolio-analytics/internal/analytics"

	"github.com/jackc/pgx/v5/pgxpool"
)

type AnalyticsRepository struct {
	pool *pgxpool.Pool
}

func NewAnalyticsRepository(pool *pgxpool.Pool) *AnalyticsRepository {
	return &AnalyticsRepository{
		pool: pool,
	}
}

func (r *AnalyticsRepository) GetSummary(ctx context.Context, from *time.Time, to *time.Time) (*analytics.SummaryResponse, error) {
	const query = `
		WITH sales AS (
			SELECT
				COALESCE(SUM(o.total), 0.00)::text AS total_revenue,
				COUNT(*) AS confirmed_orders
			FROM
				orders.orders o
			WHERE
				o.status = 'Confirmed'
				AND ($1::timestamptz IS NULL OR o.created_at >= $1)
				AND ($2::timestamptz IS NULL OR o.created_at < $2)
		),
		sales_units AS (
			SELECT
				COALESCE(SUM(oi.quantity), 0) AS units_sold
			FROM
				orders.order_items oi
				INNER JOIN orders.orders o ON o.id = oi.order_id
			WHERE
				o.status = 'Confirmed'
				AND ($1::timestamptz IS NULL OR o.created_at >= $1)
				AND ($2::timestamptz IS NULL OR o.created_at < $2)
		),
		catalog AS (
			SELECT
				COUNT(*) AS total_products,
				COUNT(*) FILTER (WHERE is_active = true) AS active_products,
				COUNT(*) FILTER (WHERE stock_quantity = 0) AS out_of_stock_products
			FROM catalog.products
		),
		order_distribution AS (
			SELECT
				COUNT(*) FILTER (WHERE status = 'Pending') AS pending,
				COUNT(*) FILTER (WHERE status = 'Confirmed') AS confirmed,
				COUNT(*) FILTER (WHERE status = 'Rejected') AS rejected,
				COUNT(*) AS total
			FROM orders.orders
		)
		SELECT
			s.total_revenue,
			s.confirmed_orders,
			u.units_sold,
			c.total_products,
			c.active_products,
			c.out_of_stock_products,
			d.pending,
			d.confirmed,
			d.rejected,
			d.total
		FROM
			sales s
			CROSS JOIN sales_units u
			CROSS JOIN catalog c
			CROSS JOIN order_distribution d
	`

	var summary analytics.SummaryResponse

	err := r.pool.QueryRow(ctx, query, from, to).Scan(
		&summary.Sales.TotalRevenue,
		&summary.Sales.ConfirmedOrders,
		&summary.Sales.UnitsSold,
		&summary.Catalog.TotalProducts,
		&summary.Catalog.ActiveProducts,
		&summary.Catalog.OutOfStockProducts,
		&summary.Orders.Pending,
		&summary.Orders.Confirmed,
		&summary.Orders.Rejected,
		&summary.Orders.Total,
	)

	if err != nil {
		return nil, fmt.Errorf("get analytics summary: %w", err)
	}

	return &summary, nil
}

func (r *AnalyticsRepository) GetSales(ctx context.Context, from time.Time, to time.Time, interval analytics.SalesInterval) (*analytics.SalesResponse, error) {
	const query = `
		WITH periods AS (
			SELECT generate_series(
				date_trunc($3, $1::timestamptz AT TIME ZONE 'UTC'),
				date_trunc($3, ($2::timestamptz - INTERVAL '1 microsecond') AT TIME ZONE 'UTC'),
				CASE $3
					WHEN 'day' THEN INTERVAL '1 day'
					WHEN 'week' THEN INTERVAL '1 week'
					WHEN 'month' THEN INTERVAL '1 month'
				END
			) AS period
		),
		sales_orders AS (
			SELECT
				date_trunc($3, o.created_at AT TIME ZONE 'UTC') AS period,
				COALESCE(SUM(o.total), 0.00)::text AS revenue,
				COUNT(*) AS confirmed_orders
			FROM
				orders.orders o
			WHERE
				o.status = 'Confirmed'
				AND o.created_at >= $1
				AND o.created_at < $2
			GROUP BY period
		),
		sales_units AS (
			SELECT
				date_trunc($3, o.created_at AT TIME ZONE 'UTC') AS period,
				COALESCE(SUM(oi.quantity), 0) AS units_sold
			FROM
				orders.orders o
				INNER JOIN orders.order_items oi ON oi.order_id = o.id
			WHERE
				o.status = 'Confirmed'
				AND o.created_at >= $1
				AND o.created_at < $2
			GROUP BY period
		)
		SELECT
			TO_CHAR(p.period, 'YYYY-MM-DD') AS date,
			COALESCE(so.revenue, '0.00') AS revenue,
			COALESCE(so.confirmed_orders, 0) AS confirmed_orders,
			COALESCE(su.units_sold, 0) AS units_sold
		FROM
			periods p
			LEFT JOIN sales_orders so ON so.period = p.period
			LEFT JOIN sales_units su ON su.period = p.period
		ORDER BY p.period
	`

	rows, err := r.pool.Query(ctx, query, from, to, string(interval))
	if err != nil {
		return nil, fmt.Errorf("query analytics sales: %w", err)
	}
	defer rows.Close()

	response := &analytics.SalesResponse{
		Data: make([]analytics.SalesDataPoint, 0),
	}

	for rows.Next() {
		var point analytics.SalesDataPoint

		if err := rows.Scan(
			&point.Date,
			&point.Revenue,
			&point.ConfirmedOrders,
			&point.UnitsSold,
		); err != nil {
			return nil, fmt.Errorf("scan analytics sales: %w", err)
		}

		response.Data = append(response.Data, point)
	}

	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("iterate analytics sales: %w", err)
	}

	return response, nil
}

func (r *AnalyticsRepository) GetTopProducts(ctx context.Context, from time.Time, to time.Time, limit int) (*analytics.TopProductsResponse, error) {
	const query = `
		SELECT
			oi.product_id,
			oi.name,
			oi.sku,
			SUM(oi.quantity) AS units_sold,
			COALESCE(SUM(oi.quantity * oi.unit_price), 0.00)::text AS revenue
		FROM
			orders.order_items oi
			INNER JOIN orders.orders o ON o.id = oi.order_id
		WHERE
			o.status = 'Confirmed'
			AND o.created_at >= $1
			AND o.created_at < $2
		GROUP BY
			oi.product_id,
			oi.name,
			oi.sku
		ORDER BY
			units_sold DESC,
			SUM(oi.quantity * oi.unit_price) DESC,
			oi.product_id ASC
		LIMIT $3
	`

	rows, err := r.pool.Query(ctx, query, from, to, limit)
	if err != nil {
		return nil, fmt.Errorf("query analytics top products: %w", err)
	}
	defer rows.Close()

	response := &analytics.TopProductsResponse{
		Data: make([]analytics.TopProduct, 0),
	}

	for rows.Next() {
		var product analytics.TopProduct

		if err := rows.Scan(
			&product.ProductID,
			&product.Name,
			&product.SKU,
			&product.UnitsSold,
			&product.Revenue,
		); err != nil {
			return nil, fmt.Errorf("scan analytics top products: %w", err)
		}

		response.Data = append(response.Data, product)
	}

	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("iterate analytics top products: %w", err)
	}

	return response, nil
}

func (r *AnalyticsRepository) GetOrders(ctx context.Context, from time.Time, to time.Time) (*analytics.OrdersResponse, error) {
	const query = `
		WITH statuses AS (
			SELECT *
			FROM (
				VALUES
					('Pending', 1),
					('Confirmed', 2),
					('Rejected', 3)
			) AS s(status, position)
		),
		order_counts AS (
			SELECT
				s.status,
				s.position,
				COUNT(o.id) AS order_count
			FROM
				statuses s
				LEFT JOIN orders.orders o ON
					o.status = s.status::orders."OrderStatus"
					AND o.created_at >= $1
					AND o.created_at < $2
			GROUP BY
				s.status,
				s.position
		)
		SELECT
			status,
			order_count,
			SUM(order_count) OVER () AS total,
			CASE
				WHEN SUM(order_count) OVER () = 0 THEN 0::float8
				ELSE ROUND(
					order_count * 100.0 / SUM(order_count) OVER (),
					2
				)::float8
			END AS percentage
		FROM
			order_counts
		ORDER BY position
	`

	rows, err := r.pool.Query(ctx, query, from, to)
	if err != nil {
		return nil, fmt.Errorf("query analytics orders: %w", err)
	}
	defer rows.Close()

	response := &analytics.OrdersResponse{
		Data: make([]analytics.OrderStatusData, 0),
	}

	for rows.Next() {
		var status analytics.OrderStatusData

		if err := rows.Scan(
			&status.Status,
			&status.Count,
			&response.Total,
			&status.Percentage,
		); err != nil {
			return nil, fmt.Errorf("scan analytics orders: %w", err)
		}

		response.Data = append(response.Data, status)
	}

	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("iterate analytics orders: %w", err)
	}

	return response, nil
}

var _ analytics.Repository = (*AnalyticsRepository)(nil)
