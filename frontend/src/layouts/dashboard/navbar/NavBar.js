import { ListItemStyle, ListItemTextStyle, ListItemIconStyle } from "./style"
import PropTypes from "prop-types"
import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { styled, useTheme } from "@mui/material/styles"
import { Box, Stack, Drawer, IconButton, List, ListItem, ListItemIcon, ListItemText, Link, Tooltip, Collapse } from "@mui/material"
import CloseIcon from "@mui/icons-material/Close"
import useResponsive from "../../../hooks/useResponsive"
import useCollapseDrawer from "../../../hooks/useCollapseDrawer"
import CollapseButton from "./CollapseButton"
import SvgIconStyle from "../../../components/SvgIconStyle"
import { PATH_DASHBOARD } from "../../../routes/paths"
// config
import { NAVBAR } from "../../../config"
// utils
import cssStyles from "../../../utils/cssStyles"
import { matchPath } from "react-router-dom"
// guards
import RoleBasedGuard from "../../../guards/RoleBasedGuard"
import Iconify from "../../../components/Iconify"

const getIcon = (name) => <SvgIconStyle src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />

function isExternalLink(path) {
	return path.includes("http")
}

function getActive(path, pathname) {
	return path ? !!matchPath({ path, end: false }, pathname) : false
}

const ICONS = {
	booking: getIcon("ic_booking"),
	analytics: getIcon("ic_analytics"),
	dashboard: getIcon("ic_dashboard"),
}

const navConfig = [
	// GENERAL
	// ----------------------------------------------------------------------
	{
		subheader: "",
		items: [
			{
				title: "silos",
				path: PATH_DASHBOARD.general.silos,
				icon: ICONS.analytics,
			},
		],
	},
]

const RootStyle = styled("div")(({ theme }) => ({
	[theme.breakpoints.up("lg")]: {
		flexShrink: 0,
		transition: theme.transitions.create("width", {
			duration: theme.transitions.duration.shorter,
		}),
	},
}))

// ----------------------------------------------------------------------

NavItem.propTypes = {
	active: PropTypes.bool,
	open: PropTypes.bool,
	isCollapse: PropTypes.bool,
	depth: PropTypes.number,
	item: PropTypes.shape({
		children: PropTypes.array,
		subPanel: PropTypes.array,
		icon: PropTypes.any,
		info: PropTypes.any,
		path: PropTypes.string,
		title: PropTypes.string,
		disabled: PropTypes.bool,
		caption: PropTypes.string,
		roles: PropTypes.arrayOf(PropTypes.string),
	}),
}

function NavItem({ item, depth, active, open, isCollapse, ...other }) {
	const { title, icon, info, children, disabled, caption, roles } = item

	const renderContent = (
		<ListItemStyle depth={depth} active={active} disabled={disabled} sx={{ paddingLeft: 1.5 }} {...other}>
			{icon && <ListItemIconStyle sx={{ marginRight: 1.5 }}>{icon}</ListItemIconStyle>}

			{depth !== 1 && <DotIcon active={active && depth !== 1} />}

			<ListItemTextStyle
				isCollapse={isCollapse}
				primary={title}
				secondary={
					caption && (
						<Tooltip title={caption} placement="top-start">
							<span>{caption}</span>
						</Tooltip>
					)
				}
				primaryTypographyProps={{
					noWrap: true,
					variant: active ? "subtitle2" : "body2",
				}}
				secondaryTypographyProps={{
					noWrap: true,
					variant: "caption",
				}}
			/>

			{!isCollapse && (
				<>
					{info && (
						<Box component="span" sx={{ lineHeight: 0 }}>
							{info}
						</Box>
					)}

					{!!children && (
						<Iconify
							icon={open ? "eva:arrow-ios-downward-fill" : "eva:arrow-ios-forward-fill"}
							sx={{ width: 16, height: 16, ml: 1, flexShrink: 0 }}
						/>
					)}
				</>
			)}
		</ListItemStyle>
	)

	return <RoleBasedGuard roles={roles}>{renderContent}</RoleBasedGuard>
}

DotIcon.propTypes = {
	active: PropTypes.bool,
}

export function DotIcon({ active }) {
	return (
		<ListItemIconStyle>
			<Box
				component="span"
				sx={{
					width: 4,
					height: 4,
					borderRadius: "50%",
					bgcolor: "text.disabled",
					transition: (theme) =>
						theme.transitions.create("transform", {
							duration: theme.transitions.duration.shorter,
						}),
					...(active && {
						transform: "scale(2)",
						bgcolor: "primary.main",
					}),
				}}
			/>
		</ListItemIconStyle>
	)
}

// ----------------------------------------------------------------------

NavList.propTypes = {
	data: PropTypes.object,
	depth: PropTypes.number,
	hasChildren: PropTypes.bool,
	hasSubpanel: PropTypes.bool,
	isCollapse: PropTypes.bool,
}

