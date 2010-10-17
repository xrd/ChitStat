
var sys = require('sys')
var subscribers = [];

var Backend = {
    db : undefined,
    
    storage : function(db) {
        Backend.db = db;
    },

    startR : function(callback) {
        R.startR( callback );
    },
    
    subscribe: function (subscriber) {
        if (subscribers.indexOf(subscriber) < 0) {
            subscribers.push(subscriber);
            if (subscriber.timer) {
                clearTimeout(subscriber.timer);
            }
            subscriber.timer = setTimeout(function () {
                subscriber.flush();
            }, 1000);

        }
    },

    unsubscribe: function (subscriber) {
        var pos = subscribers.indexOf(subscriber);
        if (pos >= 0) {
            subscribers.slice(pos);
        }
    },

    updateNicknameInMessage : function(message,username) {
        message[ 'nick' ] = username;
    },

    dispatchCommand : function( message, session, callback ) {
        if( 'R' == message.type ) {
            R.command( message.message, session, function(response) {
                callback(response);
            } );
        }
        else {
            callback();
        }
    },

    publish : function (req, res, callback) { 
        var message = req.body;
        // gather all the nicknames
        var nicks = [];
        subscribers.forEach( function( subscriber ) {
            nicks.push( subscriber.req.session.username );
        });
        Backend.updateNicknameInMessage( message, req.session.username );
        
        var fullMessage = {};
        fullMessage['message'] = message;
        fullMessage['timestamp'] = (new Date()).valueOf();
        // store the message
        Backend.db.store( fullMessage );

        // add the nicks later because we don't need to store this in the database
        fullMessage['nicks'] = nicks;

        Backend.dispatchCommand( message, 
                                 req.session.id, 
                                 function(result) {
                                     subscribers.forEach(function (subscriber) {
                                         subscriber.send( fullMessage );
                                     });
                                     //callback();
                                 });
        callback();
    }
};

exports.backend = Backend;

var R = {
    r : undefined,
    response_callback : undefined,
    
    out : function(data) {
        try {
            sys.puts( "Data: " + data );
            if( R.response_callback ) {
                R.response_callback( data );
            }
        } catch( err ) {
            sys.puts( "Some error oxcured" );
        }
    },
    
    start : function(callback) {
        var spawn = require('child_process').spawn;
        // Seem to need interactive or the script dies after an error is received, like for bad input
        R.r = spawn('R', [ '--no-save', '--interactive' ] ); 
        R.r.stderr.addListener( 'data', function( data ) {
            R.out(data);
            //      sys.puts( "ERROR: " + data );
        });
        R.r.stderr.addListener( 'error', function( data ) {
            R.out(data);
            // sys.puts( "ERROR: " + data );
        });
        R.r.stdout.addListener( 'data', function( data ) {
            R.out(data);
            // if( callback ) { callback(data); }
        });

        R.r.stdout.addListener( 'error', function( data ) {
            R.out(data);
            //sys.puts( "R (error):" + data );
            //if( callback ) { callback(data); }
        });
    },

    command : function(message,session, callback) {
        R.r.stdin.write( "png('" + session + '-' + (new Date()).valueOf() + ".png')\n");
        R.r.stdin.write(message+"\n");
        // R.response_callback = callback;
    }
    
};

exports.r = R;
