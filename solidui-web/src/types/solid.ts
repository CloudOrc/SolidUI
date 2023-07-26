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

interface SolidComponentFrameDataType {
	translate?: number[];
	rotate?: number;
	backgroundColor?: string;
	backgroundImage?: string;
}

interface SolidComponentSizeDataType {
	width: number;
	height: number;
}

export type SolidViewType =
	| "echarts_bar"
	| "echarts_line"
	| "echarts_pie"
	| "image_base64";

export interface SolidModelDataType {
	id: string;
	title: string;
	createUser: string;
	createTime: string;
	description: string;
	size: SolidComponentSizeDataType;
	frame: SolidComponentFrameDataType;
	style: React.CSSProperties;
	scenas: SolidScenaDataType[];
}

export interface SolidScenaDataType {
	id: string;
	parentId: string;
	title: string;
	pages?: SolidPageDataType[];
	size?: SolidComponentSizeDataType;

	// --- for designer
	selected?: boolean;
}

export interface SolidPageDataType {
	id: string;
	parentId: string;
	title: string;
	frame?: SolidComponentFrameDataType;
	style?: React.CSSProperties;
	views: SolidViewDataType[];
	size: SolidComponentSizeDataType;

	// --- for designer
	selected?: boolean;
}

export interface SolidViewDataType {
	id: string;
	title: string;
	type: SolidViewType;
	position: {
		top: number;
		left: number;
	};
	size: SolidComponentSizeDataType;
	options?: any;
	data: SolidViewDataDataType;
	// events?: SolidViewEventDataType[];
	style?: React.CSSProperties;
	frame: SolidComponentFrameDataType;
}

interface SolidViewDataDataType {
	id: string;
	title: string;
	remote: boolean;
	dataset?: any[];
	dataSourceId: string;
	dataSourceName: string;
	dataSourceTypeId: string;
	dataSourceTypeName: string;
	// dsId?: string;
	// dsTypeId?: string;
	table?: string;
	xs?: SolidViewDataDataXAxisType[];
	ys?: SolidViewDataDataYAxisType[];
	modelId?: number;
	prompt?: string;
	sql?: string;
	python?: string;
}

interface SolidViewDataDataXAxisType {
	label: string;
}

interface SolidViewDataDataYAxisType {
	label: string;
}

// interface SolidViewEventDataType {}
