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
import Selecto from "react-selecto";
import SolidEditor from "../SolidEditor";
import SolidViewport from "../SolidViewport";
import MoveableManager from "./MoveableManager";
import Memory from "./Memory";
import MoveableData from "./MoveableData";

export interface BaseSolidViewProps {
	visualElementId?: string;
	visualAttrs?: IObject<any>;
}

export type SolidViewComponent =
	React.JSXElementConstructor<BaseSolidViewProps> & {
		visualComponentId: string;
	};

export type SolidViewJSXElement =
	| React.ReactElement<any, string>
	| VisualFunctionJSXElement;
export type VisualFunctionJSXElement = React.ReactElement<
	any,
	SolidViewComponent
>;
export type SolidViewJSXType =
	| SolidViewJSXElement
	| string
	| SolidViewComponent;

export interface ElementInfo {
	id?: string;
	name: string;
	jsx: SolidViewJSXType;
	scopeId?: string;
	children?: ElementInfo[];
	attrs?: IObject<any>;
	componentId?: string;
	jsxId?: string;
	el?: HTMLElement | SVGElement;
	index?: number;
}

export interface AddedInfo {
	added: ElementInfo[];
}
export interface RemovedInfo {
	removed: ElementInfo[];
}

export interface EditorInterface {
	editor: SolidEditor;
	memory: Memory;
	moveableData: MoveableData;
	moveableManager: React.RefObject<MoveableManager>;
	getViewport: () => SolidViewport;
	getSelecto: () => Selecto;
}
