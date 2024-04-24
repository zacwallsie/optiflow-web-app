// @mui
import { alpha, styled } from "@mui/material/styles"
import { ListItemText, ListItemIcon, ListItemButton } from "@mui/material"
// utils
import cssStyles from "../../../utils/cssStyles"
// config
import { ICON, NAVBAR } from "../../../config"

// ----------------------------------------------------------------------

export const ListItemStyle = styled(ListItemButton, {
	shouldForwardProp: (prop) => prop !== "active",
})(({ active, depth, theme }) => ({
	textTransform: "capitalize",
	paddingLeft: theme.spacing(0.5),
	paddingRight: theme.spacing(0.5),
	marginBottom: theme.spacing(0),
	color: theme.palette.text.secondary,
	height: NAVBAR.DASHBOARD_ITEM_ROOT_HEIGHT,
	// Active item
	...(active && {
		color: theme.palette.primary.main,
		backgroundColor: "#376C77",
	}),
	// Active item
	...(active &&
		depth !== 1 && {
			color: theme.palette.text.primary,
			backgroundColor: "transparent",
		}),
	// Sub item
	...(depth && {
		...(depth > 1 && {
			height: NAVBAR.DASHBOARD_ITEM_SUB_HEIGHT,
		}),
		...(depth > 2 && {
			paddingLeft: theme.spacing(depth),
		}),
	}),
}))

// ----------------------------------------------------------------------

export const ListItemTextStyle = styled(ListItemText, {
	shouldForwardProp: (prop) => prop !== "isCollapse",
})(({ isCollapse, theme }) => ({
	transition: theme.transitions.create(["width", "opacity"], {
		duration: theme.transitions.duration.shorter,
	}),
	...(isCollapse && {
		width: 0,
		opacity: 0,
	}),
}))

// ----------------------------------------------------------------------

export const ListItemIconStyle = styled(ListItemIcon)({
	width: ICON.NAVBAR_ITEM,
	height: ICON.NAVBAR_ITEM,
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
	"& svg": { width: "100%", height: "100%" },
})

// ----------------------------------------------------------------------
