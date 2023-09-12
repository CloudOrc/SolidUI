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

import importHTML from "import-html-entry";
import Sandbox from "./Sandbox";

function patchDocument(doc: Document, template: string) {
	const domTree = new DOMParser().parseFromString(template, "text/html");
	// @ts-ignore
	doc.documentElement = domTree.documentElement;
	doc.appendChild(doc.documentElement);

	const docKeys = Object.keys(Document.prototype);
	docKeys.forEach((key) => {
		if (!Reflect.has(doc, key)) {
			Object.defineProperty(doc, key, {
				get() {
					let value = Reflect.get(document, key);
					if (typeof value === "function") value = value.bind(document);
					return value;
				},
			});
		}
	});
	return doc;
}

/**
 * 创建 proxy 对象，保障this指向正常
 * @param {*} element
 * @returns
 */
function substitute(target: any) {
	return new Proxy(target, {
		get: (target, key) => {
			const result = Reflect.get(target, key);
			if (typeof result === "function") {
				return result.bind(target);
			}
			return result;
		},
	});
}

// 实现 document 加载组件
export class DocumentLoaderClass extends HTMLElement {
	// 当前实例的缓存key
	cacheKey = crypto.randomUUID();

	// 当前加载的状态
	loadStatus: boolean | null = null;

	// 下一个等待被加载的 document
	nextDoc: string | null = null;

	// 监听 attribute 变化
	static get observedAttributes() {
		return ["code"];
	}

	constructor() {
		super();
		// 启用 shadow dom
		this.attachShadow({ mode: "open" });
	}

	// attribute 变化回调
	attributeChangedCallback(prop: string, oldValue: string, newValue: string) {
		if (prop === "code") {
			if (newValue && this.verifyDoc(newValue)) {
				// 如果在加载中
				if (this.loadStatus) {
					this.nextDoc = newValue;
				} else {
					this.load(newValue, () => {
						if (this.nextDoc) {
							this.nextDoc = null;
							// @ts-ignore
							this.load(this.nextDoc);
						}
					});
				}
			}
		}
	}

	/**
	 * 验证dom结构是否合法
	 * @param {*} tpl
	 * @returns
	 */
	verifyDoc(tpl: string) {
		const doc = new DOMParser().parseFromString(tpl, "text/html");
		return !!doc.body.children.length;
	}

	/**
	 * 加载文档片段
	 * @param {*} tpl
	 * @param {*} callback
	 */
	load(tpl: string, callback: (finish?: boolean) => void) {
		this.loadStatus = true;
		importHTML(`/${this.cacheKey}`, {
			// @ts-ignore
			fetch: (url: string, ...args: any[]) => {
				if (url === `/${this.cacheKey}`) {
					return Promise.resolve(
						new Response(new Blob([tpl], { type: "text/plane" })),
					);
				}
				return fetch.bind(window)(url, ...args);
			},
		}).then(
			(res: any) => {
				this.loadStatus = false;
				callback(true);
				patchDocument(this.shadowRoot as any, res.template);

				const windowBox = new Sandbox(substitute(window), {
					document: this.shadowRoot,
				}).box;
				res.execScripts(windowBox, true);
			},
			() => {
				this.loadStatus = false;
				callback(false);
			},
		);
	}
}

export const DocumentLoader = "document-loader";

customElements.define(DocumentLoader, DocumentLoaderClass);
