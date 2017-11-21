var path = require('path');

//用于把生成的js注入到html中。
var HtmlWebpackPlugin = require('html-webpack-plugin');

var webpack = require('webpack');

//加载CSS提取模块
const ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
	//多入口.[name]指提这个对象的键。
	entry: {
		a: './src/js/a.js',
		b: './src/js/b.js',
	},
	output: {
		filename: '[name][chunkHash].js',
		path: path.resolve(__dirname, 'dist'),
		// publicPath:"./"
	},
	//loaders。
	module: {
		rules: [
			{
				test: /\.less$/,
				use: ExtractTextPlugin.extract({
					use: ['css-loader', "postcss-loader", 'less-loader'],
					fallback: 'style-loader' // 编译后用什么loader来提取css文件
				})
			},
			{
				test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
				loader: 'url-loader?limit=10000',
			},
		]
	},
	plugins: [

		new HtmlWebpackPlugin({
			filename: 'a.html', // http://localhost:8080/a.html
			template: './tem/a.html', //使用的模板
			hash: true, //文件后缀加上哈希版本号
			chunks: ['a'] //表示注入哪些chunk。　这里的a。包含了　a.js a.css。
		}),
		new HtmlWebpackPlugin({
			filename: 'b.html', // http://localhost:8080/b.html
			template: './tem/b.html', //使用的模板
			hash: true, //文件后缀加上哈希版本号
			chunks:['b'],
		}),
		// css文件单独拎出来。a.css b.css分别在a.html b.html中使用
		new ExtractTextPlugin({
			filename: '[name].[contenthash].css'
		}),
	]
}