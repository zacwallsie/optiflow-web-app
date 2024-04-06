import React from "react"
import { Card, CardContent, Typography, CardActions, Button } from "@mui/material"
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline"
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline"

export default function DatabaseStatusCard({ name, status }) {
	const getStatusIcon = (status) => {
		switch (status) {
			case "Online":
				return <CheckCircleOutlineIcon color="success" />
			case "Issues Detected":
				return <ErrorOutlineIcon color="error" />
			default:
				return <ErrorOutlineIcon color="disabled" />
		}
	}

	return (
		<Card sx={{ minWidth: 275 }}>
			<CardContent>
				<Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
					Database Status
				</Typography>
				<Typography variant="h5" component="div">
					{name} {getStatusIcon(status)}
				</Typography>
				<Typography sx={{ mb: 1.5 }} color="text.secondary">
					Status: {status}
				</Typography>
			</CardContent>
			<CardActions>
				<Button size="small">View Details</Button>
			</CardActions>
		</Card>
	)
}
