require.paths.unshift('/Users/xrdawson/chitstat/node-chat/lib');

var sys = require( 'sys' ),
    chat = require('server'),
    router = require("router");

var fs = require('fs');

exports.handle = function handle(err, req, res, next) {
    sys.puts( "Starting server" );
    
    // create chat server
    var chatServer = chat.createServer();
    //  chatServer.listen(8010);
    
    // create a channel and log all activity to stdout
    chatServer.addChannel({
	basePath: "/chat"
    }).addListener("msg", function(msg) {
	sys.puts("<" + msg.nick + "> " + msg.text);
    }).addListener("join", function(msg) {
	sys.puts(msg.nick + " join");
    }).addListener("part", function(msg) {
	sys.puts(msg.nick + " part");
    });
    
    chatServer.passThru("/", passThrough );
}