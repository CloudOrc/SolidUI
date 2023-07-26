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

import React, { useEffect } from "react";
// import { isNil } from "lodash-es";
// import { eventbus } from "@/utils";
// import { OnSelectPageEventData } from "@/types";
import usePageProperties from "./usePageProperties";
import PagePagePropertiesPanel from "./page/PagePagePropertiesPanel";
import PageModeluiPropertiesPanel from "./page/PageModeluiDialogPanel";

export default function PagePropertiesPanel() {
	const { currentTabKey, mainRef, renderTabs } = usePageProperties({
		tabs: [
			{
				key: "Page",
				tab: "Page",
			},
			{
				key: "Modelui",
				tab: "Modelui",
			},
		],
	});
	// const [size, setSize] = useState<{ width: number; height: number }>();

	useEffect(() => {
		// eventbus.on("onSelectPage", handleSelectPage);
		// const page = mm.getCurrentPage();
		// setSize({
		// 	width: page?.size.width || 1024,
		// 	height: page?.size.height || 768,
		// });
	}, []);

	// function handleSelectPage(evt: OnSelectPageEventData) {
	// const { page } = evt;
	// if (isNil(page)) {
	// }
	// setSize({
	// 	width: page?.size.width || 1024,
	// 	height: page?.size.height || 768,
	// });
	// }

	function renderPanel() {
		if (currentTabKey === "Page") {
			return <PagePagePropertiesPanel />;
		}
		if (currentTabKey === "Modelui") {
			return <PageModeluiPropertiesPanel />;
		}
		return undefined;
	}

	return (
		<>
			<header className="conf-header">{renderTabs()}</header>
			<main className="conf-main" ref={mainRef}>
				{renderPanel()}
			</main>
		</>
	);
}
