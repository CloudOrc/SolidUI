import React from "react";
import Header from "./Header/Header";
import Aside from "./Aside/Aside";
import Scena from "./Scena/Scena";
import Properties from "./Properties/Properties";
import "../../assets/styles/designer.less";

function Dashboard() {
	return (
		<div id="dashboard">
			<Header />
			<Aside />
			<Scena />
			<Properties />
		</div>
	);
}

export default Dashboard;
