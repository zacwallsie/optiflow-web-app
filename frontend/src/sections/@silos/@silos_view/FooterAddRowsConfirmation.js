import React from "react"
import { AppBar, Toolbar, Button, Box } from "@mui/material"
import { styled } from "@mui/material/styles"

const CustomAppBar = styled(AppBar)(({ theme }) => ({
	top: "auto",
	bottom: 0,
	height: "65px",
}))

const CustomToolbar = styled(Toolbar)(({ theme }) => ({
	justifyContent: "flex-end",
	paddingRight: theme.spacing(2),
}))

export default function FooterAddRowsConfirmation({ open, onConfirm, onCancel }) {
	if (!open) return null

	return (
		<CustomAppBar position="fixed" color="default">
			<CustomToolbar>
				<Box sx={{ flexGrow: 1 }}></Box>
				<Button sx={{ marginLeft: 1 }} onClick={onConfirm}>
					Confirm Added Row
				</Button>
				<Button sx={{ marginLeft: 1 }} onClick={onCancel}>
					Remove Added Row
				</Button>
			</CustomToolbar>
		</CustomAppBar>
	)
}
