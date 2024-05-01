import React, { useState } from "react"
import { Dialog, DialogActions, DialogContent, TextField, Button, Typography } from "@mui/material"
import { styled } from "@mui/material/styles"

const StyledDialogContent = styled(DialogContent)(({ theme }) => ({
	paddingTop: theme.spacing(2),
	paddingBottom: theme.spacing(2),
}))

const ConfirmationText = styled(Typography)(({ theme }) => ({
	marginTop: theme.spacing(1),
	marginBottom: theme.spacing(2),
}))

function ConfirmDeleteDialog({ open, onClose, onConfirm }) {
	const [inputValue, setInputValue] = useState("")
	const isInputCorrect = inputValue === "DELETE SILOS"

	const handleClose = () => {
		setInputValue("")
		onClose()
	}

	const handleConfirm = () => {
		if (isInputCorrect) {
			onConfirm()
			handleClose()
		}
	}

	return (
		<Dialog open={open} onClose={handleClose}>
			<StyledDialogContent>
				<ConfirmationText variant="body1">
					Type <strong style={{ color: "red" }}>DELETE SILOS</strong> to confirm.
				</ConfirmationText>
				<TextField
					autoFocus
					margin="dense"
					label="Type here"
					fullWidth
					variant="outlined"
					value={inputValue}
					onChange={(e) => setInputValue(e.target.value)}
				/>
			</StyledDialogContent>
			<DialogActions>
				<Button onClick={handleClose}>Cancel</Button>
				<Button onClick={handleConfirm} disabled={!isInputCorrect} color="error">
					Delete
				</Button>
			</DialogActions>
		</Dialog>
	)
}

export default ConfirmDeleteDialog
