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

import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
	Row,
	Col,
	Avatar,
	Button,
	Space,
	Modal,
	Form,
	Input,
	message,
} from "antd";
import { UserOutlined } from "@ant-design/icons";
import { Delete, Editor, Close } from "@icon-park/react";
import classNames from "classnames";
import Apis from "@/apis";
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
	handleDelete: (id: string) => void;
	onUpdate: () => void;
}

export default function ProjectCard(props: ProjectCardProps) {
	const inputRef = useRef<HTMLInputElement>()

	const navigate = useNavigate();
	const [form] = Form.useForm();
	const [editOpen, setEditOpen] = useState<boolean>(false);

	const {
		className,
		style,
		popup = false,
		item,
		handleMouseEnter,
		handleMouseLeave,
		handleDelete,
		onUpdate,
	} = props;

	async function handleEdit(proj: ProjectDataType) {
		navigate(`/dashboard/${proj.id}?projectName=${proj.projectName}`);
	}

	async function __handleDelete() {
		confirm({
			title: "Are you sure delete this project?",
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
				handleDelete(`${item.id}`);
			},
			// onCancel() {
			// 	console.log("Cancel");
			// },
		});
	}

	const clazzName = classNames("solidui-card__project", className);

	const [showText, setShowText] = useState(true)
	const [text, setText] = useState(item.projectName)
	
	const [inputValue, setInputValue] = useState('')
	const onDoubleClick = () => {
		setShowText(false)
		setInputValue(text)
		// console.log('inputRef', inputRef)
		setTimeout(() => {
			inputRef.current?.focus()
		}, 100);
	}
	const onConfirm = () => {
		// console.log('确定')
		setShowText(true)
		setText(inputValue)
		// console.log(text != inputValue)
		if(text != inputValue){
			onFinish(inputValue);
		}
	}
	const onCancel = () => setShowText(true);

	const onFinish = async (values) => {
		const res = await Apis.project.update(
			`${item.id}`,
			values,
		);
		if (res.ok) {
			message.success("rename ok");
			setEditOpen(false);
			onUpdate();
		}
	}
	const [isHovered, setIsHovered] = useState(false);

	const textHoverStyle = {
		width: "100%",
		position: "relative",
		display: "inline-block",
		// textDecorationLine: isHovered ? "underline" : "none",
		// textDecorationColor: isHovered ? "blue" : "black",
		textDecorationWidth: "100%",
	};
	const underlineStyle = {
		position: "absolute",
		bottom: 0,
		left: 0,
		width: "100%",
		height: "2px",
		backgroundColor: "blue",
		content: '""'
	  };
	
	return (
		<div
			className={clazzName}
			style={style}
			onMouseEnter={(e) => {
				handleMouseEnter(e, `${item.id}`);
			}}
			onMouseLeave={(e) => {
				handleMouseLeave(e, `${item.id}`);
			}}
		>
			<div className="card-content">
				{/* <div className="content-title">{item.projectName}</div> */}
				<div className="content-title" />
				{popup ? (
					<div className="content-mask">
						<div className="mask-icons">
							<Space
								style={{
									marginTop: 50,
								}}
							>
								{/* <Pic
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
								/> */}
								<Delete
									className="solidui-icon-btn"
									theme="outline"
									size="18"
									fill="#f1f1f1"
									strokeWidth={2}
									strokeLinejoin="miter"
									strokeLinecap="square"
									onClick={__handleDelete}
								/>
								{/* <Editor
									className="solidui-icon-btn"
									theme="outline"
									size="17"
									fill="#f1f1f1"
									// strokeLinejoin="bevel"
									// strokeLinecap="square"
									strokeLinejoin="miter"
									strokeLinecap="square"
									onClick={() => {
										setEditOpen(true);
										form.setFieldValue("name", item.projectName);
									}}
								/> */}
								{/* <Export
									className="solidui-icon-btn"
									theme="outline"
									size="18"
									fill="#f1f1f1"
									strokeWidth={2}
									strokeLinejoin="miter"
									strokeLinecap="square"
								/> */}
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
									onClick={() => {
										navigate(`/preview/${item.id}`);
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
									onClick={() => handleEdit(item)}
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
					align="middle"
					style={{
						height: "100%",
					}}
				>
					<Col flex="none" style={{ padding: "0 16px" }}>
						<Avatar size={44} icon={<UserOutlined rev={1} />} />
					</Col>
					<Col flex="auto">
						<div style={textHoverStyle}
       						onMouseEnter={() => setIsHovered(true)}
      						onMouseLeave={() => setIsHovered(false)} >
						{
							showText ? <p onDoubleClick={onDoubleClick} style={{width:200}}>{item.projectName}</p > : ''
						}
						{
							isHovered ? <span style={underlineStyle} /> : ''
						}
							   
					
						<div style={{display: !showText ? 'block' : 'none' ,paddingTop:10}}>
							<input ref={(ref) => { inputRef.current = ref }} type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} onBlur={onConfirm} style={{width:'100%', color: '#ffffff', outline: 'none' ,borderTop: 'none',borderLeft: 'none',borderRight: 'none',borderBottomColor:'blue',backgroundColor:'#6c6c6c'}} onKeyDown={(e) => { if (e.keyCode === 13) onConfirm() }}/>
							
						</div>
						</div>
						<div>{item.userName}</div>
						<div>{item.updateTime}</div>
					</Col>
				</Row>
			</div>

			<Modal
				title={null}
				footer={null}
				width={400}
				closable={false}
				bodyStyle={{ padding: 0 }}
				open={editOpen}
				modalRender={(modal: any) => modal}
			>
				<div className="solidui-modal">
					<div className="solidui-modal__header">
						Project rename
						<span className="solidui-modal__close-btn">
							<Close
								theme="outline"
								size="16"
								fill="rgba(0, 0, 0, 0.65)"
								strokeWidth={2}
								strokeLinejoin="miter"
								strokeLinecap="square"
								onClick={() => {
									setEditOpen(false);
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
								onFinish={async (values) => {
									const res = await Apis.project.update(
										`${item.id}`,
										values.name,
									);
									if (res.ok) {
										message.success("rename ok");
										setEditOpen(false);
										onUpdate();
									}
								}}
							>
								<Form.Item
									label="Project Name"
									name="name"
									required
									rules={[
										{
											required: true,
											message: "Please input project name",
										},
									]}
								>
									<Input placeholder="New name" autoFocus />
								</Form.Item>
							</Form>
						</div>
					</div>
					<div className="solidui-modal__footer">
						<Button
							type="default"
							size="small"
							style={{ marginRight: 10 }}
							onClick={() => setEditOpen(false)}
						>
							Cancel
						</Button>
						<Button type="primary" size="small" onClick={() => form.submit()}>
							Save
						</Button>
					</div>
				</div>
			</Modal>
		</div>
	);
}
