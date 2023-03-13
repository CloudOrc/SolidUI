import React, { useState } from "react";

function Properties() {
	const [selectedMenu, setSelectedMenu] = useState<string>("MoveTool");

	function onMenuChange(id: string) {
		setSelectedMenu(id);
	}

	return (
		<section
			className="properties"
			style={{
				background: "#1f2024",
				color: "#fff",
			}}
		>
			Configurations
		</section>
	);
}

export default Properties;
