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
import { message } from "antd";
import { IObject } from "@daybrush/utils";
import { isNil } from "lodash-es";
import SolidViewFactory from "@/views/SolidViewFactory";
import {
	OnDrawEventData,
	OnSelectPageEventData,
	OnSelectViewEventData,
} from "@/types/eventbus";
import { eventbus, mm } from "@/utils";
import SolidViewport from "./SolidViewport";
import MoveableManager from "./utils/MoveableManager";
import MoveableData from "./utils/MoveableData";
import Memory from "./utils/Memory";
import { SOLIDUI_ELEMENT_ID } from "./utils/const";
import { prefix } from "./utils";

import { SolidEditorContext } from "./SolidEditorContext";
import { AddedInfo, ElementInfo, RemovedInfo } from "./utils/types";
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
}

export default class SolidEditor extends React.PureComponent<
	SolidEditorProps,
	SolidEditorState
> {
	constructor(props: SolidEditorProps) {
		super(props);
		this.clear = this.clear.bind(this);

		this.state = {
			selectedTargets: [],
			horizontalGuides: [],
			verticalGuides: [],
			// zoom: 1,
			zoom: this.props.zoom ? this.props.zoom : 1,
			selectedMenu: "MoveTool",
		};
	}

	public memory = new Memory();

	public moveableData = new MoveableData(this.memory);

	public factory = new SolidViewFactory();

	public editorRef = React.createRef<HTMLDivElement>();

	public horizontalGuides = React.createRef<Guides>();

	public verticalGuides = React.createRef<Guides>();

	public infiniteViewer = React.createRef<InfiniteViewer>();

	public viewport = React.createRef<SolidViewport>();

	public selecto = React.createRef<Selecto>();

	public moveableManager = React.createRef<MoveableManager>();

	componentDidMount(): void {
		eventbus.on("onSelectPage", this.handleSelectPage);
		eventbus.on("onDraw", this.handleOnDraw);
		eventbus.on("onSelectViewInViewList", this.handleSelectViewinViewList);
	}

	componentWillUnmount(): void {
		eventbus.off("onSelectPage", this.handleSelectPage);
		eventbus.off("onDraw", this.handleOnDraw);
		eventbus.off("onSelectViewInViewList", this.handleSelectViewinViewList);
	}

	public handleSelectViewinViewList = (event: OnSelectViewEventData) => {
		const view = mm.getView(event.id);
		if (view) {
			this.selectTarget(view.id);
		}
	};

	public handleOnDraw = (event: OnDrawEventData) => {
		if (!mm.getCurrentPage()) {
			message.warn("please select one page before draw view");
			return;
		}
		const { viewType, options } = event;
		const builder = this.factory.getBuilder(viewType);
		if (builder === undefined) {
			return;
		}
		const SolidViewComponent = builder.getComponentType();
		const vm = builder.createModel(options);
		const _style: React.CSSProperties = {
			...vm.style,
			width: `${vm.size.width}px`,
			height: `${vm.size.height}px`,
		};

		this.appendJSX({
			id: vm.id,
			jsx: <SolidViewComponent viewModel={vm} style={_style} />,
			name: builder.getTitle(),
		}).then(() => {
			mm.addView(vm);
			eventbus.emit("onDrawComplete", { id: vm.id });
		});
	};

	public handleSelectPage = (event: OnSelectPageEventData) => {
		const pageId = event.id;
		const page = mm.getPage(pageId);
		this.clear().then(() => {
			const views = page?.views || [];
			views.forEach((view) => {
				const builder = this.factory.getBuilder(view.type);
				if (builder === undefined) {
					return;
				}
				const SolidViewComponent = builder.getComponentType();
				const { style, ...vm } = view;
				const _style: React.CSSProperties = {
					...style,
					width: `${vm.size.width}px`,
					height: `${vm.size.height}px`,
					// top: `${vm.position.top}px`,
					// left: `${vm.position.left}px`,
					position: "absolute",
					transform: `translate(${vm.position.top}px, ${vm.position.left}px)`,
				};
				if (!vm.data.dataSourceId || !vm.data.sql) {
					const localVM = builder.createModel();
					vm.data = localVM.data;
				}
				this.appendJSXsOnly([
					{
						id: view.id,
						// jsx: (
						// 	<div style={_style}>
						// 		<SolidViewComponent viewModel={vm} />
						// 	</div>
						// ),
						jsx: <SolidViewComponent viewModel={vm} style={_style} />,
						name: builder.getTitle(),
					},
				]);

				// this.editor.appendJSX({
				// 	id: view.id,
				// 	jsx: <SolidViewComponent viewModel={vm} style={_style} />,
				// 	// frame: vm.frame,
				// 	name: builder.getTitle(),
				// });
			});
		});
	};

	public getViewport = () => this.viewport.current!;

	public getSelecto = () => this.selecto.current!;

	public getInfiniteViewer = () => this.infiniteViewer.current!;

	public setZoom = (zoom: number) => {
		this.setState({
			zoom,
		});
	};

	public selectTarget(id: string) {
		const target = this.getViewport().getElement(id);
		if (target) {
			this.setSelectedTargets([target]);
		}
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
			this.getSelectedTargets() || [],
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
			.then(({ added }) => this.appendComplete(added));
	}

	public removeAll() {
		const infos = this.getViewport().getViewportInfos();
		const ids: string[] = [];
		if (infos) {
			infos.forEach((info) => {
				if (info.id) {
					ids.push(info.id);
				}
			});
		}
		this.getViewport().getElements(ids);
		this.removeElements(this.getViewport().getElements(ids));
	}

	public clear(): Promise<RemovedInfo> {
		const root = this.getViewport().getInfo("viewport");
		const targets: Array<HTMLElement | SVGElement> = [];
		if (root !== null && undefined !== root && root.children) {
			root.children.forEach((child) => {
				if (child.el) {
					targets.push(child.el);
				}
			});
		}
		return this.getViewport()
			.removeTargets(targets)
			.then(
				(removed) =>
					new Promise((resolve) => {
						this.setState(
							{
								selectedTargets: [],
							},
							() => {
								resolve(removed);
							},
						);
					}),
			);
	}

	public removeByIds(ids: string[]) {
		return this.removeElements(this.getViewport().getElements(ids));
	}

	private appendComplete(infos: ElementInfo[]) {
		const targets1 = infos.map((info) => info.el!);
		this.setSelectedTargets(targets1);
		return targets1;
	}

	public promiseState(state: SolidEditorState) {
		return new Promise<void>((resolve) => {
			this.setState(state, () => {
				resolve();
			});
		});
	}

	public setSelectedTargets(targets: Array<HTMLElement | SVGElement>) {
		targets = targets.filter((target) =>
			targets.every(
				(parnetTarget) =>
					parnetTarget === target || !parnetTarget.contains(target),
			),
		);

		return this.promiseState({
			...this.state,
			selectedTargets: targets,
		}).then(() => {
			this.selecto.current!.setSelectedTargets(targets);
			this.moveableData.setSelectedTargets(targets);
			if (targets.length === 0) {
				eventbus.emit("onSelectPageInViewport", {
					id: isNil(mm.getCurrentPage()) ? "" : mm.getCurrentPage()?.id || "",
					page: mm.getCurrentPage(),
				});
			}
			return targets;
		});
	}

	public getSelectedTargets = () => this.state.selectedTargets;

	public removeElements(targets: Array<HTMLElement | SVGElement>) {
		const viewport = this.getViewport();
		return viewport.removeTargets(targets).then(() => {
			this.setSelectedTargets([]);
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

		const { width, height } = this.props;

		let unit = 50;
		if (zoom < 0.8) {
			unit = Math.floor(1 / zoom) * 50;
		}

		const horizontalSnapGuides = state.horizontalGuides;
		const verticalSnapGuides = state.verticalGuides;

		return (
			<>
				<div
					id={this.props.id}
					className={prefix("editor")}
					ref={this.editorRef}
				>
					<div
						className="editor-guides-reset"
						onClick={() => {
							infiniteViewer.current!.scrollCenter();
						}}
					/>
					<div className="editor-zoom-btn" />
					<Guides
						ref={horizontalGuides}
						type="horizontal"
						className="editor-guides guides-horizontal"
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
						className="editor-guides guides-vertical"
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
						// onDragStart={(e) => {}}
						// onDrag={(e) => {}}
						usePinch
						onPinch={(e) => {
							eventbus.emit("onZoom", { zoom: e.zoom });
							this.setState({
								zoom: e.zoom,
							});
						}}
						// onPinchStart={(e) => {}}
					>
						<SolidViewport
							ref={this.viewport}
							// onRef={(ref) => (this.viewport = ref)}
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
							/>
						</SolidViewport>
					</InfiniteViewer>
				</div>
				<Selecto
					ref={selecto}
					dragContainer=".editor-viewport"
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
					onSelectEnd={(e) => {
						const selected = e.selected || [];
						const { isDragStart } = e;
						const { inputEvent } = e;
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
				/>
			</>
		);
	}
}
