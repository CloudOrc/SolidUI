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

import React, { useEffect } from "react";
import classNames from "classnames";

import "./index.less";

interface CheckboxProps {
	className?: string;
	style: React.CSSProperties;
	checked?: boolean;

	onChange?: (checked: boolean) => void;
}

export default function CHeckbox(props: CheckboxProps) {
	const [checked, setChecked] = React.useState(!!props.checked);

	const _classNames = classNames(
		{
			"solid-checkbox": true,
			"cursor-pointer": true,
			active: checked,
		},
		props.className,
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
			<div className="solid-checkbox__main" />
		</div>
	);
}
