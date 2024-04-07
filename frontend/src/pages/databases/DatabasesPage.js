import { Container } from "@mui/material"

// routes
import { PATH_DASHBOARD } from "../../routes/paths"

// components
import Page from "../../components/Page"
import HeaderBreadcrumbs from "../../components/HeaderBreadcrumbs"

// sections
import { DatabaseTable } from "../../sections/@databases/index"

export default function DatabasesPage() {
	return (
		<Page title="OptiFlow">
			<Container maxWidth={"false"}>
				<HeaderBreadcrumbs heading="Databases" links={[{ name: "Databases", href: PATH_DASHBOARD.databases }]} />
				<DatabaseTable />
			</Container>
		</Page>
	)
}
