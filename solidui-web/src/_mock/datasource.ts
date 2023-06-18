// /*
//  * Licensed to the Apache Software Foundation (ASF) under one or more
//  * contributor license agreements.  See the NOTICE file distributed with
//  * this work for additional information regarding copyright ownership.
//  * The ASF licenses this file to You under the Apache License, Version 2.0
//  * (the "License"); you may not use this file except in compliance with
//  * the License.  You may obtain a copy of the License at
//  *
//  *    http://www.apache.org/licenses/LICENSE-2.0
//  *
//  * Unless required by applicable law or agreed to in writing, software
//  * distributed under the License is distributed on an "AS IS" BASIS,
//  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//  * See the License for the specific language governing permissions and
//  * limitations under the License.
//  */

// import Mock from "mockjs";

// const types = [
// 	"mysql",
// 	"sqlserver",
// 	"db2",
// 	"postgresql",
// 	"oracle",
// 	"doris",
// 	"file",
// 	"http",
// ];

// Mock.mock(
// 	/\/solidui\/datasources\?page=\d+&size=\d+/,
// 	"get",
// 	Mock.mock({
// 		code: 0,
// 		msg: "success",
// 		success: true,
// 		data: {
// 			currentPage: 1,
// 			pageSize: 10,
// 			total: 12,
// 			"totalList|12": [
// 				{
// 					id: "@id",
// 					key: "@id",
// 					title: "@name",
// 					type: Mock.Random.pick(types),
// 					username: "@name",
// 					password: "@name",
// 					driver: "com.mysql.cj.jdbc.Driver",
// 					url: "jdbc:mysql://localhost:3306/db1",
// 					host: "localhost",
// 					port: 3306,
// 					updateUser: "@name",
// 					description: "@title",
// 				},
// 			],
// 		},
// 	}),
// );

// Mock.mock(
// 	/\/solidui\/datasources\/types/,
// 	"get",
// 	Mock.mock({
// 		code: 0,
// 		msg: "success",
// 		success: true,
// 		data: [
// 			{
// 				id: "mysql",
// 				key: "mysql",
// 				title: "MySQL",
// 				description: "MySQL",
// 			},
// 			{
// 				id: "sqlserver",
// 				key: "sqlserver",
// 				title: "SQL Server",
// 				description: "SQL Server",
// 			},
// 			{
// 				id: "db2",
// 				key: "db2",
// 				title: "DB2",
// 				description: "DB2",
// 			},
// 			{
// 				id: "postgresql",
// 				key: "postgresql",
// 				title: "PostgreSQL",
// 				description: "PostgreSQL",
// 			},
// 			{
// 				id: "oracle",
// 				key: "oracle",
// 				title: "Oracle",
// 				description: "Oracle",
// 			},
// 			{
// 				id: "doris",
// 				key: "doris",
// 				title: "Doris",
// 				description: "Doris",
// 			},
// 			{
// 				id: "file",
// 				key: "file",
// 				title: "File",
// 				description: "File",
// 			},
// 			{
// 				id: "http",
// 				key: "http",
// 				title: "HTTP",
// 				description: "HTTP",
// 			},
// 		],
// 	}),
// );

// Mock.mock(
// 	/\/solidui\/datasources\/\d+/,
// 	"delete",
// 	Mock.mock({
// 		code: 0,
// 		msg: "success",
// 		success: true,
// 		data: {},
// 	}),
// );

// Mock.mock(
// 	/\/solidui\/datasources/,
// 	"post",
// 	Mock.mock({
// 		code: 0,
// 		msg: "success",
// 		success: true,
// 		data: {},
// 	}),
// );

// Mock.mock(
// 	/\/solidui\/datasources\/\d+/,
// 	"put",
// 	Mock.mock({
// 		code: 0,
// 		msg: "success",
// 		success: true,
// 		data: {},
// 	}),
// );

// Mock.mock(
// 	/\/solidui\/datasources\/all/,
// 	"get",
// 	Mock.mock({
// 		code: 0,
// 		msg: "success",
// 		success: true,
// 		data: [
// 			{
// 				id: "1",
// 				key: "1",
// 				label: "ds1",
// 				value: "ds1",
// 				children: [
// 					{
// 						id: "1-1",
// 						key: "1-1",
// 						label: "table11",
// 						value: "table11",
// 					},
// 					{
// 						id: "1-2",
// 						key: "1-2",
// 						label: "table12",
// 						value: "table12",
// 					},
// 					{
// 						id: "1-3",
// 						key: "1-3",
// 						label: "table13",
// 						value: "table13",
// 					},
// 				],
// 			},
// 			{
// 				id: "2",
// 				key: "2",
// 				label: "ds2",
// 				value: "ds2",
// 				children: [
// 					{
// 						id: "2-1",
// 						key: "2-1",
// 						label: "table21",
// 						value: "table21",
// 					},
// 					{
// 						id: "2-2",
// 						key: "2-2",
// 						label: "table22",
// 						value: "table22",
// 					},
// 					{
// 						id: "2-3",
// 						key: "2-3",
// 						label: "table23",
// 						value: "table23",
// 					},
// 				],
// 			},
// 		],
// 	}),
// );

// Mock.mock(
// 	/\/solidui\/datasources\/querysql/,
// 	"get",
// 	Mock.mock({
// 		code: 0,
// 		msg: "success",
// 		success: true,
// 		"data|100-200": [
// 			{
// 				id: "@id",
// 				key: "@id",
// 				year: "@integer(2010, 2020)",
// 				month: "@integer(1, 12)",
// 				day: "@integer(1, 30)",
// 				week: "@integer(1, 7)",
// 				sales: "@integer(100, 10000)",
// 				profit: "@integer(100, 100000)",
// 			},
// 		],
// 	}),
// );
