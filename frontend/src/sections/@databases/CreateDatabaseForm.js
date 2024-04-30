import React, { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, DialogContentText, Alert } from "@mui/material"
import axios from "../../utils/axios"
import * as Yup from "yup"

function CreateDatabaseForm({ open, onClose }) {
	const [submitError, setSubmitError] = useState("")

	const databaseSchema = Yup.object().shape({
		schema_name: Yup.string()
			.required("Database name is required.")
			.matches(/^[a-zA-Z0-9_]+$/, "Database name must be alphanumeric and can include underscores.")
			.min(3, "Database name must be at least 3 characters long.")
			.max(30, "Database name cannot be more than 30 characters long."),
	})

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm({
		resolver: yupResolver(databaseSchema),
		mode: "onChange",
	})

	useEffect(() => {
		if (open) {
			reset()
			setSubmitError("")
		}
	}, [open, reset])

	const onSubmit = async (data) => {
		try {
			const response = await axios.post("/api/v1/silos/create/", data)
			console.log(response.data)
			onClose()
		} catch (error) {
			console.error("Error creating database:", error)
			setSubmitError(error.detail || "An error occurred while creating the silo.")
		}
	}

	return (
		<Dialog open={open} onClose={onClose} aria-labelledby="form-dialog-title">
			<DialogTitle id="form-dialog-title">Create New Database</DialogTitle>
			<DialogContent>
				<DialogContentText sx={{ mb: 2 }}>Enter details for the new PostgreSQL database.</DialogContentText>
				{submitError && (
					<Alert severity="error" sx={{ mb: 2 }}>
						{submitError}
					</Alert>
				)}
				<TextField
					autoFocus
					margin="dense"
					name="schema_name"
					label="Database Name"
					type="text"
					fullWidth
					variant="outlined"
					error={!!errors.schema_name}
					helperText={errors.schema_name?.message}
					{...register("schema_name")}
					sx={{ mt: 2 }}
				/>
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose} color="primary">
					Cancel
				</Button>
				<Button onClick={handleSubmit(onSubmit)} color="primary">
					Create
				</Button>
			</DialogActions>
		</Dialog>
	)
}

export default CreateDatabaseForm
