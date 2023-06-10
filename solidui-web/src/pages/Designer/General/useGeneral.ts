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

import React, { useEffect, useState } from "react";
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
}

interface StatefulSolidPageDataType extends SolidPageDataType {
	selected?: boolean;
}

function useGeneral() {
	const forceUpdate = useUpdate();
	const params = useParams();
	const [loading, setLoading] = useState<boolean>(false);
	const [scenes, setScenes] = useState<StatefulSolidSceneDataType[]>([]);
	const [pages, setPages] = useState<StatefulSolidPageDataType[]>([]);
	const [page, setPage] = useState<SolidPageDataType>();
	const idRef = React.useRef<string>();

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

	async function createScene() {
		let res: ApiResult<CreatedSceneResponseDataType> =
			await Apis.model.createPage({
				projectId: idRef.current || "",
				name: "场景",
				layout: "",
				orders: 1,
			});
		if (res.ok) {
			let data = res.data;
			if (isNil(data)) {
				forceUpdate();
				return;
			}
			mm.addScene({
				id: data.id,
				title: data.name,
				pages: [],
				selected: false,
			});
			let _scenes_ = mm.getScenes() as StatefulSolidSceneDataType[];
			_scenes_.forEach((_scene_) => {
				_scene_.open = false;
			});
			setScenes(_scenes_);
		}
		forceUpdate();
	}

	async function createPage(scene: StatefulSolidSceneDataType) {
		let res: ApiResult<CreatedPageResponseDataType> =
			await Apis.model.createPage({
				projectId: idRef.current || "",
				name: "页面",
				parentId: scene.id,
				layout: "",
				orders: 1,
			});

		if (res.ok) {
			let data = res.data;
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
			});

			let _pages_ = mm.getPages() as StatefulSolidPageDataType[];
			_pages_.forEach((_page_) => {
				_page_.selected = false;
			});
		}
		forceUpdate();
	}

	async function deletePage(page: SolidPageDataType) {
		if (!page || !page.id) {
			return;
		}
		let res = await Apis.model.deletePage(page.id);
		console.log(res);
		if (res.ok) {
			if (page.parentId === "0") {
				mm.removeScene(page);
			} else {
				mm.removePage(page);
			}
		}
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
			let pages = mm.getPages();
			pages.forEach((p) => {
				if (p.id === page.id) {
					p.selected = true;
				} else {
					p.selected = false;
				}
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
			eventbus.emit("onSelectPage", { id: page.id, page: page });
			forceUpdate();
		}
	}

	return {
		loading,
		scenes,
		createScene,
		createPage,
		toggleScene,
		selectPage,
		deletePage,
	};
}

export default useGeneral;
