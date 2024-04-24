import React, { useEffect, useState } from "react"
import { Container, Grid } from "@mui/material"
import { useParams } from "react-router-dom"

import { PATH_DASHBOARD } from "../../../routes/paths"
import Page from "../../../components/Page"
import HeaderBreadcrumbs from "../../../components/HeaderBreadcrumbs"

// sections
import {
	TableDataViewer,
	TableViewer,
	QueryExecutor,
	DatabaseConfigurationEditor,
	DatabaseManagement,
	DatabaseOverview,
} from "../../../sections/@databases/@databases_view/index"

export default function DatabaseView() {
	const { databaseId } = useParams() // Extract the databaseId from URL
	const [databaseDetails, setDatabaseDetails] = useState({
		name: "Sample Database",
		type: "SQL",
		status: "Online",
		host: "samplehost.com",
		port: 5432,
	})

	const [config, setConfig] = useState({
		connectionString: "Server=samplehost.com;Database=SampleDatabase;User Id=admin;Password=secret;",
		maxConnections: 100,
		timeout: 30,
	})

	const [tables, setTables] = useState([
		{ name: "Users", records: 1000 },
		{ name: "Orders", records: 500 },
		// Add more tables as needed
	])

	useEffect(() => {
		// Simulate fetching database details
		// This is where you'd fetch and set details based on databaseId
	}, [databaseId])

	return (
		<Page title={databaseDetails.name || "OptiFlow"}>
			<Container maxWidth="false">
				<HeaderBreadcrumbs
					heading={databaseDetails.name || "Database"}
					links={[
						{ name: "Databases", href: PATH_DASHBOARD.general.databases },
						...(databaseDetails.name ? [{ name: databaseDetails.name, href: "", isActive: true }] : []),
					]}
				/>
				<Grid container spacing={3}>
					<Grid item xs={10} sx={{ height: "100%" }}>
						<Grid container spacing={3}>
							{/* Top Left - Database Overview */}
							<Grid item xs={4}>
								<DatabaseOverview details={databaseDetails} />
							</Grid>

							{/* Top Middle - Database Configuration */}
							<Grid item xs={8}>
								<DatabaseConfigurationEditor config={config} onSave={() => {}} />
							</Grid>

							{/* Bottom left remaining cells - DataTable */}
							<Grid item xs={12}>
								<TableDataViewer />
							</Grid>
						</Grid>
					</Grid>

					{/* Right 3 cells - TableViewer */}
					<Grid item xs={2}>
						{/* Adjust the height as per your header/navbar height */}
						<TableViewer />
					</Grid>
				</Grid>
			</Container>
		</Page>
	)
}
