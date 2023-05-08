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
	// create: <T>()
};

let Apis = {
	model,
	images,
	user,
	project,
};

export default Apis;
