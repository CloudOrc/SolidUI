const path = require('path')
const globAll = require('glob-all')
const { merge } = require('webpack-merge')
const baseConfig = require('./webpack.base')
const CopyPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
// const { PurgeCSSPlugin } = require('purgecss-webpack-plugin')
const CompressionPlugin  = require('compression-webpack-plugin')

module.exports = merge(baseConfig, {
  mode: 'production',

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
          from: path.resolve(__dirname, '../public'),
          to: path.resolve(__dirname, '../dist'),
          filter: source => {
            return !source.includes('index.html')
          }
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
