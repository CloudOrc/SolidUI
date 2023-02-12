import React from "react";
import General from "../General/General";
import Outline from "../Outline/Outline";

function Aside() {
	return (
		<section className="aside">
			<div className="aside-main">
				<General />
				<Outline />
			</div>
		</section>
	);
}

export default Aside;
