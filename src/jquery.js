
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




var preservedScriptAttributes = {
	type: true,
	src: true,
	noModule: true
};

// execise js
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


function toType( obj ) {
	if ( obj == null ) {
		return obj + "";
	}

	// Support: Android <=2.3 only (functionish RegExp)
	return typeof obj === "object" || typeof obj === "function" ?
		class2type[ toString.call( obj ) ] || "object" :
		typeof obj;
}

var rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;

// core, make the jQuery has some array's feature
jQuery.fn = jQuery.prototype = {

  constructor: jQuery,

  jquery: version,

  length: 0,

  toArray: function() {
    return slice.call( this );
  },

  get: function( num ) {

		// Return all the elements in a clean array
		if ( num == null ) {
			return slice.call( this );
		}

		// Return just the one element from the set
		return num < 0 ? this[ num + this.length ] : this[ num ];
	},

  pushStack: function( elems ) {

    var ret = jQuery.merge( this.constructor(), elems );

    ret.prevObject = this;

    return ret;

  },

  each: function( callback ) {
    return jQuery.each( this, callback );
  },

  map: function( callback ) {
    return this.pushStack( jQuery.map( this, function( elem, i ) {
      return callback.call( elem, i, elem );
    } ) );
  },

  slice: function() {
    return this.pushStack( slice.apply( this, arguments ) );
  },

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

  end: function() {
    return this.prevObject || this.constructor();
  },

  push: push,

  sort: arr.sort,

  splice: arr.splice,

}

