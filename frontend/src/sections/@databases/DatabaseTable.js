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
import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import PauseCircleFilledIcon from "@mui/icons-material/PauseCircleFilled"
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline"

function createData(id, name, type, status, host, port) {
	return {
		id,
		name,
		type,
		status,
		host,
		port,
	}
}

const rows = [
	createData(1, "Prod DB", "MySQL", "Active", "prod-db.example.com", 3306),
	createData(2, "Test DB", "PostgreSQL", "Idle", "test-db.example.com", 5432),
	createData(3, "Dev DB", "MongoDB", "Disconnected", "dev-db.example.com", 27017),
	createData(4, "Analytics DB", "Redis", "Active", "analytics-db.example.com", 6379),
	createData(5, "Backup DB", "SQLite", "Idle", "backup-db.example.com", 0),
	createData(6, "Staging DB", "MySQL", "Active", "staging-db.example.com", 3306),
	createData(7, "Logs DB", "Elasticsearch", "Active", "logs-db.example.com", 9200),
	createData(8, "Archive DB", "PostgreSQL", "Idle", "archive-db.example.com", 5432),
	createData(9, "Cache DB", "Redis", "Disconnected", "cache-db.example.com", 6379),
	createData(10, "Session DB", "MongoDB", "Active", "session-db.example.com", 27017),
	createData(11, "Marketing DB", "Neo4j", "Active", "marketing-db.example.com", 7474),
	createData(12, "HR DB", "Oracle", "Idle", "hr-db.example.com", 1521),
	createData(13, "Sales DB", "DynamoDB", "Active", "sales-db.example.com", 8000),
	createData(14, "Customer Support DB", "Cassandra", "Disconnected", "support-db.example.com", 9042),
	createData(15, "Research DB", "MariaDB", "Idle", "research-db.example.com", 3306),
	createData(16, "Financial DB", "SQL Server", "Active", "financial-db.example.com", 1433),
	createData(17, "Product DB", "Couchbase", "Disconnected", "product-db.example.com", 8091),
	createData(18, "Development DB", "PostgreSQL", "Active", "dev-db.example.com", 5432),
	createData(19, "Testing DB", "MySQL", "Idle", "testing-db.example.com", 3306),
	createData(20, "Operations DB", "SQLite", "Active", "operations-db.example.com", 0),
]

function descendingComparator(a, b, orderBy) {
	if (b[orderBy] < a[orderBy]) {
		return -1
	}
	if (b[orderBy] > a[orderBy]) {
		return 1
	}
	return 0
}

function getComparator(order, orderBy) {
	return order === "desc" ? (a, b) => descendingComparator(a, b, orderBy) : (a, b) => -descendingComparator(a, b, orderBy)
}

// Since 2020 all major browsers ensure sort stability with Array.prototype.sort().
// stableSort() brings sort stability to non-modern browsers (notably IE11). If you
// only support modern browsers you can replace stableSort(exampleArray, exampleComparator)
// with exampleArray.slice().sort(exampleComparator)
function stableSort(array, comparator) {
	const stabilizedThis = array.map((el, index) => [el, index])
	stabilizedThis.sort((a, b) => {
		const order = comparator(a[0], b[0])
		if (order !== 0) {
			return order
		}
		return a[1] - b[1]
	})
	return stabilizedThis.map((el) => el[0])
}

const headCells = [
	{
		id: "name",
		numeric: false,
		disablePadding: false,
		label: "Database Name",
	},
	{
		id: "type",
		numeric: true,
		disablePadding: false,
		label: "Type",
	},
	{
		id: "status",
		numeric: true,
		disablePadding: false,
		label: "Connection Status",
	},
	{
		id: "host",
		numeric: true,
		disablePadding: false,
		label: "Host",
	},
	{
		id: "port",
		numeric: true,
		disablePadding: false,
		label: "Port",
	},
]

const StatusIndicator = ({ status }) => {
	const statusStyles = {
		Active: { color: "success.main", icon: <CheckCircleIcon fontSize="small" /> },
		Idle: { color: "warning.main", icon: <PauseCircleFilledIcon fontSize="small" /> },
		Disconnected: { color: "error.main", icon: <ErrorOutlineIcon fontSize="small" /> },
	}

	const { color, icon } = statusStyles[status] || {}

	return (
		<Box
			sx={{
				display: "flex",
				alignItems: "center",
				justifyContent: "start",
				border: 2,
				borderColor: color,
				bgcolor: "transparent", // Set background color to transparent
				borderRadius: "20px",
				p: 0.1,
				pr: 1,
				width: "fit-content",
			}}
		>
			{React.cloneElement(icon, { sx: { color } })} {/* Apply color to the icon */}
			<Typography variant="body2" sx={{ ml: 0.5, color }}>
				{" "}
				{/* Apply color to the text */}
				{status}
			</Typography>
		</Box>
	)
}

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
							"aria-label": "select all databases",
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
					Connected Databases
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

	const handleNameClick = (databaseId) => {
		navigate(`/dashboard/databases/${databaseId}`)
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
				<Grid item xs={12} md={8}>
					<Paper component="form" sx={{ p: "2px 4px", display: "flex", alignItems: "center", width: "100%" }}>
						<InputBase
							sx={{ ml: 1, flex: 1 }}
							placeholder="Search Databases"
							inputProps={{ "aria-label": "search databases" }}
							value={searchTerm}
							onChange={handleSearch} // Set up search handling
						/>
						<IconButton type="button" sx={{ p: "10px" }} aria-label="search">
							<SearchIcon />
						</IconButton>
					</Paper>
				</Grid>
				<Grid item xs={6} sm={6} md={2}>
					<Button variant="contained" startIcon={<AddIcon />} sx={{ fontSize: "0.875rem", width: "100%", height: 48 }}>
						Add Connection
					</Button>
				</Grid>
				<Grid item xs={6} sm={6} md={2}>
					<Button variant="contained" startIcon={<AddIcon />} sx={{ fontSize: "0.875rem", width: "100%", height: 48 }}>
						Create Database
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
										<TableCell align="left">{row.type}</TableCell>
										<TableCell align="left">
											<StatusIndicator status={row.status} />
										</TableCell>
										<TableCell align="left">{row.host}</TableCell>
										<TableCell align="left">{row.port}</TableCell>
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
