
"use strict"

import Sizzle from './sizzle';

const jQuery = function( selector, context ) {
  return new jQuery.prototype.init( selector, context );
}

const version = 'copy';

var arr = [];

var document = window.document;

var getProto = Object.getPrototypeOf;

var slice = arr.slice;

var concat = arr.concat;

var push = arr.push;

var indexOf = arr.indexOf;

var class2type = {};

var toString = class2type.toString;

var hasOwn = class2type.hasOwnProperty;

var fnToString = hasOwn.toString;

var ObjectFunctionString = fnToString.call( Object ); // Object constructor function to String

var support = {};

var isFunction = function isFunction( obj ) {

      // Support: Chrome <=57, Firefox <=52
      // In some browsers, typeof returns "function" for HTML <object> elements
      // (i.e., `typeof document.createElement( "object" ) === "function"`).
      // We don't want to classify *any* DOM node as a function.
      return typeof obj === "function" && typeof obj.nodeType !== "number";
  };


var isWindow = function isWindow( obj ) {
		return obj != null && obj === obj.window;
};


/**
 * [ 保留的 script 节点属性 ]
 * @type {Object}
 */
var preservedScriptAttributes = {
	type: true,
	src: true,
	noModule: true
};

/**
 * [ 执行全局 js ]
 * @param       {[type]} code [ 要执行的 js 代码 ]
 * @param       {[type]} doc  [ 执行的上下文环境 ]
 * @param       {[type]} node [ 属性配置对象 ]
 */
function DOMEval( code, doc, node ) {
	doc = doc || document;

	var i,
		script = doc.createElement( "script" );

	script.text = code;
	if ( node ) {
		for ( i in preservedScriptAttributes ) {
			if ( node[ i ] ) {
				script[ i ] = node[ i ];
			}
		}
	}
	doc.head.appendChild( script ).parentNode.removeChild( script );
}

/**
 * [ 将对象类型转化成字符串形式 ]
 * @param  {[type]} obj [description]
 * @return {[type]}     [description]
 * @desc
 * 1、如果 typeof 的返回值是 object 或 function，并不能确定实际类型是什么
 *  （1）首先去 class2type 中找对照，如果没有，就是 object 对象
 * 2、如果 typeof 的返回值不是 object 和 function，用该返回值就能确认对象类型
 * 3、注意，调用的 toString 一定是 Object 原型里的 toString，一些类会自己实现 toString，会有不同的行为
 *   所以只能用 toString.call() 来调用，而不能用 obj.toString()
 */
function toType( obj ) {
	if ( obj == null ) {
		return obj + "";
	}

	// Support: Android <=2.3 only (functionish RegExp)
	return typeof obj === "object" || typeof obj === "function" ?
		class2type[ toString.call( obj ) ] || "object" :
		typeof obj;
}

// 匹配行首行尾空格
var rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;

/**
 * [ jQUery 原型核心 ]
 * @type {Function}
 */
jQuery.fn = jQuery.prototype = {

  constructor: jQuery,

  jquery: version,

  length: 0,

  /**
   * [ 转数组方法 ]
   * @return {[type]} [description]
   * @desc jQuery 实例本身继承了数组特性，该方法能将 jQuery 对象转化成元素集合数组
   */
  toArray: function() {
    return slice.call( this );
  },

  /**
   * [ 根据下标获取 jQuery 实例中的元素节点 ]
   * @param  {[type]} num [ 下标值 ]
   * @return {[type]}     [ elememt ]
   * @desc
   * 1、如果传入空，将返回所有
   * 2、传入负数就逆向获取
   */
  get: function( num ) {

		// Return all the elements in a clean array
		if ( num == null ) {
			return slice.call( this );
		}

		// Return just the one element from the set
		return num < 0 ? this[ num + this.length ] : this[ num ];
	},

  /**
   * [ 实现实例回溯的核心方法 ]
   * @param  {[type]} elems [ 新的元素集合 ]
   * @return {[type]}       [ 新的就 Query 实例 ]
   * @desc
   * 1、用传入的元素节点构造 jQuery 对象并返回
   * 2、将原有对象的引用保存在 prevObject 中
   */
  pushStack: function( elems ) {

    var ret = jQuery.merge( this.constructor(), elems );

    ret.prevObject = this;

    return ret;

  },

  each: function( callback ) {
    return jQuery.each( this, callback );
  },

  // map 调用了回溯方法，可以格式化节点
  map: function( callback ) {
    return this.pushStack( jQuery.map( this, function( elem, i ) {
      return callback.call( elem, i, elem );
    } ) );
  },

  // slice 调用了回溯方法
  slice: function() {
    return this.pushStack( slice.apply( this, arguments ) );
  },

  // 语法糖，注意返回的是 jQuery 对象而不是节点对象
  first: function() {
    return this.eq( 0 );
  },

  last: function() {
    return this.eq( -1 );
  },

  eq: function( i ) {
    var len = this.length,
      j = +i + ( i < 0 ? len: 0 );
    return this.pushStack( j >= 0 && j < len ? [ this[ j ] ] : [] );
  },

  // 进行回溯，回到上一个对象中
  end: function() {
    return this.prevObject || this.constructor();
  },

  // 继承数组的方法
  push: push,

  sort: arr.sort,

  splice: arr.splice,

}

/**
 * [ jQuery 与其原型扩展核心方法 ]
 * @return {[type]} [ 返回扩展后的 jQuery 对象或原型对象 ]
 * @desc
 * 1、入参，参数顺序为 deep、target、source
 * 2、先根据传参类型对参数进行修正，修正后 i 始终指向第一个 source，即合并源
 * 3、参数修正的判断逻辑：
 *  （1）默认 0 号位为 target，i 指向第一个 source
 *  （2）如果第一参数为 boolean 类型，说明是 deep 参数，则 1 号位为 target，i 向后移动一位，同样指向第一个 source
 *  （3）如果 target 不是 object，修正为 {}
 *  （4）如果 i === length，说明按原有逻辑 source 为空，约定上 source 不可能为空，
 *      所以将 target 作为 source 处理，target 为 this，i 回退指向原本 target 的位置
 * 4、对每一个 source 将其合并到 target 中，用 options 来临时储存每一个 source
 * 5、src 用来存储 target 中的原值，copy 用来存储 options 中的新值
 * 6、如果是非 deep 模式，就直接将 copy 混入到 target 中
 * 7、如果是 deep 模式，则要检验 copy，copy 必须为普通对象或数组，这样才有深度合并的可能
 *  （1）根据 copy 的类型修正相应的 src，实际上使用 clone 来保存的，clone 即是修正后的 src
 *  （2）将 copy 合并到 clone 里，并将合并后的值混入 target
 */
jQuery.extend = jQuery.fn.extend = function() {
  var
    options,
    target = arguments[0] || {},
    i = 1,
    length = arguments.length,
    copy,
    copyIsArray,
    src,
    clone,
    deep = false;

    if( typeof target === 'boolean' ) {
      deep = target;
      target = arguments[1] || {};
      i++;
    }

    if( typeof target !== 'object' ) {
      target = {};
    }

    if( i === length ) {
      target = this;
      i--;
    }

    for ( ; i < length; i++ ) {
      if( (options = arguments[i]) != null ) {
        for( name in options ) {
          src = target[name];
          copy = options[name];

          // prevent endless loop, like window.window = window
          if( target === copy ) {
            continue;
          }

          // copy is existed and is plain object or array
          if( deep && copy && ( jQuery.isPlainObject( copy ) ||
          ( copyIsArray = Array.isArray( copy ) ) ) ) {
            // do recurse extend

            // if copy is Array
            if ( copyIsArray ) {
  						copyIsArray = false; // reset vaule for next loop
              // check whether the src contain the prop
  						clone = src && Array.isArray( src ) ? src : [];

  					} else {
              // situation that copy is plain object
              // check whether src is plain object
  						clone = src && jQuery.isPlainObject( src ) ? src : {};
  					}

  					// Never move original objects, clone them
  					target[ name ] = jQuery.extend( deep, clone, copy );

          } else if( copy !== undefined ) {
            target[ name ] = copy
          }
        }
      }
    }

    return target;
}

