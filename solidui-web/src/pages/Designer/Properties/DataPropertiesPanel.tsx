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

import React, { useEffect, useState } from "react";
import { Row, Col, Cascader, Button, Input } from "antd";
import { FixedSizeGrid as Grid, FixedSizeList as List } from "react-window";
import {
	StickyTable,
	Row as TableRow,
	Cell as TableCell,
	// @ts-ignore
} from "react-sticky-table";
import Apis from "@/apis";
import { ApiResult, DataSourceCascaderDataType } from "@/types";
import useDataProperties from "./useDataProperties";
import { mm } from "@/utils";

const { TextArea } = Input;

const ROW_HEIGHT = 32;
const COLUMN_WIDTH = 150;

export interface DataPropertiesPanelProps {}

export default function (props: DataPropertiesPanelProps) {
	const {
		loading,
		columns,
		rows,
		dataSources,
		dataSourceOptions,
		selectedDataSourceOptions,
		changeDsSelections,
		queryTables,
		querySql,
		changeSql,
	} = useDataProperties();

	let view = mm.getCurrentView();
	let data = view?.data || ({} as any);

	// const dropdownRender = (menus: React.ReactNode) => (
	// 	<div>
	// 		{menus}
	// 		{/* Custom dropdown */}
	// 		{/* <Divider style={{ margin: 0 }} /> */}
	// 		{/* <div style={{ padding: 8 }}>The footer is not very short.</div> */}
	// 	</div>
	// );

	let rowss = [];

	let cells: TableCell[] = [];
	for (let i = 0; i < columns.length; i++) {
		cells.push(<TableCell key={i}>{columns[i]}</TableCell>);
	}
	rowss.push(<TableRow key={"table-header-row"}>{cells}</TableRow>);

	rows.forEach((row, index) => {
		let cells: TableCell[] = [];
		row.forEach((cell, index) => {
			cells.push(<TableCell key={index}>{cell}</TableCell>);
		});
		rowss.push(<TableRow key={`table-row-${index}`}>{cells}</TableRow>);
	});

	return (
		<div className="data-conf">
			<div className="ds-conf">
				<div className="ds-select-area">
					<Row gutter={10}>
						<Col span={4}>datasource:</Col>
						<Col span={16}>
							<Cascader
								loading={loading}
								options={dataSourceOptions}
								value={selectedDataSourceOptions}
								loadData={(selectOptions) => {
									let option = selectOptions[0];
									queryTables(option.value as string);
								}}
								onChange={changeDsSelections}
								showSearch
								placeholder="Please select a datasource"
								size="small"
								style={{
									width: "100%",
								}}
							/>
						</Col>
						<Col span={4}>
							<Button
								type="primary"
								size="small"
								style={{
									width: "100%",
								}}
								disabled={
									data.sql === undefined ||
									data.sql == null ||
									data.sql.trim() === ""
								}
								onClick={querySql}
							>
								Preview
							</Button>
						</Col>
					</Row>
				</div>
				<div className="ds-sql-area">
					<Row gutter={10}>
						<Col span={4}>sql:</Col>
						<Col span={20}>
							<TextArea
								rows={7}
								value={view?.data.sql || ""}
								placeholder="Please input sql code"
								maxLength={1024}
								onChange={(e) => {
									changeSql(e.target.value || "");
								}}
							/>
						</Col>
					</Row>
				</div>
			</div>
			<div className="ds-data-table">
				<StickyTable
					headerSticky={1}
					borderWidth={"1px"}
					borderColor={"#E7E7E7"}
				>
					{rowss}
				</StickyTable>
				{/* <Grid
					className="Grid"
					columnCount={columns.length}
					columnWidth={COLUMN_WIDTH}
					height={ROW_HEIGHT}
					rowCount={1}
					rowHeight={ROW_HEIGHT}
					width={COLUMN_WIDTH * columns.length}
				>
					{({ columnIndex, style }) => (
						<div className="Cell" style={style}>
							{columns[columnIndex]}
						</div>
					)}
				</Grid>
				<div className="table-body">
					<List
						className="List"
						height={ROW_HEIGHT * rows.length}
						itemCount={rows.length}
						itemSize={ROW_HEIGHT}
						width={COLUMN_WIDTH * columns.length}
					>
						{({ index, style }) => (
							<div
								style={style}
								className={index % 2 ? "ListItemOdd" : "ListItemEven"}
							>
								{rows[index].map((cell, columnIndex) => (
									<div key={columnIndex} className="Cell">
										{cell}
									</div>
								))}
							</div>
						)}
					</List>
				</div> */}
			</div>
		</div>
	);
}
