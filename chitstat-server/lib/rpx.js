var RPX = {
  
    // Connect Middleware for integrating RPX Now into your application
    RPX_HOST : 'rpxnow.com',
    RPX_LOGIN_ROOT = "/api/v2/auth_info",
    RPX_LOGIN_URL : "https://rpxnow.com/api/v2/auth_info",
    
    OPTIONS : {
        callback_path : '/login_completed',
        logout_path : '/logout',
        host : 'localhost',
        port : '80',
        connect_session : 'connect.session',
        name : 'default'
    },
    
    get_credentials : function(token) {
        RPX.get_credentials(token);
    },

    check_session_for_authentication(req) {
        req.cookies.
    }

    // This method will return to sign in with the widget.
    login_widget_url : function(app_name) {
        return 'https://' + RPX.app_name + '.rpxnow.com/openid/v2/signin?token_url=' + RPX.callback_url;
    },

    callback_url : function() {
        return "http://" + this.env['HTTP_HOST'] + RPX.OPTIONS['callback_path'];
    },

    get_credentials : function(token) {

//         var sys = require('sys'),
//             http = require('http');
//         var google = http.createClient(80, 'www.google.com');
//         var request = google.request('GET', '/',
//             {'host': 'www.google.com'});
//         request.addListener('response', function (response) {
//             sys.puts('STATUS: ' + response.statusCode);
//             sys.puts('HEADERS: ' + JSON.stringify(response.headers));
//             response.setEncoding('utf8');
//             response.addListener('data', function (chunk) {
//                 sys.puts('BODY: ' + chunk);
//             });
//         });
//         request.end();
        

        // u = URI.parse(
        // req = Net::HTTP::Post.new(u.path)
        var client = http.createClient(80, RPX_HOST );
        var request = client.request( 'POST', RPX_LOGIN_ROOT, { 'host': RPX_HOST } );
        // req.set_form_data({:token => token, :apiKey => OPTIONS[:api_key], :format => 'json', :extended => 'true'})
        // Post back this data above
        request.
        
        request.addListener( 'response', RPX.on_credentials_received );
        
        // make the request
        request.end();
    },

    on_credentials_received : function(response) {
        json = JSON.parse(response.body)
        // raise LoginFailedError, "Cannot log in. Try another account! #{json.inspect}" unless json['stat'] == 'ok'
        return json;
    },
    
    initialize : function() { // app, *options
        // @app = app
        // OPTIONS.merge! options.pop
    }
};

exports.handler = function(err,req,res,foo) {
    // Check to see if the cookie is there in the session
    if( RPX.check_session_for_authentication( req ) ) {
        next();        
    }
    else {
        RPX.
    }

},
    
