import * as React from "react";
import { useState, useEffect } from "react";
import classNames from "classnames";
import { clamp } from "lodash-es";
import "./slider.less";

export interface SliderProps {
	className?: string;
	style?: React.CSSProperties;
	prefixCls?: string;

	min: number;
	max: number;
	width?: number;
	value?: number;

	// 回调函数，当滑块发生值改变的时候回调该函数
	onUpdate?: (value: number, isLive: boolean) => void;
}

function Slider({
	prefixCls = "solid",
	min,
	max,
	width,
	className,
	style,
	value,
	onUpdate,
}: SliderProps) {
	const [stateValue, setStateValue] = useState(0);
	// const sliderRef = React.useRef<HTMLDivElement>(null)
	const sliderRef = React.useRef<HTMLSpanElement>(null);
	useEffect(() => {
		setStateValue(value || 0);
	}, [value]);

	function handleClick(e: React.MouseEvent) {
		e.preventDefault();
	}

	function handleMouseDown(e: React.MouseEvent) {
		update(e.pageX);

		window.addEventListener("mousemove", handleMouseMove);
		window.addEventListener("mouseup", handleMouseUp);
	}

	function handleMouseMove(e: MouseEvent) {
		update(e.pageX);
		e.preventDefault();
	}

	function handleMouseUp(e: MouseEvent) {
		update(e.pageX, false);
		window.removeEventListener("mousemove", handleMouseMove);
		window.removeEventListener("mouseup", handleMouseUp);
	}

	function update(pageX: number, isLive = true) {
		const rect = sliderRef.current?.getBoundingClientRect();
		if (!rect) return;
		const x = pageX - rect.left;
		const w = rect.right - rect.left;
		const value = min + clamp(x / w, 0, 1) * (max - min);

		setStateValue(value);
		onUpdate && onUpdate(value, isLive);
	}

	const widthBackground = clamp(
		((stateValue - min) * 100) / (max - min),
		0,
		100
	);

	const _style: React.CSSProperties = {
		width: `${width}%`,
		backgroundSize: `${widthBackground}%`,
		...style,
	};

	return (
		<span
			className={classNames(`${prefixCls}-slider`, className)}
			style={_style}
			onClick={handleClick}
			onMouseDown={handleMouseDown}
			role="slider"
			tabIndex={0}
			aria-valuenow={stateValue}
			aria-valuemin={min}
			aria-valuemax={max}
			ref={sliderRef}
		/>
	);
}

export default Slider;
