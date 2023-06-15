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
import { Table, Input, Button, Spin, Modal } from "antd";
import DataSourceCreate from "./_components/DataSourceCreate";
import DataSourceEdit from "./_components/DataSourceEdit";
import DataSourceView from "./_components/DataSourceView";
import useDataSource from "./useDataSource";
import "./DataSourceList.less";

const { Search } = Input;

export default function () {
	const {
		loading,
		columns,
		dataSources,
		modalOpen,
		editModalOpen,
		viewModalOpen,
		dataSource,
		toggleModal,
		toggleEditModal,
		toggleViewModal,
		query,
	} = useDataSource();

	function onSearch() {}

	return (
		<div className="solidui-datasources">
			<div className="datasources-main">
				<div className="datasources-header">
					<div className="form-filter">
						<Search
							placeholder="input search text"
							onSearch={onSearch}
							enterButton
							style={{
								width: 300,
								marginRight: 10,
							}}
						/>
						<Button
							type="primary"
							onClick={() => {
								toggleModal(true);
							}}
						>
							New
						</Button>
					</div>
				</div>

				<div className="datasource-content">
					<Spin tip="loading" spinning={loading}>
						<Table columns={columns} dataSource={dataSources} pagination={{}} />
					</Spin>
				</div>
			</div>

			{modalOpen ? (
				<Modal
					title={null}
					footer={null}
					closable={false}
					bodyStyle={{ padding: 0 }}
					open={modalOpen}
					modalRender={(modal: any) => modal}
					width={1080}
				>
					<DataSourceCreate
						handleOk={() => {
							toggleModal(false);
							query();
						}}
						handleClose={() => {
							toggleModal(false);
						}}
					/>
				</Modal>
			) : undefined}

			{editModalOpen ? (
				<Modal
					title={null}
					footer={null}
					closable={false}
					bodyStyle={{ padding: 0 }}
					open={editModalOpen}
					modalRender={(modal: any) => modal}
					width={680}
				>
					<DataSourceEdit
						handleClose={() => {
							toggleEditModal(false);
						}}
						item={dataSource}
					/>
				</Modal>
			) : undefined}

			{viewModalOpen ? (
				<Modal
					title={null}
					footer={null}
					closable={false}
					bodyStyle={{ padding: 0 }}
					open={viewModalOpen}
					modalRender={(modal: any) => modal}
					width={680}
				>
					<DataSourceView
						handleClose={() => {
							toggleViewModal(false);
						}}
						item={dataSource}
					/>
				</Modal>
			) : undefined}
		</div>
	);
}
