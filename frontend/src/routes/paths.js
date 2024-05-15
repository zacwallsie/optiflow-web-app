// ----------------------------------------------------------------------

function path(root, sublink) {
	return `${root}${sublink}`
}

const ROOTS_AUTH = "/auth"
const ROOTS_DASHBOARD = "/flow"

// ----------------------------------------------------------------------

export const PATH_AUTH = {
	root: ROOTS_AUTH,
	login: path(ROOTS_AUTH, "/login"),
	register: path(ROOTS_AUTH, "/register"),
	loginUnprotected: path(ROOTS_AUTH, "/login-unprotected"),
	registerUnprotected: path(ROOTS_AUTH, "/register-unprotected"),
	verify: path(ROOTS_AUTH, "/verify"),
	resetPassword: path(ROOTS_AUTH, "/reset-password"),
	newPassword: path(ROOTS_AUTH, "/new-password"),
}

export const PATH_PAGE = {
	page403: "/403",
	page404: "/404",
	page500: "/500",
}

export const PATH_DASHBOARD = {
	root: ROOTS_DASHBOARD,
	general: {
		silos: path(ROOTS_DASHBOARD, "/silos"),
	},

	permissionDenied: path(ROOTS_DASHBOARD, "/permission-denied"),
	user: {
		root: path(ROOTS_DASHBOARD, "/user"),
		account: path(ROOTS_DASHBOARD, "/user/account"),
	},
}

export const PATH_DOCS = ""
export const API_DOCS = ""
