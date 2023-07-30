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

import { SolidModelDataType, SolidPageDataType, SolidViewType } from "./solid";

type BaseEventData = {
	id: string;
};

type OnResizeEventData = {
	width: number;
	height: number;
} & BaseEventData;

type OnDragEventData = {
	x: number;
	y: number;
} & BaseEventData;

type OnReiszeGroupEventData = Record<string, { width: number; height: number }>;

type OnZoomEventData = {
	zoom: number;
};

type OnDrawEventData = {
	viewType: SolidViewType;
	options?: any;
};

type OnDrawCompleteEventData = {
	id: string;
};

type OnModelLoadEventData = {
	model: SolidModelDataType;
};

type OnSelectPageEventData = {
	id: string;
	page?: SolidPageDataType;
};

type OnSelectViewEventData = {
	id: string;
};

// type OnSelectViewEventData = {
// 	id: string;
// };

type OnUpdateViewPropertyValueEventData = {
	id: string;
	property: string;
	value: any;
};

type OnRemoveViewCompleteEventData = {
	source: "viewport" | "viewlist";
};

type onDataSetChangeEventData = {
	data: any[][];
} & BaseEventData;

type onPageSizeValueChangeEventData = {
	value: number;
};

type EventBusType = {
	onResize: OnResizeEventData;
	onDrag: { x: number; y: number };
	onResizeGroup: OnReiszeGroupEventData;
	onZoom: OnZoomEventData;
	onDraw: OnDrawEventData;
	onDrawComplete: OnDrawCompleteEventData;
	onModelLoad: OnModelLoadEventData;
	onSelectPage: OnSelectPageEventData;
	onSelectViewInViewport: OnSelectViewEventData;
	onSelectPageInViewport: OnSelectPageEventData;
	onSelectViewInViewList: OnSelectViewEventData;
	onRemoveViewComplete: OnRemoveViewCompleteEventData;
	onUpdateViewPropertyValue: OnUpdateViewPropertyValueEventData;
	onDataSetChange: onDataSetChangeEventData;
	onPageWidthChange: onPageSizeValueChangeEventData;
	onPageHeightChange: onPageSizeValueChangeEventData;
};

export {
	EventBusType,
	OnResizeEventData,
	OnDragEventData,
	OnDrawCompleteEventData,
	OnReiszeGroupEventData,
	OnZoomEventData,
	OnDrawEventData,
	OnModelLoadEventData,
	OnSelectPageEventData,
	OnSelectViewEventData,
	OnRemoveViewCompleteEventData,
	OnUpdateViewPropertyValueEventData,
	onDataSetChangeEventData,
	onPageSizeValueChangeEventData,
};
