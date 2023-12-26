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
import { useCookie } from "react-use";
import type { MenuProps } from "antd";
import { DesktopOutlined, PieChartOutlined,KeyOutlined } from "@ant-design/icons";
import { Menu, Dropdown, Avatar } from "antd";
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
	getItem("Project", "/project", <PieChartOutlined rev={1} />),
	getItem("Datasource", "/datasource", <DesktopOutlined rev={1} />),
	getItem("KeysManager", "/key", <KeyOutlined rev={1} />),
];

export default function DefaultLayout() {
	const navigate = useNavigate();
	const location = useLocation();
	const [value, deleteCookie] = useCookie("solidui_user_session_ticket_id_v1");

	const [selectKeys, setSelectKeys] = useState<string[]>(["home"]);
	// const [collapse, setCollapse] = useState<boolean>(false);

	useEffect(() => {
		if (value === null || undefined === value || value === "") {
			navigate("/login");
			return;
		}
		const { pathname } = location;
		setSelectKeys([pathname]);
		// return () => {};
	}, [location, navigate, value]);

	async function handleMenuClick(item: any) {
		const { key } = item;
		setSelectKeys([key]);
		navigate(key);
	}
	const vars: Record<string, any> = {};
	Object.keys(process.env).forEach((key) => {
		vars[key] = process.env[key];
	});

	return (
		<div className="solidui-layout default">
			<header className="solidui-header">
				<div
					className="header-main"
					style={{
						right: 0,
					}}
				>
					<div
						className="header-left"
						onClick={() => {
							navigate("/");
						}}
						style={{
							cursor: "pointer",
						}}
					>
						<div className="logo" />
						<div className="logo-text">{vars.APP_NAME}</div>
						<div className="version">v{vars.APP_VERSION}</div>
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
									const res = await Apis.user.logout();
									if (res.ok) {
										deleteCookie("");
										navigate("/login");
									}
								},
							}}
							placement="bottom"
						>
							<Avatar
								style={{
									backgroundColor: "#0070cc",
									verticalAlign: "middle",
									cursor: "pointer",
									paddingLeft: 30,
									paddingRight: 30,
									borderRadius: 30,
								}}
								shape="square"
								size="default"
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
						inlineCollapsed={false}
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
