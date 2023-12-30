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
import { RouteObject } from "react-router-dom";
import DefaultLayout from "@/layouts/DefaultLayout";
import Home from "@/pages/Home/Home";
import DataSourceList from "@/pages/DataSource/DataSourceList";
import Preview from "@/pages/Designer/Preview";
import ProjectList from "../pages/Project/ProjectList";
import Dashboard from "../pages/Designer/Designer";
import KeysManager from "../pages/KeysManager/KeysManager";
import Login from "../pages/Login/Login";

const routes: RouteObject[] = [
	{
		path: "/",
		element: <DefaultLayout />,
		children: [
			{
				path: "/",
				element: <Home />,
			},
			{
				path: "/project",
				element: <ProjectList />,
			},
			{
				path: "/datasource",
				element: <DataSourceList />,
			},
			{
				path: "/key",
				element: <KeysManager />,
			},
		],
	},
	{
		path: "/login",
		element: <Login />,
	},
	{
		path: "/dashboard/:id",
		element: <Dashboard />,
	},
	{
		path: "/preview/:id",
		element: <Preview />,
	},
];

export default routes;
