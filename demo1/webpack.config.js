var path = require('path');
module.exports = {
	entry:'./src/index.js',
	output:{
		filename:'index.js',
		path:path.resolve(__dirname, 'dist')
	},
	//loaders。
	module:{
		rules:[
		{
			test:/\.css/,//正则表达式匹配
			use:['style-loader','css-loader']//用于处理匹配到的文件的模块。
		}]

		
	}
}