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

import { useEffect, useState, useRef } from "react";
import { useUpdate } from "react-use";
import { useForm } from "antd/lib/form/Form";
import Apis from "@/apis";

function useProject() {
	const forceUpdate = useUpdate();
	const [loading, setLoading] = useState<boolean>(false);
	const [projects, setProjects] = useState<any[]>([]);
	const [modalOpen, setModalOpen] = useState<boolean>(false);
	const [form] = useForm();

	const [pagination, setPagination] = useState<{
		current: number;
		size: number;
		total: number;
	}>({ current: 1, size: 12, total: 12 });
	const [searchName, setSearchName] = useState<string>("");

	const popupConverMap = useRef<Map<string, boolean>>(new Map());

	useEffect(() => {
		query({
			pageNo: pagination.current,
			pageSize: pagination.size,
			searchName,
		});
	}, [pagination?.current, pagination?.size]);

	function handlePaginationChange(current: number, size: number) {
		setPagination({ current, size, total: pagination.total });
	}
	async function handleSearch() {
		query({ pageNo: 1, pageSize: 12, searchName });
	}

	async function query(
		params: any = {
			pageNo: 1,
			pageSize: 12,
			searchName: "",
		},
	) {
		setLoading(true);
		const res = await Apis.project.query(params);
		if (res.ok) {
			const data = res.data || ({} as any);
			const current = data.currentPage || 1;
			const size = data.pageSize || 12;
			const total = data.total || 12;
			const records = data.totalList || [];
			records.forEach((item: any) => {
				popupConverMap.current.set(`${item.id}`, false);
			});
			setProjects(records || []);
			setPagination({
				current,
				size,
				total,
			});
		}
		setLoading(false);
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

	return {
		loading,
		modalOpen,
		form,
		resetForm,
		toggleModal,
		query,
		handleSearch,
		handlePaginationChange,
		create,
		del,
		toggleCover,
		projects,
		pagination,
		popupConverMap,
		searchName,
		setSearchName,
	};
}

export default useProject;
