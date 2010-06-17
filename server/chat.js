#!/usr/bin/env node

require.paths.unshift('/Users/xrdawson/chitstat/server');

var chatd = require( 'chatd' ),
    httpd = require( 'httpd' );

var chatserver = chatd.start(httpd.start);
//httpd.start(chatserver);


