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
// import { Modal } from "antd";
import { useUpdate } from "react-use";
import { find, isNil, cloneDeep } from "lodash-es";
import Apis from "@/apis";
import { ApiResult, DataSourceTypeDataType, DataSourceDataType } from "@/types";
import { eventbus, mm } from "@/utils";

interface Option {
	key: string;
	value: string | number | null;
	label: React.ReactNode;
	children: Option[];
	isLeaf: boolean;
	loading?: boolean;
}

// type InitialData = {
// 	dataSources?: DataSourceDataType[];
// 	databases?: any[];
// 	tables?: any[];
// };

function useDataProperties() {
	const forceUpdate = useUpdate();
	const [loading, setLoading] = useState<boolean>(false);
	const [columns, setColumns] = useState<string[]>([]);
	const [rows, setRows] = useState<any[][]>([]);
	const [dataSourceTypes, setDataSourceTypes] = useState<
		DataSourceTypeDataType[]
	>([]);
	const [dataSources, setDataSources] = useState<DataSourceDataType[]>([]);
	const [dataSourceOptions, setDataSourceOptions] = useState<Option[]>([]);
	const [selectedDataSourceOptions, setSelectedDataSourceOptions] = useState<
		string[]
	>([]);

	const [selectedDataSource, setSelectedDataSource] = useState<{
		dataSourceName: string;
		typeName: string;
	}>();

	const dsTypeIdRef = useRef<string>();

	useEffect(() => {
		load();

		eventbus.on("onSelectViewInViewList", handleSelectViewEvent);
		eventbus.on("onSelectViewInViewport", handleSelectViewEvent);

		return () => {
			eventbus.off("onSelectViewInViewList", handleSelectViewEvent);
			eventbus.off("onSelectViewInViewport", handleSelectViewEvent);
		};
	}, []);

	function handleSelectViewEvent() {
		load();
	}

	async function load() {
		const view = mm.getCurrentView();
		if (isNil(view)) {
			return;
		}
		setLoading(true);
		const viewData = view?.data || {
			dataSourceId: undefined,
			table: undefined,
			sql: undefined,
		};

		const res: ApiResult<DataSourceTypeDataType[]> =
			await Apis.datasource.types();
		if (res.ok) {
			const mDataSourceTypes = res.data || [];
			const res2: ApiResult<DataSourceDataType> = await Apis.datasource.query({
				pageNo: 1,
				pageSize: 10000,
				expire: false,
				name: "",
			});
			if (res2.ok) {
				const data = res2.data || ({} as any);
				const records: DataSourceDataType[] = data.totalList || [];
				const mDataSourceOptions: Option[] = [];
				records.forEach((item: any) => {
					// item.key = item.id;
					mDataSourceOptions.push({
						key: `${item.id}`,
						label: item.dataSourceName,
						value: item.id,
						isLeaf: false,
						children: [],
					});
				});

				setDataSourceOptions(mDataSourceOptions);
				setDataSourceTypes(mDataSourceTypes);
				setDataSources(records || []);
				setColumns([]);
				setRows([]);
				const optionVals = [];
				if (viewData.dataSourceId) {
					optionVals.push(viewData.dataSourceId);
				}
				if (viewData.table) {
					optionVals.push(viewData.table);
				}
				setSelectedDataSourceOptions(optionVals);

				const target = find(records, (d) => d.id === viewData.dataSourceId);
				if (target === null || undefined === target) {
					setLoading(false);
					return;
				}
				const dsType = find(
					mDataSourceTypes,
					(d) => d.id === `${target?.dataSourceTypeId}`,
				);
				if (dsType === null || undefined === dsType) {
					setLoading(false);
					return;
				}
				setSelectedDataSource({
					dataSourceName: target.dataSourceName,
					typeName: dsType.classifier,
				});
			}
		}
		setLoading(false);
	}

	// async function queryDataSourceTypes() {
	// 	let res: ApiResult<DataSourceTypeDataType[]> =
	// 		await Apis.datasource.types();
	// 	if (res.ok) {
	// 		let data = res.data || [];
	// 		setDataSourceTypes(data);
	// 	}
	// }

	// async function queryDataSources() {
	// 	let res: ApiResult<DataSourceDataType> = await Apis.datasource.query({
	// 		pageNo: 1,
	// 		pageSize: 10000,
	// 	});
	// 	if (res.ok) {
	// 		let data = res.data || ({} as any);
	// 		let records: DataSourceDataType[] = data.totalList || [];
	// 		let dataSourceOptions: Option[] = [];
	// 		records.forEach((item: any) => {
	// 			item.key = item.id;
	// 			dataSourceOptions.push({
	// 				label: item.dataSourceName,
	// 				value: item.id,
	// 				isLeaf: false,
	// 				children: [],
	// 			});
	// 		});
	// 		setDataSourceOptions(dataSourceOptions);
	// 		setDataSources(records || []);
	// 	}
	// }

	async function queryTables(id: string) {
		const target = find(dataSources, (d) => d.id === id);
		if (target === null || undefined === target) {
			return;
		}
		const dsType = find(
			dataSourceTypes,
			(d) => d.id === `${target?.dataSourceTypeId}`,
		);
		if (dsType === null || undefined === dsType) {
			return;
		}
		dsTypeIdRef.current = `${target?.dataSourceTypeId}`;
		const res: ApiResult<any> = await Apis.datasource.dbs({
			dataSourceName: target.dataSourceName,
			typeName: dsType.classifier,
		});
		if (res.ok) {
			const data = res.data || ({} as any);
			const records = data || [];
			const dsOptions = cloneDeep(dataSourceOptions);
			const targetDsOption = find(dsOptions, (ds) => ds.value === id);
			records.forEach((item: any) => {
				targetDsOption?.children.push({
					key: item,
					label: item,
					value: item,
					isLeaf: true,
					children: [],
				});
			});

			/// / dataSourceId
			const currentView = mm.getCurrentView();
			if (!isNil(currentView)) {
				currentView.data.dataSourceId = id;
				currentView.data.dataSourceName = target.dataSourceName;
				currentView.data.dataSourceTypeId = dsTypeIdRef.current;
				currentView.data.dataSourceTypeName = dsType.name;
			}

			setDataSourceOptions(dsOptions);
			setSelectedDataSource({
				dataSourceName: target.dataSourceName,
				typeName: dsType.classifier,
			});
		}
	}

	async function querySql() {
		const view = mm.getCurrentView();
		if (view === null || undefined === view) {
			return;
		}
		const data = view.data || ({} as any);
		if (isNil(selectedDataSource)) {
			return;
		}
		const res = await Apis.datasource.querySql({
			dataSourceName: selectedDataSource.dataSourceName,
			typeName: selectedDataSource.typeName,
			sql: data.sql || "",
		});
		if (res.ok) {
			const mData = (res.data || []) as any[];
			const originData = cloneDeep(mData);
			if (mData.length > 0) {
				const mColumns = mData.shift();
				setColumns(mColumns);
				setRows(mData);
			}

			const mView = mm.getCurrentView();
			if (mView !== null && undefined !== mView && mView.id) {
				eventbus.emit("onDataSetChange", {
					id: mView.id,
					data: originData,
				});
			}
		}
	}

	async function changeSql(content: string) {
		const currentView = mm.getCurrentView();
		if (!isNil(currentView)) {
			currentView.data.sql = content;
		}
		forceUpdate();
	}

	// TODO type
	async function changeDsSelections(value: any[], selectOptions: any[]) {
		setSelectedDataSourceOptions(value);
		const currentView = mm.getCurrentView();
		if (
			selectOptions !== null &&
			undefined !== selectOptions &&
			selectOptions.length === 2 &&
			!isNil(currentView)
		) {
			const val = selectOptions[1].value;
			currentView.data.table = val;
		}
	}

	return {
		loading,
		columns,
		rows,
		dataSources,
		dataSourceOptions,
		selectedDataSourceOptions,
		changeSql,
		queryTables,
		changeDsSelections,
		querySql,
	};
}

export default useDataProperties;
