/*
1.合并基础的webpack配置
2.配置样式文件的处理规则，styleLoaders
3.配置webpack的输出
4.配置webpack插件
5.gzip模式下的webpack插件配置
6.webpack-bundle分析 */

'use strict';
const path = require('path');
// node.js的文件路径，用来处理文件当中的路径问题

// 引入webpack模块
const webpack = require('webpack');

const CopyWebpackPlugin = require('copy-webpack-plugin');

const merge = require('webpack-merge');
// 将基础配置和开发环境配置或者生产环境配置合并在一起的包管理

const baseWebpackConfig = require('./webpack.base.config');
// 引入基本webpack基本配置

const miniCssExtractPlugin=require("mini-css-extract-plugin"); // css单独提取打包

// 一个用来压缩优化JS大小的东西
const VueLoaderPlugin = require('vue-loader/lib/plugin');

const os = require('os');
const HappyPack = require('happypack');
// 多线程构建
const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length }); // 构造出共享进程池，进程池中包含os.cpus().length个子进程
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin; // 添加打包分析插件

// 引入生产环境
const webpackConfig = merge(baseWebpackConfig,{
  mode: 'production',
  // 这一部分会单独打包成类库文件，方便浏览器缓存 会生成一个vendor.js代码,包含类库代码
  entry: './src/plugin/index.js',
  // entry: {
  //   main: './src/plugin/index.js', // 主入口文件
  //   mainUtils: [                            // 强制合并的依赖
  //     './src/plugin/directive.js',
  //     './src/plugin/js/index.js'
  //   ]
  //   // texChtml: './src/plugin/js/tex-chtml.js.js', // 另一个入口文件
  // },
  output: {
    filename: 'cmelement.js',
    chunkFilename: 'cmelement.chunk.[contenthash:8].js', // 👈 清晰命名
    library: 'cmelement', // UMD 全局变量名
    libraryTarget: 'umd', // 支持多种模块规范
    umdNamedDefine: true, // AMD 命名导出
    globalObject: 'this', // 兼容浏览器和 Node.js
    libraryExport: 'default', // 将默认导出设为库的入口（关键）
    publicPath: '',
    
  },
  externals: {
    // 'xgplayer': {
    //   commonjs: 'xgplayer',
    //   commonjs2: 'xgplayer',
    //   amd: 'xgplayer',
    //   root: 'Player' // 根据实际全局变量名调整
    // },
    // 'xgplayer-hls': {
    //   commonjs: 'xgplayer-hls',
    //   commonjs2: 'xgplayer-hls',
    //   amd: 'xgplayer-hls',
    //   root: 'HlsPlugin' // 根据实际全局变量名调整
    // },
    // 'js-md5': {
    //   commonjs: 'js-md5',
    //   commonjs2: 'js-md5',
    //   amd: 'js-md5',
    //   root: 'md5'
    // },
    // 'zego-express-whiteboard-web': {
    //   commonjs: 'zego-express-whiteboard-web',
    //   commonjs2: 'zego-express-whiteboard-web',
    //   amd: 'zego-express-whiteboard-web',
    //   root: 'ZegoWhiteboard'
    // },
    // 'zego-express-docsview-web': {
    //   commonjs: 'zego-express-docsview-web',
    //   commonjs2: 'zego-express-docsview-web',
    //   amd: 'zego-express-docsview-web',
    //   root: 'ZegoExpressDocs'
    // }
  },
  module: {
    rules: [
      
    ]
  },
  optimization: {
    // ① 启用代码分割（推荐 all：初始包+异步包都分割）
    splitChunks: false,
    // 运行时任你决定要不要抽
    runtimeChunk: false,
    // 确保业务代码不被拆分
    moduleIds: 'hashed',
    chunkIds: 'named',  // 保持可读的 chunk 名称
    providedExports: true, // 启用提供的导出
    usedExports: true, // 启用使用的导出
    concatenateModules: false, // 启用模块合并
    minimize: true, // 启用代码压缩
    sideEffects: false, // 禁用副作用分析
  },
  plugins: [
    // new miniCssExtractPlugin({filename: 'css/main.css'}),
    // 生成hash值的css文件名
    new miniCssExtractPlugin({
      filename: 'css/main.css',
      chunkFilename: 'css/[name].chunk.[contenthash:8].css'
    }),
    
    new VueLoaderPlugin(),
    
    new HappyPack({
      id: 'babeljs',
      loaders: ['babel-loader?cacheDirectory=true'],
      threadPool: happyThreadPool, // 使用共享进程池中的子进程去处理任务
      verbose: true,
      debug: true
    }),
    
    // 将 static 目录下所有文件复制到 dist/static 下
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../mathjax'),
        to: 'mathjax',
      },{
        from: path.resolve(__dirname, '../hls'),
        to: 'hls',
      },
    ]),
    // 打包分析插件（可选）
    // new BundleAnalyzerPlugin({
    //   analyzerMode: 'static', // 生成静态HTML报告
    //   openAnalyzer: false, // 不自动打开报告
    //   reportFilename: 'bundle-report.html'
    // })

  ]
});

module.exports = webpackConfig;