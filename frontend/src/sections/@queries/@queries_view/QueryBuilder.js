import React, { useCallback } from "react"
import ReactFlow, { MiniMap, Controls, Background, useNodesState, useEdgesState, addEdge } from "reactflow"

import "reactflow/dist/style.css"

import { Container, Tab, Box, Tabs } from "@mui/material"

const initialNodes = [
	{ id: "1", position: { x: 0, y: 0 }, data: { label: "1" } },
	{ id: "2", position: { x: 0, y: 100 }, data: { label: "2" } },
]
const initialEdges = [{ id: "e1-2", source: "1", target: "2" }]

const proOptions = { hideAttribution: true }

export default function QueryBuilder() {
	const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
	const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

	const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges])

	return (
		<div style={{ width: "50vw", height: "50vh" }}>
			<ReactFlow
				proOptions={proOptions}
				fitView
				nodes={nodes}
				edges={edges}
				onNodesChange={onNodesChange}
				onEdgesChange={onEdgesChange}
				onConnect={onConnect}
			>
				<Controls />
				<MiniMap />

				<Background variant="dots" gap={12} size={1} />
			</ReactFlow>
		</div>
	)
}
