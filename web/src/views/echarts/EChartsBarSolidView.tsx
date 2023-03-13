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

	private getSeries(measure: any): SeriesOption | undefined {
		// 1.
		// debugger
		let row0 = this.dataSheet[0];
		if (!row0) return undefined;

		// 2.
		let measureIdx = findIndex(row0, function (o) {
			return o === measure.label;
		});
		if (measureIdx === -1) return undefined;

		// 3.
		let seriesData: any[] = [];
		this.dataSheet.forEach((row, idx) => {
			if (idx === 0) return;

			seriesData.push({
				name: measure.label,
				value: row[measureIdx],
			});
		});

		return {
			type: "bar",
			name: measure.label,
			data: seriesData,
		};
	}

	protected getXAxisOption():
		| XAXisComponentOption
		| XAXisComponentOption[]
		| undefined {
		// console.log(this.dataSheet);
		let headRow = head(this.dataSheet);
		if (!headRow) return {};
		let viewDimensions = get(
			this.props.viewModel,
			"metadata.viewDimensions",
			[]
		) as any[];
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
		let measures = get(this.props.viewModel, "metadata.measures", []) as any[];
		let seriesList: SeriesOption[] = [];
		measures.forEach((item, idx) => {
			let series = this.getSeries(item);
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
