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
import { Table, Input, Button, Modal, Form, Select } from "antd";
import useKeysManager from "./useKeysManager";
import "./KeysManager.less";

const { Search } = Input;

export default function DataSourceList() {
	const {
		loading,
		columns,
		list,
		openModal,
		pagination,
		setPagination,
		modalStatus,
		closeModal,
		handleModalOk,
		form,
	} = useKeysManager();

	return (
		<div className="solidui-keymanager">
			<div className="keymanager-main">
				<div className="keymanager-header">
					<div className="form-filter">
						<Button type="primary" onClick={() => openModal()}>
							New
						</Button>
					</div>
				</div>
				<Modal
					getContainer={() => document.body}
					maskClosable={false}
					open={modalStatus.open}
					onCancel={closeModal}
					onOk={handleModalOk}
					title="create"
					okText="Save"
				>
					<Form form={form} labelAlign="left" labelCol={{ span: 5 }}>
						<Form.Item
							name="name"
							label="name"
							rules={[
								{
									required: true,
									message: "name field is required",
								},
							]}
						>
							<Input placeholder="plase input name" />
						</Form.Item>
						<Form.Item
							name="code"
							label="code"
							rules={[
								{
									required: true,
									message: "code field is required",
								},
							]}
						>
							<Select placeholder="plase select typeName">
								<Select.Option value="html">html</Select.Option>
								<Select.Option value="python">python</Select.Option>
							</Select>
						</Form.Item>
						<Form.Item
							name="type_name"
							label="typeName"
							rules={[
								{
									required: true,
									message: "typeName field is required",
								},
							]}
						>
							<Input placeholder="plase input typeName" />
						</Form.Item>
						<Form.Item
							name="prompt"
							label="prompt"
							rules={[
								{
									required: true,
									message: "prompt field is required",
								},
							]}
						>
							<Input.TextArea rows={10} placeholder="plase input prompt" />
						</Form.Item>
						<Form.Item
							name="token"
							label="token"
							rules={[
								{
									required: true,
									message: "token field is required",
								},
							]}
						>
							<Input.Password placeholder="plase input token" />
						</Form.Item>
						<Form.Item
							name="base_url"
							label="baseUrl"
							rules={[
								{
									required: true,
									message: "baseUrl field is required",
								},
							]}
						>
							<Input placeholder="plase input baseUrl" />
						</Form.Item>
					</Form>
				</Modal>
				<div className="keymanager-content">
					<Table
						loading={loading}
						columns={columns}
						dataSource={list}
						pagination={{
							current: pagination?.current,
							total: pagination?.total,
							pageSize: pagination?.size,
							onChange(page, pageSize) {
								setPagination({
									current: page,
									size: pageSize,
									total: pagination.total,
								});
							},
						}}
					/>
				</div>
			</div>
		</div>
	);
}
