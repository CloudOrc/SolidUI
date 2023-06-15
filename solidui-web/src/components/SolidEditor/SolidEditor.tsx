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

import React from "react";
import InfiniteViewer from "react-infinite-viewer";
import Guides from "@scena/react-guides";
import Selecto from "react-selecto";
// import mitt from "mitt";

import SolidViewport from "./SolidViewport";
import SolidEditorManager from "./utils/SolidEditorManager";
import MoveableManager from "./utils/MoveableManager";
import MoveableData from "./utils/MoveableData";
import Debugger from "./utils/Debugger";
import Memory from "./utils/Memory";
import { SOLIDUI_ELEMENT_ID } from "./utils/const";
import {
	prefix,
	getIds,
	checkImageLoaded,
	getOffsetOriginMatrix,
	setMoveMatrix,
} from "./utils";

import { SolidEditorContext } from "./SolidEditorContext";

import { invert, matrix3d } from "@scena/matrix";
import { IObject } from "@daybrush/utils";
import { AddedInfo, ElementInfo, RemovedInfo } from "./utils/types";
// import { EventBusType } from "@/types";

// import "@/assets/styles/solideditor.less";
import { eventbus } from "@/utils";
import "./style/index.less";

export interface SolidEditorState {
	selectedTargets: Array<SVGElement | HTMLElement>;
	horizontalGuides: number[];
	verticalGuides: number[];
	selectedMenu: string;
	zoom: number;
}

export interface SolidEditorProps {
	id?: string;
	width: number;
	height: number;
	zoom?: number;
	debug?: boolean;
}

export interface SomeEventData {
	name: string;
}

export default class SolidEditor extends React.PureComponent<
	SolidEditorProps,
	Partial<SolidEditorState>
