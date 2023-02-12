const path = require('path')
const { merge } = require('webpack-merge')
const baseConfig = require('./webpack.base')
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin')

module.exports = merge(baseConfig, {
  mode: 'development',
  devtool: 'eval-cheap-module-source-map',
  devServer: {
    // port: 9300,
		port: 3000,
    compress: false,
    hot: true,
    historyApiFallback: true,
    static: {
      directory: path.join(__dirname, '../public'),
    },
		proxy: {
			'/api': {
				target: 'http://localhost:8080',
				changeOrigin: true,
				pathRewrite: {
				}
			}
		}
  },
  plugins: [
    new ReactRefreshWebpackPlugin(),
  ]
})
