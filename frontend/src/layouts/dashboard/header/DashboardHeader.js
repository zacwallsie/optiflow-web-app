import PropTypes from "prop-types"
import { useEffect } from "react"
// @mui
import { styled } from "@mui/material/styles"
import { Box, Stack, AppBar, Toolbar } from "@mui/material"
// hooks
import useResponsive from "../../../hooks/useResponsive"
// Redux
import { useSelector, useDispatch } from "react-redux"
import { getUser } from "../../../redux/slices/user"

// utils
import cssStyles from "../../../utils/cssStyles"
// config
import { HEADER, NAVBAR } from "../../../config"
// components
import Iconify from "../../../components/Iconify"
import { IconButtonAnimate } from "../../../components/animate"
//
import AccountPopover from "./AccountPopover"

// ----------------------------------------------------------------------

const RootStyle = styled(AppBar, {
	shouldForwardProp: (prop) => prop !== "isCollapse" && prop !== "isOffset" && prop !== "verticalLayout",
})(({ isCollapse, isOffset, verticalLayout, theme }) => ({
	...cssStyles(theme).bgBlur(),
	boxShadow: "none",
	height: HEADER.MOBILE_HEIGHT,
	width: "100%",
}))

// ----------------------------------------------------------------------

DashboardHeader.propTypes = {
	onOpenSidebar: PropTypes.func,
	isCollapse: PropTypes.bool,
	verticalLayout: PropTypes.bool,
}

export default function DashboardHeader({ onOpenSidebar, isCollapse = false, verticalLayout = false }) {
	const isDesktop = useResponsive("up", "lg")
	const dispatch = useDispatch()
	// get user
	const { user } = useSelector((state) => state?.user)

	useEffect(() => {
		dispatch(getUser())
	}, [])

	return (
		<RootStyle>
			<Toolbar
				sx={{
					minHeight: "100% !important",
					backgroundColor: "tertiary.dark",
				}}
			>
				{!isDesktop && (
					<IconButtonAnimate onClick={onOpenSidebar} sx={{ mr: 1, color: "text.primary" }}>
						<Iconify icon="eva:menu-2-fill" />
					</IconButtonAnimate>
				)}

				<Box sx={{ flexGrow: 1 }} />

				<Stack direction="row" alignItems="center" justifyContent="flex-end" spacing={{ xs: 0.5, sm: 1.5 }}>
					<AccountPopover user={user} />
				</Stack>
			</Toolbar>
		</RootStyle>
	)
}
