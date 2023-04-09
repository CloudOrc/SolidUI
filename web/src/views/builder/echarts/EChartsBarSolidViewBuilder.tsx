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
			frame: {
				backgroundColor: "#333",
				translate: [0, 0],
				rotate: 0,
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
			background: "#fff",
			overflow: "hidden",
			border: "1px solid #f1f1f1",
		} as React.CSSProperties;

		viewModel.style = viewStyle;

		return { ...viewModel, option: defaultOptions };
	}

	getFrame(): any {
		return {
			translate: [0, 0],
			transformOrigin: "50% 50%",
			rotate: 0,
		};
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