// jQuery 核心模块
jQuery.extend({

  // Unique for each copy of jQuery on the page
	expando: "jQuery" + ( version + Math.random() ).replace( /\D/g, "" ),

	// Assume jQuery is ready without the ready module
	// 在没有混入 ready 模块之前都假定是 ready 状态
	isReady: true,

  // 封装异常行为
	error: function( msg ) {
		throw new Error( msg );
	},

  // 封装默认行为
	noop: function() {},

  /**
   * [ 检测是否为平凡对象 ]
   * @param {[type]} obj [ 需要检测的对象 ]
   * @return {[type]} [ true or false ]
   * @desc
   * 1、逐级判断，能优先判断出 false 能提高函数效率
   * 2、首先确认 obj 是对象
   * 3、如果 obj 没有原型，则认为是特例，是由 Object.create(null) 创建，属于 plainObject
   * 4、从原型中获取 obj 的构造器，判断构造器对应的对象类型，如果是 Object，则是 plainObject
   * 5、注：ObjectFunctionString 的值为 'function Object() { [native code] }'
   */
  isPlainObject: function( obj ) {
    var proto, Ctor;

    // null is not plainObject
    if( !obj || toString.call( obj ) !== "[object Object]" ) {
      return false;
    }

    proto = getProto( obj );

    // but Object.create(null) is plainObject
    // all object created by Object.creat() is plainObject
    if( !proto ) {
      return true;
    }

    // if has prototype, get obj's constructor
    Ctor = hasOwn.call( proto, "constructor" ) && proto.constructor;

    // if constructor is function and is created by Object
		return typeof Ctor === "function" && fnToString.call( Ctor ) === ObjectFunctionString;
  },

  /**
   * [ 判断是否为空对象 ]
   * @param {[type]} obj [description]
   * @return {[type]} [description]
   */
  isEmptyObject: function( obj ) {
    var name;
    for ( name in obj ) {
      return false;
    }
    return true;
  },

  /**
   * [ 全局执行 js 代码 ]
   * @param {[type]} code [ 执行的代码 ]
   * @return {[type]} [description]
   */
  globalEval: function( code ) {
    DOMEval( code );
  },

  /**
   * [ 对数组的 forEach 进行了扩展，除了遍历数组，还能遍历对象 ]
   * @param {[type]}   obj      [ 所要遍历的集合 ]
   * @param {Function} callback [ 对集合中的每个元素进行的操作 ]
   * @return {[type]}   [description]
   * @desc
   * 1、如果 callback 返回 false，就停止遍历
   */
  each: function( obj, callback ) {
    var length, i = 0;

    if ( isArrayLike( obj ) ) {
      length = obj.length;
      for ( ; i < length; i++ ) {
        if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {
          break;
        }
      }
    } else {
      for ( i in obj ) {
        if ( callback.call( obj[ i ], i, obj[ i ]) === false ) {
          break;
        }
      }
    }

    return obj;
  },

  // 除去文本的前后空格
  trim: function( text ) {
    return text === null ?
      "" :
      ( text + "" ).replace( rtrim, "");
  },

  /**
   * [description]
   * @param {[type]} arr    [ target ]
   * @param {[type]} result [ 结果载体 ]
   * @return {[type]} [description]
   * @desc
   * 1、arr 可能是 arrayLike 的对象和非 arrayLike 的对象
   * 2、string 也是 arrayLike 对象，但是要按照非 arrayLike 的对象处理
   * 3、arrayLike 对象调用 merge 方法处理（String 除外），非 arrayLike 调用 push 方法
   */
  makeArray: function( arr, result ) {
    var ret = result || [];
    if ( arr != null ) {
      if ( isArrayLike( Object( arr ) ) ) {
        jQuery.merge( ret, typeof arr === 'string' ? [ arr ] : arr );
      } else {
        push.call( ret, arr );
      }
    }
    return ret;
  },

  // 判断一个元素是否在数组中的 i 位置
  inArray: function( ele, array, i ) {
    return ele === null ? -1 : indexOf.call( array, ele, i );
  },

  /**
   * [ 将两个数组合并，将 second 拼接在 first 后 ]
   * @desc
   * 1、与数组的 concat 类似，但是 jQuery 没有继承数组的 concat 方法，用该方法来代替
   */
  merge: function( first, second ) {
    var len = +second.length,
      j = 0,
      i = first.length;
      for ( ; j < len; j++ ) {
        first[ i++ ] = second[ j ];
      }
      first.length = i;
      return first;
  },

  /**
   * [ 用 callback 对集合进行过滤 ]
   * @param {[type]}   elems    [ 元素集合 ]
   * @param {Function} callback [ 过滤方法 ]
   * @param {[type]}   invert   [ 是否反转 ]
   * @return {[type]}   [ 过滤后的集合 ]
   */
  grep: function( elems, callback, invert ) {
    var len,
      i = 0,
      matches = [],
      callbackInverse,
      callbackExpect = !invert;
      for ( ; i < len; i++ ) {
        callbackInverse = !callback( elems[ i ], i );
        if ( callbackInverse !== callbackExpect ) {
          matches.push( elems[ i ] );
        }
      }
      return matches;
  },

  /**
   * [ 用 callback 对 elems 中每个元素进行重构 ]
   * @param {[type]}   elems    [ 元素集合 ]
   * @param {Function} callback [ 重构函数 ]
   * @param {[type]}   arg      [ callback 执行时参数 ]
   * @return {[Array]}   [ 返回重构后的元素集合，为数组 ]
   * @desc
   * 1、可以对数组和对象进行
   */
  map: function( elems, callback, arg ) {
    var len = elems.length,
      value,
      i = 0,
      ret = [];
      if ( isArrayLike( elems ) ) {
        len = elems.length;
        for ( ; i < len; i++ ) {
          value = callback( elems[ i ], i, arg );
          if ( value != null ) {
            ret.push( value );
          }
        }
      } else {
        for ( i in elems ) {
          value = callback( elems[ i ], i , arg );
          if ( value != null ) {
            ret.push( value );
          }
        }
      }

      return concat.apply( [], ret );
  },

  guid: 1,

  // 浏览器支持性检验
  support: support
})

/**
 * @desc
 * 1、判断宿主环境中是否有 Symbol 方法
 * 2、如果有，就通过 Symbol 将数组的迭代器赋给 jQuery 的原型，使 jQuery 可以用 for of 等方式遍历
 */
if ( typeof Symbol === "function" ) {
	jQuery.fn[ Symbol.iterator ] = arr[ Symbol.iterator ];
}

/**
 * @desc
 * 1、填充 class2type 数组，将宿主环境的 toString 打印的类型和 自定义的类型集合做映射
 */
jQuery.each( "Boolean Number String Function Array Date RegExp Object Error Symbol".split( " " ),
function( i, name ) {
	class2type[ "[object " + name + "]" ] = name.toLowerCase();
} );

/**
 * [ 判断对象是否有数组特性 ]
 * @desc
 * 1、获取 length 和 type 属性，排除肯定不是 arrayLike 的两种类型，function 和 window
 * 2、type 为 array，通过
 * 3、length 为 0，通过
 * 4、length 不为 0，为其他数字，并且满足合法性校验，通过
 */
function isArrayLike( obj ) {

	// Support: real iOS 8.2 only (not reproducible in simulator)
	// `in` check used to prevent JIT error (gh-2145)
	// hasOwn isn't used here due to false negatives
	// regarding Nodelist length in IE
	var length = !!obj && "length" in obj && obj.length,
		type = toType( obj );

	if ( isFunction( obj ) || isWindow( obj ) ) {
		return false;
	}

	return type === "array" || length === 0 ||
		typeof length === "number" && length > 0 && ( length - 1 ) in obj;
}

// -----------------------------------------------------------------------------
// sizzle 实现，暂时略过，
jQuery.find = Sizzle; // 返回元素集合
jQuery.expr = Sizzle.selectors; // 选择器？

// Deprecated
// inject sizzle into jquery
jQuery.expr[ ":" ] = jQuery.expr.pseudos; // 伪类
jQuery.uniqueSort = jQuery.unique = Sizzle.uniqueSort; // 去重排序
jQuery.text = Sizzle.getText; // 获取文本
jQuery.isXMLDoc = Sizzle.isXML; // 判断文档类型
jQuery.contains = Sizzle.contains; // ?
jQuery.escapeSelector = Sizzle.escape;
// -----------------------------------------------------------------------------


/**
 * [ 根据 dir 遍历元素，链式遍历，dir 为连接点属性 ]
 * @param {[type]} elem  [ 根元素 ]
 * @param {[type]} dir   [ 目录名/属性名 ]
 * @param {[type]} until [ 停止节点 ]
 * @return {[type]} [ 返回 elem 到 until 节点间的元素 ]
 * @desc
 * 1、遍历上限是 document，而且只取元素节点
 * 2、一般是向上遍历，如果没传 until，一般会到 document 节点
 */
var dir = function( elem, dir, until ) {
  var matched = [],
    truncate = until !== undefined;

  while ( ( elem = elem[ dir ] ) && elem.nodeType !== 9 ) {
    if ( elem.nodeType === 1 ) {
      if ( truncate && jQuery( elem ).is( until ) ) {
        break;
      }
      matched.push( elem );
    }
  }
  return matched;
};

/**
 * [ 平级遍历 ]
 * @param {[type]} n    [ 起始节点 ]
 * @param {[type]} elem [ 结束节点 ]
 * @return {[type]} [ 返回 n 到 elem 间的兄弟节点 ]
 * @desc
 * 1、注意，不包含 n 和 elem
 */
var siblings = function( n, elem ) {
  var matched = [];
  for ( ; n; n = n.nextSibling ) {
    if ( n.nodeType === 1 && n !== elem ) {
      matched.push( elem );
    }
  }
  return matched;
};

// 用于检测需要上下文的选择器表达式
var rneedContext = jQuery.expr.match.needsContext;

function nodeName( elem, name ) {

  return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();

};

// 匹配单个标签
var singleTag = ( /^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i );

/**
 * [ 根据装饰器过滤元素集 ]
 * @param {[type]} elements  [ 要过滤的元素集合 ]
 * @param {[ Function, Node, Array, Selector ]} qualifier [ 装饰器 ]
 * @param {[type]} not       [ 是否反转 ]
 * @return {[type]} [description]
 * @desc
 * 1、如果 qualifier 是 function，则用 grep 进行过滤，过滤规则为 qualifier 的实现逻辑
 * 2、如果 qualifier 是 node ，过滤规则为 选择与 qualifier 相同的元素
 * 3、如果 qualifier 是 元素集合，过滤规则为 选择 qualifier 中包含的元素
 * 4、如果 qualifier 是 选择器，就用 sizzle 去查找
 */
