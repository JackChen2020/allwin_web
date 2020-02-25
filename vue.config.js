

const path = require('path');
function resolve (dir) {
    return path.join(__dirname, dir)
}

//开发环境
// const ServerUrl = "http://localhost:8001"

// 测试环境
// const ServerUrl = "http://47.244.129.198"

// 生产环境
const ServerUrl = "http://47.75.120.33"

module.exports = {
    // 基本路径
    publicPath: '/',

    outputDir: 'dist',

    lintOnSave: false,

    chainWebpack: (config)=>{
        //修改文件引入自定义路径
        config.resolve.alias
            .set('~', resolve('src'))

        //忽略的打包文件
        config.externals({
            'vue': 'Vue',
            'vue-router': 'VueRouter',
            'vuex': 'Vuex',
            'axios': 'axios',
            'element-ui': 'ELEMENT',
        })
    },
    configureWebpack: {
    },
    productionSourceMap: false,

    css: {

        extract: true,
        sourceMap: true,
        loaderOptions: {},
        modules: false
    },

    devServer: {
        open: process.platform === 'darwin',
        host: '0.0.0.0',
        port: 8080,
        // https: false,
        // hotOnly: false,
        proxy: {
            '/client_api': {
                // target: 'http://localhost:8000',
                target : ServerUrl,
                changeOrigin: true,
                ws: false

            },
            '/upload': {
                target: ServerUrl,
                // target : 'http://allwin6666',
                changeOrigin: true,
                ws: false,
            }
        }
    },
    // 第三方插件配置
    pluginOptions: {
        // ...
    }
}