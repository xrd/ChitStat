var sys = require( 'sys' );

exports.start = function() {
    sys.puts( "Starting server" );


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

}