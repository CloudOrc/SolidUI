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
import { Menu, Dropdown, Button, Avatar } from "antd";
import Apis from "@/apis";
import "./DefaultLayout.less";

type MenuItem = Required<MenuProps>["items"][number];

function getItem(
	label: React.ReactNode,
	key: React.Key,
	icon?: React.ReactNode,
	children?: MenuItem[],
	type?: "group",
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

export interface DefaultLayoutProps {}

export default function () {
	const navigate = useNavigate();
	const location = useLocation();

	const [selectKeys, setSelectKeys] = useState<string[]>(["home"]);
	const [collapse, setCollapse] = useState<boolean>(false);

	useEffect(() => {
		let { pathname } = location;
		setSelectKeys([pathname]);
		return () => {};
	}, []);

	async function handleMenuClick(item: any) {
		let { key } = item;
		setSelectKeys([key]);
		navigate(key);
	}

	return (
		<div className="solidui-layout default">
			<header className="solidui-header">
				<div
  className="header-main"
  style={{
						right: 0,
					}}
				>
					<div className="header-left">
						<div className="logo" />
						<div className="logo-text">SolidUI</div>
						<div className="version">v0.1.0</div>
					</div>
					<div
  className="header-right"
  style={{
							right: 20,
							width: "auto",
						}}
					>
						<Dropdown
  menu={{
								items: [
									{
										key: "logout",
										label: <div>logout</div>,
									},
								],
								style: {
									width: 100,
								},
								onClick: async () => {
									let res = await Apis.user.logout();
									if (res.ok) {
										navigate("/login");
									}
									console.log(res);
								},
							}}
  placement="bottom"
						>
							<Avatar
  style={{
									backgroundColor: "#0070cc",
									verticalAlign: "middle",
									cursor: "pointer",
								}}
  shape="square"
  size="large"
							>
								admin
							</Avatar>
						</Dropdown>
					</div>
				</div>
			</header>
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
