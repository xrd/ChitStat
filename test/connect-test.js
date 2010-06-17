// var the_r = require('r-server');

module.exports = require('../node-lib/connect/lib/connect').createServer([
    { filter: 'log' },
    { filter: 'response-time' },
    { module: {
        handle: function(err, req, res){

            var body = 'Hello World';
            res.writeHead(200, {
                'Content-Type': 'text/plain',
                'Content-Length': body.length
            });
            res.end(body);


            // TheR.handler(err,req,res);
        },
        route: '/blither'
    }}
]);
