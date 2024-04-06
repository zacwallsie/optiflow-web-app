import { alpha } from "@mui/material/styles"

// ----------------------------------------------------------------------

function createGradient(color1, color2) {
	return `linear-gradient(to bottom, ${color1}, ${color2})`
}

// SETUP COLORS
const PRIMARY = {
	lighter: "#FFFFFF",
	light: "#FFFFFF",
	main: "#F7F7F7",
	dark: "#EAEAEA",
	darker: "#939393",
}
const SECONDARY = {
	lighter: "#4B95A4",
	light: "#287786",
	main: "#005B69",
	dark: "#003F4D",
	darker: "#002633",
}
const TERTIARY = {
	light: "#2F3638",
	main: "#192021",
	dark: "#121617",
}
const INFO = {
	lighter: "#D0F2FF",
	light: "#74CAFF",
	main: "#1890FF",
	dark: "#0C53B7",
	darker: "#04297A",
}
const SUCCESS = {
	lighter: "#B9E4C9", // A light but slightly more saturated green for background highlights.
	light: "#69C794", // A vivid, lively green, making success states more noticeable.
	main: "#34A853", // A strong, leaf green, balanced between brightness and saturation.
	dark: "#1A8F4C", // A deep green with enhanced saturation for greater visual impact.
	darker: "#0F7A40", // A dark, rich green, for when a strong success message is needed.
}

const WARNING = {
	lighter: "#FFF176", // A light yellow with a hint of saturation for soft alerts.
	light: "#FFEE58", // A sunny yellow, bright and more engaging.
	main: "#FFEB3B", // A golden yellow, vibrant and attention-grabbing.
	dark: "#F9D835", // A deeper gold, adding richness and visibility.
	darker: "#F6C026", // A muted but saturated gold, for pronounced warnings.
}
const ERROR = {
	lighter: "#FFCDD2", // A light but vivid pinkish-red for gentle error indications.
	light: "#EF9A9A", // A medium coral, warm and inviting despite signaling error.
	main: "#E53935", // A bright, assertive red, clear and impossible to overlook.
	dark: "#D32F2F", // A saturated, deep red for significant error alerts.
	darker: "#C62828", // A very dark, rich red, conveying urgency and importance.
}

const GREY = {
	0: "#FFFFFF",
	100: "#F9FAFB",
	200: "#F4F6F8",
	300: "#DFE3E8",
	400: "#C4CDD5",
	500: "#919EAB",
	600: "#637381",
	700: "#454F5B",
	800: "#212B36",
	900: "#161C24",
	500_8: alpha("#919EAB", 0.08),
	500_12: alpha("#919EAB", 0.12),
	500_16: alpha("#919EAB", 0.16),
	500_24: alpha("#919EAB", 0.24),
	500_32: alpha("#919EAB", 0.32),
	500_48: alpha("#919EAB", 0.48),
	500_56: alpha("#919EAB", 0.56),
	500_80: alpha("#919EAB", 0.8),
}

const GRADIENTS = {
	primary: createGradient(PRIMARY.light, PRIMARY.main),
	info: createGradient(INFO.light, INFO.main),
	success: createGradient(SUCCESS.light, SUCCESS.main),
	warning: createGradient(WARNING.light, WARNING.main),
	error: createGradient(ERROR.light, ERROR.main),
}

const CHART_COLORS = {
	violet: ["#826AF9", "#9E86FF", "#D0AEFF", "#F7D2FF"],
	blue: ["#2D99FF", "#83CFFF", "#A5F3FF", "#CCFAFF"],
	green: ["#2CD9C5", "#60F1C8", "#A4F7CC", "#C0F2DC"],
	yellow: ["#FFE700", "#FFEF5A", "#FFF7AE", "#FFF3D6"],
	red: ["#FF6C40", "#FF8F6D", "#FFBD98", "#FFF2D4"],
}

const COMMON = {
	common: { black: "#000", white: "#fff" },
	primary: { ...PRIMARY, contrastText: "#000" },
	secondary: { ...SECONDARY, contrastText: "#000" },
	tertiary: { ...TERTIARY, contrastText: "#fff" },
	info: { ...INFO, contrastText: "#fff" },
	success: { ...SUCCESS, contrastText: GREY[800] },
	warning: { ...WARNING, contrastText: GREY[800] },
	error: { ...ERROR, contrastText: "#fff" },
	grey: GREY,
	gradients: GRADIENTS,
	chart: CHART_COLORS,
	divider: GREY[500_24],
	action: {
		hover: GREY[500_8],
		selected: GREY[500_16],
		disabled: GREY[500_80],
		disabledBackground: GREY[500_24],
		focus: GREY[500_24],
		hoverOpacity: 0.08,
		disabledOpacity: 0.48,
	},
}

const palette = {
	light: {
		...COMMON,
		mode: "light",
		text: { primary: GREY[800], secondary: GREY[600], disabled: GREY[500] },
		background: { paper: "#fff", default: "#fff", neutral: GREY[200] },
		action: { active: GREY[600], ...COMMON.action },
	},
	dark: {
		...COMMON,
		mode: "dark",
		text: { primary: "#fff", secondary: GREY[500], disabled: GREY[600] },
		background: { paper: "#192021", default: "#121617", neutral: "#2F3638" },
		action: { active: GREY[500], ...COMMON.action },
	},
}

export default palette
