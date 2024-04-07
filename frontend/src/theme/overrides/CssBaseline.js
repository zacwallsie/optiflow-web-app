// ----------------------------------------------------------------------

export default function CssBaseline() {
	return {
		MuiCssBaseline: {
			styleOverrides: {
				// Hide scrollbar for body and html
				"html, body": {
					overflow: "hidden", // Hide the main scrollbar
				},
				// Apply custom scrollbar styles specifically to elements that can scroll
				"*": {
					// Resetting box sizing, margins, and paddings
					margin: 0,
					padding: 0,
					boxSizing: "border-box",
				},
				// Target all possible scrollable areas except for html and body
				"*:not(html, body)": {
					"scrollbar-width": "thin", // For Firefox
					"scrollbar-color": "#192021 #121617", // For Firefox, using paper for thumb and default for track
				},
				"*:not(html, body)::-webkit-scrollbar": {
					width: "8px", // Scrollbar width
					height: "8px", // Scrollbar height for horizontal scrollbars
				},
				"*:not(html, body)::-webkit-scrollbar-track": {
					background: "#121617", // Use default for scrollbar track color
					borderRadius: "10px",
				},
				"*:not(html, body)::-webkit-scrollbar-thumb": {
					backgroundColor: "#192021", // Use paper for scrollbar thumb color
					borderRadius: "10px",
					border: "2px solid #121617", // Creates padding around the scrollbar thumb with the default color
				},
				"*:not(html, body)::-webkit-scrollbar-thumb:hover": {
					backgroundColor: "#2F3638", // Use neutral for scrollbar thumb color on hover
				},
				input: {
					"&[type=number]": {
						MozAppearance: "textfield",
						"&::-webkit-outer-spin-button, &::-webkit-inner-spin-button": {
							margin: 0,
							WebkitAppearance: "none",
						},
					},
				},
				img: {
					display: "block",
					maxWidth: "100%",
				},
			},
		},
	}
}
