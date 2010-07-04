var sys = require('sys');
// require.paths.unshift('../node-lib/restler/lib/');
var restler = require( 'restler' );

// Connect Middleware for integrating RPX Now into your application
var RPX_HOST = 'http://rpxnow.com';
var RPX_LOGIN_ROOT = "/api/v2/auth_info";
var RPX_LOGIN_URL = "https://rpxnow.com/api/v2/auth_info";

var options = {
    callback_path : '/login_completed',
    logout_path : '/logout',
    host : 'localhost',
    port : '80',
    connect_session : 'connect.session',
    name : 'default'
};

function isAuthenticated(req) {
    return req && req.session && req.session.username;
}

function getCredentials(req,res,next) {
    var token = req.body.token;
    postWithCredentials( token, req, res, next );
}

function postWithCredentials( token, req, res, next ) {
    var apiKey = options['apiKey'];
    var toPost = { token : token, apiKey : apiKey, format : 'json', extended : true };
    restler.post( RPX_LOGIN_URL, { data : toPost } ).
    addListener( 'complete', function credentialize(incoming) { onCredentialsReceived( incoming, req, res, next ); } ).
    addListener( 'error', onError );
}

function onError(response) {
    sys.puts( "Something bad happened" );
}

function onCredentialsReceived(data, req, res, next) {
    json = JSON.parse( data );
    if( 'ok' == json.stat ) {
        req.sessionStore.regenerate(req, function(err){
            req.session.username = json.profile.displayName;
        });
        res.redirect( '/' );
    }
    else {
        res.redirect( options.loginPage );
    }
}

function initialize() {
}

function shouldFakeIt() {
    return options.fakedAuthentication;
}

function fakeIt(req,res) {
    req.sessionStore.regenerate(req, function(err){
        req.session.username = ( req.body && req.body.fake_name ) ? req.body.fake_name : 'fakedUsername' + parseInt( Math.random() * 1000 );
        res.redirect( '/' );
    });
}

exports.config = function( key, value ) {
    if( value ) {
        options[key] = value;
    }
    return options[key];
}

exports.test_rpx = function( token, apiKey ) {
    options['apiKey'] = apiKey;
    post_with_credentials( token );
}

exports.handler = function(req,res,next) {
    if( req.url == options.reentryPoint ) {
        getCredentials(req,res,next);
    }
    else if( req.url == options.loginPage ) {
        next();
    }
    else if( req.url == options.logoutPoint ) {
        req.sessionStore.regenerate(req, function(err){
            req.session.username = undefined;
            res.redirect( options.loginPage );
        });
    }
    else {
        if( isAuthenticated(req) ) {
            next();        
        }
        else if( shouldFakeIt() ) {
            fakeIt(req,res);
        }
        else  {
            ignore = options.ignorePaths;
            for( x in ignore ) { 
                if( req.url.substr( 0, ignore[x].length ) == ignore[x] ) {
                    next();
                }
            }
            
            // If we got here, then send to login page
            res.redirect( options.loginPage );
        }
    }
}
    
