import React, { useState } from "react"
import Button from "../UI/Button"
import Input from "../UI/Input"

const NewDatabaseForm = ({ onCreate }) => {
	const [databaseName, setDatabaseName] = useState("")

	const handleSubmit = (event) => {
		event.preventDefault()
		onCreate(databaseName)
		setDatabaseName("") // Reset the input after submission
	}

	return (
		<form onSubmit={handleSubmit}>
			<Input type="text" placeholder="Database Name" value={databaseName} onChange={(e) => setDatabaseName(e.target.value)} />
			<Button type="submit">Create</Button>
		</form>
	)
}

export default NewDatabaseForm
