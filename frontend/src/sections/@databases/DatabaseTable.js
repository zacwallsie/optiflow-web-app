import * as React from "react"
import PropTypes from "prop-types"
import { useSnackbar } from "notistack"
import axios from "../../utils/axios"
import { alpha } from "@mui/material/styles"
import Box from "@mui/material/Box"
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell from "@mui/material/TableCell"
import TableContainer from "@mui/material/TableContainer"
import TableHead from "@mui/material/TableHead"
import TablePagination from "@mui/material/TablePagination"
import TableRow from "@mui/material/TableRow"
import TableSortLabel from "@mui/material/TableSortLabel"
import Toolbar from "@mui/material/Toolbar"
import Typography from "@mui/material/Typography"
import Paper from "@mui/material/Paper"
import Checkbox from "@mui/material/Checkbox"
import IconButton from "@mui/material/IconButton"
import Tooltip from "@mui/material/Tooltip"
import DeleteIcon from "@mui/icons-material/Delete"
import FilterListIcon from "@mui/icons-material/FilterList"
import { visuallyHidden } from "@mui/utils"
// mui
import Button from "@mui/material/Button"
import AddIcon from "@mui/icons-material/Add"
import Grid from "@mui/material/Grid"
import SearchIcon from "@mui/icons-material/Search"
import InputBase from "@mui/material/InputBase"
import { useNavigate } from "react-router-dom"
// section utils
import { stableSort, getComparator } from "../section_utils/index"
// components
import CreateSiloForm from "./CreateSiloForm"
import ConfirmDeleteDialog from "./ConfirmDeleteDialog"

const headCells = [
	{
		id: "schema_name",
		numeric: false,
		disablePadding: false,
		label: "Silo Name",
	},
	{
		id: "created_at",
		numeric: false,
		disablePadding: false,
		label: "Created At",
	},
]

function EnhancedTableHead(props) {
	const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props
	const createSortHandler = (property) => (event) => {
		onRequestSort(event, property)
	}

	return (
		<TableHead>
			<TableRow sx={{ width: "100%" }}>
				<TableCell padding="checkbox">
					<Checkbox
						color="primary"
						indeterminate={numSelected > 0 && numSelected < rowCount}
						checked={rowCount > 0 && numSelected === rowCount}
						onChange={onSelectAllClick}
						inputProps={{
							"aria-label": "select all silos",
						}}
					/>
				</TableCell>
				{headCells.map((headCell) => (
					<TableCell
						key={headCell.id}
						align="left"
						padding={headCell.disablePadding ? "none" : "normal"}
						sortDirection={orderBy === headCell.id ? order : false}
					>
						<TableSortLabel
							active={orderBy === headCell.id}
							direction={orderBy === headCell.id ? order : "asc"}
							onClick={createSortHandler(headCell.id)}
						>
							{headCell.label}
							{orderBy === headCell.id ? (
								<Box component="span" sx={visuallyHidden}>
									{order === "desc" ? "sorted descending" : "sorted ascending"}
								</Box>
							) : null}
						</TableSortLabel>
					</TableCell>
				))}
			</TableRow>
		</TableHead>
	)
}

EnhancedTableHead.propTypes = {
	numSelected: PropTypes.number.isRequired,
	onRequestSort: PropTypes.func.isRequired,
	onSelectAllClick: PropTypes.func.isRequired,
	order: PropTypes.oneOf(["asc", "desc"]).isRequired,
	orderBy: PropTypes.string.isRequired,
	rowCount: PropTypes.number.isRequired,
}

function EnhancedTableToolbar(props) {
	const { numSelected, onDeleteSelected } = props

	return (
		<Toolbar
			sx={{
				pl: { sm: 2 },
				pr: { xs: 1, sm: 1 },
				...(numSelected > 0 && {
					bgcolor: (theme) => alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
				}),
			}}
		>
			{numSelected > 0 ? (
				<Typography sx={{ flex: "1 1 100%" }} color="inherit" variant="subtitle1" component="div">
					{numSelected} selected
				</Typography>
			) : (
				<Typography sx={{ flex: "1 1 100%" }} variant="h6" id="tableTitle" component="div">
					Data Silos
				</Typography>
			)}

			{numSelected > 0 ? (
				<Tooltip title="Delete">
					<IconButton onClick={onDeleteSelected}>
						<DeleteIcon />
					</IconButton>
				</Tooltip>
			) : (
				<IconButton>
					<FilterListIcon />
				</IconButton>
			)}
		</Toolbar>
	)
}

EnhancedTableToolbar.propTypes = {
	numSelected: PropTypes.number.isRequired,
}

