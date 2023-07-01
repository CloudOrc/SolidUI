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
import { Button, Modal, Form, Input } from "antd";
import { PlusOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { ControlledMenu, MenuItem } from "@szhsin/react-menu";
import { useUpdate } from "react-use";
import { Close } from "@icon-park/react";
import { isNil } from "lodash-es";
import { SolidPageDataType, SolidScenaDataType } from "@/types/solid";
import { mm } from "@/utils";
import useGeneral from "./useGeneral";
import "@szhsin/react-menu/dist/index.css";
import "./general.less";

const { confirm } = Modal;

function General() {
	const [contextMenuOpen, setContextMenuOpen] = useState<boolean>();
	const [anchorPoint, setAnchorPoint] = useState({ x: 0, y: 0 });
	const forceUpdate = useUpdate();
	const {
		form,
		modalOpen,
		toggleScene,
		createScene,
		createPage,
		selectPage,
		deletePage,
		toggleModal,
		edit,
		pageEditingModelMap,
		handleEditingInputKeyDown,
	} = useGeneral();
	const scenes = mm.getScenes();

	const type = React.useRef<"scene" | "page">();
	const sceneRef = React.useRef<SolidScenaDataType>();
	const pageRef = React.useRef<SolidPageDataType>();

	function renderModalContent() {
		return (
			<div className="solidui-modal">
				<div className="solidui-modal__header">
					{type.current === "page" ? " New Page" : "New Scene"}
					<span className="solidui-modal__close-btn">
						<Close
							theme="outline"
							size="16"
							fill="rgba(0, 0, 0, 0.65)"
							strokeWidth={2}
							strokeLinejoin="miter"
							strokeLinecap="square"
							onClick={() => {
								toggleModal(false);
							}}
						/>
					</span>
				</div>
				<div
					className="solidui-modal__content"
					style={{
						height: 100,
					}}
				>
					<div className="modal-content__form">
						<Form
							layout="vertical"
							form={form}
							initialValues={{ layout: "vertical" }}
							onFinish={(values) => {
								const title = values.title || "";
								if (type.current && type.current === "scene") {
									createScene(title);
								} else if (
									type.current &&
									type.current === "page" &&
									sceneRef.current
								) {
									createPage(sceneRef.current, title);
								}
							}}
						>
							<Form.Item
								label="title"
								name="title"
								required
								rules={[
									{
										required: true,
										message: "Please input name",
									},
								]}
							>
								<Input placeholder="title" autoFocus />
							</Form.Item>
						</Form>
					</div>
				</div>
				<div className="solidui-modal__footer">
					<Button
						type="default"
						size="small"
						style={{ marginRight: 10 }}
						onClick={() => toggleModal(false)}
					>
						Cancel
					</Button>
					<Button type="primary" size="small" onClick={() => form.submit()}>
						Save
					</Button>
				</div>
			</div>
		);
	}

	function renderScenes() {
		const kids: React.ReactNode[] = [];
		scenes.forEach((scene) => {
			const pages = scene.pages || [];
			kids.push(
				<section
					key={`${scene.id}`}
					className={`expander ${scene.selected ? "open" : ""}`}
				>
					<div className="expander__head" onClick={() => toggleScene(scene)}>
						<svg
							width="9"
							height="6"
							viewBox="0 0 9 6"
							xmlns="http://www.w3.org/2000/svg"
							className="expander__icon"
							style={{
								width: 10,
							}}
						>
							<path
								d="M4.50009 6L-5.24537e-07 1.26364e-06L9 4.76837e-07L4.50009 6Z"
								fill="currentcolor"
							/>
						</svg>
						<div
							style={{
								width: "170px",
							}}
						>
							{scene.title}
						</div>
						<Button
							className="btn__page-create"
							icon={<PlusOutlined />}
							type="text"
							onClick={(e) => {
								e.stopPropagation();
								e.preventDefault();
								sceneRef.current = scene;
								type.current = "page";
								toggleModal(true);
								// createPage(scene);
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
			// console.log(`${page.id} -> ${editingModel?.editing}`);
			const editing = editingModel?.editing;
			kids.push(
				<div
					className={`expander__body-item ${selectedCls}`}
					key={`${page.id}`}
					onClick={() => selectPage(page)}
					style={{
						position: "relative",
					}}
					onContextMenu={(e) => {
						e.preventDefault();
						setAnchorPoint({ x: e.clientX, y: e.clientY });
						setContextMenuOpen(true);
						pageRef.current = page;
					}}
				>
					<span className="expander__body-item-icon">
						<svg
							width="14"
							height="14"
							viewBox="0 0 48 48"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<rect
								x="6"
								y="6"
								width="36"
								height="36"
								rx="3"
								stroke="#757272"
								strokeWidth="3"
								strokeLinejoin="miter"
							/>
							<path
								d="M6 17H42"
								stroke="#757272"
								strokeWidth="3"
								strokeLinecap="square"
								strokeLinejoin="miter"
							/>
							<path
								d="M17 42V17"
								stroke="#757272"
								strokeWidth="3"
								strokeLinecap="square"
								strokeLinejoin="miter"
							/>
						</svg>
					</span>
					<span className="expander__body-item-title">
						{/* {page.title} */}
						{editing ? (
							<input
								value={editingModel?.newName || ""}
								style={{
									height: 22,
									outline: "none",
									fontSize: 12,
									border: "1px solid #4cc3ed",
								}}
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
							page.title
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
				<span
					style={{
						position: "relative",
						height: "38px",
						width: "100%",
						fontSize: "14px",
						lineHeight: "38px",
					}}
				>
					Outline
				</span>
				<Button
					className="btn__scene-create"
					icon={<PlusOutlined rev={1} />}
					type="text"
					onClick={() => {
						type.current = "scene";
						toggleModal(true);
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
						// color: "#fff",
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
							marginRight: "-4px",
							marginBottom: "-4px",
							overflow: "scroll",
						}}
					>
						{renderScenes()}
					</div>
				</div>
			</div>

			<Modal
				title={null}
				footer={null}
				closable={false}
				bodyStyle={{ padding: 0 }}
				open={modalOpen}
				modalRender={(modal: any) => modal}
			>
				{renderModalContent()}
			</Modal>

			<ControlledMenu
				anchorPoint={anchorPoint}
				direction="right"
				state={contextMenuOpen ? "open" : "closed"}
				onClose={() => setContextMenuOpen(false)}
			>
				<MenuItem
					onClick={() => {
						const page = pageRef.current;
						if (isNil(page)) return;
						confirm({
							title: "Confirm",
							icon: <ExclamationCircleOutlined rev={1} />,
							content: `Do you want to delete page [${page.title}] ?`,
							okText: "Yes",
							cancelText: "Cancel",
							onOk: async () => {
								deletePage(page);
							},
						});
					}}
				>
					Delete
				</MenuItem>
				<MenuItem
					onClick={() => {
						const page = pageRef.current;
						if (isNil(page)) return;
						edit(page);
					}}
				>
					Rename
				</MenuItem>
			</ControlledMenu>
		</div>
	);
}

export default General;
