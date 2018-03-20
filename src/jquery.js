
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

module.exports = jQuery
