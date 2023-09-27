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
// import TopPropertiesPanel from "./TopPropertiesPanel";
import ScenePropertiesPanel from "./ScenePropertiesPanel";
import PagePropertiesPanel from "./PagePropertiesPanel";
import StylePropertiesPanel from "./StylePropertiesPanel";
import DataPropertiesPanel from "./DataPropertiesPanel";
import useProperties from "./useProperties";
import { LeftExpand, RightExpand } from "@icon-park/react";
import { useMemoizedFn } from "ahooks";

import "./configurations.less";

function Properties() {
	const { propertyKey, currentTabKey, asideRef, mainRef, renderTabs } =
		useProperties({
			tabs: [
				{
					key: "Style",
					tab: "Style",
				},
				// {
				// 	key: "Data",
				// 	tab: "Data",
				// },
			],
		});

	const [modelOpen, setModelOpen] = React.useState<boolean>(true);
	const [modelWidth, setModelWidth] = React.useState<number>(326);

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

	function handleChangeOpen(type: string) {
		const dom: any = document.getElementById("section-properties");
		const DbConfig: any = document.getElementById("db-config");
		const asideEastContainer: any = document.getElementById(
			"aside-east__container",
		);
		if (type === "close") {
			setModelWidth(dom.offsetWidth);
			dom.style.width = 0;
			setModelOpen(false);
			if (DbConfig) {
				DbConfig.style.display = "none";
			}
			if (asideEastContainer) {
				asideEastContainer.style.display = "none";
			}
		} else {
			dom.style.width = modelWidth + "px";
			setModelOpen(true);
			if (DbConfig) {
				DbConfig.style.display = "block";
			}
			if (asideEastContainer) {
				asideEastContainer.style.display = "block";
			}
		}
	}

	return (
		<section id="section-properties" className="aside-east" ref={asideRef}>
			<div className="aside-east__container" id="aside-east__container">
				{renderByPropertyKey()}
			</div>
			{modelOpen ? (
				<div
					className="expand"
					style={{
						position: "absolute",
						left: 0,
						top: 0,
						zIndex: 99,
						display: "flex",
						alignItems: "center",
						height: "100%",
					}}
				>
					<LeftExpand
						theme="outline"
						size="20"
						fill="#757272"
						strokeWidth={2}
						strokeLinejoin="miter"
						strokeLinecap="square"
						style={{
							cursor: "pointer",
						}}
						onClick={() => {
							handleChangeOpen("close");
						}}
					/>
				</div>
			) : (
				<div
					className="expand"
					style={{
						position: "absolute",
						left: -20,
						top: 0,
						zIndex: 99,
						display: "flex",
						alignItems: "center",
						height: "100%",
					}}
				>
					<RightExpand
						theme="outline"
						size="20"
						fill="#757272"
						strokeWidth={2}
						strokeLinejoin="miter"
						strokeLinecap="square"
						style={{
							cursor: "pointer",
						}}
						onClick={() => {
							handleChangeOpen("open");
						}}
					/>
				</div>
			)}
		</section>
	);
}

export default Properties;
