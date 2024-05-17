import React, { useState, useCallback } from "react"
import {
	Tabs,
	Tab,
	Box,
	IconButton,
	Menu,
	MenuItem,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Button,
	TextField,
	tabsClasses,
	Typography,
} from "@mui/material"
import AddIcon from "@mui/icons-material/Add"
import { useParams } from "react-router-dom"
import axios from "../../../utils/axios"
import MoreVertIcon from "@mui/icons-material/MoreVert"
import { useSnackbar } from "notistack"

export default function DataViewer({ Tables, onTableSelect }) {
	const { enqueueSnackbar } = useSnackbar()
	const { siloId } = useParams() // Extract the siloId from URL
	const [tables, setTables] = useState([])

	const [currentTab, setCurrentTab] = useState(0)
	const [contextMenu, setContextMenu] = useState(null)
	const [contextTabIndex, setContextTabIndex] = useState(null)
	const [navigationMenu, setNavigationMenu] = useState(null)
	const [renameDialogOpen, setRenameDialogOpen] = useState(false)
	const [newTableName, setNewTableName] = useState("")
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

	React.useEffect(() => {
		if (Tables) {
			setTables(Tables)
		}
	}, [Tables])

	const handleChange = useCallback(
		(event, newValue) => {
			setCurrentTab(newValue)
			if (tables && tables.length > newValue) {
				onTableSelect(tables[newValue]) // Ensure the table exists before selecting it
			}
		},
		[tables, onTableSelect]
	) // Dependencies include tables and onTableSelect

	const handleAddTable = () => {
		const newTable = `Table${tables.length + 1}`
		// Add new table to the database
		axios
			.post(`/api/v1/silos/${siloId}/tables/`, { table_name: newTable })
			.then((response) => {
				const updatedTables = [...tables, newTable] // Update state to include new table
				setTables(updatedTables)
				setCurrentTab(updatedTables.length - 1) // Set the current tab to the new table
				onTableSelect(newTable) // Call the onTableSelect with the new table name
			})
			.catch((error) => {
				console.error("Error creating table:", error)
				enqueueSnackbar("Failed to Create Table - " + (error?.detail || "Unknown error"), {
					variant: "error",
					autoHideDuration: 4000,
				})
			})
	}

	const handleRightClick = (event, index) => {
		event.preventDefault()
		setContextTabIndex(index)
		setContextMenu(contextMenu === null ? { mouseX: event.clientX - 2, mouseY: event.clientY + 4 } : null)
	}

	const handleClose = () => {
		setContextMenu(null)
		setNavigationMenu(null)
		setRenameDialogOpen(false)
		setDeleteDialogOpen(false)
	}

	const handleRemoveTable = () => {
		const tableToDelete = tables[contextTabIndex]
		// Remove table from the database
		axios
			.delete(`/api/v1/silos/${siloId}/tables/${tableToDelete}`)
			.then((response) => {
				const filteredTables = tables.filter((_, index) => index !== contextTabIndex)
				setTables(filteredTables)
				setCurrentTab(Math.min(currentTab, filteredTables.length - 1))
				onTableSelect(tables[currentTab]) // Call the onTableSelect with the new table name
			})
			.catch((error) => {
				console.error("Error deleting table:", error)
				enqueueSnackbar("Failed to Delete Table - " + (error?.detail || "Unknown error"), {
					variant: "error",
					autoHideDuration: 4000,
				})
			})
		handleClose()
	}

	const openNavigationMenu = (event) => {
		setNavigationMenu(event.currentTarget)
	}

	const handleNavigation = (index) => {
		setCurrentTab(index)
		handleClose()
	}

	const openRenameDialog = () => {
		handleClose()
		setRenameDialogOpen(true)
		setNewTableName(tables[contextTabIndex])
	}

	const handleRenameTable = () => {
		const tableToRename = tables[contextTabIndex]
		axios
			.patch(`/api/v1/silos/${siloId}/tables/${tableToRename}/`, { table_name: newTableName })
			.then((response) => {
				const updatedTables = tables.map((table, index) => {
					if (index === contextTabIndex) {
						return newTableName
					}
					return table
				})
				setTables(updatedTables)
				setRenameDialogOpen(false)
			})
			.catch((error) => {
				console.error("Error renaming table:", error.detail || error)
				enqueueSnackbar("Failed to Rename Table - " + (error?.detail || "Unknown error"), {
					variant: "error",
					autoHideDuration: 4000,
				})
			})
	}

	const openDeleteDialog = () => {
		handleClose()
		setDeleteDialogOpen(true)
	}

	return (
		<Box sx={{ display: "flex", alignItems: "center" }}>
			<IconButton onClick={handleAddTable} disableRipple>
				<AddIcon />
			</IconButton>
			<IconButton onClick={openNavigationMenu} disableRipple disabled={tables.length === 0}>
				<MoreVertIcon />
			</IconButton>
			<Tabs
				value={currentTab}
				onChange={handleChange}
				variant="scrollable"
				scrollButtons
				sx={{
					[`& .${tabsClasses.scrollButtons}`]: {
						"&.Mui-disabled": { opacity: 0.3 },
					},
				}}
			>
				{tables.map((table, index) => (
					<Tab key={table} label={table} onContextMenu={(event) => handleRightClick(event, index)} disableRipple />
				))}
			</Tabs>
			<Menu
				open={contextMenu !== null}
				onClose={handleClose}
				anchorReference="anchorPosition"
				anchorPosition={contextMenu !== null ? { top: contextMenu.mouseY, left: contextMenu.mouseX } : undefined}
			>
				<MenuItem onClick={openDeleteDialog}>Remove</MenuItem>
				<MenuItem onClick={openRenameDialog}>Rename</MenuItem>
			</Menu>
			<Menu
				open={Boolean(navigationMenu)}
				onClose={handleClose}
				anchorEl={navigationMenu}
				PaperProps={{
					style: {
						maxHeight: "20vh",
						overflow: "auto",
					},
				}}
			>
				{tables.map((table, index) => (
					<MenuItem key={table} onClick={() => handleNavigation(index)} disableRipple>
						{table}
					</MenuItem>
				))}
			</Menu>
			<Dialog open={deleteDialogOpen} onClose={handleClose}>
				<DialogTitle>Confirm Deletion</DialogTitle>
				<DialogContent>
					<Typography>Are you sure you want to delete this table?</Typography>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose}>Cancel</Button>
					<Button onClick={handleRemoveTable} color="error">
						Delete
					</Button>
				</DialogActions>
			</Dialog>
			<Dialog open={renameDialogOpen} onClose={handleClose}>
				<DialogTitle>Rename Table</DialogTitle>
				<DialogContent>
					<TextField
						autoFocus
						margin="normal"
						id="name"
						type="text"
						fullWidth
						autoComplete="off"
						variant="standard"
						value={newTableName}
						onChange={(e) => setNewTableName(e.target.value)}
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose}>Cancel</Button>
					<Button onClick={handleRenameTable}>Save</Button>
				</DialogActions>
			</Dialog>
		</Box>
	)
}
