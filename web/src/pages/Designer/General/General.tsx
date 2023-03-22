import React, { useEffect, useState } from "react";
import { Button, Tree } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { eventbus } from "@/utils";
import type { DataNode, TreeProps } from "antd/es/tree";

import "./general.less";

function General() {
	const [data, setData] = useState<any[]>([]);
	const [expandedKeys] = useState(["0-0", "0-0-0", "0-0-0-0"]);

	useEffect(() => {
		eventbus.on("onModelLoad", (evt) => {
			let model = evt.model;
			console.log(model);
			let scenas = model.scenas || [];
			setData(scenas);
		});

		return () => {
			eventbus.off("onModelLoad");
		};
	}, []);

	const onDragEnter: TreeProps["onDragEnter"] = (info) => {
		console.log(info);
		// expandedKeys 需要受控时设置
		// setExpandedKeys(info.expandedKeys)
	};

	const onDrop: TreeProps["onDrop"] = (info) => {
		console.log(info);
		const dropKey = info.node.key;
		const dragKey = info.dragNode.key;
		const dropPos = info.node.pos.split("-");
		const dropPosition =
			info.dropPosition - Number(dropPos[dropPos.length - 1]);

		const loop = (
			data: DataNode[],
			key: React.Key,
			callback: (node: DataNode, i: number, data: DataNode[]) => void
		) => {
			for (let i = 0; i < data.length; i++) {
				if (data[i].key === key) {
					return callback(data[i], i, data);
				}
				if (data[i].children) {
					loop(data[i].children!, key, callback);
				}
			}
		};

		// Find dragObject
		let dragObj: DataNode;
		loop(data, dragKey, (item, index, arr) => {
			arr.splice(index, 1);
			dragObj = item;
		});

		if (!info.dropToGap) {
			// Drop on the content
			loop(data, dropKey, (item) => {
				item.children = item.children || [];
				// where to insert 示例添加到头部，可以是随意位置
				item.children.unshift(dragObj);
			});
		} else if (
			((info.node as any).props.children || []).length > 0 && // Has children
			(info.node as any).props.expanded && // Is expanded
			dropPosition === 1 // On the bottom gap
		) {
			loop(data, dropKey, (item) => {
				item.children = item.children || [];
				// where to insert 示例添加到头部，可以是随意位置
				item.children.unshift(dragObj);
				// in previous version, we use item.children.push(dragObj) to insert the
				// item to the tail of the children
			});
		} else {
			let ar: DataNode[] = [];
			let i: number;
			loop(data, dropKey, (_item, index, arr) => {
				ar = arr;
				i = index;
			});
			if (dropPosition === -1) {
				ar.splice(i!, 0, dragObj!);
			} else {
				ar.splice(i! + 1, 0, dragObj!);
			}
		}
		setData(data);
	};

	return (
		<div className="aside-general">
			<div className="heading">
				<span
					style={{
						position: "relative",
						height: "38px",
						width: "100%",
						fontSize: "14px",
						// color: "#fff",
						lineHeight: "38px",
					}}
				>
					Outline
				</span>
				<Button
					icon={<PlusOutlined />}
					type="text"
					style={{
						color: "#fff",
						marginRight: "6px",
					}}
				></Button>
			</div>

			<div className="columns">
				<div
					style={{
						position: "relative",
						width: "100%",
						height: "100%",
						overflow: "hidden",
						// color: "#fff",
						color: "#1a1a1a",
						backgroundColor: "#fff",
					}}
				>
					<div
						style={{
							position: "absolute",
							top: 0,
							left: 0,
							right: 0,
							bottom: 0,
							marginRight: "-4px",
							marginBottom: "-4px",
							overflow: "scroll",
						}}
					>
						<Tree
							className="draggable-tree"
							defaultExpandedKeys={expandedKeys}
							// draggable
							// blockNode
							// onDragEnter={onDragEnter}
							// onDrop={onDrop}
							treeData={data}
						/>
						<br />
						<br />
					</div>
				</div>
			</div>
		</div>
	);
}

export default General;
