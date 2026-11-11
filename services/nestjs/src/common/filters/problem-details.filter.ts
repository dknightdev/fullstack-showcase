import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common'
import type { Request, Response } from 'express'
import { DomainValidationError } from '../errors/domain-validation.error'
import { InvalidOrderTransitionError } from '../../orders/errors/invalid-order-transition.error'

@Catch()
export class ProblemDetailsFilter implements ExceptionFilter {
	private readonly logger = new Logger(ProblemDetailsFilter.name)

	catch(error: unknown, host: ArgumentsHost): void {
		const context = host.switchToHttp()
		const response = context.getResponse<Response>()
		const request = context.getRequest<Request>()

		const isDomainValidation = error instanceof DomainValidationError
		const isInvalidTransition = error instanceof InvalidOrderTransitionError

		const status = isDomainValidation
			? HttpStatus.BAD_REQUEST
			: isInvalidTransition
				? HttpStatus.CONFLICT
				: error instanceof HttpException
					? error.getStatus()
					: HttpStatus.INTERNAL_SERVER_ERROR

		const body = error instanceof HttpException ? error.getResponse() : undefined

		if (!(error instanceof HttpException) && !isDomainValidation && !isInvalidTransition) {
			this.logger.error(
				`Error no controlado procesando ${request.method} ${request.path}`,
				error instanceof Error ? error.stack : String(error)
			)
		}

		const validationErrors = isDomainValidation
			? error.errors
			: this.getValidationErrors(body)

		const problem = {
			type: 'about:blank',
			title: this.getTitle(status),
			status,
			...(validationErrors
				? { errors: validationErrors }
				: { detail: this.getDetail(status, body, error) })
		}

		response
			.status(status)
			.type('application/problem+json')
			.json(problem)
	}

	private getTitle(status: number): string {
		switch (status) {
			case HttpStatus.BAD_REQUEST:
				return 'Solicitud inválida'
			case HttpStatus.NOT_FOUND:
				return 'Recurso no encontrado'
			case HttpStatus.CONFLICT:
				return 'Conflicto'
			case HttpStatus.BAD_GATEWAY:
				return 'Error de comunicación con un servicio externo'
			case HttpStatus.GATEWAY_TIMEOUT:
				return 'Tiempo de espera agotado'
			case HttpStatus.INTERNAL_SERVER_ERROR:
				return 'Error interno del servidor'
			default:
				return HttpStatus[status] ?? 'Error HTTP'
		}
	}

	private getDetail(status: number, body: unknown, error: unknown): string {
		if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
			return 'Ocurrió un error inesperado. Intente nuevamente más tarde.'
		}

		if (error instanceof InvalidOrderTransitionError) {
			return error.message
		}

		if (typeof body === 'string') return body

		if (typeof body === 'object' && body !== null && 'message' in body) {
			const message = body.message

			if (typeof message === 'string') return message
			if (Array.isArray(message)) return message.join('. ')
		}

		return 'La solicitud no pudo ser procesada.'
	}

	private getValidationErrors(body: unknown): Record<string, string[]> | undefined {
		if (typeof body !== 'object' || body === null) return undefined

		if ('errors' in body && typeof body.errors === 'object' && body.errors !== null && !Array.isArray(body.errors)) {
			const errors: Record<string, string[]> = {}

			for (const [field, messages] of Object.entries(body.errors)) {
				if (typeof messages === 'string') {
					errors[field] = [messages]
				} else if (Array.isArray(messages)) {
					errors[field] = messages.map(String)
				}
			}

			return Object.keys(errors).length > 0 ? errors : undefined
		}

		if ('message' in body && Array.isArray(body.message)) {
			return {
				general: body.message.map(String)
			}
		}

		return undefined
	}
}
