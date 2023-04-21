import React from "react";
import classNames from "classnames";

export interface PropertyElementProps {
	className?: string;
	style?: React.CSSProperties;

	height?: number;
	labelWidth?: number;
	label?: string;
	children?: React.ReactNode;
}

export default function (props: PropertyElementProps) {
	let {
		className,
		style,
		height = 40,
		labelWidth = 70,
		label,
		children,
	} = props;

	let _style: React.CSSProperties = {
		height: height,
		margin: "0 25px",
		...style,
	};

	let labelStyle: React.CSSProperties = {
		position: "absolute",
		top: 0,
		left: 0,
		width: labelWidth,
		bottom: 0,
		overflow: "hidden",
	};

	let inputStyle: React.CSSProperties = {
		position: "absolute",
		top: 0,
		left: labelWidth,
		right: 0,
		bottom: 0,
		overflow: "hidden",
	};

	let _className = classNames(
		{
			"property-element": true,
			// ["h-tape-layout"]: true,
			["relative"]: true,
		},
		className
	);

	return (
		<div className={_className} style={_style}>
			<div
				className="solid-label flex-horizontal-layout v-middle"
				style={labelStyle}
			>
				<div className="solid-text">{label}</div>
			</div>
			<div className="flex-center-adapt-layout" style={inputStyle}>
				{children}
			</div>
		</div>
	);
}
