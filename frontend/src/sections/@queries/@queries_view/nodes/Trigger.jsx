import React from "react"
import { Handle } from "reactflow"
import { shallow } from "zustand/shallow"
import { tw } from "twind"
import { useStore } from "../Store"

const selector = (id) => (store) => ({
	setTriggerType: (e) => store.updateNode(id, { triggerType: e.target.value }),
	setTriggerDate: (e) => store.updateNode(id, { triggerDate: e.target.value }),
	manuallyTriggerWorkflow: () => store.triggerWorkflow(id),
})

/**
 * Represents a WorkflowTrigger component with a customized color theme.
 * @param {Object} props - The component props.
 * @param {string} props.id - The ID of the node.
 * @param {Object} props.data - The data object for the node, containing trigger details.
 * @returns {JSX.Element} The WorkflowTrigger component.
 */
export default function WorkflowTrigger({ id, data }) {
	const { setTriggerType, setTriggerDate, manuallyTriggerWorkflow } = useStore(selector(id), shallow)

	return (
		<div className={tw("rounded-md shadow-xl p-4")} style={{ backgroundColor: "#121617" }}>
			<p className={tw("rounded-t-md text-sm p-2")} style={{ backgroundColor: "#2F3638", color: "#fff" }}>
				Workflow Trigger
			</p>

			<div className={tw("mb-4")}>
				<label className={tw("flex flex-col")}>
					<span className={tw("text-xs font-bold mb-1")} style={{ color: "#fff" }}>
						Trigger Type
					</span>
					<select
						className="nodrag"
						value={data.triggerType}
						onChange={setTriggerType}
						style={{ backgroundColor: "#192021", color: "#fff" }}
					>
						<option value="manual">Manual</option>
						<option value="date">Date</option>
					</select>
				</label>
			</div>

			{data.triggerType === "date" && (
				<div className={tw("mb-4")}>
					<label className={tw("flex flex-col")}>
						<span className={tw("text-xs font-bold mb-1")} style={{ color: "#fff" }}>
							Trigger Date & Time
						</span>
						<input
							className="nodrag"
							type="datetime-local"
							value={data.triggerDate}
							onChange={setTriggerDate}
							style={{ backgroundColor: "#192021", color: "#fff" }}
						/>
					</label>
				</div>
			)}

			<button className={tw("rounded p-2 w-full")} onClick={manuallyTriggerWorkflow} style={{ backgroundColor: "#2F3638", color: "#fff" }}>
				Start Workflow
			</button>

			<Handle type="source" position="bottom" />
		</div>
	)
}
