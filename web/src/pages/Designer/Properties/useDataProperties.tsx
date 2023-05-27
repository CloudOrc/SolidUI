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
import { useEffect, useState, useRef } from "react";
import { message, Modal } from "antd";
import Apis from "@/apis";
import { useUpdate } from "react-use";
import { ApiResult, DataSourceTypeDataType, DataSourceDataType } from "@/types";
import { find, isNil } from "lodash-es";

const { confirm } = Modal;

interface Option {
	value: string | number | null;
	label: React.ReactNode;
	children: Option[];
	isLeaf: boolean;
	loading?: boolean;
}

type InitialData = {
	dataSources?: DataSourceDataType[];
	databases?: any[];
	tables?: any[];
};

function useDataProperties(initialData: InitialData = {}) {
	const forceUpdate = useUpdate();
	const [loading, setLoading] = useState<boolean>(false);
	const [columns, setColumns] = useState<string[]>([]);
	const [rows, setRows] = useState<any[][]>([]);
	const [dataSourceTypes, setDataSourceTypes] = useState<
		DataSourceTypeDataType[]
	>([]);
	const [dataSources, setDataSources] = useState<DataSourceDataType[]>([]);
	const [dataSourceOptions, setDataSourceOptions] = useState<Option[]>([]);
	const [selectedDataSource, setSelectedDataSource] = useState<{
		dataSourceName: string;
		typeName: string;
	}>();
	const sqlRef = useRef<string>();

	useEffect(() => {
		queryDataSourceTypes();
		queryDataSources();
		return () => {};
	}, []);

	async function queryDataSourceTypes() {
		let res: ApiResult<DataSourceTypeDataType[]> =
			await Apis.datasource.types();
		if (res.ok) {
			let data = res.data || [];
			setDataSourceTypes(data);
		}
	}

	async function queryDataSources() {
		let res: ApiResult<DataSourceDataType> = await Apis.datasource.query({
			pageNo: 1,
			pageSize: 10000,
		});
		if (res.ok) {
			let data = res.data || ({} as any);
			let records: DataSourceDataType[] = data.totalList || [];
			let dataSourceOptions: Option[] = [];
			records.forEach((item: any) => {
				item.key = item.id;
				dataSourceOptions.push({
					label: item.dataSourceName,
					value: item.id,
					isLeaf: false,
					children: [],
				});
			});
			setDataSourceOptions(dataSourceOptions);
			setDataSources(records || []);
		}
	}

	async function queryTables(id: string) {
		let target = find(dataSources, (d) => d.id === id);
		if (null === target || undefined === target) {
			return;
		}
		let dsType = find(
			dataSourceTypes,
			(d) => d.id === target?.dataSourceTypeId + ""
		);
		if (null === dsType || undefined === dsType) {
			return;
		}
		let res: ApiResult<any> = await Apis.datasource.dbs({
			dataSourceName: target.dataSourceName,
			typeName: dsType.classifier,
		});
		if (res.ok) {
			let data = res.data || ({} as any);
			let records = data || [];
			let targetDsOption = find(dataSourceOptions, (ds) => ds.value === id);
			records.forEach((item: any) => {
				targetDsOption?.children.push({
					label: item,
					value: item,
					isLeaf: true,
					children: [],
				});
			});
			setDataSourceOptions([...dataSourceOptions]);
			setSelectedDataSource({
				dataSourceName: target.dataSourceName,
				typeName: dsType.classifier,
			});
		}
	}

	// async function query(params: any = { pageNo: 1, pageSize: 10 }) {
	// 	setLoading(true);
	// 	let res: ApiResult<any> = await Apis.datasource.dbs(params);
	// 	if (res.ok) {
	// 		let data = res.data || ({} as any);
	// 		let current = data.currentPage || 1;
	// 		let size = data.pageSize || 10;
	// 		let total = data.total || 0;
	// 		let records = data.totalList || [];
	// 		records.forEach((item: any) => {
	// 			item.key = item.id;
	// 			popupConverMap.current.set(item.id + "", false);
	// 		});
	// 		setDataSources(records || []);
	// 		setPagination({
	// 			current: current,
	// 			size: size,
	// 			total: total,
	// 		});
	// 	}

	// 	setLoading(false);
	// }

	async function querySql() {
		if (isNil(selectedDataSource)) {
			return;
		}
		const res = await Apis.datasource.querySql({
			dataSourceName: selectedDataSource.dataSourceName,
			typeName: selectedDataSource.typeName,
			sql: sqlRef.current || "",
		});
		if (res.ok) {
			let data = (res.data || []) as any[];
			if (data.length > 0) {
				let columns = data.shift();
				setColumns(columns);
				setRows(data);
			}
		}
	}

	async function changeSql(content: string) {
		sqlRef.current = content;
	}

	return {
		loading,
		columns,
		rows,
		dataSources,
		dataSourceOptions,
		changeSql,
		queryDataSources,
		queryTables,
		querySql,
	};
}

export default useDataProperties;
