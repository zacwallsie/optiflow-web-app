import { Container, Tab, Box, Tabs } from "@mui/material"

// routes
import { PATH_DASHBOARD } from "../../routes/paths"

// components
import Page from "../../components/Page"
import HeaderBreadcrumbs from "../../components/HeaderBreadcrumbs"

export default function QueriesPage() {
	return (
		<Page title="OptiFlow">
			<Container maxWidth={"lg"}>
				<HeaderBreadcrumbs heading="Queries" links={[{ name: "Queries", href: PATH_DASHBOARD.root }]} />
			</Container>
		</Page>
	)
}
