import React from "react";
import { Emitter } from "mitt";
import {
	EventBusType,
	OnDragEventData,
	OnResizeEventData,
	OnReiszeGroupEventData,
	OnUpdateViewPropertyValueEventData,
} from "@/types/eventbus";

import { SolidModelDataType, SolidViewDataType } from "@/types/solid";
import { set } from "lodash-es";

export interface SolidViewProps {
	id: string;
	className?: string;
	style?: React.CSSProperties;
	viewModel: SolidViewDataType;
	"solidui-element-id"?: string;
	eventbus?: Emitter<EventBusType>;
	scenaAttrs?: any;
}

export interface SolidViewState {
	viewModel: SolidViewDataType;
}

export default abstract class SolidView<
	T extends SolidViewProps,
	S extends SolidViewState = SolidViewState
> extends React.Component<T, S> {
	dataSheet: any[] = [];
	private viewRef = React.createRef<HTMLDivElement>();
	private vm: SolidViewDataType;
	private id: string;
	private eventbus: Emitter<EventBusType>;

	protected constructor(props: T) {
		super(props);

		this.id = props["solidui-element-id"] as string;
		this.eventbus = props.eventbus!;
		this.vm = this.props.viewModel || {};

		// abstract methods
		this.renderView = this.renderView.bind(this);
		this.baseViewDidMount = this.baseViewDidMount.bind(this);
		this.baseViewWillUnmount = this.baseViewWillUnmount.bind(this);

		// private methods
		this.fetchDataAndReRender = this.fetchDataAndReRender.bind(this);
		this.reRender = this.reRender.bind(this);
		this.fetchData = this.fetchData.bind(this);
	}

	// static getDerivedStateFromProps(
	// 	nextProps: SolidViewProps,
	// 	prevState: SolidViewState
	// ): SolidViewState | null {
	// 	if (null === prevState || nextProps.viewModel !== prevState.viewModel) {
	// 		return {
	// 			viewModel: nextProps.viewModel,
	// 		};
	// 	}
	// 	return null;
	// }

	//// ------------------------------------------------------------------
	//// abstract methods
	protected abstract renderView(): React.ReactNode;
	protected abstract baseViewDidMount(): void;
	protected abstract baseViewWillUnmount(): void;
	protected abstract reRender(): void;
	protected abstract resize(): void;

	//// ------------------------------------------------------------------
	//// protected methods
	protected renderTitle(): React.ReactNode {
		// let viewModel = this.props.viewModel;
		// let viewModel = this.state.viewModel;
		let viewModel = this.vm;
		let options = viewModel.options || {};
		let title = options.title || {};
		let show = title.show;
		if (!!show) {
			return <div className="solid-view-title">{title.text}</div>;
		}
		return null;
	}

	//// ------------------------------------------------------------------
	//// private methods
	private readonly fetchDataAndReRender = async () => {
		await this.fetchData();
		this.reRender();
	};

	private readonly fetchData = async () => {
		// let viewModel = this.props.viewModel;
		// let viewModel = this.state.viewModel;
		let viewModel = this.vm;
		let data = viewModel.data || {};
		let remote = data.remote;
		if (!remote) {
			this.dataSheet = viewModel.data.dataset || [];
			return;
		}
	};

	async componentDidMount() {
		await this.fetchData();

		this.baseViewDidMount();
		this.eventbus.on("onResize", this.handleResize);
		this.eventbus.on("onResizeGroup", this.handleResizeGroup);
		this.eventbus.on(
			"onUpdateViewPropertyValue",
			this.handleUpdateViewPropertyValue
		);
	}

	protected handleDrag = (evt: OnDragEventData) => {};

	protected handleResize = (evt: OnResizeEventData) => {
		this.resize();
	};

	protected handleUpdateViewPropertyValue = (
		evt: OnUpdateViewPropertyValueEventData
	) => {
		if (this.id === evt.id) {
			set(this.vm, evt.property, evt.value);
			this.forceUpdate();
			this.reRender();
			// this.handleUpdateViewPropertyValueInternal(evt);
		}
	};

	protected handleResizeGroup = (evt: OnReiszeGroupEventData) => {
		for (let key in evt) {
			if (key === this.id) {
				this.resize();
				break;
			}
		}
	};

	async componentWillUnmount() {}

	async componentDidUpdate(
		prevProps: Readonly<T>,
		prevState: Readonly<{}>,
		snapshot?: any
	) {
		// let viewModel = this.state.viewModel;
		let viewModel = this.vm;
		// let viewModel = this.props.viewModel;
		// let metadata = viewModel.metadata || {};
		// if (viewModel.reFetch) {
		// 	await this.fetchData();
		// }

		this.reRender();
	}

	render() {
		let { viewModel, className, style, eventbus, scenaAttrs, ...restProps } =
			this.props;

		return (
			<div
				className={className}
				style={{
					position: "relative",
					width: "100%",
					height: "100%",
					zIndex: 1,
					padding: 5,
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