// inject other module into jQuery
jQuery.extend = jQuery.fn.extend = function() {
  var
    options, // save each option object
    target = arguments[0] || {}, // first argument is the target
    i = 1, // indicate the option index
    length = arguments.length,
    copy,
    copyIsArray,
    src,
    clone,
    deep = false; // option indicating whether the extend is deep mode

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

jQuery.extend({

  // Unique for each copy of jQuery on the page
	expando: "jQuery" + ( version + Math.random() ).replace( /\D/g, "" ),

	// Assume jQuery is ready without the ready module
	isReady: true,

	error: function( msg ) {
		throw new Error( msg );
	},

	noop: function() {},

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

  isEmptyObject: function( obj ) {
    var name;
    for ( name in obj ) {
      return false;
    }
    return true;
  },

  globalEval: function( code ) {
    DOMEval( code );
  },

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

  trim: function( text ) {
    return text === null ?
      "" :
      ( text + "" ).replace( rtrim, "");
      // how to build a effictive regex ?
  },

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

  inArray: function( ele, array, i ) {
    return ele === null ? -1 : indexOf.call( array, ele, i );
  },

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

  support: support
})

// let jQuery has array's iterator, so that it can be used like for of
if ( typeof Symbol === "function" ) {
	jQuery.fn[ Symbol.iterator ] = arr[ Symbol.iterator ];
}

jQuery.each( "Boolean Number String Function Array Date RegExp Object Error Symbol".split( " " ),
function( i, name ) {
	class2type[ "[object " + name + "]" ] = name.toLowerCase();
} );

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

jQuery.find = Sizzle;
jQuery.expr = Sizzle.selectors;

// Deprecated
// inject sizzle into jquery
jQuery.expr[ ":" ] = jQuery.expr.pseudos;
jQuery.uniqueSort = jQuery.unique = Sizzle.uniqueSort;
jQuery.text = Sizzle.getText;
jQuery.isXMLDoc = Sizzle.isXML;
jQuery.contains = Sizzle.contains;
jQuery.escapeSelector = Sizzle.escape;

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

var siblings = function( n, elem ) {
  var matched = [];
  for ( ; n; n = n.nextSibling ) {
    if ( n.nodeType === 1 && n !== elem ) {
      matched.push( elem );
    }
  }
  return matched;
};

var rneedContext = jQuery.expr.match.needsContext;

function nodeName( elem, name ) {

  return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();

};

// match single tag, capture the tag's name, including self closed
var singleTag = ( /^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i );

// filt the elements through qualifier
// qualifier can be function, node, arrayLike Object, and selector
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

// use selector to filt the elements
jQuery.filter = function( expr, elems, not ) {
  var elem = elems[0];

  // handle not option
  if ( not ) {
    expr = ':not(' + expr + ')';
  }

  // if elems only contains one elem, handle it with a easy way
  if ( elems.length === 1 && elem.nodeType === 1 ) {
    return jQuery.find.matchesSelector( elem, expr ) ? [ elem ] : [];
  }

  return jQuery.find.matches( jQuery.grep( elems, function( elem ) {
    return elem.nodeType === 1;
  } ) );
}

jQuery.fn.extend( {
  find: function( selector ) {
    var i, ret,
      len = this.length,
      self = this;

    // if selector is an arrayLike Object, select elem from this which contains selector
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

    // if this contains more than one element, should ensure every result is unique
    return len > 1 ? jQuery.uniqueSort( ret ) : ret
  },
  filter: function( selector ) {
    return this.pushStack( winnow( this, selector || [] , false ) );
  },
  not: function( selector ) {
    return this.pushStack( winnow( this, selector || [], true ) );
  },
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

var rootjQuery,

  quickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/,

  init = jQuery.fn.init = function( selector, context, root ) {
    var match, elem;

    if ( !selector ) {
      return this;
    }

    root = root || rootjQuery;

    if ( typeof selector === 'string' ) {

      if ( selector[ 0 ] === '<' &&
        selector[ selector.length - 1 ] === '>' &&
        selector.length >=3 ) {
        match = [ null, selector, null ];
      } else {
        match = quickExpr.exec( selector );
      }

      if ( match && ( match[ 1 ] || !context )) {
        if ( match[ 1 ] ) {
          context = context instanceof jQuery ? context[ 0 ] : context;
          jQuery.merge( this, jQuery.parseHTML(
            match[ 1 ],
            context && context.nodeType ? context.ownerDocument || context : document,
            true
          ) );

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
          elem = document.getElementById( match[ 2 ] );
          if ( elem ) {
            this[ 0 ] = elem;
            this.length = 1;
          }
          return this;
        }
      } else if ( !context || context.jquery ) {
        return ( context || root ).find( selector );
      } else {
        return this.constructor().find( selector );
      }
    } else if ( selector.nodeType ) {
      this[ 0 ] = selector;
      this.length = 1;
      return this;
    } else if ( isFunction( selector ) ) {
      return root.ready !== undefined ?
        root.ready( selector ) :
        selector( jQuery );
    }

    return jQuery.makeArray( selector, this );
  };

  init.prototype = jQuery.fn;

  rootjQuery = jQuery( document );

  //-------------------- 以上代码基本完成 jQuery 的构造和元素筛查 ^_^ --------------------
  //-------------------- 之后代码基本是对核心进行扩展，借助了很多上面的核心方法 --------------

  var rparentsprev = /^(?:parents|prev(?:Until|All))/,

  	// Methods guaranteed to produce a unique set when starting from a unique set
  	guaranteedUnique = {
  		children: true,
  		contents: true,
  		next: true,
  		prev: true
  	};

    jQuery.fn.extend( {
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
      index: function( elem ) {

      },
      add: function( selector, context ) {
        return this.pushStack( jQuery.uniqueSort(
          jQuery.merge(
            this.get(),
            jQuery( selector, context )
        ) ) );
      },
      addBack: function( selector ) {
        return this.add( selector == null ?
          this.prevObject : this.prevObject.filter( selector )
        );
      }
    } );

    function sibling( cur, dir ) {
      while ( ( cur = cur[ dir ] ) && cur.nodeTyep !== 1 ) {}
      return cur;
    }

    // jQuery traversal methods
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

    var rnothtmlwhite = ( /[^\x20\t\r\n\f]+/g );

    function createOptions( options ) {
      var object = {};
      jQuery.each( options.match( rnothtmlwhite ) || [], function( _, flag ) {
        object[ flag ] = true;
      } )
      return object;
    }

    // Deffer implement, include callback list
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

var rerrorNames = /^(Eval|Internal|Range|Reference|Syntax|Type|URI)Error$/;

jQuery.Deferred.exceptionHook = function( error, stack ) {

	// Support: IE 8 - 9 only
	// Console exists when dev tools are open, which can happen at any time
	if ( window.console && window.console.warn && error && rerrorNames.test( error.name ) ) {
		window.console.warn( "jQuery.Deferred exception: " + error.message, error.stack, stack );
	}
};

jQuery.readyException = function( error ) {
	window.setTimeout( function() {
		throw error;
	} );
};


var readyList = jQuery.Deferred();

jQuery.fn.ready = function( fn ) {
  readyList.then(
    fn
  ).catch( function( error ) {
    jQuery.readyException( error );
  } );
  return this;
};

jQuery.extend( {
  isReady: false,
  readyWait: 1,
  ready: function( wait ) {
    if ( wait === true ? --jQuery.readyWait : jQuery.isReady ) {
      return;
    }
    jQuery.isReady = true;
    if ( wait !== true && --jQuery.readyWait > 0 ) {
      return;
    }
    readyList.resolveWith( document, [ jQuery ] );
  }
} );

jQuery.ready.then = readyList.then;

module.exports = jQuery
