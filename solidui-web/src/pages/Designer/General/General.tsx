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

import React, { useState } from "react";
import { Button, Modal } from "antd";
import Icon, {
	PlusOutlined,
	ExclamationCircleOutlined,
} from "@ant-design/icons";
import { ControlledMenu, MenuItem } from "@szhsin/react-menu";
import { useUpdate } from "react-use";
import { isNil } from "lodash-es";
import { useClickAway } from "ahooks";
import { SolidPageDataType, SolidScenaDataType } from "@/types/solid";
import { mm } from "@/utils";
import solidRightArrow from "@/assets/icon/svg/solidRightArrow.svg";
import scenePageIcon from "@/assets/icon/svg/scenePageIcon.svg";
import useGeneral from "./useGeneral";
import "@szhsin/react-menu/dist/index.css";
import "./general.less";

const { confirm } = Modal;

function General() {
	const [contextMenuOpen, setContextMenuOpen] = useState<boolean>();
	const [anchorPoint, setAnchorPoint] = useState({ x: 0, y: 0 });
	const forceUpdate = useUpdate();
	const {
		toggleScene,
		createScene,
		createPage,
		selectPage,
		deletePage,
		edit,
		pageEditingModelMap,
		handleEditingInputKeyDown,
		renamePage,
	} = useGeneral();
	const scenes = mm.getScenes();

	const type = React.useRef<"scene" | "page">();
	const sceneRef = React.useRef<SolidScenaDataType>();
	const pageRef = React.useRef<SolidPageDataType>();

	function getActiveItem() {
		if (type.current === "page") {
			return pageRef.current;
		}
		if (type.current === "scene") {
			return sceneRef.current;
		}
		return null;
	}

	useClickAway(
		() => {
			const current = getActiveItem();
			if (isNil(current)) return;
			renamePage(current);
		},
		() => document.querySelector("#editing-input"),
		["mousedown", "contextmenu"],
	);

	function renderScenes() {
		const kids: React.ReactNode[] = [];
		scenes.forEach((scene) => {
			const pages = scene.pages || [];
			const editingModel = pageEditingModelMap.current.get(scene.id);
			const editing = editingModel?.editing;
			kids.push(
				<section
					key={`${scene.id}`}
					className={`expander ${scene.selected ? "open" : ""}`}
				>
					<div className="expander__head" onClick={() => toggleScene(scene)}>
						<Icon
							className="expander__icon"
							style={{ fontSize: 10 }}
							component={solidRightArrow}
							rev={undefined}
						/>
						<div className="expander__head-title">
							{editing ? (
								<input
									id="editing-input"
									className="expander__head-title-input"
									type="text"
									value={editingModel?.newName || ""}
									// autoFocus
									onChange={(e) => {
										const val = e.target.value || "";
										editingModel.newName = val;
										forceUpdate();
									}}
									onKeyDown={(e) => handleEditingInputKeyDown(e, scene)}
									onClick={(e) => {
										e.stopPropagation();
										e.preventDefault();
									}}
								/>
							) : (
								<div
									style={{ flex: 1 }}
									onContextMenu={(e) => {
										e.preventDefault();
										setAnchorPoint({ x: e.clientX, y: e.clientY });
										setContextMenuOpen(true);
										type.current = "scene";
										sceneRef.current = scene;
									}}
								>
									{scene.title}
								</div>
							)}
						</div>
						<Button
							className="btn__page-create"
							icon={<PlusOutlined rev={1} />}
							type="text"
							onClick={(e) => {
								e.stopPropagation();
								e.preventDefault();
								if (!scene.selected) toggleScene(scene);
								type.current = "page";
								sceneRef.current = scene;
								createPage(scene, `${scene.title}-page${pages.length + 1}`);
							}}
						/>
					</div>
					{pages.length > 0 ? (
						<div className="expander__body">{renderPages(pages)}</div>
					) : undefined}
				</section>,
			);
		});
		return kids;
	}

	function renderPages(pages: any[]) {
		const kids: React.ReactNode[] = [];
		pages.forEach((page) => {
			const selectedCls = page.selected ? "selected" : "";
			const editingModel = pageEditingModelMap.current.get(page.id);
			const editing = editingModel?.editing;
			kids.push(
				<div
					className={`expander__body-item ${selectedCls}`}
					key={`${page.id}`}
					onClick={() => selectPage(page)}
					style={{ position: "relative" }}
				>
					<Icon
						className="expander__body-item-icon"
						style={{ color: "white" }}
						component={scenePageIcon}
						rev={undefined}
					/>
					<span className="expander__body-item-title">
						{editing ? (
							<input
								id="editing-input"
								className="expander__body-item-title-input"
								type="text"
								value={editingModel?.newName || ""}
								// autoFocus
								onChange={(e) => {
									const val = e.target.value || "";
									editingModel.newName = val;
									forceUpdate();
								}}
								onKeyDown={(e) => handleEditingInputKeyDown(e, page)}
								onClick={(e) => {
									e.stopPropagation();
									e.preventDefault();
								}}
							/>
						) : (
							<div
								style={{ flex: 1 }}
								onContextMenu={(e) => {
									e.preventDefault();
									setAnchorPoint({ x: e.clientX, y: e.clientY });
									setContextMenuOpen(true);
									type.current = "page";
									pageRef.current = page;
								}}
							>
								{page.title}
							</div>
						)}
					</span>
				</div>,
			);
		});
		return kids;
	}

	return (
		<div className="aside-general">
			<div className="heading">
				<span className="title">Outline</span>
				<Button
					className="btn__scene-create"
					icon={<PlusOutlined rev={1} />}
					type="text"
					onClick={() => {
						type.current = "scene";
						sceneRef.current = undefined;
						createScene(`scene${scenes.length + 1}`);
					}}
				/>
			</div>

			<div className="columns">
				<div
					style={{
						position: "relative",
						width: "100%",
						height: "100%",
						overflow: "hidden",
						color: "#1a1a1a",
						backgroundColor: "#fff",
					}}
				>
					<div
						style={{
							position: "absolute",
							top: 0,
							left: 0,
							right: 0,
							bottom: 0,
							overflow: "scroll",
						}}
					>
						{renderScenes()}
					</div>
				</div>
			</div>

			<ControlledMenu
				anchorPoint={anchorPoint}
				direction="right"
				state={contextMenuOpen ? "open" : "closed"}
				onClose={() => setContextMenuOpen(false)}
			>
				<MenuItem
					onClick={() => {
						const current = getActiveItem();
						if (isNil(current)) return;
						edit(current);
					}}
				>
					Rename
				</MenuItem>
				<MenuItem
					onClick={() => {
						const current = getActiveItem();
						if (isNil(current)) return;
						confirm({
							title: "Confirm",
							icon: <ExclamationCircleOutlined rev={1} />,
							content: `Do you want to delete [${current.title}] ?`,
							okText: "Yes",
							cancelText: "Cancel",
							onOk: async () => {
								deletePage(current);
							},
						});
					}}
				>
					Delete
				</MenuItem>
			</ControlledMenu>
		</div>
	);
}

export default General;