function winnow( elements, qualifier, not ) {
  if ( isFunction( qualifier ) ) {
    return jQuery.grep( elements, function( elem, i ) {
      return !!qualifier.call( elem, i, elem ) !== not;
    } );
  }

  if ( qualifier.nodeType ) {
    return jQuery.grep( elements, function( elem, i ) {
      return ( elem === qualifier ) !== not;
    } );
  }

  if ( typeof qualifier !== 'string' ) {
    return jQuery.grep( elements, function( elem, i ) {
      return ( indexOf.call( qualifier, elem ) > -1 ) !== not;
    } );
  }

  return jQuery.filter( qualifier, elements, not );
};

/**
 * [ 用选择器过滤元素集合 ]
 * @param {[type]} expr  [ 选择器表达式 ]
 * @param {[type]} elems [ 元素集合 ]
 * @param {[type]} not   [ 是否反转 ]
 * @return {[type]} [description]
 */
jQuery.filter = function( expr, elems, not ) {
  var elem = elems[ 0 ];

  // 修正选择器
  if ( not ) {
    expr = ':not(' + expr + ')';
  }

  // 对于单个元素，直接比较该元素是否满足选择器表达式
  if ( elems.length === 1 && elem.nodeType === 1 ) {
    return jQuery.find.matchesSelector( elem, expr ) ? [ elem ] : [];
  }

  // 过滤出元素节点用调用遍历方法查找
  return jQuery.find.matches( expr, jQuery.grep( elems, function( elem ) {
    return elem.nodeType === 1;
  } ) );
}

// jQuery 的一些过滤方法
jQuery.fn.extend( {

  /**
   * [ 在自身的元素集合中查找 ]
   * @param {[type]} selector [ 选择器 ]
   * @return {[type]} [description]
   * @desc
   * 1、如果 selector 不是 string，可能是 元素节点、函数、jQuery对象
   *    就用 jQuery 构造新对象，取两者元素交集作为一个新 jQuery 对象返回
   *    原对象推入回溯栈
   * 2、selector 为 string 时，先构造一个空 jQuery 对象 ret，将原对象推入回溯栈
   *    然后以原对象的每一个元素节点为上下文，调用 sizzle 进行查找，结果放入 ret 中，
   *    进行排序去重后返回
   */
  find: function( selector ) {
    var i, ret,
      len = this.length,
      self = this;

    if ( typeof selector !== 'string' ) {
      return this.pushStack( jQuery( selector ).filter( function() {
        for ( i = 0; i < len; i++ ) {
          if ( jQuery.contains( self[ i ], this ) ) {
            return true;
          }
        }
      } ) );
    }

    ret = this.pushStack( [] );

    for ( i = 0; i < len; i++ ) {
      jQuery.find( selector, self[i], ret );
    }

    return len > 1 ? jQuery.uniqueSort( ret ) : ret
  },

  // 将原对象推入回溯栈后调用 winnow 进行查找
  filter: function( selector ) {
    return this.pushStack( winnow( this, selector || [] , false ) );
  },

  // 将原对象推入回溯栈后调用 winnow 进行查找
  not: function( selector ) {
    return this.pushStack( winnow( this, selector || [], true ) );
  },

  /**
   * [ 验证该对象是否满足 selector ]
   * @param {[type]} selector [description]
   * @return {[type]} [description]
   * @desc
   * 1、如果 selector 是选择器表达式，但是需要上下文支持，就构造 jQuery 对象作为参数，
   *    jQuery 默认以 document 作为上下文
   * 2、否则直接传入 selector
   * 3、？sizzle 不支持上下文不明确的表达式？
   */
  is: function( selector ) {
    return !!winnow(
      this,
      // if has not context, set context document
      typeof selector === 'string' && rneedContext.test( selector ) ?
        jQuery( selector ) :
        selector || [],
      false
    ).length;
  }
} );

// jQuery 根实例
var rootjQuery,

  // 快速匹配单标签和 id，不调用 sizzle，提高效率
  quickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/,

  /**
   * [ jQuery 构造方法 ]
   * @param {[type]} selector [ 选择器 ]
   * @param {[type]} context  [ 上下文 ]
   * @param {[type]} root     [ 根 ]
   * @return {[type]} [ jQuery 实例 ]
   * @desc
   * 1、在一次构造中，该方法可能被递归的调用多次
   */
  init = jQuery.fn.init = function( selector, context, root ) {
    var match, elem;

    // 如果无 selector，返回一个空 jQuery 对象
    if ( !selector ) {
      return this;
    }

    // 默认根节点为 document
    root = root || rootjQuery;

    if ( typeof selector === 'string' ) {

      if ( selector[ 0 ] === '<' &&

        // 检测闭合标签，可能不是单标签
        selector[ selector.length - 1 ] === '>' &&
        selector.length >=3 ) {
        match = [ null, selector, null ];
      } else {

        // 检测 id
        match = quickExpr.exec( selector );
      }

      if ( match && ( match[ 1 ] || !context )) {

        if ( match[ 1 ] ) {

          // 匹配到标签
          // 先修正 context，如果是 jQuery 对象，就指定为其第一个元素节点
          context = context instanceof jQuery ? context[ 0 ] : context;

          // 调用 parseHTML 创建 dom 树，并合并到 this
          // 再次修正了 context，如果 context 为元素节点，修正为包含它 document 或其 本身
          // 否则为 jQuery 注册的 document
          // 一般针对有多个 document 的情况
          jQuery.merge( this, jQuery.parseHTML(
            match[ 1 ],
            context && context.nodeType ? context.ownerDocument || context : document,
            true
          ) );

          // dom 树创建完后，处理特例：单标签且 context 为平凡对象
          // 对插件开发者提供？
          // 将 context 的 function 混入 this
          // 将 context 的属性混入 this 的每一个节点
          if ( rsingleTag.test( match[ 1 ] ) && jQuery.isPlainObject( context ) ) {
            for ( match in context ) {
              if ( isFunction( this[ match ] ) ) {
                this[ match ]( context[ match ] );
              } else {
                this.attr( match , context[ match ] );
              }
            }
          }

          return this;
        } else {

          // 匹配到 id，且没有指定 context
          elem = document.getElementById( match[ 2 ] );
          if ( elem ) {
            this[ 0 ] = elem;
            this.length = 1;
          }
          return this;
        }
      } else if ( !context || context.jquery ) {

        // 排除上面情形后，如果没有提供 context，就在跟实例下调用 sizzle 查找
        // 或者 context 为 jQuery 对象，就直接查找
        // 此时，context 会在回溯栈中
        return ( context || root ).find( selector );
      } else {

        // 最常用的，构造空对象，然后 find
        return this.constructor().find( selector );
      }

      // 以上完成 selector 为 string 类型的处理

    } else if ( selector.nodeType ) {

      // 如果是元素节点，就直接翻到 jQuery 中
      this[ 0 ] = selector;
      this.length = 1;
      return this;
    } else if ( isFunction( selector ) ) {

      // 如果是 function，将 selector 注册到 ready 的回调中，一般对插件提供
      return root.ready !== undefined ?
        root.ready( selector ) :
        selector( jQuery );
    }

    // 处理其他情形
    // 如果是普通对象，就 push 到 this 中，
    // 如果是数组对象，就合并到 this 中
    return jQuery.makeArray( selector, this );
  };


// 原型修正，init 为实际的构造函数，而非 jQuery()
// 但是 init.prototype.constructor 调用的不是 init 而是 jQuery
init.prototype = jQuery.fn;

rootjQuery = jQuery( document );

//-------------------- 以上代码基本完成 jQuery 的构造和元素筛查 ^_^ --------------------
//-------------------- 之后代码基本是对核心进行扩展，借助了很多上面的核心方法 --------------

// 匹配元素后需要倒序排序的方法
var rparentsprev = /^(?:parents|prev(?:Until|All))/,

// 匹配元素后不需要去重的方法
guaranteedUnique = {
	children: true,
	contents: true,
	next: true,
	prev: true
};

