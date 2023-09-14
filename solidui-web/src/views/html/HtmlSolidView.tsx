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
import { eventbus } from "@/utils";

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

	private onIframeMount = (
		event: React.SyntheticEvent<HTMLIFrameElement, Event>,
	) => {
		const frame = event.target;
		const frameDoc = frame.contentDocument.documentElement;
		const frameBody = frame.contentDocument.body;

		const containerViewRef = this.getViewRef().current;
		const scrollWidth = frameDoc.scrollWidth;
		const scrollHeight = frameDoc.scrollHeight;
		const { width, height } = this.getVM().size;
		frameDoc.style.padding = "0px";
		frameBody.style.margin = "0px";
		if (scrollWidth > width) {
			containerViewRef.style.width = `${scrollWidth}px`;
		}
		if (scrollHeight > height) {
			containerViewRef.style.height = `${scrollHeight}px`;
		}
	};
	protected resize(): void {}
	protected renderView(): React.ReactNode {
		const { code } = this.getVM().options || {};
		return (
			<div ref={this.divRef} className="SolidViewItemContent" data-type="html">
				{code && (
					<LazyLoad>
						<HandleLayer />
						<iframe
							importance="low"
							loading="lazy"
							className="frame"
							srcDoc={code}
							onLoad={this.onIframeMount}
						/>
					</LazyLoad>
				)}
			</div>
		);
	}
}

const LazyLoad: FC = (props) => {
	const [state, setState] = useState(true);
	useEffect(() => {
		if (state) setTimeout(() => setState(false), 50);
	}, [state]);
	if (state) return null;
	return props.children;
};

const HandleLayer: FC = () => {
	const [active, setActive] = useState(false);
	useEffect(() => {
		const onMoveableRenderEnd = () => {
			setActive(false);
			eventbus.off("onMoveableRenderEnd", onMoveableRenderEnd);
		};
		const onMoveableRednerStart = () => {
			setActive(true);
			eventbus.on("onMoveableRenderEnd", onMoveableRenderEnd);
		};

		eventbus.on("onMoveableRednerStart", onMoveableRednerStart);
		return () => {
			eventbus.off("onMoveableRednerStart", onMoveableRednerStart);
		};
	}, []);

	return (
		<>
			<div className={classnames(["handleBlock", "TopHandle"])}></div>
			<div className={classnames("fullShade", { active })} />
		</>
	);
};
