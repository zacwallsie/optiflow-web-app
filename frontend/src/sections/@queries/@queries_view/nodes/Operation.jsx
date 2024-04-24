import React from "react"
import { Handle } from "reactflow"
import { shallow } from "zustand/shallow"
import { tw } from "twind"
import { useStore } from "../Store"

const selector = (id) => (store) => ({
	setCondition: (e) => store.updateNode(id, { condition: e.target.value }),
})

/**
 * Represents a LogicGate component that can perform various logical operations
 * in a workflow depending on certain conditions.
 * @param {Object} props - The component props.
 * @param {string} props.id - The ID of the node.
 * @param {Object} props.data - The data object for the node, containing condition details.
 * @returns {JSX.Element} The LogicGate component.
 */
export default function LogicGate({ id, data }) {
	const { setCondition } = useStore(selector(id), shallow)

	return (
		<div className={tw("rounded-md shadow-xl p-4")} style={{ backgroundColor: "#121617" }}>
			<Handle className={tw("w-2 h-2")} type="target" position="top" />

			<p className={tw("rounded-t-md text-sm p-2")} style={{ backgroundColor: "#2F3638", color: "#fff" }}>
				Logic Gate
			</p>
			<label className={tw("flex flex-col")}>
				<span className={tw("text-xs font-bold mb-1")} style={{ color: "#fff" }}>
					Condition
				</span>
				<select className="nodrag" value={data.condition} onChange={setCondition} style={{ backgroundColor: "#192021", color: "#fff" }}>
					<option value="AND">AND</option>
					<option value="OR">OR</option>
					<option value="NOT">NOT</option>
					<option value="NAND">NAND</option>
					<option value="NOR">NOR</option>
					<option value="XOR">XOR</option>
					<option value="XNOR">XNOR</option>
				</select>
			</label>

			<Handle className={tw("w-2 h-2")} type="source" position="bottom" />
		</div>
	)
}
