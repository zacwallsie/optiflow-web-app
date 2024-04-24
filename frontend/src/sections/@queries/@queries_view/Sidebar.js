import React from "react"
import { Box, Button, Typography } from "@mui/material"
import InputIcon from "@mui/icons-material/Input"
import ChangeCircleIcon from "@mui/icons-material/ChangeCircle"
import OutputIcon from "@mui/icons-material/Output"

export default function Sidebar() {
	const onDragStart = (event, nodeType) => {
		event.dataTransfer.setData("application/reactflow", nodeType)
		event.dataTransfer.effectAllowed = "move"
	}

	return (
		<Box sx={{ width: 250, bgcolor: "grey.900", color: "white", padding: 2 }}>
			<Typography variant="h6" gutterBottom color="primary">
				Drag & Drop Nodes
			</Typography>
			<Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
				<Button
					variant="contained"
					color="secondary"
					startIcon={<InputIcon />}
					sx={{ justifyContent: "flex-start" }}
					onDragStart={(event) => onDragStart(event, "input")}
					draggable
				>
					Input Node
				</Button>
				<Button
					variant="contained"
					color="success"
					startIcon={<ChangeCircleIcon />}
					sx={{ justifyContent: "flex-start" }}
					onDragStart={(event) => onDragStart(event, "default")}
					draggable
				>
					Default Node
				</Button>
				<Button
					variant="contained"
					color="error"
					startIcon={<OutputIcon />}
					sx={{ justifyContent: "flex-start" }}
					onDragStart={(event) => onDragStart(event, "output")}
					draggable
				>
					Output Node
				</Button>
			</Box>
		</Box>
	)
}
