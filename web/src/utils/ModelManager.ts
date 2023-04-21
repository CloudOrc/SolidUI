import {
	SolidModelDataType,
	SolidScenaDataType,
	SolidPageDataType,
	SolidViewDataType,
} from "@/types/solid";
import { isNil, set, unset, forEach, isEmpty } from "lodash-es";

class ModelManager {
	private model?: SolidModelDataType;
	private currentPage?: SolidPageDataType;
	private sceneMap: Map<string, SolidScenaDataType> = new Map();
	private pageMap: Map<string, SolidPageDataType> = new Map();
	private viewMap: Map<string, SolidViewDataType> = new Map();
	private scenes: SolidScenaDataType[] = [];
	private pages: SolidPageDataType[] = [];
	private views: SolidViewDataType[] = [];

	constructor() {}

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
			title: "Page_" + _id,
			views: [],
		};
		scene.pages!.push(page);
		this.pageMap.set(page.id, page);
		this.pages.push(page);
		return page;
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

	public getView(id: string): SolidViewDataType | undefined {
		return this.viewMap.get(id);
	}

	public selectPage(id: string): void {
		this.currentPage = this.getPage(id);
		// console.log(this.currentPage);
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

	public removeView(id: string): void {
		if (isNil(this.currentPage)) {
			return;
		}
		let index = this.currentPage.views.findIndex((item) => item.id === id);
		console.log(index, this.currentPage.views, id);
		if (index > -1) {
			this.currentPage.views.splice(index, 1);
		}
		console.log(this.currentPage);
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
}

export default ModelManager;
