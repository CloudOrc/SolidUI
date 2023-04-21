import React, { useState } from "react";
import "./Switch.less";

export interface SwitchProps {
	checked?: boolean;

	onChange?: (checked: boolean) => void;
}

export default function (props: SwitchProps) {
	const [checked, setChecked] = useState(!!props.checked);

	return (
		<div className="lingc-switch">
			<div className="switch-box">
				<span
					className={`switch-span ${checked ? "on" : "off"}`}
					onClick={() => {
						setChecked(!checked);
						props.onChange && props.onChange(!checked);
					}}
				></span>
			</div>
		</div>
	);
}
