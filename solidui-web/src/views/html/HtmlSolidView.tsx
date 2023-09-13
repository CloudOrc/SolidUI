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

/* eslint-disable */
// @ts-nocheck
import React, { FC, useEffect, useRef, useState } from "react";
import classnames from "classnames";
import SolidView, { SolidViewProps, SolidViewState } from "../SolidView";

type HtmlSolidViewState = {
	code: string;
} & SolidViewState;

export default class HtmlSolidView<
	T extends SolidViewProps,
	S extends HtmlSolidViewState,
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

	protected reRender = async () => {};

	protected baseViewDidMount(): void {
		window.addEventListener("resize", this.resize);
	}

	protected baseViewWillUnmount(): void {
		window.removeEventListener("resize", this.resize);
	}

	protected resize(): void {}
	protected renderView(): React.ReactNode {
		const { code } = this.getVM().options || {};
		return (
			<div ref={this.divRef} className="SolidViewItemContent" data-type="html">
				<HandleLayer />
				{code && (
					<iframe
						className="frame"
						srcDoc={code}
						onLoad={(event) => {
							const frameBody = event.target.contentDocument.body;
							const scrollWidth = frameBody.scrollWidth;
							const scrollHeight = frameBody.scrollHeight;
							const containerViewRef = this.getViewRef();
							containerViewRef.current.style.width = `${scrollWidth}px`;
							containerViewRef.current.style.height = `${scrollHeight}px`;
						}}
					/>
				)}
			</div>
		);
	}
}

const HandleLayer: FC = () => {
	const divRef = useRef<HTMLDivElement>(null);
	const [active, setActive] = useState(false);
	useEffect(() => {
		if (divRef.current) {
			const mouseup = (event) => {
				document.removeEventListener("mouseup", mouseup);
				setActive(false);
			};
			const mousedown = (event) => {
				if (event.target === divRef.current) {
					setActive(true);
					document.addEventListener("mouseup", mouseup);
				}
			};
			document.addEventListener("mousedown", mousedown);
			return () => {
				document.removeEventListener("mousedown", mousedown);
				document.removeEventListener("mouseup", mouseup);
			};
		}
	}, [divRef.current]);

	return (
		<div
			ref={divRef}
			className={classnames(["handleBlock", "TopHandle", { full: active }])}
		></div>
	);
};
