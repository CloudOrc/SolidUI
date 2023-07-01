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

import { MoveableManagerInterface, Renderer } from "react-moveable";
import { eventbus, mm } from "@/utils";
import { SolidEditorContext } from "../SolidEditorContext";
import SolidEditor from "../SolidEditor";
import { SOLIDUI_ELEMENT_ID } from "../utils/const";

export interface DelteButtonViewableProps {
	deleteButtonViewable?: boolean;
}
export const DelteButtonViewable = {
	name: "deleteButtonViewable",
	props: {
		deleteButtonViewable: Boolean,
	},
	events: {},
	render(moveable: MoveableManagerInterface, React: Renderer) {
		const rect = moveable.getRect();
		const { pos2 } = moveable.state;

		const DeleteButton = moveable.useCSS(
			"div",
			`
        {
            position: absolute;
            left: 0px;
            top: 0px;
            will-change: transform;
            transform-origin: 0px 0px;
            width: 24px;
            height: 24px;
            background: #4af;
            background: var(--moveable-color);
            opacity: 0.9;
            border-radius: 4px;
        }
        :host:before, :host:after {
            content: "";
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%) rotate(45deg);
            width: 16px;
            height: 2px;
            background: #fff;
            border-radius: 1px;
            cursor: pointer;
        }
        :host:after {
            transform: translate(-50%, -50%) rotate(-45deg);
        }
        `,
		);
		return (
			<SolidEditorContext.Consumer key="delete-button-viewer">
				{(editor: SolidEditor | null) => (
					<DeleteButton
						className="moveable-delete-button"
						onClick={() => {
							if (editor) {
								// let ids: string[] = [];
								const targets = editor.getSelectedTargets();
								editor.removeElements(targets);
								targets.forEach((target) => {
									const id = target.getAttribute(SOLIDUI_ELEMENT_ID) as string;
									mm.removeView(id);
								});
								eventbus.emit("onRemoveViewComplete", {
									source: "viewport",
								});
							}
						}}
						style={{
							transform: `translate(${pos2[0]}px, ${pos2[1]}px) rotate(${rect.rotation}deg) translate(10px)`,
						}}
					/>
				)}
			</SolidEditorContext.Consumer>
		);
	},
} as const;
