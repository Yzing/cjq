const $ = require("../dist/jquery-3.3.1");

let d1 = $.Deferred();
let d2 = $.Deferred();
let d3 = $.Deferred();

$.when( d1, d2, d3 ).done(
  function() {
    console.log( this )
  }
)
d1.resolveWith( window );
d2.resolveWith( window );
d3.resolveWith( window );
