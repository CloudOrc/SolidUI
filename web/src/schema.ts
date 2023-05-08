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

const schema = {
	$schema: "http://json-schema.org/draft-07/schema#",
	type: "object",
	properties: {
		id: {
			type: "string",
			description: "The id of solid model",
		},
		title: {
			type: "string",
			description: "The title of solid model",
		},
		size: {
			type: "object",
			properties: {
				width: {
					type: "number",
					minimum: 100,
				},
				height: {
					type: "number",
					minimum: 100,
				},
			},
			required: ["width", "height"],
			errorMessage: {
				required: {
					width: "size width required",
					height: "size height required",
				},
				properties: {
					width:
						"width should be a number bigger or equal to 100, current value is ${/size/width}",
					height:
						"height should be a number bigger or equal to 100, current value is ${/size/height}",
				},
			},
		},
		scenes: {
			type: "array",
			items: {
				type: "object",
				properties: {
					id: {
						type: "string",
					},
					title: {
						type: "string",
					},
				},
				required: ["id", "title"],
			},
		},
	},
};
