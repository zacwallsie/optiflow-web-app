import React from "react"
import { Container, Grid, Paper } from "@mui/material"

// routes
import { PATH_DASHBOARD } from "../../routes/paths"

// components
import Page from "../../components/Page"
import HeaderBreadcrumbs from "../../components/HeaderBreadcrumbs"

// sections
import {
	DatabaseStatusCard,
	DataVisualisation,
	QueryStatusList,
	RecentActivitiesLog,
	DatabaseHealthOverview,
} from "../../sections/@dashboard/app/index"

export default function GeneralApp() {
	return (
		<Page title="OptiFlow">
			<Container maxWidth="lg">
				<HeaderBreadcrumbs heading="Dashboard" links={[{ name: "Dashboard", href: PATH_DASHBOARD.root }]} />

				<Grid container spacing={3}>
					<Grid item xs={12} md={6} lg={4}>
						<Paper elevation={3} sx={{ p: 2, height: "100%" }}>
							<DatabaseStatusCard name="Sample DB" status="Online" />
						</Paper>
					</Grid>
					<Grid item xs={12} md={6} lg={8}>
						<Paper elevation={3} sx={{ p: 2, height: "100%", display: "flex", flexDirection: "column" }}>
							<DataVisualisation />
						</Paper>
					</Grid>
					<Grid item xs={12} md={6}>
						<Paper elevation={3} sx={{ p: 2, height: "100%", display: "flex", flexDirection: "column" }}>
							<QueryStatusList />
						</Paper>
					</Grid>
					<Grid item xs={12} md={6}>
						<Paper elevation={3} sx={{ p: 2, height: "100%", display: "flex", flexDirection: "column" }}>
							<RecentActivitiesLog />
						</Paper>
					</Grid>
					<Grid item xs={12}>
						<Paper elevation={3} sx={{ p: 2, height: "100%", display: "flex", flexDirection: "column" }}>
							<DatabaseHealthOverview />
						</Paper>
					</Grid>
				</Grid>
			</Container>
		</Page>
	)
}
