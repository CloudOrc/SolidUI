const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const themeVars = require('./theme')

const isDev = process.env.NODE_ENV === 'development'

module.exports = {
  entry: path.join(__dirname, '../src/index.tsx'),
  output: {
    filename: 'static/js/[name].[chunkhash:8].js',
    path: path.join(__dirname, '../dist'),
    clean: true,
    publicPath: '/',
  },
  resolve: {
    extensions: ['.js', '.tsx', '.ts'],
    alias: {
      '@': path.join(__dirname, '../src')
    },
    modules: [path.resolve(__dirname, '../node_modules')]
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        include: [
          path.resolve(__dirname, '../src'),
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
					path.resolve(__dirname, '../src'),
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
      // {
      //   test: /.(js|jsx)$/,
      //   include: [path.resolve(__dirname, '../src')],
      //   use: [
      //     'thread-loader',
      //     'babel-loader'
      //   ]
      // },
      {
        test: /\.(js|jsx|ts|tsx)$/,
        include: [path.resolve(__dirname, '../src')],
        use: [
          'thread-loader',
          'babel-loader'
        ]
      },
      {
        test: /.(png|jpg|jpeg|gif|svg)$/,
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
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../public/index.html'),
      inject: true,
    }),
    new webpack.DefinePlugin({
      'process.env.BASE_ENV': JSON.stringify(process.env.BASE_ENV)
    }),
    // new MonacoWebpackPlugin({
    //   languages: []
    // }),
  ],
  cache: {
    type: 'filesystem',
  }
}
