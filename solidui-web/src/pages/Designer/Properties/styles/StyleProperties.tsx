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
import { useUpdate } from "react-use";
import { useMemoizedFn } from "ahooks";
import { LeftRightExpander, PropertyElement, InputText } from "@/components";
import { eventbus, mm } from "@/utils";
import { isNil } from "lodash-es";

export default function StyleProperties() {
	const forceUpdate = useUpdate();

	const handleSelectViewEvent = useMemoizedFn(() => {
		forceUpdate();
	});

	useEffect(() => {
		eventbus.on("onSelectViewInViewList", handleSelectViewEvent);
		eventbus.on("onSelectViewInViewport", handleSelectViewEvent);

		return () => {
			eventbus.off("onSelectViewInViewList", handleSelectViewEvent);
			eventbus.off("onSelectViewInViewport", handleSelectViewEvent);
		};
	}, [handleSelectViewEvent]);

	return (
		<LeftRightExpander expanded showCheckbox={false} title="View">
			<PropertyElement label="Title" labelWidth={50}>
				<InputText
					value={mm.getCurrentView()?.title || ""}
					onChange={(e) => {
						const currentView = mm.getCurrentView();
						if (isNil(currentView)) {
							return;
						}
						currentView.title = e || "";
						eventbus.emit("onUpdateViewPropertyValue", {
							id: currentView.id,
							property: "title",
							value: e || "",
						});
					}}
				/>
			</PropertyElement>
		</LeftRightExpander>
	);
}