jQuery.fn.extend( {
  /**
   * [ 判断 jQuery 实例中是否有满足某一个特征的元素 ]
   * @param {[type]} target [ 可以是任何 jQuery 对象的构造参数 ]
   * @return {[type]} [description]
   * @desc
   * 1、先用 target 构造 jQuery 对象 targets
   * 2、再遍历 targets 判断 this 中是否至少包含一个 targets 中的元素
   */
  has: function( target ) {
    var targets = jQuery( target, this ),
      len = targets.length;
    return this.filter( function() {
      var i = 0;
      for ( ; i < len; i++ ) {
        if ( jQuery.contains( this, targets[ i ] ) ) {
          return true;
        }
      }
    } );
  },

  /**
   * [ 在 context 上下文中寻找满足 selector 的元素节点 ]
   * @param {[type]} selector [description]
   * @param {[type]} context  [description]
   * @return {[type]} [description]
   * @desc
   * 1、如果 selector 为 string，就用其构造 jQuery 对象 targets
   * 2、selector 为一个需要上下文的选择器，对 this 中每一个元素节点向上去找匹配 targets 的节点
   * 3、进行去重排序后返回
   */
  closest: function( selector, context ) {
    var matched = [],
      cur,
      i = 0,
      l = this.length,
      targets = typeof selector !== 'string' && jQuery( selector );

      if ( !rneedContext.test( selector ) ) {
        for ( ; i < l; i++ ) {
          for ( cur = this[ i ]; cur && cur !== context; cur = cur.parentNode ) {
            if ( cur.nodeType < 11 && ( targets ?
              targets.index( cur ) > -1 :
              cur.nodeType === 1 &&
              jQuery.find.matchesSelector( selector, cur ) ) ) {
                matched.push( cur );
                break;
            }
          }
        }
      }

      return this.pushStack( matched.length > 1 ? jQuery.uniqueSort( matched ) : matched );
  },

  /**
   * [ 寻找元素在 jQuery 实例中的位置 ]
   * @param {[type]} elem [description]
   * @return {[type]} [description]
   * @desc
   * 1、如果 elem 为假，返回 this[ 0 ] 在父节点中的位置
   * 2、如果 elem 为 string，就构造 jQuery 实例，返回 this[ 0 ] 在该 jQuery 实例中的位置
   * 3、如果 elem 是 jQuery 实例，返回 elem[ 0 ] 在 this 中的位置
   * 4、如果 elem 为 元素节点，返回 elem 在 this 中的位置
   */
  index: function( elem ) {

		if ( !elem ) {
			return ( this[ 0 ] && this[ 0 ].parentNode ) ? this.first().prevAll().length : -1;
		}

		if ( typeof elem === "string" ) {
			return indexOf.call( jQuery( elem ), this[ 0 ] );
		}

		return indexOf.call( this,

			elem.jquery ? elem[ 0 ] : elem
		);
  },

  /**
   * [ 在 jQuery 实例中添加元素节点 ]
   * @param {[type]} selector [ 选择器 ]
   * @param {[type]} context  [ 上下文 ]
   * @return {[type]} [description]
   * @desc
   * 1、首先用 selector，context 构造 jQuery 实例
   * 2、合并 this 和 jQuery 实例中的元素节点
   * 3、去重排序后返回元素节点集合
   * 4、用新的元素集合构造 jQuery 实例返回，并把原实例推入回溯栈
   */
  add: function( selector, context ) {
    return this.pushStack( jQuery.uniqueSort(
      jQuery.merge(
        this.get(),
        jQuery( selector, context )
    ) ) );
  },

  /**
   * [ 将回溯栈中前一个对象合并到当前对象 ]
   * @param {[type]} selector [description]
   * @return {[type]} [description]
   */
  addBack: function( selector ) {
    return this.add( selector == null ?
      this.prevObject : this.prevObject.filter( selector )
    );
  }
} );

/**
 * [ 遍历辅助函数 ]
 * @param {[type]} cur [description]
 * @param {[type]} dir [description]
 * @return {[type]} [description]
 */
function sibling( cur, dir ) {
  while ( ( cur = cur[ dir ] ) && cur.nodeTyep !== 1 ) {}
  return cur;
}

// jQuery 遍历方法
jQuery.each( {
  parent: function( elem ) {
    var parent = elem.parentNode;
    return parent && parent.nodeType !== 11 ? parent : null;
  },
  parents: function( elems ) {
    return dir( elem, 'parentNode' );
  },
  parentUntil: function( elems, i, until ) {
    return dir( elem, 'parentNode', until );
  },
  next: function( elem ) {
    return sibling( elem, 'nextSibling' );
  },
  prev: function( elem ) {
    return sibling( elem, 'previousSibling' );
  },
  nextAll: function( elem ) {
    return dir( elem, 'nextSibling' );
  },
  prevAll: function( elem ) {
    return dir( elem, 'previousSibling' );
  },
  nextUntil: function( elem, i, until ) {
    return dir( elem, 'nextSibling', until );
  },
  prevUntil: function( elem, i, until ) {
    return dir( elem, 'previousSibling', until );
  },
  siblings: function( elem ) {
    return siblings( ( elem.parentNode || {} ).firstChild, elem );
  },
  children: function( elem ) {
    return siblings( elem.firstChild );
  },
  contents: function( elem ) {
    if ( nodeName( elem, 'iframe' ) ) {
      return elem.contentDocument;
    }

    if ( nodeName( elem, 'template' ) ) {
      elem = elem.content || elem;
    }

    return jQuery.merge( [], elem.childNodes );
  }
}, function( name, fn ) {

  jQuery.fn[ name ] = function( until, selector ) {
    var matched = jQuery.map( this, fn, until );
    if ( name.slice( -5 ) !== 'Until' ) {
      // first arguments is selector
      selector = until;
    }

    if ( selector && typeof selector === 'string' ) {
      matched = jQuery.filter( selector, matched );
    }

    if ( this.length > 1 ) {

			if ( !guaranteedUnique[ name ] ) {
				jQuery.uniqueSort( matched );
			}
			if ( rparentsprev.test( name ) ) {
				matched.reverse();
			}
		}

		return this.pushStack( matched );
  };
} )

//------------------------------------------------------------------------------
// jQuery.Callbacks

var rnothtmlwhite = ( /[^\x20\t\r\n\f]+/g );

function createOptions( options ) {
  var object = {};
  jQuery.each( options.match( rnothtmlwhite ) || [], function( _, flag ) {
    object[ flag ] = true;
  } )
  return object;
}

jQuery.Callbacks = function( options ) {
  options = typeof options === 'string' ?
    createOptions( options ) :
    jQuery.extend( {}, options );
  var
    firing,
    memory,
    fired,
    locked,
    list = [],
    queue = [],
    firingIndex = -1,
    fire = function() {
      locked = locked || options.once;
      firing = fired = true;
      for ( ; queue.length; firingIndex = -1 ) {
        memory = queue.shift();
        while ( ++firingIndex < list.length ) {
          if ( list[ firingIndex ].apply( memory[ 0 ], memory[ 1 ] ) === false && options.stopOnFalse ) {
            firingIndex = list.length;
            memory = false;
          }
        }
      }

      if ( !options.memory ) {
        memory = false;
      }

      firing = false;
      if ( locked ) {
        if ( memory ) {
          list = [];
        } else {
          list = "";
        }
      }
    },
    self = {
      add: function() {
        if ( list ) {
          if ( memory && !firing ) {
            firingIndex = list.length - 1;
            queue.push( memory );
          }
          ( function add( args ) {
            jQuery.each( args, function( _, arg ) {
              if ( isFunction( arg ) ) {
                if ( !options.unique || !self.has( arg ) ) {
                  list.push( arg );
                }
              } else if ( arg && arg.length && toType( arg ) !== 'string' ) {
                add( arg );
              }
            } );
          } )( arguments );

          if ( memeory && !firing ) {
            fire();
          }
        }
        return this;
      },
      remove: function() {
        jQuery.each( arguments, function( _, arg ) {
          var index;
          if ( index = jQuery.inArray( arg, list, index ) > -1 ) {
            list.splice( index, 1 );
          }
          if ( index < firingIndex ) {
            firingIndex--;
          }
        } );
        return this;
      },
      has: function( fn ) {
        return fn ? jQuery.inArray( fn, list ) > -1 : list.length > 0;
      },
      empty: function() {
        if ( list ) {
          list = [];
        }
        return this;
      },
      disable: function() {
        locked = queue = [];
        list = memory = "";
        return this;
      },
      disabled: function() {
        return !list;
      },
      lock: function() {
        locked = queue = [];
        if ( !memory && !firing ) {
          list = queue = "";
        }
        return this;
      },
      locked: function() {
        return !!locked;
      },
      fireWith: function( context, args ) {
        if ( !locked ) {
          args = args || [];
          args = [ context, args.slice ? args.slice(), args ];
          queue.push( args );
          if ( !firing ) {
            fire();
          }
        }
        return this;
      },
      fire: function() {
        self.fireWith( this, arguments );
        return this;
      },
      fired: function() {
        return !!fired;
      }
    };

  return self;
}

//------------------------------------------------------------------------------
// jQuery.Deferred

function Identity( v ) {
  return v;
}

function Thrower( ex ) {
  throw ex;
}

function adoptValue( value, resolve, reject, noValue ) {

  var method;

  try{
    if ( value && isFunction( ( method = value.promise ) ) ) {
      method.call( value ).done( resolve ).fail( reject );
    }
    else if ( value && isFunction( ( method = value.then ) ) ) {
      method.call( value, resolve, reject );
    } else {
      resolve.apply( undefined, [ value ].slice( noValue ) );
    }
  } catch ( value ) {
    reject.apply( undefined, [ value ] );
  }

}

