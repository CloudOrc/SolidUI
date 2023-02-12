import {
	ScenaEditorContext,
	EDITOR_PROPERTIES,
} from "@/components/ScenaEditor/ScenaConfig";
import { connectContext } from "./ConnectContext";

export const connectEditorContext = connectContext(
	ScenaEditorContext,
	EDITOR_PROPERTIES
);
