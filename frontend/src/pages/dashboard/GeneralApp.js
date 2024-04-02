import { Container } from "@mui/material"

// routes
import { PATH_DASHBOARD } from "../../routes/paths"

// components
import Page from "../../components/Page"
import HeaderBreadcrumbs from "../../components/HeaderBreadcrumbs"

export default function GeneralApp() {
	return (
		<Page title="App: Frontend">
			<Container maxWidth={"lg"}>
				<HeaderBreadcrumbs heading="Home" links={[{ name: "Home", href: PATH_DASHBOARD.root }]} />
			</Container>
		</Page>
	)
}
