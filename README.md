* 各种资源视为模块。比如图片，样式。
* 相比于gulp等。它可以自动处理依赖。防止重复加载模块，处理模块运行顺序等。
* entry入口文件，从入口文件中的依赖，一个个找下去。可以有多个入口文件。多个出口文件。单独引用。我们前面一个项目的结构大概是公共的用commonjs。然后其他的是每一个大模块一个入口文件。引入很多小模块。一起打包到一个模块文件中。 避免一次全部加载完。 当然，其实有更好的办法。
* output 出口文件。 可以用一个[name]变量代替原文件的名字，[hash]。还有一个path参数。path好像是要是绝对路径的。


* 异步加载
* 全局变量
* 别名 
* loader执行顺序是从前往后
* 对chunk的理解。一个入口一个chunk? 这个入口下编译的js，css。属于同一个chunk?
