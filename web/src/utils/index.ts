import mitt from "mitt";
import { IObject, isString, isArray, isNumber } from "@daybrush/utils";
import { EventBusType } from "@/types/eventbus";

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

export { eventbus, genId };
