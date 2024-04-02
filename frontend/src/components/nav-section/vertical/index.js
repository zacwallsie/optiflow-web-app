import PropTypes from "prop-types"
// @mui
import { List, Box } from "@mui/material"
//
import NavList from "./NavList"

// ----------------------------------------------------------------------

NavSectionVertical.propTypes = {
	isCollapse: PropTypes.bool,
	navConfig: PropTypes.array,
}

export default function NavSectionVertical({ navConfig, isCollapse, ...other }) {
	return (
		<Box {...other}>
			{navConfig.map((group) => (
				<List key={group.subheader} disablePadding sx={{ px: 2 }}>
					{group.items.map((list) => (
						<NavList key={list.title + list.path} data={list} depth={1} hasChildren={!!list.children} isCollapse={isCollapse} />
					))}
				</List>
			))}
		</Box>
	)
}
