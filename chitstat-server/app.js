require.paths.unshift("./lib");
var Connect = require('connect');
var root = __dirname + "/public";
var sys = require('sys');
var chitstatdb = require('chitstatdb');


var subscribers = [];

var Backend = {
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
            sys.puts( "Sending message" + message['message'] );
            chitstatdb.store( message )
            subscriber.send(message);
        });
        callback();
    }
};

chitstatdb.init();

module.exports = new Connect.Server([
    //{filter: "log"},
    {filter: "response-time"},
    {filter: "body-decoder"},
    {provider: "pubsub", route: "/stream", logic: Backend},
    {filter: "conditional-get"},
    //{filter: "cache"},
    {filter: "gzip"},
    //{provider: "cache-manifest", root: root},
    {provider: "static", root: root}
]);