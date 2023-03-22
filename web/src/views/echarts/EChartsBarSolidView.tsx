import * as React from "react";
import EChartsBaseSolidView, {
	EChartsBaseSolidViewProps,
} from "./EChartsBaseSolidView";
import {
	EChartsOption,
	SeriesOption,
	XAXisComponentOption,
	LegendComponentOption,
	GridComponentOption,
	TooltipComponentOption,
} from "echarts";
import { findIndex, get, head } from "lodash-es";

export interface SolidEChartsBarViewProps extends EChartsBaseSolidViewProps {}

export default class EChartsBarSolidView extends EChartsBaseSolidView<SolidEChartsBarViewProps> {
	constructor(props: SolidEChartsBarViewProps) {
		super(props);
	}

	private getSeries(x: any): SeriesOption | undefined {
		let row0 = this.dataSheet[0];
		if (!row0) return undefined;

		let xIdx = findIndex(row0, function (o) {
			return o === x.label;
		});
		if (xIdx === -1) return undefined;

		let seriesData: any[] = [];
		this.dataSheet.forEach((row, idx) => {
			if (idx === 0) return;

			seriesData.push({
				name: x.label,
				value: row[xIdx],
			});
		});

		return {
			type: "bar",
			name: x.label,
			data: seriesData,
		};
	}

	protected getXAxisOption():
		| XAXisComponentOption
		| XAXisComponentOption[]
		| undefined {
		let headRow = head(this.dataSheet);
		if (!headRow) return {};
		let viewDimensions = get(this.props.viewModel, "data.xs", []) as any[];
		let headDimension = head(viewDimensions);
		if (!headDimension) return {};
		let viewDimensionIdx = findIndex(headRow, function (o) {
			return o === headDimension.label;
		});
		if (viewDimensionIdx === -1) return {};

		let xAxisData: any[] = [];
		this.dataSheet.forEach((row, idx) => {
			if (idx === 0) return;

			xAxisData.push({
				value: row[viewDimensionIdx],
			});
		});

		let vm = this.props.viewModel as any;
		let option = vm.option || {};

		return {
			// @ts-ignore
			type: "category",
			data: xAxisData,
			...option.xAxis,
		};
	}

	protected getSeriesOption(): SeriesOption[] | undefined {
		let xs = get(this.props.viewModel, "data.ys", []) as any[];
		let seriesList: SeriesOption[] = [];
		xs.forEach((x) => {
			let series = this.getSeries(x);
			if (series) {
				seriesList.push(series);
			}
		});

		return seriesList;
	}

	protected getLegendOption():
		| LegendComponentOption
		| LegendComponentOption[]
		| undefined {
		let vm = this.props.viewModel as any;
		let option = vm.option || {};
		return option.legend;
	}

	protected getGridOption(): GridComponentOption | GridComponentOption[] {
		let vm = this.props.viewModel as any;
		let option = vm.option || {};
		return option.grid || {};
	}

	protected getTooltipOption():
		| TooltipComponentOption
		| TooltipComponentOption[]
		| undefined {
		let vm = this.props.viewModel as any;
		let option = vm.option || {};
		return option.tooltip || {};
	}
}
