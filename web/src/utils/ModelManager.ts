import {
	SolidModelDataType,
	SolidScenaDataType,
	SolidPageDataType,
	SolidViewDataType,
} from "@/types/solid";
import { isNil } from "lodash-es";

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
		console.log(this.currentPage);
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
}

export default ModelManager;
