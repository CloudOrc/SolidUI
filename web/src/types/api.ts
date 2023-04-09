export interface Result<T> {
	code: number;
	message: string;
	data: T;
}

export interface AxiosResultType<T> {
	status: number;
	statusText: string;
	data: T;
}

export type HttpMethod = "get" | "post" | "put" | "delete";

export interface ApiResult<T> {
	ok: boolean;
	data?: T;
}
