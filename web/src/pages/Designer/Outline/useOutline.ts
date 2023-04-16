import React, { useEffect, useState } from "react";
import { eventbus, mm } from "@/utils";
import {
	SolidScenaDataType,
	SolidPageDataType,
	SolidViewDataType,
} from "@/types/solid";
import { find, cloneDeep, isNil } from "lodash-es";
import {
	OnSelectPageEventData,
	OnModelLoadEventData,
	OnSelectViewInViewportEventData,
	OnDrawEventData,
	OnDrawCompleteEventData,
	OnRemoveViewCompleteEventData,
} from "@/types";
import { useUpdate } from "react-use";

type ViewStateDataType = {
	selected: boolean;
};

function useOutline() {
	const forceUpdate = useUpdate();
	const [loading, setLoading] = useState<boolean>(false);

	const viewStatesMap = React.useRef<Map<string, ViewStateDataType>>(new Map());

	function __handleSelectPage(evt: OnSelectPageEventData) {
		forceUpdate();
	}

	function __handleModelLoad(evt: OnModelLoadEventData) {
		let model = evt.model;
	}

	function __handleSelectViewInViewport(evt: OnSelectViewInViewportEventData) {
		selectViewById(evt.id);
	}

	function __handleDrawComplete(evt: OnDrawCompleteEventData) {
		selectViewById(evt.id);
	}

	function __handleRemoveViewComplete(evt: OnRemoveViewCompleteEventData) {
		if ("viewlist" !== evt.source) {
			console.log("handle remove ");
			viewStatesMap.current.forEach((viewState) => {
				viewState.selected = false;
			});
			forceUpdate();
		}
	}

	function selectViewById(id: string) {
		let view = mm.getView(id);
		if (view) {
			viewStatesMap.current.forEach((viewState) => {
				viewState.selected = false;
			});
			viewStatesMap.current.set(view.id, { selected: true });
			forceUpdate();
		}
	}

	useEffect(() => {
		eventbus.on("onModelLoad", __handleModelLoad);
		eventbus.on("onSelectPage", __handleSelectPage);
		eventbus.on("onSelectViewInViewport", __handleSelectViewInViewport);
		eventbus.on("onDrawComplete", __handleDrawComplete);
		eventbus.on("onRemoveViewComplete", __handleRemoveViewComplete);

		return () => {
			eventbus.off("onModelLoad", __handleModelLoad);
			eventbus.off("onSelectPage", __handleSelectPage);
			eventbus.off("onSelectViewInViewport", __handleSelectViewInViewport);
			eventbus.off("onDrawComplete", __handleDrawComplete);
			eventbus.off("onRemoveViewComplete", __handleRemoveViewComplete);
		};
	}, []);

	function selectView(id: string): void {
		viewStatesMap.current.forEach((viewState) => {
			viewState.selected = false;
		});
		let viewState = viewStatesMap.current.get(id);
		if (undefined === viewState) {
			viewState = {
				selected: false,
			};
			viewStatesMap.current.set(id, viewState);
		}
		viewState.selected = true;
		forceUpdate();
		eventbus.emit("onSelectViewInViewList", { id });
	}

	function getViewState(id: string): ViewStateDataType | undefined {
		return viewStatesMap.current.get(id);
	}

	return {
		loading,
		selectView,
		getViewState,
	};
}

export default useOutline;
