import React from "react";
import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";

function General() {
	return (
		<div className="aside-general">
			<div className="heading">
				<span
					style={{
						position: "relative",
						height: "38px",
						width: "100%",
						fontSize: "14px",
						color: "#fff",
						fontFamily:
							'"-apple-system, BlinkMacSystemFont, FontAwesome, Segoe UI, Helvetica Neue, Arial, Pingfang SC, Microsoft Yahei, WenQuanYi Micro Hei, sans-serif"',
						lineHeight: "38px",
					}}
				>
					大纲
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
						color: "#fff",
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
						1231
						<br />
						<br />
					</div>
				</div>
			</div>
		</div>
	);
}

export default General;
