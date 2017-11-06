'use strict'
const path = require('path')
const config = require('../config')
// 该插件的主要是为了抽离css样式,防止将样式打包在js中引起页面样式加载错乱的现象
// https://github.com/zhengweikeng/blog/issues/9　webpack中对样式的处理
const ExtractTextPlugin = require('extract-text-webpack-plugin')

//返回相对生成的dist/static的绝对路径。
exports.assetsPath = function (_path) {
  const assetsSubDirectory = process.env.NODE_ENV === 'production'
    ? config.build.assetsSubDirectory
    : config.dev.assetsSubDirectory
  return path.posix.join(assetsSubDirectory, _path)
}

exports.cssLoaders = function (options) {
  options = options || {}

  //css loader
  const cssLoader = {
    loader: 'css-loader',
    options: {
      minimize: process.env.NODE_ENV === 'production',
      sourceMap: options.sourceMap
    }
  }

  // generate loader string to be used with extract text plugin
  // 生成用于抽离css的string?
  // 默认会包含css-loader
  function generateLoaders (loader, loaderOptions) {
    const loaders = [cssLoader]
    if (loader) {
      loaders.push({
        loader: loader + '-loader',
        options: Object.assign({}, loaderOptions, {
          sourceMap: options.sourceMap
        })
      })
    }

    // Extract CSS when that option is specified
    // (which is the case during production build)
    // 如果然需要抽离
    if (options.extract) {
      return ExtractTextPlugin.extract({
        use: loaders,// 指需要什么样的loader去编译文件
        fallback: 'vue-style-loader'// 编译后用什么loader来提取css文件
      })
    } else {
      return ['vue-style-loader'].concat(loaders)
    }
  }

  // https://vue-loader.vuejs.org/en/configurations/extract-css.html
  // 返回各种css预处理的loader生成的结果。
  return {
    css: generateLoaders(),
    postcss: generateLoaders(),
    less: generateLoaders('less'),
    sass: generateLoaders('sass', { indentedSyntax: true }),
    scss: generateLoaders('sass'),
    stylus: generateLoaders('stylus'),
    styl: generateLoaders('stylus')
  }
}

// Generate loaders for standalone style files (outside of .vue)
// 为单独的style文件生成loaders.
// 会生成以上所有的loaders。
exports.styleLoaders = function (options) {
  const output = []
  const loaders = exports.cssLoaders(options)
  for (const extension in loaders) {
    const loader = loaders[extension]
    output.push({
      test: new RegExp('\\.' + extension + '$'),
      use: loader
    })
  }
  return output
}
