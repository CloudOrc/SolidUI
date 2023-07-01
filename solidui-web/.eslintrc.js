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

module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
	settings: {
		"import/resolver": {
			node: {
				extensions: [".js", ".jsx", ".ts", ".tsx", ".json"],
				moduleDirectory: ["node_modules", ".", "src"]
			},
			alias: {
        map: [
          ["@", "./src"]
        ],
        extensions: [".ts", ".tsx", ".js", ".jsx", ".json"],
      },
		}
	},
  extends: [
		"airbnb",
		"prettier",
    "plugin:react-hooks/recommended",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
  },
  plugins: [
    "@typescript-eslint",
		"react"
  ],
	overrides: [
		{
		 files: ["*.ts", "*.tsx"],
		 parser: "@typescript-eslint/parser",
		 extends: [
			"airbnb",
			"plugin:@typescript-eslint/recommended",
			"prettier",
		 ],
		 plugins: ["@typescript-eslint/eslint-plugin", "prettier", "react"],
		 rules: {
				"import/extensions": [
					"error",
					{
						".ts": "always",
						".tsx": "always",
						".json": "always",
					},
				],
				"jsx-a11y/click-events-have-key-events": 0,	// need discussion
				"jsx-a11y/no-noninteractive-element-interactions": 0,	// need discussion, need fix
				"jsx-a11y/no-static-element-interactions": 0,	// need discussion, need fix, static element can't be interactive
				"jsx-a11y/control-has-associated-label": 0, // need discussion, need fix, InputColor
				"jsx-a11y/label-has-associated-control": 0, // need discussion, need fix, ButtonGroupRadio # 32:4

				"no-underscore-dangle": 0,	// need discussion
				"no-use-before-define": 0,	// need discussion
				"no-param-reassign": 0,	// need discussion, need fix

				"no-console": 1,
				"no-multi-spaces": 1,
				"no-bitwise": 0,
				"no-continue": 0,
				"no-mixed-operators": 0,
				"no-multi-assign": 1,
				"no-nested-ternary": 1,
				"no-prototype-builtins": 2,
				"class-methods-use-this": 0,

				// typescript
				"@typescript-eslint/no-empty-function": 0,
				"@typescript-eslint/no-explicit-any": 0,
				"@typescript-eslint/ban-ts-comment": 0, // need discussion, temporary disable
				"@typescript-eslint/no-empty-interface": [
					"error",{
						"allowSingleExtends": true,
					}
				],
				// react
				"react/jsx-filename-extension": [1, { extensions: [".jsx", ".tsx"] }],
				"react/require-default-props": 0,
				"react/no-unused-prop-types": 0,
				"react/sort-comp": 0,
				"react/static-property-placement": 0,
				"react/destructuring-assignment": 0,
				"react/jsx-props-no-spreading": 0,
				"react/no-unused-class-component-methods": 0,	// need discussion, method in abstract class, SolidView getXs() getYs()
				"react/jsx-no-bind": 0,	// need discussion
			},
		},
	],
  rules: {
		"@typescript-eslint/no-explicit-any": "off",
		"no-tabs": "off",
    "indent": "off",
		"prefer-const": "off",
    "linebreak-style": [
      "error",
      "unix",
    ],
		"react/jsx-indent": [2, "tab"],
		"import/no-unresolved": "off",

		"import/extensions": [
      "error",
      {
        ".js": "always",
        ".jsx": "always",
        ".ts": "always",
        ".tsx": "always",
        ".json": "always",
      },
    ],
		"class-methods-use-this": 0,

		// ...
		"no-plusplus": ["error", { "allowForLoopAfterthoughts": true }],

    quotes: [
      "error",
      "double",
    ],
    semi: [
      "error",
      "always",
    ],
  },
};
