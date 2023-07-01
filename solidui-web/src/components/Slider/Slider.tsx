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
		const mValue = min + clamp(x / w, 0, 1) * (max - min);

		setStateValue(mValue);
		if (onUpdate) {
			onUpdate(mValue, isLive);
		}
	}

	const widthBackground = clamp(
		((stateValue - min) * 100) / (max - min),
		0,
		100,
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
