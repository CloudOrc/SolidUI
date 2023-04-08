import SolidViewFactory from "../SolidViewFactory";

export interface ViewCategory {
	key: string;
	title: string;
}

export type ViewType = "echarts_bar" | "echarts_line" | "echarts_pie";

export default abstract class ViewBuilder {
	constructor(protected factory: SolidViewFactory) {
		factory.register(this);
	}

	abstract createModel(): any;

	abstract getFrame(): any;

	abstract getComponentType(): any;

	abstract getId(): string;

	abstract getCategory(): ViewCategory;

	abstract getTitle(): string;

	abstract getType(): ViewType;

	abstract getIcon(): string;

	abstract getImage(): string;

	abstract getDescription(): string;
}
