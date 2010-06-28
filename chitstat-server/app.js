require.paths.unshift("./lib");
require.paths.unshift("./lib/connect/lib");
var Connect = require('connect');
var root = __dirname + "/public";
var sys = require('sys');
var chitstatdb = require('chitstatdb');
var user = require('user');
var login = require('login');
var subscriber = require('subscriber');
var main = require('main');
var MemoryStore = require('connect/middleware/session/memory').MemoryStore;
var RPX = require( 'rpx' );

chitstatdb.init();
subscriber.backend.storage( chitstatdb );

// One minute
var minute = 60000;

var Server = module.exports = Connect.createServer(
    Connect.logger(),
    Connect.bodyDecoder(),
    Connect.redirect(),
    Connect.cookieDecoder(),
    Connect.session({ store: new MemoryStore({ reapInterval: minute, maxAge: minute * 5 }) }),
    Connect.flash(),
    Connect.staticProvider( root )
);

Server.use("/", Connect.router( RPX.handler ) );
Server.use("/stream",
           Connect.bodyDecoder(),
           Connect.pubsub(subscriber.backend)
          );
Server.use("/users/", Connect.router(user.handler));
Server.use("/main", Connect.router(main.handler));
Server.use('/login', Connect.router(login.handler) );

