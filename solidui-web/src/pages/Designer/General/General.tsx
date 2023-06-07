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
import { Button, Modal } from "antd";
import { PlusOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { Delete } from "@icon-park/react";
import useGeneral from "./useGeneral";
import { mm } from "@/utils";

const confirm = Modal.confirm;

import "./general.less";

function General() {
	const {
		loading,
		toggleScene,
		createScene,
		createPage,
		selectPage,
		deletePage,
	} = useGeneral();
	let scenes = mm.getScenes();

	function renderScenes() {
		let kids: React.ReactNode[] = [];
		scenes &&
			scenes.forEach((scene) => {
				let pages = scene.pages || [];
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
								></path>
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
									createPage(scene);
								}}
							/>
						</div>
						{pages.length > 0 ? (
							<div className="expander__body">{renderPages(pages)}</div>
						) : undefined}
					</section>
				);
			});
		return kids;
	}

	function renderPages(pages: any[]) {
		let kids: React.ReactNode[] = [];
		pages &&
			pages.forEach((page) => {
				let selectedCls = !!page.selected ? "selected" : "";
				kids.push(
					<div
						className={`expander__body-item ${selectedCls}`}
						key={`${page.id}`}
						onClick={() => selectPage(page)}
						style={{
							position: "relative",
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
						<span className="expander__body-item-title">{page.title}</span>
						<Delete
							className="expander__body-item-delete"
							theme="outline"
							size="14"
							fill="#757272"
							strokeWidth={3}
							strokeLinejoin="miter"
							strokeLinecap="square"
							style={{
								position: "absolute",
								top: 0,
								right: 16,
								bottom: 0,
								// display: "flex",
								alignItems: "center",
							}}
							onClick={(e) => {
								e.stopPropagation();
								e.preventDefault();

								confirm({
									title: "Confirm",
									icon: <ExclamationCircleOutlined />,
									content: "Do you want to delete this page?",
									okText: "Yes",
									cancelText: "Cancel",
									onOk: async () => {
										deletePage(page);
									},
								});
							}}
						/>
					</div>
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
						// color: "#fff",
						lineHeight: "38px",
					}}
				>
					Outline
				</span>
				<Button
					className="btn__scene-create"
					icon={<PlusOutlined />}
					type="text"
					onClick={createScene}
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
		</div>
	);
}

export default General;
