const path = require('path')
const webpack = require('webpack')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const config = {
  context: path.resolve(__dirname, "../"),
  entry: {
    index: "./test/index.js"
  },
  output: {
    path: path.resolve(__dirname, "../"),
    filename: "[name].js"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader'
      },
      {
        test: /\.css/,
        loader: 'style-loader!css-loader'
      }
    ]
  },
  devtool: 'eval-source-map',
  devServer: {
    hot: true,
    port: 8080,
    quiet: true
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      template: 'test/index.html',
      inject: true
    })
  ]
}

module.exports = new Promise(function(resolve, reject) {
  config.plugins.push(new FriendlyErrorsPlugin({
    compilationSuccessInfo: {
      messages: [`Your application is running here: http://127.0.0.1:8080`],
    },
    onErrors: err => console.log(err)
  }))

  resolve(config)
})
