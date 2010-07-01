require.paths.unshift("./lib");
//require.paths.unshift("./lib/connect/lib");
var Connect = require('connect/lib/connect');
var sys = require('sys');
var chitstatdb = require('chitstatdb');
var user = require('user');
var login = require('login');
var subscriber = require('subscriber');
var main = require('main');
var MemoryStore = require('connect/lib/connect/middleware/session/memory').MemoryStore;
var RPX = require( 'rpx' );

RPX.config( 'apiKey', '8a860c7cedd91259efb6f2ffd2f6a14f394b79af' );
RPX.config( 'ignorePaths', [ '/stylesheets/', '/images/', '/javascripts/' ] );
RPX.config( 'entryPoint',  '/rpx_login' );
RPX.config( 'logoutPoint',  '/logout' );
RPX.config( 'loginPoint',  '/static/login.html' );

chitstatdb.init();
subscriber.backend.storage( chitstatdb );

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

Server.use("/stream", Connect.pubsub(subscriber.backend) );
//Server.use("/users/", Connect.router(user.handler));
//Server.use("/main", Connect.router(main.handler));
//Server.use('/login', Connect.router(login.handler) );
//Server.use("/status", Connect.router( RPX.handler ) );

