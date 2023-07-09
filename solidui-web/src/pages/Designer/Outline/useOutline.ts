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
import { useUpdate } from "react-use";
import { useMemoizedFn } from "ahooks";
import { eventbus, mm } from "@/utils";
import {
	OnSelectViewEventData,
	OnDrawCompleteEventData,
	OnRemoveViewCompleteEventData,
} from "@/types";

type ViewStateDataType = {
	selected: boolean;
};

function useOutline() {
	const forceUpdate = useUpdate();
	const [loading, setLoading] = useState<boolean>(false);

	const viewStatesMap = React.useRef<Map<string, ViewStateDataType>>(new Map());

	// function handleSelectPage() {
	// 	viewStatesMap.current.forEach((viewState) => {
	// 		viewState.selected = false;
	// 	});
	// 	forceUpdate();
	// }

	const handleSelectPage = useMemoizedFn(() => {
		viewStatesMap.current.forEach((viewState) => {
			viewState.selected = false;
		});
		forceUpdate();
	});

	const handleModelLoad = useMemoizedFn(() => {
		forceUpdate();
	});

	const handleSelectViewInViewport = useMemoizedFn(
		(evt: OnSelectViewEventData) => {
			selectViewById(evt.id);
		},
	);

	const handleDrawComplete = useMemoizedFn((evt: OnDrawCompleteEventData) => {
		selectViewById(evt.id);
	});

	const handleRemoveViewComplete = useMemoizedFn(
		(evt: OnRemoveViewCompleteEventData) => {
			setLoading(true);
			if (evt.source !== "viewlist") {
				viewStatesMap.current.forEach((viewState) => {
					viewState.selected = false;
				});
				forceUpdate();
			}
			setLoading(false);
		},
	);

	const handleUpdateViewPropertyValue = useMemoizedFn(() => {
		forceUpdate();
	});

	function selectViewById(id: string) {
		const view = mm.getView(id);
		if (view) {
			viewStatesMap.current.forEach((viewState) => {
				viewState.selected = false;
			});
			viewStatesMap.current.set(view.id, { selected: true });
			forceUpdate();
		}
	}

	useEffect(() => {
		eventbus.on("onModelLoad", handleModelLoad);
		eventbus.on("onSelectPage", handleSelectPage);
		eventbus.on("onSelectViewInViewport", handleSelectViewInViewport);
		eventbus.on("onDrawComplete", handleDrawComplete);
		eventbus.on("onRemoveViewComplete", handleRemoveViewComplete);
		eventbus.on("onUpdateViewPropertyValue", handleUpdateViewPropertyValue);

		return () => {
			eventbus.off("onModelLoad", handleModelLoad);
			eventbus.off("onSelectPage", handleSelectPage);
			eventbus.off("onSelectViewInViewport", handleSelectViewInViewport);
			eventbus.off("onDrawComplete", handleDrawComplete);
			eventbus.off("onRemoveViewComplete", handleRemoveViewComplete);
		};
	}, [
		handleModelLoad,
		handleSelectPage,
		handleSelectViewInViewport,
		handleDrawComplete,
		handleRemoveViewComplete,
		handleUpdateViewPropertyValue,
	]);

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
