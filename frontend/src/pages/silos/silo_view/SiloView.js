import React, { useEffect, useState } from "react"
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
	const [selectedTable, setSelectedTable] = useState("")

	const fetchSiloDetails = () => {
		axios
			.get(`/api/v1/silos/${siloId}`)
			.then((response) => {
				setSilo(response.data)
			})
			.catch((error) => {
				console.error("Error fetching silo details:", error)
				enqueueSnackbar("Failed to Fetch Silo", { variant: "error" })
			})
	}

	useEffect(() => {
		fetchSiloDetails()
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
					<TableDataViewer selectedTableName={selectedTable} />
				</Box>
				<Box height="50px" width="100%">
					<TableViewer onTableSelect={setSelectedTable} />
				</Box>
			</Box>
		</Page>
	)
}
