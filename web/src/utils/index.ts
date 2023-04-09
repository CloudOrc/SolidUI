import mitt from "mitt";
import { IObject, isString, isArray, isNumber } from "@daybrush/utils";
import { EventBusType } from "@/types/eventbus";
import ModelManager from "./ModelManager";

const ids: IObject<string> = {};

function genId() {
	while (true) {
		const id = `visual${Math.floor(Math.random() * 100000000)}`;
		if (ids[id]) {
			continue;
		}
		ids[id] = "ok";
		return id;
	}
}

const eventbus = mitt<EventBusType>();
const mm = new ModelManager();

export { eventbus, mm, genId };
