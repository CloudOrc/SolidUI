import React from "react";
import { IObject } from "@daybrush/utils";
import SolidEditor from "../SolidEditor";
import { eventbus } from "@/utils/index";
import { OnDrawEventData } from "@/types/eventbus";
import SolidViewFactory from "@/views/SolidViewFactory";

export type RestoreCallback = (props: any, editor: SolidEditor) => any;
export interface HistoryAction {
	type: string;
	props: IObject<any>;
}
export default class SolidEditorManager {
	private types: IObject<{ redo: RestoreCallback; undo: RestoreCallback }> = {};
	private factory: SolidViewFactory;
	constructor(private editor: SolidEditor) {
		this.factory = new SolidViewFactory();

		this.handleOnDraw = this.handleOnDraw.bind(this);

		eventbus.on("onDraw", this.handleOnDraw);
	}

	private handleOnDraw(event: OnDrawEventData) {
		let viewType = event.viewType;
		let builder = this.factory.getBuilder(viewType);
		if (builder === undefined) {
			return;
		}
		let SolidViewComponent = builder.getComponentType();
		let vm = builder.createModel();
		this.editor.appendJSX({
			jsx: <SolidViewComponent viewModel={vm} style={vm.style} />,
			frame: vm.frame,
			name: builder.getTitle(),
		});
	}
}
