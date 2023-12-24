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

import React from "react";
import ScenePropertiesPanel from "./ScenePropertiesPanel";
import PagePropertiesPanel from "./PagePropertiesPanel";
import StylePropertiesPanel from "./StylePropertiesPanel";
import DataPropertiesPanel from "./DataPropertiesPanel";
import useProperties, { modelSizeType, modelStatusType } from "./useProperties";

import "./configurations.less";

export const propertiesContext = React.createContext<{
	modelStatus: modelStatusType;
	onClosePanel: () => void;
	onOpenPanel: (size: modelSizeType) => void;
}>({
	modelStatus: "display",
	onClosePanel: () => {},
	onOpenPanel: () => {},
});
const { Provider } = propertiesContext;

function Properties() {
	const {
		propertyKey,
		currentTabKey,
		mainRef,
		renderTabs,
		modelStatus,
		handleClosePanel,
		handleShowPanel,
		panelSize,
	} = useProperties({
		tabs: [
			{
				key: "Style",
				tab: "Style",
			},
		],
	});

	function renderByPropertyKey() {
		if (propertyKey === "scene") {
			return <ScenePropertiesPanel />;
		}
		if (propertyKey === "page") {
			return <PagePropertiesPanel />;
		}
		if (propertyKey === "view") {
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
		}
		if (currentTabKey === "Data") {
			return <DataPropertiesPanel />;
		}
		return undefined;
	}

	const translateX = modelStatus === "hidden" ? panelSize : 0;
	return (
		<section
			id="section-properties"
			className="aside-east"
			style={{
				transform: `translateX(${translateX}px)`,
				width: panelSize,
			}}
		>
			<div className="aside-east__container" id="aside-east__container">
				<Provider
					value={{
						modelStatus,
						onClosePanel: handleClosePanel,
						onOpenPanel: handleShowPanel,
					}}
				>
					{renderByPropertyKey()}
				</Provider>
			</div>
		</section>
	);
}

export default Properties;
