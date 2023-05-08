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

import React, { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import type { MenuProps } from "antd";
import { DesktopOutlined, PieChartOutlined } from "@ant-design/icons";
import { Menu } from "antd";
import "./DefaultLayout.less";

type MenuItem = Required<MenuProps>["items"][number];

export interface DefaultLayoutProps {}

function getItem(
	label: React.ReactNode,
	key: React.Key,
	icon?: React.ReactNode,
	children?: MenuItem[],
	type?: "group"
): MenuItem {
	return {
		key,
		icon,
		children,
		label,
		type,
	} as MenuItem;
}

const items: MenuItem[] = [
	getItem("Project", "/project", <PieChartOutlined />),
	getItem("Datasource", "/datasource", <DesktopOutlined />),
];

export default function () {
	const navigate = useNavigate();
	const location = useLocation();

	const [selectKeys, setSelectKeys] = useState<string[]>(["home"]);
	const [collapse, setCollapse] = useState<boolean>(false);

	useEffect(() => {
		let pathname = location.pathname;
		setSelectKeys([pathname]);
		return () => {};
	}, []);

	async function handleMenuClick(item: any) {
		let key = item.key;
		setSelectKeys([key]);
		navigate(key);
	}

	return (
		<div className="solidui-layout default">
			<header className="solidui-header">header</header>
			<section className="solidui-bottom">
				<aside className="solidui-aside">
					<Menu
						selectedKeys={selectKeys}
						mode="inline"
						theme="light"
						style={{
							height: "100%",
						}}
						inlineCollapsed={collapse}
						items={items}
						onClick={handleMenuClick}
					/>
				</aside>

				<section className="solidui-main">
					<Outlet />
				</section>
			</section>
		</div>
	);
}
