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

import * as React from "react";
import classNames from "classnames";
import { Hue, Saturation } from "react-color/lib/components/common";
import { CustomPicker } from "react-color";
import ColorPickerFields from "./Fields";
import Pointer from "./Pointer";
import PointerCircle from "./PointCircle";
import "./ColorPicker.less";

export interface ColorPickerProps /* extends CustomPickerProps<any> */ {
	prefixCls?: string;
	className?: string;
	style?: React.CSSProperties;
	hsl?: any;
	hsv?: any;
	hex?: string;
	onChange: any;
}

function ColorPicker(props: ColorPickerProps) {
	const {
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
					// @ts-ignore
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
								// @ts-ignore
								hsl={hsl}
								// @ts-ignore
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
