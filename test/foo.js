var sys = require('sys'),
    http = require('http');
http.createServer(function (request, response) {
    response.writeHead(200, {'Content-Type': 'text/plain'});

    // Open a pipe for R
    require('child_process').spawn()

    response.end('Hello World\n');
}).listen(8000);
sys.puts('Server running at http://127.0.0.1:8000/');
