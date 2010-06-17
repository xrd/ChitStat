var sys = require('sys'),
    http = require('http');

var TheR = {
    handler : function(err,req,res) {
        http.createServer(function (request, response) {
            response.writeHead(200, {'Content-Type': 'text/plain'});
            
            // Open a pipe for R
            require('child_process').spawn()
            
            response.end('Hello World\n');
        });
    }
}