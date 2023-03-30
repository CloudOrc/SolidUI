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
		this.editor
			.appendJSX({
				jsx: <SolidViewComponent viewModel={vm} style={vm.style} />,
				frame: vm.frame,
				name: builder.getTitle(),
			})
			.then(() => {
				mm.addView({
					id: vm.id,
					title: vm.title,
					type: viewType,
					position: {
						top: 0,
						left: 0,
					},
					size: {
						width: 100,
						height: 100,
					},
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
		// this.mm!.selectPage(event.page.id);
		// this.page = event.page;
		let pageId = event.id;
		console.log(pageId);
		this.editor.removeAll();
	}

	private handleModelLoad(event: OnModelLoadEventData) {
		// this.model = event.model;
		this.mm?.attach(event.model);
	}
}
