const $ = require("../dist/jquery-3.3.1");

$('.a').data( 'test', '123' );
$('.b').data( 'test', '456' );

console.log( $('div').data() )
