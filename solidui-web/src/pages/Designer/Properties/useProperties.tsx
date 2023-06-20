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
import { OnSelectViewEventData } from "@/types/eventbus";
import { useUpdate } from "react-use";

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
	let mainRef = React.createRef<HTMLDivElement>();
	let asideRef = React.createRef<HTMLDivElement>();

	useEffect(() => {
		eventbus.on("onSelectViewInViewList", handleSelectViewEvent);
		eventbus.on("onSelectViewInViewport", handleSelectViewEvent);
		eventbus.on("onSelectPage", handleSelectPage);
		eventbus.on("onModelLoad", handleModelLoad);

		return () => {
			eventbus.off("onSelectViewInViewList", handleSelectViewEvent);
			eventbus.off("onSelectViewInViewport", handleSelectViewEvent);
			eventbus.off("onSelectPage", handleSelectPage);
		};
	}, []);

	function handleModelLoad() {
		setPropertyKey("top");
		forceUpdate();
	}

	function handleSelectPage() {
		setPropertyKey("page");
		forceUpdate();
	}

	function handleSelectViewEvent(data: OnSelectViewEventData) {
		setPropertyKey("view");
		forceUpdate();
	}

	function renderTabs() {
		return (
			<ul className="conf-header__tabs">
				{initialData.tabs?.map((tabItemData) => {
					let active = currentTabKey === tabItemData.key;
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
			asideRef.current && (asideRef.current.style.width = "500px");
		} else {
			asideRef.current && (asideRef.current.style.width = "326px");
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
