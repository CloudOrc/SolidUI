import Mock from "mockjs";

Mock.mock(
	"/api/v1/images/upload",
	"post",
	Mock.mock({
		code: 0,
		message: "success",
		data: {
			id: "@id",
			title: "@title",
			url: '@image("256x256", "#50B347", "#FFF", "png", "Mock.js")',
		},
	})
);
