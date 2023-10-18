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
import usePageProperties from "./usePageProperties";
import PagePagePropertiesPanel from "./page/PagePagePropertiesPanel";
import PageModeluiPropertiesPanel from "./page/PageModeluiDialogPanel";
import {LeftExpand, RightExpand} from "@icon-park/react";

export default function PagePropertiesPanel() {
	const { currentTabKey, mainRef, renderTabs, modelOpen, setModelOpen } = usePageProperties({
		tabs: [
			{
				key: "Page",
				tab: "Page",
			},
			{
				key: "Modelui",
				tab: "Modelui",
			},
		],
	});

	const [modelWidth, setModelWidth] = React.useState<number>(326);

	function renderPanel() {
		if (currentTabKey === "Page") {
			return <PagePagePropertiesPanel />;
		}
		if (currentTabKey === "Modelui") {
			return <PageModeluiPropertiesPanel />;
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

		} else {
			dom.style.width = modelWidth + "px";
			setModelOpen(true);
			if (DbConfig) {
				DbConfig.style.display = "block";
			}

		}
	}

	return (
		<>
			<header className="conf-header">{renderTabs()}</header>
			<main className="conf-main" ref={mainRef}>
				{renderPanel()}
			</main>
			{modelOpen && currentTabKey === "Modelui" ? (
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
				currentTabKey === "Modelui" && (
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
				)
			)}
		</>
	);
}
