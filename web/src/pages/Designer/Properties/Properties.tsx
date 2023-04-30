import React, { useEffect, useState } from "react";
import TopPropertiesPanel from "./TopPropertiesPanel";
import ScenePropertiesPanel from "./ScenePropertiesPanel";
import PagePropertiesPanel from "./PagePropertiesPanel";
import StylePropertiesPanel from "./StylePropertiesPanel";
import DataPropertiesPanel from "./DataPropertiesPanel";
import EventPropertiesPanel from "./EventPropertiesPanel";
import useProperties from "./useProperties";
import { mm, eventbus } from "@/utils/index";
import { OnSelectViewEventData } from "@/types/eventbus";

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
	const { propertyKey, currentTabKey, asideRef, mainRef, renderTabs } =
		useProperties({
			tabs: [
				{
					key: "Style",
					tab: "Style",
				},
				{
					key: "Data",
					tab: "Data",
				},
				{
					key: "Events",
					tab: "Events",
				},
			],
		});

	function renderByPropertyKey() {
		if (propertyKey === "top") {
			return <TopPropertiesPanel />;
		} else if (propertyKey === "scene") {
			return <ScenePropertiesPanel />;
		} else if (propertyKey === "page") {
			return <PagePropertiesPanel />;
		} else if (propertyKey === "view") {
			return (
				<>
					<header className="conf-header">{renderTabs()}</header>
					<main className="conf-main" ref={mainRef}>
						{renderPanel()}
					</main>
				</>
			);
		}
		return undefined;
	}

	function renderPanel() {
		if (currentTabKey === "Style") {
			return <StylePropertiesPanel />;
		} else if (currentTabKey === "Data") {
			return <DataPropertiesPanel />;
		} else if (currentTabKey === "Events") {
			return <EventPropertiesPanel />;
		}
	}

	return (
		<section className="aside-east" ref={asideRef}>
			<div className="aside-east__container">{renderByPropertyKey()}</div>
		</section>
	);
}

export default Properties;
