import React, { useState } from "react";
import Checkbox from "../Checkbox";
import { Down, Right } from "@icon-park/react";

import "./LeftRightExpander.less";

export interface LeftRgithExpanderProps {
	children: any;

	expanded?: boolean;
	onChange?: (expanded: boolean) => void;
}

export default function (props: LeftRgithExpanderProps) {
	const [expanded, setExpanded] = useState(!!props.expanded);

	function renderArrowIcon() {
		if (expanded) {
			return (
				<Down
					theme="outline"
					size="20"
					fill="#757272"
					strokeWidth={3}
					strokeLinejoin="miter"
					strokeLinecap="square"
					style={{
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
					}}
				/>
			);
		} else {
			return (
				<Right
					theme="outline"
					size="20"
					fill="#757272"
					strokeWidth={2}
					strokeLinejoin="miter"
					strokeLinecap="square"
					style={{
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						marginTop: -1,
					}}
				/>
			);
		}
	}

	function renderPopupview() {
		if (expanded) {
			return <div className="solid-expander__popupview">{props.children}</div>;
		}
	}

	function handleClick() {
		setExpanded(!expanded);

		if (props.onChange) {
			props.onChange(!expanded);
		}
	}

	return (
		<div className="solid-expander">
			<div
				className="solid-expander__node left-right-nodes clearfix cursor-pointer"
				onClick={handleClick}
			>
				<div className="flex-horizontal-layout v-middle h-left left-node">
					<div className="flex-center-adapt-layout node-btn">
						{renderArrowIcon()}
					</div>
					<div className="node-text">Title</div>
				</div>
				<div className="flex-horizontal-layout v-middle h-right right-node">
					<div className="node-text">Display</div>
					<Checkbox
						checked
						onChange={(checked) => {
							console.log(checked);
						}}
						style={{
							marginLeft: 8,
							marginRight: 5,
						}}
					/>
				</div>
			</div>
			<div className="solid-expander__popupview">{renderPopupview()}</div>
		</div>
	);
}
