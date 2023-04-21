import React, { useState } from "react";
import {
	LeftRightExpander,
	PropertyElement,
	Switch,
	Slider,
	InputNumber,
	InputText,
	ButtonGroupRadio,
} from "@/components";

import "./configurations.less";

// const items = new Array(3).fill(null).map((_, i) => {
// 	const id = String(i + 1);
// 	return {
// 		label: `Tab Title ${id}`,
// 		key: id,
// 		children: (
// 			<>
// 				<p>Content of Tab Pane {id}</p>
// 				<p>Content of Tab Pane {id}</p>
// 				<p>Content of Tab Pane {id}</p>
// 			</>
// 		),
// 	};
// });

function Properties() {
	const [selectedMenu, setSelectedMenu] = useState<string>("MoveTool");

	function onMenuChange(id: string) {
		setSelectedMenu(id);
	}

	return (
		<section className="aside-east">
			<div className="aside-east__container">
				<header className="conf-header">
					<ul className="conf-header__tabs">
						<li className="conf-header__tabs-item active">Basic</li>
						<li className="conf-header__tabs-item">Data</li>
						<li className="conf-header__tabs-item">Event</li>
					</ul>
				</header>
				<main className="conf-main">
					<LeftRightExpander expanded={true}>
						<PropertyElement label="布局方式">input element</PropertyElement>
						<PropertyElement label="Switch">
							<Switch checked={false} />
						</PropertyElement>
						<PropertyElement label="ButtonGroupRadio" labelWidth={120}>
							<ButtonGroupRadio
								value={"horizontal"}
								items={[
									{
										text: "水平",
										value: "horizontal",
									},
									{
										text: "垂直",
										value: "vertical",
									},
								]}
							/>
						</PropertyElement>
						{/* <PropertyElement label="ButtonGroupRadio" labelWidth={120}>
							<Slider min={1} max={100} />
						</PropertyElement> */}
						<PropertyElement label="InputNumber" labelWidth={120}>
							<InputNumber step={1} min={1} max={100} value={20} />
						</PropertyElement>

						<PropertyElement label="InputText" labelWidth={120}>
							<InputText value={"some text..."} />
						</PropertyElement>
					</LeftRightExpander>
				</main>
			</div>
		</section>
	);
}

export default Properties;
