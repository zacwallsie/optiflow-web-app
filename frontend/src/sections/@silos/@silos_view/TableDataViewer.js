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
import { Button } from "@mui/material"
import RestoreIcon from "@mui/icons-material/Restore"
import LoadingButton from "@mui/lab/LoadingButton"
import SaveIcon from "@mui/icons-material/Save"
import { styled } from "@mui/material/styles"
import { darken } from "@mui/material/styles"
import { useSnackbar } from "notistack"
import { useParams } from "react-router-dom"
import axios from "../../../utils/axios"
import CreateColumnForm from "./CreateColumnForm"
import FooterConfirmation from "./FooterConfirmation"

const StyledButton = styled(Button)(({ theme }) => ({
	margin: theme.spacing(1),
}))

function CustomToolbar({ onAddRow, onOpenColumnDialog, disableAddColumn }) {
	return (
		<GridToolbarContainer>
			<GridToolbarExport printOptions={{ disableToolbarButton: true }} />
			<GridToolbarFilterButton />
			<StyledButton
				onClick={onOpenColumnDialog}
				color="secondary"
				variant="contained"
				disabled={disableAddColumn} // Disable based on the prop
			>
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
	const [rows, setRows] = useState([])
	const [newRows, setNewRows] = useState([])
	const [columns, setColumns] = useState([])
	const [isAddColumnDialogOpen, setIsAddColumnDialogOpen] = useState(false)
	const [openPendingRowBar, setOpenPendingRowBar] = useState(false)
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
				setColumns(response.data.columns)
			})
			.catch((error) => {
				console.error("Error fetching table names:", error)
				enqueueSnackbar("Failed to Fetch Table Columns - " + (error?.detail || "Unknown error"), {
					variant: "error",
					autoHideDuration: 4000,
				})
			})
	}

	// Fetching table data based on the tableName prop
	React.useEffect(() => {
		if (selectedTableName) {
			fetchTableColumns(selectedTableName)
			fetchTableRows(selectedTableName)
		}
	}, [selectedTableName]) // Dependency array includes selectedTableName

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

	const hasPendingRows = newRows.length > 0 // Check if there are new rows pending confirmation

	const handleOpenDialog = () => setIsAddColumnDialogOpen(true)
	const handleCloseDialog = () => setIsAddColumnDialogOpen(false)

	const handleAddRow = () => {
		const newRow = { id: Date.now(), isNew: true, tempId: Date.now() } // tempId to uniquely identify the row
		setNewRows([...newRows, newRow])
		setRows([...rows, newRow])
		setOpenPendingRowBar(true) // Open Snackbar for confirmation
	}

	const confirmNewRows = async () => {
		setIsSaving(true)
		axios
			.post(`/api/v1/silos/${siloId}/tables/${selectedTableName}/rows/`, { rows: newRows })
			.then((response) => {
				setRows(rows.map((row) => ({ ...row, isNew: undefined }))) // Clean up new flags
				setNewRows([])
				setOpenPendingRowBar(false)
				setIsSaving(false)
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

	const cancelNewRows = () => {
		setIsSaving(true)
		setRows(rows.filter((row) => !row.isNew)) // Remove new rows
		setNewRows([])
		setOpenPendingRowBar(false)
		setIsSaving(false)
	}

	return (
		<div style={{ height: "100%", width: "100%" }}>
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
					Toolbar: () => <CustomToolbar onAddRow={handleAddRow} onOpenColumnDialog={handleOpenDialog} disableAddColumn={hasPendingRows} />,
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
			<FooterConfirmation open={openPendingRowBar} onConfirm={confirmNewRows} onCancel={cancelNewRows} />
		</div>
	)
}
