import * as React from "react";
import classNames from "classnames";
import ColorPickerFields from "./Fields";
import Pointer from "./Pointer";
import PointerCircle from "./PointCircle";
import { Hue, Saturation } from "react-color/lib/components/common";
import { CustomPicker } from "react-color";
import "./ColorPicker.less";

export interface ColorPickerProps /*extends CustomPickerProps<any>*/ {
	prefixCls?: string;
	className?: string;
	style?: React.CSSProperties;
	hsl?: any;
	hsv?: any;
	hex?: string;
	onChange: any;
}

function ColorPicker(props: ColorPickerProps) {
	let {
		prefixCls = "solid",
		className,
		// value,
		hsl,
		hsv,
		hex,
		onChange,
	} = props;

	return (
		<div className={classNames(`${prefixCls}-colorpicker`, className)}>
			<div className="saturation-wrap">
				<Saturation
					//@ts-ignore
					hsl={hsl}
					hsv={hsv}
					className="saturation"
					// @ts-ignore
					pointer={PointerCircle}
					onChange={onChange}
				/>
			</div>
			{/* end saturation-wrap */}

			<div className="body">
				<div className="controls">
					<div className="toggles">
						<div className="hue-wrap">
							<Hue
								className="hue"
								//@ts-ignore
								hsl={hsl}
								//@ts-ignore
								pointer={Pointer}
								onChange={onChange}
							/>
						</div>
					</div>
				</div>
				<ColorPickerFields hex={hex} onChange={onChange} />
			</div>
		</div>
	);
}

export default CustomPicker(ColorPicker);
