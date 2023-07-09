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

import { createContext } from "react";
import SolidEditor from "./SolidEditor";
import { SOLID_EDITOR_PROPERTIES } from "./utils/const";

export const SolidEditorContext = createContext<SolidEditor | null>(null);

function connectContext(
	context: React.Context<any>,
	properties: readonly string[],
) {
	return function connect(Component: any) {
		const { prototype } = Component;

		Component.contextType = context;
		properties.forEach((name) => {
			Object.defineProperty(prototype, name, {
				get() {
					return this.context[name];
				},
				set() {
					this.context[name](name);
				},
			});
		});
	};
}

export const connectEditorContext = connectContext(
	SolidEditorContext,
	SOLID_EDITOR_PROPERTIES,
);
