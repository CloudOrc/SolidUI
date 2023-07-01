/*
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import * as React from "react";
import { EditableInput } from "react-color/lib/components/common";
// @ts-ignore
import color from "react-color/lib/helpers/color";

export interface ColorPickerFieldsProps {
	onChange?: (
		{ value, source }: any,
		event: React.ChangeEvent<HTMLInputElement>,
	) => void;
	hex?: string;
}

function ColorPickerFields({ hex, onChange }: ColorPickerFieldsProps) {
	function handleChange(
		value: any,
		event: React.ChangeEvent<HTMLInputElement>,
	) {
		if (color.isValidHex(value)) {
			if (onChange) {
				onChange(
					{
						hex: value,
						source: "hex",
					},
					event,
				);
			}
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
