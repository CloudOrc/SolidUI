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

import React, { useEffect, useState, useRef } from "react";
import { message, Modal } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/lib/table";
import { Delete, Pencil, PreviewOpen, Lightning, Time } from "@icon-park/react";
import { useUpdate } from "react-use";
import { useForm } from "antd/lib/form/Form";
import { find } from "lodash-es";
import { ApiResult, DataSourceTypeDataType } from "@/types";
import Apis from "@/apis";

const { confirm } = Modal;

// type InitialData = {
// 	dataSources?: any[];
// };

type DataSourceDataType = {
	id: string;
	dataSourceName: string;
	dataSourceDesc: string;
	dataSourceTypeId: number;
	createTime: string;
	expire: boolean;
};

function useDataSource() {
	const forceUpdate = useUpdate();
	const [loading, setLoading] = useState<boolean>(false);
	const [dataSources, setDataSources] = useState<any[]>([]);
	const [modalOpen, setModalOpen] = useState<boolean>(false);
	const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
	const [viewModalOpen, setViewModalOpen] = useState<boolean>(false);
	const [dataSource, setDataSource] = useState<any>({});
	const [types, setTypes] = useState<DataSourceTypeDataType[]>([]);
	const [form] = useForm();

	const [pagination, setPagination] = useState<{
		current: number;
		size: number;
		total: number;
	}>();

	const columns: ColumnsType<DataSourceDataType> = [
		{
			title: "dataSourceName",
			dataIndex: "dataSourceName",
			align: "center",
		},
		{
			title: "dataSourceTypeId",
			dataIndex: "dataSourceTypeId",
			align: "center",
		},
		{
			title: "createTime",
			dataIndex: "createTime",
			align: "center",
		},
		{
			title: "dataSourceDesc",
			dataIndex: "dataSourceDesc",
			align: "center",
		},
		{
			title: "expire",
			dataIndex: "expire",
			align: "center",
			render(value) {
				return value ? "true" : "false";
			},
		},
		{
			title: "operation",
			dataIndex: "operation",
			align: "center",
			// eslint-disable-next-line
			render(value, record) {
				return (
					<div
						style={{
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
						}}
					>
						<Time
							theme="outline"
							size="18"
							fill="#757272"
							strokeWidth={3}
							strokeLinejoin="miter"
							strokeLinecap="square"
							style={{
								cursor: "pointer",
							}}
							onClick={async () => {
								const res = await Apis.datasource.expire(record.id);
								if (res.ok) {
									message.success("expire success");
									query();
								}
							}}
						/>
						&nbsp;&nbsp;&nbsp;&nbsp;
						<Lightning
							theme="outline"
							size="18"
							fill="#757272"
							strokeWidth={3}
							strokeLinejoin="miter"
							strokeLinecap="square"
							style={{
								cursor: "pointer",
							}}
							onClick={async () => {
								const typeId = record.dataSourceTypeId;
								const target = find(types, (type) => type.id === `${typeId}`);
								if (target) {
									const res = await Apis.datasource.test_connect({
										dataSourceName: record.dataSourceName,
										typeName: target.classifier,
									});
									if (res.ok) {
										message.success("test connection success");
									}
								}
							}}
						/>
						&nbsp;&nbsp;&nbsp;&nbsp;
						<PreviewOpen
							theme="outline"
							size="20"
							fill="#757272"
							strokeWidth={3}
							strokeLinejoin="miter"
							strokeLinecap="square"
							style={{
								cursor: "pointer",
							}}
							onClick={() => {
								setViewModalOpen(true);
								setDataSource(record);
							}}
						/>
						&nbsp;&nbsp;&nbsp;&nbsp;
						<Pencil
							theme="outline"
							size="18"
							fill="#757272"
							strokeWidth={3}
							strokeLinejoin="miter"
							strokeLinecap="square"
							style={{
								cursor: "pointer",
							}}
							onClick={() => {
								setEditModalOpen(true);
								setDataSource(record);
							}}
						/>
						&nbsp;&nbsp;&nbsp;&nbsp;
						<Delete
							theme="outline"
							size="18"
							fill="#757272"
							strokeWidth={3}
							strokeLinejoin="miter"
							strokeLinecap="square"
							style={{
								cursor: "pointer",
							}}
							onClick={async () => {
								confirm({
									title: "Are you sure delete this item?",
									icon: <ExclamationCircleOutlined rev={false} />,
									content: `${record.dataSourceName}`,
									okText: "Yes",
									okType: "danger",
									cancelText: "No",
									async onOk() {
										const res = await Apis.datasource.delete(record.id);
										if (res.ok) {
											message.success("delete success");
											query();
										}
									},
									onCancel() {},
								});
							}}
						/>
					</div>
				);
			},
		},
	];

	const popupConverMap = useRef<Map<string, boolean>>(new Map());

	useEffect(() => {
		query();
		queryDataSourceTypes();
		return () => {};
	}, []);

	async function query(
		params: any = { pageNo: 1, pageSize: 10, expire: false, name: "" },
	) {
		setLoading(true);
		const res: ApiResult<any> = await Apis.datasource.query({
			pageNo: params.pageNo || 1,
			pageSize: params.pageSize || 10,
			expire: params.expire || "",
			name: params.name || "",
		});
		if (res.ok) {
			const data = res.data || ({} as any);
			const current = data.currentPage || 1;
			const size = data.pageSize || 10;
			const total = data.total || 0;
			const records = data.totalList || [];
			records.forEach((item: any) => {
				item.key = item.id;
				popupConverMap.current.set(`${item.id}`, false);
			});
			setDataSources(records || []);
			setPagination({
				current,
				size,
				total,
			});
		}

		setLoading(false);
	}

	async function queryDataSourceTypes() {
		const res: ApiResult<DataSourceTypeDataType[]> =
			await Apis.datasource.types();
		if (res.ok) {
			setTypes(res.data || []);
		}
	}

	async function create(values: { name: string; description?: string }) {
		const res = await Apis.project.create({
			projectName: values.name,
			description: values.description,
		});
		if (res.ok) {
			query();
			toggleModal(false);
			resetForm();
		}
	}

	async function del(id: string) {
		const res = await Apis.project.delete(id);
		if (res.ok) {
			query();
		}
	}

	async function resetForm() {
		form.resetFields();
	}

	async function toggleCover(id: string, popup: boolean) {
		popupConverMap.current.set(id, popup);
		forceUpdate();
	}

	async function toggleModal(open: boolean) {
		setModalOpen(open);
	}

	async function toggleEditModal(open: boolean) {
		setEditModalOpen(open);
	}

	async function toggleViewModal(open: boolean) {
		setViewModalOpen(open);
	}

	async function handleSearch(value: string) {
		query({
			pageNo: 1,
			pageSize: 10,
			expire: false,
			name: value,
		});
	}

	return {
		loading,
		modalOpen,
		editModalOpen,
		viewModalOpen,
		dataSource,
		columns,
		form,
		resetForm,
		toggleModal,
		toggleEditModal,
		toggleViewModal,
		query,
		create,
		del,
		toggleCover,
		dataSources,
		pagination,
		popupConverMap,
		handleSearch,
	};
}

export default useDataSource;
