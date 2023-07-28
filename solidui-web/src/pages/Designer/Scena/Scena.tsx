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

import React, { useState, useRef, useEffect, useLayoutEffect } from "react";
import { Slider } from "antd";
import { isNil } from "lodash-es";
import SolidEditor from "@/components/SolidEditor/SolidEditor";
import {
	OnSelectPageEventData,
	OnZoomEventData,
	onPageSizeValueChangeEventData,
} from "@/types/eventbus";
import { eventbus } from "@/utils";

function Scena() {
	const [width, setWidth] = useState(1024);
	const [height, setHeight] = useState(768);
	const [zoom, setZoom] = useState(1);
	const areaTopRef = useRef<HTMLDivElement>(null);

	const editorRef = React.createRef<SolidEditor>();

	function getZoomValue(pZoom: number) {
		const roundZoom = Math.floor(pZoom * 100);
		return roundZoom / 100;
	}

	useLayoutEffect(() => {
		if (editorRef.current) {
			// TODO, set default zoom to 1
			setZoom(1);
			editorRef.current.getInfiniteViewer()?.scrollCenter();
		}
	}, [editorRef]);

	useEffect(() => {
		eventbus.on("onZoom", onZoom);
		eventbus.on("onSelectPage", handleSelectPage);
		eventbus.on("onPageWidthChange", handleWidthChange);
		eventbus.on("onPageHeightChange", handleHeightChange);
		return () => {
			eventbus.off("onZoom", onZoom);
			eventbus.off("onPageWidthChange", handleWidthChange);
			eventbus.off("onPageHeightChange", handleHeightChange);
			eventbus.off("onSelectPage", handleSelectPage);
		};
	}, []);

	function handleSelectPage(evt: OnSelectPageEventData) {
		const { page } = evt;
		if (isNil(page)) {
			return;
		}

		setWidth(page.size.width);
		setHeight(page.size.height);
	}

	function handleWidthChange(evt: onPageSizeValueChangeEventData) {
		setWidth(evt.value);
	}

	function handleHeightChange(evt: onPageSizeValueChangeEventData) {
		setHeight(evt.value);
	}

	function onZoom(data: OnZoomEventData) {
		setZoom(data.zoom);
	}

	return (
		<section className="workarea">
			<div
				className="area-top"
				style={{
					position: "absolute",
					top: 0,
					left: 0,
					right: 0,
					bottom: 30,
				}}
				ref={areaTopRef}
			>
				<SolidEditor
					width={width}
					height={height}
					ref={editorRef}
					zoom={zoom}
				/>
			</div>
			<div
				className="area-bottom"
				style={{
					position: "absolute",
					left: 0,
					right: 0,
					bottom: 0,
					height: 30,
					display: "flex",
					borderTop: "1px solid #D2D1D1",
					justifyContent: "space-between",
				}}
			>
				<div className="cu-b-l" />
				<div className="cu-b-r" style={{}}>
					<div className="cu-b-r-nav">
						<div className="cu-b-zoom-container">
							<Slider
								min={50}
								max={200}
								defaultValue={100}
								disabled={false}
								style={{
									width: 100,
									margin: "0 10px 0 10px",
								}}
								onChange={(value) => {
									const mZoom = value / 100;
									setZoom(mZoom);
									editorRef.current?.setZoom(mZoom);
								}}
							/>
							<span>{(getZoomValue(zoom) * 100).toFixed(0)}%</span>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}

export default Scena;
