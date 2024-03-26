import React, { useState } from "react"
import Button from "../UI/Button"
import Input from "../UI/Input"

const ExistingDatabaseForm = ({ onAdd }) => {
	// State for each input
	const [host, setHost] = useState("")
	// ... other states like port, databaseName, username, password

	const handleSubmit = (event) => {
		event.preventDefault()
		onAdd({ host /* ... other fields */ })
		// Reset all inputs after submission
	}

	return (
		<form onSubmit={handleSubmit}>
			<Input type="text" placeholder="Host" value={host} onChange={(e) => setHost(e.target.value)} />
			{/* Repeat for other inputs */}
			<Button type="submit">Add</Button>
		</form>
	)
}

export default ExistingDatabaseForm
