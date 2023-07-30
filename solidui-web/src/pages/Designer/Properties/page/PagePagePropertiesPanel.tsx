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

import React, { useState } from "react";
import { isNil } from "lodash-es";
import { PropertyElement, InputNumber } from "@/components";
import { mm, eventbus } from "@/utils";

export default function PagePagePropertiesPanel() {
	const [size] = useState<{ width: number; height: number }>();

	return (
		<>
			<PropertyElement label="Width" labelWidth={50}>
				<InputNumber
					value={size?.width || 1024}
					min={800}
					step={1}
					max={4200}
					onUpdateValue={(value) => {
						const page = mm.getCurrentPage();
						if (isNil(page)) {
							return;
						}
						page.size = {
							width: value,
							height: page.size.height,
						};
						eventbus.emit("onPageWidthChange", {
							value,
						});
					}}
				/>
			</PropertyElement>

			<PropertyElement label="Height" labelWidth={50}>
				<InputNumber
					value={size?.height || 768}
					min={400}
					step={1}
					max={3600}
					onUpdateValue={(value) => {
						const page = mm.getCurrentPage();
						if (isNil(page)) {
							return;
						}
						page.size = {
							width: page.size.width,
							height: value,
						};
						eventbus.emit("onPageHeightChange", {
							value,
						});
					}}
				/>
			</PropertyElement>
		</>
	);
}
