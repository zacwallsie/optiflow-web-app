import React, { useEffect, useState } from "react"
import { Container, Box } from "@mui/material"
import { useParams } from "react-router-dom"

import { PATH_DASHBOARD } from "../../../routes/paths"
import Page from "../../../components/Page"
import HeaderBreadcrumbs from "../../../components/HeaderBreadcrumbs"

// sections
import { QueryBuilder } from "../../../sections/@queries/@queries_view/index"

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
			<Container maxWidth="false">
				<HeaderBreadcrumbs
					heading={queryDetails.name || "Query"}
					links={[
						{ name: "Queries", href: PATH_DASHBOARD.general.queries },
						...(queryDetails.name ? [{ name: queryDetails.name, href: "", isActive: true }] : []),
					]}
				/>
			</Container>
			<Box
				sx={{
					height: "100%",
					width: "100%",
					borderTop: "1px solid #ddd", // Just for visibility
					borderRadius: 2,
				}}
			>
				<QueryBuilder queryDetails={queryDetails} />
			</Box>
		</Page>
	)
}
