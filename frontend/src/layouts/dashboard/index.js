import { useState } from "react"
import { Outlet } from "react-router-dom"
// @mui
import { styled } from "@mui/material/styles"
import { Box } from "@mui/material"
// hooks
import useResponsive from "../../hooks/useResponsive"
import useCollapseDrawer from "../../hooks/useCollapseDrawer"
// config
import { HEADER, NAVBAR } from "../../config"
//
import DashboardHeader from "./header/DashboardHeader"
import NavbarVertical from "./navbar/NavBar"

// ----------------------------------------------------------------------

const MainStyle = styled("main", {
	shouldForwardProp: (prop) => prop !== "collapseClick",
})(({ collapseClick, theme }) => ({
	flexGrow: 1,
	paddingTop: HEADER.MOBILE_HEIGHT + 24,
	paddingBottom: HEADER.MOBILE_HEIGHT + 24,
	[theme.breakpoints.up("lg")]: {
		paddingLeft: 8,
		paddingRight: 8,
		paddingTop: HEADER.DASHBOARD_DESKTOP_HEIGHT + 24,
		paddingBottom: HEADER.DASHBOARD_DESKTOP_HEIGHT + 24,
		width: `calc(100% - ${NAVBAR.DASHBOARD_WIDTH}px)`,
		transition: theme.transitions.create("margin-left", {
			duration: theme.transitions.duration.shorter,
		}),
		...(collapseClick && {
			marginLeft: NAVBAR.DASHBOARD_COLLAPSE_WIDTH,
		}),
	},
}))

// ----------------------------------------------------------------------

export default function DashboardLayout() {
	const { collapseClick, isCollapse } = useCollapseDrawer()

	const [open, setOpen] = useState(false)

	return (
		<Box
			sx={{
				display: { lg: "flex" },
				minHeight: { lg: 1 },
			}}
		>
			<DashboardHeader isCollapse={isCollapse} onOpenSidebar={() => setOpen(true)} />
			<NavbarVertical isOpenSidebar={open} onCloseSidebar={() => setOpen(false)} />
			<MainStyle collapseClick={collapseClick} style={{ paddingLeft: 0, paddingRight: 0, ml: 0, mr: 0 }}>
				<Outlet />
			</MainStyle>
		</Box>
	)
}
