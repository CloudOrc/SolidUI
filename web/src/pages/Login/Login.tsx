import React from "react";
import { useNavigate } from "react-router-dom";
import { Row, Col, Form, Input, Button, Tag } from "antd";
import {
	EyeOutlined,
	EyeTwoTone,
	EyeInvisibleOutlined,
} from "@ant-design/icons";
import LogoPng from "@/assets/images/logo.png";

import "./login.less";

export default function () {
	const navigate = useNavigate();

	function handleLogin(values: { username: string; password: string }) {
		navigate("/dashboard");
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
