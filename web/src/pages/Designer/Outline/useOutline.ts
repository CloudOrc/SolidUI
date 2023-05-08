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
	OnSelectViewEventData,
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
		viewStatesMap.current.forEach((viewState) => {
			viewState.selected = false;
		});
		forceUpdate();
		forceUpdate();
	}

	function __handleModelLoad(evt: OnModelLoadEventData) {
		let model = evt.model;
	}

	function __handleSelectViewInViewport(evt: OnSelectViewEventData) {
		selectViewById(evt.id);
	}

	function __handleDrawComplete(evt: OnDrawCompleteEventData) {
		selectViewById(evt.id);
	}

	function __handleRemoveViewComplete(evt: OnRemoveViewCompleteEventData) {
		if ("viewlist" !== evt.source) {
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
