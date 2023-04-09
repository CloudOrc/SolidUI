import React, { useEffect, useState } from "react";
import { eventbus, mm } from "@/utils";
import {
	SolidScenaDataType,
	SolidPageDataType,
	SolidViewDataType,
} from "@/types/solid";
import { find, cloneDeep, isNil } from "lodash-es";
import { OnSelectPageEventData, OnModelLoadEventData } from "@/types";
import { useUpdate } from "react-use";

type ViewStateDataType = {
	selected: boolean;
};

function useOutline() {
	const forceUpdate = useUpdate();
	const [loading, setLoading] = useState<boolean>(false);

	const viewStatesMap = React.useRef<Map<string, ViewStateDataType>>(new Map());

	function __onSelectPage(evt: OnSelectPageEventData) {
		// let page = evt.page;
		// console.log(page);
		// viewStatesMap.current.set()
		forceUpdate();
	}

	function __onModelLoad(evt: OnModelLoadEventData) {
		let model = evt.model;
		console.log(model);
	}

	useEffect(() => {
		eventbus.on("onModelLoad", __onModelLoad);
		eventbus.on("onSelectPage", __onSelectPage);

		return () => {
			eventbus.off("onModelLoad", __onModelLoad);
			eventbus.off("onSelectPage", __onSelectPage);
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
		eventbus.emit("onSelectViewInViewport", { id });
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
