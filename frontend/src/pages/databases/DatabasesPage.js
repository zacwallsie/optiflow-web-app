import { Container } from "@mui/material"

// components
import Page from "../../components/Page"

// sections
import { DatabaseTable } from "../../sections/@databases/index"

export default function DatabasesPage() {
	return (
		<Page title="OptiFlow">
			<Container maxWidth={"true"}>
				<DatabaseTable />
			</Container>
		</Page>
	)
}
