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
import { isNil } from "lodash-es";

type TabItemDataType = {
	key: string;
	tab: string;
	content?: React.ReactNode;
};

type InitialData = {
	tabs?: TabItemDataType[];
};

export type modelSizeType = "smail" | "large" | "medium" | number;
export type modelStatusType = "display" | "hidden";
function useProperties(initialData: InitialData) {
	const forceUpdate = useUpdate();
	const [modelStatus, setModelStatus] =
		React.useState<modelStatusType>("display");
	const [modelSize, setModelSize] = React.useState<modelSizeType>("medium");
	const [propertyKey, setPropertyKey] = useState<
		"top" | "scene" | "page" | "view" | "none"
	>("none");
	const [currentTabKey, setCurrentTabKey] = useState<string>("Style");
	const mainRef = React.createRef<HTMLDivElement>();
	const asideRef = React.createRef<HTMLDivElement>();

	const handleSelectPageInViewPort = useMemoizedFn(() => {
		const currentPage = mm.getCurrentPage();
		if (!isNil(currentPage)) {
			setPropertyKey("page");
		}
	});

	const handleModelLoad = useMemoizedFn(() => {
		setPropertyKey("top");
		forceUpdate();
	});

	const handleSelectPage = useMemoizedFn(() => {
		setPropertyKey("page");
		handleShowPanel("medium");
	});

	const handleSelectViewEvent = useMemoizedFn(() => {
		setPropertyKey("view");
		if (currentTabKey === "Style") {
			handleShowPanel("medium");
		} else {
			handleShowPanel(500);
		}
	});

	useEffect(() => {
		eventbus.on("onSelectViewInViewList", handleSelectViewEvent);
		eventbus.on("onSelectViewInViewport", handleSelectViewEvent);
		eventbus.on("onSelectPageInViewport", handleSelectPageInViewPort);
		eventbus.on("onSelectPage", handleSelectPage);
		eventbus.on("onModelLoad", handleModelLoad);

		return () => {
			eventbus.off("onSelectViewInViewList", handleSelectViewEvent);
			eventbus.off("onSelectViewInViewport", handleSelectViewEvent);
			eventbus.off("onSelectPage", handleSelectPage);
			eventbus.off("onSelectPageInViewport", handleSelectPageInViewPort);
			eventbus.off("onModelLoad", handleModelLoad);
		};
	}, [
		handleModelLoad,
		handleSelectPage,
		handleSelectViewEvent,
		handleSelectPageInViewPort,
	]);

	function renderTabs() {
		return (
			<ul className="conf-header__tabs">
				{initialData.tabs?.map((tabItemData) => {
					const active = currentTabKey === tabItemData.key;
					return (
						<li
							key={tabItemData.key}
							className={`conf-header__tabs-item ${active ? "active" : ""}`}
							onClick={() => handleTabChange(tabItemData.key)}
						>
							{tabItemData.tab}
						</li>
					);
				})}
			</ul>
		);
	}

	function handleTabChange(key: string) {
		if (key === "Data") {
			handleShowPanel(500);
		} else {
			handleShowPanel("medium");
		}
		setCurrentTabKey(key);
	}

	const handleShowPanel = (size: modelSizeType | number) => {
		setModelSize(size);
		setModelStatus("display");
	};

	const handleClosePanel = () => {
		setModelStatus("hidden");
	};

	const panelSize = React.useMemo(() => {
		if (modelSize === "smail") {
			return 200;
		}
		if (modelSize === "large") {
			return 800;
		}
		if (modelSize === "medium") {
			return 326;
		}
		if (typeof modelSize === "number") {
			return modelSize;
		}
		return 326;
	}, [modelSize]);

	return {
		propertyKey,
		currentTabKey,
		mainRef,
		asideRef,
		renderTabs,
		panelSize,
		modelSize,
		modelStatus,
		handleClosePanel,
		handleShowPanel,
	};
}

export default useProperties;
