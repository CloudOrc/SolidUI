/*
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React, { Fragment } from "react";
import TopPropertiesPanel from "./TopPropertiesPanel";
import ScenePropertiesPanel from "./ScenePropertiesPanel";
import PagePropertiesPanel from "./PagePropertiesPanel";
import StylePropertiesPanel from "./StylePropertiesPanel";
import DataPropertiesPanel from "./DataPropertiesPanel";
import EventPropertiesPanel from "./EventPropertiesPanel";
import useProperties from "./useProperties";
import { mm, eventbus } from "@/utils/index";

import "./configurations.less";

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
				// {
				// 	key: "Events",
				// 	tab: "Events",
				// },
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
				<Fragment>
					<header className="conf-header">{renderTabs()}</header>
					<main className="conf-main" ref={mainRef}>
						{renderPanel()}
					</main>
				</Fragment>
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
