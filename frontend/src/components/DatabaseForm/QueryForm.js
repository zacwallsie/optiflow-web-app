import React, { useState } from "react"
import Button from "../UI/Button"
import TextArea from "../UI/TextArea"

const QueryForm = ({ onExecute }) => {
	const [query, setQuery] = useState("")

	const handleSubmit = (event) => {
		event.preventDefault()
		onExecute(query)
		setQuery("") // Reset the textarea after submission
	}

	return (
		<form onSubmit={handleSubmit}>
			<TextArea placeholder="Write your SQL query here" rows="6" value={query} onChange={(e) => setQuery(e.target.value)} />
			<Button type="submit">Execute</Button>
		</form>
	)
}

export default QueryForm
