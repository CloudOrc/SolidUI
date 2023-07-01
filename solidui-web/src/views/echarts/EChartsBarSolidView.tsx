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

import {
	SeriesOption,
	XAXisComponentOption,
	LegendComponentOption,
	GridComponentOption,
	TooltipComponentOption,
} from "echarts";
import { findIndex, head } from "lodash-es";
import EChartsBaseSolidView, {
	EChartsBaseSolidViewProps,
} from "./EChartsBaseSolidView";

export type SolidEChartsBarViewProps = EChartsBaseSolidViewProps;

export default class EChartsBarSolidView extends EChartsBaseSolidView<SolidEChartsBarViewProps> {
	private getSeries(y: any): SeriesOption | undefined {
		const row0 = this.dataSheet[0];
		if (!row0) return undefined;

		const xIdx = findIndex(row0, (o) => o === y.label);
		if (xIdx === -1) return undefined;

		const seriesData: any[] = [];
		this.dataSheet.forEach((row, idx) => {
			if (idx === 0) return;

			seriesData.push({
				name: y.label,
				value: row[xIdx],
			});
		});

		return {
			type: "bar",
			name: y.label,
			data: seriesData,
		};
	}

	protected getXAxisOption():
		| XAXisComponentOption
		| XAXisComponentOption[]
		| undefined {
		const headRow = head(this.dataSheet);
		if (!headRow) return {};
		const xs = this.getXs();
		if (!xs || xs.length === 0) return {};
		// let viewDimensions = get(this.props.viewModel, "data.xs", []) as any[];
		// let headDimension = head(viewDimensions);
		const headDimension = head(xs);
		const viewDimensionIdx = findIndex(
			headRow,
			(o) => o === headDimension!.label,
		);
		if (viewDimensionIdx === -1) return {};

		const xAxisData: any[] = [];
		this.dataSheet.forEach((row, idx) => {
			if (idx === 0) return;

			xAxisData.push({
				value: row[viewDimensionIdx],
			});
		});

		const vm = this.props.viewModel as any;
		const option = vm.option || {};

		return {
			type: "category",
			data: xAxisData,
			...option.xAxis,
		};
	}

	protected getSeriesOption(): SeriesOption[] | undefined {
		// let xs = get(this.props.viewModel, "data.ys", []) as any[];
		const ys = this.getYs();
		const seriesList: SeriesOption[] = [];
		ys.forEach((y) => {
			const series = this.getSeries(y);
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
		const vm = this.props.viewModel as any;
		const option = vm.option || {};
		return option.legend;
	}

	protected getGridOption(): GridComponentOption | GridComponentOption[] {
		const baseGridOptions = super.getGridOption();
		const vm = this.props.viewModel as any;
		const option = vm.option || {};
		return { ...baseGridOptions, ...option.grid };
	}

	protected getTooltipOption():
		| TooltipComponentOption
		| TooltipComponentOption[]
		| undefined {
		const vm = this.props.viewModel as any;
		const option = vm.option || {};
		return option.tooltip || {};
	}
}
