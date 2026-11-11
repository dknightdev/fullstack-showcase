package analytics

import (
	"context"
	"fmt"
	"strconv"
	"time"
)

type Service struct {
	repository Repository
}

func NewService(repository Repository) *Service {
	return &Service{
		repository: repository,
	}
}

func (s *Service) GetSummary(ctx context.Context, fromValue string, toValue string) (*SummaryResponse, error) {
	var from *time.Time
	var to *time.Time

	var periodFrom *string
	var periodTo *string

	if fromValue != "" {
		parsedFrom, err := time.Parse("2006-01-02", fromValue)
		if err != nil {
			return nil, &ValidationError{
				Message: "El parámetro from debe tener el formato YYYY-MM-DD.",
			}
		}

		from = &parsedFrom
		periodFrom = &fromValue
	}

	if toValue != "" {
		parsedTo, err := time.Parse("2006-01-02", toValue)
		if err != nil {
			return nil, &ValidationError{
				Message: "El parámetro to debe tener el formato YYYY-MM-DD.",
			}
		}

		toExclusive := parsedTo.AddDate(0, 0, 1)
		to = &toExclusive
		periodTo = &toValue
	}

	today := time.Now().UTC().Truncate(24 * time.Hour)

	if from != nil && from.After(today) {
		return nil, &ValidationError{
			Message: "El parámetro from no puede ser una fecha futura.",
		}
	}

	if from != nil && periodTo == nil {
		tomorrow := today.AddDate(0, 0, 1)
		to = &tomorrow

		todayValue := today.Format("2006-01-02")
		periodTo = &todayValue
	}

	if from != nil && to != nil && !from.Before(*to) {
		return nil, &ValidationError{
			Message: "La fecha from debe ser anterior o igual a la fecha to.",
		}
	}

	summary, err := s.repository.GetSummary(ctx, from, to)
	if err != nil {
		return nil, fmt.Errorf("get summary: %w", err)
	}

	summary.Period = SummaryPeriod{
		From: periodFrom,
		To:   periodTo,
	}

	return summary, nil
}

func (s *Service) GetSales(ctx context.Context, fromValue string, toValue string, intervalValue string) (*SalesResponse, error) {
	interval := SalesInterval(intervalValue)

	if intervalValue == "" {
		interval = SalesIntervalDay
	}

	switch interval {
	case SalesIntervalDay, SalesIntervalWeek, SalesIntervalMonth:
	default:
		return nil, &ValidationError{
			Message: "El parámetro interval debe ser day, week o month.",
		}
	}

	today := time.Now().UTC().Truncate(24 * time.Hour)

	var from time.Time
	var to time.Time

	if fromValue != "" {
		parsedFrom, err := time.Parse("2006-01-02", fromValue)
		if err != nil {
			return nil, &ValidationError{
				Message: "El parámetro from debe tener el formato YYYY-MM-DD.",
			}
		}

		if parsedFrom.After(today) {
			return nil, &ValidationError{
				Message: "El parámetro from no puede ser una fecha futura.",
			}
		}

		from = parsedFrom
	}

	if toValue != "" {
		parsedTo, err := time.Parse("2006-01-02", toValue)
		if err != nil {
			return nil, &ValidationError{
				Message: "El parámetro to debe tener el formato YYYY-MM-DD.",
			}
		}

		to = parsedTo
	} else {
		to = today
	}

	if fromValue == "" {
		from = to.AddDate(0, 0, -29)
	}

	if from.After(to) {
		return nil, &ValidationError{
			Message: "La fecha from debe ser anterior o igual a la fecha to.",
		}
	}

	toExclusive := to.AddDate(0, 0, 1)

	sales, err := s.repository.GetSales(ctx, from, toExclusive, interval)
	if err != nil {
		return nil, fmt.Errorf("get sales: %w", err)
	}

	sales.Period = SalesPeriod{
		From:     from.Format("2006-01-02"),
		To:       to.Format("2006-01-02"),
		Interval: interval,
	}

	return sales, nil
}

func (s *Service) GetTopProducts(ctx context.Context, fromValue string, toValue string, limitValue string) (*TopProductsResponse, error) {
	const defaultLimit = 10
	const maxLimit = 100

	limit := defaultLimit

	if limitValue != "" {
		parsedLimit, err := strconv.Atoi(limitValue)
		if err != nil || parsedLimit < 1 || parsedLimit > maxLimit {
			return nil, &ValidationError{
				Message: "El parámetro limit debe ser un número entre 1 y 100.",
			}
		}

		limit = parsedLimit
	}

	today := time.Now().UTC().Truncate(24 * time.Hour)

	var from time.Time
	var to time.Time

	if fromValue != "" {
		parsedFrom, err := time.Parse("2006-01-02", fromValue)
		if err != nil {
			return nil, &ValidationError{
				Message: "El parámetro from debe tener el formato YYYY-MM-DD.",
			}
		}

		if parsedFrom.After(today) {
			return nil, &ValidationError{
				Message: "El parámetro from no puede ser una fecha futura.",
			}
		}

		from = parsedFrom
	}

	if toValue != "" {
		parsedTo, err := time.Parse("2006-01-02", toValue)
		if err != nil {
			return nil, &ValidationError{
				Message: "El parámetro to debe tener el formato YYYY-MM-DD.",
			}
		}

		to = parsedTo
	} else {
		to = today
	}

	if fromValue == "" {
		from = to.AddDate(0, 0, -29)
	}

	if from.After(to) {
		return nil, &ValidationError{
			Message: "La fecha from debe ser anterior o igual a la fecha to.",
		}
	}

	toExclusive := to.AddDate(0, 0, 1)

	products, err := s.repository.GetTopProducts(ctx, from, toExclusive, limit)
	if err != nil {
		return nil, fmt.Errorf("get top products: %w", err)
	}

	products.Period = TopProductsPeriod{
		From: from.Format("2006-01-02"),
		To:   to.Format("2006-01-02"),
	}

	return products, nil
}

func (s *Service) GetOrders(ctx context.Context, fromValue string, toValue string) (*OrdersResponse, error) {
	today := time.Now().UTC().Truncate(24 * time.Hour)

	var from time.Time
	var to time.Time

	if fromValue != "" {
		parsedFrom, err := time.Parse("2006-01-02", fromValue)
		if err != nil {
			return nil, &ValidationError{
				Message: "El parámetro from debe tener el formato YYYY-MM-DD.",
			}
		}

		if parsedFrom.After(today) {
			return nil, &ValidationError{
				Message: "El parámetro from no puede ser una fecha futura.",
			}
		}

		from = parsedFrom
	}

	if toValue != "" {
		parsedTo, err := time.Parse("2006-01-02", toValue)
		if err != nil {
			return nil, &ValidationError{
				Message: "El parámetro to debe tener el formato YYYY-MM-DD.",
			}
		}

		to = parsedTo
	} else {
		to = today
	}

	if fromValue == "" {
		from = to.AddDate(0, 0, -29)
	}

	if from.After(to) {
		return nil, &ValidationError{
			Message: "La fecha from debe ser anterior o igual a la fecha to.",
		}
	}

	toExclusive := to.AddDate(0, 0, 1)

	orders, err := s.repository.GetOrders(ctx, from, toExclusive)
	if err != nil {
		return nil, fmt.Errorf("get orders: %w", err)
	}

	orders.Period = OrdersPeriod{
		From: from.Format("2006-01-02"),
		To:   to.Format("2006-01-02"),
	}

	return orders, nil
}
