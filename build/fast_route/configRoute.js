const path = require( 'path' )
// 快速路由配置文件
const fastRouteConfig = {
  path: {
    routerTempPath: path.resolve( __dirname, '../../src/router/temp/' ),
    dev: 'fastRoutes_dev.json',
    production: 'fastRoutes_product.json'
  }
}
module.exports = fastRouteConfig
