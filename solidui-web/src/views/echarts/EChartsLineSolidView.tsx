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
import { findIndex, get, head } from "lodash-es";
import EChartsBaseSolidView, {
	EChartsBaseSolidViewProps,
} from "./EChartsBaseSolidView";

export type SolidEChartsLineViewProps = EChartsBaseSolidViewProps;

export default class EChartsLineSolidView extends EChartsBaseSolidView<SolidEChartsLineViewProps> {
	private getSeries(measure: any): SeriesOption | undefined {
		// 1.
		const row0 = this.dataSheet[0];
		if (!row0) return undefined;

		// 2.
		const measureIdx = findIndex(row0, (o) => o === measure.label);
		if (measureIdx === -1) return undefined;

		// 3.
		const seriesData: any[] = [];
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
		const headRow = head(this.dataSheet);
		if (!headRow) return {};
		const viewDimensions = get(
			this.props.viewModel,
			"metadata.viewDimensions",
			[],
		) as any[];
		const headDimension = head(viewDimensions);
		if (!headDimension) return {};
		const viewDimensionIdx = findIndex(
			headRow,
			(o) => o === headDimension.label,
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
		const measures = get(
			this.props.viewModel,
			"metadata.measures",
			[],
		) as any[];
		const seriesList: SeriesOption[] = [];
		measures.forEach((item) => {
			const series = this.getSeries(item);
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
		const vm = this.props.viewModel as any;
		const option = vm.option || {};
		return option.grid || {};
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
