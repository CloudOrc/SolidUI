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
import { message, Modal } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/lib/table";
import { Delete, Pencil } from "@icon-park/react";
import { useForm } from "antd/lib/form/Form";
import { ApiResult } from "@/types";
import Apis from "@/apis";

const { confirm } = Modal;

type ModelTypeDataType = {
	id: number | string;
	name: string;
	code: string;
	type_name: string;
	prompt: string;
	token: string;
	baseurl: string;
};

type ModelTypeItemDataType = {
	id: number | string;
	name: string;
	code: string;
	type_name: string;
	prompt: string;
	token: string;
	base_url: string;
};

function useKeysManager() {
	const [loading, setLoading] = useState<boolean>(false);
	const [list, setList] = useState<any[]>([]);
	const [modalStatus, setModalStatus] = useState<{
		open: boolean;
		id?: number | string;
	}>({
		open: false,
		id: undefined,
	});

	const [form] = useForm();

	const [pagination, setPagination] = useState<{
		current: number;
		size: number;
		total: number;
	}>({
		current: 1,
		size: 10,
		total: 10,
	});

	const columns: ColumnsType<ModelTypeDataType> = [
		{
			title: "name",
			dataIndex: "name",
			align: "center",
		},
		{
			title: "code",
			dataIndex: "code",
			align: "center",
		},
		{
			title: "type_name",
			dataIndex: "type_name",
			align: "center",
		},
		{
			title: "baseurl",
			dataIndex: "baseurl",
		},
		{
			title: "prompt",
			dataIndex: "prompt",
			align: "center",
			ellipsis: true,
		},
		{
			title: "operation",
			dataIndex: "operation",
			align: "center",
			render(value, record) {
				return (
					<div
						style={{
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
						}}
					>
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
							onClick={() => openModal(record)}
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
									content: `${record.name}`,
									okText: "Yes",
									okType: "danger",
									cancelText: "No",
									async onOk() {
										await del(record.id);
									},
								});
							}}
						/>
					</div>
				);
			},
		},
	];

	useEffect(() => {
		query();
	}, [pagination.current, pagination.size]);

	async function query() {
		setLoading(true);
		const res: ApiResult<any> = await Apis.modelType.query({
			page: pagination.current,
			rows: pagination.size,
		});
		setLoading(false);
		if (res.ok) {
			const data = res.data || ({} as any);
			setList(data.items || []);
			setPagination({
				...pagination,
				total: data.total || 0,
			});
		}
	}

	async function create(data: ModelTypeItemDataType) {
		const res = await Apis.modelType.create(data);
		if (res.ok) {
			message.success("create success");
			closeModal();
			query();
		}
	}

	async function del(id: string | number) {
		const res = await Apis.modelType.delete(id);
		if (res.ok) {
			message.success("delete success");
			query();
		}
	}

	async function update(data: ModelTypeItemDataType) {
		const res = await Apis.modelType.update(data);
		if (res.ok) {
			message.success("update success");
			closeModal();
			query();
		}
	}

	async function closeModal() {
		form.resetFields();
		setModalStatus({ open: false, id: undefined });
	}
	async function openModal(record?: ModelTypeDataType) {
		setModalStatus({
			open: true,
			id: record?.id,
		});
		if (record) {
			form.setFieldsValue({
				name: record.name,
				code: record.code,
				type_name: record.type_name,
				prompt: record.prompt,
				token: record.token,
				base_url: record.baseurl,
			});
		}
	}

	async function handleModalOk() {
		const data: ModelTypeItemDataType = await form.validateFields();
		if (modalStatus.id) {
			await update({ ...data, id: modalStatus.id });
		} else {
			await create(data);
		}
	}

	return {
		openModal,
		closeModal,
		handleModalOk,
		modalStatus,
		loading,
		columns,
		form,
		list,
		pagination,
		setPagination,
	};
}

export default useKeysManager;
