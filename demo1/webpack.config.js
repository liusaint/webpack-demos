var path = require('path');
//用于把生成的js注入到html中。
//可以自动生成哈希。用于版本号很方便。自动引入新生成的文件。
//https://segmentfault.com/a/1190000007294861其他具体功能参考。
var HtmlWebpackPlugin = require('html-webpack-plugin');

var webpack = require('webpack');

module.exports = {
	//多入口.[name]指提这个对象的键。
	entry: {
		index: './src/index.js',
		index1: './src/index1.js'
	},
	// entry: ['./src/index.js','./src/index1.js'],//这种传递方法会生成一个main.js

	output: {
		filename: '[name].js',
		path: path.resolve(__dirname, 'dist')
	},
	//loaders。
	module: {
		rules: [{
			test: /\.css/, //正则表达式匹配
			use: ['style-loader', 'css-loader'] //用于处理匹配到的文件的模块。
		}]


	},
	plugins: [
		//此插件用于提取公共代码。方便缓存什么 的。
		//经过提取公共部分。生成的index和index1.js文件明显小了很多。
		//但是引用的时候也要单独注入进去。
		 new webpack.optimize.CommonsChunkPlugin({
		 	name:'common',//名字
		 	minChunks: 2, //至少几个公共的。
		 }),
		 //多入口注入多页应用的方法。https://segmentfault.com/q/1010000009810148
		new HtmlWebpackPlugin({
			filename:'index.html',
			template: './index.html', //使用的模板
			hash: true, //文件后缀加上哈希版本号
			chunks: ['common','index']//表示注入哪些文件。
		}),
		new HtmlWebpackPlugin({
			filename:'index1.html',
			template: './index1.html', //使用的模板
			hash: true, //文件后缀加上哈希版本号
			chunks: ['common','index1']
		}),


	]
}