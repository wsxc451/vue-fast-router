const fs = require( 'fs' )
const path = require( 'path' )

Date.prototype.format = function ( fmt ) {
  var o = {
    "M+": this.getMonth() + 1,                 //月份
    "d+": this.getDate(),                    //日
    "h+": this.getHours(),                   //小时
    "m+": this.getMinutes(),                 //分
    "s+": this.getSeconds(),                 //秒
    "q+": Math.floor( ( this.getMonth() + 3 ) / 3 ), //季度
    "S": this.getMilliseconds()             //毫秒
  };
  if ( /(y+)/.test( fmt ) ) {
    fmt = fmt.replace( RegExp.$1, ( this.getFullYear() + "" ).substr( 4 - RegExp.$1.length ) );
  }
  for ( var k in o ) {
    if ( new RegExp( "(" + k + ")" ).test( fmt ) ) {
      fmt = fmt.replace( RegExp.$1, ( RegExp.$1.length == 1 ) ? ( o[ k ] ) : ( ( "00" + o[ k ] ).substr( ( "" + o[ k ] ).length ) ) );
    }
  }
  return fmt;
}

// node下日志调试小工具
exports.log = function ( msg ) {
  let dateStr = ( new Date() ).format( "yyyy_MM_dd" );
  let fileName = dateStr + '_log.log'
  let outFile = path.resolve( __dirname, fileName )
  fs.exists( outFile, () => {
    var log = fs.createWriteStream( outFile, { 'flags': 'a' } );
    if ( typeof ( msg ) !== 'string' ) {
      msg = JSON.stringify( msg )
    }
    log.write( `${( new Date() ).format( "yyyy-MM-dd hh:mm:ss" )} : ` + msg + '\n' );
  }, () => {
    fs.writeFile( outFile, `${( new Date() ).format( "yyyy-MM-dd hh:mm:ss" )} : ` + msg + '\n', function ( err, data ) { } )
  } )
}

// 根据字符串生成路由.js文件 异步
exports.writeFile = function ( fileName, pathUrl, context, forceWrite = false, isAppend = false ) {
  let outFile = path.resolve( pathUrl, fileName )
  if ( typeof ( context ) !== 'string' ) {
    context = JSON.stringify( context, '', '\t' )
  }
  if ( fs.existsSync( outFile ) ) {
    if ( forceWrite ) { //如果强制重新创建
      var log = fs.createWriteStream( outFile, { 'flags': 'w' } );
      log.write( context );
    } else {
      if ( isAppend ) {
        var log = fs.createWriteStream( outFile, { 'flags': 'a' } );
        log.write( context );
      }
    }
  } else {
    fs.writeFile( outFile, context, function ( err, data ) { } )
  }
}


// 根据字符串生成路由.js文件同步写入
exports.writeFileSync = function ( fileName, pathUrl, context) {
  let outFile = path.resolve( pathUrl, fileName )
  if ( typeof ( context ) !== 'string' ) {
    context = JSON.stringify( context, '', '\t' )
  }
  fs.writeFileSync(outFile,context);
  console.log( outFile + ' 生成成功!')
}

// 根据解析出的的路由对象,生成路由json文件
exports.createJsonByOriRoute = function ( filePath, fileName, context, forceWrite = false ) {
  return new Promise( ( resolve , reject )=>{
    // let filePath = path.resolve( __dirname, '../src/router/temp/' )
    let outFile = path.resolve( filePath, fileName )
    if ( typeof ( context ) !== 'string' ) {
      context = JSON.stringify( context, '', '\t' )
    }
    if ( fs.existsSync( outFile ) ) {
      if ( forceWrite ) { //如果强制重新创建
        fs.writeFileSync( outFile, context  );
        console.log( outFile + ' 强制重新生成成功!' )
      } else {
        console.log( outFile + ' 已经存在,不再次生成,如需更新,请手动删除' )
      }
      resolve(true);
    } else {
      if ( !fs.existsSync( filePath ) ) {
        fs.mkdirSync( filePath, 0777 );
      }
      fs.writeFileSync( outFile, context )
      resolve(true);
      console.log( outFile + ' 生成成功!可以注释掉部分路由,方便快速开发调试' )
    }
  } );
}

// 查询node环境变量,如果不存在返回'', 使用闭包,避免多次查询
exports.findNodeParam =  ( (keyWrap)=> {
  const params = getNodeParams()
  return ( key ) => {
    return params[ key ] ? params[ key ] : ''
  }
})()

// 获取node环境下的环境变量键值对, 传参形式为  key1=value1 key2=value2
function getNodeParams() {
  let count = process.argv.length
  if ( count < 2 ) {
    return []
  }
  let params = []
  for ( let i = 2; i < count; i++ ) {
    let str = process.argv[ i ]
    let arr = str.split( '=' )
    params[ arr[ 0 ] ] = arr[ 1 ]
  }
  return params
}
