/*
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import React from "react";
import { isNil } from "lodash-es";
import SolidView, { SolidViewProps, SolidViewState } from "../SolidView";

type Base64ImageSolidViewState = {
	imageType?: string;
	imageData?: string;
} & SolidViewState;

export default class Base64ImageSolidView<
	T extends SolidViewProps,
	S extends Base64ImageSolidViewState,
> extends SolidView<T, S> {
	divRef: React.RefObject<HTMLDivElement>;

	resizeTimer?: any;

	constructor(props: T) {
		super(props);

		this.divRef = React.createRef();

		this.reFetchData = this.reFetchData.bind(this);
		this.reload = this.reload.bind(this);

		this.resize = this.resize.bind(this);
	}

	reFetchData() {}

	reload() {}

	protected reRender = async () => {
		const vm = this.getVM();
		const options = vm.options || {};
		if (!isNil(options)) {
			const { imageType, imageData } = options;
			this.setState({
				imageType,
				imageData,
			});
		}
	};

	protected baseViewDidMount(): void {
		window.addEventListener("resize", this.resize);

		const vm = this.getVM();
		const { options } = vm;
		if (!isNil(options)) {
			const { imageType, imageData } = options;
			if (imageType && imageData) {
				// const img = new Image();
				// const imageSrc = `data:"${imageType}";base64,${imageData}`;
				// const self = this;
				// img.onload = function () {
				// 	const viewRef = self.getViewRef().current;
				// 	if (viewRef) {
				// 		viewRef.style.height = `${img.height + 20}px`;
				// 		viewRef.style.width = `${img.width + 50}px}`;
				// 	}
				// };
				// img.src = imageSrc;

				this.setState({
					imageType,
					imageData,
				});
			}
		}
	}

	protected baseViewWillUnmount(): void {
		window.removeEventListener("resize", this.resize);
	}

	/// / ------------------------------------------------------------------
	/// / protected methods
	resize(): void {
		// if (this.resizeTimer) {
		// 	clearTimeout(this.resizeTimer);
		// }
		// this.resizeTimer = setTimeout(() => {}, 50);
	}

	protected renderView(): React.ReactNode {
		if (isNil(this.state)) {
			return null;
		}
		const { imageType, imageData } = this.state;
		const imageSrc = `data:"${imageType}";base64,${imageData}`;

		return (
			<div
				ref={this.divRef}
				style={{
					position: "relative",
					userSelect: "none",
					width: "100%",
					height: "100%",
				}}
			>
				{imageSrc ? <img src={imageSrc} alt="base64" /> : <div>loading</div>}
			</div>
		);
	}
}
