import * as React from "react"
import PropTypes from "prop-types"
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
import { QueryStatusIndicator, stableSort, getComparator } from "../section_utils/index"

function createData(id, name, description, status, create_date, modified_date) {
	return {
		id,
		name,
		description,
		status,
		create_date,
		modified_date,
	}
}

const rows = [
	createData(1, "User Data Cleanup", "Remove inactive users from the system", "AwaitingTrigger", "2023-04-01", "2023-04-02"),
	createData(2, "Daily Sales Report", "Generate daily sales report for marketing team", "AwaitingTrigger", "2023-03-25", "2023-03-25"),
	createData(3, "Email Campaign Feedback", "Collect feedback on the latest email campaign", "Failed", "2023-03-20", "2023-03-21"),
	createData(4, "Database Backup", "Weekly backup of all customer data", "PendingExecution", "2023-03-15", "2023-03-22"),
	createData(5, "Data Migration", "Migrate user data to the new platform", "InProgress", "2023-03-10", "2023-03-17"),
	createData(6, "System Health Check", "Run diagnostics on all system databases", "AwaitingTrigger", "2023-03-05", "2023-03-05"),
	createData(7, "Update Customer Records", "Update records for all customers in the EU region", "Paused", "2023-02-28", "2023-03-01"),
	createData(8, "Inventory Sync", "Synchronize inventory data with external suppliers", "PendingExecution", "2023-02-20", "2023-02-21"),
	createData(9, "Optimize Search Engine", "Optimize search engine for faster query responses", "AwaitingTrigger", "2023-02-15", "2023-02-16"),
	createData(10, "Audit Log Review", "Review audit logs for Q1", "AwaitingTrigger", "2023-02-10", "2023-02-17"),
	createData(11, "Cleanup Temporary Files", "Remove all temporary files older than 30 days", "InProgress", "2023-02-05", "2023-02-12"),
	createData(12, "Validate User Permissions", "Ensure all users have correct permissions", "Failed", "2023-01-31", "2023-02-01"),
	createData(13, "Server Migration", "Migrate servers to new data center", "Paused", "2023-01-25", "2023-01-26"),
	createData(14, "Update Pricing Info", "Update product pricing information in the database", "AwaitingTrigger", "2023-01-20", "2023-01-21"),
	createData(15, "Legacy Data Archival", "Archive all legacy data before 2015", "AwaitingTrigger", "2023-01-15", "2023-01-16"),
	createData(16, "Security Patch Update", "Apply latest security patches to the database", "AwaitingTrigger", "2023-01-10", "2023-01-17"),
	createData(17, "Refresh Materialized Views", "Refresh all materialized views in the reporting DB", "InProgress", "2023-01-05", "2023-01-12"),
	createData(18, "User Engagement Analysis", "Analyze user engagement for the new feature", "PendingExecution", "2022-12-31", "2023-01-01"),
	createData(19, "Fix Duplicate Records", "Identify and fix all duplicate records in user table", "Failed", "2022-12-25", "2022-12-26"),
	createData(20, "Optimize Image Storage", "Compress and optimize stored images", "AwaitingTrigger", "2022-12-20", "2022-12-27"),
]

const headCells = [
	{
		id: "name",
		numeric: false,
		disablePadding: false,
		label: "Name",
	},
	{
		id: "description",
		numeric: false,
		disablePadding: false,
		label: "Description",
	},
	{
		id: "status",
		numeric: false,
		disablePadding: false,
		label: "Query Status",
	},
	{
		id: "create_date",
		numeric: false,
		disablePadding: false,
		label: "Create Date",
	},
	{
		id: "modified_date",
		numeric: false,
		disablePadding: false,
		label: "Modified Date",
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
							"aria-label": "select all queries",
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
	const { numSelected } = props

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
					Created Queries
				</Typography>
			)}

			{numSelected > 0 ? (
				<Tooltip title="Delete">
					<IconButton>
						<DeleteIcon />
					</IconButton>
				</Tooltip>
			) : (
				<Tooltip title="Filter list">
					<IconButton>
						<FilterListIcon />
					</IconButton>
				</Tooltip>
			)}
		</Toolbar>
	)
}

EnhancedTableToolbar.propTypes = {
	numSelected: PropTypes.number.isRequired,
}

export default function DatabaseTable() {
	const [order, setOrder] = React.useState("asc")
	const [orderBy, setOrderBy] = React.useState("calories")
	const [selected, setSelected] = React.useState([])
	const [page, setPage] = React.useState(0)
	const [rowsPerPage, setRowsPerPage] = React.useState(10)
	const [searchTerm, setSearchTerm] = React.useState("")
	const navigate = useNavigate()

	const handleNameClick = (queryId) => {
		navigate(`/flow/queries/${queryId}`)
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
			const newSelected = rows.map((n) => n.id)
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
	const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0

	const visibleRows = React.useMemo(() => {
		return stableSort(rows, getComparator(order, orderBy))
			.filter((row) => row.name.toLowerCase().includes(searchTerm.toLowerCase()))
			.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
	}, [order, orderBy, page, rowsPerPage, searchTerm])

	return (
		<Box sx={{ width: "100%" }}>
			<Grid container justifyContent="space-between" alignItems="center" mb={2} spacing={2}>
				<Grid item xs={12} md={10}>
					<Paper component="form" sx={{ p: "2px 4px", display: "flex", alignItems: "center", width: "100%" }}>
						<InputBase
							sx={{ ml: 1, flex: 1 }}
							placeholder="Search Queries"
							inputProps={{ "aria-label": "search databases" }}
							value={searchTerm}
							onChange={handleSearch} // Set up search handling
						/>
						<IconButton type="button" sx={{ p: "10px" }} aria-label="search">
							<SearchIcon />
						</IconButton>
					</Paper>
				</Grid>
				<Grid item xs={12} md={2}>
					<Button variant="contained" startIcon={<AddIcon />} sx={{ fontSize: "0.875rem", width: "100%", height: 48 }}>
						Create Query
					</Button>
				</Grid>
			</Grid>
			<Paper sx={{ width: "100%", mb: 2 }}>
				<EnhancedTableToolbar numSelected={selected.length} />
				<TableContainer>
					<Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
						<EnhancedTableHead
							numSelected={selected.length}
							order={order}
							orderBy={orderBy}
							onSelectAllClick={handleSelectAllClick}
							onRequestSort={handleRequestSort}
							rowCount={rows.length}
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
											{row.name}
										</TableCell>
										<TableCell align="left">{row.description}</TableCell>
										<TableCell align="left">
											<QueryStatusIndicator status={row.status} />
										</TableCell>
										<TableCell align="left">{row.create_date}</TableCell>
										<TableCell align="left">{row.modified_date}</TableCell>
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
					count={rows.length}
					rowsPerPage={rowsPerPage}
					page={page}
					onPageChange={handleChangePage}
					onRowsPerPageChange={handleChangeRowsPerPage}
				/>
			</Paper>
		</Box>
	)
}
