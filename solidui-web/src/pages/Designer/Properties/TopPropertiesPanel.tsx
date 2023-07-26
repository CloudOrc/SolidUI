// /*
//  * Licensed to the Apache Software Foundation (ASF) under one or more
//  * contributor license agreements.  See the NOTICE file distributed with
//  * this work for additional information regarding copyright ownership.
//  * The ASF licenses this file to You under the Apache License, Version 2.0
//  * (the "License"); you may not use this file except in compliance with
//  * the License.  You may obtain a copy of the License at
//  *
//  *    http://www.apache.org/licenses/LICENSE-2.0
//  *
//  * Unless required by applicable law or agreed to in writing, software
//  * distributed under the License is distributed on an "AS IS" BASIS,
//  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//  * See the License for the specific language governing permissions and
//  * limitations under the License.
//  */

// import React from "react";
// import { LeftRightExpander, PropertyElement, InputText } from "@/components";
// import { mm } from "@/utils";

// export default function TopPropertiesPanel() {
// 	const project = mm.getModel();
// 	return (
// 		<LeftRightExpander expanded showCheckbox={false} title="Project Infos">
// 			<PropertyElement label="Title" labelWidth={80}>
// 				<InputText value={project?.title || ""} disabled />
// 			</PropertyElement>

// 			<PropertyElement label="Description" labelWidth={80}>
// 				<InputText value={project?.description || ""} disabled />
// 			</PropertyElement>

// 			<PropertyElement label="Create User" labelWidth={80}>
// 				<InputText value={project?.createUser || ""} disabled />
// 			</PropertyElement>

// 			<PropertyElement label="Create Time" labelWidth={80}>
// 				<InputText value={project?.createTime || ""} disabled />
// 			</PropertyElement>
// 		</LeftRightExpander>
// 	);
// }
