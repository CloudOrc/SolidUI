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
import { Close, DatabaseConfig } from "@icon-park/react";
import Apis, { DataSourceCreationDataType } from "@/apis";
import {
	DataSourceTypeDataType,
	DataSourceFormElementDataType,
	ApiResult,
} from "@/types";
import "./DataSource.less";

const { TextArea } = Input;

export interface DataSourceCreateProps {
	handleClose: () => void;
	handleOk: () => void;
}

export default function DataSOurceCreate(props: DataSourceCreateProps) {
	const [form] = Form.useForm();
	const [dsTypes, setDsTypes] = useState<DataSourceTypeDataType[]>([]);
	const [dsType, setDsType] = useState<DataSourceTypeDataType>();
	const [dsFormElements, setDsFormElements] = useState<
		DataSourceFormElementDataType[]
	>([]);
	const { handleClose, handleOk } = props;

	useEffect(() => {
		getDataSourceTypes();

		return () => {};
	}, []);

	async function getDataSourceTypes() {
		const res: any = await Apis.datasource.types();
		if (res.ok) {
			setDsTypes(res.data || []);
		}
	}

	async function handleSelectDsType(item: DataSourceTypeDataType) {
		setDsType(item);
		const res: ApiResult<DataSourceFormElementDataType[]> =
			await Apis.datasource.getFormElementByTypeId(item.id);
		if (res.ok) {
			const data = res.data || [];
			setDsFormElements(data);
		}
	}

	function renderDataSourceItems() {
		const nodes: React.ReactNode[] = [];
		dsTypes.forEach((item) => {
			const selected = dsType?.classifier === item.classifier;
			nodes.push(
				<div
					className={`ds-item ${selected ? "selected" : ""}`}
					key={`ds_type_${item.id}`}
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
					<span className="ds-item__title">{item.name}</span>
				</div>,
			);
		});
		return nodes;
	}

	function renderDataSourceCreationForm() {
		if (dsType === null || undefined === dsType) {
			return undefined;
		}
		return (
			<Form
				layout="vertical"
				form={form}
				initialValues={{ layout: "vertical" }}
				onFinish={async (values) => {
					const cp = values.params;
					const connectParams = {} as any;
					if (cp !== null && undefined !== cp && cp.trim() !== "") {
						try {
							cp.split(",").forEach((item: string) => {
								const kv = item.split("=");
								if (kv.length !== 2) {
									throw new Error("invalid connect params");
								}
								const { 0: k, 1: v } = kv;
								connectParams[k] = v;
								// connectParams[kv[0]] = kv[1];
							});
						} catch (e) {
							message.error("connect params parsed error");
							return;
						}
					}
					const dsParameter = {
						host: values.host,
						port: parseInt(values.port || "3306", 10),
						username: values.username,
						password: values.password,
						database: values.databaseName,
						driver: values.driverClassName,
						params: connectParams,
					};
					const params: DataSourceCreationDataType = {
						dataSourceName: values.title,
						dataSourceDesc: values.description,
						dataSourceTypeId: dsType.id,
						parameter: JSON.stringify(dsParameter),
					};
					const res: any = await Apis.datasource.create(params);
					if (res.ok) {
						message.success("create datasource success");
						handleOk();
					} else {
						handleClose();
					}
				}}
			>
				<Form.Item
					label="title"
					name="title"
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
