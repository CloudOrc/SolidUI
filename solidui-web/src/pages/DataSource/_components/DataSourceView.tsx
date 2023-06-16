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
import { Form, Row, Col, Input, Button } from "antd";
import { Close } from "@icon-park/react";
import {
	ApiResult,
	DataSourceDataType,
	DataSourceFormElementDataType,
	DataSourceGetDataType,
} from "@/types";
import Apis from "@/apis";
import { map, join } from "lodash-es";
import "./DataSource.less";

const { TextArea } = Input;

export interface DataSourceViewProps {
	item?: DataSourceDataType;
	handleClose: () => void;
}

export default function (props: DataSourceViewProps) {
	const [form] = Form.useForm();
	const [dsFormElements, setDsFormElements] = useState<
		DataSourceFormElementDataType[]
	>([]);
	let { item, handleClose } = props;

	useEffect(() => {
		return () => {};
	}, []);

	useEffect(() => {
		if (item) {
			load(`${item.id}`);
		}
	}, [item]);

	async function load(id: string) {
		let res: ApiResult<DataSourceGetDataType> = await Apis.datasource.get(id);
		if (res.ok) {
			let { data } = res;
			if (data === null || data === undefined) {
				return;
			}
			let { dataSourceTypeId } = data;
			let res2: ApiResult<DataSourceFormElementDataType[]> =
				await Apis.datasource.getFormElementByTypeId(`${dataSourceTypeId}`);
			if (res2.ok) {
				let data2 = res2.data || [];
				setDsFormElements(data2);
				// let params = data.connectParams.params || {};
				// let paramsStr = map(params, (value, key) => `${key}=${value}`).join(
				// 	",",
				// );

				const params = JSON.parse(data.parameter || "{}");
				// let params = data.connectParams.params || {};
				// let params = data.p
				// const connectParams = params.params;
				let paramsStr = map(
					params.params || {},
					(value, key) => `${key}=${value}`,
				).join(",");

				form.setFieldsValue({
					id: data.id,
					title: data.dataSourceName,
					description: data.dataSourceDesc,
					dataSourceTypeId: id,
					params: paramsStr,
					// host: data.connectParams.host,
					// port: data.connectParams.port,
					// driverClassName: data.connectParams.driver,
					// username: data.connectParams.username,
					// password: data.connectParams.password,
					// databaseName: data.connectParams.database || "",
					host: params.host,
					port: params.port,
					driverClassName: params.driver,
					username: params.username,
					password: params.password,
					databaseName: params.database || "",
				});
			}
		}
	}

	function renderDataSourceCreationForm() {
		return (
			<Form
				layout={"horizontal"}
				form={form}
				initialValues={{ layout: "horizontal" }}
			>
				<Form.Item
					label="title"
					name={"title"}
					required
					labelCol={{
						span: 6,
					}}
					wrapperCol={{
						span: 18,
					}}
					rules={[
						{
							required: true,
							message: "title is required",
						},
					]}
				>
					<Input placeholder="title" disabled />
				</Form.Item>
				{dsFormElements && dsFormElements.map((item) => renderFormItem(item))}
				<Form.Item
					label="description"
					name={"description"}
					labelCol={{
						span: 6,
					}}
					wrapperCol={{
						span: 18,
					}}
				>
					<TextArea
						placeholder="description"
						autoSize={{ minRows: 4, maxRows: 12 }}
						disabled
					/>
				</Form.Item>
			</Form>
		);
	}

	function renderFormItem(item: DataSourceFormElementDataType) {
		switch (item.valueType) {
			case "TEXT":
				return (
					<Form.Item
						key={`form-item-${item.key}`}
						label={item.nameEn}
						name={item.key}
						required={!!item.require}
						labelCol={{
							span: 6,
						}}
						wrapperCol={{
							span: 18,
						}}
						rules={[
							{
								required: !!item.require,
								message: `${item.nameEn} is required`,
							},
						]}
					>
						<Input placeholder={item.nameEn} disabled />
					</Form.Item>
				);
			case "PASSWORD":
				return (
					<Form.Item
						key={`form-item-${item.key}`}
						label={item.nameEn}
						name={item.key}
						required={!!item.require}
						labelCol={{
							span: 6,
						}}
						wrapperCol={{
							span: 18,
						}}
						rules={[
							{
								required: !!item.require,
								message: `${item.nameEn} is required`,
							},
						]}
					>
						<Input.Password placeholder={item.nameEn} disabled />
					</Form.Item>
				);
			default:
				return undefined;
		}
	}

	if (item === null || undefined === item) {
		return null;
	}

	return (
		<div className="solidui-modal">
			<div className="solidui-modal__header">
				View DataSource
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
					height: 560,
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
			</div>
		</div>
	);
}
