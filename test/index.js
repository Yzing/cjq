const $ = require("../dist/jquery-3.3.1");

let defer = $.Deferred();

let promise = defer.promise();
console.log( promise )

let defer2 = $.Deferred();

let defer3 = $.Deferred();

let newPromise = promise.then(
  function( args ) {
    console.log( this )
    console.log( args )
    return defer2;
  },
  function( e ) {
    console.log( 'rejected', e )
  },
  function() {
    console.log( 'progress' )
  }
)

newPromise.done(
  function( arg ) {
    console.log( this )
    console.log( 'new Promise done' )
  }
)

defer2.resolve( )
defer.resolve( '111' )
