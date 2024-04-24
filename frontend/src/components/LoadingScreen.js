import PropTypes from "prop-types"
import { m } from "framer-motion"
// @mui
import { alpha, styled } from "@mui/material/styles"
import { Box, Typography } from "@mui/material"
//
import Logo from "./Logo"
import ProgressBar from "./ProgressBar"

// ----------------------------------------------------------------------

const RootStyle = styled("div")(({ theme }) => ({
	right: 0,
	bottom: 0,
	zIndex: 99999,
	width: "100%",
	height: "100%",
	position: "fixed",
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
	backgroundColor: theme.palette.background.default,
}))

// ----------------------------------------------------------------------

LoadingScreen.propTypes = {
	isDashboard: PropTypes.bool,
}

export default function LoadingScreen({ isDashboard, ...other }) {
	return (
		<>
			<ProgressBar />

			{!isDashboard && (
				<RootStyle {...other}>
					<m.div
						animate={{
							scale: [1, 0.9, 0.9, 1, 1],
							opacity: [1, 0.48, 0.48, 1, 1],
						}}
						transition={{
							duration: 2,
							ease: "easeInOut",
							repeatDelay: 1,
							repeat: Infinity,
						}}
					>
						<Logo disabledLink sx={{ width: 64, height: 64 }} />
					</m.div>

					<Box
						component={m.div}
						animate={{
							scale: [1.2, 1, 1, 1.2, 1.2],
							rotate: [270, 0, 0, 270, 270],
							opacity: [0.25, 1, 1, 1, 0.25],
							borderRadius: ["25%", "25%", "50%", "50%", "25%"],
						}}
						transition={{ ease: "linear", duration: 3.2, repeat: Infinity }}
						sx={{
							width: 100,
							height: 100,
							borderRadius: "25%",
							position: "absolute",
							border: (theme) => `solid 3px ${alpha(theme.palette.primary.main, 0.24)}`,
						}}
					/>

					{/* Add visual element suggesting nodes and data flow */}
					<Typography
						component={m.div}
						animate={{
							pathLength: [0, 1, 1, 0, 0],
							opacity: [0, 0.5, 0.5, 0.5, 0],
						}}
						transition={{
							duration: 2,
							ease: "easeInOut",
							repeatDelay: 1,
							repeat: Infinity,
						}}
						sx={{
							position: "absolute",
							width: "100%",
							height: "100%",
							display: "flex",
							justifyContent: "center",
							alignItems: "center",
						}}
					>
						Connecting Data...
					</Typography>
				</RootStyle>
			)}
		</>
	)
}
