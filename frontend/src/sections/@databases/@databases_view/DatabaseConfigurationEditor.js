import { Button, TextField, Grid, Paper } from "@mui/material"

export default function DatabaseConfigurationEditor({ config, onSave }) {
	// Assume `config` is an object containing configuration fields
	// and `onSave` is a function to save the edited configuration

	return (
		<Paper sx={{ p: 2 }}>
			<Grid container spacing={2}>
				{Object.keys(config).map((key) => (
					<Grid item xs={12} sm={6} key={key}>
						<TextField
							fullWidth
							label={key}
							variant="outlined"
							value={config[key]}
							onChange={(e) => {
								/* Handle change */
							}}
						/>
					</Grid>
				))}
				<Grid item xs={12}>
					<Button variant="contained" color="primary" onClick={onSave}>
						Save Configuration
					</Button>
				</Grid>
			</Grid>
		</Paper>
	)
}
