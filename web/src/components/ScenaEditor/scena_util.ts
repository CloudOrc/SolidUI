import { getElementInfo } from "react-moveable";
import {
	IObject,
	isString,
	splitComma,
	isArray,
	isFunction,
	isNumber,
	isObject,
} from "@daybrush/utils";
import { fromTranslation, matrix3d } from "@scena/matrix";
import {
	ElementInfo,
	ScenaComponent,
	ScenaJSXElement,
	ScenaFunctionJSXElement,
	ScenaFunctionComponent,
	ScenaProps,
} from "../../types";
import { Frame, NameType } from "scenejs";

export const EDITOR_PROPERTIES = [
	"memory",
	"eventBus",
	"keyManager",
	"moveableData",
	"moveableManager",
	"historyManager",
	"console",
	"getViewport",
	"getSelecto",
	"getEditorElement",
	"getSelectedTargets",
	"selectMenu",
	"getSelectedFrames",
] as const;
export const PREFIX = "scena-";
export const DATA_SCENA_ELEMENT_ID = "data-scena-element-id";
export const DATA_SCENA_ELEMENT = "data-scena-element";
export const TYPE_SCENA_LAYERS = "application/x-scena-layers";

export function getId(el: HTMLElement | SVGElement) {
	return el.getAttribute(DATA_SCENA_ELEMENT_ID)!;
}

export function getIds(els: Array<HTMLElement | SVGElement>): string[] {
	return els.map((el) => getId(el));
}

export function getScenaAttrs(el: HTMLElement | SVGElement) {
	const attributes = el.attributes;
	const length = attributes.length;
	const attrs: IObject<any> = {};

	for (let i = 0; i < length; ++i) {
		const { name, value } = attributes[i];

		if (name === DATA_SCENA_ELEMENT_ID || name === "style") {
			continue;
		}
		attrs[name] = value;
	}

	return attrs;
}

export function isScenaFunction(value: any): value is ScenaComponent {
	return isFunction(value) && "scenaComponentId" in value;
}

export function isScenaElement(value: any): value is ScenaJSXElement {
	return isObject(value) && !isScenaFunction(value);
}

export function isScenaFunctionElement(
	value: any
): value is ScenaFunctionJSXElement {
	return isScenaElement(value) && isFunction(value.type);
}

export function getOffsetOriginMatrix(
	el: HTMLElement | SVGElement,
	container: HTMLElement
) {
	const stack = getElementInfo(el, container);
	const origin = stack.targetOrigin;
	const translation = fromTranslation(
		[origin[0], origin[1], origin[2] || 0],
		4
	);

	return matrix3d(stack.offsetMatrix as any, translation);
}

export function updateElements(infos: ElementInfo[]) {
	return infos.map(function registerElement(info) {
		const id = info.id!;

		const target = document.querySelector<HTMLElement>(
			`[${DATA_SCENA_ELEMENT_ID}="${id}"]`
		)!;
		const attrs = info.attrs || {};

		info.el = target;

		for (const name in attrs) {
			target.setAttribute(name, attrs[name]);
		}
		info.attrs = getScenaAttrs(target);
		const children = info.children || [];

		if (children.length) {
			children.forEach(registerElement);
		} else if (info.attrs!.contenteditable) {
			if ("innerText" in info) {
				(target as HTMLElement).innerText = info.innerText || "";
			} else {
				info.innerText = (target as HTMLElement).innerText || "";
			}
		} else if (!info.componentId) {
			if ("innerHTML" in info) {
				target.innerHTML = info.innerHTML || "";
			} else {
				info.innerHTML = target.innerHTML || "";
			}
		}
		return { ...info };
	});
}

export function checkImageLoaded(el: HTMLElement | SVGElement): Promise<any> {
	if (el.tagName.toLowerCase() !== "img") {
		return Promise.all(
			[].slice
				.call(el.querySelectorAll("img"))
				.map((el) => checkImageLoaded(el))
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
			matrix3d(moveMatrix, prevMatrix)
		);
	} else if (frame.has("transform", "matrix3d")) {
		let num = 1;
		while (frame.has("transform", `matrix3d${++num}`)) {}

		frame.set("transform", `matrix3d${num}`, [...moveMatrix]);
		frame.setOrders(["transform"], [`matrix3d${num}`, ...transformOrders]);
	} else {
		frame.set("transform", "matrix3d", [...moveMatrix]);
		frame.setOrders(["transform"], ["matrix3d", ...transformOrders]);
	}
}

export function getContentElement(el: HTMLElement): HTMLElement | null {
	if (el.contentEditable === "inherit") {
		return getContentElement(el.parentElement!);
	}
	if (el.contentEditable === "true") {
		return el;
	}
	return null;
}

export function makeScenaFunctionComponent<T = IObject<any>>(
	id: string,
	component: (props: ScenaProps & T) => React.ReactElement<any, any>
): ScenaFunctionComponent<T> {
	(component as ScenaFunctionComponent<T>).scenaComponentId = id;

	return component as ScenaFunctionComponent<T>;
}
