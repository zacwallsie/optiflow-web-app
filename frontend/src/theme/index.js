import PropTypes from "prop-types"
// @mui
import { CssBaseline } from "@mui/material"
import { createTheme, ThemeProvider as MUIThemeProvider, StyledEngineProvider } from "@mui/material/styles"
//
import palette from "./palette"
import typography from "./typography"
import breakpoints from "./breakpoints"
import componentsOverride from "./overrides"
import shadows, { customShadows } from "./shadows"

// ----------------------------------------------------------------------

ThemeProvider.propTypes = {
	children: PropTypes.node,
}

export default function ThemeProvider({ children }) {
	const themeOptions = {
		palette: palette.dark,
		typography,
		breakpoints,
		shape: { borderRadius: 0 },
		shadows: shadows.dark,
		customShadows: customShadows.dark,
	}

	const theme = createTheme(themeOptions)

	theme.components = componentsOverride(theme)

	return (
		<StyledEngineProvider injectFirst>
			<MUIThemeProvider theme={theme}>
				<CssBaseline />
				{children}
			</MUIThemeProvider>
		</StyledEngineProvider>
	)
}
