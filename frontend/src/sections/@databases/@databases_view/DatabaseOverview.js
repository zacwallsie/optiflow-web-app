import { Card, CardContent, Typography } from "@mui/material"

export default function DatabaseOverview({ details }) {
	return (
		<Card sx={{ mb: 2 }}>
			<CardContent>
				<Typography variant="h5" gutterBottom>
					{details.name}
				</Typography>
				<Typography color="textSecondary">Type: {details.type}</Typography>
				<Typography color="textSecondary">Status: {details.status}</Typography>
				<Typography color="textSecondary">Host: {details.host}</Typography>
				<Typography color="textSecondary">Port: {details.port}</Typography>
			</CardContent>
		</Card>
	)
}
