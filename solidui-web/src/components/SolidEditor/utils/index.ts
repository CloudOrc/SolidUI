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

import { Frame } from "scenejs";
import { fromTranslation, matrix3d } from "@scena/matrix";
import { getElementInfo } from "react-moveable";
import {
	IObject,
	splitComma,
	isArray,
	isFunction,
	isObject,
} from "@daybrush/utils";
import { SOLIDUI_ELEMENT_ID } from "./const";
import { SolidViewComponent, SolidViewJSXElement, ElementInfo } from "./types";

export const PREFIX = "visual-";

export function prefixNames(pPrefix: string, ...classNames: string[]) {
	return classNames
		.map((className) =>
			className
				.split(" ")
				.map((name) => (name ? `${pPrefix}${name}` : ""))
				.join(" "),
		)
		.join(" ");
}

export function prefix(...classNames: string[]) {
	return prefixNames(PREFIX, ...classNames);
}

export function getId(el: HTMLElement | SVGElement) {
	// TODO fix issue
	return el.getAttribute(SOLIDUI_ELEMENT_ID) || "";
}

export function getIds(els: Array<HTMLElement | SVGElement>): string[] {
	return els.map((el) => getId(el));
}

export function isVisualFunction(value: any): value is SolidViewComponent {
	return isFunction(value) && "visualComponentId" in value;
}

export function isVisualElement(value: any): value is SolidViewJSXElement {
	return isObject(value) && !isVisualFunction(value);
}

export function getContentElement(el: HTMLElement): HTMLElement | null {
	if (el.contentEditable === "inherit") {
		if (el.parentElement) {
			return getContentElement(el.parentElement);
		}
	}
	if (el.contentEditable === "true") {
		return el;
	}
	return null;
}

export function getVisualAttrs(el: HTMLElement | SVGElement) {
	const { attributes } = el;
	const { length } = attributes;
	const attrs: IObject<any> = {};

	for (let i = 0; i < length; ++i) {
		const { name, value } = attributes[i];

		if (name === SOLIDUI_ELEMENT_ID || name === "style") {
			continue;
		}
		attrs[name] = value;
	}

	return attrs;
}

export function updateElements(infos: ElementInfo[]) {
	return infos.map(function registerElement(info) {
		const { id } = info;

		const target = document.querySelector<HTMLElement>(
			`[${SOLIDUI_ELEMENT_ID}="${id}"]`,
		)!;
		if (target === null || undefined === target) {
			return { ...info };
		}
		const attrs = info.attrs || {};

		info.el = target;

		// for (const name in attrs) {
		// 	target.setAttribute(name, attrs[name]);
		// }
		Object.keys(attrs).forEach((name) => {
			target.setAttribute(name, attrs[name]);
		});
		info.attrs = getVisualAttrs(target);
		const children = info.children || [];

		if (children.length) {
			children.forEach(registerElement);
		} else if (info.attrs!.contenteditable) {
			// if ("innerText" in info) {
			// 	(target as HTMLElement).innerText = info.innerText || "";
			// } else {
			// 	info.innerText = (target as HTMLElement).innerText || "";
			// }
		} else if (!info.componentId) {
			// if ("innerHTML" in info) {
			// 	target.innerHTML = info.innerHTML || "";
			// } else {
			// 	info.innerHTML = target.innerHTML || "";
			// }
		}
		return { ...info };
	});
}

export function checkImageLoaded(el: HTMLElement | SVGElement): Promise<any> {
	if (el.tagName.toLowerCase() !== "img") {
		return Promise.all(
			[].slice
				.call(el.querySelectorAll("img"))
				.map((mEl) => checkImageLoaded(mEl)),
		);
	}
	return new Promise((resolve) => {
		if ((el as HTMLImageElement).complete) {
			resolve({});
		} else {
			el.addEventListener("load", function loaded() {
				resolve({});

				el.removeEventListener("load", loaded);
			});
		}
	});
}

export function setMoveMatrix(frame: Frame, moveMatrix: number[]) {
	const transformOrders = [...(frame.getOrders(["transform"]) || [])];

	if (`${transformOrders[0]}`.indexOf("matrix3d") > -1) {
		const matrix = frame.get("transform", transformOrders[0]);
		const prevMatrix = isArray(matrix)
			? matrix
			: splitComma(matrix).map((v) => parseFloat(v));

		frame.set(
			"transform",
			transformOrders[0],
			matrix3d(moveMatrix, prevMatrix),
		);
	} else if (frame.has("transform", "matrix3d")) {
		let num = 1;
		// while (frame.has("transform", `matrix3d${++num}`)) {}
		while (frame.has("transform", `matrix3d${num + 1}`)) {
			num += 1;
		}

		frame.set("transform", `matrix3d${num}`, [...moveMatrix]);
		frame.setOrders(["transform"], [`matrix3d${num}`, ...transformOrders]);
	} else {
		frame.set("transform", "matrix3d", [...moveMatrix]);
		frame.setOrders(["transform"], ["matrix3d", ...transformOrders]);
	}
}

export function getOffsetOriginMatrix(
	el: HTMLElement | SVGElement,
	container: HTMLElement,
) {
	const stack = getElementInfo(el, container);
	const origin = stack.targetOrigin;
	const translation = fromTranslation(
		[origin[0], origin[1], origin[2] || 0],
		4,
	);

	return matrix3d(stack.offsetMatrix as any, translation);
}

export function getScenaAttrs(el?: HTMLElement | SVGElement) {
	if (!el) {
		return {};
	}
	const { attributes } = el;
	const { length } = attributes;
	const attrs: IObject<any> = {};

	for (let i = 0; i < length; ++i) {
		const { name, value } = attributes[i];

		if (name === SOLIDUI_ELEMENT_ID || name === "style") {
			continue;
		}
		attrs[name] = value;
	}

	return attrs;
}
