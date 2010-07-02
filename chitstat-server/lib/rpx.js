var sys = require('sys');
require.paths.unshift('../node-lib/restler/lib/');
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

// This method will return to sign in with the widget.
function login_widget_url(app_name) {
    return 'https://' + app_name + '.rpxnow.com/openid/v2/signin?token_url=' + callback_url;
}

function callback_url() {
    return "http://" + this.env['HTTP_HOST'] + options['callback_path'];
}

function get_credentials(req,res,next) {
    var token = req.body.token;
    post_with_credentials( token, req, res, next );
}

function post_with_credentials( token, req, res, next ) {
    var apiKey = options['apiKey'];
    var toPost = { token : token, apiKey : apiKey, format : 'json', extended : true };
    restler.post( RPX_LOGIN_URL, { data : toPost } ).
    addListener( 'complete', function credentialize(incoming) { on_credentials_received( incoming, req, res, next ); } ).
    addListener( 'error', on_error );
}

function on_error(response) {
    sys.puts( "Something bad happened" );
}

function on_credentials_received(data, req, res, next) {
    json = JSON.parse( data );
    if( 'ok' == json.stat ) {
        req.sessionStore.regenerate(req, function(err){
            req.session.username = json.profile.displayName;
        });
        res.redirect( '/' );
    }
    else {
        res.redirect( 'login.html' );
    }
}

function initialize() {
}

function shouldFakeIt() {
    return options.fakedAuthentication;
}

function fakeIt(req,res) {
    req.sessionStore.regenerate(req, function(err){
        req.session.username = ( req.body && req.body.fake_name ) ? req.body.fake_name : 'someFakeUsername';
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
        get_credentials(req,res,next);
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
    
