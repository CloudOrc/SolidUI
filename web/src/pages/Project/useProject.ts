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
import Apis from "@/apis";
import { useUpdate } from "react-use";

type InitialData = {
	projects?: any[];
};

function useProject(InitialData: InitialData = {}) {
	const forceUpdate = useUpdate();
	const [loading, setLoading] = useState<boolean>(false);
	const [projects, setProjects] = useState<any[]>([]);
	const [modalOpen, setModalOpen] = useState<boolean>(false);

	const [pagination, setPagination] = useState<{
		current: number;
		size: number;
		total: number;
	}>();

	const popupConverMap = useRef<Map<string, boolean>>(new Map());

	useEffect(() => {
		query();
		return () => {};
	}, []);

	async function query(params: any = { pageNo: 1, pageSize: 10 }) {
		setLoading(true);
		let res = await Apis.project.query(params);
		if (res.ok) {
			let data = res.data || ({} as any);
			let current = data.currentPage || 1;
			let size = data.pageSize || 10;
			let total = data.total || 0;
			let records = data.totalList || [];
			records.forEach((item: any) => {
				popupConverMap.current.set(item.id + "", false);
			});
			setProjects(records || []);
			setPagination({
				current: current,
				size: size,
				total: total,
			});
		}
		setLoading(false);
	}

	async function toggleCover(id: string, popup: boolean) {
		popupConverMap.current && popupConverMap.current.set(id, popup);
		forceUpdate();
	}

	async function toggleModal(open: boolean) {
		setModalOpen(open);
	}

	return {
		loading,
		modalOpen,
		toggleModal,
		query,
		toggleCover,
		projects,
		pagination,
		popupConverMap,
	};
}

export default useProject;
