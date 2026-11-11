import 'dotenv/config'
import 'reflect-metadata'

import { BadRequestException, ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import type { ValidationError } from 'class-validator'

import { AppModule } from './app.module'
import { ProblemDetailsFilter } from './common/filters/problem-details.filter'


function flattenValidationErrors(validationErrors: ValidationError[], parent = ''): Record<string, string[]> {
	const errors: Record<string, string[]> = {}

	for (const validationError of validationErrors) {
		const field = parent
			? `${parent}.${validationError.property}`
			: validationError.property

		if (validationError.constraints) {
			errors[field] = Object.values(validationError.constraints)
		}

		if (validationError.children?.length) {
			const nestedErrors = flattenValidationErrors(validationError.children, field)

			for (const [key, messages] of Object.entries(nestedErrors)) {
				errors[key] = [...(errors[key] ?? []), ...messages]
			}
		}
	}

	return errors
}


async function bootstrap() {
	if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is required')

	const port = Number(process.env.PORT ?? '3001')
	if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('PORT must be between 1 and 65535')

	const app = await NestFactory.create(AppModule)

	app.useGlobalPipes(new ValidationPipe({
		transform: true,
		whitelist: true,
		forbidNonWhitelisted: true,
		exceptionFactory: errors => new BadRequestException({
			errors: flattenValidationErrors(errors)
		})
	}))
	app.useGlobalFilters(new ProblemDetailsFilter())
	app.enableShutdownHooks()

	const config = new DocumentBuilder()
		.setTitle('Portfolio Orders API')
		.setDescription('Pedidos e integración con el catálogo')
		.setVersion('1.0')
		.build()

	const document = SwaggerModule.createDocument(app, config)

	SwaggerModule.setup('swagger', app, document, {
		customSiteTitle: 'Portfolio Orders API'
	})

	await app.listen(port)
}

void bootstrap()
