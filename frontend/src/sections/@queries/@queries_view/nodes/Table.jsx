import React, { useState } from "react"
import { Handle } from "reactflow"
import { shallow } from "zustand/shallow"
import { tw } from "twind"
import { useStore } from "../Store"

const selector = (id) => (store) => ({
	// Placeholder for any store functions you might need
})

/**
 * Represents a TableNode component that displays a table name and a list of properties
 * which can be expanded and used to add edges to operations.
 * @param {Object} props - The component props.
 * @param {string} props.id - The ID of the node.
 * @param {Object} props.data - The data object for the node, containing table details.
 * @returns {JSX.Element} The TableNode component.
 */
export default function TableNode({ id, data }) {
	const [isCollapsed, setIsCollapsed] = useState(true)
	const toggleCollapse = () => setIsCollapsed(!isCollapsed)

	return (
		<div className={tw("rounded-md shadow-xl p-4")} style={{ backgroundColor: "#121617" }}>
			<div onClick={toggleCollapse} className={tw("cursor-pointer")}>
				<p className={tw("rounded-t-md text-sm p-2")} style={{ backgroundColor: "#2F3638", color: "#fff" }}>
					{data.tableName || "Unnamed Table"}
				</p>
			</div>
			{!isCollapsed && (
				<div>
					{data.properties.map((prop, index) => (
						<div key={index} className={tw("flex justify-between items-center py-1")}>
							<span style={{ color: "#fff" }}>{prop.name}</span>
							<Handle id={`prop_${index}`} className={tw("w-2 h-2")} type="source" position="right" style={{ background: "#2F3638" }} />
						</div>
					))}
				</div>
			)}
		</div>
	)
}
