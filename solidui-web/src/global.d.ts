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

// 这里要使用 global 关键字，因为文件中使用了import语句所以此文件会被认为是一个模块，在模块中使用 declare 声明默认并不是全局的
// 反之如果没有使用import语句就不会被识别为模块文件，则使用 declare global 和 declare 是没有区别的
declare global {
	declare module "*.css";
	declare module "*.less";
	declare module "*.png";
	declare module "*.svg?asset";
	declare module "*.svg" {
		export default function ReactComponent(
			props: React.SVGProps<SVGSVGElement>,
		): React.ReactElement;
	}
}
