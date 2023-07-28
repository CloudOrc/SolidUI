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

import React, { useEffect, useState } from "react";
import "./InputTextArea.less";

export interface InputTextareaProps {
	className?: string;
	style?: React.CSSProperties;
	height?: number;
	placeholder?: string;
	value?: string;
	onChange?: (value: string) => void;
}

export default function InputTextArea(props: InputTextareaProps) {
	const [value, setValue] = useState(props.value || "");
	const _style: React.CSSProperties = {
		padding: "2px 4px",
		border: "1px solid rgba(0, 0, 0, 0.45)",
		...props.style,
	};

	useEffect(() => {
		setValue(props.value || "");
	}, [props.value]);

	return (
		<textarea
			className="solid-textarea"
			style={_style}
			value={value}
			placeholder={props.placeholder || ""}
			onChange={(e) => {
				const mValue = e.target.value || "";
				setValue(mValue);
				if (props.onChange) {
					props.onChange(mValue);
				}
			}}
		/>
	);
}
