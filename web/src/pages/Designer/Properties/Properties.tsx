import React, { useState } from "react";
// import Menu from "@/__components/ScenaEditor/Menu";

function Properties() {
	// public menu = React.createRef<Menu>();
	const [selectedMenu, setSelectedMenu] = useState<string>("MoveTool");
	// const menu = React.useRef<Menu>(null);

	function onMenuChange(id: string) {
		// this.setState({
		//   selectedMenu: id,
		// });
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
			Properties
			{/* <Menu ref={menu} onSelect={onMenuChange} /> */}
		</section>
	);
}

export default Properties;
