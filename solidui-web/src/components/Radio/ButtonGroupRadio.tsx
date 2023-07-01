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

import React, { useState } from "react";
import "./ButtonGroupRadio.less";

export interface ButtonGroupRadioProps {
	items: any[];
	value?: any;
	onChange?: (value: any) => void;
}

export default function ButtonGroupRadio(props: ButtonGroupRadioProps) {
	const [value, setValue] = useState(props.value);

	function renderItems() {
		return props.items.map((item) => (
			<label className="group-choose-btn" key={`key_${item.value}`}>
				<input
					type="radio"
					value={item.value}
					checked={value === item.value}
					onChange={(e) => {
						setValue(e.target.value);
						if (item.onChange) {
							item.onChange(e.target.value);
						}
					}}
				/>
				<span className="group-choose-text">{item.text}</span>
			</label>
		));
	}

	return (
		<div
			className="group-choose"
			style={{
				width: 178,
			}}
		>
			{renderItems()}
			{/* <label className="group-choose-btn">
				<input
					type="radio"
					value="horizontal"
					checked={direction === "horizontal"}
					onChange={(e) => {
						setDirection(e.target.value);
					}}
				/>
				<span className="group-choose-text">水平</span>
			</label>
			<label className="group-choose-btn">
				<input
					type="radio"
					value="vertical"
					checked={direction === "vertical"}
					onChange={(e) => {
						setDirection(e.target.value);
					}}
				/>
				<span className="group-choose-text">垂直</span>
			</label> */}
		</div>
	);
}
