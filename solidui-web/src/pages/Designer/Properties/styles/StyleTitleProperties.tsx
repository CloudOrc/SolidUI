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
import { useUpdate } from "react-use";
import { set, get, cloneDeep } from "lodash-es";
import {
	LeftRightExpander,
	PropertyElement,
	Switch,
	InputNumber,
	InputTextArea,
	InputColor,
	ButtonGroupRadio,
	Select,
} from "@/components";
import { eventbus, mm } from "@/utils";

function getPropertyValue(propertyKey: string) {
	const view = mm.getCurrentView();
	if (view) {
		return get(view, propertyKey);
	}
	return undefined;
}

function updateViewAndEmitEvent(
	propertyKey: string,
	propertyValue: any,
): Promise<any> {
	let view = mm.getCurrentView();
	if (view) {
		const clonedView = cloneDeep(view);
		set(clonedView, propertyKey, propertyValue);
		view = clonedView;
		eventbus.emit("onUpdateViewPropertyValue", {
			id: view.id,
			property: propertyKey,
			value: propertyValue,
		});
	}
	return Promise.resolve();
}

export default function StyleTitleProperties() {
	const forceUpdate = useUpdate();
	return (
		<LeftRightExpander
			expanded
			checked={getPropertyValue("options.title.show")}
			onChecked={(checked) => {
				updateViewAndEmitEvent("options.title.show", checked).then(() => {
					forceUpdate();
				});
			}}
		>
			<PropertyElement
				label="Title"
				labelWidth={120}
				labelStyle={{
					alignItems: "baseline",
				}}
				height={80}
			>
				<InputTextArea
					placeholder="please enter title..."
					style={{
						height: 80,
						minHeight: 80,
						maxHeight: 80,
					}}
					value={getPropertyValue("options.title.text")}
					onChange={(value) => {
						updateViewAndEmitEvent("options.title.text", value).then(() => {
							forceUpdate();
						});
					}}
				/>
			</PropertyElement>
			<PropertyElement label="Font Family" labelWidth={120}>
				<Select
					showSearch={false}
					value="Tahoma"
					items={[
						{
							label: "Arial",
							value: "Arial",
						},
						{
							label: "Tahoma",
							value: "Tahoma",
						},
					]}
				/>
			</PropertyElement>

			<PropertyElement label="Frontend Color" labelWidth={120}>
				<InputColor
					value={getPropertyValue("options.title.style.color")}
					onChange={(value) => {
						updateViewAndEmitEvent("options.title.style.color", value).then(
							() => {
								forceUpdate();
							},
						);
					}}
				/>
			</PropertyElement>

			<PropertyElement label="Backgroud Color" labelWidth={120}>
				<InputColor
					value={getPropertyValue("options.title.style.backgroundColor")}
					onChange={(value) => {
						updateViewAndEmitEvent(
							"options.title.style.backgroundColor",
							value,
						).then(() => {
							forceUpdate();
						});
					}}
				/>
			</PropertyElement>

			<PropertyElement label="Font Size" labelWidth={120}>
				<InputNumber step={1} min={12} max={64} value={16} />
			</PropertyElement>

			<PropertyElement label="Text Align" labelWidth={120}>
				<ButtonGroupRadio
					value="center"
					items={[
						{
							text: "Left",
							value: "left",
						},
						{
							text: "Center",
							value: "center",
						},
						{
							text: "Right",
							value: "right",
						},
					]}
				/>
			</PropertyElement>

			<PropertyElement
				label="Show Icon"
				labelWidth={120}
				inputStyle={{
					justifyContent: "flex-start",
					paddingLeft: 2,
				}}
			>
				<Switch checked={false} />
			</PropertyElement>
		</LeftRightExpander>
	);
}