jQuery.extend( {
  Deffered: function( func ) {

    // notify 触发 progress 注册的 callbacks
    // resolve 触发 done 注册的 callbacks
    // reject 触发 fail 注册的 callbacks
    // 同时所有 callbacks 可以通过 then() 注册
    var tuples = [
      [ "notify", "progress", jQuery.Callbacks( "memory" ),
        jQuery.Callbacks( "memory" ), 2 ],
      [ "resolve", "done", jQuery.Callbacks( "once memory" ),
        jQuery.Callbacks( "once memory" ), 0, "resolved" ],
      [ "reject", "fail", jQuery.Callbacks( "once memory" ),
        jQuery.Callbacks( "once memory" ), 1, "rejected" ]
    ],

    // 初始状态都为 pending，即等待状态
    state = "pending",

    // promise 为向外暴露的安全的注册对象
    promise = {

      state: function() {
        return state;
      },
      always: function() {
        // 同时向 done 和 fail 注册 callbacks
        deferred.done( arguments ).fail( arguments );
        return this;
      },
      "catch": function( fn ) {
        // 将 fn 注册为 fail 的 callbacks
        return promise.then( null, fn );
      },
      pipe: function( /* fnDone, fnFail, fnProgress */ ) {

        var fns = arguments;

        // return a new deferred's promise, the function will be called before the deferred return;
        // 返回 promise，其中不含状态转移函数，更安全的处理方式
        return jQuery.Deffered( function( newDefer ) {

          jQuery.each( tuples, function( i, tuple ) {

            var fn = isFunction( fns[ tuple[ 4 ] ] ) && fns[ tuple[ 4 ] ];

            // deferred.progress(function() { bind to newDefer or newDefer.notify })
            // 在原来的 deferred 中注册函数
      			// deferred.done(function() { bind to newDefer or newDefer.resolve })
      			// deferred.fail(function() { bind to newDefer or newDefer.reject })
            deferred[ tuple[ 1 ] ]( function() {
              // 调用 fn
              // arguments 为 deferred 状态转移函数的传参，
              // 即调用该注册的 function 时的传参，该参数会引用状态转移函数的参数
              var returned = fn && fn.call( this, arguments );
              if ( returned && isFunction( returned.promise ) ) {
                // 若返回的对象中有 promise 方法，则将 newDefer 的状态转移方法注入，
                // 即返回的对象也有异步处理函数，其状态改变会触发 newDefer 的状态改变
                // newDefer 的状态会等待 returned 的状态改变
                returned.promise()
                  .progress( newDefer.notify )
                  .done( newDefer.resolve )
                  .fail( newDefer.reject )
              } else {
                // 否则在 this 上下文中去调用状态转移方法
                // 如果 fn 存在，就传入 fn 的返回值 returned
                // 如果不存在，直接返回 arguments
                newDefer[ tuple[ 0 ] + 'With' ](
                  this,
                  fn ? [ returned ] : arguments
                );
              }
            } );
          } );
          // 当方法被调用完成后，变量 fns 置为 null
          fns = null;
        } ).promise();
      },
      then: function( onFulfilled, onRejected, onProgress ) {

        var maxDepth = 0;

        function resolve( depth, deferred, handler, special ) {

          // 返回的 function 会注入调用该 then 方法的 deferred 的回调列表中
          return function() {

            // 继承状态转移方法传入的作用域
            var that = this,
              args = arguments,

              // 解析主体逻辑函数
              mightThrow = function() {

                var returned, then;

                // 多层嵌套异步操作时，如果当前深度小于最大深度，说明当前深度的异步操作已经被解析过了
                // 目前状态是等待 maxDepth 深度的异步操作进行解析，所以直接返回不做任何操作
                if ( depth < maxDepth ) {
                  return;
                }

                // 调用 handler
                returned = handler.apply( that, args );

                // 参照 Promise|A+ 规范，返回结果如果是参数中 deferred 的 promise 引用，则抛出异常
                // 否则会将自身的状态转移方法注入自己的回调队列中，如果是 notify 调用，会造成方法调用死循环
                if ( returned === deferred.promise() ) {
                  throw new TypeError( "Thenable self-resolution" );
                }

                // then 赋值
                then = returned &&
        					( typeof returned === "object" ||
        						typeof returned === "function" ) &&
        					returned.then;

                // 如果 returned 是一个 deferred 对象或其他 promise 标准的实现，会调用其 then 方法注入回调
                if ( isFunction( then ) ) {

                  // special 是 notify 状态转移函数，这时不会增加异步深度，因为该异步对象根本没有被解析
                  if ( special ) {
                    then.call(
                      returned,
                      resolve( maxDepth, deferred, Indentity, special ),
                      resolve( maxDepth, deferred, Thrower, special )
                    );
                  } else {

                    // 如果没有 special，说明异步对象已经被解析了，而且 returned 也是一个异步对象
                    // 说明有异步对象嵌套，于是深度 +1
                    maxDepth++;

                    then.call(
                      returned,
                      resolve( maxDepth, deferred, Indentity, special ),
                      resolve( maxDepth, deferred, Thrower, special ),
                      resolve( maxDepth, deferred, Identity,
        								deferred.notifyWith )
                    );
                  }
                } else {

                  // 否则，returned 就是要返回的 value 值
                  if ( handler !== Indentity ) {

                    // 此时 handler 就是自定义的回调，原来 deferred 解析的作用域不会影响新返回的 deferred
                    // 原来的 deferred 即为调用 then 方法的 deferred
                    // 新的 deferred 即为 resolve 方法传入的参数 deferred
                    that = undefined;

                    // 如果 handler 为自定义回调，解析的参数取决于其返回值
                    // 否则就取决于状态转移方法调用时的入参
                    args = [ returned ];
                  }

                  // handler 执行时未抛出异常，只能是 resolve 或 notify 调用
                  // special 即为 notify 调用函数
                  ( special || deferred.resolveWith )( that, args )
                }
              },

              // 如果有 special，则是 notify 调用，异步对象并没有被解析，不会抛出异常，直接用 mightThrow 即可
              // 否则需要捕获异常
              process = special ?
                mightThrow :
                function() {
                  try {
                    mightThrow()
                  } catch ( e ) {

                    // 在控制台中显示异常信息
                    if ( jQuery.Deferred.exceptionHook ) {
                      jQuery.Deferred.exceptionHook( e,
        								process.stackTrace );
                    }

                    // 在已经解析过的深度发生的任何异常都忽略掉
                    if ( depth + 1 >= maxDepth ) {

        							if ( handler !== Thrower ) {
        								that = undefined;
        								args = [ e ];
        							}

                      // 说明该异步对象已经被完全解析，此时捕获的异常就是 reject 的参数
                      // 当前解析的深度 >= maxDepth
        							deferred.rejectWith( that, args );
        						}
                  }
                };

            // 如果 depth 大于 0，则直接执行 process
            if ( depth ) {
              process();
            } else {

        			if ( jQuery.Deferred.getStackHook ) {
        				process.stackTrace = jQuery.Deferred.getStackHook();
        			}

              // 否则设置异步执行
        			window.setTimeout( process );
        		}
          };
        }

        // 返回一个新的 deferred 实例的 promise 对象，使其可链式调用
        // 并且在老的 deferred 实例的 回调列表中注入 resolve 函数
        // 老的 deferred 实例的状态改变会调用注入的 resolve 函数，使其去改变新的 deferred 的状态
        // 回调的返回值可能是一个 [deferred]，则将新 deferred 的 resolve 权交给返回值的 deferred
        // 返回的 promise 和调用 then 的 promise 不会指向同一个对象
        // 和 jQuery 的链式调用比较，jQuery 返回的对象如果调用 pushStack 返回，就不是原对象引用，如果是 this 返回，是原对象引用
        return jQuery.Deffered( function( newDefer ) {

          tuples[ 0 ][ 3 ].add(
            resolve(
              0,
              newDefer,
              isFunction( onProgress ) ?
                onProgress :
                Indentity
            )
          );

          tuples[ 1 ][ 3 ].add(
            resolve(
              0,
              newDefer,
              isFunction( onFulfilled ) ?
                onFulfilled :
                Indentity
            )
          );

          tuples[ 2 ][ 3 ].add(
            resolve(
              0,
              newDefer,
              isFunction( onRejected ) ?
                onRejected :
                Thrower
            )
          );

        } ).promise();
      },
      promise: function( obj ) {
        return obj !== null ? jQuery.extend( obj, promise ) : promise;
      }
    },
    deferred = {};
  jQuery.each( tuples, function( i, tuple ) {
    var list = tuple[ 2 ],
      stateString = tuple[ 5 ];

    // promise.progress()
    // promise.fail()
    // promise.done()
    // 和 then 用的不是同一个回调列表
    promise[ tuple[ 1 ] ] = list.add;

    // 如果状态改变了，就作废另外一个状态的回调列表，并锁住 progress 的回调列表
    if ( stateString ) {
      list.add(
  			function() {

  				// state = "resolved" (i.e., fulfilled)
  				// state = "rejected"
  				state = stateString;
  			},

  			// rejected_callbacks.disable
  			// fulfilled_callbacks.disable
  			tuples[ 3 - i ][ 2 ].disable,

  			// rejected_handlers.disable
  			// fulfilled_handlers.disable
  			tuples[ 3 - i ][ 3 ].disable,

  			// progress_callbacks.lock
  			tuples[ 0 ][ 2 ].lock,

  			// progress_handlers.lock
  			tuples[ 0 ][ 3 ].lock
  		);
    }

    // 同时触发 then 方法注册的回调
    list.add( tuple[ 3 ].fire );

    deferred[ tuple[ 0 ] ] = function() {
  		deferred[ tuple[ 0 ] + "With" ]( this === deferred ? undefined : this, arguments );
  		return this;
  	};

  	// deferred.notifyWith = list.fireWith
  	// deferred.resolveWith = list.fireWith
  	// deferred.rejectWith = list.fireWith
  	deferred[ tuple[ 0 ] + "With" ] = list.fireWith;

  } );

  promise.promise( deferred );

  if ( func ) {
    func.call( deferred, deferred );
  }
  return deferred;
},
// when 的参数可以是一个或多个同步或异步对象
// 如果是同步对象，then 注册的回调会立即执行
// 如果是异步对象，则需要所有的异步对象都解析后 then 中回调再执行
// then 中 onFullFilled 只有在所有异步对象都 resolve 后才执行
when: function( singleValue ) {
  var remaining = arguments.length,
    i = remaining,
    resolveContexts = Array( i ),
    resolveValues = slice.call( arguments ),
    master = jQuery.Deferred(),

    updateFunc = function( i ) {
      return function( value ) {
        resolveContexts[ i ] = this;
				resolveValues[ i ] = arguments.length > 1 ? slice.call( arguments ) : value;
				if ( !( --remaining ) ) {
					master.resolveWith( resolveContexts, resolveValues );
				}
      }
    };

  // 处理参数为单个和没有参数的情况
  if ( remaining <= 1 ) {

    // 将 updateFunc 注入 master 的回调中
    // 如果 singleValue 是异步对象，就把 master 的解析交给 singleValue
    // 如果 singleValue 是非异步对象，就立即解析 master
    // 执行过程中的任何异常都会导致 master.reject 执行
    // remaining 用于表示是否还有剩余的未解析对象
    adoptValue( singleValue, master.done( updateFunc( i ) ).resolve, master.reject, !remaining );

    // 如果 singleValue 是一个异步对象，就返回 master 的 promise
    // 即当 when 返回的对象注册的回调会在 singleValue 解析后执行
    if ( master.state() === "pending" || isFunction( resolveValues[ i ] && resolveValues[ i ].then ) ) {

      return master.then();
    }

  }

  // 解决数组错位
  while ( i-- ) {
    adoptValue( resolveValues[ i ], updateFunc( i ), master.reject );
  }

  return master.promise();
}
} );

