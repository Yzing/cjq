const $ = require("../dist/jquery-3.3.1");

var list = $.Callbacks();

let n = 0;
let i = 0;

const fn = function( arg ) {
  let start = new Date().getTime();
  let i, j;
  for ( i = 0; i < 100000; i ++ ) {
    for ( j = 0; j < 10000; j++ );
  }
  n++;
  console.log( n + ' is updated by: ' +arg );
  let end = new Date().getTime();
  console.log( 'execute time: ' + ( end - start ) );
}

list.add( [ fn, fn ] );

list.fire( 'a' );
list.fire( 'b' );
list.fire( 'c' );
