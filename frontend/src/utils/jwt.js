import { useSnackbar } from "notistack"
import jwtDecode from "jwt-decode"
import axios from "./axios"
import { PATH_AUTH } from "../routes/paths"

// ----------------------------------------------------------------------
//TODO: Need to fix refresh - appears to through error
const isValidToken = (accessToken) => {
	if (!accessToken) {
		return false
	}
	const decoded = jwtDecode(accessToken)
	const currentTime = Date.now() / 1000
	return decoded.exp > currentTime
}
const refreshAccessToken = async () => {
	try {
		const refreshToken = localStorage.getItem("refreshToken")
		const response = await axios.post("/api/v1/accounts/token/refresh/", { refresh: refreshToken })
		const { accessToken } = response.data
		setAccess(accessToken)
		return accessToken
	} catch (error) {
		console.error("Error refreshing access token:", error)
		setAccess(null)
		setTimeout(() => {
			//window.location.href = PATH_AUTH.login
		}, 5000) // Redirect after 5 seconds to give user time to see the message
	}
}

const handleTokenExpired = (exp) => {
	let expiredTimer
	const currentTime = Date.now() / 1000
	const timeLeft = exp - currentTime

	clearTimeout(expiredTimer)

	expiredTimer = setTimeout(async () => {
		// Attempt to refresh the token
		await refreshAccessToken()
	}, timeLeft)
}

const setAccess = (accessToken) => {
	if (accessToken) {
		localStorage.setItem("accessToken", accessToken)
		axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`

		// Decode the new token to set the expiration correctly
		const { exp } = jwtDecode(accessToken)
		handleTokenExpired(exp)
	} else {
		localStorage.removeItem("accessToken")
		localStorage.removeItem("refreshToken")
		delete axios.defaults.headers.common.Authorization
		window.location.href = PATH_AUTH.login
	}
}
const setSession = (accessToken, refreshToken) => {
	if (accessToken && refreshToken) {
		localStorage.setItem("refreshToken", refreshToken)
		setAccess(accessToken)
	} else {
		localStorage.removeItem("accessToken")
		localStorage.removeItem("refreshToken")
		delete axios.defaults.headers.common.Authorization
		window.location.href = PATH_AUTH.login
	}
}

export { isValidToken, setSession, setAccess }
