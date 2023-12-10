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

const { merge } = require('webpack-merge')
const baseConfig = require('./webpack.base')
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin')
const { staticAssetsDir } = require('./paths')

module.exports = merge(baseConfig, {
  stats: "minimal",
  mode: 'development',
  devtool: 'eval-cheap-module-source-map',
  infrastructureLogging: { level: 'none' },
  devServer: {
    port: process.env.SERVER_PORT,
    compress: false,
    hot: true,
    historyApiFallback: true,
    static: {
      directory: staticAssetsDir,
    },
    proxy: {
      '/solidui/models/generate': {
        target: `${process.env.PROXY_SERVER}:5110`,
				// target: `http://localhost:5110`,
				changeOrigin: true,
        pathRewrite: {}
      },
      '/solidui/kernel/restart': {
        target: `${process.env.PROXY_SERVER}:5010`,
				// target: `http://localhost:5010`,
        changeOrigin: true,
        pathRewrite: {}
      },
      '/solidui/models/api/api': {
        target: `${process.env.PROXY_SERVER}:5110`,
        // target: `http://localhost:5110`,
        changeOrigin: true,
        pathRewrite: {}
      },
      '/solidui': {
        target: `${process.env.PROXY_SERVER}:80`,
				// target: `${process.env.PROXY_SERVER}`,
        changeOrigin: true,
        pathRewrite: {}
      }
    },
  },
  plugins: [
    new ReactRefreshWebpackPlugin(),
  ]
})
