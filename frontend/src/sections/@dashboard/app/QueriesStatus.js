import React from "react"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemText from "@mui/material/ListItemText"
import ListItemIcon from "@mui/material/ListItemIcon"
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline"
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline"
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty"

export default function QueryStatusList() {
	const workflows = [
		{ name: "Data Copy Task", status: "Completed" },
		{ name: "Email Notification", status: "In Progress" },
		{ name: "Data Archival", status: "Failed" },
	]

	const getStatusIcon = (status) => {
		switch (status) {
			case "Completed":
				return <CheckCircleOutlineIcon color="success" />
			case "In Progress":
				return <HourglassEmptyIcon color="action" />
			case "Failed":
				return <ErrorOutlineIcon color="error" />
			default:
				return <ErrorOutlineIcon color="disabled" />
		}
	}

	return (
		<List>
			{workflows.map((workflow, index) => (
				<ListItem key={index}>
					<ListItemIcon>{getStatusIcon(workflow.status)}</ListItemIcon>
					<ListItemText primary={workflow.name} secondary={`Status: ${workflow.status}`} />
				</ListItem>
			))}
		</List>
	)
}
