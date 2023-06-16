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
import { useNavigate } from "react-router-dom";
import { Button, Tooltip, Drawer, message } from "antd";
import { ChartHistogramTwo } from "@icon-park/react";
import PreviewPopup from "../Preview/PreviewPopup";
import { eventbus, mm } from "@/utils/index";
import Apis from "@/apis";
import {
	ProjectPageViewsCreationDataType,
	PageViewCreationDataType,
} from "@/apis/types";
import "./header.less";
import { isNil, startsWith } from "lodash-es";

function Header() {
	const navigate = useNavigate();
	const [previewVisible, setPreviewVisible] = React.useState(false);

	function renderPreviewPopup() {
		if (!previewVisible) {
			return;
		}

		return (
			<Drawer
				title=""
				placement={"top"}
				closable={true}
				onClose={() => {}}
				open={previewVisible}
				key={"top"}
				footer={undefined}
				height={"100vh"}
			>
				<div
					style={{
						position: "absolute",
						top: 5,
						right: 5,
						width: 24,
						height: 24,
						zIndex: 1000,
					}}
				>
					<Button
						style={{
							background: "red",
							fontSize: 12,
							color: "#fff",
							border: "1px solid red",
						}}
						size="small"
						onClick={() => {
							setPreviewVisible(false);
						}}
					>
						X
					</Button>
				</div>
				<PreviewPopup
					projectId={mm.getModel()?.id || ""}
					pageId={mm.getCurrentPage()?.id || ""}
				/>
			</Drawer>
		);
	}

	function renderHome() {
		navigate("/");
	}

	return (
		<header className="header">
			<div className="header-main">
				<div className="header-left">
					<div className="logo" onClick={renderHome} />
					<div className="logo-text" onClick={renderHome}>
						SolidUI
					</div>
					<div className="version">v0.1.0</div>
					<div className="split-line" />
					<div className="left-main" />
				</div>
				<div className="header-center">
					<Tooltip title="Bar Chart">
						<ChartHistogramTwo
							theme="two-tone"
							size="32"
							fill={["#379aff", "#4890f3"]}
							strokeLinejoin="bevel"
							strokeLinecap="square"
							style={{
								cursor: "pointer",
							}}
							onClick={() => {
								eventbus.emit("onDraw", {
									viewType: "echarts_bar",
								});
							}}
						/>
					</Tooltip>
				</div>
				<div className="header-right">
					<Button
						type="primary"
						size="small"
						style={{
							marginRight: 10,
						}}
						onClick={() => {
							const page = mm.getCurrentPage();
							let project = mm.getModel();
							if (isNil(project) || isNil(page)) {
								message.warn("please select a page first");
								return;
							}
							setPreviewVisible(true);
						}}
					>
						Preview
					</Button>
					<Button
						type="primary"
						size="small"
						onClick={async () => {
							let model = mm.getPrepareSavingModel();
							let page = mm.getCurrentPage();

							if (isNil(model) || isNil(page)) {
								return;
							}
							let views = page.views || [];
							let _views: PageViewCreationDataType[] = [];
							views.forEach((view) => {
								let v: any = {
									title: view.title,
									position: {
										top: `${view.position.top}`,
										left: `${view.position.left}`,
									},
									size: {
										width: `${view.size.width}`,
										height: `${view.size.height}`,
									},
									type: view.type,
									data: {
										dataSourceId: `${view.data.dataSourceId || ""}`,
										dataSourceName: `${view.data.dataSourceName || ""}`,
										dataSourceTypeId: `${view.data.dataSourceTypeId || ""}`,
										dataSourceTypeName: `${view.data.dataSourceTypeName || ""}`,
										sql: view.data.sql || "",
										table: view.data.table || "",
									},
								};
								if (view.options !== null && undefined !== view.options) {
									v.options = view.options;
								}
								if (!startsWith(view.id, "visual")) {
									v.id = view.id;
								}
								_views.push(v);
							});
							let data: ProjectPageViewsCreationDataType = {
								projectId: model.id,
								page: {
									id: page.id,
									name: page.title,
								},
								// TODO
								size: {
									width: "",
									height: "",
								},
								views: _views,
							};
							let res = await Apis.model.updateProjectPageViews(data);
							if (res.ok) {
								message.success("Save success");
							}
						}}
					>
						Save
					</Button>
				</div>
			</div>
			{renderPreviewPopup()}
		</header>
	);
}

export default Header;
