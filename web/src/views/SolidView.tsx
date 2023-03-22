import React from "react";
import { Emitter } from "mitt";
import {
	EventBusType,
	OnDragEventData,
	OnResizeEventData,
	OnReiszeGroupEventData,
} from "@/types/eventbus";

import { SolidModelDataType, SolidViewDataType } from "@/types/solid";

export interface SolidViewProps {
	id: string;
	className?: string;
	style?: React.CSSProperties;
	viewModel: SolidViewDataType;
	"solidui-element-id"?: string;
	eventbus?: Emitter<EventBusType>;
	scenaAttrs?: any;
}

export default abstract class SolidView<
	T extends SolidViewProps
> extends React.Component<T> {
	dataSheet: any[] = [];
	private viewRef = React.createRef<HTMLDivElement>();
	private id: string;
	private eventbus: Emitter<EventBusType>;

	protected constructor(props: T) {
		super(props);

		this.id = props["solidui-element-id"] as string;
		this.eventbus = props.eventbus!;

		// abstract methods
		this.renderView = this.renderView.bind(this);
		this.baseViewDidMount = this.baseViewDidMount.bind(this);
		this.baseViewWillUnmount = this.baseViewWillUnmount.bind(this);

		// private methods
		this.fetchDataAndReRender = this.fetchDataAndReRender.bind(this);
		this.reRender = this.reRender.bind(this);
		this.fetchData = this.fetchData.bind(this);
	}

	//// ------------------------------------------------------------------
	//// abstract methods
	protected abstract renderView(): React.ReactNode;
	protected abstract baseViewDidMount(): void;
	protected abstract baseViewWillUnmount(): void;
	protected abstract reRender(): void;
	protected abstract resize(): void;

	//// ------------------------------------------------------------------
	//// private methods
	private readonly fetchDataAndReRender = async () => {
		await this.fetchData();
		this.reRender();
	};

	private readonly fetchData = async () => {
		let viewModel = this.props.viewModel;
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
	}

	protected handleDrag = (evt: OnDragEventData) => {};

	protected handleResize = (evt: OnResizeEventData) => {
		this.resize();
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
		let viewModel = this.props.viewModel;
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
				{this.renderView()}
			</div>
		);
	}
}
