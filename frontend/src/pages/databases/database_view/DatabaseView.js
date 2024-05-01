import React, { useEffect, useState } from "react"
import { Box, Container, Grid } from "@mui/material"
import { useParams } from "react-router-dom"

import { PATH_DASHBOARD } from "../../../routes/paths"
import Page from "../../../components/Page"
import HeaderBreadcrumbs from "../../../components/HeaderBreadcrumbs"
import { styled } from "@mui/material/styles"

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
						{ name: "All Silos", href: PATH_DASHBOARD.general.databases },
						...(databaseDetails.name ? [{ name: databaseDetails.name, href: "", isActive: true }] : []),
					]}
					sx={{ mb: 0 }}
				/>
			</Container>
			<Box display="flex" height="88vh">
				{" "}
				{/* Using Box for flex display */}
				{/* Left space - TableDataViewer */}
				<Box flex={1} height="100%">
					{" "}
					{/* Box takes remaining space */}
					<TableDataViewer />
				</Box>
				{/* Right fixed width - TableViewer */}
				<Box width={250} height="100%" sx={{ padding: 0 }}>
					{" "}
					{/* Fixed width for TableViewer */}
					<TableViewer />
				</Box>
			</Box>
		</Page>
	)
}
