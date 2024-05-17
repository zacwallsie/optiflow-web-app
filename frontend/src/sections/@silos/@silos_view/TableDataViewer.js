import React, { useState } from "react"
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
import { Button, IconButton } from "@mui/material"
import RestoreIcon from "@mui/icons-material/Restore"
import LoadingButton from "@mui/lab/LoadingButton"
import SaveIcon from "@mui/icons-material/Save"
import DeleteIcon from "@mui/icons-material/Delete"
import { styled } from "@mui/material/styles"
import { darken } from "@mui/material/styles"
import { useSnackbar } from "notistack"
import { useParams } from "react-router-dom"
import axios from "../../../utils/axios"
import CreateColumnForm from "./CreateColumnForm"
import FooterAddRowsConfirmation from "./FooterAddRowsConfirmation"
import FooterAlterRowsConfirmation from "./FooterAlterRowsConfirmation"
import DeleteColumnDialog from "./DeleteColumnDialog"

const StyledButton = styled(Button)(({ theme }) => ({
	margin: theme.spacing(1),
}))

function CustomToolbar({ onAddRow, onOpenColumnDialog, onOpenDeleteColumnDialog, disableToolBarButtons, onDeleteRows, selectedRowCount }) {
	return (
		<GridToolbarContainer>
			<GridToolbarExport printOptions={{ disableToolbarButton: true }} />
			<GridToolbarFilterButton />
			<StyledButton
				onClick={onOpenColumnDialog}
				color="secondary"
				variant="contained"
				disabled={disableToolBarButtons} // Disable based on the prop
			>
				Add Column
			</StyledButton>
			<StyledButton onClick={onOpenDeleteColumnDialog} color="secondary" variant="contained" disabled={disableToolBarButtons}>
				Remove Column
			</StyledButton>
			<StyledButton onClick={onAddRow} color="secondary" variant="contained" disabled={disableToolBarButtons}>
				Add Row
			</StyledButton>
			{selectedRowCount > 0 && (
				<IconButton onClick={onDeleteRows} color="error">
					<DeleteIcon />
				</IconButton>
			)}
		</GridToolbarContainer>
	)
}

