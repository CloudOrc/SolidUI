import React, { RefObject } from "react";
import { MessageDict } from "@/types/chat";
import SyntaxHighlighter from "react-syntax-highlighter";
import { User, VoiceOne } from "@icon-park/react";
import { WaitingStates } from "@/types/chat";

import ReactMarkdown from "react-markdown";
import "./Chat.css";

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
