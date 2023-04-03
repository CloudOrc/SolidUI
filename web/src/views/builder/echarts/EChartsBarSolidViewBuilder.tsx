import EChartsBaseViewBuilder from "./EChartsBaseViewBuilder";
import { TooltipComponentOption } from "echarts";
import { ViewCategory, ViewType } from "../SolidViewBuilder";
import EChartsBarSolidView from "../../echarts/EChartsBarSolidView";
import { SolidViewDataType } from "@/types/solid";
import { genId } from "@/utils";

export default class EChartsBarSolidViewBuilder extends EChartsBaseViewBuilder {
	createModel(): any {
		let viewModel: SolidViewDataType = {
			id: genId(),
			title: "bar",
			type: "echarts_bar",
			position: {
				top: 0,
				left: 0,
			},
			size: {
				width: 560,
				height: 250,
			},
			data: {
				id: "",
				title: "",
				remote: false,
				dataset: [
					["name", "pjsf", "pjhf", "cc"],
					["guomu", 9204.65, 1930.94, 1400],
					["miaomu", 9312.02, 2059.42, 902],
					["shucai", 20857.99, 7482.28, 5502],
				],
				xs: [
					{
						label: "name",
					},
				],
				ys: [
					{
						label: "pjsf",
					},
					{
						label: "pjhf",
					},
					{
						label: "cc",
					},
				],
			},
		};

		const defaultOptions = {
			tooltip: {
				show: true,
				trigger: "axis",
				axisPointer: {
					type: "shadow",
				},
			} as TooltipComponentOption,
		};

		let viewStyle = {
			position: "absolute",
			top: 0,
			left: 100,
			width: 500,
			height: 400,
			background: "#fff",
			overflow: "hidden",
			border: "1px solid #f1f1f1",
		} as React.CSSProperties;

		viewModel.style = viewStyle;
		viewModel.frame = {
			backgroundColor: "#333",
		};

		return { ...viewModel, option: defaultOptions };
	}

	getComponentType(): any {
		return EChartsBarSolidView;
	}

	getCategory(): ViewCategory {
		return {
			key: "echarts",
			title: "ECharts",
		};
	}

	getDescription(): string {
		return "";
	}

	getIcon(): string {
		return "";
	}

	getTitle(): string {
		return "Bar Chart";
	}

	getType(): ViewType {
		return "echarts_bar";
	}

	getId(): string {
		return "echarts_bar";
	}

	getImage(): string {
		return "";
	}
}
