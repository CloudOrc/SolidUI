import Mock from "mockjs";

import { SolidModelDataType } from "@/types/solid";

Mock.mock(
	"/api/v1/models",
	"post",
	Mock.mock({
		code: 0,
		message: "success",
	})
);
// const model: SolidModelDataType = {
// 	id: "1",
// 	title: "SolidViewDemo01",
// 	size: {
// 		width: 1024,
// 		height: 768,
// 	},
// 	frame: {},
// 	style: {},
// 	scenas: [
// 		{
// 			id: "1-1",
// 			title: "scena-1",
// 			pages: [
// 				{
// 					id: "1-1-1",
// 					title: "scena1-page-01",
// 					frame: {},
// 					style: {},
// 					views: [
// 						// {
// 						// 	id: "1-1-1-1",
// 						// 	title: "SolidViewDemo01",
// 						// 	type: "echarts_bar",
// 						// 	position: {
// 						// 		top: 0,
// 						// 		left: 0,
// 						// 	},
// 						// 	size: {
// 						// 		width: 100,
// 						// 		height: 100,
// 						// 	},
// 						// 	data: {
// 						// 		id: "1-1-1-1",
// 						// 		title: "data-1-1-1-1",
// 						// 		remote: false,
// 						// 	},
// 						// },
// 					],
// 				},
// 				{
// 					id: "1-1-2",
// 					title: "scena1-page-02",
// 					frame: {},
// 					style: {},
// 					views: [],
// 				},
// 			],
// 		},
// 		{
// 			id: "1-2",
// 			title: "scena-2",
// 			pages: [
// 				{
// 					id: "1-2-1",
// 					title: "scena2-page-01",
// 					frame: {},
// 					style: {},
// 					views: [],
// 				},
// 				{
// 					id: "1-2-2",
// 					title: "scena2-page-02",
// 					frame: {},
// 					style: {},
// 					views: [],
// 				},
// 			],
// 		},
// 	],
// };

const model = {
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
					views: [
						{
							id: "visual75868482",
							title: "bar",
							type: "echarts_bar",
							position: {
								top: 0,
								left: 0,
							},
							size: {
								width: 481,
								height: 460,
							},
							frame: {
								backgroundColor: "#333",
								translate: [31, 0, 0, 0],
								rotate: 0,
							},
							data: {
								id: "",
								title: "",
								remote: false,
								dataset: [
									["name", "pjsf", "pjhf", "cc"],
									["guomu", 9204.65, 1930.94, 1400],
									["miaomu", 9312.02, 2059.42, 902],
									["shucai", 20857.99, 7482.28, 5502],
								],
								xs: [
									{
										label: "name",
									},
								],
								ys: [
									{
										label: "pjsf",
									},
									{
										label: "pjhf",
									},
									{
										label: "cc",
									},
								],
							},
							style: {
								position: "absolute",
								background: "#fff",
								overflow: "hidden",
								border: "1px solid #f1f1f1",
							},
							option: {
								tooltip: {
									show: true,
									trigger: "axis",
									axisPointer: {
										type: "shadow",
									},
								},
							},
						},
						{
							id: "visual15961746",
							title: "bar",
							type: "echarts_bar",
							position: {
								top: 0,
								left: 0,
							},
							size: {
								width: 638,
								height: 468,
							},
							frame: {
								backgroundColor: "#333",
								translate: [357.6923077, 156.4102563, 0, 0],
								rotate: 0,
							},
							data: {
								id: "",
								title: "",
								remote: false,
								dataset: [
									["name", "pjsf", "pjhf", "cc"],
									["guomu", 9204.65, 1930.94, 1400],
									["miaomu", 9312.02, 2059.42, 902],
									["shucai", 20857.99, 7482.28, 5502],
								],
								xs: [
									{
										label: "name",
									},
								],
								ys: [
									{
										label: "pjsf",
									},
									{
										label: "pjhf",
									},
									{
										label: "cc",
									},
								],
							},
							style: {
								position: "absolute",
								background: "#fff",
								overflow: "hidden",
								border: "1px solid #f1f1f1",
							},
							option: {
								tooltip: {
									show: true,
									trigger: "axis",
									axisPointer: {
										type: "shadow",
									},
								},
							},
						},
					],
					selected: true,
				},
				{
					id: "1-1-2",
					title: "scena1-page-02",
					frame: {},
					style: {},
					views: [],
					selected: false,
				},
			],
			open: false,
			selected: true,
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
					selected: false,
				},
				{
					id: "1-2-2",
					title: "scena2-page-02",
					frame: {},
					style: {},
					views: [],
					selected: false,
				},
			],
			open: false,
		},
	],
};

export { model };
