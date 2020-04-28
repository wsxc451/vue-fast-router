const fs = require( "fs" );
const path = require( "path" );
const utils = require( "./routerUtil" );
const configRoute = require( "./configRoute.js" );
/**
 * 动态生成路由文件
 *
 * 1.读取所有的路由
 * 2.生成fastRoutes路由json文件,方便路由可配
 * 3.根据fastRoutes json文件 动态生成路由js文件
 */
var navbarRoutes = require( "../../src/router/data/data_navbar.js" );
var detailRoutes = require( "../../src/router/data/data_detail.js" );
// 根据node参数,计算出路由类型
/**
 * 如果node 传的有参数 router=development 则默认为使用自己的路由,否则使用全部路由
 */
let routeType = utils.findNodeParam( "router" );

class routerCreate {
  constructor ( configRoute ) {
    this.initRoutes = this.initRoutes.bind( this );
    this.createRoutesJsFile = this.createRoutesJsFile.bind( this );
    this.createRouteJson = this.createRouteJson.bind( this )
    this.findNavbarRoute = this.findNavbarRoute.bind( this )
    this.writePathsToFile = this.writePathsToFile.bind( this )
    this.configs = configRoute;
  }

  initRoutes() {
    return this.createRouteJson()
      .then( () => {
        return this.createRoutesJs()
          .then( () => {
            return Promise.resolve( true );
          } )
          .catch( err => Promise.reject( err ) );
      } )
      .catch( err => Promise.reject( err ) );
  }

  createRoutesJsFile() {
    return this.createRoutesJs()
      .then( () => {
        return Promise.resolve( true );
      } )
      .catch( err => Promise.reject( err ) );
  }

  /**
   * 路由json文件生成
   *如果已经存在fastRoutes.说明不需要再次生成了.可以注释掉一部分路由,加快编译速度
   */
  createRouteJson() {
    let navbarPaths = this.getPaths( navbarRoutes );
    let detailPaths = this.getPaths( detailRoutes );
    return this.writePathsToFile( navbarPaths, detailPaths )
      .then( data => Promise.resolve( true ) )
      .catch( err => Promise.reject( err ) );
  }

  /**
   * 根据路由信息,生成路由的json传, 写了2份,方便做开发跟正式环境切换
   * 可以根据开发需要,收到删除的fastRoutes_development.json里面的不相关的路由,这样编译起来就快了:>
   * @param {*} navbarRoutes
   * @param {*} detailRoutes
   */
  writePathsToFile( navbarRoutes, detailRoutes ) {
    let jsonStr = { navbar: navbarRoutes, detailRoutes: detailRoutes };
    let pro1 = utils.createJsonByOriRoute(
      this.configs.path.routerTempPath,
      this.configs.path.dev,
      jsonStr,
      false
    );
    // 修复一个新增路由路由不动态加入的bug, product要每次都生成新的json文件
    let pro2 = utils.createJsonByOriRoute(
      this.configs.path.routerTempPath,
      this.configs.path.production,
      jsonStr,
      true
    );
    return Promise.all( [ pro1, pro2 ] )
      .then( function () {
        return Promise.resolve( true );
      } )
      .catch( err => Promise.reject( err ) );
  }

  /**
   * 根据fastRoutes_development.json/fastRoutes_product的key ,动态生成路由js文件
   */
  createRoutesJs() {
    return new Promise( ( resolve, reject ) => {
      try {
        let routeTypePath =
          routeType == "development"
            ? this.configs.path.dev
            : this.configs.path.production;
        let fastRoutesPath = path.resolve(
          this.configs.path.routerTempPath,
          routeTypePath
        );
        console.log( fastRoutesPath + " 为当前环境的路由清单" );
        let fileContent = fs.readFileSync( fastRoutesPath, "utf-8" );
        let jsonRoutes = JSON.parse( fileContent.toString() );
        // this.getNavbarJsons( jsonRoutes.navbar );
        this.getDetailJsons( jsonRoutes.detailRoutes );
        resolve( true );
      } catch ( err ) {
        console.log( "createRoutesJs Error", err );
        reject( err );
      }
    } );
  }

  /**
   * 往菜单路由节点动态插入一个节点
   * @param {*} parentNode
   * @param {*} childNode
   * @param {*} tempRoutes
   */
  addRouteNode( parentNode, childNode, tempRoutes ) {
    let routeFind = tempRoutes.find( route => {
      return (
        route.name == parentNode.name &&
        route.permission == parentNode.permission
      );
    } );
    if ( routeFind ) {
      if ( routeFind.children ) {
        routeFind.children.push( childNode );
      } else {
        routeFind.children = [ childNode ];
      }
    } else {
      if ( parentNode.name ) {
        let parentNew = Object.assign( {}, parentNode, {
          children: [ childNode ]
        } );
        tempRoutes.push( parentNew );
      }
    }
  }

