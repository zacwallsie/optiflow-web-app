import * as React from "react"
import { DataGrid, GridToolbar } from "@mui/x-data-grid"
import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogTitle from "@mui/material/DialogTitle"
import TextField from "@mui/material/TextField"

function CustomToolbar() {
	return <GridToolbar>{/* Placeholder for custom toolbar actions */}</GridToolbar>
}

export default function TableDataViewer() {
	const [open, setOpen] = React.useState(false)
	const [rows, setRows] = React.useState([
		{ id: 1, col1: "Hello", col2: "World" },
		// Add more rows as needed
	])
	const [columns, setColumns] = React.useState([
		{ field: "col1", headerName: "Column 1", width: 150, editable: true },
		{ field: "col2", headerName: "Column 2", width: 150, editable: true },
		// Add more columns as needed
	])

	const handleClose = () => {
		setOpen(false)
	}

	const handleAddColumn = (newColumnName) => {
		setColumns([...columns, { field: newColumnName.toLowerCase(), headerName: newColumnName, width: 150, editable: true }])
		handleClose()
	}

	const handleOpen = () => {
		setOpen(true)
	}

	const handleAddRow = () => {
		const newRow = { id: rows.length + 1, col1: "", col2: "" }
		setRows([...rows, newRow])
	}

	return (
		<div style={{ height: "600px", width: "100%" }}>
			<Button onClick={handleOpen} color="primary" variant="contained" style={{ margin: 8 }}>
				Add Column
			</Button>
			<Button onClick={handleAddRow} color="secondary" variant="contained" style={{ margin: 8 }}>
				Add Row
			</Button>
			<DataGrid
				rows={rows}
				columns={columns}
				pageSize={5}
				rowsPerPageOptions={[5]}
				checkboxSelection
				disableSelectionOnClick
				components={{
					Toolbar: CustomToolbar,
				}}
			/>
			<Dialog open={open} onClose={handleClose}>
				<DialogTitle>Add New Column</DialogTitle>
				<DialogContent>
					<TextField
						autoFocus
						margin="dense"
						id="name"
						label="Column Name"
						type="text"
						fullWidth
						variant="outlined"
						onKeyDown={(e) => {
							if (e.key === "Enter") {
								handleAddColumn(e.target.value)
								e.preventDefault()
							}
						}}
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose}>Cancel</Button>
				</DialogActions>
			</Dialog>
		</div>
	)
}
