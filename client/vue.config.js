const {defineConfig} = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  devServer: {
    // 代理配置
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // 目标服务器地址
        changeOrigin: true, // 允许跨域
        pathRewrite: {'^/api': ''} // 重写路径
      },
      '/uploads': {
        target: 'http://localhost:3000', // 目标服务器地址
        changeOrigin: true, // 允许跨域
        pathRewrite: {'^/uploads': ''} // 重写路径
      }
    }
  },
  configureWebpack: {
    // 这里可以添加其他 Webpack 配置
    plugins: [
      new (require('webpack').DefinePlugin)({
        __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: JSON.stringify(true) // 定义特性标志
      })
    ]
  }
})
