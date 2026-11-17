import { useEffect, useMemo, useRef, useState, type MouseEvent } from 'react'
import { useTranslation } from 'react-i18next'
import {
	Background,
	Controls,
	Handle,
	MarkerType,
	Position,
	ReactFlow,
	type Edge,
	type Node,
	type NodeProps
} from '@xyflow/react'
import styles from './ServiceArchitecture.module.css'
import './ServiceArchitecture.css'

import Reveal from '@/components/ui/Reveal/Reveal'

import { motion, useReducedMotion } from 'motion/react'
import { motionConfig } from '@/config/motion'
import Chip from '@/components/ui/Chip/Chip'

type ArchitectureNodeData = {
	label: string
	title: string
	technology: string
	description: string
	details: string[]
}

type ArchitectureEdgeData = {
	title: string
	protocol: string
	description: string
	details: string[]
}

type ArchitectureNode = Node<ArchitectureNodeData, 'architecture'>
type ArchitectureEdge = Edge<ArchitectureEdgeData>

type Selection = {
	type: 'node' | 'edge'
	id: string
}

const nodeWidth = 190

const ArchitectureNodeComponent = ({ data, selected }: NodeProps<ArchitectureNode>) => {
	return (
		<div className={`service-architecture-node ${selected ? 'is-selected' : ''}`}>
			<Handle type='target' position={Position.Top} id='target-top' />
			<Handle type='source' position={Position.Bottom} id='source-bottom' />
			<Handle type='source' position={Position.Left} id='source-left' />
			<Handle type='target' position={Position.Right} id='target-right' />

			{data.label.split('\n').map((line, index) => (
				<div key={index}>{line}</div>
			))}
		</div>
	)
}

const nodeTypes = {
	architecture: ArchitectureNodeComponent
}

