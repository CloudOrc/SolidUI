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
import { Form, Row, Col, Input, Button, message } from "antd";
import { Close } from "@icon-park/react";
import Apis from "@/apis";
import "./DataSource.less";

const { TextArea } = Input;

export interface DataSourceEditProps {
	item?: any;
	handleClose: () => void;
}

export default function (props: DataSourceEditProps) {
	const [form] = Form.useForm();
	let { item, handleClose } = props;

	useEffect(() => {
		return () => {};
	}, []);

	useEffect(() => {
		if (item) {
			form.setFieldsValue(item);
		}
	}, [item]);

	function renderDataSourceCreationForm() {
		return (
			<Form
				layout={"vertical"}
				form={form}
				initialValues={{ layout: "vertical" }}
				onFinish={async (values) => {
					let res = await Apis.datasource.update(values.id, values);
					if (res.ok) {
						message.success("update success");
						handleClose();
					}
				}}
			>
				<Form.Item name={"id"} hidden>
					<Input hidden type="password" />
				</Form.Item>

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
							message: "Please input title!",
						},
					]}
				>
					<Input placeholder="title" />
				</Form.Item>
				<Form.Item
					label="driver"
					name="driver"
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
							message: "Please input driver!",
						},
					]}
				>
					<Input placeholder="driver" />
				</Form.Item>
				<Form.Item
					label="url"
					name="url"
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
							message: "Please input url!",
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
									message: "Please input username!",
								},
							]}
						>
							<Input placeholder="username" />
						</Form.Item>
					</Col>

					<Col span={12}>
						<Form.Item
							label="password"
							name="password"
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
									message: "Please input password!",
								},
							]}
						>
							<Input placeholder="password" />
						</Form.Item>
					</Col>
				</Row>

				<Form.Item
					label="description"
					name="description"
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

	if (null === item || undefined === item) {
		return null;
	}

	return (
		<div className="solidui-modal">
			<div className="solidui-modal__header">
				Edit DataSource
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
					height: 500,
				}}
			>
				<div className="ds-edit-page">{renderDataSourceCreationForm()}</div>
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
