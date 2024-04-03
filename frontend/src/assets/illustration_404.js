import { memo } from "react"
// @mui
import { Box } from "@mui/material"
//

// ----------------------------------------------------------------------

function PageNotFoundIllustration({ ...other }) {
	return (
		<Box {...other}>
			<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" fill="#FF2E00" viewBox="0 0 24 24">
				<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
			</svg>
		</Box>
	)
}

export default memo(PageNotFoundIllustration)
