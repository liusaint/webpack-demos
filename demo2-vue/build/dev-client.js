/* eslint-disable */
'use strict'
//下面的内容会随webpack一起打包到客户端中。由客户端调用。
// necessary for hot reloading with IE,IE调试时会用到
require('eventsource-polyfill')
//热刷新中间件有一部分是要加载到客户端使用。
var hotClient = require('webpack-hot-middleware/client?noInfo=true&reload=true')
//页面刷新事件？
hotClient.subscribe(function (event) {
  if (event.action === 'reload') {
    window.location.reload()
  }
})
