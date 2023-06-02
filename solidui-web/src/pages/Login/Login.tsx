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
import { useNavigate } from "react-router-dom";
import { Row, Col, Form, Input, Button, Tag } from "antd";
import {
	EyeOutlined,
	EyeTwoTone,
	EyeInvisibleOutlined,
} from "@ant-design/icons";
import Apis from "@/apis";
import LogoPng from "@/assets/images/logo.png";

import "./login.less";

export default function () {
	const navigate = useNavigate();

	async function handleLogin(values: { username: string; password: string }) {
		let res = await Apis.user.login(values);
		if (res.ok) {
			navigate("/project");
		}
	}

	return (
		<div className="solidui-login">
			<div className="login-bg" />
			<div className="login-main">
				<div className="login-container">
					<div className="login-title">
						<img
							className="logo"
							src={LogoPng}
							alt="SolidUI"
							width={55}
							height={55}
						/>
						<h3 className="text">SolidUI</h3>
					</div>
					<div className="login-form">
						<Form
							name="basic"
							initialValues={{
								username: "admin",
								password: "",
							}}
							onFinish={handleLogin}
							// onFinishFailed={onFinishFailed}
							autoComplete="off"
							layout="vertical"
							style={{
								position: "relative",
								width: "100%",
							}}
						>
							<Form.Item
								label="Username"
								name="username"
								rules={[
									{ required: true, message: "Please input your username!" },
								]}
								style={{
									height: 50,
								}}
								wrapperCol={{
									span: 24,
								}}
							>
								<Input
									placeholder="username"
									style={{
										backgroundColor: "#F5F9FC",
										border: "none",
										borderRadius: 6,
										height: 40,
									}}
								/>
							</Form.Item>

							<Form.Item
								label="Password"
								name="password"
								rules={[
									{ required: true, message: "Please input your password!" },
								]}
								style={{
									marginTop: 40,
								}}
							>
								<Input.Password
									className="login-password"
									placeholder="password"
									iconRender={(visible) =>
										visible ? (
											<EyeTwoTone
												style={{
													fontSize: 16,
												}}
											/>
										) : (
											<EyeInvisibleOutlined
												style={{
													fontSize: 16,
												}}
											/>
										)
									}
									style={{
										backgroundColor: "#F5F9FC",
										border: "none",
										borderRadius: 6,
										height: 40,
									}}
								/>
							</Form.Item>

							<Form.Item
								style={{
									height: 50,
									marginTop: 40,
								}}
							>
								<Button
									htmlType="submit"
									type="primary"
									style={{
										width: "100%",
										backgroundColor: "#4B9FF7",
										color: "#fff",
										borderRadius: 6,
										outline: "none",
										border: "none",
									}}
								>
									Login
								</Button>
							</Form.Item>
						</Form>
					</div>
				</div>
			</div>
		</div>
	);
}
