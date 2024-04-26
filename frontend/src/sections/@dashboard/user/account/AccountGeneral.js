import * as Yup from "yup"
import { useSnackbar } from "notistack"
import { useCallback } from "react"
// form
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
// @mui
import { Box, Grid, Card, Stack, Typography } from "@mui/material"
import { LoadingButton } from "@mui/lab"
// hooks
import useAuth from "../../../../hooks/useAuth"
// utils
import { fData } from "../../../../utils/formatNumber"
// _mock
import { countries } from "../../../../_mock"
// components
import { FormProvider, RHFSelect, RHFTextField } from "../../../../components/hook-form"

// ----------------------------------------------------------------------

export default function AccountGeneral() {
	const { enqueueSnackbar } = useSnackbar()

	const { user } = useAuth()

	const UpdateUserSchema = Yup.object().shape({
		displayName: Yup.string().required("Name is required"),
	})

	const defaultValues = {
		displayName: user?.displayName || "",
		email: user?.email || "",
	}

	const methods = useForm({
		resolver: yupResolver(UpdateUserSchema),
		defaultValues,
	})

	const {
		handleSubmit,
		formState: { isSubmitting },
	} = methods

	const onSubmit = async () => {
		try {
			await new Promise((resolve) => setTimeout(resolve, 500))
			enqueueSnackbar("Update success!")
		} catch (error) {
			console.error(error)
		}
	}

	return (
		<FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
			<Grid container spacing={3}>
				<Grid item xs={12} md={8}>
					<Card sx={{ p: 3 }}>
						<Box
							sx={{
								display: "grid",
								rowGap: 3,
								columnGap: 2,
								gridTemplateColumns: { xs: "repeat(1, 1fr)" },
							}}
						>
							<RHFTextField name="displayName" label="Full Name" />
							<RHFTextField name="email" label="Email Address" />
						</Box>

						<Stack spacing={3} alignItems="flex-end" sx={{ mt: 3 }}>
							<LoadingButton type="submit" variant="contained" loading={isSubmitting}>
								Save Changes
							</LoadingButton>
						</Stack>
					</Card>
				</Grid>
			</Grid>
		</FormProvider>
	)
}
