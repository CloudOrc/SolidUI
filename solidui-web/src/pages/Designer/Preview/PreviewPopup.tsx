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

import React, { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Apis from "@/apis";
import { ApiResult, ProjectPageDataType, SolidViewDataType } from "@/types";
import { ProjectPageViewsResultData } from "@/apis/types/resp";
import SolidViewFactory from "@/views/SolidViewFactory";
import mitt from "mitt";
import "./preview.less";

interface Option {
	value: string | number;
	label: string;
	children?: Option[];
}

const factory = new SolidViewFactory();
const eventbus = mitt();

export interface PreviewPopupProps {
	projectId: string;
	pageId?: string;
}

export default function PreviewPopup(props: PreviewPopupProps) {
	let { projectId, pageId } = props;
	const [searchParams, setSearchParams] = useSearchParams();
	const [scenePageOptions, setScenePageOptions] = React.useState<Option[]>([]);
	const [selectedScenePageOption, setSelectedScenePageOption] = React.useState<
		string[]
	>([]);
	const [views, setViews] = React.useState<SolidViewDataType[]>([]);

	useEffect(() => {
		load(projectId, pageId);
	}, [projectId, pageId]);

	async function load(projectId: string, pageId?: string) {
		if (projectId) {
			let res: ApiResult<ProjectPageDataType[]> = await Apis.model.queryPages(
				projectId,
			);
			if (res.ok) {
				let data = res.data || [];
				let scenes: Option[] = [];
				if (data.length > 0) {
					for (let i = 0; i < data.length; i++) {
						let scene: Option = {
							value: data[i].id,
							label: data[i].name,
							children: [],
						};

						if (data[i].children) {
							for (let j = 0; j < data[i].children.length; j++) {
								scene &&
									scene.children &&
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
					await queryViews(projectId, pageId);
				}
				setScenePageOptions(scenes);
			}
		}
	}

	async function onChange(value: string[]) {
		if (value && value[0] && value[1]) {
			queryViews(value[0], value[1]);
		}
	}

	async function queryViews(projectId: string, pageId: string) {
		let res: ApiResult<ProjectPageViewsResultData> =
			await Apis.model.queryViews(projectId, pageId);
		if (res.ok) {
			let data = res.data;
			setViews(data?.views || []);
		}
	}

	function renderViews() {
		const nodes: React.ReactNode[] = [];
		views &&
			views.forEach((view, idx) => {
				let type = view.type;
				let builder = factory.getBuilder(type);
				if (builder === undefined) {
					return;
				}
				let SolidViewComponent = builder.getComponentType();
				let _style: React.CSSProperties = {
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
			{renderViews()}
			{/* <div
				style={{
					position: "absolute",
					top: 5,
					right: 5,
				}}
			>
				<Cascader
					size="small"
					options={scenePageOptions}
					// @ts-ignore
					onChange={onChange}
					placeholder="select scene & page"
					style={{
						marginRight: 28,
						marginTop: 1,
					}}
				/>
			</div> */}
		</div>
	);
}
