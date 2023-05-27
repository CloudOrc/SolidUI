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

import ApiService from "./service";
import { SolidModelCreationDataType } from "./types";

export type DataSourceCreationDataType = {
	dataSourceName: string;
	dataSourceDesc: string;
	dataSourceTypeId: string;
	parameter: string;
};

let model = {
	save: <T>(params: SolidModelCreationDataType) =>
		ApiService.post<T>("/api/v1/models", params, {}),
};

let images = {
	upload: <T>(params: FormData, props: any) =>
		ApiService.post<T>("/api/v1/images/upload", params, props),
};

let user = {
	login: <T>(params: { username: string; password: string }) =>
		ApiService.get<T>("/solidui/login", params),
};

let project = {
	query: <T>(
		params: { pageNo: number; pageSize: number } = { pageNo: 1, pageSize: 10 }
	) => ApiService.get<T>("/solidui/projects/queryProjectListPaging", params),
	create: <T>(params: { projectName: string; description?: string }) =>
		ApiService.post<T>("/solidui/projects", params, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		}),
	delete: <T>(id: string) => ApiService.delete(`/solidui/projects/${id}`),
};

let datasource = {
	query: <T>(
		params: { name?: string; pageNo: number; pageSize: number } = {
			pageNo: 1,
			pageSize: 10,
			name: "",
		}
	) =>
		ApiService.get<T>(
			`/solidui/datasource/info?name=${name}&pageNo=${params.pageNo}&pageSize=${params.pageSize}`
		),
	get: <T>(id: string) => ApiService.get<T>(`/solidui/datasource/info/${id}`),
	types: <T>() => ApiService.get<T>(`/solidui/datasource/type/all`),
	getFormElementByTypeId: <T>(typeId: string) =>
		ApiService.get<T>(`/solidui/datasource/key/type/${typeId}`),
	delete: <T>(id: string) =>
		ApiService.delete(`/solidui/datasource/info/delete/${id}`),
	update: <T>(id: string, params: any) =>
		ApiService.put(`/solidui/datasources/${id}`, params),
	create: <T>(params: DataSourceCreationDataType) =>
		ApiService.post(`/solidui/datasource/info/json`, params),
	all: <T>() => ApiService.get<T>(`/solidui/datasources/all`),
	test_connect: <T>(params: { dataSourceName: string; typeName: string }) =>
		ApiService.post(
			`/solidui/datasource/connect/json?dataSourceName=${params.dataSourceName}&typeName=${params.typeName}`,
			{}
		),
	expire: <T>(id: string) =>
		ApiService.put(`/solidui/datasource/info/${id}/expire`, {}),
	dbs: <T>(
		params: { dataSourceName: string; typeName: string } = {
			dataSourceName: "",
			typeName: "",
		}
	) =>
		ApiService.get<T>(
			`/solidui/metadataQuery/queryDatabases?dataSourceName=${params.dataSourceName}&typeName=${params.typeName}`
		),
	querySql: <T>(params: {
		dataSourceName: string;
		typeName: string;
		sql: string;
	}) =>
		ApiService.get(
			`/solidui/metadataQuery/querySql?dataSourceName=${params.dataSourceName}&typeName=${params.typeName}&sql=${params.sql}`
		),
};

let Apis = {
	model,
	images,
	user,
	project,
	datasource,
};

export default Apis;
