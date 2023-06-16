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
import { Form, Input, Button, message } from "antd";
import { Close } from "@icon-park/react";
import {
	ApiResult,
	DataSourceFormElementDataType,
	DataSourceGetDataType,
} from "@/types";
import Apis from "@/apis";
import { map, join } from "lodash-es";
import "./DataSource.less";

const { TextArea } = Input;

export interface DataSourceEditProps {
	item?: any;
	handleClose: () => void;
}

export default function (props: DataSourceEditProps) {
	const [form] = Form.useForm();
	const [dsFormElements, setDsFormElements] = useState<
		DataSourceFormElementDataType[]
	>([]);
	const [dataSourceTypeId, setDataSourceTypeId] = useState<number>();
	let { item, handleClose } = props;

	useEffect(() => {
		return () => {};
	}, []);

	useEffect(() => {
		load(item.id);
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
				setDataSourceTypeId(dataSourceTypeId);
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
					dataSourceTypeId: id,
					title: data.dataSourceName,
					description: data.dataSourceDesc,
					params: paramsStr,
					host: params.host,
					port: params.port,
					driverClassName: params.driver,
					username: params.username,
					password: params.password,
					databaseName: params.database || "",
					// host: data.connectParams.host,
					// port: data.connectParams.port,
					// driverClassName: data.connectParams.driver,
					// username: data.connectParams.username,
					// password: data.connectParams.password,
					// databaseName: data.connectParams.database || "",
				});
			}
		}
	}

	function renderDataSourceCreationForm() {
		return (
			<Form
				layout={"vertical"}
				form={form}
				initialValues={{ layout: "vertical" }}
				onFinish={async (values) => {
					let cp = values.params;
					let connectParams = {} as any;
					if (cp !== null && undefined !== cp && cp.trim() !== "") {
						try {
							cp.split(",").forEach((item: string) => {
								let kv = item.split("=");
								if (kv.length !== 2) {
									throw new Error("invalid connect params");
								}
								connectParams[kv[0]] = kv[1];
							});
						} catch (e) {
							message.error("connect params parsed error");
							return;
						}
					}
					let dsParameter = {
						host: values.host,
						port: parseInt(values.port || "3306"),
						username: values.username,
						password: values.password,
						database: values.databaseName,
						driver: values.driverClassName,
						params: connectParams,
					};
					let params: any = {
						dataSourceName: values.title,
						dataSourceDesc: values.description,
						dataSourceTypeId,
						parameter: JSON.stringify(dsParameter),
					};
					console.log("aaaaaa");
					let res = await Apis.datasource.update(values.id, params);
					console.log(res);
					if (res.ok) {
						message.success("update success");
						handleClose();
					}
				}}
			>
				<Form.Item name={"id"} hidden>
					<Input hidden />
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
							message: "title is required",
						},
					]}
				>
					<Input placeholder="title" />
				</Form.Item>

				{dsFormElements && dsFormElements.map((item) => renderFormItem(item))}
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
							span: 12,
						}}
						wrapperCol={{
							span: 12,
						}}
						rules={[
							{
								required: !!item.require,
								message: `${item.nameEn} is required`,
							},
						]}
					>
						<Input placeholder={item.nameEn} />
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
							span: 12,
						}}
						wrapperCol={{
							span: 12,
						}}
						rules={[
							{
								required: !!item.require,
								message: `${item.nameEn} is required`,
							},
						]}
					>
						<Input.Password placeholder={item.nameEn} />
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