function NavList({ data, depth, hasChildren, hasSubpanel, isCollapse = false }) {
	const navigate = useNavigate()

	const { pathname } = useLocation()

	const active = getActive(data.path, pathname)

	const [open, setOpen] = useState(active)

	const handleClickItem = () => {
		if (!hasChildren) {
			navigate(data.path)
		}
		setOpen(!open)
	}

	return (
		<>
			{isExternalLink(data.path) ? (
				<Link href={data.path} target="_blank" rel="noopener" underline="none">
					<NavItem item={data} depth={depth} open={open} active={active} isCollapse={isCollapse} />
				</Link>
			) : (
				<NavItem item={data} depth={depth} open={open} active={active} isCollapse={isCollapse} onClick={handleClickItem} />
			)}

			{!isCollapse && hasChildren && (
				<Collapse in={open} unmountOnExit>
					<List component="div" disablePadding>
						<NavSubList data={data.children} depth={depth} />
					</List>
				</Collapse>
			)}
		</>
	)
}

NavSubList.propTypes = {
	data: PropTypes.array,
	depth: PropTypes.number,
}

function NavSubList({ data, depth }) {
	return (
		<>
			{data.map((list) => (
				<NavList key={list.title + list.path} data={list} depth={depth + 1} hasChildren={!!list.children} />
			))}
		</>
	)
}

// ----------------------------------------------------------------------

NavSectionVertical.propTypes = {
	isCollapse: PropTypes.bool,
	navConfig: PropTypes.array,
}

function NavSectionVertical({ navConfig, isCollapse, ...other }) {
	return (
		<Box {...other}>
			{navConfig.map((group) => (
				<List key={group.subheader} disablePadding>
					{group.items.map((list) => (
						<NavList
							key={list.title + list.path}
							data={list}
							depth={1}
							hasChildren={!!list.children}
							hasSubpanel={!!list.subPanel}
							isCollapse={isCollapse}
						/>
					))}
				</List>
			))}
		</Box>
	)
}

// ----------------------------------------------------------------------

NavbarVertical.propTypes = {
	isOpenSidebar: PropTypes.bool,
	onCloseSidebar: PropTypes.func,
}

export default function NavbarVertical({ isOpenSidebar, onCloseSidebar }) {
	const theme = useTheme()

	const { pathname } = useLocation()

	const isDesktop = useResponsive("up", "lg")

	const { isCollapse, collapseClick, collapseHover, onToggleCollapse, onHoverEnter, onHoverLeave } = useCollapseDrawer()

	useEffect(() => {
		if (isOpenSidebar) {
			onCloseSidebar()
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [pathname])

	const renderContent = (
		<Stack direction="column" justifyContent="top" sx={{ minHeight: "100% !important", backgroundColor: "tertiary.dark", p: 0, m: 0 }}>
			<Box sx={{ height: 42 }}></Box>
			<NavSectionVertical navConfig={navConfig} isCollapse={isCollapse} />
			<Box sx={{ flexGrow: 1 }} />
			<Stack direction="row" alignItems="center" justifyContent="right" sx={{ pr: 1, mt: 1, mb: 1 }}>
				{isDesktop && !isCollapse && <CollapseButton onToggleCollapse={onToggleCollapse} collapseClick={collapseClick} />}
			</Stack>
		</Stack>
	)

	return (
		<RootStyle
			sx={{
				width: {
					lg: isCollapse ? NAVBAR.DASHBOARD_COLLAPSE_WIDTH : NAVBAR.DASHBOARD_WIDTH,
				},
				bt: 45,
				...(collapseClick && {
					position: "absolute",
				}),
			}}
		>
			{!isDesktop && (
				<Drawer open={isOpenSidebar} onClose={onCloseSidebar} PaperProps={{ sx: { width: NAVBAR.DASHBOARD_WIDTH } }}>
					{renderContent}
				</Drawer>
			)}

			{isDesktop && (
				<Drawer
					open
					variant="persistent"
					onMouseEnter={onHoverEnter}
					onMouseLeave={onHoverLeave}
					PaperProps={{
						sx: {
							width: NAVBAR.DASHBOARD_WIDTH,
							border: "none",
							transition: (theme) =>
								theme.transitions.create("width", {
									duration: theme.transitions.duration.standard,
								}),
							...(isCollapse && {
								width: NAVBAR.DASHBOARD_COLLAPSE_WIDTH,
							}),
							...(collapseHover && {
								...cssStyles(theme).bgBlur(),
							}),
						},
					}}
				>
					<Stack direction="column" justifyContent="top" sx={{ minHeight: "100% !important", p: 0, m: 0 }}>
						{renderContent}
					</Stack>
				</Drawer>
			)}
		</RootStyle>
	)
}
