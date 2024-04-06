import React, { useEffect, useState } from "react"
import { Container, Grid } from "@mui/material"
import { useParams } from "react-router-dom"

import { PATH_DASHBOARD } from "../../../routes/paths"
import Page from "../../../components/Page"
import HeaderBreadcrumbs from "../../../components/HeaderBreadcrumbs"

// sections
import { QueryExecutor, DatabaseConfigurationEditor, DatabaseManagement, DatabaseOverview } from "../../../sections/@databases/@databases_view/index"

export default function DatabasesView() {
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
			<Container maxWidth="lg">
				<HeaderBreadcrumbs
					heading={databaseDetails.name || "Databases"}
					links={[
						{ name: "Databases", href: PATH_DASHBOARD.general.databases },
						...(databaseDetails.name ? [{ name: databaseDetails.name, href: "", isActive: true }] : []),
					]}
				/>
				<Grid container spacing={3}>
					<Grid item xs={12} lg={6}>
						<DatabaseOverview details={databaseDetails} />
					</Grid>
					<Grid item xs={12} lg={6}>
						<DatabaseConfigurationEditor
							config={config}
							onSave={() => {
								/* Implement save logic */
							}}
						/>
					</Grid>
					<Grid item xs={12}>
						<DatabaseManagement tables={tables} />
					</Grid>
					<Grid item xs={12}>
						<QueryExecutor
							onExecute={(query) => {
								/* Implement query execution logic */
							}}
						/>
					</Grid>
				</Grid>
			</Container>
		</Page>
	)
}
