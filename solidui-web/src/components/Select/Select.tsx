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
import Select, { SelectProps as RcSelectProps } from "rc-select";
import "rc-select/assets/index.less";
import "./Select.less";

export interface SelectProps extends Pick<RcSelectProps, "showSearch"> {
	className?: string;
	style?: React.CSSProperties;
	value?: any;
	items?: any[];
}

export default function SolidSelect(props: SelectProps) {
	const { value, items = [], showSearch } = props;

	function renderOptions() {
		const nodes: React.ReactNode[] = [];
		items.forEach((item) => {
			const { value: mValue, label } = item;
			nodes.push(
				<Select.Option
					// key={index}
					key={item.key}
					value={mValue}
					className="solid-select__option"
				>
					<div className="select-option__item">{label}</div>
				</Select.Option>,
			);
		});
		return nodes;
	}

	function renderDropdown(menu) {
		return <div className="solid-select__dropdown">{menu}</div>;
	}

	return (
		<Select
			className="solid-select"
			value={value}
			showSearch={showSearch}
			// showArrow
			// allowClear
			// @ts-ignore
			// multiple={false}
			dropdownStyle={{
				zIndex: 200,
				borderColor: "rgba(0, 0, 0, 0.25)",
			}}
			dropdownRender={renderDropdown}
			// optionLabelProp="displayLabel"
			// labelInValue={true}
			// loading={true}
			clearIcon
		>
			{renderOptions()}
		</Select>
	);
}
