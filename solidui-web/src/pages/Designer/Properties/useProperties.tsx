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

function useProperties(initialData: InitialData) {
	const forceUpdate = useUpdate();
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
		const dom = document.getElementById("section-properties");
		if (dom) {
			dom.style.width = "326px";
		}
		forceUpdate();
	});

	const handleSelectViewEvent = useMemoizedFn(() => {
		setPropertyKey("view");
		const dom = document.getElementById("section-properties");
		if (dom) {
			if (currentTabKey === "Style") {
				dom.style.width = "326px";
			} else {
				dom.style.width = "500px";
			}
		}
		forceUpdate();
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
		if (asideRef.current) {
			if (key === "Data") {
				asideRef.current.style.width = "500px";
			} else {
				asideRef.current.style.width = "326px";
			}
		}
		setCurrentTabKey(key);
	}

	return {
		propertyKey,
		currentTabKey,
		mainRef,
		asideRef,
		renderTabs,
	};
}

export default useProperties;
