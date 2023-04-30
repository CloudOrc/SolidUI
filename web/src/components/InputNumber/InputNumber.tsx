import * as React from "react";
import { useState, useEffect } from "react";
import classNames from "classnames";
import { isFinite, isInteger, toNumber } from "lodash";
import Slider, { SliderProps } from "../Slider/Slider";
import { parseInt } from "lodash";
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

	function update(value: any) {
		setStateValue(value);

		if (typeof value === "string") {
			onUpdateValue && onUpdateValue(parseInt(`${value}`));
		} else if (typeof value === "number") {
			onUpdateValue && onUpdateValue(value);
		} else {
			onUpdateValue && onUpdateValue(parseInt(`${value}`));
		}
	}

	function handleSliderUpdate(value: number) {
		update(applyConstraints({ value, min, max, step }));
	}

	function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
		const { value } = event.target;
		let newValue = applyConstraints({ value, min, max, step });
		update(newValue);
	}

	const hasSlider = isFinite(min) && isFinite(max);
	const controlsWidth = 100;
	const inputWidth =
		hasSlider && disableSlider !== true
			? Math.round(controlsWidth / 3)
			: controlsWidth;
	const sliderWidth = controlsWidth - inputWidth;

	let _style: React.CSSProperties = {
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		width: "100%",
		// padding: "1px 2px 1px 8px",
		...style,
	};

	let borderStyle: React.CSSProperties = {};
	if (!border) {
		borderStyle.border = "none";
	}

	let inputBorderStyle: React.CSSProperties = {};
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