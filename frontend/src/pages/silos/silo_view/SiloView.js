import React, { useEffect, useState, useCallback } from "react"
import { Box, Container } from "@mui/material"
import { useParams } from "react-router-dom"
import axios from "../../../utils/axios"
import { useSnackbar } from "notistack"

import Page from "../../../components/Page"
import HeaderBreadcrumbs from "../../../components/HeaderBreadcrumbs"
import { TableDataViewer, TableViewer } from "../../../sections/@silos/@silos_view/index"

export default function SiloView() {
	const { enqueueSnackbar } = useSnackbar()
	const { siloId } = useParams()
	const [silo, setSilo] = useState([])
	const [tables, setTables] = useState([])
	const [currentTab, setCurrentTab] = useState("")

	// Getting Silo Details
	const fetchSiloDetails = (silo_id) => {
		axios
			.get(`/api/v1/silos/${silo_id}`)
			.then((response) => {
				setSilo(response.data)
			})
			.catch((error) => {
				console.error("Error fetching silo details:", error)
				enqueueSnackbar("Failed to Fetch Silo: " + (error?.detail || "Unknown error"), {
					variant: "error",
					autoHideDuration: 4000,
				})
			})
	}

	// Getting Silo Tables
	const fetchTableNames = (silo_id) => {
		axios
			.get(`/api/v1/silos/${silo_id}/tables/`)
			.then((response) => {
				setTables(response.data.tables)
				// Automatically select the first table as the current tab if not already selected
				if (response.data.tables.length && !currentTab) {
					setCurrentTab(response.data.tables[0])
				}
			})
			.catch((error) => {
				console.error("Error fetching table names:", error)
				enqueueSnackbar("Failed to Fetch Tables - " + (error?.detail || "Unknown error"), {
					variant: "error",
					autoHideDuration: 4000,
				})
			})
	}

	useEffect(() => {
		fetchSiloDetails(siloId)
		fetchTableNames(siloId)
	}, [siloId])

	return (
		<Page title={silo.silo_name || "OptiFlow"}>
			<Container maxWidth="false">
				<HeaderBreadcrumbs
					heading={silo.silo_name || "Data Silo"}
					links={[
						{ name: "All Silos", href: "/flow/silos" },
						...(silo.silo_name ? [{ name: silo.silo_name, href: "", isActive: true }] : []),
					]}
				/>
			</Container>
			<Box display="flex" flexDirection="column" height="86vh">
				<Box flex={1} sx={{ overflow: "auto" }}>
					<TableDataViewer selectedTableName={currentTab} />
				</Box>
				<Box height="50px" width="100%">
					<TableViewer Tables={tables} onTableSelect={setCurrentTab} />
				</Box>
			</Box>
		</Page>
	)
}