// 定义 jQuery 里的异常类型
var rerrorNames = /^(Eval|Internal|Range|Reference|Syntax|Type|URI)Error$/;

// 定义 Deferred 里的异常钩子函数，当 catch 到异常时一般会执行该函数
jQuery.Deferred.exceptionHook = function( error, stack ) {

	// Support: IE 8 - 9 only
	// Console exists when dev tools are open, which can happen at any time
	if ( window.console && window.console.warn && error && rerrorNames.test( error.name ) ) {
		window.console.warn( "jQuery.Deferred exception: " + error.message, error.stack, stack );
	}
};

//------------------------------------------------------------------------------
// jQuery.ready

// 定义 ready 异常，用于在 jQuery.ready 中发生异常时抛出
jQuery.readyException = function( error ) {
	window.setTimeout( function() {
		throw error;
	} );
};

// 定义就绪队列
var readyList = jQuery.Deferred();

// $().ready 即是往异步对象里添加成功回调
jQuery.fn.ready = function( fn ) {
  readyList.then(
    fn
  ).catch( function( error ) {
    jQuery.readyException( error );
  } );
  return this;
};

// 定义 jQuery.ready
jQuery.extend( {
  isReady: false,
  readyWait: 1,
  ready: function( wait ) {
    // 如果有 wait 参数且 readyWait > 1 就不作任何操作
    // 如果没有 wait 参数，就判断 isReady 状态，如果就绪，也不做任何操作
    if ( wait === true ? --jQuery.readyWait : jQuery.isReady ) {
      return;
    }
    // 否则 jQuery 的状态置为就绪
    jQuery.isReady = true;
    // 如果没有 wait 参数并且 readyWait > 1 则不触发回调
    if ( wait !== true && --jQuery.readyWait > 0 ) {
      return;
    }
    // 否则触发所有实例注册的回调
    readyList.resolveWith( document, [ jQuery ] );
  }
} );

jQuery.ready.then = readyList.then;

// 定义文档加载完成后的回调
// 清除监听，并使 jQuery 的状态就绪
function completed() {
  document.removeEventListener( 'DOMContentLoaded', completed );
  window.removeEventListener( 'load', completed );
  jQuery.ready();
}

// 如果文档已经加载就绪
// 就让 jQuery 状态就绪
if ( document.readyState === 'complete' ||
  ( document.readyState !== 'loading' !document.documentElement.doScroll ) ) {
    window.setTimeout( jQuery.ready );
} else {
  // 否则，添加事件监听和回调
  document.addEventListener( 'DOMContentLoaded', completed );
  window.addEventListener( 'load', completed );
}


//------------------------------------------------------------------------------
// jQuery.Data

// 用于对集合的值进行 get 和 set，用于设置 dom 的属性值等
// 作为 jQuery 内的辅助函数被调用
var access = function( elems, fn, key, value, chainable, emptyGet, raw ) {
  var i = 0,
    len = elems.length,
    bulk = key == null;

  // 先判断是否是 set 操作
  // set 操作可链式调用，chainable = true
  if ( toType( key ) === 'object' ) {
    // 多值 set 操作
    chainable = true;
    for ( i in key ) {
      access( elems, fn, i, key[ i ], true, emptyGet, raw );
    }
  } else if ( value !== undefined ) {

    // 单值 set 操作
    // 分多种情况
    // 1. key == null
    //  1.1 value 不为 function -处理方法依赖于 fn，且 fn 会被立即调用
    //  1.2 value 为 function -处理方法依赖于 fn，且 fn 会被重新包装
    // 2. key != null
    //  2.1 value 不为 function
    //  2.2 value 为 function
    chainable = true;

    // 标记 value 是否是一个平凡值
    if ( !isFunction( value ) ) {
      raw = true;
    }

    // 处理 key == null 的情况
    if ( bulk ) {

      // 如果未传入 key 且 value 是一个平凡值
      if ( raw ) {
        fn.call( elems, value );
        fn = null;
      } else {
        // 否则，修正 fn
        bulk = fn;
        fn = function( elem, key, value ) {
          return bulk.call( jQuery( elem ), value );
        };
      }
    }

    if ( fn ) {
      // 处理 key != null，或者 key == null 且 value 为 function 的情况
      // fn 实际是一个与 jQuery 实例耦合的 access 方法
      // 1. 如果 value 为 function，且 key 不为空，value 的入参为：
      //  - i 当前节点下标
      //  - value, 根据 key 从当前节点取出的属性值
      for ( ; i < len; i++ ) {
        fn( elems[ i ], key, raw ? value : value.call( elems[ i ], i, fn( elems[ i ], key ) ) );
      }
    }
  }

  // 如果 chainable 为真，此时 set 操作已经完成，返回 elems 即可
  if ( chainable ) {
    return elems;
  }

  // 否则进行 get 操作
  // 如果 key == null，返回所有数据
  if ( bulk ) {
    return fn.call( elems );
  }

  // 如果 elems 不为空，就从第一个节点取数据，否则返回指定空值
  return len ? fn( elems[ 0 ], key ) : emptyGet;
};

// 处理浏览器前缀问题
var rmsPrefix = /^-ms-/,
  rdashAlpha = /-([a-z])/g;

function fcamelCase( all, letter ) {
  return letter.toUpperCase();
}

function camelCase( string ) {
  return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
}

var acceptData = function( owner ) {
  // Accepts only:
	//  - Node
	//    - Node.ELEMENT_NODE
	//    - Node.DOCUMENT_NODE
	//  - Object
	//    - Any
  return owner.nodeType === 1 || owner.nodeType = 9 || !( +owner.nodeType );
}

// 定义 Data 构造器
function Data() {
  this.expando = jQuery.expando + Data.uid++;
}

Data.uid = 1;

Data.prototype = {

  // 获取 owner 的缓存对象，如果没有就创建一个，可接受的 owner 参照 acceptData 函数
  cache: function( owner ) {

    // 检查该 Data 对象在 owner 上是否已经有缓存
    // 如果有，就是直接返回 value
    var value = owner[ this.expando ];

    // 如果没有就创建一个缓存对象并返回
    if ( !value ) {
      value = {};

      if ( acceptData( owner) ) {

        // 判断 owner 是节点还是普通对象
        if ( owner.nodeType ) {
          owner[ this.expando ] = value;
        } else {
          Object.defineProperty( value, this.expando, {
            value: value,
            configurable: true
          } );
        }
      }
    }
    return value;
  },

  set: function( owner, data, value ) {
    var prop,
      cache = this.cache( owner );

    // 如果 data 是字符串，则是单值 set，就直接放入缓存中
    if ( typeof data === 'string' ) {
      cache[ camelCase( data ) ] = value;
    } else {
      // 如果 data 是对象，就遍历存入缓存中
      for ( prop in data ) {
        cache[ camelCase( prop ) ] = data[ prop ];
      }
    }
    return cache;
  },

  get: function( owner, key ) {
    // 如果 key == undefined，就直接返回一个缓存对象
    // 否则返回 key 对应的 value
    return key === undefined ?
      this.cache( owner ) :
      owner[ this.expando ] && owner[ this.expando ][ camelCase( key ) ];
  },

  // set get 方法的组合
  access: function( owner, key, value ) {

    // 判定是 owner 操作
    if ( key === undefined ||
        ( ( key && typeof key === 'string' ) && value === undefined ) ) {
      return this.get( owner, key );
    }

    // 否则是 set 操作
    this.set( owner, key, value );

    // 判断单值操作或多值操作返回不同的结果
    return value !== undefined ? value : key;
  },
  remove: function( owner, key ) {
    var i,
      cache = owner[ this.expando ];
    if ( cache === undefined ) {
      return;
    }
    if ( key !== undefined ) {
      if ( Array.isArray( key ) ) {
        key = key.map( camelCase );
      } else {
        // 格式化 key
        key = camelCase( key );
        key = key in cache ? [ key ] : ( key.match( rnothtmlwhite ) || [] );
      }
      i = key.length;
      while( i-- ) {
        delete cache[ key[ i ] ];
      }
    }

    // key 未定义或缓存为空的情况
    // 直接删除缓存对象
    if ( key === undefined || jQuery.isEmptyObject( cache ) ) {
      if ( owner.nodeType ) {
        owner[ this.expando ] = undefined;
      } else {
        delete owner[ this.expando ]
      }
    }
  },

  hasData: function( owner ) {
    var cache = owner[ this.expando ];
    return cache !== undefined && !jQuery.isEmptyObject( cache );
  }
}

