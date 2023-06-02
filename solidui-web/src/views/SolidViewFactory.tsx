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

import SolidViewBuilder from "./builder/SolidViewBuilder";
import EChartsBarSolidViewBuilder from "./builder/echarts/EChartsBarSolidViewBuilder";

export default class ViewFactory {
	private pool: Map<string, SolidViewBuilder> = new Map<
		string,
		SolidViewBuilder
	>();

	public constructor() {
		this.init(() => {
			console.log("load view components ok");
		});
	}

	public init(success?: Function): void {
		new EChartsBarSolidViewBuilder(this);
		success && success();
	}

	public register(builder: SolidViewBuilder): void {
		this.pool.set(builder.getType(), builder);
	}

	public getBuilder(type: string): SolidViewBuilder | undefined {
		const builder = this.pool.get(type);
		if (undefined === builder || null === builder) {
			console.warn("can't found solid view builder, type = " + type);
			return undefined;
		}
		return builder;
	}
}
