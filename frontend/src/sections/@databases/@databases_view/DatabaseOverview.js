import { Card, CardContent, Typography, Button, Stack } from "@mui/material"

export default function DatabaseOverview({ details }) {
	return (
		<Card sx={{ mb: 2, height: "100%" }}>
			<CardContent>
				<Typography variant="h5" gutterBottom>
					{details.name}
				</Typography>
				<Typography color="textSecondary">Type: {details.type}</Typography>
				<Typography color="textSecondary">Status: {details.status}</Typography>
				<Typography color="textSecondary">Host: {details.host}</Typography>
				<Typography color="textSecondary">Port: {details.port}</Typography>
				<Typography color="textSecondary">Created: {details.createdDate}</Typography>
				<Typography color="textSecondary">Last Updated: {details.lastUpdated}</Typography>
				<Typography color="textSecondary" sx={{ mb: 2 }}>
					Description: {details.description}
				</Typography>
			</CardContent>
		</Card>
	)
}
