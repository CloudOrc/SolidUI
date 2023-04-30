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
	onSelectViewInViewList: OnSelectViewEventData;
	onRemoveViewComplete: OnRemoveViewCompleteEventData;
	onUpdateViewPropertyValue: OnUpdateViewPropertyValueEventData;
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
};
