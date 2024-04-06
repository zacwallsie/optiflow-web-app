import React from "react"
import { List, ListItem, ListItemText, ListItemAvatar, Avatar } from "@mui/material"
import UpdateIcon from "@mui/icons-material/Update"

export default function RecentActivitiesLog() {
	const activities = [
		{ id: 1, title: "Database 'Prod DB' updated", timestamp: "Just now" },
		{ id: 2, title: "Workflow 'Data Archival' completed", timestamp: "1 hour ago" },
		// Add more activities here
	]

	return (
		<List sx={{ width: "100%", bgcolor: "background.paper" }}>
			{activities.map((activity) => (
				<ListItem key={activity.id}>
					<ListItemAvatar>
						<Avatar>
							<UpdateIcon />
						</Avatar>
					</ListItemAvatar>
					<ListItemText primary={activity.title} secondary={activity.timestamp} />
				</ListItem>
			))}
		</List>
	)
}
