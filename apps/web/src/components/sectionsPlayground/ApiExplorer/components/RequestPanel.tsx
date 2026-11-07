import { useState, type ChangeEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { TbPlayerPlay, TbRestore } from 'react-icons/tb'

import styles from './RequestPanel.module.css'
import AppIcon from '@/components/ui/AppIcon/AppIcon'
import Button from '@/components/ui/Button/Button'
import Input from '@/components/ui/Input/Input'
import Select from '@/components/ui/Select/Select'
import Textarea from '@/components/ui/Textarea/Textarea'
import MethodBadge from '../../../ui/MethodBadge/MethodBadge'
import type { Endpoint, RequestInput, ValidationIssue } from '../types'
import { buildUrl, getInitialInput, hasBody } from '../utils/request'

type RequestPanelProps = {
	baseUrl: string
	endpoint: Endpoint
	issues: ValidationIssue[]
	isRunning: boolean
	onExecute: (input: RequestInput) => void
}

const RequestPanel = ({ baseUrl, endpoint, issues, isRunning, onExecute }: RequestPanelProps) => {
	const { t } = useTranslation(undefined, { keyPrefix: 'playground.apiExplorer.request' })
	const [input, setInput] = useState<RequestInput>(() => getInitialInput(endpoint))

	const pathParams = endpoint.params.filter((param) => param.kind === 'path')
	const queryParams = endpoint.params.filter((param) => param.kind === 'query')
	const hasInvalidBody = issues.some((issue) => issue.code === 'invalidJson')
	const missingFields = issues.flatMap((issue) => issue.code === 'missingPathParam' ? [issue.field] : [])

	const handleParamChange = (kind: 'pathParams' | 'queryParams', name: string) =>
		(event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
			const value = event.target.value

			setInput((current) => ({
				...current,
				[kind]: { ...current[kind], [name]: value }
			}))
		}

	const handleBodyChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
		const body = event.target.value

		setInput((current) => ({ ...current, body }))
	}

	return (
		<form
			className={styles.panel}
			onSubmit={(event) => {
				event.preventDefault()
				onExecute(input)
			}}
		>
			<h4 className={styles.title}>{t('title')}</h4>

			<div className={styles.urlBar}>
				<MethodBadge method={endpoint.method} />

				<code className={styles.url} aria-label={t('url')}>
					{buildUrl(baseUrl, endpoint, input)}
				</code>

				<Button variant='primary' type='submit' disabled={isRunning}>
					<AppIcon icon={TbPlayerPlay} size={18} />
					{isRunning ? t('sending') : t('send')}
				</Button>
			</div>
			{endpoint.method !== 'GET' && <p className={styles.hint}>{t('realWriteWarning')}</p>}

			{pathParams.length > 0 && (
				<fieldset className={styles.fieldset}>
					<legend>{t('pathParams')}</legend>

					{pathParams.map((param) => (
						<label key={param.name} className={`${styles.field} ${pathParams.length === 1 ? styles.singleField : ''}`}>
							<span>{param.name}</span>
							<Input
								type='text'
								value={input.pathParams[param.name] ?? ''}
								aria-invalid={missingFields.includes(param.name)}
								onChange={handleParamChange('pathParams', param.name)}
								autoComplete='off'
								spellCheck={false}
							/>
						</label>
					))}
				</fieldset>
			)}

			{queryParams.length > 0 && (
				<fieldset className={styles.fieldset}>
					<legend>{t('queryParams')}</legend>

					{queryParams.map((param) => (
						<label
							key={param.name}
							className={`${styles.field} ${param.options ? styles.selectField : ''} ${queryParams.length === 1 && !param.options ? styles.singleField : ''}`}
						>
							<span>{param.name}</span>
							{param.options ? (
								<Select
									value={input.queryParams[param.name] ?? ''}
									onChange={handleParamChange('queryParams', param.name)}
								>
									{param.options.map((option) => (
										<option key={option.label} value={option.value}>
											{t(`options.${option.label}`)}
										</option>
									))}
								</Select>
							) : (
								<Input
									type='text'
									value={input.queryParams[param.name] ?? ''}
									onChange={handleParamChange('queryParams', param.name)}
									autoComplete='off'
									spellCheck={false}
								/>
							)}
						</label>
					))}

					<p className={styles.hint}>{t('queryHint')}</p>
				</fieldset>
			)}

			{hasBody(endpoint) && (
				<label className={styles.bodyField}>
					<span>{t('body')}</span>
					<Textarea
						value={input.body}
						rows={Math.min(Math.max(input.body.split('\n').length, 6), 14)}
						aria-invalid={hasInvalidBody}
						onChange={handleBodyChange}
						spellCheck={false}
					/>
				</label>
			)}

			<Button
				variant='tertiary'
				className={styles.reset}
				onClick={() => setInput(getInitialInput(endpoint))}
			>
				{t('reset')}
				<AppIcon icon={TbRestore} size={18} />
			</Button>
		</form>
	)
}

export default RequestPanel
