require.paths.unshift("./lib");
var Connect = require('connect/lib/connect');
var sys = require('sys');
var chitstatdb = require('chitstatdb');
var user = require('user');
var login = require('login');
var subscriber = require('subscriber');
var main = require('main');
var MemoryStore = require('connect/lib/connect/middleware/session/memory').MemoryStore;
require.paths.unshift('../node-lib/connect-rpx');
require.paths.unshift('../node-lib/restler/lib');
var RPX = require( 'rpx' );

RPX.config( 'apiKey', '8a860c7cedd91259efb6f2ffd2f6a14f394b79af' );
RPX.config( 'ignorePaths', [ '/stylesheets', '/images', '/javascript', '/css' ] );
RPX.config( 'reentryPoint',  '/rpx_login' );
RPX.config( 'logoutPoint',  '/logout' );
RPX.config( 'loginPage',  '/static/login.html' );
RPX.config( 'fakedAuthentication', true );

function handleROutput( data ) {
    sys.puts( "R: " + data );
}

chitstatdb.init();
subscriber.backend.storage( chitstatdb );
subscriber.r.start( handleROutput );

// One minute
var minute = 60000;
var root = __dirname + "/public";
var Server = module.exports = Connect.createServer(
    // Connect.logger(),
    Connect.bodyDecoder(),
    Connect.redirect(),
    Connect.cookieDecoder(),
    Connect.session({ store: new MemoryStore({ reapInterval: minute, maxAge: minute * 5 }) }),
    RPX.handler,
    Connect.flash(),
    Connect.staticProvider( root )
);

Server.use("/stream", Connect.pubsub(subscriber.backend) );;

