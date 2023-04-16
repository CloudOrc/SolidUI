import React, { useState } from "react";
import "./ButtonGroupRadio.less";

export interface ButtonGroupRadioProps {
	items: any[];
	value?: any;
	onChange?: (value: any) => void;
}

export default function (props: ButtonGroupRadioProps) {
	const [value, setValue] = useState(props.value);

	function renderItems() {
		return props.items.map((item) => {
			return (
				<label className="group-choose-btn" key={`key_${item.value}`}>
					<input
						type="radio"
						value={item.value}
						checked={value === item.value}
						onChange={(e) => {
							setValue(e.target.value);
							item.onChange && item.onChange(e.target.value);
						}}
					/>
					<span className="group-choose-text">{item.text}</span>
				</label>
			);
		});
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
