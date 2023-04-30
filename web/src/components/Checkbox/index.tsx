import React, { useEffect } from "react";
import classNames from "classnames";

import "./index.less";

interface CheckboxProps {
	className?: string;
	style: React.CSSProperties;
	checked?: boolean;

	onChange?: (checked: boolean) => void;
}

export default function (props: CheckboxProps) {
	const [checked, setChecked] = React.useState(!!props.checked);

	let _classNames = classNames(
		{
			"solid-checkbox": true,
			"cursor-pointer": true,
			active: checked,
		},
		props.className
	);

	useEffect(() => {
		setChecked(!!props.checked);
	}, [props.checked]);

	function handleChecked(e: React.MouseEvent<HTMLDivElement>) {
		e.stopPropagation();
		e.preventDefault();
		setChecked(!checked);

		if (props.onChange) {
			props.onChange(!checked);
		}
	}

	return (
		<div className={_classNames} onClick={handleChecked} style={props.style}>
			<div className="solid-checkbox__main"></div>
		</div>
	);
}
