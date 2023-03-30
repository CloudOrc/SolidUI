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

type OnModelLoadEventData = {
	model: SolidModelDataType;
};

type OnSelectPageEventData = {
	id: string;
	page?: SolidPageDataType;
};

type EventBusType = {
	onResize: OnResizeEventData;
	onDrag: { x: number; y: number };
	onResizeGroup: OnReiszeGroupEventData;
	onZoom: OnZoomEventData;
	onDraw: OnDrawEventData;
	onModelLoad: OnModelLoadEventData;
	onSelectPage: OnSelectPageEventData;
};

// export default EventBusType;

export {
	EventBusType,
	OnResizeEventData,
	OnDragEventData,
	OnReiszeGroupEventData,
	OnZoomEventData,
	OnDrawEventData,
	OnModelLoadEventData,
	OnSelectPageEventData,
};
