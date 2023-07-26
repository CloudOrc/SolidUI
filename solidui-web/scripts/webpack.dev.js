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

const path = require('path')
const { merge } = require('webpack-merge')
const baseConfig = require('./webpack.base')
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin')

module.exports = merge(baseConfig, {
  mode: 'development',
  devtool: 'eval-cheap-module-source-map',
  devServer: {
		port: 3000,
    compress: false,
    hot: true,
    historyApiFallback: true,
    static: {
      directory: path.join(__dirname, '../public'),
    },
		proxy: {
			'/solidui/models/generate': {
				target: 'http://43.138.5.82:5110',
				changeOrigin: true,
				pathRewrite: {}
			},
			'/solidui/kernel/restart': {
				target: 'http://43.138.5.82:5010',
				changeOrigin: true,
				pathRewrite: {}
			},
			'/solidui/models/api/api': {
				target: 'http://43.138.5.82:5110',
				changeOrigin: true,
				pathRewrite: {}
			},
			'/solidui': {
				target: 'http://localhost:12345',
				changeOrigin: true,
				pathRewrite: {}
			}
		},
  },
  plugins: [
    new ReactRefreshWebpackPlugin(),
  ]
})
