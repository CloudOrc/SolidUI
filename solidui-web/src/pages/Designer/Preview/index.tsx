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

import React, { useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { useMemoizedFn } from "ahooks";
import {
	CaretLeftOutlined,
	CaretUpOutlined,
	FullscreenOutlined,
	LeftOutlined,
	RightOutlined,
} from "@ant-design/icons";
import Select, { Option } from "rc-select";
import mitt from "mitt";
import Apis from "@/apis";
import { ApiResult, ProjectPageDataType, SolidViewDataType } from "@/types";
import { ProjectPageViewsResultData } from "@/apis/types/resp";
import SolidViewFactory from "@/views/SolidViewFactory";
import { get, isNil } from "lodash-es";
import FullScreen from "@/utils/fullScreen";
import "./preview.less";
import { message } from "antd";

interface Option {
	value: string | number;
	label: string;
	children?: Option[];
}

const factory = new SolidViewFactory();
const eventbus = mitt();

export default function Preview() {
	const params = useParams();
	const [searchParams] = useSearchParams();
	const [scenePageOptions, setScenePageOptions] = React.useState<Option[]>([]);
	const [views, setViews] = React.useState<SolidViewDataType[]>([]);

	const handleLoad = useMemoizedFn(async () => {
		const { id } = params;
		const pageId = searchParams.get("pageId");

		if (id) {
			const res: ApiResult<ProjectPageDataType[]> = await Apis.model.queryPages(
				id,
			);
			if (res.ok) {
				const data = res.data || [];
				const scenes: Option[] = [];
				if (data.length > 0) {
					for (let i = 0; i < data.length; i++) {
						const scene: Option = {
							value: data[i].id,
							label: data[i].name,
							children: [],
						};

						if (data[i].children) {
							for (let j = 0; j < data[i].children.length; j++) {
								if (isNil(scene) || isNil(scene.children)) {
									continue;
								}
								scene.children.push({
									value: data[i].children[j].id,
									label: data[i].children[j].name,
									children: [],
								});
							}
						}
						scenes.push(scene);
					}
				}
				if (pageId) {
					await queryViews(id, pageId);
				}
				setScenePageOptions(scenes);
			}
		}
	});

	useEffect(() => {
		handleLoad();
	}, [handleLoad]);

	async function onChange(value: string[]) {
		if (value && value[0] && value[1]) {
			queryViews(value[0], value[1]);
		}
	}

	async function queryViews(projectId: string, pageId: string) {
		const res: ApiResult<ProjectPageViewsResultData> =
			await Apis.model.queryViews(projectId, pageId);
		if (res.ok) {
			const { data } = res;
			setViews(data?.views || []);
		}
	}

	function renderViews() {
		const nodes: React.ReactNode[] = [];
		views.forEach((view, idx) => {
			const { type } = view;
			const builder = factory.getBuilder(type);
			if (builder === undefined) {
				return;
			}
			const SolidViewComponent = builder.getComponentType();
			const _style: React.CSSProperties = {
				position: "absolute",
				top: `${view.position.left}px`,
				left: `${view.position.top}px`,
				width: `${view.size.width}px`,
				height: `${view.size.height}px`,
				background: "#fff",
				zIndex: idx,
			};
			nodes.push(
				<SolidViewComponent
					eventbus={eventbus}
					viewModel={view}
					style={_style}
					key={`view${view.id}`}
				/>,
			);
		});
		return nodes;
	}

	return (
		<div id="preview">
			<div className="view-container">{renderViews()}</div>
			<div className="operating-area">
				<FeatureBar onPageChange={onChange} data={scenePageOptions} />
			</div>
		</div>
	);
}

interface IPointerProps {
	data: any[];
	onPageChange: (page: any) => void;
}

function FeatureBar(props: IPointerProps) {
	// scene
	const scenes = useMemo(() => {
		const mScenes: { [key: string]: any } = {};
		for (let i = 0; i < props.data.length; i++) {
			const scene = props.data[i];
			mScenes[scene.value] = scene;
		}
		return mScenes;
	}, [props.data]);
	// 当前scene
	const [currentScene, setCurrnetScene] = useState<any>(null);
	// 当前page index
	const [currentPageIndex, setCurrnetPageIndex] = useState<number>(NaN);
	// 当前页
	const currentPage = get(currentScene, ["children", currentPageIndex], {});

	// scene change
	function onSceneChange(scene: string) {
		setCurrnetScene(scenes[scene]);
		if (scenes[scene].children?.length) {
			setCurrnetPageIndex(0);
			props.onPageChange([
				get(scenes[scene], "value"),
				get(scenes[scene], ["children", 0, "value"]),
			]);
		}
	}
	// page change
	function onPageChange(dir: "r" | "l") {
		if (currentScene) {
			let nextPage: number = currentPageIndex;
			if (dir === "l") {
				nextPage = Math.max(currentPageIndex - 1, 0);
			}
			if (dir === "r") {
				nextPage = Math.min(
					currentPageIndex + 1,
					currentScene.children.length - 1,
				);
			}
			setCurrnetPageIndex(nextPage);
			props.onPageChange([
				get(currentScene, "value"),
				get(currentScene, ["children", nextPage, "value"]),
			]);
		} else {
			message.open({
				type: "warning",
				content: "please select scene",
			});
		}
	}

	function renderIcon(p: any) {
		return p.open ? (
			<CaretUpOutlined rev={false} />
		) : (
			<CaretLeftOutlined rev={false} />
		);
	}

	return (
		<div className="featbar-wrapper">
			<div className="featbar-scene">
				<Select
					className="feature-select"
					value={currentScene?.value}
					onChange={onSceneChange}
					menuItemSelectedIcon={null}
					inputIcon={renderIcon}
					direction="ltr"
					placeholder="please select scene"
					dropdownStyle={{
						zIndex: 1000,
						background: "#00000050",
						borderWidth: 0,
						padding: 0,
						minHeight: 0,
					}}
				>
					{props.data.map((scene) => (
						<Option key={scene.value} value={scene.value}>
							<div
								style={{
									cursor: "pointer",
								}}
							>
								{scene.label}
							</div>
						</Option>
					))}
				</Select>
			</div>
			<div className="featbar-divider" />
			<div className="featbar-page">
				<span className="left_arrows">
					<span onClick={() => onPageChange("l")}>
						<LeftOutlined rev={false} />
					</span>
				</span>
				<span className="page_title">
					{currentPage.label || "please select page"}
				</span>
				<span className="right_arrows">
					<span onClick={() => onPageChange("r")}>
						<RightOutlined rev={false} />
					</span>
				</span>
			</div>
			<div className="featbar-divider" />
			<div className="featbar-tools">
				<FullscreenOutlined
					rev={false}
					onClick={() => {
						FullScreen.switchFullScreen();
					}}
				/>
			</div>
		</div>
	);
}