export default function TableDataViewer({ selectedTableName }) {
	const { enqueueSnackbar } = useSnackbar()
	const { siloId } = useParams() // Extract the siloId from URL
	const [rows, setRows] = useState([])
	const [newRow, setNewRow] = useState(null)
	const [columns, setColumns] = useState([])
	const [isAddColumnDialogOpen, setIsAddColumnDialogOpen] = useState(false)
	const [openPendingRowBar, setOpenPendingRowBar] = useState(false)
	const [isDeleteColumnDialogOpen, setIsDeleteColumnDialogOpen] = React.useState(false)
	const [hasUnsavedRows, setHasUnsavedRows] = React.useState(false)
	const [isSaving, setIsSaving] = React.useState(false)
	const [selected, setSelected] = useState([])
	const unsavedChangesRef = React.useRef({
		unsavedRows: {},
		rowsBeforeChange: {},
	})
	const apiRef = useGridApiRef()

	// Getting Table Rows
	const fetchTableRows = async (tableName) => {
		axios
			.get(`/api/v1/silos/${siloId}/tables/${tableName}/rows/`)
			.then((response) => {
				setRows(response.data.rows)
			})
			.catch((error) => {
				console.error("Error fetching table names:", error)
				enqueueSnackbar("Failed to Fetch Table Rows - " + (error?.detail || "Unknown error"), {
					variant: "error",
					autoHideDuration: 4000,
				})
			})
	}

	// Getting Table Columns
	const fetchTableColumns = async (tableName) => {
		axios
			.get(`/api/v1/silos/${siloId}/tables/${tableName}/columns/`)
			.then((response) => {
				const fetchedColumns = response.data.columns.map((col) => ({
					...col,
					editable: col.field !== "id", // Make 'id' field not editable
				}))
				setColumns(fetchedColumns)
			})
			.catch((error) => {
				console.error("Error fetching table columns:", error)
				enqueueSnackbar("Failed to Fetch Table Columns - " + (error?.detail || "Unknown error"), {
					variant: "error",
					autoHideDuration: 4000,
				})
			})
	}

	// Function to fetch rows and columns
	const fetchData = async (selectedTableName) => {
		fetchTableRows(selectedTableName)
		fetchTableColumns(selectedTableName)
	}

	// Fetching table data based on the tableName prop
	React.useEffect(() => {
		if (selectedTableName) {
			fetchData(selectedTableName)
		}
	}, [selectedTableName]) // Dependency array includes selectedTableName

	const processRowUpdate = (newRow, oldRow) => {
		const rowId = newRow.id
		unsavedChangesRef.current.unsavedRows[rowId] = newRow
		if (!unsavedChangesRef.current.rowsBeforeChange[rowId]) {
			unsavedChangesRef.current.rowsBeforeChange[rowId] = oldRow
		}
		setHasUnsavedRows(Object.keys(unsavedChangesRef.current.unsavedRows).length > 0)
		return newRow
	}
	const confirmChanges = async () => {
		const updatedRows = Object.values(unsavedChangesRef.current.unsavedRows)
		setIsSaving(true)
		try {
			await axios.patch(`/api/v1/silos/${siloId}/tables/${selectedTableName}/rows`, {
				rows: updatedRows.map((row) => ({
					id: row.id,
					columns: { ...row },
				})),
			})
			enqueueSnackbar("Rows Updated Successfully", { variant: "success" })
			setHasUnsavedRows(false)
			unsavedChangesRef.current = { unsavedRows: {}, rowsBeforeChange: {} }
			setOpenPendingRowBar(false)
			setIsSaving(false)
		} catch (error) {
			enqueueSnackbar("Failed to update rows - " + (error.response?.data?.detail || "Unknown error"), { variant: "error" })
			setIsSaving(false)
		}
	}
	const cancelChanges = () => {
		// Revert changes locally
		apiRef.current.updateRows(Object.values(unsavedChangesRef.current.rowsBeforeChange))
		unsavedChangesRef.current = {
			unsavedRows: {},
			rowsBeforeChange: {},
		}
		setHasUnsavedRows(false)
	}

	const hasPendingRows = newRow != null // Check if there are new rows pending confirmation

	const handleOpenDialog = () => setIsAddColumnDialogOpen(true)
	const handleCloseDialog = (refresh = false) => {
		setIsAddColumnDialogOpen(false)
		fetchData(selectedTableName)
	}

	const handleOpenDeleteColumnDialog = () => {
		setIsDeleteColumnDialogOpen(true)
	}
	const handleCloseDeleteColumnDialog = (deleted) => {
		setIsDeleteColumnDialogOpen(false)
		if (deleted) {
			// Refresh your columns list or handle state update as necessary
			fetchData(selectedTableName)
		}
	}

	const handleAddRow = () => {
		// Incremental ID based on existing row count
		const newId = rows.length + 1
		const newRow = {
			id: newId, // Assign the new incremental ID
			...columns.reduce((acc, column) => {
				if (column.field !== "id") {
					acc[column.field] = "" // Initialize other fields as empty or with default values
				}
				return acc
			}, {}),
		}

		setNewRow(newRow) // As only one new row can be added at a time, reset to the new one
		setRows([...rows, newRow])
		setOpenPendingRowBar(true) // Show the confirmation bar
	}

	const confirmNewRow = async () => {
		setIsSaving(true)
		// Post only the new rows
		axios
			.post(`/api/v1/silos/${siloId}/tables/${selectedTableName}/rows/`, { columns: newRow })
			.then((response) => {
				setNewRow(null)
				setOpenPendingRowBar(false)
				setIsSaving(false)
				enqueueSnackbar("Row Added Successfully!", { variant: "success" })
			})
			.catch((error) => {
				console.error("Error adding rows:", error)
				enqueueSnackbar("Failed to Add Rows - " + (error?.detail || "Unknown error"), {
					variant: "error",
					autoHideDuration: 4000,
				})
				setIsSaving(false)
			})
	}

	const cancelNewRow = () => {
		setRows(rows.filter((row) => row.id !== newRow.id)) // Remove the new row that was not confirmed
		setNewRow(null)
		setOpenPendingRowBar(false)
	}

	const handleDeleteRows = async () => {
		if (selected.length > 0) {
			setIsSaving(true)
			axios
				.post(`/api/v1/silos/${siloId}/tables/${selectedTableName}/rows/batch/delete/`, { row_ids: selected })
				.then((response) => {
					setRows(rows.filter((row) => !selected.includes(row.id)))
					setSelected([])
					enqueueSnackbar("Rows Deleted Successfully!", { variant: "success" })
				})
				.catch((error) => {
					console.error("Error deleting silos:", error)
					enqueueSnackbar("Failed to Delete Rows - " + (error?.detail || "Unknown error"), {
						variant: "error",
						autoHideDuration: 4000,
					})
				})
				.finally(() => {
					setIsSaving(false)
				})
		}
	}

	return (
		<div style={{ height: "100%", width: "100%" }}>
			<DataGrid
				rows={rows}
				columns={columns}
				apiRef={apiRef}
				checkboxSelection
				getRowId={(row) => row.id}
				disableSelectionOnClick
				processRowUpdate={processRowUpdate}
				ignoreValueFormatterDuringExport
				onSelectionModelChange={(newSelection) => {
					setSelected(newSelection)
				}}
				sx={{
					"& .MuiDataGrid-columnHeaders": {
						textTransform: "none", // Ensure text is not transformed
					},
					"& .MuiDataGrid-columnHeaderTitle": {
						textTransform: "none", // Specifically targeting the title text
					},
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
					Toolbar: () => (
						<CustomToolbar
							onAddRow={handleAddRow}
							onOpenColumnDialog={handleOpenDialog}
							onOpenDeleteColumnDialog={handleOpenDeleteColumnDialog}
							disableToolBarButtons={hasPendingRows}
							onDeleteRows={handleDeleteRows}
							selectedRowCount={selected.length}
						/>
					),
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
			<CreateColumnForm open={isAddColumnDialogOpen} handleClose={handleCloseDialog} tableName={selectedTableName} siloId={siloId} />
			<FooterAddRowsConfirmation open={openPendingRowBar} onConfirm={confirmNewRow} onCancel={cancelNewRow} />
			{hasUnsavedRows && <FooterAlterRowsConfirmation open={hasUnsavedRows} onConfirm={confirmChanges} onCancel={cancelChanges} />}
			<DeleteColumnDialog
				open={isDeleteColumnDialogOpen}
				handleClose={handleCloseDeleteColumnDialog}
				columns={columns}
				tableName={selectedTableName}
				siloId={siloId}
			/>
		</div>
	)
}
