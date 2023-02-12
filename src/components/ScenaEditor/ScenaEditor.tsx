import React from "react";
import Guides from "@scena/react-guides";
import Selecto, { Rect } from "react-selecto";
import InfiniteViewer from "react-infinite-viewer";
import ScenaViewport from "./ScenaViewport";
import HistoryManager from "@/utils/HistoryManager";
import Memory from "@/utils/Memory";
import EventBus from "@/utils/EventBus";
import Debugger from "@/utils/Debugger";
import KeyManager from "@/utils/KeyManager";
import MoveableManager from "../../utils/MoveableManager";
import MoveableData from "@/utils/MoveableData";

import { getElementInfo } from "react-moveable";

// context
// import ScenaEditorContext from "./ScenaEditorContext";
import { ScenaEditorContext } from "./ScenaConfig";

import { IObject } from "@daybrush/utils";

import {
	getContentElement,
	getOffsetOriginMatrix,
	getIds,
	checkImageLoaded,
	setMoveMatrix,
	DATA_SCENA_ELEMENT_ID,
} from "./scena_util";

// scena
import { invert, matrix3d } from "@scena/matrix";

// test
// import Menu from "@/__components/ScenaEditor/Menu";
import { prefix } from "@/utils";
import { ScenaEditorState, ElementInfo } from "@/types";
import "./ScenaEditor.less";

export default class ScenaEditor extends React.PureComponent<
	{
		width: number;
		height: number;
		debug?: boolean;
	},
	Partial<ScenaEditorState>
