// @mui
import { enUS } from "@mui/material/locale"
// routes
import { PATH_DASHBOARD } from "./routes/paths"

// API
// ----------------------------------------------------------------------

const DRF_LOCAL_HOST = "http://127.0.0.1:8000"

export const HOST_API = process.env.REACT_APP_HOST_API_KEY || DRF_LOCAL_HOST

export const COGNITO_API = {
	userPoolId: process.env.REACT_APP_AWS_COGNITO_USER_POOL_ID,
	clientId: process.env.REACT_APP_AWS_COGNITO_CLIENT_ID,
}

export const AUTH0_API = {
	clientId: process.env.REACT_APP_AUTH0_CLIENT_ID,
	domain: process.env.REACT_APP_AUTH0_DOMAIN,
}

export const MAPBOX_API = process.env.REACT_APP_MAPBOX_API

// ROOT PATH AFTER LOGIN SUCCESSFUL
export const PATH_AFTER_LOGIN = PATH_DASHBOARD.general.queries

// LAYOUT
// ----------------------------------------------------------------------

export const HEADER = {
	MOBILE_HEIGHT: 42,
	MAIN_DESKTOP_HEIGHT: 42,
	DASHBOARD_DESKTOP_HEIGHT: 42,
	DASHBOARD_DESKTOP_OFFSET_HEIGHT: 42 - 12,
}

export const NAVBAR = {
	BASE_WIDTH: 135,
	DASHBOARD_WIDTH: 135,
	DASHBOARD_COLLAPSE_WIDTH: 46,
	//
	DASHBOARD_ITEM_ROOT_HEIGHT: 42,
	DASHBOARD_ITEM_SUB_HEIGHT: 42,
}

export const ICON = {
	NAVBAR_ITEM: 24,
	NAVBAR_ITEM_HORIZONTAL: 24,
}

// SETTINGS
// Please remove `localStorage` when you change settings.
// ----------------------------------------------------------------------

export const defaultSettings = {
	themeMode: "dark",
	themeDirection: "ltr",
	themeContrast: "default",
	themeLayout: "vertical",
	themeColorPresets: "default",
	themeStretch: false,
}

// MULTI LANGUAGES
// Please remove `localStorage` when you change settings.
// ----------------------------------------------------------------------

export const allLangs = [
	{
		label: "English",
		value: "en",
		systemValue: enUS,
		icon: "/assets/icons/flags/ic_flag_en.svg",
	},
]

export const defaultLang = allLangs[0] // English
