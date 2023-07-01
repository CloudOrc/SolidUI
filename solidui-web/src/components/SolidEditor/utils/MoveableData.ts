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

import MoveableHelper from "moveable-helper";
import { Frame, NameType } from "scenejs";
import Memory from "./Memory";
import { getId } from "./index";

export default class MoveableData extends MoveableHelper {
	public selectedTargets: Array<HTMLElement | SVGElement> = [];

	constructor(private memory: Memory) {
		super({
			createAuto: true,
			useBeforeRender: true,
		});
	}

	public setSelectedTargets(targets: Array<HTMLElement | SVGElement>) {
		this.selectedTargets = targets;
	}

	public getSelectedTargets() {
		return this.selectedTargets;
	}

	public getSelectedFrames(): Frame[] {
		return this.getSelectedTargets().map((target) => this.getFrame(target));
	}

	public renderFrames() {
		this.getSelectedTargets().forEach((target: any) => {
			this.render(target);
		});
	}

	public setOrders(scope: string[], orders: NameType[]) {
		return this.setValue((frame) => {
			frame.setOrders(scope, orders);
		});
	}

	public setProperty(names: string[], value: any) {
		return this.setValue((frame) => {
			frame.set(...names, value);
		});
	}

	public removeProperties(...names: string[]) {
		return this.setValue((frame, target) => {
			names.forEach((name) => {
				frame.remove(name);
				target.style.removeProperty(name);
			});
		});
	}

	public getProperties(properties: string[][], defaultValues: any[]) {
		const frames = this.getSelectedFrames();
		const { memory } = this;

		if (!frames.length) {
			return properties.map(
				(property, i) => memory.get(property.join("///")) || defaultValues[i],
			);
		}

		return properties.map((property, i) => {
			const frameValues = frames.map((frame) => frame.get(...property));

			return frameValues.filter((color) => color)[0] || defaultValues[i];
		});
	}

	private setValue(
		callback: (frame: Frame, target: HTMLElement | SVGElement) => void,
	) {
		const targets = this.getSelectedTargets();

		const infos = targets.map((target) => {
			const frame = this.getFrame(target);
			const prevOrders = frame.getOrderObject();
			const prev = frame.get();

			callback(frame, target);
			const next = frame.get();
			const nextOrders = frame.getOrderObject();

			return { id: getId(target), prev, prevOrders, next, nextOrders };
		});
		this.renderFrames();

		return infos;
	}
}
