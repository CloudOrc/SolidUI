import React from "react";

import { IObject, isString, isArray, isNumber } from "@daybrush/utils";

import {
	SolidViewJSXElement,
	ElementInfo,
	SolidViewComponent,
	AddedInfo,
	RemovedInfo,
	EditorInterface,
} from "./utils/types";
import { SOLIDUI_ELEMENT_ID } from "./utils/const";
import {
	isVisualFunction,
	isVisualElement,
	getId,
	updateElements,
	getScenaAttrs,
} from "./utils";
import { connectEditorContext } from "./SolidEditorContext";
import { eventbus } from "@/utils";
import { indexOf } from "lodash-es";

export default interface VisualViewport extends EditorInterface {}

@connectEditorContext
export default class VisualViewport extends React.PureComponent<{
	children: any;
	style: IObject<any>;
	onBlur: (e: any) => any;
}> {
	public components: IObject<SolidViewComponent> = {};
	public jsxs: IObject<SolidViewJSXElement> = {};
	public viewport: ElementInfo = {
		jsx: <div></div>,
		name: "Viewport",
		id: "viewport",
		children: [],
	};
	public ids: IObject<ElementInfo> = {
		viewport: this.viewport,
	};

	public viewportRef = React.createRef<HTMLDivElement>();

	public makeId(ids: IObject<any> = this.ids) {
		while (true) {
			const id = `visual${Math.floor(Math.random() * 100000000)}`;
			if (ids[id]) {
				continue;
			}
			return id;
		}
	}

	public getViewportInfos() {
		return this.viewport.children!;
	}

	public getSortedIndexesList(
		targets: Array<string | HTMLElement | SVGElement | number[]>
	) {
		const indexesList = targets.map((target) => {
			if (Array.isArray(target)) {
				return target;
			}
			return this.getIndexes(target!);
		});

		indexesList.sort((a, b) => {
			const aLength = a.length;
			const bLength = b.length;
			const length = Math.min(aLength, bLength);

			for (let i = 0; i < length; ++i) {
				if (a[i] === b[i]) {
					continue;
				}
				return a[i] - b[i];
			}
			return aLength - bLength;
		});

		return indexesList;
	}

	public getSortedTargets(targets: Array<string | HTMLElement | SVGElement>) {
		return this.getSortedInfos(targets).map((info) => info.el!);
	}

	public getSortedInfos(targets: Array<string | HTMLElement | SVGElement>) {
		const indexesList = this.getSortedIndexesList(targets);

		return indexesList.map((indexes) => this.getInfoByIndexes(indexes));
	}

	public getIndexes(target: HTMLElement | SVGElement | string): number[] {
		const info = (
			isString(target) ? this.getInfo(target) : this.getInfoByElement(target)
		)!;

		if (!info.scopeId) {
			return [];
		}
		const parentInfo = this.getInfo(info.scopeId)!;

		return [
			...this.getIndexes(info.scopeId),
			parentInfo.children!.indexOf(info),
		];
	}

	public getInfo(id: string) {
		return this.ids[id];
	}

	public setInfo(id: string, info: ElementInfo) {
		const ids = this.ids;
		ids[id] = info;
	}

	public getInfoByElement(el: HTMLElement | SVGElement) {
		return this.ids[getId(el)];
	}

	public getInfoByIndexes(indexes: number[]) {
		return indexes.reduce((info: ElementInfo, index: number) => {
			return info.children![index];
		}, this.viewport);
	}

	public getNextInfo(id: string) {
		const info = this.getInfo(id);
		const parentInfo = this.getInfo(info.scopeId!)!;
		const parentChildren = parentInfo.children!;
		const index = parentChildren.indexOf(info);

		return parentChildren[index + 1];
	}

	public getIndex(id: string | HTMLElement) {
		const indexes = this.getIndexes(id);
		const length = indexes.length;
		return length ? indexes[length - 1] : -1;
	}

	public removeAll(): Promise<RemovedInfo> {
		let infos = this.getViewportInfos();
		return this.removeTargets(infos);
		// this.getInfoByElement
		// this.unregisterChildren(this.ids);
	}

	public getElements(ids: string[]) {
		return ids.map((id) => this.getElement(id)).filter((el) => el) as Array<
			HTMLElement | SVGElement
		>;
	}

	public getElement(id: string) {
		const info = this.getInfo(id);

		return info ? info.el : null;
	}

	public removeTargets(
		targets: Array<HTMLElement | SVGElement>
	): Promise<RemovedInfo> {
		const removedChildren = this.getSortedTargets(targets)
			.map((target) => {
				return this.getInfoByElement(target);
			})
			.filter((info) => info) as ElementInfo[];
		const indexes = removedChildren.map((info) => this.getIndex(info.id!));
		const removed = this.unregisterChildren(removedChildren);

		removed.forEach((info, i) => {
			info.index = indexes[i];
		});
		return new Promise((resolve) => {
			this.forceUpdate(() => {
				resolve({
					removed,
				});
			});
		});
	}

	public appendJSXs(
		jsxs: ElementInfo[],
		appendIndex: number,
		scopeId?: string
	): Promise<AddedInfo> {
		const jsxInfos = this.registerChildren(jsxs, scopeId);
		jsxInfos.forEach((info, i) => {
			const scopeInfo = this.getInfo(scopeId || info.scopeId!);
			const children = scopeInfo.children!;

			if (appendIndex > -1) {
				children.splice(appendIndex + i, 0, info);
				info.index = appendIndex + i;
			} else if (isNumber(info.index)) {
				children.splice(info.index, 0, info);
			} else {
				info.index = children.length;
				children.push(info);
			}
		});

		return new Promise((resolve) => {
			this.forceUpdate(() => {
				resolve({
					added: updateElements(jsxInfos),
				});
			});
		});
	}

	public getLastChildInfo(id: string) {
		const info = this.getInfo(id);
		const children = info.children!;
		return children[children.length - 1];
	}

	public registerChildren(jsxs: ElementInfo[], parentScopeId?: string) {
		return jsxs.map((info) => {
			const id = info.id || this.makeId();
			const jsx = info.jsx;
			const children = info.children || [];
			const scopeId = parentScopeId || info.scopeId || "viewport";
			let componentId = "";
			let jsxId = "";

			if (isVisualElement(jsx)) {
				jsxId = this.makeId(this.jsxs);

				this.jsxs[jsxId] = jsx;
				const component = jsx.type;
				componentId = (component as SolidViewComponent).visualComponentId;
				this.components[componentId] = component as SolidViewComponent;
			}
			const elementInfo: ElementInfo = {
				...info,
				jsx,
				children: this.registerChildren(children, id),
				scopeId,
				componentId,
				jsxId,
				frame: info.frame || {},
				el: null,
				id,
			};
			this.setInfo(id, elementInfo);
			return elementInfo;
		});
	}

	public unregisterChildren(
		children: ElementInfo[],
		isChild?: boolean
	): ElementInfo[] {
		const ids = this.ids;

		return children.slice(0).map((info) => {
			const target = info.el!;
			let innerText = "";
			let innerHTML = "";

			if (info.attrs!.contenteditable) {
				innerText = (target as HTMLElement).innerText;
			} else {
				innerHTML = target.innerHTML;
			}

			if (!isChild) {
				const parentInfo = this.getInfo(info.scopeId!);
				const parentChildren = parentInfo.children!;
				const index = parentChildren.indexOf(info);
				parentInfo.children!.splice(index, 1);
			}
			const nextChildren = this.unregisterChildren(info.children!, true);

			delete ids[info.id!];
			delete info.el;

			return {
				...info,
				innerText,
				innerHTML,
				attrs: getScenaAttrs(target),
				children: nextChildren,
			};
		});
	}

	public render() {
		const style = this.props.style;
		return (
			<div
				className={"editor-viewport-container"}
				onBlur={this.props.onBlur}
				style={style}
			>
				{this.props.children}
				<div
					className={"editor-viewport"}
					{...{ [SOLIDUI_ELEMENT_ID]: "viewport" }}
					ref={this.viewportRef}
				>
					{this.__renderChildren(this.getViewportInfos())}
				</div>
			</div>
		);
	}

	private __renderChildren(children: ElementInfo[]): SolidViewJSXElement[] {
		return children.map((info) => {
			const jsx = info.jsx;
			const nextChildren = info.children!;
			const renderedChildren = this.__renderChildren(nextChildren);
			const id = info.id!;
			const props: IObject<any> = {
				key: id,
			};

			if (isString(jsx)) {
				props[SOLIDUI_ELEMENT_ID] = id;
				return React.createElement(
					jsx,
					props,
					...renderedChildren
				) as SolidViewJSXElement;
			} else if (isVisualFunction(jsx)) {
				props.scenaElementId = id;
				props.scenaAttrs = info.attrs || {};
				return React.createElement(
					jsx,
					props,
					...renderedChildren
				) as SolidViewJSXElement;
			} else if (isString(jsx.type)) {
				props[SOLIDUI_ELEMENT_ID] = id;
			} else {
				props[SOLIDUI_ELEMENT_ID] = id;
				props.scenaAttrs = info.attrs || {};
			}
			const jsxChildren = jsx.props.children;
			// inject eventbus
			props.eventbus = eventbus;
			return React.cloneElement(
				jsx,
				{ ...jsx.props, ...props },
				...(isArray(jsxChildren) ? jsxChildren : [jsxChildren]),
				...this.__renderChildren(nextChildren)
			) as SolidViewJSXElement;
		});
	}
}
