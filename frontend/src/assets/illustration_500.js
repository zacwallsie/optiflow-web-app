import { memo } from "react"
// @mui
import { Box } from "@mui/material"
//

// ----------------------------------------------------------------------

function SeverErrorIllustration({ ...other }) {
	return (
		<Box {...other}>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="100%"
				height="100%"
				fill="none"
				stroke="#FF2E00"
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth={2}
				viewBox="0 0 24 24"
			>
				<path d="M6 10H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-2M6 14H4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2h-2M6 6h.01M6 18h.01" />
				<path d="m13 6-4 6h6l-4 6" />
			</svg>
		</Box>
	)
}

export default memo(SeverErrorIllustration)
