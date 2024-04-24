import { useState } from "react"

export const useUndoableState = (initialValue) => {
	const [history, setHistory] = useState([initialValue])
	const [index, setIndex] = useState(0)

	const setState = (newValue) => {
		const newHistory = history.slice(0, index + 1) // Discard any future state if any
		newHistory.push(newValue)
		setHistory(newHistory)
		setIndex(index + 1) // Move the pointer to the new state
	}

	const undo = () => {
		if (index > 0) {
			setIndex(index - 1)
		}
	}

	const redo = () => {
		if (index < history.length - 1) {
			setIndex(index + 1)
		}
	}

	return [history[index], setState, undo, redo]
}
