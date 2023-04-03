import React from "react";
import { IObject } from "@daybrush/utils";
import SolidEditor from "../SolidEditor";
import ModelManager from "@/utils/ModelManager";
import { eventbus } from "@/utils/index";
import {
	OnDrawEventData,
	OnModelLoadEventData,
	OnSelectPageEventData,
} from "@/types/eventbus";
import { SolidModelDataType, SolidPageDataType } from "@/types/solid";
import SolidViewFactory from "@/views/SolidViewFactory";
import { message } from "antd";
import { mm } from "@/utils";

export type RestoreCallback = (props: any, editor: SolidEditor) => any;
export interface HistoryAction {
	type: string;
	props: IObject<any>;
}
export default class SolidEditorManager {
	private types: IObject<{ redo: RestoreCallback; undo: RestoreCallback }> = {};
	private factory: SolidViewFactory;
	private model?: SolidModelDataType;
	private page?: SolidPageDataType;
	// private mm?: ModelManager;

	constructor(private editor: SolidEditor) {
		this.factory = new SolidViewFactory();
		// this.mm = new ModelManager();

		this.handleOnDraw = this.handleOnDraw.bind(this);
		this.handleSelectPage = this.handleSelectPage.bind(this);
		this.handleModelLoad = this.handleModelLoad.bind(this);

		eventbus.on("onDraw", this.handleOnDraw);
		eventbus.on("onSelectPage", this.handleSelectPage);
		eventbus.on("onModelLoad", this.handleModelLoad);
	}

	private handleOnDraw(event: OnDrawEventData) {
		if (!mm.getCurrentPage()) {
			message.warn("please select one page before draw view");
			return;
		}
		let viewType = event.viewType;
		let builder = this.factory.getBuilder(viewType);
		if (builder === undefined) {
			return;
		}
		let SolidViewComponent = builder.getComponentType();
		let vm = builder.createModel();
		let zoom = this.editor.getZoom();
		let _style: React.CSSProperties = {
			...vm.style,
			top: `${vm.position.top}px`,
			left: `${vm.position.left}px`,
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
				mm.addView({
					id: vm.id,
					title: vm.title,
					type: viewType,
					position: vm.position,
					size: vm.size,
					// position: {
					// 	top: 0,
					// 	left: 0,
					// },
					// size: {
					// 	width: 100,
					// 	height: 100,
					// },
					data: {
						id: "123",
						title: "123",
						remote: false,
					},
				});
				console.log(mm.getModel());
			});
	}

	private handleSelectPage(event: OnSelectPageEventData) {
		let pageId = event.id;
		let page = mm.getPage(pageId);
		this.editor.clear().then((removed) => {
			let views = page?.views || [];
			views.forEach((view) => {
				let builder = this.factory.getBuilder(view.type);
				if (builder === undefined) {
					return;
				}
				let SolidViewComponent = builder.getComponentType();
				let { style, ...vm } = view;
				let _style: React.CSSProperties = {
					...style,
					width: `${vm.size.width}px`,
					height: `${vm.size.height}px`,
					top: `${vm.position.top}px`,
					left: `${vm.position.left}px`,
				};
				if (!view.data.remote) {
					let localVM = builder.createModel();
					vm.data = localVM.data;
				}
				// let vm = builder.createModel(view);
				this.editor.appendJSX({
					id: view.id,
					jsx: <SolidViewComponent viewModel={vm} style={_style} />,
					// frame: vm.frame,
					name: builder.getTitle(),
				});
			});
		});
	}

	private handleModelLoad(event: OnModelLoadEventData) {
		// this.model = event.model;
		// this.mm?.attach(event.model);
	}

	private getJSX() {}
}
