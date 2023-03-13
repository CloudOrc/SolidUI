import React from "react";
import * as echarts from "echarts";
import {
	EChartsOption,
	ECharts,
	TitleComponentOption,
	LegendComponentOption,
	TooltipComponentOption,
	GridComponentOption,
	XAXisComponentOption,
	YAXisComponentOption,
	SeriesOption,
	DataZoomComponentOption,
	VisualMapComponentOption,
	DatasetComponentOption,
} from "echarts";
import SolidView, { SolidViewProps } from "../SolidView";
import { defaultTheme } from "@/assets/themes";

export interface EChartsBaseSolidViewProps extends SolidViewProps {}

export default class EChartsBaseSolidView<
	T extends EChartsBaseSolidViewProps
> extends SolidView<T> {
	ecRef: React.RefObject<HTMLDivElement>;
	ecInstance?: ECharts;
	resizeTimer?: NodeJS.Timeout;

	constructor(props: T) {
		super(props);

		this.ecRef = React.createRef();

		this.getTitleOption = this.getTitleOption.bind(this);
		this.getLegendOption = this.getLegendOption.bind(this);
		this.getTooltipOption = this.getTooltipOption.bind(this);
		this.getGridOption = this.getGridOption.bind(this);
		this.getXAxisOption = this.getXAxisOption.bind(this);
		this.getYAxisOption = this.getYAxisOption.bind(this);
		this.getSeriesOption = this.getSeriesOption.bind(this);
		this.getDataZoomOption = this.getDataZoomOption.bind(this);
		this.getVisualMapOption = this.getVisualMapOption.bind(this);
		this.getDatasetOption = this.getDatasetOption.bind(this);

		this.reFetchData = this.reFetchData.bind(this);
		this.reload = this.reload.bind(this);

		this.resize = this.resize.bind(this);
	}

	reFetchData() {}

	reload() {}

	protected reRender(): void {
		if (this.ecInstance) {
			this.ecInstance.setOption(this.buildOption(), true, false);
		}
	}

	protected baseViewDidMount(): void {
		if (this.ecRef && this.ecRef.current) {
			this.ecInstance = echarts.init(this.ecRef.current, defaultTheme);
			this.ecInstance.setOption(this.buildOption());
		}

		window.addEventListener("resize", this.resize);
	}

	// componentWillUnmount(): void {
	protected baseViewWillUnmount(): void {
		window.removeEventListener("resize", this.resize);
	}

	//// ------------------------------------------------------------------
	//// protected methods
	protected getTitleOption(): TitleComponentOption {
		return {
			show: true,
		};
	}

	protected getLegendOption():
		| LegendComponentOption
		| LegendComponentOption[]
		| undefined {
		return {
			show: false,
			type: "plain",
		};
	}

	protected getTooltipOption():
		| TooltipComponentOption
		| TooltipComponentOption[]
		| undefined {
		return {
			show: false,
			trigger: "axis",
		};
	}

	protected getGridOption():
		| GridComponentOption
		| GridComponentOption[]
		| undefined {
		return {};
	}

	protected getXAxisOption():
		| XAXisComponentOption
		| XAXisComponentOption[]
		| undefined {
		return {
			type: "category",
		};
	}

	protected getYAxisOption():
		| YAXisComponentOption
		| YAXisComponentOption[]
		| undefined {
		return {};
	}

	protected getSeriesOption(): SeriesOption | SeriesOption[] | undefined {
		return [];
	}

	protected getDataZoomOption():
		| DataZoomComponentOption
		| DataZoomComponentOption[]
		| undefined {
		return [];
	}

	protected getVisualMapOption():
		| VisualMapComponentOption
		| VisualMapComponentOption[]
		| undefined {
		return [];
	}

	protected getDatasetOption():
		| DatasetComponentOption
		| DatasetComponentOption[]
		| undefined {
		return [];
	}

	//////// ------------------------------------------------------------------
	//////// private methods
	private buildOption(): EChartsOption {
		let options: EChartsOption = {
			title: this.getTitleOption(),
			legend: this.getLegendOption(),
			tooltip: this.getTooltipOption(),
			grid: this.getGridOption(),
			xAxis: this.getXAxisOption(),
			yAxis: this.getYAxisOption(),
			series: this.getSeriesOption(),
			dataZoom: this.getDataZoomOption(),
			visualMap: this.getVisualMapOption(),
			dataset: this.getDatasetOption(),
		};
		console.log(options);
		return options;
	}

	resize(): void {
		if (this.resizeTimer) {
			clearTimeout(this.resizeTimer);
		}

		let that = this;
		this.resizeTimer = setTimeout(function () {
			that.ecInstance && that.ecInstance.resize();
		}, 50);
	}

	protected renderView(): React.ReactNode {
		return (
			<div
				ref={this.ecRef}
				style={{
					position: "relative",
					userSelect: "none",
					width: "100%",
					height: "100%",
				}}
			/>
		);
	}
}
