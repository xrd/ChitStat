#!/usr/bin/env node
var sys = require("sys"),
	fs = require("fs"),
	chat = require('../server-lib/server'),
	router = require("../server-lib/router");

var chatd = require( 'chatd' ),
    httpd = require( 'httpd' );

chatd.start();
httpd.start();


// server static web files
function serveFiles(localDir, webDir) {
	fs.readdirSync(localDir).forEach(function(file) {
		var local = localDir + "/" + file,
			web = webDir + "/" + file;
		
		if (fs.statSync(local).isDirectory()) {
			serveFiles(local, web);
		} else {
			chatServer.passThru(web, router.staticHandler(local));
		}
	});
}
serveFiles(__dirname + "/web", "");
chatServer.passThru("/js/nodechat.js", router.staticHandler(__dirname + "/../web/nodechat.js"));
chatServer.passThru("/", router.staticHandler(__dirname + "/web/index.html"));
