const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: './',
  devServer: {
    hot: true,//自动保存
    proxy: {
      // 接口是以 /api 开头的需要代理
      '/': {
        target: `http://172.20.10.2:8000/`, // 代理接口地址。实际请求接口地址会是：https://api.mz-moe.cn/api/xxx/xxx
        changeOrigin: true, // 默认false，是否需要改变原始主机头为目标URL
        ws: true, // 是否代理websockets
      },
    },
  },
})
