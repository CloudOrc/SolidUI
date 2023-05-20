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

import React, { useEffect, useState } from "react";
import { Form, Row, Col, Input, Button, message } from "antd";
import { Close, DatabaseConfig } from "@icon-park/react";
import Apis from "@/apis";
import "./DataSource.less";

const { TextArea } = Input;

export interface DataSourceCreateProps {
	handleClose: () => void;
}

export default function (props: DataSourceCreateProps) {
	const [form] = Form.useForm();
	const [dsTypes, setDsTypes] = useState<any[]>([]);
	const [dsType, setDsType] = useState<string>();
	let { handleClose } = props;

	useEffect(() => {
		getDataSourceTypes();

		return () => {};
	}, []);

	async function getDataSourceTypes() {
		let res: any = await Apis.datasource.types();
		if (res.ok) {
			setDsTypes(res.data || []);
		}
	}

	function handleSelectDsType(item: any) {
		setDsType(item.key);
	}

	function renderDataSourceItems() {
		let nodes: React.ReactNode[] = [];
		dsTypes.forEach((item, idx) => {
			let selected = dsType === item.key;
			nodes.push(
				<div
					className={`ds-item ${selected ? "selected" : ""}`}
					key={item.key}
					onClick={() => handleSelectDsType(item)}
				>
					<span className="ds-item__icon">
						<DatabaseConfig
							theme="outline"
							size="20"
							fill="#757272"
							strokeWidth={2}
							strokeLinejoin="miter"
							strokeLinecap="square"
						/>
					</span>
					<span className="ds-item__title">{item.title}</span>
				</div>
			);
		});
		return nodes;
	}

	function renderDataSourceCreationForm() {
		if (null === dsType || undefined === dsType) {
			return undefined;
		}
		return (
			<Form
				layout={"vertical"}
				form={form}
				initialValues={{ layout: "vertical" }}
				onFinish={async (values) => {
					let res: any = await Apis.datasource.create(values);
					if (res.ok) {
						message.success("create datasource success");
						handleClose();
					}
				}}
			>
				<Form.Item
					label="title"
					name={"title"}
					required
					labelCol={{
						span: 12,
					}}
					wrapperCol={{
						span: 12,
					}}
					rules={[
						{
							required: true,
							message: "title is required",
						},
					]}
				>
					<Input placeholder="title" />
				</Form.Item>
				<Form.Item
					label="driver"
					name={"driver"}
					required
					labelCol={{
						span: 12,
					}}
					wrapperCol={{
						span: 12,
					}}
					rules={[
						{
							required: true,
							message: "driver is required",
						},
					]}
				>
					<Input placeholder="driver" />
				</Form.Item>
				<Form.Item
					label="url"
					name={"url"}
					required
					labelCol={{
						span: 12,
					}}
					wrapperCol={{
						span: 24,
					}}
					rules={[
						{
							required: true,
							message: "url is required",
						},
					]}
				>
					<Input placeholder="URL" />
				</Form.Item>
				<Row gutter={10}>
					<Col span={12}>
						<Form.Item
							label="username"
							name="username"
							required
							labelCol={{
								span: 24,
							}}
							wrapperCol={{
								span: 24,
							}}
							rules={[
								{
									required: true,
									message: "username is required",
								},
							]}
						>
							<Input placeholder="username" />
						</Form.Item>
					</Col>

					<Col span={12}>
						<Form.Item
							label="password"
							name={"password"}
							labelCol={{
								span: 24,
							}}
							wrapperCol={{
								span: 24,
							}}
							required
							rules={[
								{
									required: true,
									message: "password is required",
								},
							]}
						>
							<Input placeholder="password" />
						</Form.Item>
					</Col>
				</Row>

				<Form.Item
					label="description"
					name={"description"}
					labelCol={{
						span: 24,
					}}
					wrapperCol={{
						span: 24,
					}}
				>
					<TextArea
						placeholder="description"
						autoSize={{ minRows: 4, maxRows: 12 }}
					/>
				</Form.Item>
			</Form>
		);
	}

	return (
		<div className="solidui-modal">
			<div className="solidui-modal__header">
				New DataSource
				<span className="solidui-modal__close-btn">
					<Close
						theme="outline"
						size="16"
						fill="rgba(0, 0, 0, 0.65)"
						strokeWidth={2}
						strokeLinejoin="miter"
						strokeLinecap="square"
						onClick={handleClose}
					/>
				</span>
			</div>
			<div
				className="solidui-modal__content"
				style={{
					height: 600,
				}}
			>
				<div className="ds-creation-page">
					<div className="left">
						<div className="ds-list">{renderDataSourceItems()}</div>
					</div>
					<div className="right">{renderDataSourceCreationForm()}</div>
				</div>
			</div>
			<div className="solidui-modal__footer">
				<Button
					type="default"
					size="small"
					style={{ marginRight: 10 }}
					onClick={handleClose}
				>
					Cancel
				</Button>
				<Button
					type="primary"
					size="small"
					onClick={() => {
						form.submit();
					}}
				>
					Save
				</Button>
			</div>
		</div>
	);
}