// 私有缓存
var dataPriv = new Data();
// 公有缓存
var dataUser = new Data();

var rbrace = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/, // 匹配对象或数组
	rmultiDash = /[A-Z]/g;

// 解析字符串形式的 data
function getData( data ) {

  if ( data === "true" ) {
		return true;
	}

	if ( data === "false" ) {
		return false;
	}

	if ( data === "null" ) {
		return null;
	}

	if ( data === +data + "" ) {
		return +data;
	}

	if ( rbrace.test( data ) ) {
		return JSON.parse( data );
	}
	return data;
}

// 将 html5 data 属性注入缓存
function dataAttr( elem, key, data ) {
  var name;

  if ( data === undefined && elem.nodeType === 1 ) {
    name = "data-" + key.replace( rmultiDash, "-$&" ).toLowerCase();
    data = element.getAttribute( name );
    if ( typeof data === "string" ) {
      try {
        data = getData( data );
      } catch ( e ) {}
    }
    // 将 elem 上的私有属性放入缓存中，用 dataUser 来标记
    dataUser.set( elem, key, data );
  } else {
    data = undefined;
  }
  return data;
}

jQuery.extend( {
  hasData: function( elem ) {
    return dataUser.hasData( elem ) || dataPriv.hasData( elem );
  },
  data: function( elem, name, data ) {
    return dataUser.access( elem, name, data );
  },
  removeData: function( elem, name ) {
    return dataUser.remove( elem, name );
  },
  _data: function( elem, name, data ) {
    return dataPriv.access( elem, name, data );
  },
  _removeData: function( elem, name ) {
    return dataPriv.remove( elem, name );
  }
} );

jQuery.fn.extend( {
  data: function( key, value ) {
    var i, name, data,
      elem = this[ 0 ],
      attrs = elem && elem.attributes;

    // 如果 key 未定义，就对节点数据进行缓存并返回整个缓存
    if ( key === undefined ) {
      if ( this.length ) {

        // 获取自身第一个节点的缓存数据
        data = dataUser.get( elem );

        // 如果节点类型是元素节点并且没有将 data- 属性存入 dataUser
        // 就遍历缓存，取出 data- 属性，存入 dataUser
        if ( elem.nodeType === 1 && !dataPriv.get( elem, "hasDataAttrs") ) {
          i = attrs.length;
          while ( i-- ) {
            if ( attrs[ i ] ) {
              name = attrs[ i ].name;
              if ( name.indexOf( "data-" ) === 0 ) {
                name = camelCase( name.slice( 5 ) );
                dataAttr( elem, name, data[ name ] );
              }
            }
          }
          dataPriv.set( "hasDataAttrs", true );
        }
      }
      return data;
    }

    // 多值属性
    // 在每一个节点上都设置缓存
    if ( typeof key === "object" ) {
      return this.each( function() {
        dataUser.set( this, key )
      } );
    }

    // 处理 key 为单值情况的 get 和 set
    return access( this, function( value ) {

      var data;

      // 节点存在但 value 未定义，则是 get 操作
      if ( elem && value === undefined ) {

        // 先从 dataUser 里取
        data = dataUser.get( elem, key );
        if ( data !== undefined ) {
          return data;
        }

        // 如果 dataUser 没有，就从节点的 data- 属性值里取，并存入 dataUser
        data = dataAttr( elem, key );
        if ( data !== undefined ) {
          return data;
        }

        // 如果都未取到，则返回空
        return;
      }

      // 否则进行 set 操作
      this.each( function() {

        // 注意，这里 this 指向 jQuery 实例里的每一个元素节点
        dataUser.set( this, key ,value );
      } );

    }, null, value, arguments.length > 1, null, true );
  },
  removeData( key ) {
    return this.each( function() {
      dataUser.remove( this, key );
    } );
  }
} );

// -----------------------------------------------------------------------------
/**
 * [ 实现队列方法 ]
 * @type {[type]}
 */

jQuery.extend( {

  /**
   * [ 入队操作 ]
   * @param {[type]} elem [ 元素节点 ]
   * @param {[type]} type [ 队列名称，默认是 fxqueue]
   * @param {[type]} data [ 回调函数，可以是单个 function，也可以是数组 ]
   * @return {[type]} [ 返回入队后的队列 ]
   */
  queue: function( elem, type, data ) {
    var queue;
    if ( elem ) {
      type = ( type || "fx" ) + "queue";
      queue = dataPriv.access( elem, type );
      if ( data ) {
        if ( !queue || Array.isArray( data ) ) {
          queue = dataPriv.access( elem, type, jQuery.makeArray( data ) );
        } else {
          queue.push( data );
        }
      }
      return queue || [];
    }
  },

  /**
   * [ 出队操作 ]
   * @param {[type]} elem [ 元素节点 ]
   * @param {[type]} type [ 队列名称，默认 fxqueue ]
   * @return {[type]} [ undefined ]
   * @desc
   * 1、取出队列，并且进行一次 shift() 出队
   * 2、定义 next 方法为下一次出队
   * 3、如果上一次出队的元素为 'inprogress'，就重新出队
   * 4、如果是 fx 会增加一次入出队操作，导致 startLength 自减
   * 5、自定义队列是不会触发 startLength 自减，也就不会自动触发 queueHook 执行，但是可以在回调函数里自己操作 hooks
   * 6、默认队列为空时，会触发 queueHook.empty 里的回调执行
   */
  dequeue: function( elem, type ) {
     type = type || "fx";
     var queue = jQuery.queue( elem, type ),
      startLength = queue.length,
      fn = queue.shift(),
      hooks = jQuery._queueHooks( elem, type ),
      next = function() {
        jQuery.dequeue( elem, type );
      };

      if ( fn === "inprogress" ) {
        fn = queue.shift();
        startLength--;
      }

      if ( fn ) {
        if ( type === "fx" ) {
          queue.unshift( "inprogress" );
        }

        delete hooks.stop;

        fn.call( elem, next, hooks );
      }

      if ( !startLength && hooks ) {
        hooks.empty.fire();
      }
  },
  /**
   * [ 队列的事件钩子对象 ]
   * @param {[type]} elem [ 元素 ]
   * @param {[type]} type [ 队列名 ]
   * @return {[type]} [ 返回元素上的缓存对象 ]
   * @desc
   * 1、如果 dataPriv 中有 Hook 定义，就获取，否则就定义一个
   * 3、empty 里有一个默认方法，在队列为空时就移除队列和相应 Hook
   */
  _queueHooks: function( elem, type ) {
    var key = type + "queueHooks";
    return dataPriv.get( elem, key ) || dataPriv.access( elem, key, {
      empty: jQuery.Callbacks("once memory").add( function() {
        dataPriv.remove( elem, [ type + "queue", key ] );
      } )
    } );
  }
} );


/**
 * [queue 注入原型的方法]
 * @type {[type]}
 */
jQuery.fn.extend( {

  /**
   * [description]
   * @param {[type]} type [ 队列名 ]
   * @param {[type]} data [ 函数列表 ]
   * @return {[type]} [description]
   */
  queue: function( type, data ) {
    var setter = 2;
    if ( typeof type !== "string" ) {
      data = type;
      type = "fx";
      setter--;
    }

    // setter 为 2 说明传入了 type 和 data
    // setter 为 1 说明只传入了 data
    // 如果 arguments < setter，说明没有传 data
    // 如果没有传 data，就认为是获取队列实例的操作，而非入队操作
    if ( arguments.length < setter ) {
      return jQuery.queue( this[ 0 ], type );
    }

    // 否则执行入队操作
    // 如果 data 未定义，就返回 jQuery 实例
    // 否则对每一个 elem 进行 data 入队，并且创建对应的 Hooks，然后返回 this
    return data === undefined ?
      this :
      this.each( function() {
        var queue = jQuery.queue( this, type, data );
        jQuery._queueHooks( this, type );

        // 如果未默认队列并且队列中第一个函数不为 'inprogress'
        // 即该队列一定是新建的队列而非未出完队的队列
        // 就立即出队第一个函数
        // queue[ 0 ] === "inprogress" 的情况为，队列在最后一次函数执行时没有进行 next() 调用
        if ( type === "fx" && queue[ 0 ] !== "inprogress" ) {
          jQuery.dequeue( this, type );
        }
      } );
  },

  /**
   * [ 在 this 上调用 出队方法 ]
   * @param {[type]} type [description]
   * @return {[type]} [description]
   */
  dequeue: function( type ) {
    this.each( function() {
      jQuery.dequeue( this, type );
    } );
  },

  /**
   * [ 在 this 上调用 _queueHooks 方法 ]
   * @param {[type]} type [description]
   * @return {[type]} [description]
   */
  _queueHooks: function( type ) {
    this.each( function() {
      jQuery._queueHooks( this, type );
    } );
  },

  // 清空队列
  // *queue 是直接替换而不是 merge
  clearQueue: function( type ) {
    return this.queue( type || "fx", [] );
  },

  /**
   * [ 返回队列执行的异步对象 ]
   * @param {[type]} type [ 队列名称 ]
   * @param {[type]} obj  [ 载体对象，promise 的特性会混入该对象中 ]
   * @return {[type]} [description]
   * @desc
   * 1、如果 this 没有元素节点，返回的实际是已经解析过的异步对象
   * 2、elem 元素节点的队列中如果有 empty 钩子，计数 +1，empty 钩子触发时会使计数 -1，表明该元素上的队列已被清空
   * 3、当所有 elem 上的队列清空后，promise 被解析
   */
  promise: function( type, obj ) {
    var tmp,
      count = 1,
      defer = jQuery.Deferred(),
      elements = this,
      i = this.length,
      resolve = function() {
        if ( !(--count) ) {
          defer.resolveWith( elements, [ elements ] );
        }
      };

    if ( typeof type !== "string" ) {
      obj = type;
      type = undefined;
    }

    type = type || "fx";

    while ( i-- ) {
      tmp = dataPriv.get( elements[ i ], type + "queueHooks" );
      if ( tmp && tmp.empty ) {
        count++;
        tmp.empty.add( resolve );
      }
    }
    resolve();
    return defer.promise( obj );
  }
} );


