import { IObject } from "@daybrush/utils";
import Selecto from "react-selecto";
import SolidEditor from "../SolidEditor";
import SolidViewport from "../SolidViewport";
import MoveableManager from "./MoveableManager";
import Debugger from "./Debugger";
import Memory from "./Memory";
import MoveableData from "./MoveableData";
import { Emitter } from "mitt";
import { EventBusType } from "@/types";

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
	jsx: SolidViewJSXType;
	name: string;
	frame?: IObject<any>;
	frameOrder?: IObject<any>;
	moveMatrix?: number[];

	scopeId?: string;
	children?: ElementInfo[];
	attrs?: IObject<any>;
	componentId?: string;
	jsxId?: string;
	el?: HTMLElement | null;
	id?: string;
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
	// eventBus: EventBus;
	moveableData: MoveableData;
	// keyManager: KeyManager;
	// historyManager: HistoryManager;
	console: Debugger;
	moveableManager: React.RefObject<MoveableManager>;
	// eventbus: Emitter<EventBusType>;

	getViewport: () => SolidViewport;
	getSelecto: () => Selecto;
}

export interface AddedInfo {
	added: ElementInfo[];
}

export interface RemovedInfo {
	removed: ElementInfo[];
}
