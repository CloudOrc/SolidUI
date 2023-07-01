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

import React from "react";
import { IObject } from "@daybrush/utils";
import { message } from "antd";
import { eventbus, mm } from "@/utils/index";
import {
	OnDrawEventData,
	OnModelLoadEventData,
	OnSelectPageEventData,
	OnSelectViewEventData,
} from "@/types/eventbus";
import SolidViewFactory from "@/views/SolidViewFactory";
import SolidEditor from "../SolidEditor";

export type RestoreCallback = (props: any, editor: SolidEditor) => any;
export interface HistoryAction {
	type: string;
	props: IObject<any>;
}
export default class SolidEditorManager {
	private factory: SolidViewFactory;

	constructor(private editor: SolidEditor) {
		this.factory = new SolidViewFactory();

		this.handleOnDraw = this.handleOnDraw.bind(this);
		this.handleSelectPage = this.handleSelectPage.bind(this);
		this.handleModelLoad = this.handleModelLoad.bind(this);
		this.handleSelectViewinViewList =
			this.handleSelectViewinViewList.bind(this);

		eventbus.on("onDraw", this.handleOnDraw);
		eventbus.on("onSelectPage", this.handleSelectPage);
		eventbus.on("onModelLoad", this.handleModelLoad);
		eventbus.on("onSelectViewInViewList", this.handleSelectViewinViewList);
	}

	/**
	 * TODO: refactor
	 * 处理 properties 配置的值，修改后，影响中间编辑器的显示
	 * 定制方法 this.editor | this.viewport (.updateView(....))
	 * @param event event {}
	 */
	private handleUpdateViewPropertyValue(event: any) {}

	private handleOnDraw(event: OnDrawEventData) {
		if (!mm.getCurrentPage()) {
			message.warn("please select one page before draw view");
			return;
		}
		const { viewType } = event;
		const builder = this.factory.getBuilder(viewType);
		if (builder === undefined) {
			return;
		}
		const SolidViewComponent = builder.getComponentType();
		const vm = builder.createModel();
		// let zoom = this.editor.getZoom();
		const _style: React.CSSProperties = {
			...vm.style,
			// top: `${vm.position.top}px`,
			// left: `${vm.position.left}px`,
			width: `${vm.size.width}px`,
			height: `${vm.size.height}px`,
		};
		this.editor
			.appendJSX({
				id: vm.id,
				jsx: <SolidViewComponent viewModel={vm} style={_style} />,
				// frame: vm.frame,
				name: builder.getTitle(),
			})
			.then(() => {
				mm.addView(vm);
				eventbus.emit("onDrawComplete", { id: vm.id });
			});
	}

	private handleSelectPage(event: OnSelectPageEventData) {
		const pageId = event.id;
		const page = mm.getPage(pageId);
		this.editor.clear().then((removed) => {
			const views = page?.views || [];
			views.forEach((view) => {
				const builder = this.factory.getBuilder(view.type);
				if (builder === undefined) {
					return;
				}
				const SolidViewComponent = builder.getComponentType();
				const { style, ...vm } = view;
				const _style: React.CSSProperties = {
					...style,
					width: `${vm.size.width}px`,
					height: `${vm.size.height}px`,
					// top: `${vm.position.top}px`,
					// left: `${vm.position.left}px`,
					position: "absolute",
					// transform: `translate(${vm.frame.translate[0]}px, ${vm.frame.translate[1]}px)`,
					transform: `translate(${vm.position.top}px, ${vm.position.left}px)`,
				};
				// if (!view.data.remote) {
				if (!vm.data.dataSourceId || !vm.data.sql) {
					const localVM = builder.createModel();
					vm.data = localVM.data;
				}
				// console.log("handleSelectPagexxxx", view);
				this.editor.appendJSXsOnly([
					{
						id: view.id,
						// jsx: (
						// 	<div style={_style}>
						// 		<SolidViewComponent viewModel={vm} />
						// 	</div>
						// ),
						jsx: <SolidViewComponent viewModel={vm} style={_style} />,
						// frame: vm.frame,
						name: builder.getTitle(),
					},
				]);

				// this.editor.appendJSX({
				// 	id: view.id,
				// 	jsx: <SolidViewComponent viewModel={vm} style={_style} />,
				// 	// frame: vm.frame,
				// 	name: builder.getTitle(),
				// });
			});
		});
	}

	private handleModelLoad(event: OnModelLoadEventData) {}

	private handleSelectViewinViewList(event: OnSelectViewEventData) {
		const view = mm.getView(event.id);
		if (view) {
			this.editor.selectTarget(view.id);
		}
	}

	/// / ------------------ internal communcation methods ------------------
	public _internal_select_view(id: string) {
		eventbus.emit("onSelectViewInViewport", { id });
	}
}
