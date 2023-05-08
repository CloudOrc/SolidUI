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
import { Row, Col, Avatar, Button, Space, Modal } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { Pic, Copy, Lightning, Delete, Export } from "@icon-park/react";
import classNames from "classnames";
import { ProjectDataType } from "@/types";
import "./ProjectCard.less";

const { confirm } = Modal;

export interface ProjectCardProps {
	className?: string;
	style?: React.CSSProperties;
	item: ProjectDataType;
	popup?: boolean;

	handleMouseEnter: (e: React.MouseEvent, id: string) => void;
	handleMouseLeave: (e: React.MouseEvent, id: string) => void;
}

export default function (props: ProjectCardProps) {
	const navigate = useNavigate();

	let {
		className,
		style,
		popup = false,
		item,
		handleMouseEnter,
		handleMouseLeave,
	} = props;

	async function handleEdit() {
		navigate("/dashboard");
	}

	async function handleDelete() {
		confirm({
			title: "Are you sure delete this project?",
			// icon: <ExclamationCircleOutlined />,
			content: `Delete project ${item.projectName}`,
			okText: "Yes",
			okType: "danger",
			cancelText: "No",
			bodyStyle: {
				backgroundColor: "#f7f7f7",
			},
			okButtonProps: {
				size: "small",
			},
			cancelButtonProps: {
				size: "small",
			},
			onOk() {
				console.log("OK");
			},
			onCancel() {
				console.log("Cancel");
			},
		});
	}

	let clazzName = classNames("solidui-card__project", className);
	return (
		<div
			className={clazzName}
			style={style}
			onMouseEnter={(e) => {
				handleMouseEnter && handleMouseEnter(e, item.id + "");
			}}
			onMouseLeave={(e) => {
				handleMouseLeave && handleMouseLeave(e, item.id + "");
			}}
		>
			<div className="card-content">
				<div className="content-title">{item.projectName}</div>
				{popup ? (
					<div className="content-mask">
						<div className="mask-icons">
							<Space
								style={{
									marginTop: 50,
								}}
							>
								<Pic
									className="solidui-icon-btn"
									theme="outline"
									size="18"
									fill="#f1f1f1"
									strokeWidth={2}
									strokeLinejoin="miter"
									strokeLinecap="square"
								/>
								<Copy
									className="solidui-icon-btn"
									theme="outline"
									size="18"
									fill="#f1f1f1"
									strokeWidth={2}
									strokeLinejoin="miter"
									strokeLinecap="square"
								/>
								<Lightning
									className="solidui-icon-btn"
									theme="outline"
									size="18"
									fill="#f1f1f1"
									strokeWidth={2}
									strokeLinejoin="miter"
									strokeLinecap="square"
								/>
								<Delete
									className="solidui-icon-btn"
									theme="outline"
									size="18"
									fill="#f1f1f1"
									strokeWidth={2}
									strokeLinejoin="miter"
									strokeLinecap="square"
									onClick={handleDelete}
								/>
								<Export
									className="solidui-icon-btn"
									theme="outline"
									size="18"
									fill="#f1f1f1"
									strokeWidth={2}
									strokeLinejoin="miter"
									strokeLinecap="square"
								/>
							</Space>
						</div>
						<div className="mask-btns">
							<Space size={8}>
								<Button
									type="primary"
									size="small"
									style={{
										width: 64,
										backgroundColor: "#6c6c6c",
										borderColor: "#6c6c6c",
									}}
								>
									Preview
								</Button>
								<Button
									type="primary"
									size="small"
									style={{
										width: 64,
									}}
									onClick={handleEdit}
								>
									Edit
								</Button>
							</Space>
						</div>
					</div>
				) : undefined}
			</div>

			<div className="card-bottom">
				<Row
					wrap={false}
					align={"middle"}
					style={{
						height: "100%",
					}}
				>
					<Col flex="none" style={{ padding: "0 16px" }}>
						<Avatar size={44} icon={<UserOutlined />} />
						{/* <div style={{ padding: "0 16px" }}>none</div> */}
					</Col>
					<Col flex="auto">
						<div>{item.userName}</div>
						<div>{item.updateTime}</div>
					</Col>
				</Row>
			</div>
		</div>
	);
}
