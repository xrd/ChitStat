var users = [
    { name: 'tj' },
    { name: 'tim' }
];

exports.handler = function( app ) {
// function user(app){
    app.get('/(all.:format?)?', function(req, res, params){
        var body;
        switch (params.format) {
            case 'json':
                body = JSON.stringify(users);
                break;
            default:
                 body = '<ul>'
                    + users.map(function(user){ return '<li>' + user.name + '</li>'; }).join('\n')
                    + '</ul>';
        }
        res.writeHead(200, {
            'Content-Type': 'text/html',
            'Content-Length': body.length
        });
        res.end(body, 'utf8');
    });

    app.get('/:id/:op?', function(req, res, params){
        var body = users[params.id]
            ? users[params.id].name
            : 'User ' + params.id + ' does not exist';
        body = (params.op || 'view') + 'ing ' + body;
        res.writeHead(200, {
            'Content-Type': 'text/html',
            'Content-Length': body.length
        });
        res.end(body, 'utf8');
    });
}

