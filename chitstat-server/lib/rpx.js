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

function is_authenticated(req) {
    sys.puts( "Checking for username" );
    var rv = false;
        sys.puts( "Username: " + req.session.username );
    if( req && req.session && req.session.username ) {
        sys.puts( "Username: " + req.session.username );
        rv = true;
    }
    return rv;
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
    sys.puts( "Token: " + token );
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
    sys.puts( "RESPONSE: " + data );
    json = JSON.parse( data );
    if( 'ok' == json.stat ) {
        sys.puts( "JSON Username: " + json.profile.displayName );
        req.sessionStore.regenerate(req, function(err){
            req.session.username = json.profile.displayName;
            sys.puts( "Storing username: " + json.profile.displayName );
        });
        res.redirect( '/' );
    }
    else {
        res.redirect( 'login.html' );
    }
}

function initialize() {
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
    // sys.puts( "Well, what have we here: " + req.url );
    if( req.url.substr( 0, "/stylesheets/".length ) == '/stylesheets/' || 
        req.url.substr( 0, "/images/".length ) == '/images/' || 
        req.url.substr( 0, "/javascripts/".length ) == '/javascripts/' ) {
        sys.puts( "[Skipping static: " + req.url + "]" );
        next();
    }
    else if( req.url == '/rpx_login' ) {
       // sys.puts( "Inside the authenticator!" );
        get_credentials(req,res,next);
    }
    else if( req.url == '/login.html' ) {
        // sys.puts( "Need to log them in for: " + req.url );
        next();
    }
    else if( req.url == '/logout' ) {
        req.sessionStore.regenerate(req, function(err){
            req.session.username = undefined;
        });
        next();
    }
    else {
        // Check to see if the cookie is there in the session
        if( is_authenticated(req) ) {
            sys.puts( "Found username" );
            next();        
        }
        else {
            res.redirect( '/login.html' );
        }
    }
}
    
