var http = require('http'), 
    sys = require( 'sys' );


exports.load = function( func ) {
        var fullPage = '';
        all_r = http.createClient(80, 'cran.r-project.org' );
        var request = all_r.request('GET', '/doc/manuals/R-intro.html',
            {'host': 'cran.r-project.org'});
        request.addListener('response', function (response) {
            //sys.puts('STATUS: ' + response.statusCode);
            //sys.puts('HEADERS: ' + JSON.stringify(response.headers));
            response.setEncoding('utf8');
            response.addListener('data', function (chunk) {
                fullPage += chunk;
                //sys.puts('BODY: ' + chunk);
            });
            
            response.addListener('end', function() {
                //sys.puts( "Got all data, now processing" );
                func(fullPage);
            });
        });
        
        request.end();
}
