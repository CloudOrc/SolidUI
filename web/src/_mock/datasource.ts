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

import Mock from "mockjs";
const types = [
	"mysql",
	"sqlserver",
	"db2",
	"postgresql",
	"oracle",
	"doris",
	"file",
	"http",
];

Mock.mock(
	/\/solidui\/datasources\?page=\d+&size=\d+/,
	"get",
	Mock.mock({
		code: 0,
		msg: "success",
		success: true,
		data: {
			currentPage: 1,
			pageSize: 10,
			total: 12,
			"totalList|12": [
				{
					id: "@id",
					key: "@id",
					title: "@name",
					type: Mock.Random.pick(types),
					username: "@name",
					password: "@name",
					driver: "com.mysql.cj.jdbc.Driver",
					url: "jdbc:mysql://localhost:3306/db1",
					host: "localhost",
					port: 3306,
					updateUser: "@name",
					description: "@title",
				},
			],
		},
	})
);

Mock.mock(
	/\/solidui\/datasources\/types/,
	"get",
	Mock.mock({
		code: 0,
		msg: "success",
		success: true,
		data: [
			{
				id: "mysql",
				key: "mysql",
				title: "MySQL",
				description: "MySQL",
			},
			{
				id: "sqlserver",
				key: "sqlserver",
				title: "SQL Server",
				description: "SQL Server",
			},
			{
				id: "db2",
				key: "db2",
				title: "DB2",
				description: "DB2",
			},
			{
				id: "postgresql",
				key: "postgresql",
				title: "PostgreSQL",
				description: "PostgreSQL",
			},
			{
				id: "oracle",
				key: "oracle",
				title: "Oracle",
				description: "Oracle",
			},
			{
				id: "doris",
				key: "doris",
				title: "Doris",
				description: "Doris",
			},
			{
				id: "file",
				key: "file",
				title: "File",
				description: "File",
			},
			{
				id: "http",
				key: "http",
				title: "HTTP",
				description: "HTTP",
			},
		],
	})
);

Mock.mock(
	/\/solidui\/datasources\/\d+/,
	"delete",
	Mock.mock({
		code: 0,
		msg: "success",
		success: true,
		data: {},
	})
);

Mock.mock(
	/\/solidui\/datasources/,
	"post",
	Mock.mock({
		code: 0,
		msg: "success",
		success: true,
		data: {},
	})
);

Mock.mock(
	/\/solidui\/datasources\/\d+/,
	"put",
	Mock.mock({
		code: 0,
		msg: "success",
		success: true,
		data: {},
	})
);
