import React from "react"
import { Line } from "react-chartjs-2"
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js"

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

export default function DataVisualisation() {
	const data = {
		labels: ["January", "February", "March", "April", "May", "June", "July"],
		datasets: [
			{
				label: "Data Trends",
				data: [65, 59, 80, 81, 56, 55, 40],
				fill: false,
				backgroundColor: "rgb(75, 192, 192)",
				borderColor: "rgba(75, 192, 192, 0.2)",
			},
		],
	}

	const options = {
		scales: {
			y: {
				beginAtZero: true,
			},
		},
	}

	return <Line data={data} options={options} />
}
