import { useState } from "react"
import { Button, Table, TableBody, TableCell, TableHead, TableRow, Paper } from "@mui/material"

export default function DataManagement({ tables }) {
	// `tables` could be an array of objects representing database tables/collections

	const [selectedTable, setSelectedTable] = useState(null)

	return (
		<Paper sx={{ p: 2 }}>
			<Table>
				<TableHead>
					<TableRow>
						<TableCell>Table/Collection Name</TableCell>
						<TableCell align="right">Actions</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{tables.map((table) => (
						<TableRow key={table.name} selected={table.name === selectedTable}>
							<TableCell component="th" scope="row">
								{table.name}
							</TableCell>
							<TableCell align="right">
								<Button
									size="small"
									onClick={() => {
										/* Handle View */
									}}
								>
									View
								</Button>
								<Button
									size="small"
									onClick={() => {
										/* Handle Edit */
									}}
								>
									Edit
								</Button>
								<Button
									size="small"
									onClick={() => {
										/* Handle Delete */
									}}
								>
									Delete
								</Button>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</Paper>
	)
}
