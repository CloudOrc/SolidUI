import SolidViewBuilder from "./builder/SolidViewBuilder";
import EChartsBarSolidViewBuilder from "./builder/echarts/EChartsBarSolidViewBuilder";

export default class ViewFactory {
	private pool: Map<string, SolidViewBuilder> = new Map<
		string,
		SolidViewBuilder
	>();

	public constructor() {
		this.init(() => {
			console.log("load view components ok");
		});
	}

	public init(success?: Function): void {
		new EChartsBarSolidViewBuilder(this);
		success && success();
	}

	public register(builder: SolidViewBuilder): void {
		this.pool.set(builder.getType(), builder);
	}

	public getBuilder(type: string): SolidViewBuilder | undefined {
		const builder = this.pool.get(type);
		if (undefined === builder || null === builder) {
			console.warn("can't found solid view builder, type = " + type);
			return undefined;
		}
		return builder;
	}
}
