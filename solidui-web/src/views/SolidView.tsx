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
import { Emitter } from "mitt";
import { set, cloneDeep } from "lodash-es";
import {
	EventBusType,
	OnReiszeGroupEventData,
	OnUpdateViewPropertyValueEventData,
	onDataSetChangeEventData,
} from "@/types/eventbus";

import { SolidViewDataType } from "@/types/solid";
import Apis from "@/apis";
import { ApiResult } from "@/types";

export interface SolidViewProps {
	id: string;
	className?: string;
	style?: React.CSSProperties;
	viewModel: SolidViewDataType;
	"solidui-element-id"?: string;
	eventbus: Emitter<EventBusType>;
	scenaAttrs?: any;
}

export interface SolidViewState {
	viewModel: SolidViewDataType;
}

export default abstract class SolidView<
	T extends SolidViewProps,
	S extends SolidViewState = SolidViewState,
> extends React.Component<T, S> {
	dataSheet: any[] = [];

	private viewRef = React.createRef<HTMLDivElement>();

	private vm: SolidViewDataType;

	private id: string;

	private eventbus: Emitter<EventBusType>;

	protected constructor(props: T) {
		super(props);

		this.id = props["solidui-element-id"] as string;
		this.eventbus = props.eventbus;
		this.vm = this.props.viewModel || {};

		this.renderView = this.renderView.bind(this);
		this.baseViewDidMount = this.baseViewDidMount.bind(this);
		this.baseViewWillUnmount = this.baseViewWillUnmount.bind(this);

		this.fetchDataAndReRender = this.fetchDataAndReRender.bind(this);
		this.fetchData = this.fetchData.bind(this);
	}

	protected abstract baseViewDidMount(): void;

	protected abstract baseViewWillUnmount(): void;

	protected abstract reRender(): void;

	protected abstract resize(): void;

	protected abstract renderView(): React.ReactNode;

	protected renderTitle(): React.ReactNode {
		const viewModel = this.vm;
		const options = viewModel.options || {};
		const title = options.title || {};
		const style = title.style || {};
		const { show } = title;
		if (show) {
			return (
				<div className="solid-view-title" style={style}>
					{title.text}
				</div>
			);
		}
		return null;
	}

	protected getVM(): SolidViewDataType {
		return this.vm;
	}

	private readonly fetchData = async () => {
		const viewModel = this.vm;
		const data = viewModel.data || {};
		const dsId = data.dataSourceId;
		const { sql } = data;
		if (!dsId || !sql) {
			this.dataSheet = viewModel.data.dataset || [];
			return;
		}

		const res: ApiResult<any[][]> = await Apis.datasource.querySql({
			dataSourceName: data.dataSourceName,
			typeName: data.dataSourceTypeName,
			sql,
		});
		if (res.ok) {
			this.dataSheet = res.data || [];
		}
	};

	async componentDidMount() {
		await this.fetchData();

		this.baseViewDidMount();

		this.eventbus.on("onResize", this.handleResize);
		this.eventbus.on("onResizeGroup", this.handleResizeGroup);
		this.eventbus.on(
			"onUpdateViewPropertyValue",
			this.handleUpdateViewPropertyValue,
		);
		this.eventbus.on("onDataSetChange", this.handleDataSetChange);
	}

	protected handleResize = () => {
		this.resize();
	};

	protected handleDataSetChange = (evt: onDataSetChangeEventData) => {
		if (evt.id === this.id) {
			this.dataSheet = evt.data || [];
			this.reRender();
		}
	};

	protected getXs(): Array<{ label: string }> {
		return [
			{
				label: this.dataSheet[0][0],
			},
		];
	}

	protected getYs(): { label: string }[] {
		const ys: { label: string }[] = [];
		for (let i = 1; i < this.dataSheet.length; i++) {
			ys.push({ label: this.dataSheet[0][i] });
		}
		return ys;
	}

	protected getViewRef() {
		return this.viewRef;
	}

	private readonly fetchDataAndReRender = async () => {
		await this.fetchData();
		this.reRender();
	};

	protected handleUpdateViewPropertyValue = (
		evt: OnUpdateViewPropertyValueEventData,
	) => {
		if (this.id === evt.id) {
			const clonedVM = cloneDeep(this.vm);
			set(clonedVM, evt.property, evt.value);
			this.vm = clonedVM;
			this.forceUpdate();
			this.reRender();
		}
	};

	protected handleResizeGroup = (evt: OnReiszeGroupEventData) => {
		Object.keys(evt).forEach((key) => {
			if (key === this.id) {
				this.resize();
			}
		});
	};

	async componentWillUnmount() {}

	async componentDidUpdate() {
		// this.reRender();
	}

	render() {
		// TODO
		/* eslint-disable @typescript-eslint/no-unused-vars */
		const { viewModel, className, style, eventbus, scenaAttrs, ...restProps } =
			this.props;
		return (
			<div
				className={className}
				style={{
					position: "relative",
					width: "100%",
					height: "100%",
					zIndex: 1,
					background: "#fff",
					...style,
				}}
				ref={this.viewRef}
				{...restProps}
			>
				{this.renderTitle()}
				{this.renderView()}
			</div>
		);
	}
}
