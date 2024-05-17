import React from "react"
import { Button, Dialog, Typography, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, MenuItem, Select } from "@mui/material"
import { useSnackbar } from "notistack"
import axios from "../../../utils/axios"

function DeleteColumnDialog({ open, handleClose, columns, tableName, siloId }) {
	const { enqueueSnackbar } = useSnackbar()
	const [selectedColumn, setSelectedColumn] = React.useState("")

	const handleDelete = async () => {
		axios
			.delete(`/api/v1/silos/${siloId}/tables/${tableName}/columns/${selectedColumn}/`)
			.then((response) => {
				enqueueSnackbar("Column Deleted Successfully", { variant: "success" })
				setSelectedColumn("")
				handleClose(true) // pass true to signal that a column was deleted
			})
			.catch((error) => {
				console.error("Error deleting column -", error)
				enqueueSnackbar("Failed to Delete Column - " + (error?.detail || "Unknown error"), {
					variant: "error",
					autoHideDuration: 4000,
				})
				handleClose(false)
			})
	}

	return (
		<Dialog open={open} onClose={() => handleClose(false)} aria-labelledby="delete-column-dialog-title">
			<DialogTitle id="delete-column-dialog-title">Delete Column</DialogTitle>
			<DialogContent dividers>
				<Typography gutterBottom>
					Select a column to delete from <strong>{tableName}</strong>. This action cannot be undone.
				</Typography>
				<FormControl fullWidth margin="normal">
					<InputLabel id="delete-column-select-label">Column</InputLabel>
					<Select
						labelId="delete-column-select-label"
						id="delete-column-select"
						value={selectedColumn}
						onChange={(e) => setSelectedColumn(e.target.value)}
						label="Column"
					>
						{columns.map((column) => (
							<MenuItem key={column.field} value={column.field}>
								{column.headerName}
							</MenuItem>
						))}
					</Select>
				</FormControl>
			</DialogContent>
			<DialogActions>
				<Button onClick={() => handleClose(false)} color="primary">
					Cancel
				</Button>
				<Button onClick={handleDelete} color="secondary" disabled={!selectedColumn}>
					Delete
				</Button>
			</DialogActions>
		</Dialog>
	)
}

export default DeleteColumnDialog
