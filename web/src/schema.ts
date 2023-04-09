const schema = {
	$schema: "http://json-schema.org/draft-07/schema#",
	type: "object",
	properties: {
		id: {
			type: "string",
			description: "The id of solid model",
		},
		title: {
			type: "string",
			description: "The title of solid model",
		},
		size: {
			type: "object",
			properties: {
				width: {
					type: "number",
					minimum: 100,
				},
				height: {
					type: "number",
					minimum: 100,
				},
			},
			required: ["width", "height"],
			errorMessage: {
				required: {
					width: "size width required",
					height: "size height required",
				},
				properties: {
					width:
						"width should be a number bigger or equal to 100, current value is ${/size/width}",
					height:
						"height should be a number bigger or equal to 100, current value is ${/size/height}",
				},
			},
		},
		scenes: {
			type: "array",
			items: {
				type: "object",
				properties: {
					id: {
						type: "string",
					},
					title: {
						type: "string",
					},
				},
				required: ["id", "title"],
			},
		},
	},
};
