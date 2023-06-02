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

import React from "react";
import { Button } from "antd";
import { eventbus, mm } from "@/utils/index";
import Apis from "@/apis";
import "./header.less";

function Header() {
	return (
		<header className="header">
			<div className="header-main">
				<div className="header-left">
					<div className="logo"></div>
					<div className="logo-text">SolidUI</div>
					<div className="version">v0.1.0</div>
					<div className="split-line"></div>
					<div className="left-main">
						<Button
							type="primary"
							size="small"
							onClick={() => {
								eventbus.emit("onDraw", {
									viewType: "echarts_bar",
								});
							}}
						>
							Bar
						</Button>
					</div>
				</div>
				<div className="header-center"></div>
				<div className="header-right">
					<Button
						type="primary"
						size="small"
						onClick={async () => {
							let model = mm.getPrepareSavingModel();
							console.log(model);
							console.log(JSON.stringify(model));

							let result = await Apis.model.save(model!);
							if (result.ok) {
								//// mock
								localStorage.setItem("__MODEL__", JSON.stringify(model));
							}
						}}
					>
						Save
					</Button>
				</div>
			</div>
		</header>
	);
}

export default Header;