// -----------------------------------------------------------------------------
// css 一类方法实现

// 匹配数字，包括科学计数法
var pnum = ( /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/ ).source;

// 匹配 css 中的值
// 分别捕获符号，值，单位
var rcssNum = new RegExp( "^(?:([+-])=|)(" + pnum + ")([a-z%]*)$", "i" );

var cssExpand = [ "Top", "Right", "Bottom", "Left" ];

/**
 * [ 判断元素是否被隐藏 ]
 * @return {[type]} [description]
 */
var isHiddenWithinTree = function( elem, el ) {
  elem = elem || el
  return elem.style.display === "none" ||
    elem.style.display === "" &&
    jQuery.contains( elem.ownerDocument, elem ) &&
    jQuery.css( elem, "display" ) === "none"
}

/**
 * [ 在 options 配置下在 elem 上调用 callback，并返回结果 ]
 * @param  {[type]}   elem     [元素节点]
 * @param  {[type]}   options  [css 配置信息]
 * @param  {Function} callback [要调用的函数]
 * @param  {[type]}   args     [要调用函数的参数]
 * @return {[type]}            [description]
 * @desc
 * 1、把 options 的配置赋给 elem，对 elem 执行 callback 后，在将 elem 的值还原
 */
var swap = function( elem, options, callback, args ) {
  var ret, name,
    old = {};
  for ( name in options ) {
    old[ name ] = elem.style[ name ];
    elem.style[ name ] = options[ name ];
  }

  ret = callback.apply( elem, args || [] );

  for ( name in options ) {
    elem.style[ name ] = old[ name ];
  }

  return ret;
};


function adjustCSS( elem, prop, valueParts, tween ) {

}

var defaultDisplayMap = {}

/**
 * [ 获取元素默认的 display 展现方式 ]
 * @param {[type]} elem [description]
 * @return {[type]} [description]
 * @desc
 * 1、如果 map 中有记录，就从 map 中获取
 * 2、否则创建元素标签获取其 display 属性存入 map 中
 * 3、display 为 none 的默认修正为 block
 */
function getDefaultDisplay( elem ) {
  var tmp,
    doc = elem.ownerDocument,
    nodeName = elem.nodeName,
    display = defaultDisplayMap[ nodeName ];

  if ( display ) {
    return display;
  }

  tmp = doc.body.appendChild( doc.createElement( nodeName ) );

  display = jQuery.css( tmp, "display" );

  tmp.parentNode.removeChild( tmp )

  if ( display === "none" ) {
    display = "block"
  }
  defaultDisplayMap[ nodeName ] = display

  return display
}

/**
 * [ showHide jQuery.show jQuery.hide 的最终实现 ]
 * @param {[type]} elements [ 元素节点集合 ]
 * @param {[type]} show     [ 是否展示 ]
 * @return {[type]} [description]
 * @desc
 * 1、实际操作的是每个 elem 的 style.display 属性
 * 2、首先要知道 elem 的原始的 display，将其存入 dataPriv 中，在 none 和 display 来回切换
 * 3、如果 display 为空，就获取 elem 这种元素节点的默认 display 方式作为原始的 display
 */
function showHide( elements, show ) {
  var index,
    len = elements.length,
    elem,
    display;
  for ( ; index < len; index++ ) {
    elem = elements[ index ];
    if ( !elem.style ) {
      continue;
    }
    display = elem.style.display;
    if ( show ) {
      if ( display === "none" ) {
        values[ index ] = dataPriv.get( elem, 'display' ) || null;
        if ( !value[ index] ) {
          elem.style.display = "";
        }
      }
      if ( elem.style.display === "" && isHiddenWithinTree( elem ) ) {
        values[ index ] =getDefaultDisplay( elem );
      }
    } else {
      if ( display !== "none" ) {
        values[ index ] = "none";
        dataPriv.set( elem, "display", display );
      }
    }
  }

  for ( index = 0; index < len; index++ ) {
    if ( value.index != null ) {
      elements[ index ].style.display = value[ index ];
    }
  }

  return elements;
}

jQuery.fn.extend( {
  show: function() {
    return showHide( this, true )
  },
  hide: function() {
    return showHide( this, false )
  },
  toggle: function( state ) {
    if ( typeof state === "boolean" ) {
      return state ? this.show() : this.hide();
    }
    return this.each( function() {
      if ( isHiddenWithinTree( this) ) {
        jQuery( this ).show()
      } else {
        jQuery( this ).hide()
      }
    } );
  }
} );

var rcheckableType = ( /^(?:checkbox|radio)$/i );

var rtagName = ( /<([a-z][^\/\0>\x20\t\r\n\f]+)/i );

var rscriptType = ( /^$|^module$|\/(?:java|ecma)script/i );

// We have to close these tags to support XHTML (#13200)
// 支持 XHTML，需要被包裹的标签的映射
var wrapMap = {
  // Support: IE <=9 only
	option: [ 1, "<select multiple='multiple'>", "</select>" ],

	// XHTML parsers do not magically insert elements in the
	// same way that tag soup parsers do. So we cannot shorten
	// this by omitting <tbody> or other required elements.
	thead: [ 1, "<table>", "</table>" ],
	col: [ 2, "<table><colgroup>", "</colgroup></table>" ],
	tr: [ 2, "<table><tbody>", "</tbody></table>" ],
	td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],

	_default: [ 0, "", "" ]
}

wrapMap.optgroup = wrapMap.option;

wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
wrapMap.th = wrapMap.td;

/**
 * [getAll 获取所有标签的元素节点]
 * @return {[type]} [description]
 * @desc
 * 1、获取上下文中的所有 tag 标签
 */
function getAll( context, tag ) {

  var ret;

  if ( typeof context.getElementsByTagName !== "undefined" ) {
    ret = context.getElementsByTagName( tag || "*" );
  } else if ( typeof context.querySelectorAll !== "undefined" ) {
    ret = context.querySelectorAll( tag || "*" );
  } else {
    ret = [];
  }

  if ( tag === undefined || tag && nodeName( context, tag ) ) {
    return jQuery.merge( [ context ], ret );
  }

  return ret;
}

/**
 * [getGlobalEval]
 * @param {[type]} elems       [description]
 * @param {[type]} refElements [description]
 * @return {[type]} [description]
 * @desc
 * 1、标记 script 标签并存储在 dataPriv 中
 */
function getGlobalEval( elems, refElements ) {

}

var rhtml = /<|&#?\w+;/;

/**
 * [buildFragment 创建文档片段并返回]
 * @return {[type]} [description]
 */
function buildFragment() {

}

/*
浏览器功能检测
检测是否支持 check 表单 clone 时状态保留
以及 textarea clone 时内部的值是否保留
 */
( function() {
  var fragment = document.createDocumentFragment(),
		div = fragment.appendChild( document.createElement( "div" ) ),
		input = document.createElement( "input" );

	// Support: Android 4.0 - 4.3 only
	// Check state lost if the name is set (#11217)
	// Support: Windows Web Apps (WWA)
	// `name` and `type` must use .setAttribute for WWA (#14901)
	input.setAttribute( "type", "radio" );
	input.setAttribute( "checked", "checked" );
	input.setAttribute( "name", "t" );

	div.appendChild( input );

	// Support: Android <=4.1 only
	// Older WebKit doesn't clone checked state correctly in fragments
	support.checkClone = div.cloneNode( true ).cloneNode( true ).lastChild.checked;

	// Support: IE <=11 only
	// Make sure textarea (and checkbox) defaultValue is properly cloned
	div.innerHTML = "<textarea>x</textarea>";
	support.noCloneChecked = !!div.cloneNode( true ).lastChild.defaultValue;
} )()

var documentElement = document.documentElement

/*
键盘事件、鼠标事件，以及 . 分隔的命名空间
 */
var
	rkeyEvent = /^key/,
	rmouseEvent = /^(?:mouse|pointer|contextmenu|drag|drop)|click/,
	rtypenamespace = /^([^.]*)(?:\.(.+)|)/;

function returnTrue() {
	return true;
}

function returnFalse() {
	return false;
}

/*
document.activeElement 兼容写法
 */
function safeActiveElement() {
	try {
		return document.activeElement;
	} catch ( err ) { }
}

// -----------------------------------------------------------------------------
// jQuery.evnet 的实现

/**
 * [on 注册事件监听]
 * @return {[type]} [description]
 */
function on( elem, types, selector, data, fn, one ) {

}

jQuery.event = {
  global: {},
  add: function() {},
  remove: function() {},
  dispatch: function() {},
  handlers: function() {},
  addProp: function() {},
  fix: function() {},
  special: {},

}

module.exports = jQuery
