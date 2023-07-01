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
import { useState, useEffect } from "react";
import classNames from "classnames";
import { isFinite, isInteger, toNumber, parseInt } from "lodash-es";
import Slider, { SliderProps } from "../Slider/Slider";
import "./InputNumber.less";

export interface DatNumberProps extends Omit<SliderProps, "onUpdate"> {
	disableSlider?: boolean;
	onUpdateValue?: (value: number) => void;
	step: number;
	border?: boolean;
}

// function toNumber(value: any) {
//   const float = parseFloat(value)
//   return isNaN(float) ? 0 : float
// }

function applyConstraints({ value, min, max, step }: any) {
	const [hasMin, hasMax, hasStep] = [
		isFinite(min),
		isFinite(max),
		isFinite(step),
	];

	const decimalPlaces =
		hasStep && !isInteger(step) ? step.toString().split(".")[1].length : 0;
	let [isMin, isMax] = [false, false];
	value = toNumber(value);

	if (hasMin && value <= min) {
		value = min;
		isMin = true;
	}

	if (hasMax && value >= max) {
		value = max;
		isMax = true;
	}

	if (!isMin && !isMax) {
		if (hasStep && step !== 0) {
			value = Math.round(value / step) * step;
		}
	}

	return value.toFixed(decimalPlaces);
}

function DatNumber({
	className,
	style,
	max,
	min,
	step,
	value = 0,
	border = false,
	disableSlider = false,
	onUpdateValue,
}: DatNumberProps) {
	const [stateValue, setStateValue] = useState(value);

	useEffect(() => {
		setStateValue(applyConstraints({ value, min, max, step }));
	}, [value, min, max, step]);

	// useEffect(() => {
	//   setStateValue(value)
	// }, [value])

	function update(pValue: any) {
		setStateValue(pValue);
		if (!onUpdateValue) {
			return;
		}

		if (typeof pValue === "string") {
			onUpdateValue(parseInt(`${pValue}`));
		} else if (typeof pValue === "number") {
			onUpdateValue(pValue);
		} else {
			onUpdateValue(parseInt(`${pValue}`));
		}
	}

	function handleSliderUpdate(pValue: number) {
		update(applyConstraints({ value: pValue, min, max, step }));
	}

	function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
		const { value: mValue } = event.target;
		const newValue = applyConstraints({ value: mValue, min, max, step });
		update(newValue);
	}

	const hasSlider = isFinite(min) && isFinite(max);
	const controlsWidth = 100;
	const inputWidth =
		hasSlider && disableSlider !== true
			? Math.round(controlsWidth / 3)
			: controlsWidth;
	const sliderWidth = controlsWidth - inputWidth;

	const _style: React.CSSProperties = {
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		width: "100%",
		// padding: "1px 2px 1px 8px",
		...style,
	};

	const borderStyle: React.CSSProperties = {};
	if (!border) {
		borderStyle.border = "none";
	}

	const inputBorderStyle: React.CSSProperties = {};
	if (!border) {
		inputBorderStyle.border = "none";
		// inputBorderStyle.borderLeft = "1px solid #0d0e0e";
		inputBorderStyle.borderLeft = "1px solid rgba(0, 0, 0, 0.15)";
		inputBorderStyle.backgroundColor = "#fff";
	}

	return (
		<div
			className={classNames("solid-elem", "solid-input-number", className)}
			style={_style}
		>
			{hasSlider && disableSlider !== true ? (
				<Slider
					value={stateValue}
					min={min}
					max={max}
					width={sliderWidth}
					onUpdate={handleSliderUpdate}
					style={{
						display: "inline-block",
						borderRightWidth: 0,
						...borderStyle,
					}}
				/>
			) : undefined}
			<input
				type="number"
				step={step}
				min={min}
				max={max}
				inputMode="numeric"
				value={stateValue}
				style={{
					width: `${inputWidth}%`,
					paddingLeft: "4px",
					...inputBorderStyle,
				}}
				onChange={handleChange}
			/>
		</div>
	);
}

export default DatNumber;
