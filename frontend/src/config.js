// @mui
import { enUS } from "@mui/material/locale"
// routes
import { PATH_DASHBOARD } from "./routes/paths"

// API
// ----------------------------------------------------------------------

const DRF_LOCAL_HOST = "http://127.0.0.1:8000"

export const HOST_API = process.env.REACT_APP_HOST_API_KEY || DRF_LOCAL_HOST

export const FIREBASE_API = {
	apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
	authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
	databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
	projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
	storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
	messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
	appId: process.env.REACT_APP_FIREBASE_APPID,
	measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
}

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
export const PATH_AFTER_LOGIN = PATH_DASHBOARD.general.app // as '/dashboard/app'

// LAYOUT
// ----------------------------------------------------------------------

export const HEADER = {
	MOBILE_HEIGHT: 58,
	MAIN_DESKTOP_HEIGHT: 58,
	DASHBOARD_DESKTOP_HEIGHT: 58,
	DASHBOARD_DESKTOP_OFFSET_HEIGHT: 55 - 16,
}

export const NAVBAR = {
	BASE_WIDTH: 200,
	DASHBOARD_WIDTH: 220,
	DASHBOARD_COLLAPSE_WIDTH: 88,
	//
	DASHBOARD_ITEM_ROOT_HEIGHT: 48,
	DASHBOARD_ITEM_SUB_HEIGHT: 40,
	DASHBOARD_ITEM_HORIZONTAL_HEIGHT: 32,
}

export const ICON = {
	NAVBAR_ITEM: 22,
	NAVBAR_ITEM_HORIZONTAL: 20,
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
