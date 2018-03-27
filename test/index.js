const $ = require("../dist/jquery-3.3.1");

let defer = $.Deferred();
let defer2 = $.Deferred();

let ndefer = defer.pipe(
  function( args ) {
    console.log( args )
  },
  function() {
    console.log( 'fail' )
  },
  function( args ) {
    console.log( args )
    return args + ' through progress'
  }
)

ndefer.progress( function ( args ) {
  console.log( args )
} )

defer.notify( 'defer args' )
defer.notify( 'defer args' )
