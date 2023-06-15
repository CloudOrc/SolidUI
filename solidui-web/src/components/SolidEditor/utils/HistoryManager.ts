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

import { IObject } from "@daybrush/utils";
import SolidEditor from "../SolidEditor";

export type RestoreCallback = (props: any, editor: SolidEditor) => any;
export interface HistoryAction {
	type: string;
	props: IObject<any>;
}
export default class HistoryManager {
	private undoStack: HistoryAction[] = [];
	private redoStack: HistoryAction[] = [];
	private types: IObject<{ redo: RestoreCallback; undo: RestoreCallback }> = {};
	constructor(private editor: SolidEditor) {}
	public registerType(
		type: string,
		undo: RestoreCallback,
		redo: RestoreCallback,
	) {
		this.types[type] = { undo, redo };
	}
	public addAction(type: string, props: IObject<any>) {
		this.editor.console.log("Add History:", type, props);
		this.undoStack.push({
			type,
			props,
		});
		this.redoStack = [];
	}
	public undo() {
		const undoAction = this.undoStack.pop();

		if (!undoAction) {
			return;
		}
		this.editor.console.log(
			`Undo History: ${undoAction.type}`,
			undoAction.props,
		);
		this.types[undoAction.type].undo(undoAction.props, this.editor);
		this.redoStack.push(undoAction);
	}
	public redo() {
		const redoAction = this.redoStack.pop();

		if (!redoAction) {
			return;
		}
		this.editor.console.log(
			`Redo History: ${redoAction.type}`,
			redoAction.props,
		);
		this.types[redoAction.type].redo(redoAction.props, this.editor);
		this.undoStack.push(redoAction);
	}
}
