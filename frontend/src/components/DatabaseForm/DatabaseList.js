import React from "react"

const DatabaseList = ({ databases }) => {
	return (
		<ul>
			{databases.map((database, index) => (
				<li key={index}>
					{database.name}
					{/* Additional buttons and functionality */}
				</li>
			))}
		</ul>
	)
}

export default DatabaseList
