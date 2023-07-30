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
const CopyPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const CompressionPlugin = require('compression-webpack-plugin')
const { staticAssetsDir, outputDir, appHtml } = require("./paths")
// const { PurgeCSSPlugin } = require('purgecss-webpack-plugin')
// const globAll = require('glob-all')

module.exports = merge(baseConfig, {
  stats: "minimal",
  mode: 'production',
  performance: {
    hints: 'warning',
    maxEntrypointSize: 5242880,
    maxAssetSize: 5242880,
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendors: {
          test: /node_modules/,
          name: 'vendors',
          minChunks: 1,
          chunks: 'initial',
          minSize: 0,
          priority: 1
        },
        commons: {
          name: 'commons',
          minChunks: 2,
          chunks: 'initial',
          minSize: 0
        }
      }
    },
    minimizer: [
      new CssMinimizerPlugin(),
      new TerserPlugin({
        parallel: true,
        terserOptions: {
          compress: {
            pure_funcs: ['console.log']
          }
        }
      })
    ]
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: staticAssetsDir,
          to: outputDir,
          filter: source => !(source === appHtml)
        },
      ],
    }),
    new MiniCssExtractPlugin({
      filename: 'static/css/[name].[contenthash:8].css'
    }),
    // new PurgeCSSPlugin({
    //   paths: globAll.sync([
    //     `${path.join(__dirname, '../src/**/*.tsx')}`,
    //     path.join(__dirname, '../public/index.html')
    //   ]),
    // }),
    new CompressionPlugin({
      test: /.(js|css)$/,
      filename: '[path][base].gz',
      algorithm: 'gzip',
      test: /.(js|css)$/,
      threshold: 10240,
      minRatio: 0.8
    })
  ]
})
