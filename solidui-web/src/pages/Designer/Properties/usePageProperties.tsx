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

import React, { useState, useEffect } from "react";
import { useMemoizedFn } from "ahooks";
import { eventbus } from "@/utils";
import { propertiesContext } from "./Properties";

type TabItemDataType = {
	key: string;
	tab: string;
	content?: React.ReactNode;
};

type InitialData = {
	tabs?: TabItemDataType[];
};

function usePageProperties(initialData: InitialData) {
	const { modelStatus, onClosePanel, onOpenPanel } =
		React.useContext(propertiesContext);
	const [propertyKey, setPropertyKey] = useState<"page" | "modelui" | "none">(
		"page",
	);
	const [currentTabKey, setCurrentTabKey] = useState<string>("Page");
	const mainRef = React.createRef<HTMLDivElement>();
	const asideRef = React.createRef<HTMLDivElement>();

	const handleSelectPage = useMemoizedFn(() => {
		setPropertyKey("page");
		if (currentTabKey === "Page") {
			onOpenPanel("medium");
		} else {
			onOpenPanel("large");
		}
	});

	useEffect(() => {
		eventbus.on("onSelectPage", handleSelectPage);

		return () => {
			eventbus.off("onSelectPage", handleSelectPage);
		};
	}, [handleSelectPage]);

	function renderTabs() {
		return (
			<ul className="conf-header__tabs" id="conf-header__tabs">
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
		setCurrentTabKey(key);
		if (key === "Modelui") {
			onOpenPanel("large");
		} else {
			onOpenPanel("medium");
		}
	}

	return {
		propertyKey,
		currentTabKey,
		mainRef,
		asideRef,
		renderTabs,
		modelStatus,
		onOpenPanel,
		onClosePanel,
	};
}

export default usePageProperties;
