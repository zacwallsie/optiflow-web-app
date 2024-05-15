import * as React from "react"
import {
	DataGrid,
	GridToolbarContainer,
	GridToolbarFilterButton,
	GridToolbarExport,
	useGridApiRef,
	GridValidRowModel,
	GridRowId,
	GridColDef,
} from "@mui/x-data-grid"
import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogTitle from "@mui/material/DialogTitle"
import TextField from "@mui/material/TextField"
import RestoreIcon from "@mui/icons-material/Restore"
import LoadingButton from "@mui/lab/LoadingButton"
import SaveIcon from "@mui/icons-material/Save"
import { styled } from "@mui/material/styles"
import { darken } from "@mui/material/styles"
import { useSnackbar } from "notistack"
import { useParams } from "react-router-dom"
import axios from "../../../utils/axios"

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

export default function TableDataViewer({ selectedTableName }) {
	const { enqueueSnackbar } = useSnackbar()
	const { siloId } = useParams() // Extract the siloId from URL
	const [open, setOpen] = React.useState(false)
	const [rows, setRows] = React.useState([])
	const [columns, setColumns] = React.useState([])
	const apiRef = useGridApiRef()

	// Getting Table Rows
	const fetchTableRows = (tableName) => {
		axios
			.get(`/api/v1/silos/${siloId}/tables/${tableName}/rows/`)
			.then((response) => {
				setRows(response.data.tables)
			})
			.catch((error) => {
				console.error("Error fetching table names:", error)
				enqueueSnackbar("Failed to Fetch Table Rows", { variant: "error" })
			})
	}

	// Getting Table Columns
	const fetchTableColumns = (tableName) => {
		axios
			.get(`/api/v1/silos/${siloId}/tables/${tableName}/columns/`)
			.then((response) => {
				setColumns(response.data.tables)
			})
			.catch((error) => {
				console.error("Error fetching table names:", error)
				enqueueSnackbar("Failed to Fetch Table Columns", { variant: "error" })
			})
	}
	console.log(selectedTableName)

	// Fetching table data based on the tableName prop
	React.useEffect(() => {
		if (selectedTableName) {
			fetchTableRows(selectedTableName)
			fetchTableColumns(selectedTableName)
		}
	}, [selectedTableName]) // React to changes in tableName

	const [hasUnsavedRows, setHasUnsavedRows] = React.useState(false)
	const unsavedChangesRef = React.useRef({
		unsavedRows: {},
		rowsBeforeChange: {},
	})
	const [isSaving, setIsSaving] = React.useState(false)

	const processRowUpdate = (newRow, oldRow) => {
		const rowId = newRow.id

		unsavedChangesRef.current.unsavedRows[rowId] = newRow
		if (!unsavedChangesRef.current.rowsBeforeChange[rowId]) {
			unsavedChangesRef.current.rowsBeforeChange[rowId] = oldRow
		}
		setHasUnsavedRows(true)
		return newRow
	}

	const discardChanges = () => {
		setHasUnsavedRows(false)
		apiRef.current.updateRows(Object.values(unsavedChangesRef.current.rowsBeforeChange))
		unsavedChangesRef.current = {
			unsavedRows: {},
			rowsBeforeChange: {},
		}
	}

	const saveChanges = async () => {
		try {
			// Persist updates in the database
			setIsSaving(true)
			await new Promise((resolve) => {
				setTimeout(resolve, 1000)
			})

			setIsSaving(false)
			const rowsToDelete = Object.values(unsavedChangesRef.current.unsavedRows).filter((row) => row._action === "delete")
			if (rowsToDelete.length > 0) {
				apiRef.current.updateRows(rowsToDelete)
			}

			setHasUnsavedRows(false)
			unsavedChangesRef.current = {
				unsavedRows: {},
				rowsBeforeChange: {},
			}
		} catch (error) {
			setIsSaving(false)
		}
	}

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
			<div style={{ marginBottom: 8 }}>
				<LoadingButton disabled={!hasUnsavedRows} loading={isSaving} onClick={saveChanges} startIcon={<SaveIcon />} loadingPosition="start">
					<span>Save</span>
				</LoadingButton>
				<Button disabled={!hasUnsavedRows || isSaving} onClick={discardChanges} startIcon={<RestoreIcon />}>
					Discard all changes
				</Button>
			</div>
			<DataGrid
				rows={rows}
				columns={columns}
				apiRef={apiRef}
				checkboxSelection
				disableSelectionOnClick
				processRowUpdate={processRowUpdate}
				ignoreValueFormatterDuringExport
				sx={{
					"& .MuiDataGrid-row.row--removed": {
						backgroundColor: (theme) => {
							if (theme.palette.mode === "light") {
								return "rgba(255, 170, 170, 0.3)"
							}
							return darken("rgba(255, 170, 170, 1)", 0.7)
						},
					},
					"& .MuiDataGrid-row.row--edited": {
						backgroundColor: (theme) => {
							if (theme.palette.mode === "light") {
								return "rgba(255, 254, 176, 0.3)"
							}
							return darken("rgba(255, 254, 176, 1)", 0.6)
						},
					},
					backgroundColor: "background.default",
				}}
				components={{
					Toolbar: CustomToolbar,
				}}
				componentsProps={{
					toolbar: {
						onAddRow: handleAddRow,
						onOpenColumnDialog: handleOpen,
					},
				}}
				loading={isSaving}
				getRowClassName={({ id }) => {
					const unsavedRow = unsavedChangesRef.current.unsavedRows[id]
					if (unsavedRow) {
						if (unsavedRow._action === "delete") {
							return "row--removed"
						}
						return "row--edited"
					}
					return ""
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
