import { useEffect, useMemo, useRef, useState, type MouseEvent } from 'react'
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
	title: string
	subtitle: string
	description: string
	details: string[]
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

const nodesData: ArchitectureNode[] = [
	{
		id: 'frontend',
		type: 'architecture',
		position: { x: 0, y: 0 },
		data: {
			label: 'Frontend\nReact',
			title: 'Frontend',
			technology: 'React',
			description: 'Aplicación web encargada de presentar la interfaz y consumir las funcionalidades expuestas por los servicios backend.',
			details: [
				'Consume directamente las tres APIs',
				'Cada servicio mantiene sus propios endpoints',
				'No requiere un backend intermediario'
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
			description: 'Servicio responsable de administrar el catálogo de productos y las operaciones relacionadas con el inventario.',
			details: [
				'Gestiona el dominio del catálogo',
				'Es responsable de las operaciones de escritura en catalog',
				'Expone endpoints para consultar productos y gestionar inventario'
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
			description: 'Servicio encargado de gestionar los pedidos y sus movimientos de inventario, coordinándose con Catalog API cuando necesita información u operaciones sobre productos.',
			details: [
				'Gestiona el dominio de pedidos',
				'Se comunica con Catalog API mediante HTTP',
				'Administra sus propios datos en el esquema orders'
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
			description: 'Servicio orientado a consultar información de los distintos dominios para generar reportes y métricas.',
			details: [
				'Consulta los esquemas catalog y orders',
				'Utiliza credenciales con permisos de solo lectura',
				'No modifica información administrada por los otros servicios'
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
			title: 'Base de datos',
			technology: 'PostgreSQL / Neon',
			description: 'Instancia PostgreSQL compartida que contiene esquemas independientes para los dominios de catálogo y pedidos.',
			details: [
				'Esquema catalog: propiedad de Catalog API',
				'Esquema orders: propiedad de Orders API',
				'Usuarios y permisos independientes para cada servicio',
				'Analytics dispone de acceso de solo lectura'
			]
		},
		className: 'databaseNode'
	}
]

const edges: ArchitectureEdge[] = [
	{
		id: 'frontend-catalog',
		source: 'frontend',
		sourceHandle: 'source-bottom',
		target: 'catalog',
		targetHandle: 'target-top',
		type: 'smoothstep',
		markerEnd: { type: MarkerType.ArrowClosed },
		data: {
			title: 'Frontend → Catalog API',
			protocol: 'HTTP / REST',
			description: 'El frontend consume directamente los endpoints de Catalog API para consultar el catálogo y las funcionalidades relacionadas con el inventario.',
			details: [
				'Comunicación directa entre frontend y API',
				'Consultas y operaciones mediante endpoints REST',
				'Catalog API administra su propio dominio'
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
			title: 'Frontend → Orders API',
			protocol: 'HTTP / REST',
			description: 'El frontend utiliza Orders API para acceder a las funcionalidades relacionadas con la gestión de pedidos.',
			details: [
				'Comunicación directa mediante HTTP',
				'Operaciones de consulta y gestión de pedidos',
				'Orders API mantiene su propia lógica de negocio'
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
			title: 'Frontend → Analytics API',
			protocol: 'HTTP / REST',
			description: 'El frontend consume Analytics API para consultar los reportes y métricas disponibles.',
			details: [
				'Consultas de información analítica',
				'Endpoints independientes',
				'La API realiza sus consultas utilizando acceso de solo lectura'
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
			title: 'Orders API → Catalog API',
			protocol: 'HTTP / REST',
			description: 'Orders API se comunica con Catalog API para consultar información de productos y solicitar operaciones relacionadas con el inventario. De esta manera, mantiene la independencia de los dominios sin acceder directamente a las tablas de Catalog.',
			details: [
				'Consulta información de productos',
				'Solicita operaciones de inventario mediante endpoints',
				'Catalog API conserva la responsabilidad sobre sus datos',
				'No existe escritura directa de Orders sobre el esquema catalog'
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
			title: 'Catalog API → PostgreSQL',
			protocol: 'Read / Write',
			description: 'Catalog API administra la información de productos e inventario en el esquema catalog de PostgreSQL.',
			details: [
				'Acceso de lectura y escritura al esquema catalog',
				'Utiliza credenciales propias',
				'Es el servicio responsable de modificar estos datos'
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
			title: 'Orders API → PostgreSQL',
			protocol: 'Read / Write',
			description: 'Orders API administra sus pedidos y movimientos de inventario dentro del esquema orders, manteniendo sus datos separados de los pertenecientes al catálogo.',
			details: [
				'Acceso de lectura y escritura al esquema orders',
				'Utiliza credenciales independientes',
				'No modifica directamente el esquema catalog'
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
			title: 'Analytics API → PostgreSQL',
			protocol: 'Read Only',
			description: 'Analytics API consulta directamente los esquemas catalog y orders para obtener información de distintos dominios y construir reportes y métricas.',
			details: [
				'Acceso de solo lectura a ambos esquemas',
				'Utiliza credenciales independientes',
				'No modifica datos de Catalog ni Orders',
				'Permite realizar consultas analíticas sobre información compartida'
			]
		}
	}
]

const initialSelection: Selection = {
	type: 'node',
	id: 'orders',
	title: 'Orders API',
	subtitle: 'HTTP / REST',
	description: edges.find(edge => edge.id === 'orders-database')!.data!.description,
	details: edges.find(edge => edge.id === 'orders-database')!.data!.details
}

const ServiceArchitecture = () => {
	const diagramRef = useRef<HTMLDivElement>(null)
	const [diagramWidth, setDiagramWidth] = useState(0)
	const [selection, setSelection] = useState<Selection>(initialSelection)

	const shouldReduceMotion = useReducedMotion()

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
			selected: selection.type === 'node' && selection.id === node.id,
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
			selected: selection.type === 'edge' && selection.id === edge.id
		}))
	}, [selection])

	const handleNodeClick = (_: MouseEvent, node: ArchitectureNode) => {
		setSelection({
			type: 'node',
			id: node.id,
			title: node.data.title,
			subtitle: node.data.technology,
			description: node.data.description,
			details: node.data.details
		})
	}

	const handleEdgeClick = (_: MouseEvent, edge: ArchitectureEdge) => {
		if (!edge.data) return

		setSelection({
			type: 'edge',
			id: edge.id,
			title: edge.data.title,
			subtitle: edge.data.protocol,
			description: edge.data.description,
			details: edge.data.details
		})
	}

	return (
		<Reveal direction='right'>
			<div className={styles.container}>
				<div className={styles.description}>
					<p>
						Explora los componentes y las conexiones del sistema para conocer
						sus responsabilidades y mecanismos de comunicación.
					</p>
				</div>

				<div
					className={`${styles.diagram} service-architecture-diagram ${selection.type === 'edge' ? 'has-selected-edge' : ''}`}
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
						Comunicación y operaciones
					</span>
					<span>
						<i className={styles.httpLine} />
						Comunicación HTTP entre servicios
					</span>
					<span>
						<i className={styles.dashedLine} />
						Acceso de solo lectura
					</span>
				</div>

				<div className={styles.details} aria-live='polite'>
					<motion.div
						key={`${selection.type}-${selection.title}`}
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
									{selection.type === 'edge' ? 'Conexión seleccionada' : 'Componente seleccionado'}
								</span>
								<h3>{selection.title}</h3>
							</div>

							<Chip size='small'>{selection.subtitle}</Chip>
						</div>

						<p className={styles.detailsDescription}>
							{selection.description}
						</p>

						<ul className={styles.detailsList}>
							{selection.details.map(detail => (
								<li key={detail}>{detail}</li>
							))}
						</ul>
					</motion.div>
				</div>
			</div>
		</Reveal>
	)
}

export default ServiceArchitecture
