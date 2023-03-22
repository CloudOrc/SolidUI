import React from "react";

interface SolidComponentFrameDataType {
	backgroundColor?: string;
	backgroundImage?: string;
}

interface SolidComponentSizeDataType {
	width: number;
	height: number;
}

type SolidViewType = "echarts_bar" | "echarts_line" | "echarts_pie";

export interface SolidModelDataType {
	id: string;
	title: string;
	size: SolidComponentSizeDataType;
	frame: SolidComponentFrameDataType;
	style: React.CSSProperties;
	scenas: SolidScenaDataType[];
}

export interface SolidScenaDataType {
	id: string;
	title: string;
	pages?: SolidPageDataType[];
}

export interface SolidPageDataType {
	id: string;
	title: string;
	frame: SolidComponentFrameDataType;
	style: React.CSSProperties;
	views: SolidViewDataType[];
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
	events?: SolidViewEventDataType[];
	style?: React.CSSProperties;
	frame?: SolidComponentFrameDataType;
}

interface SolidViewDataDataType {
	id: string;
	title: string;
	remote: boolean;
	dataset?: any[];
	dsId?: string;
	table?: string;
	xs?: SolidViewDataDataXAxisType[];
	ys?: SolidViewDataDataYAxisType[];
	sql?: string;
	python?: string;
}

interface SolidViewDataDataXAxisType {
	label: string;
}

interface SolidViewDataDataYAxisType {
	label: string;
}

interface SolidViewEventDataType {}
