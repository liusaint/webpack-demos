console.log(__dirname);//'D:\github\webpack-demos\demo2-vue' 当前目录绝对路径
console.log(__filename);//D:\github\webpack-demos\demo2-vue\test.js　当前文件的绝对路径。


var path = require('path');
console.log(path.resolve(__dirname,'./build/build.js'));// D:\github\webpack-demos\demo2-vue\build\build.js;　以第一个参数为基准生成的绝对路径。


//path.join相当于是从第一个参数开始，一个参数一个参数的计算下一级的结果。
console.log(path.join(__dirname, '../', 'src'))
console.log(path.join(__dirname, '../', '../src'))
//path.posix有path所有方法。
console.log(path.posix.join(__dirname,'./'));