
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

    publish: function (message, callback) {
        subscribers.forEach(function (subscriber) {
            // add to the message
            message[ 'nick' ] = subscriber.req.session.username;
            message[ 'type' ] = 'R';
            // do something with R
            if( 'R' == message.type ) {
                R.command( message.message, subscriber.req.session.id );
            }
            // store the message
            // Backend.db.store( message );
            subscriber.send(message);
        });
        callback();
    }
};

exports.backend = Backend;

var R = {
    r : undefined,

    start : function(callback) {
        var spawn = require('child_process').spawn;
        // Seem to need interactive or the script dies after an error is received, like for bad input
        R.r = spawn('R', [ '--no-save', '--verbose', '--interactive' ] ); 
        R.r.stderr.addListener( 'data', function( data ) {
            // sys.puts( "ERROR: " + data );
        });
        R.r.stderr.addListener( 'error', function( data ) {
            // sys.puts( "ERROR: " + data );
        });
        R.r.stdout.addListener( 'data', function( data ) {
            sys.puts( "R:" + data );
            if( callback ) { callback(data); }
        });

        R.r.stdout.addListener( 'error', function( data ) {
            sys.puts( "R (error):" + data );
            if( callback ) { callback(data); }
        });
    },

    command : function(message,sessionid) {
        R.r.stdin.write( "png('" + sessionid + '-' + (new Date()).valueOf() + ".png')\n");
        R.r.stdin.write(message+"\n");
    }
    
};




exports.r = R;
