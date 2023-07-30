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

const prodConfig = require('./webpack.prod.js')
const { merge } = require('webpack-merge')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')

/**
 * We're going to remove the speed-measure-webpack-plugin here
 * because speed-measure-webpack-plugin will conflict with mini-css-extract-plugin
 * more info please check issue https://github.com/webpack-contrib/mini-css-extract-plugin/issues/744
 * This may be the alternative https://webpack.js.org/configuration/other-options/#profile
 */
module.exports = merge(prodConfig, {
  plugins: [
    new BundleAnalyzerPlugin(),
  ]
})
