import React from "react"
import { Pie } from "react-chartjs-2"
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js"

ChartJS.register(ArcElement, Tooltip, Legend)

export default function DatabaseHealthOverview() {
	// Sample data - replace with actual data
	const data = {
		labels: ["Active", "Idle", "Issues Detected"],
		datasets: [
			{
				data: [300, 50, 100], // Example data
				backgroundColor: ["rgba(75, 192, 192, 0.2)", "rgba(255, 206, 86, 0.2)", "rgba(255, 99, 132, 0.2)"],
				borderColor: ["rgba(75, 192, 192, 1)", "rgba(255, 206, 86, 1)", "rgba(255, 99, 132, 1)"],
				borderWidth: 1,
			},
		],
	}

	return (
		<div>
			<h2>Database Health</h2>
			<Pie data={data} />
		</div>
	)
}
