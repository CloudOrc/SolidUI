import React, { useState, useRef, useEffect, useLayoutEffect } from "react";
import { Slider } from "antd";
import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import ScenaEditor from "@/components/ScenaEditor/ScenaEditor";
import { makeScenaFunctionComponent } from "@/components/ScenaEditor/scena_util";
import { ScenaProps } from "@/types";

let cw = 1260;
let ch = 1782;

type View = {
	top: number;
	left: number;
	width: number;
	height: number;
	transform?: string;
};

const Badge = makeScenaFunctionComponent(
	"Badge",
	function Badge(props: ScenaProps) {
		return (
			<p className="badges" data-scena-element-id={props.scenaElementId}>
				<a
					href="https://github.com/CloudOrc/SolidUI/tree/master"
					target="_blank"
				>
					<img
						src="https://img.shields.io/npm/v/solidui.svg?style=flat-square&amp;color=007acc&amp;label=version"
						alt="npm version"
					/>
				</a>
				<a href="https://github.com/CloudOrc/SolidUI" target="_blank">
					<img src="https://img.shields.io/github/stars/cloudorc/solidui.svg?color=42b883&amp;style=flat-square" />
				</a>
				<a href="https://github.com/CloudOrc/SolidUI" target="_blank">
					<img src="https://img.shields.io/badge/language-typescript-blue.svg?style=flat-square" />
				</a>
				<br />
				<a
					href="https://github.com/CloudOrc/SolidUI/tree/master/main"
					target="_blank"
				>
					<img
						alt="React"
						src="https://img.shields.io/static/v1.svg?label=&amp;message=React&amp;style=flat-square&amp;color=61daeb"
					/>
				</a>
			</p>
		);
	}
);

function Scena() {
	const [width, setWidth] = useState(582);
	const [height, setHeight] = useState(482);
	const areaTopRef = useRef<HTMLDivElement>(null);

	let thick = 24;

	const editorRef = React.useRef<ScenaEditor>();

	useLayoutEffect(() => {
		if (areaTopRef.current) {
			let rect = areaTopRef.current.getBoundingClientRect();
			let w = rect.width;
			let h = rect.height;
			setWidth(w - thick);
			setHeight(h - thick);
		}
	}, []);

	useEffect(() => {
		editorRef
			.current!.appendJSXs(
				[
					{
						jsx: (
							<div
								className="moveable"
								contentEditable="true"
								suppressContentEditableWarning={true}
							>
								SolidUI
							</div>
						),
						name: "(Logo)",
						frame: {
							position: "absolute",
							left: "50%",
							top: "30%",
							width: "250px",
							height: "200px",
							"font-size": "40px",
							transform: "translate(-125px, -100px)",
							display: "flex",
							"justify-content": "center",
							"flex-direction": "column",
							"text-align": "center",
							"font-weight": 100,
							color: "#fff",
						},
					},
					{
						jsx: <Badge />,
						name: "(Badges)",
						frame: {
							position: "absolute",
							left: "0%",
							top: "50%",
							width: "100%",
							"text-align": "center",
						},
					},
					{
						jsx: (
							<div
								className="moveable"
								contentEditable="true"
								suppressContentEditableWarning={true}
							>
								3D data visualization editing tools to easily build digital
								twins
							</div>
						),
						name: "(Description)",
						frame: {
							position: "absolute",
							left: "0%",
							top: "65%",
							width: "100%",
							"font-size": "14px",
							"text-align": "center",
							"font-weight": "normal",
							color: "#fff",
						},
					},
				],
				true
			)
			.then((targets) => {
				editorRef.current &&
					editorRef.current.setSelectedTargets([targets[0]], true);
			});
	}, []);

	return (
		<section className="workarea">
			<div
				className="area-top"
				style={{
					position: "absolute",
					top: 0,
					left: 0,
					right: 0,
					bottom: 30,
				}}
				ref={areaTopRef}
			>
				<ScenaEditor
					width={1024}
					height={768}
					ref={(ref) => {
						if (null !== editorRef.current && undefined !== editorRef.current) {
							return;
						}
						if (null !== ref && undefined !== ref) {
							editorRef.current = ref;
						}
						console.log(editorRef.current);
					}}
				/>
			</div>
			<div
				className="area-bottom"
				style={{
					position: "absolute",
					left: 0,
					right: 0,
					bottom: 0,
					height: 30,
					display: "flex",
					justifyContent: "space-between",
				}}
			>
				<div className="cu-b-l">left</div>
				<div className="cu-b-r" style={{}}>
					<div className="cu-b-r-nav">
						<div className="cu-b-zoom-container">
							<MinusOutlined />
							<Slider
								min={50}
								max={200}
								defaultValue={100}
								disabled={false}
								style={{
									width: 100,
								}}
								onChange={(value) => {}}
							/>
							<PlusOutlined />
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}

export default Scena;
