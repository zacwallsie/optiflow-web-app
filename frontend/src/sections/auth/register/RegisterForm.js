import * as Yup from "yup"
import { useState } from "react"
// form
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
// @mui
import { Stack, IconButton, InputAdornment, Alert } from "@mui/material"
import { LoadingButton } from "@mui/lab"
// hooks
import useAuth from "../../../hooks/useAuth"
import useIsMountedRef from "../../../hooks/useIsMountedRef"
// components
import Iconify from "../../../components/Iconify"
import { FormProvider, RHFTextField } from "../../../components/hook-form"

// ----------------------------------------------------------------------

export default function RegisterForm() {
	const { register } = useAuth()

	const isMountedRef = useIsMountedRef()

	const [showPassword, setShowPassword] = useState(false)

	const RegisterSchema = Yup.object().shape({
		userName: Yup.string().required("Name required"),
		email: Yup.string().email("Email must be a valid email address").required("Email is required"),
		password: Yup.string()
			.min(8, "Password must be at least 8 characters long")
			.matches(/\d/, "Password must contain a number, a letter and a special character")
			.matches(/[a-zA-Z]/, "Password must contain a number, a letter and a special character")
			.matches(/[!@#$%^&*(),.?":{}|<>]/, "Password must contain a number, a letter and a special character")
			.required("Password is required"),
	})

	const defaultValues = {
		userName: "",
		email: "",
		password: "",
	}

	const methods = useForm({
		resolver: yupResolver(RegisterSchema),
		defaultValues,
	})

	const {
		reset,
		setError,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = methods

	const onSubmit = async (data) => {
		try {
			await register(data.userName, data.email, data.password)
		} catch (error) {
			reset()
			if (isMountedRef.current) {
				setError("afterSubmit", { ...error, message: error.detail })
			}
		}
	}

	return (
		<FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
			<Stack spacing={3}>
				{!!errors.afterSubmit && <Alert severity="error">{errors.afterSubmit.message}</Alert>}
				<RHFTextField name="userName" label="Full name" />

				<RHFTextField name="email" label="Email address" />

				<RHFTextField
					name="password"
					label="Password"
					type={showPassword ? "text" : "password"}
					InputProps={{
						endAdornment: (
							<InputAdornment position="end">
								<IconButton edge="end" onClick={() => setShowPassword(!showPassword)}>
									<Iconify icon={showPassword ? "eva:eye-fill" : "eva:eye-off-fill"} />
								</IconButton>
							</InputAdornment>
						),
					}}
				/>

				<LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting}>
					Register
				</LoadingButton>
			</Stack>
		</FormProvider>
	)
}
