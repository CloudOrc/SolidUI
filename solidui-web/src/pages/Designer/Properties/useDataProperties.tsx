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
import Apis from "@/apis";
import { useUpdate } from "react-use";
import { ApiResult, DataSourceTypeDataType, DataSourceDataType } from "@/types";
import { find, isNil, cloneDeep } from "lodash-es";
import { eventbus, mm } from "@/utils";
import { OnSelectViewEventData } from "@/types/eventbus";

const { confirm } = Modal;

interface Option {
	key: string;
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

	function handleSelectViewEvent(data: OnSelectViewEventData) {
		load();
	}

	async function load() {
		let view = mm.getCurrentView();
		if (isNil(view)) {
			return;
		}
		setLoading(true);
		let viewData = view?.data || {
			dataSourceId: undefined,
			table: undefined,
			sql: undefined,
		};

		let res: ApiResult<DataSourceTypeDataType[]> =
			await Apis.datasource.types();
		if (res.ok) {
			let dataSourceTypes = res.data || [];
			let res2: ApiResult<DataSourceDataType> = await Apis.datasource.query({
				pageNo: 1,
				pageSize: 10000,
				expire: false,
			});
			if (res2.ok) {
				let data = res2.data || ({} as any);
				let records: DataSourceDataType[] = data.totalList || [];
				let dataSourceOptions: Option[] = [];
				records.forEach((item: any) => {
					item.key = item.id;
					dataSourceOptions.push({
						key: `${item.id}`,
						label: item.dataSourceName,
						value: item.id,
						isLeaf: false,
						children: [],
					});
				});

				setDataSourceOptions(dataSourceOptions);
				setDataSourceTypes(dataSourceTypes);
				setDataSources(records || []);
				let optionVals = [];
				if (viewData.dataSourceId) {
					optionVals.push(viewData.dataSourceId);
				}
				if (viewData.table) {
					optionVals.push(viewData.table);
				}
				setSelectedDataSourceOptions(optionVals);

				let target = find(records, (d) => d.id === viewData.dataSourceId);
				if (target === null || undefined === target) {
					setLoading(false);
					return;
				}
				let dsType = find(
					dataSourceTypes,
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
		let target = find(dataSources, (d) => d.id === id);
		if (target === null || undefined === target) {
			return;
		}
		let dsType = find(
			dataSourceTypes,
			(d) => d.id === `${target?.dataSourceTypeId}`,
		);
		if (dsType === null || undefined === dsType) {
			return;
		}
		dsTypeIdRef.current = `${target?.dataSourceTypeId}`;
		let res: ApiResult<any> = await Apis.datasource.dbs({
			dataSourceName: target.dataSourceName,
			typeName: dsType.classifier,
		});
		if (res.ok) {
			let data = res.data || ({} as any);
			let records = data || [];
			let dsOptions = cloneDeep(dataSourceOptions);
			let targetDsOption = find(dsOptions, (ds) => ds.value === id);
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
			if (mm.getCurrentView()) {
				mm.getCurrentView()!.data.dataSourceId = id;
				mm.getCurrentView()!.data.dataSourceName = target.dataSourceName;
				mm.getCurrentView()!.data.dataSourceTypeId = dsTypeIdRef.current;
				mm.getCurrentView()!.data.dataSourceTypeName = dsType.name;
			}

			setDataSourceOptions(dsOptions);
			setSelectedDataSource({
				dataSourceName: target.dataSourceName,
				typeName: dsType.classifier,
			});
		}
	}

	async function querySql() {
		let view = mm.getCurrentView();
		if (view === null || undefined === view) {
			return;
		}
		let data = view.data || ({} as any);
		if (isNil(selectedDataSource)) {
			return;
		}
		const res = await Apis.datasource.querySql({
			dataSourceName: selectedDataSource.dataSourceName,
			typeName: selectedDataSource.typeName,
			sql: data.sql || "",
		});
		if (res.ok) {
			let data = (res.data || []) as any[];
			let originData = cloneDeep(data);
			if (data.length > 0) {
				let columns = data.shift();
				setColumns(columns);
				setRows(data);
			}

			let view = mm.getCurrentView();
			if (view !== null && undefined !== view && view.id) {
				eventbus.emit("onDataSetChange", {
					id: view.id,
					data: originData,
				});
			}
		}
	}

	async function changeSql(content: string) {
		if (mm.getCurrentView()) {
			mm.getCurrentView()!.data.sql = content;
		}
		forceUpdate();
	}

	// TODO type
	async function changeDsSelections(value: any[], selectOptions: any[]) {
		setSelectedDataSourceOptions(value);
		if (
			selectOptions !== null &&
			undefined !== selectOptions &&
			selectOptions.length === 2 &&
			mm.getCurrentView()
		) {
			let val = selectOptions[1].value;
			mm.getCurrentView()!.data.table = val;
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
