import * as React from "react"
import { DataGrid, GridToolbarContainer, GridToolbarFilterButton, GridToolbarExport } from "@mui/x-data-grid"
import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogTitle from "@mui/material/DialogTitle"
import TextField from "@mui/material/TextField"
import { styled } from "@mui/material/styles"

const StyledButton = styled(Button)(({ theme }) => ({
	margin: theme.spacing(1),
}))

function CustomToolbar({ onAddRow, onOpenColumnDialog }) {
	return (
		<GridToolbarContainer>
			<GridToolbarExport printOptions={{ disableToolbarButton: true }} />
			<StyledButton onClick={onOpenColumnDialog} color="secondary" variant="contained">
				Add Column
			</StyledButton>
			<StyledButton onClick={onAddRow} color="secondary" variant="contained">
				Add Row
			</StyledButton>
		</GridToolbarContainer>
	)
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
		<div style={{ height: "100%", width: "100%" }}>
			<DataGrid
				rows={rows}
				columns={columns}
				columnBufferPx={100}
				rowBufferPx={100}
				checkboxSelection
				disableSelectionOnClick
				components={{
					Toolbar: CustomToolbar,
				}}
				initialState={{
					pagination: { paginationModel: { pageSize: 5 } },
				}}
				pageSizeOptions={[5, 10, 25]}
				componentsProps={{
					toolbar: {
						onAddRow: handleAddRow,
						onOpenColumnDialog: handleOpen,
					},
				}}
				sx={{
					backgroundColor: "background.default",
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
