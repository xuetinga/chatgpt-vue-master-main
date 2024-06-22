const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: './',
  devServer: {
    host: '192.168.1.4', // 使服务器可通过网络访问
    port: 8080, // 您可以根据需要更改端口
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
