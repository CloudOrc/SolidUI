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

import React, { useEffect } from "react";
import {useNavigate, useParams, useSearchParams} from "react-router-dom";
import { Button, Drawer, message, Input } from "antd";
import { mm } from "@/utils/index";
import Apis from "@/apis";
import {
	ProjectPageViewsCreationDataType,
	PageViewCreationDataType,
} from "@/apis/types";
import "./header.less";
import { isNil, startsWith } from "lodash-es";
import PreviewPopup from "../Preview/PreviewPopup";

function Header() {
	const params = useParams();
	const { id } = params;
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const [previewVisible, setPreviewVisible] = React.useState(false);
	const [title, setTitle] = React.useState("");
	const [isEditing, setIsEditing] = React.useState(false);

	async function handlePreview() {
		await handleSave();
		const page = mm.getCurrentPage();
		const project = mm.getModel();
		if (isNil(project) || isNil(page)) {
			message.warn("please select a page first");
			return;
		}
		setPreviewVisible(true);
	}

	async function handleSave() {
		const model = mm.getPrepareSavingModel();
		const page = mm.getCurrentPage();

		if (isNil(model) || isNil(page)) {
			return;
		}
		const views = page.views || [];
		const _views: PageViewCreationDataType[] = [];
		views.forEach((view) => {
			const v: any = {
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
		const data: ProjectPageViewsCreationDataType = {
			projectId: model.id,
			page: {
				id: page.id,
				name: page.title,
			},
			size: {
				width: page.size.width,
				height: page.size.height,
			},
			views: _views,
		};
		const res = await Apis.model.updateProjectPageViews(data);
		if (res.ok) {
			message.success("Save success");
		}
	}

	async function handleTitleUpdate() {
			const res = await Apis.project.update(id || "", title);
			if (res.ok) {
				message.success("rename ok");
				setIsEditing(false);
				navigate(`/dashboard/${id}?projectName=${title}`);
			}
	}

	function renderPreviewPopup() {
		if (!previewVisible) {
			return undefined;
		}

		return (
			<Drawer
				title=""
				placement="top"
				closable
				onClose={() => {}}
				open={previewVisible}
				key="top"
				footer={undefined}
				height="100vh"
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

	useEffect(() => {
		const projectName = searchParams.get("projectName");
		if (projectName !== null) {
			setTitle(projectName);
		}
	}, [searchParams]);

	const vars: Record<string, any> = {};
	Object.keys(process.env).forEach((key) => {
		vars[key] = process.env[key];
	});

	return (
		<header className="header">
			<div className="header-main">
				<div className="header-left">
					<div className="logo" onClick={renderHome} />
					<div className="logo-text" onClick={renderHome}>
						{/* SolidUI */}
						{vars.APP_NAME || "SolidUI"}
					</div>
					<div className="version">v{vars.APP_VERSION || "0.4.0"}</div>
					<div className="split-line" />
					<div className="left-main" onClick={() => setIsEditing(true)}>
						<div className="editable-area">
							{isEditing ? (
								<Input
									autoFocus
									value={title}
									onChange={(e) => setTitle(e.target.value)}
									onBlur={handleTitleUpdate}
									onPressEnter={handleTitleUpdate}
								/>
							) : (
								<span style={{ marginLeft: "10px", marginRight: "10px" }}>{title}</span>
							)}
						</div>
					</div>
				</div>
				<div className="header-center">{}</div>
				<div className="header-right">
					<Button
						type="primary"
						size="small"
						style={{ marginRight: 10 }}
						onClick={handlePreview}
					>
						Preview
					</Button>
					<Button type="primary" size="small" onClick={handleSave}>
						Save
					</Button>
				</div>
			</div>
			{renderPreviewPopup()}
		</header>
	);
}

export default Header;
