package analytics

//* GetSummary
type SummaryPeriod struct {
	From *string `json:"from"`
	To   *string `json:"to"`
}

type SalesSummary struct {
	TotalRevenue    string `json:"totalRevenue"`
	ConfirmedOrders int64  `json:"confirmedOrders"`
	UnitsSold       int64  `json:"unitsSold"`
}

type CatalogSummary struct {
	TotalProducts      int64 `json:"totalProducts"`
	ActiveProducts     int64 `json:"activeProducts"`
	OutOfStockProducts int64 `json:"outOfStockProducts"`
}

type OrdersSummary struct {
	Pending   int64 `json:"pending"`
	Confirmed int64 `json:"confirmed"`
	Rejected  int64 `json:"rejected"`
	Total     int64 `json:"total"`
}

type SummaryResponse struct {
	Period  SummaryPeriod  `json:"period"`
	Sales   SalesSummary   `json:"sales"`
	Catalog CatalogSummary `json:"catalog"`
	Orders  OrdersSummary  `json:"orders"`
}

//* GetSales
type SalesInterval string

const (
	SalesIntervalDay   SalesInterval = "day"
	SalesIntervalWeek  SalesInterval = "week"
	SalesIntervalMonth SalesInterval = "month"
)

type SalesPeriod struct {
	From     string        `json:"from"`
	To       string        `json:"to"`
	Interval SalesInterval `json:"interval"`
}

type SalesDataPoint struct {
	Date            string `json:"date"`
	Revenue         string `json:"revenue"`
	ConfirmedOrders int64  `json:"confirmedOrders"`
	UnitsSold       int64  `json:"unitsSold"`
}

type SalesResponse struct {
	Period SalesPeriod      `json:"period"`
	Data   []SalesDataPoint `json:"data"`
}

//* GetTopProducts
type TopProductsPeriod struct {
	From string `json:"from"`
	To   string `json:"to"`
}

type TopProduct struct {
	ProductID int64  `json:"productId"`
	Name      string `json:"name"`
	SKU       string `json:"sku"`
	UnitsSold int64  `json:"unitsSold"`
	Revenue   string `json:"revenue"`
}

type TopProductsResponse struct {
	Period TopProductsPeriod `json:"period"`
	Data   []TopProduct      `json:"data"`
}

/* GetOrders */
type OrdersPeriod struct {
	From string `json:"from"`
	To   string `json:"to"`
}

type OrderStatusData struct {
	Status     string  `json:"status"`
	Count      int64   `json:"count"`
	Percentage float64 `json:"percentage"`
}

type OrdersResponse struct {
	Period OrdersPeriod      `json:"period"`
	Total  int64             `json:"total"`
	Data   []OrderStatusData `json:"data"`
}
