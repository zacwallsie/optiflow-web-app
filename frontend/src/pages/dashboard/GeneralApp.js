import React from "react"
import { Container, Grid, Paper, Box } from "@mui/material"

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
			<Container maxWidth="false">
				<HeaderBreadcrumbs heading="Dashboard" links={[{ name: "Dashboard", href: PATH_DASHBOARD.root }]} />

				<Grid container spacing={3} sx={{ height: "100%" }}>
					{/* Make the parent Grid container a flex container to manage heights dynamically */}
					<Grid item xs={12} md={8} display="flex" flexDirection="column" sx={{ height: "100%" }}>
						{/* Use Box as a flex container to allow children to expand */}
						<Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
							<Paper elevation={3} sx={{ p: 2, mb: 3, display: "flex", height: "100%", minHeight: "400px" }}>
								<DataVisualisation />
							</Paper>
						</Box>
						<Grid container spacing={3}>
							<Grid item xs={12} md={6}>
								<Paper elevation={3} sx={{ p: 2, display: "flex", height: "100%" }}>
									<DatabaseStatusCard name="Sample DB" status="Online" />
								</Paper>
							</Grid>
							<Grid item xs={12} md={6}>
								<Paper elevation={3} sx={{ p: 2, display: "flex", height: "100%" }}>
									<QueryStatusList />
								</Paper>
							</Grid>
						</Grid>
					</Grid>

					{/* Recent Activities and Database Health Overview */}
					<Grid item xs={12} md={4} display="flex" flexDirection="column" sx={{ height: "100%" }}>
						<Box sx={{ flexGrow: 1, marginBottom: 3 }}>
							<Paper elevation={3} sx={{ p: 2, display: "flex", flexDirection: "column", height: "100%" }}>
								<DatabaseHealthOverview />
							</Paper>
						</Box>
						<Box sx={{ flexGrow: 1 }}>
							<Paper elevation={3} sx={{ p: 2, display: "flex", flexDirection: "column", height: "100%" }}>
								<RecentActivitiesLog />
							</Paper>
						</Box>
					</Grid>
				</Grid>
			</Container>
		</Page>
	)
}
