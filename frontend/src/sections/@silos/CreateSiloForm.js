import React, { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Alert } from "@mui/material"
import axios from "../../utils/axios"
import * as Yup from "yup"

function CreateSiloForm({ open, onClose, onSiloCreated }) {
	const [submitError, setSubmitError] = useState("")

	const siloSchema = Yup.object().shape({
		silo_name: Yup.string()
			.required("Silo name is required.")
			.matches(/^[a-zA-Z0-9_]+$/, "Silo name must be alphanumeric and can include underscores.")
			.min(3, "Silo name must be at least 3 characters long.")
			.max(30, "Silo name cannot be more than 30 characters long."),
	})

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm({
		resolver: yupResolver(siloSchema),
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
			const response = await axios.post("/api/v1/silos/", data)
			console.log(response.data)
			onClose()
			onSiloCreated()
		} catch (error) {
			console.error("Error creating silo:", error)
			setSubmitError(error.detail || "An error occurred while creating the silo.")
		}
	}

	return (
		<Dialog open={open} onClose={onClose} aria-labelledby="form-dialog-title">
			<DialogTitle id="form-dialog-title">Create New Silo</DialogTitle>
			<DialogContent>
				{submitError && (
					<Alert severity="error" sx={{ mb: 2 }}>
						{submitError}
					</Alert>
				)}
				<TextField
					autoFocus
					margin="normal"
					name="silo_name"
					label="Silo Name"
					type="text"
					fullWidth
					variant="outlined"
					autoComplete="off"
					error={!!errors.silo_name}
					helperText={errors.silo_name?.message}
					{...register("silo_name")}
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

export default CreateSiloForm
