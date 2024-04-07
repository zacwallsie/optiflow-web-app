import React from "react"
import { Box, Typography } from "@mui/material"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import PauseCircleFilledIcon from "@mui/icons-material/PauseCircleFilled"
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline"

export const DatabaseStatusIndicator = ({ status }) => {
	const statusStyles = {
		Active: { color: "success.main", icon: <CheckCircleIcon fontSize="small" /> },
		Idle: { color: "warning.main", icon: <PauseCircleFilledIcon fontSize="small" /> },
		Disconnected: { color: "error.main", icon: <ErrorOutlineIcon fontSize="small" /> },
	}

	const { color, icon } = statusStyles[status] || {}
	return (
		<Box
			sx={{
				display: "flex",
				alignItems: "center",
				justifyContent: "start",
				border: 2,
				borderColor: color,
				bgcolor: "transparent",
				borderRadius: "20px",
				p: 0.1,
				pr: 1,
				pl: 0.3,
				width: "fit-content",
			}}
		>
			{React.cloneElement(icon, { sx: { color } })}
			<Typography variant="body2" sx={{ ml: 0.5, color }}>
				{status}
			</Typography>
		</Box>
	)
}
