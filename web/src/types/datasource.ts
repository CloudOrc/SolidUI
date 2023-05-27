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

export interface DataSourceCascaderDataType {
	id: string;
	key: string;
	label: string;
	value: string;
	children?: DataSourceCascaderDataType[];
}

export interface DataSourceTypeDataType {
	id: string;
	name: string;
	option: string;
	layers: number;
	icon: string;
	classifier: string;
	updateUser: string;
	description: string;
}

export interface DataSourceDataType {
	id: string;
	dataSourceName: string;
	dataSourceDesc: string;
	dataSourceTypeId: number;
	createTime: string;
	expire: boolean;
}

export interface DataSourceFormElementDataType {
	id: string;
	key: string;
	name: string;
	nameEn: string;
	require: boolean;
	valueType: string;
	description: string;
	descriptionEn: string;
}

export interface DataSourceGetDataType {
	id: string;
	dataSourceName: string;
	dataSourceDesc: string;
	dataSourceTypeId: number;
	createTime: string;
	expire: boolean;
	connectParams: {
		driver: string;
		host: string;
		port: number;
		database: string;
		username: string;
		password: string;
		params?: Record<string, any>;
	};
	parameter: string;
}
