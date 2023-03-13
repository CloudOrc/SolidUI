import { createContext } from "react";
import SolidEditor from "./SolidEditor";
import { SOLID_EDITOR_PROPERTIES } from "./utils/const";

export const SolidEditorContext = createContext<SolidEditor | null>(null);

function connectContext(
	context: React.Context<any>,
	properties: readonly string[]
) {
	return function (Component: any) {
		const prototype = Component.prototype;

		Component.contextType = context;
		properties.forEach((name) => {
			Object.defineProperty(prototype, name, {
				get: function () {
					return this.context[name];
				},
				set: function () {
					this.context[name](name);
				},
			});
		});
	};
}

export const connectEditorContext = connectContext(
	SolidEditorContext,
	SOLID_EDITOR_PROPERTIES
);
