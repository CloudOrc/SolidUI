import { SolidViewDataType } from "@/types";

export type ProjectPageViewsResultData = {
	page: {
		id: string;
		name: string;
	};
	projectId: string;
	size: {
		width: number;
		height: number;
	};
	views: SolidViewDataType[];
};
