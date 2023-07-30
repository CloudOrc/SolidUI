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
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const themeVars = require('./theme')
const webpackBar = require('webpackbar');
const { name: appName } = require("../package.json")
const { appMainJs, outputDir, appSrcDir, appHtml } = require("./paths")
const envVariate = require("./env")
const isDev = process.env.NODE_ENV === 'development'

module.exports = {
  entry: appMainJs,
  output: {
    filename: 'static/js/[name].[chunkhash:8].js',
    path: outputDir,
    clean: true,
    publicPath: '/',
  },
  resolve: {
    extensions: ['.js', '.tsx', '.ts'],
    alias: {
      '@': appSrcDir
    },
    // [issue fix] react-markdown, react-syntax-highlighter common deps property-information with different version
    // if set modules, webpack will search property-information in root node_modules, this may cause error
    // ERROR in ./node_modules/hastscript/factory.js 4:16-57
    // Module not found: Error: Can't resolve 'property-information/normalize' in '/..../SolidUI/solidui-web/node_modules/hastscript'
    // modules: [path.resolve(__dirname, '../node_modules')]
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        include: [
          appSrcDir,
          path.resolve(__dirname, '../node_modules/@szhsin/react-menu')
          // path.resolve(__dirname, '../node_modules/antd')
        ],
        use: [
          isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader'
        ]
      },
      {
        test: /\.less$/,
        include: [
          appSrcDir,
          path.resolve(__dirname, '../node_modules/antd'),
          path.resolve(__dirname, '../node_modules/rc-select')
        ],
        use: [
          isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          {
            loader: 'less-loader',
            options: {
              lessOptions: {
                modifyVars: themeVars,
                javascriptEnabled: true
              }
            }
          }
        ]
      },
      {
        test: /\.(js|jsx|ts|tsx)$/,
        include: [appSrcDir],
        use: [
          'thread-loader',
          'babel-loader'
        ]
      },
      {
        test: /\.svg$/i,
        include: [appSrcDir],
        issuer: /\.[jt]sx?$/,
        use: [
          { loader: 'thread-loader' },
          { loader: 'babel-loader', },
          { loader: '@svgr/webpack', options: { icon: true, typescript: true, svgo: false, mome: true } }
        ],
      },
      {
        test: /.(png|jpg|jpeg|gif)$/,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024,
          }
        },
        generator: {
          filename: 'static/images/[name].[contenthash:8][ext]',
        },
      },
      {
        test: /.(woff2?|eot|ttf|otf)$/,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024,
          }
        },
        generator: {
          filename: 'static/fonts/[name].[contenthash:8][ext]',
        },
      },
      {
        test: /.(mp4|webm|ogg|mp3|wav|flac|aac)$/,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024,
          }
        },
        generator: {
          filename: 'static/media/[name].[contenthash:8][ext]',
        },
      },
    ]
  },
  plugins: [
    new webpackBar({
      color: "#3771FA",
      name: appName,
    }),
    new HtmlWebpackPlugin({
      template: appHtml,
      inject: true,
    }),
    new webpack.DefinePlugin({
      "process.env": JSON.stringify({
        ...envVariate.filter(isDev, process.env),
        APP_NAME: process.env.APP_NAME,
        APP_VERSION: process.env.APP_VERSION
      }),
    }),
  ],
  cache: {
    type: 'filesystem',
    store: 'pack',
  }
}


