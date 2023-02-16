const isDEV = process.env.NODE_ENV === 'development'

module.exports = {
  "presets": [
    [
      "@babel/preset-env",
      {
        "useBuiltIns": "usage",
        "corejs": 3
      }
    ],
    "@babel/preset-react",
    "@babel/preset-typescript"
  ],
  "plugins": [
    isDEV && require.resolve('react-refresh/babel'),
    ["@babel/plugin-proposal-decorators", { "legacy": true }],
		["import", {
			"libraryName": "antd",
			"libraryDirectory": "es",
			"style": true
		}]
  ].filter(Boolean)
}