export default function SiloTable() {
	const { enqueueSnackbar } = useSnackbar()
	const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false)
	const [schemas, setSchemas] = React.useState([])
	const [order, setOrder] = React.useState("asc")
	const [orderBy, setOrderBy] = React.useState("name")
	const [selected, setSelected] = React.useState([])
	const [page, setPage] = React.useState(0)
	const [rowsPerPage, setRowsPerPage] = React.useState(10)
	const [searchTerm, setSearchTerm] = React.useState("")
	const navigate = useNavigate()

	const [open, setAddSiloOpen] = React.useState(false)

	const handleAddSiloOpen = () => {
		setAddSiloOpen(true)
	}

	const handleAddSiloClose = () => {
		setAddSiloOpen(false)
	}

	const fetchSilos = () => {
		axios
			.get("/api/v1/silos/list/")
			.then((response) => {
				setSchemas(response.data)
			})
			.catch((error) => {
				console.error("Error fetching schemas:", error)
				enqueueSnackbar("Failed to fetch Silos", { variant: "error" })
			})
	}

	React.useEffect(() => {
		fetchSilos()
	}, [])

	const handleDelete = () => {
		if (selected.length > 0) {
			setOpenDeleteDialog(true)
		} else {
			enqueueSnackbar("No silos selected for deletion", { variant: "warning" })
		}
	}

	const confirmDelete = () => {
		axios
			.post("/api/v1/silos/delete/", { ids: selected })
			.then((response) => {
				// Update state and UI accordingly
				enqueueSnackbar("Silos deleted successfully", { variant: "success" })
			})
			.catch((error) => {
				console.error("Error deleting silos:", error)
				enqueueSnackbar("Failed to delete silos", { variant: "error" })
			})
			.finally(() => {
				setSelected([])
				fetchSilos()
			})
	}

	const handleNameClick = (databaseId) => {
		navigate(`/flow/databases/${databaseId}`)
	}

	// Filter rows based on search term
	const handleSearch = (event) => {
		setSearchTerm(event.target.value)
	}

	const handleRequestSort = (event, property) => {
		const isAsc = orderBy === property && order === "asc"
		setOrder(isAsc ? "desc" : "asc")
		setOrderBy(property)
	}

	const handleSelectAllClick = (event) => {
		if (event.target.checked) {
			const newSelected = schemas.map((n) => n.id)
			setSelected(newSelected)
			return
		}
		setSelected([])
	}

	const handleClick = (event, id) => {
		const selectedIndex = selected.indexOf(id)
		let newSelected = []

		if (selectedIndex === -1) {
			newSelected = newSelected.concat(selected, id)
		} else if (selectedIndex === 0) {
			newSelected = newSelected.concat(selected.slice(1))
		} else if (selectedIndex === selected.length - 1) {
			newSelected = newSelected.concat(selected.slice(0, -1))
		} else if (selectedIndex > 0) {
			newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1))
		}
		setSelected(newSelected)
	}

	const handleChangePage = (event, newPage) => {
		setPage(newPage)
	}

	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(parseInt(event.target.value, 10))
		setPage(0)
	}

	const isSelected = (id) => selected.indexOf(id) !== -1

	// Avoid a layout jump when reaching the last page with empty rows.
	const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - schemas.length) : 0

	// Filter and sort schemas based on search term and sorting
	const visibleRows = React.useMemo(() => {
		return stableSort(schemas, getComparator(order, orderBy))
			.filter((row) => row.schema_name.toLowerCase().includes(searchTerm.toLowerCase()))
			.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
	}, [order, orderBy, page, rowsPerPage, searchTerm, schemas])

	return (
		<Box sx={{ width: "100%" }}>
			<Grid container justifyContent="space-between" alignItems="center" mb={2} spacing={2}>
				<Grid item xs={12} md={9}>
					<Paper component="form" sx={{ p: "2px 4px", display: "flex", alignItems: "center", width: "100%" }}>
						<InputBase
							sx={{ ml: 1, flex: 1 }}
							placeholder="Search Silos"
							inputProps={{ "aria-label": "search silos" }}
							value={searchTerm}
							onChange={handleSearch} // Set up search handling
						/>
						<IconButton type="button" sx={{ p: "10px" }} aria-label="search">
							<SearchIcon />
						</IconButton>
					</Paper>
				</Grid>
				<Grid item xs={12} sm={12} md={3}>
					<Button
						variant="contained"
						startIcon={<AddIcon />}
						sx={{ fontSize: "0.875rem", width: "100%", height: 48 }}
						onClick={handleAddSiloOpen}
					>
						Create Silo
					</Button>
				</Grid>
			</Grid>
			<CreateSiloForm open={open} onClose={handleAddSiloClose} onSiloCreated={fetchSilos} />
			<Paper sx={{ width: "100%", mb: 2 }}>
				<EnhancedTableToolbar numSelected={selected.length} onDeleteSelected={handleDelete} />
				<ConfirmDeleteDialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)} onConfirm={confirmDelete} />
				<TableContainer>
					<Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
						<EnhancedTableHead
							numSelected={selected.length}
							order={order}
							orderBy={orderBy}
							onSelectAllClick={handleSelectAllClick}
							onRequestSort={handleRequestSort}
							rowCount={schemas.length}
						/>
						<TableBody>
							{visibleRows.map((row, index) => {
								const isItemSelected = isSelected(row.id)
								const labelId = `enhanced-table-checkbox-${index}`

								return (
									<TableRow
										hover
										onClick={(event) => handleClick(event, row.id)}
										role="checkbox"
										aria-checked={isItemSelected}
										tabIndex={-1}
										key={row.id}
										selected={isItemSelected}
									>
										<TableCell padding="checkbox">
											<Checkbox
												color="primary"
												checked={isItemSelected}
												inputProps={{
													"aria-labelledby": labelId,
												}}
											/>
										</TableCell>
										<TableCell component="th" scope="row" onClick={() => handleNameClick(row.id)}>
											{row.schema_name}
										</TableCell>
										<TableCell align="left">{row.created_at}</TableCell>
									</TableRow>
								)
							})}
							{emptyRows > 0 && (
								<TableRow
									style={{
										height: 53 * emptyRows,
									}}
								>
									<TableCell colSpan={6} />
								</TableRow>
							)}
						</TableBody>
					</Table>
				</TableContainer>
				<TablePagination
					rowsPerPageOptions={[5, 10, 25, 50]}
					component="div"
					count={schemas.length}
					rowsPerPage={rowsPerPage}
					page={page}
					onPageChange={handleChangePage}
					onRowsPerPageChange={handleChangeRowsPerPage}
				/>
			</Paper>
		</Box>
	)
}
