import React, { useEffect, useState } from "react";
import { eventbus, mm } from "@/utils";
import { SolidScenaDataType, SolidPageDataType } from "@/types/solid";
import { find, cloneDeep, isNil } from "lodash-es";
import { useUpdate } from "react-use";

interface StatefulSolidSceneDataType extends SolidScenaDataType {
	open?: boolean;
}

interface StatefulSolidPageDataType extends SolidPageDataType {
	selected?: boolean;
}

function useGeneral() {
	const forceUpdate = useUpdate();
	const [loading, setLoading] = useState<boolean>(false);
	const [scenes, setScenes] = useState<StatefulSolidSceneDataType[]>([]);
	const [pages, setPages] = useState<StatefulSolidPageDataType[]>([]);
	const [page, setPage] = useState<SolidPageDataType>();

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

	function createScene() {
		console.log("createScene");
		let newScene = mm.createScene() as StatefulSolidSceneDataType;
		console.log(newScene);
		if (undefined === newScene) {
			return;
		}
		// newScene.open = false;
		// let newPage = mm.createPage(newScene.id);
		let _scenes_ = mm.getScenes() as StatefulSolidSceneDataType[];
		_scenes_.forEach((_scene_) => {
			_scene_.open = false;
		});
		// _scenes_.push(newScene);
		setScenes(_scenes_);
		forceUpdate();
	}

	function createPage(scene: StatefulSolidSceneDataType) {
		let newPage = mm.createPage(scene.id) as StatefulSolidPageDataType;
		if (undefined === newPage) {
			return;
		}
		newPage.selected = false;
		let _pages_ = mm.getPages() as StatefulSolidPageDataType[];
		_pages_.forEach((_page_) => {
			_page_.selected = false;
		});
		// _pages_.push(newPage);
		// setPages(_pages_);
		forceUpdate();
	}

	function toggleScene(scene: StatefulSolidSceneDataType) {
		// let clonedScenes = cloneDeep(scenes);
		// let ts = find(clonedScenes, (s) => s.id === scene.id);
		// if (ts) {
		// 	ts.open = !ts.open;
		// }
		// setScenes(clonedScenes);
		let selectedScene = mm.getScene(scene.id);
		if (selectedScene) {
			selectedScene.selected = !selectedScene.selected;
		}
		forceUpdate();
	}

	function selectPage(page: SolidPageDataType) {
		// let selectedPage = mm.getPage(page.id) as StatefulSolidPageDataType;
		// if (null === selectedPage || undefined === selectedPage) {
		// 	return;
		// }
		// selectedPage.selected = true;
		let pages = mm.getPages();
		pages.forEach((p) => {
			if (p.id === page.id) {
				p.selected = true;
			} else {
				p.selected = false;
			}
		});
		mm.selectPage(page.id);
		eventbus.emit("onSelectPage", { id: page.id, page: page });
		forceUpdate();
	}

	return {
		loading,
		scenes,
		createScene,
		createPage,
		toggleScene,
		selectPage,
	};
}

export default useGeneral;
