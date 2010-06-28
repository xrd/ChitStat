exports.handler = function(app){
    app.get('/', function(req, res, params){
        var examples = [
            '/users (or /users/all)',
            '/users/all.json',
            '/users/0 (or /users/0/view)',
            '/users/0/edit'
        ];
        var body = 'Visit one of the following: <ul>'
            + examples.map(function(str){ return '<li>' + str + '</li>' }).join('\n')
            + '</ul>';
        res.writeHead(200, {
            'Content-Type': 'text/html',
            'Content-Length': body.length
        });
        res.end(body, 'utf8');
    });
}
