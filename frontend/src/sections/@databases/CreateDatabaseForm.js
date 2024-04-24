import React, { useState, useEffect } from "react"
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, DialogContentText, Alert } from "@mui/material"
import axios from "axios" // Make sure axios is installed

function CreateDatabaseForm({ open, onClose }) {
	const [dbData, setDbData] = useState({
		dbName: "",
		dbUser: "",
		dbPassword: "",
	})

	const [errors, setErrors] = useState({
		dbName: "",
		dbUser: "",
		dbPassword: "",
	})

	const [submitError, setSubmitError] = useState("")

	// Clear form when dialog is opened
	useEffect(() => {
		if (open) {
			setDbData({
				dbName: "",
				dbUser: "",
				dbPassword: "",
			})
			setErrors({
				dbName: "",
				dbUser: "",
				dbPassword: "",
			})
			setSubmitError("")
		}
	}, [open])

	const validateForm = () => {
		let tempErrors = { dbName: "", dbUser: "", dbPassword: "" }
		let isValid = true
		if (!dbData.dbName) {
			tempErrors.dbName = "Database name is required."
			isValid = false
		}
		if (!dbData.dbUser) {
			tempErrors.dbUser = "Database user is required."
			isValid = false
		}
		if (!dbData.dbPassword) {
			tempErrors.dbPassword = "Password is required."
			isValid = false
		}
		setErrors(tempErrors)
		return isValid
	}

	const handleChange = (event) => {
		setDbData({ ...dbData, [event.target.name]: event.target.value })
		setErrors({ ...errors, [event.target.name]: "" }) // Clear error on user correction
	}

	const handleSubmit = async () => {
		if (!validateForm()) {
			return // Prevent submission if form is invalid
		}
		try {
			const response = await axios.post("http://localhost:8000/api/v1/databases/create/", dbData)
			console.log(response.data) // Handle response appropriately
			onClose() // Close the dialog on successful creation
		} catch (error) {
			console.error("Error creating database:", error)
			setSubmitError("Failed to create database. Please try again.")
		}
	}

	return (
		<Dialog open={open} onClose={onClose} aria-labelledby="form-dialog-title">
			<DialogTitle id="form-dialog-title">Create New Database</DialogTitle>
			<DialogContent>
				<DialogContentText sx={{ mb: 2 }}>Enter details to create a new PostgreSQL database.</DialogContentText>
				{submitError && (
					<Alert severity="error" sx={{ mb: 2 }}>
						{submitError}
					</Alert>
				)}
				<TextField
					autoFocus
					margin="dense"
					name="dbName"
					label="Database Name"
					type="text"
					fullWidth
					variant="outlined"
					value={dbData.dbName}
					onChange={handleChange}
					error={!!errors.dbName}
					helperText={errors.dbName}
					sx={{ mt: 2 }}
				/>
				<TextField
					margin="dense"
					name="dbUser"
					label="Admin Username"
					type="text"
					fullWidth
					variant="outlined"
					value={dbData.dbUser}
					onChange={handleChange}
					error={!!errors.dbUser}
					helperText={errors.dbUser}
					sx={{ mt: 2 }}
				/>
				<TextField
					margin="dense"
					name="dbPassword"
					label="Password"
					type="password"
					fullWidth
					variant="outlined"
					value={dbData.dbPassword}
					onChange={handleChange}
					error={!!errors.dbPassword}
					helperText={errors.dbPassword}
					sx={{ mt: 2 }}
				/>
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose} color="primary">
					Cancel
				</Button>
				<Button onClick={handleSubmit} color="primary">
					Create
				</Button>
			</DialogActions>
		</Dialog>
	)
}

export default CreateDatabaseForm
