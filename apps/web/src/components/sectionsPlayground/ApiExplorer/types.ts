export type ApiId = 'dotnet' | 'nestjs' | 'go'

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

export type EndpointId =
	| 'listProducts'
	| 'getProduct'
	| 'createProduct'
	| 'updateProduct'
	| 'deleteProduct'
	| 'activateProduct'
	| 'deactivateProduct'
	| 'setProductStock'
	| 'increaseProductStock'
	| 'decreaseProductStock'
	| 'listOrders'
	| 'getOrder'
	| 'createOrder'
	| 'analyticsSummary'
	| 'analyticsSales'
	| 'analyticsTopProducts'
	| 'analyticsOrders'

export type EndpointGroup =
	| 'productsRead'
	| 'productsWrite'
	| 'inventory'
	| 'ordersRead'
	| 'ordersWrite'
	| 'analytics'

export type Entity = 'products' | 'inventory' | 'orders'

export type ParamKind = 'path' | 'query'

export type ParamOptionLabel =
	| 'defaultActive'
	| 'defaultName'
	| 'defaultAscending'
	| 'active'
	| 'inactive'
	| 'name'
	| 'sku'
	| 'price'
	| 'stockQuantity'
	| 'createdAt'
	| 'updatedAt'
	| 'ascending'
	| 'descending'
	| 'allStatuses'
	| 'pending'
	| 'confirmed'
	| 'rejected'
	| 'defaultCreatedAt'
	| 'defaultDescending'
	| 'total'
	| 'defaultDay'
	| 'day'
	| 'week'
	| 'month'

export type EndpointParam = {
	name: string
	kind: ParamKind
	defaultValue: string
	placeholder?: string
	options?: { value: string, label: ParamOptionLabel }[]
}

export type Endpoint = {
	id: EndpointId
	apiId: ApiId
	method: HttpMethod
	path: string
	group: EndpointGroup
	params: EndpointParam[]
	defaultBody?: string
}

export type ApiDefinition = {
	id: ApiId
	technology: string
	baseUrl?: string
	reads: Entity[]
	writes: Entity[]
	endpointIds: EndpointId[]
}

export type RequestInput = {
	pathParams: Record<string, string>
	queryParams: Record<string, string>
	body: string
}

export type ValidationIssue =
	| { code: 'missingPathParam', field: string }
	| { code: 'invalidJson' }

export type ApiResponse = {
	status: number
	statusText: string
	durationMs: number
	body: string
}

export type ExecutionState =
	| { status: 'idle' }
	| { status: 'running' }
	| { status: 'completed', response: ApiResponse }
	| { status: 'validationError', issues: ValidationIssue[] }
	| { status: 'networkError' }
