const path = require( "path" );
const rcp = require( './createRoute' )
class RouterCreatePlugin {
  // 在构造函数中获取用户给该插件传入的配置
  constructor ( options ) {
    // console.log('RouterCreatePlugin init', options)
    this.path = options.path
    this.isInit = false // 路由文件是否已经生成
    this.startTime = Date.now();
    this.prevTimestamps = {};
  }

  // Webpack 会调用 BasicPlugin 实例的 apply 方法给插件实例传入 compiler 对象
  apply( compiler ) {

    compiler.hooks.afterCompile.tap( 'after-compile', ( compilation ) => {
      // 把 HTML 文件添加到文件依赖列表，好让 Webpack 去监听 HTML 模块文件，在 HTML 模版文件发生变化时重新启动一次编译
      Object.keys( this.path ).forEach( pathKey => {
        if ( pathKey != 'routerTempPath' ) {
          let routerPath = path.join( this.path.routerTempPath, this.path[ pathKey ] )
          if ( !compilation.fileDependencies.has( routerPath ) ) {
            compilation.fileDependencies.add( routerPath );
          }
        }
      } )
    } );

    compiler.hooks.beforeCompile.tap( 'before-compile', ( compilation ) => {
      console.log( 'beforefter-compile' )
      if ( !this.isInit ) {
        // 避免重复创建路由文件,仅仅更新路由文件时,再次生成即可
        rcp.initRoutes().then( () => {
          this.isInit = true
        } )
      }
    } );
    // compiler.plugin( 'before-compile', ( compilation, callback ) => {
    //   // console.log('beforefter-compile')

    //   } else {
    //     callback();
    //   }
    // } );
    // 当依赖的文件发生变化时会触发 watch-run 事件
    // compiler.hooks.watchRun.tap( 'watch-run', ( compiler, callback ) => {
    //   // compiler.plugin( 'watch-run', ( watching, callback ) => {
    //   // 获取发生变化的文件列表
    //   console.log( 'watching.compiler' )
    //   const changedFiles = watching.compiler.watchFileSystem.watcher.mtimes;
    //   let fastRoutes_development = path.basename( this.path.dev ) || 'fastRoutes_development.json'
    //   let fastRoutes_product = path.basename( this.path.production ) || 'fastRoutes_product.json'
    //   let indexFind = Object.keys( changedFiles ).findIndex( item => {
    //     // let fastRoutes_development = 'fastRoutes_development.json';
    //     return item.indexOf( fastRoutes_development ) !== -1 || item.indexOf( fastRoutes_product ) !== -1
    //   } )
    //   // changedFiles 格式为键值对，键为发生变化的文件路径。
    //   if ( indexFind !== -1 ) {
    //     rcp.createRoutesJsFile().then( () => {
    //       console.log( '快速路由文件更新,重新生成路由文件,编译完成后,请手动刷新页面' )
    //       callback();
    //     } )
    //   } else {
    //     callback();
    //   }

    // } );


    compiler.hooks.watchRun.tap( "watchRun", () => {
      /** 校验页面入口是否增加 */
      console.log( 'compiler.hooks.watchRun' )
      const changedFiles = compiler.watchFileSystem.watcher.mtimes;
      console.log( changedFiles )
      // let fastRoutes_development = path.basename( this.path.dev ) || 'fastRoutes_development.json'
      // let fastRoutes_product = path.basename( this.path.production ) || 'fastRoutes_product.json'
      // let indexFind = Object.keys( changedFiles ).findIndex( item => {
      //   // let fastRoutes_development = 'fastRoutes_development.json';
      //   return item.indexOf( fastRoutes_development ) !== -1 || item.indexOf( fastRoutes_product ) !== -1
      // } )
    } );
  }
}

// 导出 Plugin
module.exports = RouterCreatePlugin;