> {
	//// instances
	public historyManager = new HistoryManager(this);
	public console = new Debugger(this.props.debug);
	public eventBus = new EventBus();
	public memory = new Memory();
	public moveableData = new MoveableData(this.memory);
	public keyManager = new KeyManager(this.console);
	public moveableManager = React.createRef<MoveableManager>();

	//// refs
	public viewport = React.createRef<ScenaViewport>();
	public selecto = React.createRef<Selecto>();
	public infiniteViewer = React.createRef<InfiniteViewer>();
	public editorRef = React.createRef<HTMLDivElement>();

	public horizontalGuides = React.createRef<Guides>();
	public verticalGuides = React.createRef<Guides>();

	// public menu = React.createRef<Menu>();

	public state: ScenaEditorState = {
		selectedTargets: [],
		horizontalGuides: [],
		verticalGuides: [],
		zoom: 1,
		selectedMenu: "MoveTool",
	};

	public async componentDidMount() {
		const { infiniteViewer, memory, eventBus } = this;
		memory.set("background-color", "#4af");
		memory.set("color", "#333");

		requestAnimationFrame(() => {
			this.verticalGuides.current!.resize();
			this.horizontalGuides.current!.resize();
			infiniteViewer.current!.scrollCenter();
		});
		window.addEventListener("resize", this.onResize);
		const viewport = this.getViewport();

		eventBus.on("selectLayers", (e: any) => {
			const selected = e.selected as string[];

			this.setSelectedTargets(
				selected.map((key) => viewport.getInfo(key)!.el!)
			);
		});
		eventBus.on("update", () => {
			this.forceUpdate();
		});
		// this.keyManager.keydown(
		//   ["left"],
		//   (e) => {
		//     this.move(-10, 0);
		//     e.inputEvent.preventDefault();
		//   },
		//   "Move Left"
		// );
		// this.keyManager.keydown(
		//   ["up"],
		//   (e) => {
		//     this.move(0, -10);
		//     e.inputEvent.preventDefault();
		//   },
		//   "Move Up"
		// );
		// this.keyManager.keydown(
		//   ["right"],
		//   (e) => {
		//     this.move(10, 0);
		//     e.inputEvent.preventDefault();
		//   },
		//   "Move Right"
		// );
		// this.keyManager.keydown(
		//   ["down"],
		//   (e) => {
		//     this.move(0, 10);
		//     e.inputEvent.preventDefault();
		//   },
		//   "Move Down"
		// );
		// this.keyManager.keyup(
		//   ["backspace"],
		//   () => {
		//     this.removeElements(this.getSelectedTargets());
		//   },
		//   "Delete"
		// );

		// const agent = await getAccurateAgent()!;
		// const isMacintosh = agent.os.name === "mac" || agent.os.name === "ios";
		// this.keyManager.keydown(
		// 	[isMacintosh ? "meta" : "ctrl", "x"],
		// 	() => {},
		// 	"Cut"
		// );
		// this.keyManager.keydown(
		// 	[isMacintosh ? "meta" : "ctrl", "c"],
		// 	() => {},
		// 	"Copy"
		// );
		// this.keyManager.keydown(
		//   [isMacintosh ? "meta" : "ctrl", "shift", "c"],
		//   (e) => {
		//     this.clipboardManager.copyImage();
		//     e.inputEvent.preventDefault();
		//   },
		//   "Copy to Image"
		// );
		// this.keyManager.keydown(
		// 	[isMacintosh ? "meta" : "ctrl", "v"],
		// 	() => {},
		// 	"Paste"
		// );
		// this.keyManager.keydown(
		// 	[isMacintosh ? "meta" : "ctrl", "z"],
		// 	() => {
		// 		this.historyManager.undo();
		// 	},
		// 	"Undo"
		// );
		// this.keyManager.keydown(
		// 	[isMacintosh ? "meta" : "ctrl", "shift", "z"],
		// 	() => {
		// 		this.historyManager.redo();
		// 	},
		// 	"Redo"
		// );
		// this.keyManager.keydown(
		//   [isMacintosh ? "meta" : "ctrl", "a"],
		//   (e) => {
		//     this.setSelectedTargets(
		//       this.getViewportInfos().map((info) => info.el!)
		//     );
		//     e.inputEvent.preventDefault();
		//   },
		//   "Select All"
		// );
		// this.keyManager.keydown(
		//   [isMacintosh ? "meta" : "ctrl", "alt", "g"],
		//   (e) => {
		//     e.inputEvent.preventDefault();
		//     this.moveInside();
		//   },
		//   "Move Inside"
		// );
		// this.keyManager.keydown(
		//   [isMacintosh ? "meta" : "ctrl", "shift", "alt", "g"],
		//   (e) => {
		//     e.inputEvent.preventDefault();
		//     this.moveOutside();
		//   },
		//   "Move Outside"
		// );
		// this.historyManager.registerType(
		//   "createElements",
		//   undoCreateElements,
		//   restoreElements
		// );
		// this.historyManager.registerType(
		//   "removeElements",
		//   restoreElements,
		//   undoCreateElements
		// );
		// this.historyManager.registerType(
		//   "selectTargets",
		//   undoSelectTargets,
		//   redoSelectTargets
		// );
		// this.historyManager.registerType(
		//   "changeText",
		//   undoChangeText,
		//   redoChangeText
		// );
		// this.historyManager.registerType("move", undoMove, redoMove);
	}

	private onResize = () => {
		this.horizontalGuides.current!.resize();
		this.verticalGuides.current!.resize();
	};

	public componentWillUnmount() {
		this.eventBus.off();
		this.memory.clear();
		this.moveableData.clear();
		this.keyManager.destroy();
		window.removeEventListener("resize", this.onResize);
	}

	public renderChildren() {
		const {
			horizontalGuides,
			verticalGuides,
			infiniteViewer,
			selecto,
			moveableManager,
			state,
		} = this;

		const { selectedMenu, selectedTargets, zoom } = state;

		const { width, height } = this.props;

		let unit = 50;
		if (zoom < 0.8) {
			unit = Math.floor(1 / zoom) * 50;
		}

		const horizontalSnapGuides = state.horizontalGuides;
		const verticalSnapGuides = state.verticalGuides;

		return (
			<div className={prefix("scena-", "editor")} ref={this.editorRef}>
				{/* <Menu ref={menu} onSelect={this.onMenuChange} /> */}
				<div
					className={prefix("reset")}
					onClick={(e) => {
						infiniteViewer.current!.scrollCenter();
					}}
				/>
				<Guides
					ref={horizontalGuides}
					type="horizontal"
					className={prefix("guides", "horizontal")}
					style={{}}
					snapThreshold={5}
					snaps={horizontalSnapGuides}
					displayDragPos={true}
					dragPosFormat={(v) => `${v}px`}
					zoom={zoom}
					unit={unit}
					onChangeGuides={(e) => {
						this.setState({
							horizontalGuides: e.guides,
						});
					}}
				/>

				<Guides
					ref={verticalGuides}
					type="vertical"
					className={prefix("guides", "vertical")}
					style={{}}
					snapThreshold={5}
					snaps={verticalSnapGuides}
					displayDragPos={true}
					dragPosFormat={(v) => `${v}px`}
					zoom={zoom}
					unit={unit}
					onChangeGuides={(e) => {
						this.setState({
							verticalGuides: e.guides,
						});
					}}
				/>
				<InfiniteViewer
					ref={infiniteViewer}
					className={prefix("viewer")}
					// style={{
					// 	background: "rgb(13, 14, 14)",
					// }}
					usePinch={true}
					useForceWheel={true}
					pinchThreshold={50}
					zoom={zoom}
					onDragStart={(e) => {
						const target = e.inputEvent.target;
						// this.checkBlur()
						// if (
						//   target.nodeName === "A"
						//   || moveableManager.current!.getMoveable().isMoveableElement(target)
						//   || moveableManager.current!.getMoveable().isDragging()
						//   || selectedTargets.some(t => t === target || t.contains(target))
						// ) {
						//   e.stop()
						// }
					}}
					onDragEnd={(e) => {
						if (!e.isDrag) {
							// selecto.current!.clickTarget(e.inputEvent)
						}
					}}
					onAbortPinch={(e) => {
						// selecto.current!.triggerDragStart(e.inputEvent)
					}}
					onScroll={(e) => {
						horizontalGuides.current!.scroll(e.scrollLeft);
						horizontalGuides.current!.scrollGuides(e.scrollTop);
						verticalGuides.current!.scroll(e.scrollTop);
						verticalGuides.current!.scrollGuides(e.scrollLeft);
					}}
					onPinch={(e) => {
						// if (moveableManager.current!.getMoveable().isDragging()) {
						//   return
						// }
						// this.setState({
						//   zoom: e.zoom,
						// })
					}}
				>
					<ScenaViewport
						ref={this.viewport}
						onBlur={() => {}}
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
						></MoveableManager>
					</ScenaViewport>
				</InfiniteViewer>
				<Selecto
					ref={selecto}
					getElementRect={getElementInfo}
					dragContainer={".scena-viewer"}
					hitRate={0}
					selectableTargets={[`.scena-viewport [${DATA_SCENA_ELEMENT_ID}]`]}
					selectByClick={true}
					selectFromInside={false}
					toggleContinueSelect={["shift"]}
					preventDefault={true}
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
						const inputEvent = e.inputEvent;
						const target = inputEvent.target;

						this.checkBlur();
						if (selectedMenu === "Text" && target.isContentEditable) {
							const contentElement = getContentElement(target);

							if (
								contentElement &&
								contentElement.hasAttribute(DATA_SCENA_ELEMENT_ID)
							) {
								e.stop();
								this.setSelectedTargets([contentElement]);
							}
						}
						if (
							(inputEvent.type === "touchstart" && e.isTrusted) ||
							moveableManager
								.current!.getMoveable()
								.isMoveableElement(target) ||
							state.selectedTargets.some(
								(t) => t === target || t.contains(target)
							)
						) {
							e.stop();
						}
					}}
					onScroll={({ direction }) => {
						infiniteViewer.current!.scrollBy(
							direction[0] * 10,
							direction[1] * 10
						);
					}}
					onSelectEnd={({ isDragStart, selected, inputEvent, rect }) => {
						if (isDragStart) {
							inputEvent.preventDefault();
						}
						if (this.selectEndMaker(rect)) {
							return;
						}
						this.setSelectedTargets(selected).then(() => {
							if (!isDragStart) {
								return;
							}
							moveableManager.current!.getMoveable().dragStart(inputEvent);
						});
					}}
				></Selecto>
			</div>
		);
	}

	render() {
		return (
			<ScenaEditorContext.Provider value={this}>
				{this.renderChildren()}
			</ScenaEditorContext.Provider>
		);
	}

	private checkBlur() {
		const activeElement = document.activeElement;
		if (activeElement) {
			(activeElement as HTMLElement).blur();
		}
		const selection = document.getSelection()!;

		if (selection) {
			selection.removeAllRanges();
		}
		this.eventBus.trigger("blur");
	}

	private onMenuChange = (id: string) => {
		this.setState({
			selectedMenu: id,
		});
	};

	private selectEndMaker(rect: Rect) {
		// const zoom = this.state.zoom;
		// const infiniteViewer = this.infiniteViewer.current!;
		// const selectIcon = this.menu.current!.getSelected();
		// const width = rect.width;
		// const height = rect.height;

		// if (!selectIcon || !selectIcon.maker || !width || !height) {
		//   return false;
		// }
		// const maker = selectIcon.maker(this.memory);
		// const scrollTop = -infiniteViewer.getScrollTop() * zoom + 30;
		// const scrollLeft = -infiniteViewer.getScrollLeft() * zoom + 75;
		// const top = rect.top - scrollTop;
		// const left = rect.left - scrollLeft;

		// const style = {
		//   top: `${top / zoom}px`,
		//   left: `${left / zoom}px`,
		//   position: "absolute",
		//   width: `${width / zoom}px`,
		//   height: `${height / zoom}px`,
		//   ...maker.style,
		// } as any;
		// this.appendJSX({
		//   jsx: maker.tag,
		//   attrs: maker.attrs,
		//   name: `(${selectIcon.id})`,
		//   frame: style,
		// }).then(selectIcon.makeThen);
		// return true;
		return true;
	}

	public getViewport = () => {
		return this.viewport.current!;
	};

	public appendJSX(info: ElementInfo) {
		return this.appendJSXs([info]).then((targets) => targets[0]);
	}

	public appendJSXs(
		jsxs: ElementInfo[],
		isRestore?: boolean
	): Promise<Array<HTMLElement | SVGElement>> {
		const viewport = this.getViewport();
		const indexesList = viewport.getSortedIndexesList(
			this.getSelectedTargets()
		);
		const indexesListLength = indexesList.length;
		let appendIndex = -1;
		let scopeId: string = "";

		if (!isRestore && indexesListLength) {
			const indexes = indexesList[indexesListLength - 1];

			const info = viewport.getInfoByIndexes(indexes);

			scopeId = info.scopeId!;
			appendIndex = indexes[indexes.length - 1] + 1;
		}

		this.console.log("append jsxs", jsxs, appendIndex, scopeId);

		return this.getViewport()
			.appendJSXs(jsxs, appendIndex, scopeId)
			.then(({ added }) => {
				return this.appendComplete(added, isRestore);
			});
	}

	public getSelectedTargets = () => {
		return this.state.selectedTargets;
	};

	private appendComplete(infos: ElementInfo[], isRestore?: boolean) {
		!isRestore &&
			this.historyManager.addAction("createElements", {
				infos,
				prevSelected: getIds(this.getSelectedTargets()),
			});
		const data = this.moveableData;
		const container = this.getViewport().viewportRef.current!;
		const targets = infos
			.map(function registerFrame(info) {
				const frame = data.createFrame(info.el!, info.frame);

				if (info.frameOrder) {
					frame.setOrderObject(info.frameOrder);
				}
				data.render(info.el!);

				info.children!.forEach(registerFrame);
				return info.el!;
			})
			.filter((el) => el);
		infos.forEach((info) => {
			if (!info.moveMatrix) {
				return;
			}
			const frame = data.getFrame(info.el!);
			let nextMatrix = getOffsetOriginMatrix(info.el!, container);

			nextMatrix = invert(nextMatrix, 4);

			const moveMatrix = matrix3d(nextMatrix, info.moveMatrix);

			setMoveMatrix(frame, moveMatrix);
			data.render(info.el!);
		});
		return Promise.all(targets.map((target) => checkImageLoaded(target))).then(
			() => {
				this.setSelectedTargets(targets, true);
				return targets;
			}
		);
	}

	public setSelectedTargets(
		targets: Array<HTMLElement | SVGElement>,
		isRestore?: boolean
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

				if (
					prevs.length !== nexts.length ||
					!prevs.every((prev, i) => nexts[i] === prev)
				) {
					this.historyManager.addAction("selectTargets", { prevs, nexts });
				}
			}
			this.selecto.current!.setSelectedTargets(targets);
			this.moveableData.setSelectedTargets(targets);
			this.eventBus.trigger("setSelectedTargets");
			return targets;
		});
	}

	public promiseState(state: Partial<ScenaEditorState>) {
		return new Promise<void>((resolve) => {
			this.setState(state, () => {
				resolve();
			});
		});
	}

	public getSelecto = () => {
		return this.selecto.current!;
	};

	public removeElements(
		targets: Array<HTMLElement | SVGElement>,
		isRestore?: boolean
	) {
		const viewport = this.getViewport();
		const frameMap = this.removeFrames(targets);
		const indexesList = viewport.getSortedIndexesList(targets);
		const indexesListLength = indexesList.length;
		let scopeId = "";
		let selectedInfo: ElementInfo | null = null;

		if (indexesListLength) {
			const lastInfo = viewport.getInfoByIndexes(
				indexesList[indexesListLength - 1]
			);
			const nextInfo = viewport.getNextInfo(lastInfo.id!);

			scopeId = lastInfo.scopeId!;
			selectedInfo = nextInfo;
		}
		// return;
		return viewport.removeTargets(targets).then(({ removed }) => {
			let selectedTarget =
				selectedInfo ||
				viewport.getLastChildInfo(scopeId)! ||
				viewport.getInfo(scopeId);

			this.setSelectedTargets(
				selectedTarget && selectedTarget.el ? [selectedTarget.el!] : [],
				true
			);

			this.console.log("removeTargets", removed);
			!isRestore &&
				this.historyManager.addAction("removeElements", {
					infos: removed.map(function removeTarget(
						info: ElementInfo
					): ElementInfo {
						return {
							...info,
							children: info.children!.map(removeTarget),
							...(frameMap[info.id!] || {}),
						};
					}),
				});
			return targets;
		});
	}

	public removeFrames(targets: Array<HTMLElement | SVGElement>) {
		const frameMap: IObject<{
			frame: IObject<any>;
			frameOrder: IObject<any>;
		}> = {};
		const moveableData = this.moveableData;
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
}
