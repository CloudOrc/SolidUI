import React from "react";
import StyleTitleProperties from "./styles/StyleTitleProperties";
import StyleBasicProperties from "./styles/StyleBasicProperties";

export interface StylePropertiesPanelProps {}

export default function (props: StylePropertiesPanelProps) {
	return (
		<>
			<StyleTitleProperties />
			<StyleBasicProperties
				style={{
					top: "-1px",
				}}
			/>
		</>
	);
}
