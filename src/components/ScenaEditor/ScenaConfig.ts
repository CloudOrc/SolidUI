import { createContext } from "react";
import ScenaEditor from "./ScenaEditor";

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

export const ScenaEditorContext = createContext<ScenaEditor | null>(null);
