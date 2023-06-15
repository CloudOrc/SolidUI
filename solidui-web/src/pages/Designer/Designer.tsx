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
import { useParams } from "react-router-dom";
import Header from "./Header/Header";
import Aside from "./Aside/Aside";
import Scena from "./Scena/Scena";
import Properties from "./Properties/Properties";
import { eventbus, mm } from "@/utils";
import Apis from "@/apis";
import "../../assets/styles/designer.less";
import { ApiResult, ProjectPageDataType, SolidScenaDataType } from "@/types";

function Dashboard() {
	const params = useParams();
	let { id } = params;

	React.useEffect(() => {
		// let modelStr = localStorage.getItem("__MODEL__");
		// if (
		// 	undefined === modelStr ||
		// 	null === modelStr ||
		// 	"undefined" === modelStr
		// ) {
		// 	modelStr = "{}";
		// }
		// let model = JSON.parse(modelStr);
		// mm.attach(model);
		// eventbus.emit("onModelLoad", { model });
		load();
	}, []);

	async function load() {
		let res: ApiResult<ProjectPageDataType[]> = await Apis.model.queryPages(
			id || "",
		);
		if (res.ok) {
			let data = res.data || [];
			let scenes: SolidScenaDataType[] = [];
			if (data.length > 0) {
				for (let i = 0; i < data.length; i++) {
					let scene: SolidScenaDataType & { open?: boolean; pages: any[] } = {
						id: data[i].id,
						title: data[i].name,
						pages: [],
						open: false,
					};
					if (data[i].children) {
						for (let j = 0; j < data[i].children.length; j++) {
							scene.pages.push({
								id: data[i].children[j].id,
								title: data[i].children[j].name,
								views: [],
							});
						}
					}
					scenes.push(scene);
				}
			}
			const model = {
				id: id || "",
				title: "project",
				scenas: scenes,
				size: { width: 1920, height: 1080 },
				frame: {},
				style: {},
			};

			mm.attach(model);
			eventbus.emit("onModelLoad", { model });
		}
	}

	return (
		<div id="dashboard">
			<Header />
			<Aside />
			<Scena />
			<Properties />
		</div>
	);
}

export default Dashboard;
