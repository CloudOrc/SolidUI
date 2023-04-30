import ApiService from "./service";
import { SolidModelCreationDataType } from "./types";

let model = {
	save: <T>(params: SolidModelCreationDataType) =>
		ApiService.post<T>("/api/v1/models", params, {}),
};

let images = {
	upload: <T>(params: FormData, props: any) =>
		ApiService.post<T>("/api/v1/images/upload", params, props),
};

let Apis = {
	model,
	images,
};

export default Apis;
