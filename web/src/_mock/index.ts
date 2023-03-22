import { SolidModelDataType } from "@/types/solid";

const model: SolidModelDataType = {
	id: "1",
	title: "SolidViewDemo01",
	size: {
		width: 1024,
		height: 768,
	},
	frame: {},
	style: {},
	scenas: [
		{
			id: "1-1",
			title: "scena-1",
			pages: [
				{
					id: "1-1-1",
					title: "scena1-page-01",
					frame: {},
					style: {},
					views: [],
				},
				{
					id: "1-1-2",
					title: "scena1-page-02",
					frame: {},
					style: {},
					views: [],
				},
			],
		},
		{
			id: "1-2",
			title: "scena-2",
			pages: [
				{
					id: "1-2-1",
					title: "scena2-page-01",
					frame: {},
					style: {},
					views: [],
				},
				{
					id: "1-2-2",
					title: "scena2-page-02",
					frame: {},
					style: {},
					views: [],
				},
			],
		},
	],
};

export { model };
