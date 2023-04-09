import React from "react";
import { Button } from "antd";
import { eventbus, mm } from "@/utils/index";
import Apis from "@/apis";
import "./header.less";

function Header() {
	return (
		<header className="header">
			<div className="header-main">
				<div className="header-left">
					<div className="logo"></div>
					<div className="logo-text">SolidUI</div>
					<div className="version">v0.1.0</div>
					<div className="split-line"></div>
					<div className="left-main">
						<Button
							type="primary"
							size="small"
							onClick={() => {
								eventbus.emit("onDraw", {
									viewType: "echarts_bar",
								});
							}}
						>
							Bar
						</Button>
					</div>
				</div>
				<div className="header-center"></div>
				<div className="header-right">
					<Button
						type="primary"
						size="small"
						onClick={async () => {
							let model = mm.getPrepareSavingModel();
							console.log(model);
							console.log(JSON.stringify(model));

							let result = await Apis.model.save(model!);
							if (result.ok) {
								//// mock
								localStorage.setItem("__MODEL__", JSON.stringify(model));
							}
						}}
					>
						Save
					</Button>
				</div>
			</div>
		</header>
	);
}

export default Header;