  /**
   * 往详情路由节点动态插入一个节点
   * @param {*} childNode
   * @param {*} tempRoutes
   */
  addDetailRouteNode( childNode, tempRoutes ) {
    let routeFind = tempRoutes.find( route => {
      return route.path == childNode.path;
    } );
    if ( !routeFind ) {
      let childNodeNew = Object.assign( {}, childNode );
      tempRoutes.push( childNodeNew );
    }
  }

  /**
   * 根据菜单的路由json,生成菜单路由js文件
   * @param {*} paths
   */
  getNavbarJsons( paths ) {
    var tempRoutes = [];
    paths.forEach( path => {
      let realRoutes = this.findNavbarRoute( path );
      this.addRouteNode( realRoutes.parentNode, realRoutes.childNode, tempRoutes );
    } );

    var bodyStr = JSON.stringify( tempRoutes, "", "\t" );
    bodyStr = this.handlerImportStr( bodyStr );
    var jsStr = `const navbar = ${bodyStr} \r\nexport default navbar `;
    utils.writeFileSync(
      "fast_navbar.js",
      path.resolve( this.configs.path.routerTempPath ),
      jsStr
    );
  }

  /**
   * 根据详情的路由json,生成详情页路由js文件
   * @param {*} paths
   */
  getDetailJsons( paths ) {
    var tempRoutes = [];
    paths.forEach( path => {
      let realRoutes = this.findDetailRoute( path );
      this.addDetailRouteNode( realRoutes.childNode, tempRoutes );
    } );

    var bodyStr = JSON.stringify( tempRoutes, "", "\t" );
    bodyStr = this.handlerImportStr( bodyStr );
    var jsStr = `const detail = ${bodyStr} \r\nexport default detail `;
    utils.writeFileSync(
      "fast_detail.js",
      path.resolve( this.configs.path.routerTempPath ),
      jsStr
    );
  }

  /**
   * 字符串处理
   * 处理前
   * 	"component": "@/pages/data/gmv.vue"
   * 处理后
   * "component": () => import( '@/pages/data/gmv.vue' )
   * @param {*} jsonStr
   */
  handlerImportStr( jsonStr ) {
    jsonStr = jsonStr.replace(
      /\"component\":\s?\"(.*)\"/g,
      "\"component\": () => import( '$1' )"
    );
    return jsonStr;
  }

  findNavbarRoute( path ) {
    let currentRoute = {};
    let parentRoute = {};
    navbarRoutes.forEach( navbar => {
      navbar.children.forEach( child => {
        if ( child.path == path ) {
          // 这里爬坑怕了很久,之前直接复制,结果是复制的地址,然后下次找就出错误了
          currentRoute = Object.assign( {}, child );
          parentRoute = Object.assign( {}, navbar );
        }
      } );
    } );
    let componentStr = this.handlerComponentStr( currentRoute.component );
    currentRoute.component = componentStr;
    parentRoute.children = [];
    return {
      childNode: currentRoute,
      parentNode: parentRoute
    };
  }

  /**
   * 正则处理获取路由的path
   * 原字符串
   * () => import( '@/pages/data/gmv.vue' )
   * 处理后字符串
   * @/pages/data/gmv.vue
   * @param {*} component
   */
  handlerComponentStr( component ) {
    var componentStr = "";
    if ( component ) {
      let comToString = component.toString();
      // 先去掉路径直接的空格
      comToString = comToString.replace( /\s/g, "" );
      // 再提取路径
      componentStr = comToString.replace( /.*\'(.*)\'.*/g, "$1" );
    }
    return componentStr;
  }

  /**
   * 查找详情页的路由信息
   * @param {*} path
   */
  findDetailRoute( path ) {
    let currentRoute = {};
    detailRoutes.forEach( detailRoute => {
      if ( detailRoute.path == path ) {
        // 这里爬坑怕了很久,之前直接复制,结果是复制的地址,然后下次找就出错误了
        currentRoute = Object.assign( {}, detailRoute );
      }
    } );
    let componentStr = this.handlerComponentStr( currentRoute.component );
    currentRoute.component = componentStr;
    return {
      childNode: currentRoute,
      parentNode: null
    };
  }

  /**
   * 根据路由数组,查找出所有的路由path,并返回
   * @param {*} dataArr
   */
  getPaths( dataArr ) {
    let paths = [];
    dataArr.forEach( element => {
      if ( element.children ) {
        element.children.forEach( child => {
          if ( child.path ) {
            paths.push( child.path );
          }
        } );
      } else {
        paths.push( element.path );
      }
    } );
    return paths;
  }
}

function getInstance( configRoute ) {
  var instance = null
  return function () {
    if ( !instance ) {
      instance = new routerCreate( configRoute );
    }
    return instance
  }
}

module.exports = getInstance( configRoute )()
