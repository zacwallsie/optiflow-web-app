import React from "react"
import { Box, Typography } from "@mui/material"
import PauseCircleFilledIcon from "@mui/icons-material/PauseCircleFilled"
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline"
import ScheduleIcon from "@mui/icons-material/Schedule"
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty"
import TungstenIcon from "@mui/icons-material/Tungsten"
import CancelIcon from "@mui/icons-material/Cancel"

export const QueryStatusIndicator = ({ status }) => {
	const statusStyles = {
		PendingExecution: { label: "Pending Execution", color: "primary.main", icon: <TungstenIcon fontSize="small" /> },
		AwaitingTrigger: { label: "Awaiting Trigger", color: "success.main", icon: <ScheduleIcon fontSize="small" /> },
		InProgress: { label: "In Progress", color: "info.main", icon: <HourglassEmptyIcon fontSize="small" /> },
		Failed: { label: "Failed", color: "error.main", icon: <CancelIcon fontSize="small" /> },
		Paused: { label: "Paused", color: "warning.main", icon: <PauseCircleFilledIcon fontSize="small" /> },
	}

	const { label, color, icon } = statusStyles[status] || { label: status, color: "text.primary", icon: <ErrorOutlineIcon fontSize="small" /> }

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
				{label}
			</Typography>
		</Box>
	)
}
