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

import React, { useEffect, useState } from "react";
import classNames from "classnames";
import { Down, Right } from "@icon-park/react";
import Checkbox from "../Checkbox";

import "./LeftRightExpander.less";

export interface LeftRgithExpanderProps {
	className?: string;
	style?: React.CSSProperties;
	children: any;
	title?: string;
	expanded?: boolean;
	showCheckbox?: boolean;
	checked?: boolean;
	onChange?: (expanded: boolean) => void;
	onChecked?: (checked: boolean) => void;
}

export default function LeftRightExpander(props: LeftRgithExpanderProps) {
	const { className, style, title = "Title" } = props;
	const [expanded, setExpanded] = useState(!!props.expanded);
	const [checked, setChecked] = useState(!!props.checked);
	const { showCheckbox = true } = props;

	useEffect(() => {
		setChecked(!!props.checked);
	}, [props.checked]);

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
		}
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

	function renderPopupview() {
		if (expanded) {
			return (
				<div className="solid-expander__popupview">
					<div className="solid-expander__popupview">{props.children}</div>
				</div>
			);
		}
		return undefined;
	}

	function handleClick() {
		setExpanded(!expanded);

		if (props.onChange) {
			props.onChange(!expanded);
		}
	}

	const _className = classNames("solid-expander", className, {
		"solid-expander--expanded": expanded,
	});

	return (
		// <div className="solid-expander">
		<div className={_className} style={style}>
			<div
				className="solid-expander__node left-right-nodes clearfix cursor-pointer"
				onClick={handleClick}
			>
				<div className="flex-horizontal-layout v-middle h-left left-node">
					<div className="flex-center-adapt-layout node-btn">
						{renderArrowIcon()}
					</div>
					<div className="node-text">{title}</div>
				</div>
				{showCheckbox ? (
					<div className="flex-horizontal-layout v-middle h-right right-node">
						<div className="node-text" />
						<Checkbox
							checked={checked}
							onChange={(mChecked) => {
								setChecked(mChecked);
								if (props.onChecked) {
									props.onChecked(mChecked);
								}
							}}
							style={{
								marginLeft: 8,
								marginRight: 5,
							}}
						/>
					</div>
				) : undefined}
			</div>
			{renderPopupview()}
		</div>
	);
}
