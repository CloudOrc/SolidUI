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
import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import SolidEditor from "@/components/SolidEditor/SolidEditor";
import EChartsBarSolidView from "@/views/echarts/EChartsBarSolidView";
import { OnZoomEventData } from "@/types/eventbus";
import { SolidViewDataType } from "@/types/solid";
import { eventbus, genId } from "@/utils";

type View = {
	top: number;
	left: number;
	width: number;
	height: number;
	transform?: string;
};

function Scena() {
	const [width, setWidth] = useState(1024);
	const [height, setHeight] = useState(768);
	const [zoom, setZoom] = useState(1);
	const areaTopRef = useRef<HTMLDivElement>(null);

	let thick = 24;
	const editorRef = React.createRef<SolidEditor>();

	function getZoomValue(zoom: number) {
		let roundZoom = Math.floor(zoom * 100);
		return roundZoom / 100;
	}

	useLayoutEffect(() => {
		if (editorRef.current) {
			let container = editorRef.current.getInfiniteViewer().getContainer();
			let infiniteViewContainerRect = container.getBoundingClientRect();
			let infiniteWidth = infiniteViewContainerRect.width;
			let infiniteHeight = infiniteViewContainerRect.height;

			let wRatio = (infiniteWidth - 50) / width;
			let hRatio = (infiniteHeight - 50) / height;
			let ratio = Math.min(wRatio, hRatio);
			let roundRatio = Math.floor(ratio * 100);
			let zoom = roundRatio / 100;
			setZoom(zoom);
			editorRef.current.setZoom(zoom);
		}

		editorRef.current && editorRef.current.getInfiniteViewer()?.scrollCenter();
	}, []);

	useEffect(() => {
		eventbus.on("onZoom", onZoom);

		return () => {
			eventbus.off("onZoom", onZoom);
		};
	}, []);

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
					debug={true}
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
				<div className="cu-b-l">left</div>
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
									let zoom = value / 100;
									setZoom(zoom);
									editorRef.current && editorRef.current.setZoom(zoom);
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
