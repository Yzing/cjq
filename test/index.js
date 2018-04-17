const $ = require("../dist/jquery-3.3.1");

$('.a').queue(
  function( next, hooks ) {
    hooks.empty.add( function() { console.log( 'empty' ) } );
    this.style.width = '100px';
    this.style.height = '100px';
    this.style.background = 'red';
    next()
  }
)
