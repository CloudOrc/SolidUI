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
import "./InputText.less";

export interface InputTextProps {
	className?: string;
	style?: React.CSSProperties;
	value?: string;
	disabled?: boolean;
	onChange?: (value: string) => void;
}

function InputText({
	className,
	style,
	value = "",
	disabled = false,
	onChange,
}: InputTextProps) {
	const [stateValue, setStateValue] = useState(value);

	useEffect(() => {
		setStateValue(value);
	}, [value]);

	function update(pValue: string) {
		setStateValue(pValue);
		if (onChange) {
			onChange(pValue);
		}
	}

	function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
		update(event.target.value);
	}

	const inputWidth = 100;

	const _style: React.CSSProperties = {
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		width: "100%",
		...style,
	};

	if (disabled) {
		_style.cursor = "not-allowed";
	}

	return (
		<div
			className={classNames("solid-elem", "solid-input-text", className)}
			style={_style}
		>
			<input
				type="text"
				inputMode="text"
				value={stateValue}
				style={{ width: `${inputWidth}%` }}
				onChange={handleChange}
				disabled={disabled}
			/>
		</div>
	);
}

export default InputText;
