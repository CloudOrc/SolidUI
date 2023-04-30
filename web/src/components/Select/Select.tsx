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

export default function (props: SelectProps) {
	let { value, items = [], showSearch } = props;

	function renderOptions() {
		let nodes: React.ReactNode[] = [];
		items.forEach((item, index) => {
			let { value, label } = item;
			nodes.push(
				<Select.Option
					key={index}
					value={value}
					className="solid-select__option"
				>
					<div className="select-option__item">{label}</div>
				</Select.Option>
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
