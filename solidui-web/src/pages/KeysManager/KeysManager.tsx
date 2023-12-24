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
import { Table, Input, Button, Spin, Modal, Select } from "antd";
import useDataSource from "./useKeysManager";

const { Search } = Input;

export default function DataSourceList() {
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
		handleSearch,
	} = useDataSource();

	return (
		<div className="solidui-datasources">
			<div className="datasources-main">
				<div className="datasources-header">
					<div className="form-filter">
						<Search
							placeholder="input search text"
							onSearch={handleSearch}
							enterButton
							style={{
								width: 300,
								marginRight: 10,
							}}
						/>

						<Select
							defaultValue="all"
							style={{ width: 120, marginRight: 10 }}
							onChange={async (value) => {
								const params = {} as any;
								if (value !== "all") {
									if (value === "expired") {
										params.expire = "true";
									} else {
										params.expire = "false";
									}
								}
								query(params);
							}}
							options={[
								{ value: "all", label: "all" },
								{ value: "expired", label: "expired" },
								{ value: "unexpired", label: "unexpired" },
							]}
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
		</div>
	);
}
