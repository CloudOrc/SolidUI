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
import { Pic } from "@icon-park/react";
import {
	LeftRightExpander,
	PropertyElement,
	Switch,
	// Slider,
	InputNumber,
	InputText,
	InputTextArea,
	InputColor,
	ButtonGroupRadio,
	InputUpload,
	Select,
} from "@/components";

export interface StyleBasicPropertiesProps {
	className?: string;
	style?: React.CSSProperties;
	expanded?: boolean;
}

export default function StyleBasicProperties(props: StyleBasicPropertiesProps) {
	const { className, style, expanded = false } = props;

	return (
		<LeftRightExpander
			title="Basic"
			expanded={expanded}
			className={className}
			style={style}
		>
			<PropertyElement label="布局方式">input element</PropertyElement>
			<PropertyElement label="Switch">
				<Switch checked={false} />
			</PropertyElement>
			<PropertyElement label="ButtonGroupRadio" labelWidth={120}>
				<ButtonGroupRadio
					value="horizontal"
					items={[
						{
							text: "水平",
							value: "horizontal",
						},
						{
							text: "垂直",
							value: "vertical",
						},
					]}
				/>
			</PropertyElement>
			<PropertyElement label="InputNumber" labelWidth={120}>
				<InputNumber step={1} min={1} max={100} value={20} />
			</PropertyElement>

			<PropertyElement label="InputText" labelWidth={120}>
				<InputText value="some text..." />
			</PropertyElement>

			<PropertyElement label="InputColor" labelWidth={120}>
				<InputColor />
			</PropertyElement>

			<PropertyElement label="InputUpload" labelWidth={120}>
				<InputUpload>
					<Pic
						theme="outline"
						size="20"
						fill="#757272"
						strokeWidth={2}
						strokeLinejoin="miter"
						strokeLinecap="square"
						style={{
							display: "flex",
							alignItems: "center",
							cursor: "pointer",
						}}
					/>
				</InputUpload>
			</PropertyElement>

			<PropertyElement label="Select" labelWidth={120}>
				<Select
					value="1"
					items={[
						{
							label: "option A",
							value: "1",
							displayLabel: "Option A",
						},
						{
							label: "option B",
							value: "2",
							displayLabel: "Option B",
						},
					]}
				/>
			</PropertyElement>

			<PropertyElement
				label="Input TextArea"
				labelWidth={120}
				labelStyle={{
					alignItems: "baseline",
				}}
				height={80}
			>
				<InputTextArea
					style={{
						height: 80,
						minHeight: 80,
						maxHeight: 80,
					}}
				/>
			</PropertyElement>
		</LeftRightExpander>
	);
}
