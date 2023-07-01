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

import React from "react";
import classNames from "classnames";

export interface PropertyElementProps {
	className?: string;
	style?: React.CSSProperties;

	height?: number;
	labelWidth?: number;
	labelStyle?: React.CSSProperties;
	label?: string;
	inputStyle?: React.CSSProperties;
	children?: React.ReactNode;
}

export default function PropertyElement(props: PropertyElementProps) {
	const {
		className,
		style,
		height = 40,
		labelWidth = 70,
		labelStyle: _labelStyle,
		label,
		inputStyle: _inputStyle,
		children,
	} = props;

	const _style: React.CSSProperties = {
		height,
		margin: "0 25px",
		...style,
	};

	const labelStyle: React.CSSProperties = {
		position: "absolute",
		top: 0,
		left: 0,
		width: labelWidth,
		bottom: 0,
		overflow: "hidden",
		..._labelStyle,
	};

	const inputStyle: React.CSSProperties = {
		position: "absolute",
		top: 0,
		left: labelWidth,
		right: 0,
		bottom: 0,
		overflow: "hidden",
		..._inputStyle,
	};

	const _className = classNames(
		{
			"property-element": true,
			// ["h-tape-layout"]: true,
			relative: true,
		},
		className,
	);

	return (
		<div className={_className} style={_style}>
			<div
				className="solid-label flex-horizontal-layout v-middle"
				style={labelStyle}
			>
				<div className="solid-text">{label}</div>
			</div>
			<div className="flex-center-adapt-layout" style={inputStyle}>
				{children}
			</div>
		</div>
	);
}
