import * as React from "react";
import { EditableInput } from "react-color/lib/components/common";
// @ts-ignore
import color from "react-color/lib/helpers/color";

export interface ColorPickerFieldsProps {
	onChange?: (
		{ value, source }: any,
		event: React.ChangeEvent<HTMLInputElement>
	) => void;
	hex?: string;
}

function ColorPickerFields({ hex, onChange }: ColorPickerFieldsProps) {
	function handleChange(
		value: any,
		event: React.ChangeEvent<HTMLInputElement>
	) {
		if (color.isValidHex(value)) {
			onChange &&
				onChange(
					{
						hex: value,
						source: "hex",
					},
					event
				);
		}
	}

	return (
		<div className="flexbox-fix fields-wrap">
			<div className="flexbox-fix fields">
				<div className="field">
					<EditableInput value={hex} onChange={handleChange} />
				</div>
			</div>
		</div>
	);
}

export default ColorPickerFields;
