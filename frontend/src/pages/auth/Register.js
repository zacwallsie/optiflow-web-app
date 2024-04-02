import { capitalCase } from "change-case"
import { Link as RouterLink } from "react-router-dom"
// @mui
import { styled } from "@mui/material/styles"
import { Box, Card, Link, Container, Typography, Tooltip } from "@mui/material"
// hooks
import useAuth from "../../hooks/useAuth"
import useResponsive from "../../hooks/useResponsive"
// routes
import { PATH_AUTH } from "../../routes/paths"
// components
import Page from "../../components/Page"
import Logo from "../../components/Logo"
import Image from "../../components/Image"
// sections
import { RegisterForm } from "../../sections/auth/register"

// ----------------------------------------------------------------------

const RootStyle = styled("div")(({ theme }) => ({
	[theme.breakpoints.up("md")]: {
		display: "flex",
	},
}))

const SectionStyle = styled(Card)(({ theme }) => ({
	width: "100%",
	maxWidth: 464,
	display: "flex",
	flexDirection: "column",
	justifyContent: "center",
	margin: theme.spacing(2, 0, 2, 2),
}))

const ContentStyle = styled("div")(({ theme }) => ({
	maxWidth: 480,
	margin: "auto",
	minHeight: "100vh",
	display: "flex",
	justifyContent: "center",
	flexDirection: "column",
	padding: theme.spacing(12, 0),
}))

// ----------------------------------------------------------------------

export default function Register() {
	const { method } = useAuth()

	const smUp = useResponsive("up", "sm")

	const mdUp = useResponsive("up", "md")

	return (
		<Page title="Register">
			<RootStyle>
				{mdUp && (
					<SectionStyle>
						<Typography variant="h3" sx={{ px: 5, mt: 10, mb: 5 }}>
							Make managing your Data simple with OptiFlow
						</Typography>
					</SectionStyle>
				)}

				<Container>
					<ContentStyle>
						<Box sx={{ mb: 5, display: "flex", alignItems: "center" }}>
							<Box sx={{ flexGrow: 1 }}>
								<Typography variant="h4" gutterBottom>
									Get started absolutely free.
								</Typography>
								<Typography sx={{ color: "text.secondary" }}>A data warehouse at your fingertips.</Typography>
							</Box>
						</Box>

						<RegisterForm />

						<Typography variant="body2" align="center" sx={{ color: "text.primary", mt: 3 }}>
							Already have an account? {""}
							<Link variant="subtitle2" component={RouterLink} to={PATH_AUTH.login}>
								Login
							</Link>
						</Typography>
					</ContentStyle>
				</Container>
			</RootStyle>
		</Page>
	)
}
