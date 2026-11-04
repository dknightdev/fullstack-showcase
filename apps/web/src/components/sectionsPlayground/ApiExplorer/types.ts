export type ApiId = 'dotnet' | 'nestjs' | 'laravel'

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

export type EndpointId =
	| 'listProducts'
	| 'getProduct'
	| 'createProduct'
	| 'updateProduct'
	| 'deleteProduct'
	| 'listOrders'
	| 'getOrder'
	| 'createOrder'
	| 'getOrderStatus'
	| 'salesReport'
	| 'inventoryReport'
	| 'ordersReport'

export type EndpointGroup =
	| 'productsRead'
	| 'productsWrite'
	| 'ordersRead'
	| 'ordersWrite'
	| 'reports'

export type Entity = 'products' | 'inventory' | 'orders'

export type ParamKind = 'path' | 'query'

export type EndpointParam = {
	name: string
	kind: ParamKind
	defaultValue: string
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
	baseUrl: string
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

export type SimulatedResponse = {
	status: number
	durationMs: number
	body: unknown
}

export type ExecutionState =
	| { status: 'idle' }
	| { status: 'running' }
	| { status: 'completed', response: SimulatedResponse }
	| { status: 'validationError', issues: ValidationIssue[] }
