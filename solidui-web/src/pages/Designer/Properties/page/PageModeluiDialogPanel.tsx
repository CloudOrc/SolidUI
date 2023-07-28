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
import { Select, Button } from "antd";
import { InputTextArea } from "@/components";
import Chat from "@/components/Chat";
import useModelui from "../modelui/useModelui";

export default function PageModeluiPropertiesPanel() {
	const {
		models,
		messages,
		waitingForSystem,
		promptInput,
		handlePromptInputChange,
		handleModelChange,
		sendMessage,
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
						}}
						value={promptInput}
						onChange={handlePromptInputChange}
						placeholder="please input some prompt text..."
					/>
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