> {
	public state: SolidEditorState = {
		selectedTargets: [],
		horizontalGuides: [],
		verticalGuides: [],
		zoom: 1,
		// zoom: this.props.zoom ? this.props.zoom : 1,
		selectedMenu: "MoveTool",
	};

	public memory = new Memory();
	public console = new Debugger();
	public moveableData = new MoveableData(this.memory);
	public manager = new SolidEditorManager(this);

	public editorRef = React.createRef<HTMLDivElement>();
	public horizontalGuides = React.createRef<Guides>();
	public verticalGuides = React.createRef<Guides>();
	public infiniteViewer = React.createRef<InfiniteViewer>();
	public viewport = React.createRef<SolidViewport>();
	public selecto = React.createRef<Selecto>();
	public moveableManager = React.createRef<MoveableManager>();
	// public eventbus = mitt<EventBusType>();

	public getViewport = () => {
		return this.viewport.current!;
	};

	public getEditorManager = () => {
		return this.manager;
	};

	public getSelecto = () => {
		return this.selecto.current!;
	};

	public getInfiniteViewer = () => {
		return this.infiniteViewer.current!;
	};

	public setZoom = (zoom: number) => {
		this.setState({
			zoom,
		});
	};

	public getZoom = (): number => {
		return this.state.zoom;
	};

	public selectTarget(id: string) {
		let target = this.getViewport().getElement(id);
		if (target) {
			this.setSelectedTargets([target]);
		}
		// this.getViewport().selectTarget(id);
	}

	public appendJSXsOnly(
		jsxs: ElementInfo[],
		isRestore?: boolean,
	): Promise<AddedInfo> {
		const viewport = this.getViewport();
		const indexesList = viewport.getSortedIndexesList(
			this.getSelectedTargets(),
		);
		const indexesListLength = indexesList.length;
		let appendIndex = -1;
		let scopeId = "";

		if (!isRestore && indexesListLength) {
			const indexes = indexesList[indexesListLength - 1];

			const info = viewport.getInfoByIndexes(indexes);

			scopeId = info.scopeId!;
			appendIndex = indexes[indexes.length - 1] + 1;
		}

		return this.getViewport().appendJSXs(jsxs, appendIndex, scopeId);
	}

	public appendJSX(info: ElementInfo) {
		return this.appendJSXs([info]).then((targets) => targets[0]);
	}

	public appendJSXs(
		jsxs: ElementInfo[],
		isRestore?: boolean,
	): Promise<Array<HTMLElement | SVGElement>> {
		const viewport = this.getViewport();
		const indexesList = viewport.getSortedIndexesList(
			this.getSelectedTargets(),
		);
		const indexesListLength = indexesList.length;
		let appendIndex = -1;
		let scopeId = "";

		if (!isRestore && indexesListLength) {
			const indexes = indexesList[indexesListLength - 1];

			const info = viewport.getInfoByIndexes(indexes);

			scopeId = info.scopeId!;
			appendIndex = indexes[indexes.length - 1] + 1;
		}

		return this.getViewport()
			.appendJSXs(jsxs, appendIndex, scopeId)
			.then(({ added }) => {
				return this.appendComplete(added, isRestore);
			});
	}

	public removeAll() {
		let infos = this.getViewport().getViewportInfos();
		let ids: string[] = [];
		infos.forEach((info) => {
			info.id && ids.push(info.id);
		});
		let elems = this.getViewport().getElements(ids);
		this.removeElements(this.getViewport().getElements(ids));
	}

	public clear(): Promise<RemovedInfo> {
		let root = this.getViewport().getInfo("viewport");
		let targets: Array<HTMLElement | SVGElement> = [];
		if (root !== null && undefined !== root && root.children) {
			root.children.forEach((child) => {
				if (child.el) {
					targets.push(child.el);
				}
			});
		}
		return this.getViewport()
			.removeTargets(targets)
			.then((removed) => {
				return new Promise((resolve) => {
					this.setState(
						{
							selectedTargets: [],
						},
						() => {
							resolve(removed);
						},
					);
				});
			});
	}

	public removeByIds(ids: string[], isRestore?: boolean) {
		return this.removeElements(this.getViewport().getElements(ids), isRestore);
	}

	private appendComplete(infos: ElementInfo[], isRestore?: boolean) {
		// return Promise.resolve([]);
		// !isRestore &&
		// 	this.historyManager.addAction("createElements", {
		// 		infos,
		// 		prevSelected: getIds(this.getSelectedTargets()),
		// 	});
		const targets1 = infos.map((info) => {
			return info.el!;
		});
		this.setSelectedTargets(targets1, true);
		return targets1;
		// const data = this.moveableData;
		// const container = this.getViewport().viewportRef.current!;
		// const targets = infos
		// 	.map(function registerFrame(info) {
		// 		const frame = data.createFrame(info.el!, info.frame);

		// 		if (info.frameOrder) {
		// 			frame.setOrderObject(info.frameOrder);
		// 		}
		// 		data.render(info.el!);

		// 		info.children!.forEach(registerFrame);
		// 		return info.el!;
		// 	})
		// 	.filter((el) => el);
		// infos.forEach((info) => {
		// 	if (!info.moveMatrix) {
		// 		return;
		// 	}
		// 	const frame = data.getFrame(info.el!);
		// 	let nextMatrix = getOffsetOriginMatrix(info.el!, container);

		// 	nextMatrix = invert(nextMatrix, 4);

		// 	const moveMatrix = matrix3d(nextMatrix, info.moveMatrix);

		// 	setMoveMatrix(frame, moveMatrix);
		// 	data.render(info.el!);
		// });
		// return Promise.all(targets.map((target) => checkImageLoaded(target))).then(
		// 	() => {
		// 		this.setSelectedTargets(targets, true);
		// 		return targets;
		// 	}
		// );
	}

	public promiseState(state: Partial<SolidEditorState>) {
		return new Promise<void>((resolve) => {
			this.setState(state, () => {
				resolve();
			});
		});
	}

	public setSelectedTargets(
		targets: Array<HTMLElement | SVGElement>,
		isRestore?: boolean,
	) {
		targets = targets.filter((target) => {
			return targets.every((parnetTarget) => {
				return parnetTarget === target || !parnetTarget.contains(target);
			});
		});

		return this.promiseState({
			selectedTargets: targets,
		}).then(() => {
			if (!isRestore) {
				const prevs = getIds(this.moveableData.getSelectedTargets());
				const nexts = getIds(targets);

				// if (
				//   prevs.length !== nexts.length ||
				//   !prevs.every((prev, i) => nexts[i] === prev)
				// ) {
				//   this.historyManager.addAction("selectTargets", { prevs, nexts });
				// }
			}
			this.selecto.current!.setSelectedTargets(targets);
			this.moveableData.setSelectedTargets(targets);
			// this.eventBus.trigger("setSelectedTargets");
			return targets;
		});
	}

	public getSelectedTargets = () => {
		return this.state.selectedTargets;
	};

	private checkBlur() {
		const { activeElement } = document;
		if (activeElement) {
			(activeElement as HTMLElement).blur();
		}
		const selection = document.getSelection()!;

		if (selection) {
			selection.removeAllRanges();
		}
		// this.eventBus.trigger("blur");
	}

	public removeElements(
		targets: Array<HTMLElement | SVGElement>,
		isRestore?: boolean,
	) {
		const viewport = this.getViewport();
		// const frameMap = this.removeFrames(targets);
		const indexesList = viewport.getSortedIndexesList(targets);
		const indexesListLength = indexesList.length;
		let scopeId = "";
		let selectedInfo: ElementInfo | null = null;

		if (indexesListLength) {
			const lastInfo = viewport.getInfoByIndexes(
				indexesList[indexesListLength - 1],
			);
			const nextInfo = viewport.getNextInfo(lastInfo.id!);

			scopeId = lastInfo.scopeId!;
			selectedInfo = nextInfo;
		}
		return viewport.removeTargets(targets).then(({ removed }) => {
			// let selectedTarget =
			// 	selectedInfo ||
			// 	viewport.getLastChildInfo(scopeId)! ||
			// 	viewport.getInfo(scopeId);

			// this.setSelectedTargets(
			// 	selectedTarget && selectedTarget.el ? [selectedTarget.el!] : [],
			// 	true
			// );

			this.setSelectedTargets([]);

			// !isRestore &&
			//   this.historyManager.addAction("removeElements", {
			//     infos: removed.map(function removeTarget(
			//       info: ElementInfo
			//     ): ElementInfo {
			//       return {
			//         ...info,
			//         children: info.children!.map(removeTarget),
			//         ...(frameMap[info.id!] || {}),
			//       };
			//     }),
			//   });
			return targets;
		});
	}

	public removeFrames(targets: Array<HTMLElement | SVGElement>) {
		const frameMap: IObject<{
			frame: IObject<any>;
			frameOrder: IObject<any>;
		}> = {};
		const { moveableData } = this;
		const viewport = this.getViewport();

		targets.forEach(function removeFrame(target) {
			const info = viewport.getInfoByElement(target)!;
			const frame = moveableData.getFrame(target);
			frameMap[info.id!] = {
				frame: frame.get(),
				frameOrder: frame.getOrderObject(),
			};
			moveableData.removeFrame(target);

			info.children!.forEach((childInfo) => {
				removeFrame(childInfo.el!);
			});
		});

		return frameMap;
	}

	public render() {
		return (
			<SolidEditorContext.Provider value={this}>
				{this.__render()}
			</SolidEditorContext.Provider>
		);
	}

	private __render() {
		const {
			horizontalGuides,
			verticalGuides,
			infiniteViewer,
			selecto,
			moveableManager,
			state,
		} = this;

		const { selectedMenu, selectedTargets, zoom } = state;
		// console.log("this state zoom = ", zoom);

		const { width, height } = this.props;

		let unit = 50;
		if (zoom < 0.8) {
			unit = Math.floor(1 / zoom) * 50;
		}

		const horizontalSnapGuides = state.horizontalGuides;
		const verticalSnapGuides = state.verticalGuides;

		return (
			<div id={this.props.id} className={prefix("editor")} ref={this.editorRef}>
				<div
					className={"editor-guides-reset"}
					onClick={(e) => {
						infiniteViewer.current!.scrollCenter();
					}}
				/>
				<div className={"editor-zoom-btn"} />
				<Guides
					ref={horizontalGuides}
					type="horizontal"
					className={"editor-guides guides-horizontal"}
					snapThreshold={5}
					snaps={horizontalSnapGuides}
					displayDragPos
					dragPosFormat={(v) => `${v}px`}
					zoom={zoom}
					unit={unit}
					onChangeGuides={(e) => {
						this.setState({
							horizontalGuides: e.guides,
						});
					}}
					// lineColor="#EAECEE"
					// backgroundColor="#6B6B6C"
					// textColor="#EAECEE"
					lineColor="#D1D1D1"
					backgroundColor="#F6F6F6"
					textColor="#D1D1D1"
				/>

				<Guides
					ref={verticalGuides}
					type="vertical"
					className={"editor-guides guides-vertical"}
					snapThreshold={5}
					snaps={verticalSnapGuides}
					displayDragPos
					dragPosFormat={(v) => `${v}px`}
					zoom={zoom}
					unit={unit}
					onChangeGuides={(e) => {
						this.setState({
							verticalGuides: e.guides,
						});
					}}
					// lineColor="#EAECEE"
					lineColor="#D1D1D1"
					// backgroundColor="#FFFFFF"
					// backgroundColor="#E6E5E6"
					backgroundColor="#F6F6F6"
					textColor="#D1D1D1"
				/>

				<InfiniteViewer
					ref={infiniteViewer}
					className="editor-viewer"
					zoom={zoom}
					useWheelScroll
					useForceWheel
					pinchThreshold={50}
					onScroll={(e) => {
						horizontalGuides.current!.scroll(e.scrollLeft);
						horizontalGuides.current!.scrollGuides(e.scrollTop);
						verticalGuides.current!.scroll(e.scrollTop);
						verticalGuides.current!.scrollGuides(e.scrollLeft);
					}}
					onDragStart={(e) => {
						console.log(e);
					}}
					onDrag={(e) => {
						console.log(e);
					}}
					usePinch
					onPinch={(e) => {
						eventbus.emit("onZoom", { zoom: e.zoom });
						this.setState({
							zoom: e.zoom,
						});
					}}
					onPinchStart={(e) => {
						console.log(e);
					}}
				>
					<SolidViewport
						ref={this.viewport}
						onBlur={() => {
							console.log("onBlur");
						}}
						style={{
							width: `${width}px`,
							height: `${height}px`,
							background: "rgb(25, 26, 29)",
							boxShadow: "rgb(0 0 0 / 10%) 0px 2px 6px",
						}}
					>
						<MoveableManager
							ref={moveableManager}
							selectedTargets={selectedTargets}
							selectedMenu={selectedMenu}
							verticalGuidelines={verticalSnapGuides}
							horizontalGuidelines={horizontalSnapGuides}
							zoom={zoom}
						/>
					</SolidViewport>
				</InfiniteViewer>
				<Selecto
					ref={selecto}
					dragContainer={".editor-viewport"}
					selectableTargets={[`.editor-viewport [${SOLIDUI_ELEMENT_ID}]`]}
					hitRate={0}
					ratio={0}
					selectByClick
					selectFromInside={false}
					continueSelectWithoutDeselect
					toggleContinueSelectWithoutDeselect={["x"]}
					continueSelect={false}
					toggleContinueSelect={["shift"]}
					scrollOptions={
						infiniteViewer.current
							? {
									container: infiniteViewer.current.getContainer(),
									threshold: 30,
									throttleTime: 30,
									getScrollPosition: () => {
										const current = infiniteViewer.current!;
										return [current.getScrollLeft(), current.getScrollTop()];
									},
							  }
							: undefined
					}
					onDragStart={(e) => {
						// this.checkBlur();
						// e.stop();
						// if (e.inputEvent.target.nodeName === "BUTTON") {
						// 	return false;
						// }
						// return true;
					}}
					// onSelect={(e) => {
					// 	e.added.forEach((el) => {
					// 		el.classList.add("selected");
					// 	});
					// 	e.removed.forEach((el) => {
					// 		el.classList.remove("selected");
					// 	});
					// }}
					onDrag={(e) => {
						// e.stop();
					}}
					onDragEnd={(e) => {
						// e.stop();
					}}
					onSelect={(e) => {}}
					onSelectStart={(e) => {}}
					onSelectEnd={(e) => {
						let selected = e.selected || [];
						let { isDragStart } = e;
						let { inputEvent } = e;
						if (isDragStart) {
							inputEvent.preventDefault();
						}
						this.setSelectedTargets(selected).then(() => {
							if (!isDragStart) {
								return;
							}
							moveableManager.current!.getMoveable().dragStart(e.inputEvent);
						});
					}}
					// onDrag={e => {}}
					onScroll={(e) => {
						// viewerRef.current?.scrollBy(
						// 	e.direction[0] * 10,
						// 	e.direction[1] * 10
						// );
					}}
				/>
			</div>
		);
	}

	// static getDerivedStateFromProps(
	// 	nextProps: SolidEditorProps,
	// 	prevState: SolidEditorState
	// ) {

	// 	if (nextProps.zoom) {
	// 		console.log(nextProps, prevState);
	// 		if (nextProps.zoom !== prevState.zoom) {
	// 			return {
	// 				...prevState,
	// 				zoom: nextProps.zoom,
	// 			};
	// 		}
	// 	}
	// 	return null;
	// }
}
