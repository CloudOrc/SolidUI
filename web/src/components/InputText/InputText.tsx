import * as React from "react";
import { useState, useEffect } from "react";
import classNames from "classnames";
import "./InputText.less";

export interface DatStringProps {
	className?: string;
	style?: React.CSSProperties;
	value?: string;
	onChange?: (value: string) => void;
}

function DatString({ className, style, value = "", onChange }: DatStringProps) {
	const [stateValue, setStateValue] = useState(value);

	useEffect(() => {
		setStateValue(value);
	}, [value]);

	function update(value: string) {
		setStateValue(value);
		onChange && onChange(value);
	}

	function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
		update(event.target.value);
	}

	const inputWidth = 100;

	let _style: React.CSSProperties = {
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		width: "100%",
		...style,
	};

	return (
		<div
			className={classNames("solid-elem", "solid-input-text", className)}
			style={_style}
		>
			<input
				type="text"
				inputMode="text"
				value={stateValue}
				style={{ width: `${inputWidth}%` }}
				onChange={handleChange}
			/>
		</div>
	);
}

export default DatString;
