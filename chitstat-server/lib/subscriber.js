
var sys = require('sys')
var subscribers = [];

var Backend = {
    db : undefined,
    
    storage : function(db) {
        Backend.db = db;
    },
    
    subscribe: function (subscriber) {
        sys.puts( "Sub: " + subscriber );
        if (subscribers.indexOf(subscriber) < 0) {
            sys.puts( "Adding new subscriber, count: " + subscribers.length );
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
            sys.puts( "Sending message: " + message['message'] );
            Backend.db.store( message );
            subscriber.send(message);
        });
        callback();
    }
};

exports.backend = Backend;