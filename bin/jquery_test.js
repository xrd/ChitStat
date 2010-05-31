#!/usr/local/bin/node

var jq = require( "../jquery" ),
    http = require('http'),
    sys = require( 'sys' );
    r = require( 'load_r' );

function doIt( html ) {
    sys.puts( "Got something" );
}

LoadR.load( doIt );

