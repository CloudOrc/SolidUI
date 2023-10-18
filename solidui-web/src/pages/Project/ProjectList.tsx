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
import { Input, Button, Form, Spin, Modal, Pagination } from "antd";
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
		query,
		setSearchName,
		searchName,
		pagination,
		handlePaginationChange,
	} = useProject();


	function renderProjects() {
		const nodes: React.ReactNode[] = [];
		projects.forEach((project) => {
			const popup = popupConverMap.current.get(`${project.id}`);
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
					onUpdate={() => {
						query();
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
							onPressEnter={handleSearch}
							value={searchName}
							onChange={(e) => {
								setSearchName(e.target.value);
							}}
							enterButton
							style={{
								width: 300,
								marginRight: 10,
							}}
						/>
						<Button
							type="primary"
							onClick={() => {
								create({ name: "Default Project Name" });
							}}
						>
							New Project
						</Button>
					</div>
				</div>

				<div className="projects-content">
					<Spin tip="loading" spinning={loading}>
						<div className="projects-list">{renderProjects()}</div>
					</Spin>
					<div style={{ display: "flex", justifyContent: "flex-end" }}>
						<Pagination
							showSizeChanger={false}
							pageSize={pagination.size}
							current={pagination.current}
							total={pagination.total}
							onChange={handlePaginationChange}
						/>
					</div>
				</div>
			</div>

		</div>
	);
}
