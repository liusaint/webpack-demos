var path = require('path');
//用于把生成的js注入到html中。
//可以自动生成哈希。用于版本号很方便。自动引入新生成的文件。
//https://segmentfault.com/a/1190000007294861其他具体功能参考。
var HtmlWebpackPlugin = require('html-webpack-plugin');



module.exports = {
	entry: './src/index.js',
	output: {
		filename: 'index.js',
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
		new HtmlWebpackPlugin({
			template: './index.html',//使用的模板
			hash: true,//文件后缀加上哈希版本号
		})
	]
}