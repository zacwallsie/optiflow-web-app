import { Container } from "@mui/material"

// components
import Page from "../../components/Page"

// sections
import { SiloTable } from "../../sections/@silos/index"

export default function SilosPage() {
	return (
		<Page title="OptiFlow">
			<Container maxWidth={"true"}>
				<SiloTable />
			</Container>
		</Page>
	)
}
