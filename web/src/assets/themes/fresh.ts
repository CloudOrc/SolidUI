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

const theme = {
	color: ["#7f7fec", "#53c3fd", "#f29925", "#c87ddd", "#00dbc2", "#ff614c"],
	backgroundColor: "rgba(0,0,0,0)",
	textStyle: {},
	title: {
		textStyle: {
			color: "#333333",
		},
		subtextStyle: {
			color: "#aaaaaa",
		},
	},
	line: {
		itemStyle: {
			normal: {
				borderWidth: "1.5",
			},
		},
		lineStyle: {
			normal: {
				width: "2",
			},
		},
		symbolSize: "5",
		symbol: "emptyCircle",
		smooth: false,
	},
	radar: {
		itemStyle: {
			normal: {
				borderWidth: "1.5",
			},
		},
		lineStyle: {
			normal: {
				width: "2",
			},
		},
		symbolSize: "5",
		symbol: "emptyCircle",
		smooth: false,
	},
	bar: {
		itemStyle: {
			normal: {
				barBorderWidth: 0,
				barBorderColor: "#cccccc",
			},
			emphasis: {
				barBorderWidth: 0,
				barBorderColor: "#cccccc",
			},
		},
	},
	pie: {
		itemStyle: {
			normal: {
				borderWidth: 0,
				borderColor: "#cccccc",
			},
			emphasis: {
				borderWidth: 0,
				borderColor: "#cccccc",
			},
		},
	},
	scatter: {
		itemStyle: {
			normal: {
				borderWidth: 0,
				borderColor: "#cccccc",
			},
			emphasis: {
				borderWidth: 0,
				borderColor: "#cccccc",
			},
		},
	},
	boxplot: {
		itemStyle: {
			normal: {
				borderWidth: 0,
				borderColor: "#cccccc",
			},
			emphasis: {
				borderWidth: 0,
				borderColor: "#cccccc",
			},
		},
	},
	parallel: {
		itemStyle: {
			normal: {
				borderWidth: 0,
				borderColor: "#cccccc",
			},
			emphasis: {
				borderWidth: 0,
				borderColor: "#cccccc",
			},
		},
	},
	sankey: {
		itemStyle: {
			normal: {
				borderWidth: 0,
				borderColor: "#cccccc",
			},
			emphasis: {
				borderWidth: 0,
				borderColor: "#cccccc",
			},
		},
	},
	funnel: {
		itemStyle: {
			normal: {
				borderWidth: 0,
				borderColor: "#cccccc",
			},
			emphasis: {
				borderWidth: 0,
				borderColor: "#cccccc",
			},
		},
	},
	gauge: {
		itemStyle: {
			normal: {
				borderWidth: 0,
				borderColor: "#cccccc",
			},
			emphasis: {
				borderWidth: 0,
				borderColor: "#cccccc",
			},
		},
	},
	candlestick: {
		itemStyle: {
			normal: {
				color: "#f29925",
				color0: "#7172e9",
				borderColor: "#cf7a0e",
				borderColor0: "#4546f0",
				borderWidth: 1,
			},
		},
	},
	graph: {
		itemStyle: {
			normal: {
				borderWidth: 0,
				borderColor: "#cccccc",
			},
		},
		lineStyle: {
			normal: {
				width: "1",
				color: "#cccccc",
			},
		},
		symbolSize: "5",
		symbol: "emptyCircle",
		smooth: false,
		color: ["#7f7fec", "#53c3fd", "#f29925", "#c87ddd", "#00dbc2", "#ff614c"],
		label: {
			normal: {
				textStyle: {
					color: "#ffffff",
				},
			},
		},
	},
	map: {
		itemStyle: {
			normal: {
				areaColor: "#ffffff",
				borderColor: "#aaaaaa",
				borderWidth: "0.5",
			},
			emphasis: {
				areaColor: "rgba(242,153,37,1)",
				borderColor: "#cf7a0e",
				borderWidth: "1",
			},
		},
		label: {
			normal: {
				textStyle: {
					color: "#000000",
				},
			},
			emphasis: {
				textStyle: {
					color: "rgb(0,0,0)",
				},
			},
		},
	},
	geo: {
		itemStyle: {
			normal: {
				areaColor: "#ffffff",
				borderColor: "#aaaaaa",
				borderWidth: "0.5",
			},
			emphasis: {
				areaColor: "rgba(242,153,37,1)",
				borderColor: "#cf7a0e",
				borderWidth: "1",
			},
		},
		label: {
			normal: {
				textStyle: {
					color: "#000000",
				},
			},
			emphasis: {
				textStyle: {
					color: "rgb(0,0,0)",
				},
			},
		},
	},
	categoryAxis: {
		axisLine: {
			show: true,
			lineStyle: {
				color: "#a4a8ab",
			},
		},
		axisTick: {
			show: true,
			lineStyle: {
				color: "#a4a8ab",
			},
		},
		axisLabel: {
			show: true,
			textStyle: {
				color: "#a4a8ab",
			},
		},
		splitLine: {
			show: false,
			lineStyle: {
				color: ["#ccc"],
			},
		},
		splitArea: {
			show: false,
			areaStyle: {
				color: ["rgba(250,250,250,0.3)", "rgba(200,200,200,0.3)"],
			},
		},
	},
	valueAxis: {
		axisLine: {
			show: true,
			lineStyle: {
				color: "#a4a8ab",
			},
		},
		axisTick: {
			show: true,
			lineStyle: {
				color: "#a4a8ab",
			},
		},
		axisLabel: {
			show: true,
			textStyle: {
				color: "#a4a8ab",
			},
		},
		splitLine: {
			show: true,
			lineStyle: {
				color: ["#eeeeee"],
			},
		},
		splitArea: {
			show: false,
			areaStyle: {
				color: ["rgba(250,250,250,0.3)", "rgba(200,200,200,0.3)"],
			},
		},
	},
	logAxis: {
		axisLine: {
			show: true,
			lineStyle: {
				color: "#a4a8ab",
			},
		},
		axisTick: {
			show: true,
			lineStyle: {
				color: "#a4a8ab",
			},
		},
		axisLabel: {
			show: true,
			textStyle: {
				color: "#333",
			},
		},
		splitLine: {
			show: true,
			lineStyle: {
				color: ["#eeeeee"],
			},
		},
		splitArea: {
			show: false,
			areaStyle: {
				color: ["rgba(250,250,250,0.3)", "rgba(200,200,200,0.3)"],
			},
		},
	},
	timeAxis: {
		axisLine: {
			show: true,
			lineStyle: {
				color: "#a4a8ab",
			},
		},
		axisTick: {
			show: true,
			lineStyle: {
				color: "#a4a8ab",
			},
		},
		axisLabel: {
			show: true,
			textStyle: {
				color: "#a4a8ab",
			},
		},
		splitLine: {
			show: true,
			lineStyle: {
				color: ["#eeeeee"],
			},
		},
		splitArea: {
			show: false,
			areaStyle: {
				color: ["rgba(250,250,250,0.3)", "rgba(200,200,200,0.3)"],
			},
		},
	},
	toolbox: {
		iconStyle: {
			normal: {
				borderColor: "#999999",
			},
			emphasis: {
				borderColor: "#333333",
			},
		},
	},
	legend: {
		textStyle: {
			color: "#333333",
		},
	},
	tooltip: {
		axisPointer: {
			lineStyle: {
				color: "#cccccc",
				width: 1,
			},
			crossStyle: {
				color: "#cccccc",
				width: 1,
			},
		},
	},
	timeline: {
		lineStyle: {
			color: "#f29925",
			width: 1,
		},
		itemStyle: {
			normal: {
				color: "#f29925",
				borderWidth: "1",
			},
			emphasis: {
				color: "#f29925",
			},
		},
		controlStyle: {
			normal: {
				color: "#f29925",
				borderColor: "#f29925",
				borderWidth: 0.5,
			},
			emphasis: {
				color: "#f29925",
				borderColor: "#f29925",
				borderWidth: 0.5,
			},
		},
		checkpointStyle: {
			color: "#f29925",
			borderColor: "rgba(242,153,37,1)",
		},
		label: {
			normal: {
				textStyle: {
					color: "#333333",
				},
			},
			emphasis: {
				textStyle: {
					color: "#333333",
				},
			},
		},
	},
	visualMap: {
		color: ["#5355f0", "#8989ef", "#aea8ec", "#c9bfe9", "#efe0e6", "#eeeeee"],
	},
	dataZoom: {
		backgroundColor: "rgba(47,69,84,0)",
		dataBackgroundColor: "rgba(47,69,84,0.3)",
		fillerColor: "rgba(167,183,204,0.4)",
		handleColor: "#a7b7cc",
		handleSize: "100%",
		textStyle: {
			color: "#333333",
		},
	},
	markPoint: {
		label: {
			normal: {
				textStyle: {
					color: "#ffffff",
				},
			},
			emphasis: {
				textStyle: {
					color: "#ffffff",
				},
			},
		},
	},
};

export default theme;
