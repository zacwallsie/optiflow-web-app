import { useState } from "react"
import { Button, TextField, Paper } from "@mui/material"

export default function QueryExecutor({ onExecute }) {
	const [query, setQuery] = useState("")

	return (
		<Paper sx={{ p: 2, mb: 2 }}>
			<TextField fullWidth label="Query" variant="outlined" value={query} onChange={(e) => setQuery(e.target.value)} multiline rows={4} />
			<Button sx={{ mt: 1 }} variant="contained" color="primary" onClick={() => onExecute(query)}>
				Execute Query
			</Button>
		</Paper>
	)
}
