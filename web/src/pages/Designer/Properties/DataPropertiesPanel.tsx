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
import Apis from "@/apis";
import { ApiResult, DataSourceCascaderDataType } from "@/types";
import useDataProperties from "./useDataProperties";

const { TextArea } = Input;

const ROW_HEIGHT = 32;
const COLUMN_WIDTH = 150;

export interface DataPropertiesPanelProps {}

export default function (props: DataPropertiesPanelProps) {
	const {
		columns,
		rows,
		dataSources,
		dataSourceOptions,
		queryTables,
		querySql,
		changeSql,
	} = useDataProperties();
	const [previewEnable, setPreviewEnable] = useState<boolean>(false);

	const dropdownRender = (menus: React.ReactNode) => (
		<div>
			{menus}
			{/* Custom dropdown*/}
			{/* <Divider style={{ margin: 0 }} /> */}
			{/* <div style={{ padding: 8 }}>The footer is not very short.</div> */}
		</div>
	);

	function renderBodyCells(row: any) {
		return columns.map((column, columnIndex) => {
			const value = row[column];
			return (
				// <Cell
				<div className="Cell">value</div>
				// 	key={columnIndex}
				// 	columnIndex={columnIndex}
				// 	rowIndex={rowIndex}
				// 	value={value}
				// />
			);
		});
	}

	return (
		<div className="data-conf">
			<div className="ds-conf">
				<div className="ds-select-area">
					<Row gutter={10}>
						<Col span={4}>datasource:</Col>
						<Col span={16}>
							<Cascader
								options={dataSourceOptions}
								loadData={(selectOptions) => {
									let option = selectOptions[0];
									queryTables(option.value as string);
								}}
								changeOnSelect
								dropdownRender={dropdownRender}
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
								disabled={!previewEnable}
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
								placeholder="Please input sql code"
								maxLength={1024}
								onChange={(e) => {
									let value = e.target.value;
									changeSql(value || "");
									setPreviewEnable(
										null !== value && undefined !== value && "" !== value.trim()
									);
								}}
							/>
						</Col>
					</Row>
				</div>
			</div>
			<div className="ds-data-table">
				{/* <Grid
					columnCount={1000}
					columnWidth={100}
					height={300}
					rowCount={1000}
					rowHeight={35}
					width={483}
				>
					{Cell}
				</Grid> */}
				<Grid
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
				</div>
			</div>
		</div>
	);
}
