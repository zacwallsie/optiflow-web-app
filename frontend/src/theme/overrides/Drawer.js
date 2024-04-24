import { alpha } from "@mui/material"

// ----------------------------------------------------------------------

export default function Drawer(theme) {
	const isLight = theme.palette.mode === "light"

	return {
		MuiDrawer: {
			styleOverrides: {},
		},
	}
}
