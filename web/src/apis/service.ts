import axios, { AxiosRequestConfig, AxiosRequestHeaders } from "axios";
import { API_URL } from "@/config";
import { message } from "antd";
import { Result, AxiosResultType, HttpMethod, ApiResult } from "@/types";

const ErrorCode = {
	OK: 0,
	UNAUTHORIZED: 401,
	FAIL: -1,
};

const instance = axios.create({
	baseURL: API_URL,
	timeout: 10000,
	headers: {
		"Content-Type": "application/json;charset=utf-8",
	},
	withCredentials: true,
});

instance.interceptors.request.use(
	// @ts-ignore
	(config: AxiosRequestConfig) => {
		let token = localStorage.getItem("token");
		if (token) {
			// @ts-ignore
			config.headers["Authorization"] = `Bearer ${token}`;
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

instance.interceptors.response.use(
	(response) => {
		return response;
	},
	(error) => {
		console.log(error);
		if (error.response.status === 401) {
			message.error("session timeout, please sign in again");
			localStorage.removeItem("token");
			window.location.href = "/login";
		}
		return Promise.reject(error);
	}
);

function doGet<T>(
	url: string,
	params: any = {},
	config: AxiosRequestConfig = {}
	// headers: AxiosRequestHeaders
): Promise<AxiosResultType<Result<T>>> {
	return instance.get(url, {
		params,
		...config,
		// ...headers,
	});
}

function doPost<T>(
	url: string,
	data: any = {},
	config: AxiosRequestConfig = {}
	// headers: AxiosRequestHeaders
): Promise<AxiosResultType<Result<T>>> {
	return instance.post(url, data, {
		...config,
		// ...headers,
	});
}

function doPut<T>(
	url: string,
	data: any = {},
	config: AxiosRequestConfig = {}
	// headers: AxiosRequestHeaders
): Promise<AxiosResultType<Result<T>>> {
	return instance.put(url, data, {
		...config,
		// ...headers,
	});
}

function doDelete<T>(
	url: string,
	data: any = {},
	config: AxiosRequestConfig = {}
	// headers: AxiosRequestHeaders
): Promise<AxiosResultType<Result<T>>> {
	return instance.delete(url, {
		data,
		...config,
		// ...headers,
	});
}

function doRequest<T>(
	method: HttpMethod,
	url: string,
	data: any = {},
	config: AxiosRequestConfig = {}
	// headers: AxiosRequestHeaders
): Promise<ApiResult<T>> {
	let response: Promise<AxiosResultType<Result<T>>>;
	switch (method) {
		case "get":
			response = doGet(url, data, config);
			break;
		case "post":
			console.log("post....");
			response = doPost(url, data, config);
			break;
		case "put":
			response = doPut(url, data, config);
			break;
		case "delete":
			response = doDelete(url, data, config);
			break;
		default:
			response = doGet(url, data, config);
			break;
	}

	console.log(response);
	return new Promise<ApiResult<T>>((resolve, reject) => {
		return response
			.then((res) => {
				console.log(res);
				let data = res.data;
				let code = data.code;
				if (code === ErrorCode.OK) {
					resolve({
						ok: true,
						data: data.data,
					});
				} else {
					if (code === ErrorCode.UNAUTHORIZED) {
						message.warning(data.message);
						resolve({
							ok: false,
						});
					} else {
						reject(res.data);
					}
				}
			})
			.catch((err) => {
				let errText = JSON.stringify(err);
				message.warning(errText);
				reject(err);
			});
	});
}

const service = {
	get: <T>(
		url: string,
		params: any = {},
		config: AxiosRequestConfig = {},
		headers: AxiosRequestHeaders
	) => doRequest<T>("get", url, params, config),
	post: <T>(
		url: string,
		data: any = {},
		config: AxiosRequestConfig = {}
		// headers: AxiosRequestHeaders = {}
	) => doRequest<T>("post", url, data, config),
	put: <T>(
		url: string,
		data: any = {},
		config: AxiosRequestConfig = {}
		// headers: AxiosRequestHeaders
	) => doRequest<T>("put", url, data, config),
	delete: <T>(
		url: string,
		data: any = {},
		config: AxiosRequestConfig = {}
		// headers: AxiosRequestHeaders
	) => doRequest<T>("delete", url, data, config),
};

export default service;
