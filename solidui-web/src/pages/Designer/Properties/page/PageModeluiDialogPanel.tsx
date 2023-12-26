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
import { Row, Col, Select, Button, Modal, Cascader } from "antd";
import { Close, DatabaseConfig } from "@icon-park/react";
import { InputTextArea } from "@/components";
import Chat from "@/components/Chat";
import useModelui from "../modelui/useModelui";
import { propertiesContext } from "../Properties";

export default function PageModeluiPropertiesPanel() {
	const {
		models,
		messages,
		waitingForSystem,
		promptInput,
		modalOpen,
		loading,
		dataSourceOptions,
		selectedDataSourceOptions,
		tableData,
		handlePromptInputChange,
		handleModelChange,
		sendMessage,
		toggleModal,
		queryDbs,
		changeDsSelections,
		handleTableDataChange,
		tableOptions,
		handleTableChange,
		handleExecute,
		handleFormatJson,
		handleTransitionJsonToString,
		handleSaveTableData,
	} = useModelui();
	const chatScrollRef = React.useRef<HTMLDivElement>(null);
	return (
		<div
			style={{
				position: "absolute",
				top: 0,
				left: 0,
				right: 0,
				bottom: 0,
			}}
		>
			<div
				style={{
					position: "absolute",
					top: 0,
					left: 0,
					right: 0,
					bottom: 164,
				}}
			>
				<Chat
					chatScrollRef={chatScrollRef}
					messages={messages}
					waitingForSystem={waitingForSystem}
				/>
			</div>
			{modalOpen ? (
				<Modal
					title={null}
					footer={null}
					closable={false}
					bodyStyle={{ padding: 0 }}
					open={modalOpen}
					modalRender={(modal: any) => modal}
					destroyOnClose
				>
					<div className="solidui-modal">
						<div className="solidui-modal__header">
							database
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
								padding: 15,
								height: 300,
							}}
						>
							<div
								className="select-datasource"
								style={{
									marginBottom: 15,
								}}
							>
								<Row gutter={10}>
									<Col
										span={4}
										style={{
											lineHeight: "30px",
										}}
									>
										datasource:
									</Col>
									<Col span={16}>
										<Cascader
											loading={loading}
											options={dataSourceOptions}
											value={selectedDataSourceOptions}
											loadData={(selectOptions) => {
												const option = selectOptions[0];
												console.log(option);
												queryDbs(option.value as string);
											}}
											onChange={changeDsSelections}
											showSearch
											placeholder="Please select a datasource"
											size="middle"
											style={{
												width: "100%",
											}}
										/>
									</Col>
								</Row>
							</div>
							<div
								className="select-datasource"
								style={{
									marginBottom: 15,
								}}
							>
								<Row gutter={10}>
									<Col
										span={4}
										style={{
											lineHeight: "30px",
										}}
									>
										table:
									</Col>
									<Col span={16}>
										<Select
											style={{ width: "325px" }}
											placeholder="Please select a table"
											defaultValue={
												tableOptions && tableOptions[0] && tableOptions[0].value
													? tableOptions[0].value
													: null
											}
											onChange={handleTableChange}
											options={tableOptions}
										/>
									</Col>
								</Row>
							</div>
							<div
								className="action-bar"
								style={{
									marginBottom: 15,
								}}
							>
								<Button
									type="primary"
									style={{
										marginRight: 15,
									}}
									onClick={() => {
										handleExecute();
									}}
								>
									Execute
								</Button>
								<Button
									style={{
										marginRight: 15,
									}}
									onClick={() => {
										handleFormatJson(() => {
											console.log("失败了！");
										});
									}}
								>
									Format verification
								</Button>
								<Button
									style={{
										marginRight: 15,
									}}
									onClick={() => {
										handleTransitionJsonToString(tableData, () => {
											console.log("失败了！");
										});
									}}
								>
									Compression
								</Button>
							</div>
							<div className="json-input">
								<InputTextArea
									style={{
										height: 130,
										minHeight: 130,
										maxHeight: 130,
										width: "100%",
									}}
									value={tableData}
									onChange={handleTableDataChange}
								/>
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
							<Button
								type="primary"
								size="small"
								onClick={() => {
									handleSaveTableData();
								}}
							>
								Save
							</Button>
						</div>
					</div>
				</Modal>
			) : undefined}

			<div
				style={{
					position: "absolute",
					left: 0,
					right: 0,
					bottom: 0,
					height: 164,
					display: "flex",
					alignItems: "center",
					borderTop: "1px solid #e7e7e7",
					padding: "0 10px",
				}}
			>
				<div
					style={{
						position: "absolute",
						top: 10,
						left: 10,
						right: 10,
						height: 100,
					}}
				>
					<InputTextArea
						style={{
							height: 100,
							minHeight: 100,
							maxHeight: 100,
							width: "100%",
							paddingRight: 40,
						}}
						value={promptInput}
						onChange={handlePromptInputChange}
						placeholder="please input some prompt text..."
					/>
					<span
						id="db-config"
						style={{
							position: "absolute",
							top: 10,
							right: 10,
							cursor: "pointer",
						}}
					>
						<DatabaseConfig
							theme="outline"
							size="20"
							fill="#757272"
							strokeWidth={2}
							strokeLinejoin="miter"
							strokeLinecap="square"
							onClick={() => {
								toggleModal(true);
							}}
						/>
					</span>
				</div>
				<div
					style={{
						position: "absolute",
						bottom: 0,
						left: 0,
						right: 0,
						height: 54,
						display: "flex",
						alignItems: "center",
						padding: "0 10px",
					}}
				>
					<Select
						style={{ width: "200px" }}
						defaultValue={
							models && models[0] && models[0].value ? models[0].value : 1
						}
						onChange={handleModelChange}
						options={models}
					/>

					<Button
						type="primary"
						onClick={sendMessage}
						style={{
							width: "100%",
							marginLeft: 10,
						}}
					>
						Send Message
					</Button>
				</div>
			</div>
		</div>
	);
}
