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

import React, { useEffect, useState, useRef } from "react";
import { Form, message } from "antd";
import { useParams } from "react-router-dom";
import { eventbus, mm } from "@/utils";
import { SolidScenaDataType, SolidPageDataType } from "@/types/solid";
import { isNil } from "lodash-es";
import Apis from "@/apis";
import {
	ProjectPageViewsResultData,
	CreatedSceneResponseDataType,
	CreatedPageResponseDataType,
} from "@/apis/types/resp";
import { ApiResult } from "@/types";
import { useUpdate } from "react-use";

interface StatefulSolidSceneDataType extends SolidScenaDataType {
	open?: boolean;
	editing?: boolean;
}

interface StatefulSolidPageDataType extends SolidPageDataType {
	selected?: boolean;
	editing?: boolean;
}

function useGeneral() {
	const forceUpdate = useUpdate();
	const params = useParams();
	const [form] = Form.useForm();
	const [loading, setLoading] = useState<boolean>(false);
	const [scenes, setScenes] = useState<StatefulSolidSceneDataType[]>([]);
	const [modalOpen, setModalOpen] = useState<boolean>(false);
	const idRef = React.useRef<string>();

	const pageEditingModelMap = useRef<
		Map<
			string,
			{
				editing: boolean;
				oldName: string;
				newName: string;
			}
		>
	>(new Map());

	useEffect(() => {
		eventbus.on("onModelLoad", (evt) => {
			let _scenes_ = mm.getScenes() as StatefulSolidSceneDataType[];
			_scenes_.forEach((_scene_) => {
				_scene_.open = false;
			});
			setScenes(_scenes_);
		});

		return () => {
			eventbus.off("onModelLoad");
		};
	}, []);

	useEffect(() => {
		if (isNil(params.id)) {
			return;
		}

		idRef.current = params.id;
	}, [params.id]);

	async function createScene(title: string) {
		let res: ApiResult<CreatedSceneResponseDataType> =
			await Apis.model.createPage({
				projectId: idRef.current || "",
				name: title,
				layout: "",
				orders: 1,
			});
		if (res.ok) {
			let { data } = res;
			if (isNil(data)) {
				forceUpdate();
				return;
			}
			mm.addScene({
				id: data.id,
				parentId: data.parentId || "",
				title: data.name,
				pages: [],
				selected: false,
				size: {
					width: 1024,
					height: 768,
				},
			});
			let _scenes_ = mm.getScenes() as StatefulSolidSceneDataType[];
			_scenes_.forEach((_scene_) => {
				_scene_.open = false;
			});
			setScenes(_scenes_);
			message.success("create scene ok");
			toggleModal(false);
			form.resetFields();
		}
		forceUpdate();
	}

	async function createPage(scene: StatefulSolidSceneDataType, title: string) {
		let res: ApiResult<CreatedPageResponseDataType> =
			await Apis.model.createPage({
				projectId: idRef.current || "",
				name: title,
				parentId: scene.id,
				layout: "",
				orders: 1,
			});

		if (res.ok) {
			let { data } = res;
			if (isNil(data)) {
				forceUpdate();
				return;
			}
			mm.addPage({
				id: data.id,
				title: data.name,
				views: [],
				selected: false,
				parentId: data?.parentId || "",
				size: {
					width: 1024,
					height: 768,
				},
			});

			let _pages_ = mm.getPages() as StatefulSolidPageDataType[];
			_pages_.forEach((_page_) => {
				_page_.selected = false;
			});
			message.success("create page ok");
			toggleModal(false);
			form.resetFields();
		}
		forceUpdate();
	}

	async function deletePage(page: SolidPageDataType) {
		if (!page || !page.id) {
			return;
		}
		let res = await Apis.model.deletePage(page.id);
		if (res.ok) {
			if (page.parentId === "0") {
				mm.removeScene(page);
			} else {
				mm.removePage(page);
			}
		}
		setScenes(mm.getScenes());
		forceUpdate();
	}

	function toggleScene(scene: StatefulSolidSceneDataType) {
		let selectedScene = mm.getScene(scene.id);
		if (selectedScene) {
			selectedScene.selected = !selectedScene.selected;
		}
		forceUpdate();
	}

	async function selectPage(page: SolidPageDataType) {
		let currentPage = mm.getCurrentPage();
		if (currentPage && currentPage.id === page.id) {
			return;
		}

		let model = mm.getModel();
		if (isNil(model)) {
			return;
		}
		let res: ApiResult<ProjectPageViewsResultData> =
			await Apis.model.queryViews(model.id, page.id);
		if (res.ok) {
			const data = res.data;
			let pages = mm.getPages();
			pages.forEach((p) => {
				if (p.id === page.id) {
					p.selected = true;
				} else {
					p.selected = false;
				}
				p.size = {
					width: data?.size.width || 1024,
					height: data?.size.height || 768,
				};
			});
			mm.selectPage(page.id);
			let views = res.data?.views || [];
			views.forEach((v) => {
				v.id = `${v.id}`;
				v.frame = {
					// translate: [0, 0, 0, 0],
					translate: [v.position.top, v.position.left, 0, 0],
				};
			});
			mm.setViews(views);
			eventbus.emit("onSelectPage", { id: page.id, page });
			forceUpdate();
		}
	}

	async function toggleModal(open: boolean) {
		setModalOpen(open);
	}

	async function edit(
		entity: StatefulSolidPageDataType | StatefulSolidSceneDataType,
	) {
		pageEditingModelMap.current &&
			pageEditingModelMap.current.forEach((v, k) => {
				if (v) {
					pageEditingModelMap.current.set(k, {
						editing: false,
						oldName: entity.title,
						newName: entity.title,
					});
				}
			});
		pageEditingModelMap.current.set(entity.id, {
			editing: true,
			oldName: entity.title,
			newName: entity.title,
		});

		forceUpdate();
	}

	async function handleEditingInputKeyDown(
		event: React.KeyboardEvent<HTMLInputElement>,
		entity: StatefulSolidPageDataType | StatefulSolidSceneDataType,
	) {
		const selectEntity = pageEditingModelMap.current.get(entity.id);
		if (isNil(selectEntity)) {
			return;
		}
		if (event.keyCode === 27) {
			// esc
			if (selectEntity) {
				selectEntity.editing = false;
				selectEntity.newName = "";
				selectEntity.oldName = "";
			}
			forceUpdate();
		} else if (event.keyCode === 13) {
			// enter
			const res = await Apis.page.rename(entity.id, {
				name: selectEntity.newName,
			});
			if (res.ok) {
				message.success("rename ok");
				entity.title = selectEntity.newName;
				selectEntity.editing = false;
				forceUpdate();
			}
		}
	}

	return {
		loading,
		form,
		scenes,
		createScene,
		createPage,
		toggleScene,
		selectPage,
		deletePage,
		modalOpen,
		toggleModal,
		edit,
		pageEditingModelMap,
		handleEditingInputKeyDown,
	};
}

export default useGeneral;
