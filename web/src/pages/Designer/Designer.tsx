import React from "react";
import Header from "./Header/Header";
import Aside from "./Aside/Aside";
import Scena from "./Scena/Scena";
import Properties from "./Properties/Properties";
import { eventbus, mm } from "@/utils";
import "../../assets/styles/designer.less";

function Dashboard() {
	React.useEffect(() => {
		let modelStr = localStorage.getItem("__MODEL__");
		if (
			undefined === modelStr ||
			null === modelStr ||
			"undefined" === modelStr
		) {
			modelStr = "{}";
		}
		let model = JSON.parse(modelStr);
		mm.attach(model);
		eventbus.emit("onModelLoad", { model });
	}, []);

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
