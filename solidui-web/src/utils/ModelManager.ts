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

import {
	SolidModelDataType,
	SolidScenaDataType,
	SolidPageDataType,
	SolidViewDataType,
} from "@/types/solid";
import { eventbus } from "@/utils";
import { OnSelectViewEventData } from "@/types/eventbus";
import { isNil, set, unset, forEach, isEmpty, remove } from "lodash-es";

class ModelManager {
	private model?: SolidModelDataType;
	private currentPage?: SolidPageDataType;
	private currentView?: SolidViewDataType;
	private sceneMap: Map<string, SolidScenaDataType> = new Map();
	private pageMap: Map<string, SolidPageDataType> = new Map();
	private viewMap: Map<string, SolidViewDataType> = new Map();
	private scenes: SolidScenaDataType[] = [];
	private pages: SolidPageDataType[] = [];
	private views: SolidViewDataType[] = [];

	constructor() {
		this.handleSelectView = this.handleSelectView.bind(this);

		eventbus.on("onSelectViewInViewList", this.handleSelectView);
		eventbus.on("onSelectViewInViewport", this.handleSelectView);
	}

	private handleSelectView(data: OnSelectViewEventData) {
		let viewId = data.id;
		let view = this.viewMap.get(viewId);
		if (!isNil(view)) {
			this.currentView = view;
		}
	}

	public attach(model: SolidModelDataType): void {
		this.model = model;
		this.__config(model);
	}

	private __config(model: SolidModelDataType) {
		if (isNil(model)) {
			return;
		}
		let scenes = model.scenas;
		if (isNil(scenes)) {
			return;
		}
		for (let m = 0; m < scenes.length; m++) {
			this.sceneMap.set(scenes[m].id, scenes[m]);
			this.scenes.push(scenes[m]);

			if (isNil(scenes[m].pages)) {
				continue;
			}

			for (let n = 0; n < scenes[m].pages!.length; n++) {
				this.pageMap.set(scenes[m].pages![n].id, scenes[m].pages![n]);
				this.pages.push(scenes[m].pages![n]);

				if (isNil(scenes[m].pages![n].views)) {
					continue;
				}

				for (let x = 0; x < scenes[m].pages![n].views.length; x++) {
					this.viewMap.set(
						scenes[m].pages![n].views[x].id,
						scenes[m].pages![n].views[x]
					);
					this.views.push(scenes[m].pages![n].views[x]);
				}
			}
		}
	}

	public createScene(): SolidScenaDataType | undefined {
		if (isNil(this.model)) {
			return undefined;
		}
		let _id = new Date().getTime();
		let scene: SolidScenaDataType = {
			id: "scene_" + _id,
			title: "Scene_" + _id,
			pages: [],
		};
		this.sceneMap.set(scene.id, scene);
		this.scenes.push(scene);
		if (this.model.scenas) {
			this.model.scenas.push(scene);
		} else {
			set(this.model, "scenas", [scene]);
		}
		return scene;
	}

	public createPage(id: string): SolidPageDataType | undefined {
		if (isNil(this.model)) {
			return undefined;
		}
		let scene = this.getScene(id);
		if (isNil(scene)) {
			return undefined;
		}
		let _id = new Date().getTime();
		let page: SolidPageDataType = {
			id: "page_" + _id,
			parentId: "",
			title: "Page_" + _id,
			views: [],
		};
		scene.pages!.push(page);
		this.pageMap.set(page.id, page);
		this.pages.push(page);
		return page;
	}

	public addPage(page: SolidPageDataType): void {
		let sceneId = page.parentId;
		if (sceneId) {
			let scene = this.getScene(sceneId);
			if (scene) {
				scene.pages!.push(page);
				this.pageMap.set(page.id, page);
				this.pages.push(page);
			}
		}
	}

	public getScenes(): SolidScenaDataType[] {
		return this.scenes || [];
	}

	public getPages(): SolidPageDataType[] {
		return this.pages || [];
	}

	public getViews(): SolidViewDataType[] {
		return this.views || [];
	}

	public getScene(id: string): SolidScenaDataType | undefined {
		return this.sceneMap.get(id);
	}

	public getPage(id: string): SolidPageDataType | undefined {
		return this.pageMap.get(id);
	}

	public getCurrentPage(): SolidPageDataType | undefined {
		return this.currentPage;
	}

	public getCurrentView(): SolidViewDataType | undefined {
		return this.currentView;
	}

	public getView(id: string): SolidViewDataType | undefined {
		return this.viewMap.get(id);
	}

	public selectPage(id: string): void {
		this.currentPage = this.getPage(id);
	}

	public getModel(): SolidModelDataType | undefined {
		return this.model;
	}

	public addView(view: SolidViewDataType): void {
		if (isNil(this.currentPage)) {
			return;
		}
		this.currentPage.views.push(view);
		this.viewMap.set(view.id, view);
		this.views.push(view);
	}

	public addViews(views: SolidViewDataType[]): void {
		if (isNil(this.currentPage)) {
			return;
		}
		forEach(views, (item) => {
			this.currentPage!.views.push(item);
			this.viewMap.set(`${item.id}`, item);
			this.views.push(item);
		});
	}

	public setViews(views: SolidViewDataType[]): void {
		if (isNil(this.currentPage)) {
			return;
		}
		this.currentPage.views = [];
		forEach(views, (item) => {
			this.currentPage!.views.push(item);
			this.viewMap.set(`${item.id}`, item);
			this.views.push(item);
		});
	}

	public removeView(id: string): void {
		if (isNil(this.currentPage)) {
			return;
		}
		let index = this.currentPage.views.findIndex((item) => item.id === id);
		if (index > -1) {
			this.currentPage.views.splice(index, 1);
		}
		this.viewMap.delete(id);
		this.views = this.views.filter((item) => item.id !== id);
	}

	public getPrepareSavingModel(): SolidModelDataType | undefined {
		if (isNil(this.model)) {
			return undefined;
		}
		if (!isEmpty(this.model.scenas)) {
			forEach(this.model.scenas, (item) => {
				if (!isEmpty(item.pages)) {
					forEach(item.pages, (page) => unset(page, "selected"));
				}
				unset(item, "selected");
			});
		}
		return this.model;
	}

	public removePage(page: SolidPageDataType): void {
		this.pageMap.delete(page.id);
		remove(this.pages, (item) => item.id === page.id);
		if (this.currentPage && this.currentPage.id === page.id) {
			this.currentPage = undefined;
		}
	}

	public removeScene(scene: SolidScenaDataType): void {
		this.sceneMap.delete(scene.id);
		remove(this.scenes, (item) => item.id === scene.id);
	}
}

export default ModelManager;
