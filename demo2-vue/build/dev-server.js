'use strict'
require('./check-versions')()

const config = require('../config')
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = JSON.parse(config.dev.env.NODE_ENV)
}
//可以打开url或其他类型的文件。会使用默认的打开软件来打开。比如打开一个图片。
const opn = require('opn')
const path = require('path')
const express = require('express')
const webpack = require('webpack')
const proxyMiddleware = require('http-proxy-middleware')
const webpackConfig = require('./webpack.dev.conf')

// default port where dev server listens for incoming traffic
const port = process.env.PORT || config.dev.port
// automatically open browser, if not set will be false
// 是否自动打开浏览器
const autoOpenBrowser = !!config.dev.autoOpenBrowser
// Define HTTP proxies to your custom API backend
// https://github.com/chimurai/http-proxy-middleware
// 代理请求的中间件。
const proxyTable = config.dev.proxyTable

const app = express()
const compiler = webpack(webpackConfig)
//处理webpack的中间件
const devMiddleware = require('webpack-dev-middleware')(compiler, {
  publicPath: webpackConfig.output.publicPath,
  quiet: true
})

//热刷新的中间件
const hotMiddleware = require('webpack-hot-middleware')(compiler, {
  log: false,
  heartbeat: 2000
})
// force page reload when html-webpack-plugin template changes
// currently disabled until this is resolved:
// https://github.com/jantimon/html-webpack-plugin/issues/680
// 热刷新
compiler.plugin('compilation', function (compilation) {
  compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
    hotMiddleware.publish({ action: 'reload' })
    cb()
  })
})

// enable hot-reload and state-preserving
// compilation error display
// 热刷新及状态保留
// 编译错误显示
app.use(hotMiddleware)

// proxy api requests
// 代理api请求。
Object.keys(proxyTable).forEach(function (context) {
  let options = proxyTable[context]
  if (typeof options === 'string') {
    options = { target: options }
  }
  app.use(proxyMiddleware(options.filter || context, options))
})

// handle fallback for HTML5 history API
// https://github.com/bripkens/connect-history-api-fallback
// 单页应用通常从一个页面进入，如index。如果从其他入口进来，需要把请求转向期望路径(index)，否则可能会返回404。
app.use(require('connect-history-api-fallback')({
  verbose: false,//是否打印记录
  index: '/index.html',//默认期望路径
  rewrites:[
    { from: /\/b/, to: '/index1.html'}
  ]
}))

// serve webpack bundle output
// webpack中间件使用
app.use(devMiddleware)

// serve pure static assets
// 静态资源请求解析
const staticPath = path.posix.join(config.dev.assetsPublicPath, config.dev.assetsSubDirectory)
app.use(staticPath, express.static('./static'))

const uri = 'http://localhost:' + port

var _resolve
var _reject
//模块导出一个promise。
var readyPromise = new Promise((resolve, reject) => {
  _resolve = resolve
  _reject = reject
})

var server
//获取可用的端口
var portfinder = require('portfinder')
//从basePort开始搜索可用端口，如从8080.
portfinder.basePort = port

console.log('> Starting dev server...')
//webpack编译完成
devMiddleware.waitUntilValid(() => {
  //找到可用端口
  portfinder.getPort((err, port) => {
    if (err) {
      //promise状态修改。
      _reject(err)
    }
    process.env.PORT = port
    var uri = 'http://localhost:' + port
    console.log('> Listening at ' + uri + '\n')
    // when env is testing, don't need open it
    if (autoOpenBrowser && process.env.NODE_ENV !== 'testing') {
      opn(uri)
    }
    server = app.listen(port)
    //promise状态修改。
    _resolve()
  })
})
//模块导出一个promise。一个关闭函数。
module.exports = {
  ready: readyPromise,
  close: () => {
    server.close()
  }
}
