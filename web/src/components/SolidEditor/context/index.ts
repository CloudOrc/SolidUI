// import * as React from "react";
// import { SolidEditorContext } from "../SolidEditorContext";
// import { SOLID_EDITOR_PROPERTIES } from "../utils/const";

// function connectContext(
// 	context: React.Context<any>,
// 	properties: readonly string[]
// ) {
// 	return function (Component: any) {
// 		const prototype = Component.prototype;

// 		Component.contextType = context;
// 		properties.forEach((name) => {
// 			Object.defineProperty(prototype, name, {
// 				get: function () {
// 					return this.context[name];
// 				},
// 				set: function () {
// 					this.context[name](name);
// 				},
// 			});
// 		});
// 	};
// }

// const connectEditorContext = connectContext(
// 	SolidEditorContext,
// 	SOLID_EDITOR_PROPERTIES
// );

// export default connectEditorContext;
