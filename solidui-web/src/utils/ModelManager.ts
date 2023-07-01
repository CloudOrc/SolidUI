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

import { isNil, set, unset, forEach, isEmpty, remove, find } from "lodash-es";
import {
	SolidModelDataType,
	SolidScenaDataType,
	SolidPageDataType,
	SolidViewDataType,
} from "@/types/solid";
import { eventbus } from "@/utils";
import { OnSelectViewEventData } from "@/types/eventbus";

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
		const viewId = data.id;
		const view = this.viewMap.get(viewId);
		if (!isNil(view)) {
			this.currentView = view;
		}
	}

	public attach(model: SolidModelDataType): void {
		this.model = model;
		this.__clear();
		this.__config(model);
	}

	private __clear() {
		this.currentPage = undefined;
		this.currentView = undefined;
		this.sceneMap.clear();
		this.pageMap.clear();
		this.viewMap.clear();
		this.scenes = [];
		this.pages = [];
		this.views = [];
	}

	private __config(model: SolidModelDataType) {
		if (isNil(model)) {
			return;
		}
		const scenes = model.scenas;
		if (isNil(scenes)) {
			return;
		}
		for (let m = 0; m < scenes.length; m++) {
			this.sceneMap.set(scenes[m].id, scenes[m]);
			this.scenes.push(scenes[m]);

			if (isNil(scenes[m].pages)) {
				continue;
			}
			const scenePages = scenes[m].pages;
			if (isNil(scenePages)) {
				continue;
			}

			for (let n = 0; n < scenePages.length; n++) {
				this.pageMap.set(scenePages[n].id, scenePages[n]);
				this.pages.push(scenePages[n]);

				if (isNil(scenePages[n].views)) {
					continue;
				}

				for (let x = 0; x < scenePages[n].views.length; x++) {
					this.viewMap.set(scenePages[n].views[x].id, scenePages[n].views[x]);
					this.views.push(scenePages[n].views[x]);
				}
			}
		}
	}

	public addScene(scene: SolidScenaDataType) {
		if (isNil(this.model)) {
			return;
		}
		this.sceneMap.set(scene.id, scene);
		this.scenes.push(scene);
		if (this.model.scenas) {
			this.model.scenas.push(scene);
		} else {
			set(this.model, "scenas", [scene]);
		}
	}

	public addPage(page: SolidPageDataType): void {
		if (isNil(this.model)) {
			return;
		}
		const scene = this.getScene(page.parentId);
		if (isNil(scene)) {
			return;
		}
		const scenePages = scene.pages;
		if (isNil(scenePages)) {
			return;
		}

		scenePages.push(page);
		this.pageMap.set(page.id, page);
		this.pages.push(page);
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
			this.currentPage?.views.push(item);
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
			this.currentPage?.views.push(item);
			this.viewMap.set(`${item.id}`, item);
			this.views.push(item);
		});
	}

	public removeView(id: string): void {
		if (isNil(this.currentPage)) {
			return;
		}
		const index = this.currentPage.views.findIndex((item) => item.id === id);
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
		const thisPage = find(this.pages, (item) => item.id === page.id);
		if (!thisPage) {
			return;
		}
		const scene = find(this.scenes, (item) => item.id === thisPage.parentId);
		if (scene && scene.pages) {
			remove(scene.pages, (item) => item.id === page.id);
		}
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
