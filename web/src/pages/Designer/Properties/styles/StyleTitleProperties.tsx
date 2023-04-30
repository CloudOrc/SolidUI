import React from "react";
import {
	LeftRightExpander,
	PropertyElement,
	Switch,
	Slider,
	InputNumber,
	InputText,
	InputTextArea,
	InputColor,
	ButtonGroupRadio,
	InputUpload,
	Select,
} from "@/components";
import { useUpdate } from "react-use";
import { eventbus, mm } from "@/utils";
import { set, get } from "lodash-es";

export interface TitleStylePropertiesProps {}

function getPropertyValue(propertyKey: string) {
	let view = mm.getCurrentView();
	if (view) {
		return get(view, propertyKey);
	}
	return undefined;
}

function updateViewAndEmitEvent(
	propertyKey: string,
	propertyValue: any
): Promise<any> {
	let view = mm.getCurrentView();
	if (view) {
		set(view, propertyKey, propertyValue);
		eventbus.emit("onUpdateViewPropertyValue", {
			id: view.id,
			property: propertyKey,
			value: propertyValue,
		});
	}
	return Promise.resolve();
}

export default function (props: TitleStylePropertiesProps) {
	const forceUpdate = useUpdate();
	return (
		<LeftRightExpander
			expanded={true}
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
					value={"Tahoma"}
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

			<PropertyElement label="Font Color" labelWidth={120}>
				<InputColor />
			</PropertyElement>

			<PropertyElement label="Font Size" labelWidth={120}>
				<InputNumber step={1} min={12} max={64} value={16} />
			</PropertyElement>

			<PropertyElement label="Text Align" labelWidth={120}>
				<ButtonGroupRadio
					value={"center"}
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
