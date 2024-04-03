import { Container } from "@mui/material"

// routes
import { PATH_DASHBOARD } from "../../routes/paths"

// components
import Page from "../../components/Page"
import HeaderBreadcrumbs from "../../components/HeaderBreadcrumbs"

export default function GeneralApp() {
	return (
		<Page title="OptiFlow">
			<Container maxWidth={"lg"}>
				<HeaderBreadcrumbs heading="Dashboard" links={[{ name: "Dashboard", href: PATH_DASHBOARD.root }]} />
			</Container>
		</Page>
	)
}
