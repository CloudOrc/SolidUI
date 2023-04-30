import React from "react";
import Upload, { UploadProps } from "rc-upload";
import classNames from "classnames";
import Apis from "@/apis";
import axios, { AxiosRequestConfig, AxiosRequestHeaders } from "axios";
import { Pic } from "@icon-park/react";
import "./InputUpload.less";

export interface InputUploadProps extends UploadProps {
	prefixCls?: string;
	className?: string;
	style?: React.CSSProperties;
}

function InputUpload(props: InputUploadProps) {
	let { prefixCls = "solid", className, style } = props;

	const uploadProps = {
		action: "/api/v1/images/upload",
		multiple: false,
		data: { a: 1, b: 2 },
		headers: {
			Authorization: "$prefix $token",
		},
		onStart(file: any) {
			console.log("onStart", file, file.name);
		},
		onSuccess(res: any, file: any) {
			console.log("onSuccess", res, file.name);
		},
		onError(err: any) {
			console.log("onError", err);
		},
		onProgress({ percent }: any, file: any) {
			console.log("onProgress", `${percent}%`, file.name);
		},
		async customRequest({
			action,
			data,
			file,
			filename,
			headers,
			onError,
			onProgress,
			onSuccess,
			withCredentials,
		}: any) {
			// EXAMPLE: post form-data with 'axios'
			// eslint-disable-next-line no-undef
			const formData = new FormData();
			if (data) {
				Object.keys(data).forEach((key) => {
					formData.append(key, data[key]);
				});
			}
			formData.append(filename, file);

			// Apis.images
			// 	.upload(formData, {
			// 		// withCredentials,
			// 		// headers,
			// 		onUploadProgress: ({ total, loaded }: any) => {
			// 			onProgress(
			// 				{ percent: Math.round((loaded / total) * 100).toFixed(2) },
			// 				file
			// 			);
			// 		},
			// 	})
			// 	.then((res) => {
			// 		if (res.ok) {
			// 			onSuccess(res.data, file);
			// 		}
			// 	})
			// 	.catch((err) => {
			// 		// console.log(err);
			// 		onError(err);
			// 	});

			axios
				.post(action, formData, {
					// withCredentials,
					// headers,
					onUploadProgress: ({ total, loaded }: any) => {
						// onProgress(
						// 	{ percent: Math.round((loaded / total) * 100).toFixed(2) },
						// 	file
						// );
					},
				})
				.then(({ data: response }) => {
					onSuccess(response, file);
				})
				.catch(onError);

			return {
				abort() {
					console.log("upload progress is aborted.");
				},
			};
		},
	};

	let _props = { ...props, ...uploadProps };
	let _style: React.CSSProperties = {
		display: "flex",
		alignItems: "center",
		...style,
	};

	return (
		<Upload
			{..._props}
			className={classNames(`${prefixCls}-input-upload`, className)}
			style={_style}
		/>
	);
}

export default InputUpload;
