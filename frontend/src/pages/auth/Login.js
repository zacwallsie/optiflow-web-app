import { capitalCase } from "change-case"
import { Link as RouterLink } from "react-router-dom"
// @mui
import { styled } from "@mui/material/styles"
import { Box, Stack, Link, Tooltip, Container, Typography, Card } from "@mui/material"
// routes
import { PATH_AUTH } from "../../routes/paths"
// hooks
import useAuth from "../../hooks/useAuth"
import useResponsive from "../../hooks/useResponsive"
// components
import Page from "../../components/Page"
// sections
import { LoginForm } from "../../sections/auth/login"
import EditIcon from "@mui/icons-material/Edit"
import CloudIcon from "@mui/icons-material/Cloud"
import SecurityIcon from "@mui/icons-material/Security"
import ApiIcon from "@mui/icons-material/Api"
import { OptiFlowLogo } from "../../assets"

// ----------------------------------------------------------------------

const RootStyle = styled("div")(({ theme }) => ({
	[theme.breakpoints.up("md")]: {
		display: "flex",
	},
}))

const SectionStyle = styled(Card)(({ theme }) => ({
	width: "100%",
	maxWidth: 720,
	display: "flex",
	flexDirection: "column",
	justifyContent: "center",
	margin: theme.spacing(2, 2),
	padding: theme.spacing(4),
	borderRadius: theme.shape.borderRadius,
	boxShadow: theme.shadows[5],
	textAlign: "center",
}))

const FeatureList = styled("div")(({ theme }) => ({
	display: "grid",
	gridTemplateColumns: "repeat(2, 1fr)",
	gap: theme.spacing(3),
	marginTop: theme.spacing(3),
}))

const FeatureItem = styled(Box)(({ theme }) => ({
	display: "flex",
	alignItems: "center",
	gap: theme.spacing(2),
	textAlign: "left",
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

export default function Login() {
	const { method } = useAuth()

	const mdUp = useResponsive("up", "md")

	return (
		<Page title="Login">
			<RootStyle>
				{mdUp && (
					<SectionStyle>
						<OptiFlowLogo />
						<Typography variant="h3" sx={{ mb: 4 }}>
							Welcome back to OptiFLow
						</Typography>
						<FeatureList>
							<FeatureItem>
								<EditIcon color="primary" />
								<Typography variant="body2">Edit and manage databases as easily as using a spreadsheet.</Typography>
							</FeatureItem>
							<FeatureItem>
								<CloudIcon color="primary" />
								<Typography variant="body2">All your data is securely stored and accessible in the cloud.</Typography>
							</FeatureItem>
							<FeatureItem>
								<SecurityIcon color="primary" />
								<Typography variant="body2">Bank-level security ensures your data is protected.</Typography>
							</FeatureItem>
							<FeatureItem>
								<ApiIcon color="primary" />
								<Typography variant="body2">Seamlessly integrate with other applications using our comprehensive API.</Typography>
							</FeatureItem>
						</FeatureList>
						<Typography variant="caption" sx={{ mt: 3, display: "block", textAlign: "center" }}>
							We value your privacy and protect your data with advanced security measures.
						</Typography>
					</SectionStyle>
				)}

				<Container maxWidth="sm">
					<ContentStyle>
						<Stack direction="row" alignItems="center" sx={{ mb: 5 }}>
							<Box sx={{ flexGrow: 1 }}>
								<Typography variant="h4" gutterBottom>
									Sign in
								</Typography>
								<Typography sx={{ color: "text.secondary" }}>Enter your details below.</Typography>
							</Box>
						</Stack>

						<LoginForm />

						<Typography variant="body2" align="center" sx={{ mt: 3 }}>
							Don’t have an account?{" "}
							<Link variant="subtitle2" component={RouterLink} to={PATH_AUTH.register}>
								Get started
							</Link>
						</Typography>
					</ContentStyle>
				</Container>
			</RootStyle>
		</Page>
	)
}
