import React from "react";
import { Tooltip } from "antd";

function Outline() {
	return (
		<div className="aside-outline">
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
					概要
				</span>
			</div>
			<div className="components">
				<div
					style={{
						position: "relative",
						width: "100%",
						height: "100%",
						overflow: "hidden",
					}}
				>
					<div
						style={{
							position: "absolute",
							top: 0,
							left: 0,
							bottom: 0,
							right: 0,
							overflow: "scroll",
							marginRight: "-4px",
							marginBottom: "-4px",
						}}
					>
						<ul className="charts">
							<div className="charts-container">
								<li className="chartview">
									<span className="eblock"></span>
									<i
										className="bi-font bi-chart-column"
										style={{
											position: "relative",
											fontSize: "16px",
											color: "#3dd8ff",
										}}
									></i>
									<span className="text">基础柱状图</span>
									<div className="act act-eye">
										<Tooltip title="隐藏">
											<i className="bi-font bi-eye" />
										</Tooltip>
									</div>
									<div className="act act-lock">
										<Tooltip title="锁定">
											<i className="bi-font bi-lock" />
										</Tooltip>
									</div>
								</li>

								<li className="chartview selected">
									<span className="eblock"></span>
									<i
										className="bi-font bi-chart-column"
										style={{
											position: "relative",
											fontSize: "16px",
											color: "#3dd8ff",
										}}
									></i>
									<span className="text">基础柱状图</span>
									<div className="act act-eye">
										<Tooltip title="隐藏">
											<i className="bi-font bi-eye" />
										</Tooltip>
									</div>
									<div className="act act-lock">
										<Tooltip title="锁定">
											<i className="bi-font bi-lock" />
										</Tooltip>
									</div>
								</li>
							</div>
						</ul>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Outline;
