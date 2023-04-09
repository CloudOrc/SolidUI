import {
	SolidModelDataType,
	SolidPageDataType,
	SolidViewDataType,
} from "@/types/solid";
import { isNil } from "lodash-es";

export function getPage(
	model: SolidModelDataType,
	id: string
): SolidPageDataType | undefined {
	if (isNil(model) || isNil(id)) {
		return undefined;
	}
	let scenes = model.scenas || [];
}
