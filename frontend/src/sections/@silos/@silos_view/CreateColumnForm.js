import React from "react"
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	TextField,
	Checkbox,
	FormControlLabel,
	FormGroup,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	Collapse,
} from "@mui/material"
import { useForm, Controller } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import axios from "../../../utils/axios" // Ensure correct path
import { useSnackbar } from "notistack"

const postgresDataTypes = ["bigint", "boolean", "date", "integer", "numeric", "real", "smallint", "text", "timestamp", "uuid", "varchar"]

// Define the validation schema using Yup
const columnSchema = yup.object({
	columnName: yup.string().required("Column name is required"),
	dataType: yup.string().required("Data type is required"),
	defaultVal: yup.string(),
	checkConstraint: yup.string(),
	createIndex: yup.boolean(),
	collation: yup.string(),
})

function CreateColumnForm({ open, handleClose, tableName, siloId }) {
	const { enqueueSnackbar } = useSnackbar()
	const {
		register,
		handleSubmit,
		control,
		formState: { errors },
		reset,
	} = useForm({
		resolver: yupResolver(columnSchema),
		defaultValues: {
			columnName: "",
			dataType: postgresDataTypes[0],
			defaultVal: "",
			checkConstraint: "",
			createIndex: false,
			collation: "",
		},
	})
	const [showAdvanced, setShowAdvanced] = React.useState(false)

	const handleToggleAdvanced = () => {
		setShowAdvanced(!showAdvanced)
	}

	const onSubmit = async (data) => {
		axios
			.post(`/api/v1/silos/${siloId}/tables/${tableName}/columns/`, data)
			.then((response) => {
				console.log("Column added successfully:", response.data)
				handleClose()
			})
			.catch((error) => {
				console.error("Error fetching table names:", error)
				enqueueSnackbar("Failed to Add Column - " + (error?.detail || "Unknown Error"), {
					variant: "error",
					autoHideDuration: 4000,
				})
			})
	}

	return (
		<Dialog
			open={open}
			onClose={() => {
				handleClose()
				reset()
			}}
		>
			<DialogTitle>Add New Column to {tableName}</DialogTitle>
			<form onSubmit={handleSubmit(onSubmit)}>
				<DialogContent>
					<TextField
						autoFocus
						margin="dense"
						id="columnName"
						label="Column Name *"
						type="text"
						fullWidth
						autoComplete="off"
						error={!!errors.columnName}
						helperText={errors.columnName?.message}
						{...register("columnName")}
					/>
					<FormControl fullWidth margin="dense" error={!!errors.dataType}>
						<InputLabel id="data-type-label">Data Type *</InputLabel>
						<Controller
							name="dataType"
							control={control}
							render={({ field, fieldState: { error } }) => (
								<Select
									{...field}
									labelId="data-type-label"
									id="data-type-select"
									label="Data Type"
									MenuProps={{ PaperProps: { style: { maxHeight: 200 } } }}
									error={!!error}
								>
									{postgresDataTypes.map((type) => (
										<MenuItem key={type} value={type}>
											{type}
										</MenuItem>
									))}
								</Select>
							)}
						/>
						{errors.dataType && <p style={{ color: "#f44336", margin: "3px 14px", fontSize: "0.75rem" }}>{errors.dataType.message}</p>}
					</FormControl>
					<FormGroup>
						<FormControlLabel control={<Checkbox {...register("isUnique")} />} label="Unique" />
						<FormControlLabel control={<Checkbox {...register("isNullable")} />} label="Nullable" />
					</FormGroup>
					<Button onClick={handleToggleAdvanced} color="primary" sx={{ marginTop: "20px" }}>
						{showAdvanced ? "Hide Advanced Options" : "Show Advanced Options"}
					</Button>
					<Collapse in={showAdvanced}>
						<TextField
							margin="dense"
							id="default-value"
							label="Default Value"
							type="text"
							fullWidth
							autoComplete="off"
							{...register("defaultVal")}
						/>
						<TextField
							margin="dense"
							id="check-constraint"
							label="Check Constraint"
							type="text"
							autoComplete="off"
							fullWidth
							{...register("checkConstraint")}
						/>
						<FormControlLabel control={<Checkbox {...register("createIndex")} />} label="Create Index" />
						<TextField
							margin="dense"
							id="collation"
							label="Collation"
							type="text"
							fullWidth
							autoComplete="off"
							{...register("collation")}
						/>
					</Collapse>
				</DialogContent>
				<DialogActions>
					<Button
						onClick={() => {
							handleClose()
							reset()
						}}
						color="primary"
					>
						Cancel
					</Button>
					<Button type="submit" color="primary">
						Add Column
					</Button>
				</DialogActions>
			</form>
		</Dialog>
	)
}

export default CreateColumnForm
