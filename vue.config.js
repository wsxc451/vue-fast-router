const RouterCreatePlugin = require( './build/fast_route/RouterCreatePlugin.js' );
const configRoute = require( './build/fast_route/configRoute.js' );
module.exports = {
    publicPath: './',
    assetsDir: 'static',
    productionSourceMap: false,
    configureWebpack: {
        plugins: [
            new RouterCreatePlugin( configRoute )
        ]
    }
    // devServer: {
    //     proxy: {
    //         '/api':{
    //             target:'http://jsonplaceholder.typicode.com',
    //             changeOrigin:true,
    //             pathRewrite:{
    //                 '/api':''
    //             }
    //         }
    //     }
    // }
}