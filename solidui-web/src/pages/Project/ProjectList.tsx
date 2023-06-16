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
import { Input, Button, Form, Spin, Modal } from "antd";
import { Close } from "@icon-park/react";
import useProject from "./useProject";
import ProjectCard from "./_components/ProjectCard";

import "./ProjectList.less";

const { Search } = Input;

export default function ProjectList() {
	// const onSearch = (value: string) => console.log(value);
	const {
		loading,
		projects,
		toggleCover,
		popupConverMap,
		modalOpen,
		form,
		create,
		del,
		toggleModal,
		handleSearch,
	} = useProject();

	function renderModalContent() {
		return (
			<div className="solidui-modal">
				<div className="solidui-modal__header">
					New Project
					<span className="solidui-modal__close-btn">
						<Close
							theme="outline"
							size="16"
							fill="rgba(0, 0, 0, 0.65)"
							strokeWidth={2}
							strokeLinejoin="miter"
							strokeLinecap="square"
							onClick={() => {
								toggleModal(false);
							}}
						/>
					</span>
				</div>
				<div
					className="solidui-modal__content"
					style={{
						height: 100,
					}}
				>
					<div className="modal-content__form">
						<Form
							layout={"vertical"}
							form={form}
							initialValues={{ layout: "vertical" }}
							onFinish={(values) => {
								create(values);
							}}
						>
							<Form.Item
								label="Project Name"
								name="name"
								required
								rules={[
									{
										required: true,
										message: "Please input project name",
									},
								]}
							>
								<Input placeholder="project name" autoFocus />
							</Form.Item>
						</Form>
					</div>
				</div>
				<div className="solidui-modal__footer">
					<Button
						type="default"
						size="small"
						style={{ marginRight: 10 }}
						onClick={() => toggleModal(false)}
					>
						Cancel
					</Button>
					<Button type="primary" size="small" onClick={() => form.submit()}>
						Save
					</Button>
				</div>
			</div>
		);
	}

	function renderProjects() {
		let nodes: React.ReactNode[] = [];
		projects &&
			projects.forEach((project) => {
				let popup = popupConverMap.current.get(`${project.id}`);
				nodes.push(
					<ProjectCard
						className="project-item"
						key={`project-item-${project.id}`}
						popup={popup}
						item={project}
						handleMouseEnter={(e, id) => {
							e.stopPropagation();
							e.preventDefault();
							toggleCover(id, true);
						}}
						handleMouseLeave={(e, id) => {
							e.stopPropagation();
							e.preventDefault();
							toggleCover(id, false);
						}}
						handleDelete={(id) => {
							del(id);
						}}
					/>,
				);
			});
		return nodes;
	}

	return (
		<div className="solidui-projects">
			<div className="projects-main">
				<div className="projects-header">
					<div className="form-filter">
						<Search
							placeholder="input search text"
							onSearch={handleSearch}
							enterButton
							style={{
								width: 300,
								marginRight: 10,
							}}
						/>
						<Button
							type="primary"
							onClick={() => {
								toggleModal(true);
							}}
						>
							New project
						</Button>
					</div>
				</div>

				<div className="projects-content">
					<Spin tip="loading" spinning={loading}>
						<div className="projects-list">{renderProjects()}</div>
					</Spin>
				</div>
			</div>

			<Modal
				title={null}
				footer={null}
				closable={false}
				bodyStyle={{ padding: 0 }}
				open={modalOpen}
				modalRender={(modal: any) => modal}
			>
				{renderModalContent()}
			</Modal>
		</div>
	);
}
