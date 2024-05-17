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
// sections
import { RegisterForm } from "../../sections/auth/register"
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

export default function Register() {
	const { method } = useAuth()

	const smUp = useResponsive("up", "sm")

	const mdUp = useResponsive("up", "md")

	return (
		<Page title="Register">
			<RootStyle>
				{mdUp && (
					<SectionStyle>
						<OptiFlowLogo />
						<Typography variant="h3" sx={{ mb: 4 }}>
							Welcome to OptiFLow
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
