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
import { isNil } from "lodash-es";
import { mm } from "@/utils";
import { SolidViewDataType } from "@/types";
import useOutline from "./useOutline";
import "./outline.less";

function Outline() {
	const { selectView, getViewState } = useOutline();

	function renderViews() {
		const currentPage = mm.getCurrentPage();
		let views: SolidViewDataType[] = [];
		if (!isNil(currentPage)) {
			views = currentPage.views;
		}
		const nodes: React.ReactNode[] = [];
		views.forEach((view) => {
			const vs = getViewState(view.id);
			let selected = false;
			if (!isNil(vs)) {
				selected = vs.selected;
			}
			nodes.push(
				<li
					className={`chartview ${selected ? "selected" : ""}`}
					key={`key_${view.id}`}
					onClick={() => {
						selectView(view.id);
					}}
				>
					<span className="eblock" />
					<i
						className="bi-font bi-chart-column"
						style={{
							position: "relative",
							fontSize: "16px",
							color: "#3dd8ff",
						}}
					/>
					<span className="text">{view.title}</span>
					{/* <div className="act act-eye">
						<Tooltip title="hide">
							<i className="bi-font bi-eye" />
						</Tooltip>
					</div>
					<div className="act act-lock">
						<Tooltip title="lock">
							<i className="bi-font bi-lock" />
						</Tooltip>
					</div> */}
				</li>,
			);
		});
		return nodes;
	}

	return (
		<div className="aside-outline">
			<div className="heading">
				<span
					style={{
						position: "relative",
						height: "38px",
						width: "100%",
						fontSize: "14px",
						// color: "#fff",
						lineHeight: "38px",
					}}
				>
					View List
				</span>
			</div>
			<div className="components">
				<div
					style={{
						position: "relative",
						width: "100%",
						height: "100%",
						overflow: "hidden",
					}}
				>
					<div
						style={{
							position: "absolute",
							top: 0,
							left: 0,
							bottom: 0,
							right: 0,
							overflow: "scroll",
							marginRight: "-4px",
							marginBottom: "-4px",
						}}
					>
						<ul className="charts">
							<div className="charts-container">{renderViews()}</div>
						</ul>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Outline;
