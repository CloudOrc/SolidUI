import ApiService from "./service";
import { SolidModelCreationDataType } from "./types";

let model = {
	save: <T>(params: SolidModelCreationDataType) =>
		ApiService.post<T>("/api/v1/models", params, {}),
};

let Apis = {
	model,
};

export default Apis;
