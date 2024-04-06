export default function Table(theme) {
	return {
		MuiTableRow: {
			styleOverrides: {
				root: {
					"&.Mui-selected": {
						backgroundColor: theme.palette.action.selected,
						"&:hover": {
							backgroundColor: theme.palette.action.hover,
						},
					},
				},
			},
		},
		MuiTableCell: {
			styleOverrides: {
				root: {
					borderBottom: `1px solid ${theme.palette.background.neutral}`,
					textAlign: "left",
				},
				head: {
					color: theme.palette.text.secondary,
					backgroundColor: theme.palette.background.neutral,
					"&:first-of-type": {
						paddingLeft: theme.spacing(3),
						borderTopLeftRadius: theme.shape.borderRadius,
						borderBottomLeftRadius: theme.shape.borderRadius,
					},
					"&:last-of-type": {
						paddingRight: theme.spacing(3),
						borderTopRightRadius: theme.shape.borderRadius,
						borderBottomRightRadius: theme.shape.borderRadius,
					},
				},
				stickyHeader: {
					backgroundColor: theme.palette.background.paper,
					backgroundImage: `linear-gradient(to bottom, ${theme.palette.background.neutral} 0%, ${theme.palette.background.neutral} 100%)`,
				},
				body: {
					"&:first-of-type": {
						fontWeight: "bold",
						paddingLeft: theme.spacing(3),
						cursor: "pointer",
						textDecoration: "none", // Ensure text is not underlined by default
						"&:hover": {
							textDecoration: "underline", // Underline on hover for the first column cells
						},
					},
					"&:last-of-type": {
						paddingRight: theme.spacing(3),
					},
				},
			},
		},
		MuiTablePagination: {
			styleOverrides: {
				root: {
					borderTop: `solid 1px ${theme.palette.divider}`,
				},
				toolbar: {
					height: 64,
				},
				select: {
					"&:focus": {
						borderRadius: theme.shape.borderRadius,
					},
				},
				selectIcon: {
					width: 20,
					height: 20,
					marginTop: -4,
				},
			},
		},
	}
}
