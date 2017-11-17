<h1 align="center">connect-history-api-fallback</h1>
<p align="center">Middleware to proxy requests through a specified index page, useful for Single Page Applications that utilise the HTML5 History API.
代理请求到指定的index页面。对于使用HTML5的History API的单页应用是很有用的。
History模式可以参考vue-router的说明：https://router.vuejs.org/zh-cn/essentials/history-mode.html。
</p>

[![Build Status](https://travis-ci.org/bripkens/connect-history-api-fallback.svg?branch=master)](https://travis-ci.org/bripkens/connect-history-api-fallback)
[![Dependency Status](https://david-dm.org/bripkens/connect-history-api-fallback/master.svg)](https://david-dm.org/bripkens/connect-history-api-fallback/master)

[![NPM](https://nodei.co/npm/connect-history-api-fallback.png?downloads=true&downloadRank=true)](https://nodei.co/npm/connect-history-api-fallback/)


<h2>Table of Contents目录</h2>

<!-- TOC depthFrom:2 depthTo:6 withLinks:1 updateOnSave:1 orderedList:0 -->

- [Introduction 说明](#introduction)
- [Usage 使用](#usage)
- [Options 配置项](#options)
	- [index 索引路径](#index)
	- [rewrites 重写路径](#rewrites)
	- [verbose 是否打印记录](#verbose)
	- [htmlAcceptHeaders 满足的请求类型](#htmlacceptheaders)
	- [disableDotRule 是否禁用点规则](#disabledotrule)

<!-- /TOC -->

## Introduction 介绍

Single Page Applications (SPA) typically only utilise one index file that is
accessible by web browsers: usually `index.html`. Navigation in the application
is then commonly handled using JavaScript with the help of the
[HTML5 History API](http://www.w3.org/html/wg/drafts/html/master/single-page.html#the-history-interface).
This results in issues when the user hits the refresh button or is directly
accessing a page other than the landing page, e.g. `/help` or `/help/online`
as the web server bypasses the index file to locate the file at this location.
As your application is a SPA, the web server will fail trying to retrieve the file and return a *404 - Not Found*
message to the user.

This tiny middleware addresses some of the issues. Specifically, it will change
the requested location to the index you specify (default being `/index.html`)
whenever there is a request which fulfills the following criteria:

 1. The request is a GET request
 2. which accepts `text/html`,
 3. is not a direct file request, i.e. the requested path does not contain a
    `.` (DOT) character and
 4. does not match a pattern provided in options.rewrites (see options below)

单页应用通常浏览器可访问一个index文件：通常是`index.html`。在应用中通常让JavaScript用[HTML5 History API](http://www.w3.org/html/wg/drafts/html/master/single-page.html#the-history-interface)来修改url（Navigation相关信息）而不跳转页面。
当用户点击刷新页面按钮或直接输入某个首页以外的地址，比如 `/help` 或 `/help/online`访问的时候，服务器收到请求会根据这个路径去定位文件。而你的应用是单页应用，服务器端可能没有对应文件或对应路径的路由信息，服务端就会返回一个404消息给用户。
这个中间件可以处理这种问题，它会修改请求地址到期望的索引页面（默认是`/index.html`）。

被改写的请求要满足下面的条件：

 1. get请求。
 2. 请求期望返回的格式是`text/html`。
 3. 不是一个直接的文件请求。不包含一个.(点)。a.js。
 4. 不匹配options.rewrites中的表达式。(因为它有自已特殊的匹配规则)

## Usage 用法

The middleware is available through NPM and can easily be added.
npm安装

```
npm install --save connect-history-api-fallback
```

Import the library
引用

```javascript
var history = require('connect-history-api-fallback');
```

Now you only need to add the middleware to your application like so
在应用中使用

```javascript
var connect = require('connect');

var app = connect()
  .use(history())
  .listen(3000);
```

Of course you can also use this piece of middleware with express:
在express中使用

```javascript
var express = require('express');

var app = express();
app.use(history());
```

## Options 配置
You can optionally pass options to the library when obtaining the middleware
使用此中间件的时候可以传递一些配置项

```javascript
var middleware = history({});
```

### index 索引路径
Override the index (default `/index.html`)
默认代理到的请求地址 `/index.html`。

```javascript
history({
  index: '/default.html'
});
```

### rewrites　重写路径
Override the index when the request url matches a regex pattern. You can either rewrite to a static string or use a function to transform the incoming request.

当请求能匹配from正则表达式，就定位到到to指定的路径。to可以传入一个字符串也可以传入一个函数来生成要定位的路径。

The following will rewrite a request that matches the `/\/soccer/` pattern to `/soccer.html`.

下面的例子会将匹配表达式 `/\/soccer/`的请求定位给`/soccer.html`
```javascript
history({
  rewrites: [
    { from: /\/soccer/, to: '/soccer.html'}
  ]
});
```

Alternatively functions can be used to have more control over the rewrite process. For instance, the following listing shows how requests to `/libs/jquery/jquery.1.12.0.min.js` and the like can be routed to `./bower_components/libs/jquery/jquery.1.12.0.min.js`. You can also make use of this if you have an API version in the URL path.

使用函数可以对重写过程有更多的控制。比如下面的配置将类似`/libs/jquery/jquery.1.12.0.min.js`的请求路由到`./bower_components/libs/jquery/jquery.1.12.0.min.js`。如果你的API有版本控制也可以在这里做一些处理。
```javascript
history({
  rewrites: [
    {
      from: /^\/libs\/.*$/,
      to: function(context) {
        return '/bower_components' + context.parsedUrl.pathname;
      }
    }
  ]
});
```

The function will always be called with a context object that has the following properties:

function总是带有一个参数context，它包含下面几个属性：

 - **parsedUrl**: Information about the URL as provided by the [URL module's](https://nodejs.org/api/url.html#url_url_parse_urlstr_parsequerystring_slashesdenotehost) `url.parse`.使用node的url模块url.parse处理后的url信息。
 - **match**: An Array of matched results as provided by `String.match(...)`.匹配到的项。
 - **request**: The HTTP request object.http请求对象request。　


### verbose 是否打印记录
This middleware does not log any information by default. If you wish to activate logging, then you can do so via the `verbose` option or by specifying a logger function.

这个中间件默认不会打印任何信息出来。如果你想激活打印功能，可以通过设置`verbose:true`或者传递一个指定的用于打印的函数`logger:function(){}`

```javascript
history({
  verbose: true
});
```

Alternatively use your own logger
或者使用您自己的日志记录器

```javascript
history({
  logger: console.log.bind(console)
});
```

### htmlAcceptHeaders 符合的请求类型
Override the default `Accepts:` headers that are queried when matching HTML content requests (Default: `['text/html', '*/*']`).

覆盖默认的Accepts请求头。默认的是`['text/html', '*/*']`

```javascript
history({
  htmlAcceptHeaders: ['text/html', 'application/xhtml+xml']
})
```

### disableDotRule 是否禁用点规则
Disables the dot rule mentioned above:

禁用上面提到的点规则。

> […] is not a direct file request, i.e. the requested path does not contain a `.` (DOT) character […]

```javascript
history({
  disableDotRule: true
})
```



中间件原始地址：https://github.com/bripkens/connect-history-api-fallback