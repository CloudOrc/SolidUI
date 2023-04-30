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
import { Pic } from "@icon-park/react";

export interface StyleBasicPropertiesProps {
	className?: string;
	style?: React.CSSProperties;
	expanded?: boolean;
}

export default function (props: StyleBasicPropertiesProps) {
	let { className, style, expanded = false } = props;

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
					value={"horizontal"}
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
				<InputText value={"some text..."} />
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
					value={"1"}
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
