import React, { useEffect, useState } from "react";
import "./InputTextArea.less";

export interface InputTextareaProps {
	className?: string;
	style?: React.CSSProperties;
	height?: number;
	placeholder?: string;
	value?: string;
	onChange?: (value: string) => void;
}

export default function (props: InputTextareaProps) {
	const [value, setValue] = useState(props.value || "");
	let _style: React.CSSProperties = {
		padding: "2px 4px",
		border: "1px solid rgba(0, 0, 0, 0.45)",
		...props.style,
	};

	useEffect(() => {
		setValue(props.value || "");
	}, [props.value]);

	return (
		<textarea
			className="solid-textarea"
			style={_style}
			value={value}
			onChange={(e) => {
				let value = e.target.value || "";
				setValue(value);
				props.onChange && props.onChange(value);
			}}
		/>
	);
}
