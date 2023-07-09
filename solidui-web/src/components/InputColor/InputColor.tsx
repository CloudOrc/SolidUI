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
import { isString } from "lodash-es";
import ColorPicker from "../ColorPicker/ColorPicker";
import "./InputColor.less";

export interface InputColorProps {
	className?: string;
	style?: React.CSSProperties;
	prefixCls?: string;
	width?: number;

	value?: any;
	onChange?: (hex: string) => void;
}

export default function InputColor({
	prefixCls = "solid",
	className,
	style,
	width = 155,
	value = "#000000",
	onChange,
}: InputColorProps) {
	const [displayColorPicker, setDisplayColorPicker] = useState(false);
	const [stateValue, setStateValue] = useState(value);

	useEffect(() => {
		setStateValue(value);
	}, [value]);

	function handleClickColorPicker() {
		setDisplayColorPicker(!displayColorPicker);
	}

	function handleCloseColorPicker() {
		setDisplayColorPicker(false);
	}

	function handleColorChange(color: any) {
		const mValue = isString(color) ? color : color.hex;
		setStateValue(mValue);
		if (onChange) {
			onChange(mValue);
		}
	}

	function renderColorPicker() {
		if (!displayColorPicker) return undefined;
		return (
			<div className="popover">
				<div
					className="cover"
					onClick={handleCloseColorPicker}
					onKeyPress={handleCloseColorPicker}
					role="button"
					tabIndex={0}
				/>
				<ColorPicker color={stateValue} onChange={handleColorChange} />
			</div>
		);
	}

	const _style: React.CSSProperties = {
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		width: `${width}px`,
		...style,
	};

	return (
		<div
			className={classNames(prefixCls, "solid-color", className)}
			style={_style}
		>
			<div
				style={{
					backgroundColor: `${stateValue}`,
					width: "100%",
				}}
			>
				<div
					className="swatch"
					onClick={handleClickColorPicker}
					onKeyPress={handleCloseColorPicker}
					role="button"
					tabIndex={0}
				>
					{stateValue}
				</div>

				{renderColorPicker()}
			</div>
		</div>
	);
}
