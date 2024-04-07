import React, { useEffect, useState } from "react"
import { Container, Grid, Box } from "@mui/material"
import { useParams } from "react-router-dom"

import { PATH_DASHBOARD } from "../../../routes/paths"
import Page from "../../../components/Page"
import HeaderBreadcrumbs from "../../../components/HeaderBreadcrumbs"

// sections
import { QueryBuilder, NodePopupForm, ToolAdderSidebar } from "../../../sections/@queries/@queries_view/index"

export default function QueryView() {
	const { queryId } = useParams() // Extract the queryId from URL
	const [queryDetails, setQueryDetails] = useState({
		name: "Sample Query",
		type: "Sample query descriptions",
		status: "Paused",
		create_date: "2022-12-20",
		modified_date: "2022-12-20",
	})

	useEffect(() => {
		// Simulate fetching query details
	}, [queryId])

	return (
		<Page title={"OptiFlow - Queries"}>
			<Container maxWidth="false" sx={{ p: 0, m: 0 }}>
				<HeaderBreadcrumbs
					heading={queryDetails.name || "Query"}
					links={[
						{ name: "Queries", href: PATH_DASHBOARD.general.queries },
						...(queryDetails.name ? [{ name: queryDetails.name, href: "", isActive: true }] : []),
					]}
				/>
				<Grid container spacing={3}>
					{/* Main Query Builder Section */}
					<Grid item xs={12} md={9} lg={9}>
						<Box
							sx={{
								height: "calc(100vh - 200px)", // Adjust height as needed
								border: "1px solid #ddd", // Just for visibility
								borderRadius: 2,
							}}
						>
							<QueryBuilder details={queryDetails} />
						</Box>
					</Grid>

					{/* Tool Adder Sidebar */}
					<Grid item xs={12} md={3} lg={3}>
						<Box
							sx={{
								height: "calc(100vh - 200px)", // Adjust height as needed
								overflowY: "auto", // Scroll for overflow content
								border: "1px solid #ddd", // Just for visibility
								borderRadius: 2,
								padding: 2,
							}}
						>
							<ToolAdderSidebar />
						</Box>
					</Grid>
				</Grid>

				{/* Node Popup Form (assumed to be a modal or similar that can be triggered from QueryBuilder) */}
				{/* Make sure NodePopupForm is conditionally rendered or manages its visibility internally */}
				<NodePopupForm />
			</Container>
		</Page>
	)
}
