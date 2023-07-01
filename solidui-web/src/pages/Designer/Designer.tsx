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
import { eventbus, mm } from "@/utils";
import Apis from "@/apis";
import { ProjectDataType } from "@/apis/types/resp";
import { ApiResult, ProjectPageDataType, SolidScenaDataType } from "@/types";
import Header from "./Header/Header";
import Aside from "./Aside/Aside";
import Scena from "./Scena/Scena";
import Properties from "./Properties/Properties";
import "../../assets/styles/designer.less";

function Dashboard() {
	const params = useParams();
	const { id } = params;

	React.useEffect(() => {
		load();
	}, []);

	async function load() {
		const res: ApiResult<ProjectPageDataType[]> = await Apis.model.queryPages(
			id || "",
		);
		if (res.ok) {
			const data = res.data || [];
			const scenes: SolidScenaDataType[] = [];
			if (data.length > 0) {
				for (let i = 0; i < data.length; i++) {
					const scene: SolidScenaDataType & { open?: boolean; pages: any[] } = {
						id: data[i].id,
						parentId: data[i].parentId,
						title: data[i].name,
						pages: [],
						open: false,
					};
					if (data[i].children) {
						for (let j = 0; j < data[i].children.length; j++) {
							scene.pages.push({
								id: data[i].children[j].id,
								parentId: data[i].children[j].parentId,
								title: data[i].children[j].name,
								views: [],
							});
						}
					}
					scenes.push(scene);
				}
			}

			const res2: ApiResult<ProjectDataType> = await Apis.project.load(
				id || "",
			);
			if (res2.ok) {
				const mData = res2.data;
				const model = {
					id: id || "",
					title: mData?.projectName || "",
					description: mData?.description || "",
					createUser: mData?.userName || "",
					createTime: mData?.createTime || "",
					scenas: scenes,
					size: { width: 0, height: 0 },
					frame: {},
					style: {},
				};
				mm.attach(model);
				eventbus.emit("onModelLoad", { model });
			}
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