const ServiceArchitecture = () => {
	const { t } = useTranslation()
	const diagramRef = useRef<HTMLDivElement>(null)
	const [diagramWidth, setDiagramWidth] = useState(0)
	const [selection, setSelection] = useState<Selection>({
		type: 'node',
		id: 'orders'
	})

	const shouldReduceMotion = useReducedMotion()

	const nodesData = useMemo<ArchitectureNode[]>(() => [
		{
			id: 'frontend',
			type: 'architecture',
			position: { x: 0, y: 0 },
			data: {
				label: 'Frontend\nReact',
				title: 'Frontend',
				technology: 'React',
				description: t('playground.architecture.serviceArchitecture.nodes.frontend.description'),
				details: [
					t('playground.architecture.serviceArchitecture.nodes.frontend.details.0'),
					t('playground.architecture.serviceArchitecture.nodes.frontend.details.1'),
					t('playground.architecture.serviceArchitecture.nodes.frontend.details.2')
				]
			},
			className: 'frontendNode'
		},
		{
			id: 'catalog',
			type: 'architecture',
			position: { x: 0, y: 200 },
			data: {
				label: 'Catalog API\nASP.NET Core',
				title: 'Catalog API',
				technology: 'C# / ASP.NET Core 10',
				description: t('playground.architecture.serviceArchitecture.nodes.catalog.description'),
				details: [
					t('playground.architecture.serviceArchitecture.nodes.catalog.details.0'),
					t('playground.architecture.serviceArchitecture.nodes.catalog.details.1'),
					t('playground.architecture.serviceArchitecture.nodes.catalog.details.2')
				]
			},
			className: 'catalogNode'
		},
		{
			id: 'orders',
			type: 'architecture',
			position: { x: 0, y: 200 },
			data: {
				label: 'Orders API\nNestJS',
				title: 'Orders API',
				technology: 'TypeScript / NestJS',
				description: t('playground.architecture.serviceArchitecture.nodes.orders.description'),
				details: [
					t('playground.architecture.serviceArchitecture.nodes.orders.details.0'),
					t('playground.architecture.serviceArchitecture.nodes.orders.details.1'),
					t('playground.architecture.serviceArchitecture.nodes.orders.details.2')
				]
			},
			className: 'ordersNode'
		},
		{
			id: 'analytics',
			type: 'architecture',
			position: { x: 0, y: 200 },
			data: {
				label: 'Analytics API\nGo',
				title: 'Analytics API',
				technology: 'Go',
				description: t('playground.architecture.serviceArchitecture.nodes.analytics.description'),
				details: [
					t('playground.architecture.serviceArchitecture.nodes.analytics.details.0'),
					t('playground.architecture.serviceArchitecture.nodes.analytics.details.1'),
					t('playground.architecture.serviceArchitecture.nodes.analytics.details.2')
				]
			},
			className: 'analyticsNode'
		},
		{
			id: 'database',
			type: 'architecture',
			position: { x: 0, y: 400 },
			data: {
				label: 'PostgreSQL\nNeon',
				title: t('playground.architecture.serviceArchitecture.nodes.database.title'),
				technology: 'PostgreSQL / Neon',
				description: t('playground.architecture.serviceArchitecture.nodes.database.description'),
				details: [
					t('playground.architecture.serviceArchitecture.nodes.database.details.0'),
					t('playground.architecture.serviceArchitecture.nodes.database.details.1'),
					t('playground.architecture.serviceArchitecture.nodes.database.details.2'),
					t('playground.architecture.serviceArchitecture.nodes.database.details.3')
				]
			},
			className: 'databaseNode'
		}
	], [t])

	const edges = useMemo<ArchitectureEdge[]>(() => [
		{
			id: 'frontend-catalog',
			source: 'frontend',
			sourceHandle: 'source-bottom',
			target: 'catalog',
			targetHandle: 'target-top',
			type: 'smoothstep',
			markerEnd: { type: MarkerType.ArrowClosed },
			data: {
				title: t('playground.architecture.serviceArchitecture.edges.frontendCatalog.title'),
				protocol: 'HTTP / REST',
				description: t('playground.architecture.serviceArchitecture.edges.frontendCatalog.description'),
				details: [
					t('playground.architecture.serviceArchitecture.edges.frontendCatalog.details.0'),
					t('playground.architecture.serviceArchitecture.edges.frontendCatalog.details.1'),
					t('playground.architecture.serviceArchitecture.edges.frontendCatalog.details.2')
				]
			}
		},
		{
			id: 'frontend-orders',
			source: 'frontend',
			sourceHandle: 'source-bottom',
			target: 'orders',
			targetHandle: 'target-top',
			type: 'smoothstep',
			markerEnd: { type: MarkerType.ArrowClosed },
			data: {
				title: t('playground.architecture.serviceArchitecture.edges.frontendOrders.title'),
				protocol: 'HTTP / REST',
				description: t('playground.architecture.serviceArchitecture.edges.frontendOrders.description'),
				details: [
					t('playground.architecture.serviceArchitecture.edges.frontendOrders.details.0'),
					t('playground.architecture.serviceArchitecture.edges.frontendOrders.details.1'),
					t('playground.architecture.serviceArchitecture.edges.frontendOrders.details.2')
				]
			}
		},
		{
			id: 'frontend-analytics',
			source: 'frontend',
			sourceHandle: 'source-bottom',
			target: 'analytics',
			targetHandle: 'target-top',
			type: 'smoothstep',
			markerEnd: { type: MarkerType.ArrowClosed },
			data: {
				title: t('playground.architecture.serviceArchitecture.edges.frontendAnalytics.title'),
				protocol: 'HTTP / REST',
				description: t('playground.architecture.serviceArchitecture.edges.frontendAnalytics.description'),
				details: [
					t('playground.architecture.serviceArchitecture.edges.frontendAnalytics.details.0'),
					t('playground.architecture.serviceArchitecture.edges.frontendAnalytics.details.1'),
					t('playground.architecture.serviceArchitecture.edges.frontendAnalytics.details.2')
				]
			}
		},
		{
			id: 'orders-catalog',
			source: 'orders',
			sourceHandle: 'source-left',
			target: 'catalog',
			targetHandle: 'target-right',
			type: 'straight',
			label: 'HTTP',
			className: 'httpEdge',
			markerEnd: { type: MarkerType.ArrowClosed },
			data: {
				title: t('playground.architecture.serviceArchitecture.edges.ordersCatalog.title'),
				protocol: 'HTTP / REST',
				description: t('playground.architecture.serviceArchitecture.edges.ordersCatalog.description'),
				details: [
					t('playground.architecture.serviceArchitecture.edges.ordersCatalog.details.0'),
					t('playground.architecture.serviceArchitecture.edges.ordersCatalog.details.1'),
					t('playground.architecture.serviceArchitecture.edges.ordersCatalog.details.2'),
					t('playground.architecture.serviceArchitecture.edges.ordersCatalog.details.3')
				]
			}
		},
		{
			id: 'catalog-database',
			source: 'catalog',
			sourceHandle: 'source-bottom',
			target: 'database',
			targetHandle: 'target-top',
			type: 'smoothstep',
			label: 'Read / Write',
			markerEnd: { type: MarkerType.ArrowClosed },
			data: {
				title: t('playground.architecture.serviceArchitecture.edges.catalogDatabase.title'),
				protocol: 'Read / Write',
				description: t('playground.architecture.serviceArchitecture.edges.catalogDatabase.description'),
				details: [
					t('playground.architecture.serviceArchitecture.edges.catalogDatabase.details.0'),
					t('playground.architecture.serviceArchitecture.edges.catalogDatabase.details.1'),
					t('playground.architecture.serviceArchitecture.edges.catalogDatabase.details.2')
				]
			}
		},
		{
			id: 'orders-database',
			source: 'orders',
			sourceHandle: 'source-bottom',
			target: 'database',
			targetHandle: 'target-top',
			type: 'smoothstep',
			label: 'Read / Write',
			markerEnd: { type: MarkerType.ArrowClosed },
			data: {
				title: t('playground.architecture.serviceArchitecture.edges.ordersDatabase.title'),
				protocol: 'Read / Write',
				description: t('playground.architecture.serviceArchitecture.edges.ordersDatabase.description'),
				details: [
					t('playground.architecture.serviceArchitecture.edges.ordersDatabase.details.0'),
					t('playground.architecture.serviceArchitecture.edges.ordersDatabase.details.1'),
					t('playground.architecture.serviceArchitecture.edges.ordersDatabase.details.2')
				]
			}
		},
		{
			id: 'analytics-database',
			source: 'analytics',
			sourceHandle: 'source-bottom',
			target: 'database',
			targetHandle: 'target-top',
			type: 'smoothstep',
			label: 'Read Only',
			className: 'readOnlyEdge',
			markerEnd: { type: MarkerType.ArrowClosed },
			style: { strokeDasharray: '5 5' },
			data: {
				title: t('playground.architecture.serviceArchitecture.edges.analyticsDatabase.title'),
				protocol: 'Read Only',
				description: t('playground.architecture.serviceArchitecture.edges.analyticsDatabase.description'),
				details: [
					t('playground.architecture.serviceArchitecture.edges.analyticsDatabase.details.0'),
					t('playground.architecture.serviceArchitecture.edges.analyticsDatabase.details.1'),
					t('playground.architecture.serviceArchitecture.edges.analyticsDatabase.details.2'),
					t('playground.architecture.serviceArchitecture.edges.analyticsDatabase.details.3')
				]
			}
		}
	], [t])

	const selectedItem = useMemo<Selection & {
		title: string
		subtitle: string
		description: string
		details: string[]
	} | null>(() => {
		if (selection.type === 'node') {
			const node = nodesData.find(node => node.id === selection.id)

			if (!node) return null

			return {
				type: 'node',
				id: node.id,
				title: node.data.title,
				subtitle: node.data.technology,
				description: node.data.description,
				details: node.data.details
			}
		}

		const edge = edges.find(edge => edge.id === selection.id)

		if (!edge?.data) return null

		return {
			type: 'edge',
			id: edge.id,
			title: edge.data.title,
			subtitle: edge.data.protocol,
			description: edge.data.description,
			details: edge.data.details
		}
	}, [selection, nodesData, edges])

	useEffect(() => {
		const element = diagramRef.current

		if (!element) return

		const observer = new ResizeObserver(entries => {
			setDiagramWidth(entries[0].contentRect.width)
		})

		observer.observe(element)

		return () => observer.disconnect()
	}, [])

	const nodes = useMemo<ArchitectureNode[]>(() => {
		const gap = Math.max(24, Math.min(180, (diagramWidth - nodeWidth * 3) / 2))
		const totalWidth = nodeWidth * 3 + gap * 2
		const startX = Math.max(0, (diagramWidth - totalWidth) / 2)

		const catalogX = startX
		const ordersX = startX + nodeWidth + gap
		const analyticsX = startX + (nodeWidth + gap) * 2

		return nodesData.map(node => ({
			...node,
			selected: selection ? selection.type === 'node' && selection.id === node.id : false,
			position: {
				...node.position,
				x: node.id === 'frontend' || node.id === 'orders' || node.id === 'database'
					? ordersX
					: node.id === 'catalog'
						? catalogX
						: analyticsX
			}
		}))
	}, [diagramWidth, selection])

	const selectedEdges = useMemo<ArchitectureEdge[]>(() => {
		return edges.map(edge => ({
			...edge,
			selected: selection ? selection.type === 'edge' && selection.id === edge.id : false
		}))
	}, [selection, edges])

	const handleNodeClick = (_: MouseEvent, node: ArchitectureNode) => {
		setSelection({
			type: 'node',
			id: node.id
		})
	}

	const handleEdgeClick = (_: MouseEvent, edge: ArchitectureEdge) => {
		setSelection({
			type: 'edge',
			id: edge.id
		})
	}

	return (
		<Reveal direction='right'>
			<div className={styles.container}>
				<div className={styles.description}>
					<p>
						{t('playground.architecture.serviceArchitecture.description')}
					</p>
				</div>

				<div
					className={`${styles.diagram} service-architecture-diagram ${selection && selection.type === 'edge' ? 'has-selected-edge' : ''}`}
					ref={diagramRef}
				>
					{diagramWidth > 0 && (
						<ReactFlow
							nodes={nodes}
							edges={selectedEdges}
							nodeTypes={nodeTypes}
							fitView
							fitViewOptions={{ padding: 0.2 }}
							nodesDraggable={false}
							nodesConnectable={false}
							elementsSelectable={true}
							onNodeClick={handleNodeClick}
							onEdgeClick={handleEdgeClick}
						>
							<Background />
							<Controls showInteractive={false} />
						</ReactFlow>
					)}
				</div>

				<div className={styles.legend}>
					<span>
						<i className={styles.defaultLine} />
						{t('playground.architecture.serviceArchitecture.legend.default')}
					</span>
					<span>
						<i className={styles.httpLine} />
						{t('playground.architecture.serviceArchitecture.legend.http')}
					</span>
					<span>
						<i className={styles.dashedLine} />
						{t('playground.architecture.serviceArchitecture.legend.readOnly')}
					</span>
				</div>

				<div className={styles.details} aria-live='polite'>
					{selectedItem && (
						<motion.div
							key={`${selectedItem.type}-${selectedItem.id}`}
							initial={shouldReduceMotion ? false : { opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{
								duration: motionConfig.duration.reveal,
								ease: motionConfig.ease
							}}
							className={styles.detailsContent}
						>
							<div className={styles.detailsHeader}>
								<div>
									<span className={styles.detailsEyebrow}>
										{selectedItem.type === 'edge'
											? t('playground.architecture.serviceArchitecture.selectedConnection')
											: t('playground.architecture.serviceArchitecture.selectedComponent')}
									</span>
									<h3>{selectedItem.title}</h3>
								</div>

								<Chip size='small'>{selectedItem.subtitle}</Chip>
							</div>

							<p className={styles.detailsDescription}>
								{selectedItem.description}
							</p>

							<ul className={styles.detailsList}>
								{selectedItem.details.map((detail, index) => (
									<li key={index}>{detail}</li>
								))}
							</ul>
						</motion.div>
					)}
				</div>
			</div>
		</Reveal>
	)
}

export default ServiceArchitecture
