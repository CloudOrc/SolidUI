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

import React, { RefObject } from "react";
import { MessageDict } from "@/types/chat";
import SyntaxHighlighter from "react-syntax-highlighter";
import { User, VoiceOne } from "@icon-park/react";
import { WaitingStates } from "@/types/chat";

import ReactMarkdown from "react-markdown";
import "./chat.less";

function Message(props: {
	text: string;
	role: string;
	type: string;
	showLoader?: boolean;
}) {
	const { text, role } = props;

	const isMarkdown = (input: string) => {
		const mdRegex =
			/\[.*\]\(.*\)|\*\*.*\*\*|__.*__|\#.*|\!\[.*\]\(.*\)|`.*`|\- .*/g;
		return mdRegex.test(input);
	};

	return (
		<div className={`message ${role == "system" ? "system" : "user"}`}>
			<div className="avatar-holder">
				<div className="avatar">
					{role == "system" ? (
						<VoiceOne
							theme="outline"
							size="40"
							fill="#fff"
							strokeLinejoin="bevel"
							strokeLinecap="square"
						/>
					) : (
						<User
							theme="outline"
							size="40"
							fill="#fff"
							strokeLinejoin="bevel"
							strokeLinecap="square"
						/>
					)}
				</div>
			</div>
			<div className="message-body">
				{props.type == "code" && (
					<div>
						I generated the following code:
						<SyntaxHighlighter wrapLongLines language="python">
							{text}
						</SyntaxHighlighter>
					</div>
				)}

				{props.type == "message" &&
					(props.showLoader ? (
						<div>
							{text} {props.showLoader ? <div className="loader" /> : null}
						</div>
					) : isMarkdown(text) ? (
						<ReactMarkdown children={text} />
					) : (
						<div
							className="cell-output"
							dangerouslySetInnerHTML={{ __html: text }}
						/>
					))}

				{props.type == "message_raw" &&
					(props.showLoader ? (
						<div>
							{text} {props.showLoader ? <div className="loader" /> : null}
						</div>
					) : (
						<div
							className="cell-output"
							dangerouslySetInnerHTML={{ __html: text }}
						/>
					))}

				{props.type == "image/png" && (
					<div
						className="cell-output-image"
						dangerouslySetInnerHTML={{
							__html: `<img src='data:image/png;base64,${text}' />`,
						}}
					/>
				)}
				{props.type == "image/jpeg" && (
					<div
						className="cell-output-image"
						dangerouslySetInnerHTML={{
							__html: `<img src='data:image/jpeg;base64,${text}' />`,
						}}
					/>
				)}
			</div>
		</div>
	);
}

export default function Chat(props: {
	waitingForSystem: WaitingStates;
	chatScrollRef: RefObject<HTMLDivElement>;
	messages: Array<MessageDict>;
}) {
	return (
		<div className="chat-messages" ref={props.chatScrollRef}>
			{props.messages.map((message, index) => (
				<Message
					key={index}
					text={message.text}
					role={message.role}
					type={message.type}
				/>
			))}
			{props.waitingForSystem != WaitingStates.Idle ? (
				<Message
					text={props.waitingForSystem}
					role="system"
					type="message"
					showLoader
				/>
			) : null}
		</div>
	);
}
