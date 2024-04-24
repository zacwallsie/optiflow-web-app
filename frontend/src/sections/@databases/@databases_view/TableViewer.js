import React, { useState } from "react"
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	TextField,
	List,
	ListItem,
	ListItemIcon,
	ListItemText,
	Collapse,
	Paper,
	IconButton,
} from "@mui/material"
import { ExpandLess, ExpandMore, Folder, DataArray, AddBox, Edit, Delete } from "@mui/icons-material"

const initialTablesData = [
	{
		name: "Users",
		columns: [
			{ name: "id", type: "integer" },
			{ name: "name", type: "varchar(255)" },
			{ name: "email", type: "varchar(255)" },
		],
	},
	{
		name: "Orders",
		columns: [
			{ name: "order_id", type: "integer" },
			{ name: "product_id", type: "integer" },
			{ name: "quantity", type: "integer" },
			{ name: "order_date", type: "date" },
		],
	},
	{
		name: "Products",
		columns: [
			{ name: "id", type: "integer" },
			{ name: "name", type: "varchar(255)" },
			{ name: "price", type: "numeric" },
			{ name: "stock_quantity", type: "integer" },
		],
	},
	{
		name: "ProductReviews",
		columns: [
			{ name: "review_id", type: "integer" },
			{ name: "product_id", type: "integer" },
			{ name: "author", type: "varchar(255)" },
			{ name: "review_text", type: "text" },
			{ name: "rating", type: "integer" },
		],
	},
	// Add more tables as needed
]

export default function DataViewer() {
	const [tablesData, setTablesData] = useState(initialTablesData)
	const [open, setOpen] = useState({})
	const [isDialogOpen, setIsDialogOpen] = useState(false)
	const [newTableName, setNewTableName] = useState("")

	const handleClick = (index) => {
		setOpen({ ...open, [index]: !open[index] })
	}

	const handleAddTable = () => {
		const newTable = {
			name: newTableName,
			columns: [], // Initially empty
		}
		setTablesData([...tablesData, newTable])
		setIsDialogOpen(false)
		setNewTableName("")
	}

	return (
		<Paper sx={{ bgcolor: "grey.800", color: "grey.100", height: "100%" }}>
			<Button variant="contained" color="primary" onClick={() => setIsDialogOpen(true)} startIcon={<AddBox />}>
				Add New Table
			</Button>
			<Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
				<DialogTitle>Add New Table</DialogTitle>
				<DialogContent>
					<TextField
						autoFocus
						margin="dense"
						id="name"
						label="Table Name"
						type="text"
						fullWidth
						variant="standard"
						value={newTableName}
						onChange={(e) => setNewTableName(e.target.value)}
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setIsDialogOpen(false)}>Cancel</Button>
					<Button onClick={handleAddTable}>Add</Button>
				</DialogActions>
			</Dialog>
			<List component="nav" aria-labelledby="nested-list-subheader" sx={{ color: "grey.100" }}>
				{tablesData.map((table, index) => (
					<React.Fragment key={table.name}>
						<ListItem button onClick={() => handleClick(index)}>
							<ListItemIcon>
								<Folder color="primary" />
							</ListItemIcon>
							<ListItemText primary={table.name} />
							{open[index] ? <ExpandLess /> : <ExpandMore />}
							{/* Place buttons for editing and deleting tables here */}
						</ListItem>
						<Collapse in={open[index]} timeout="auto" unmountOnExit>
							<List component="div" disablePadding>
								{table.columns.map((column, columnIndex) => (
									<ListItem
										key={`${table.name}-${columnIndex}`}
										sx={{ pl: 4, display: "flex", alignItems: "center", justifyContent: "space-between" }}
									>
										<ListItemIcon>
											<DataArray />
										</ListItemIcon>
										<ListItemText primary={column.name} />
										<span
											style={{ backgroundColor: "grey.600", borderRadius: "10px", padding: "0.2em 0.5em", color: "grey.100" }}
										>
											{column.type}
										</span>
										{/* Icons for editing and deleting columns */}
									</ListItem>
								))}
							</List>
						</Collapse>
					</React.Fragment>
				))}
			</List>
		</Paper>
	)
}
