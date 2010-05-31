#!/usr/local/bin/node

var sys = require('sys'),
    http = require('http'),
    fs = require('fs'),
    // htmlparser = require("../node-htmlparser/node-htmlparser");
    htmlparser = require( '../htmlparser' );

function parseR(rawHtml) {
    var handler = new htmlparser.DefaultHandler(function (error, dom) {
        var file = fs.createWriteStream( 'funcs.json', { 'flags' : 'w+' } );

        if (error) {
            //[...do something for errors...]
        }
        else {
            
            var started = false;
            var results = "";
            HTMLParser( rawHtml, {
                start: function( tag, attrs, unary ) {
                    if( started == true || ( 'ul' == tag && 'index=vr' == attrs['class'] ) ) {
                        started = true;
                        results += "<" + tag;
                        
                        for ( var i = 0; i < attrs.length; i++ )
                            results += " " + attrs[i].name + '="' + attrs[i].escaped + '"';
                        
                        results += (unary ? "/" : "") + ">";
                    }
                },
                end: function( tag ) {
                    if( started && 'ul' == tag ) {
                        results += "</" + tag + ">";
                        started = false;
                    }
                },
                chars: function( text ) {
                    results += text;
                },
                comment: function( text ) {
                    results += "<!--" + text + "-->";
                }
            });

            sys.puts( results );

//             var funs = htmlparser.DomUtils.getElements({ class: "index-vr" }, dom);
//             // sys.debug( "Stuff: " + sys.inspect( funs ) );
//             nested = htmlparser.DomUtils.getElementsByTagName("li", funs);
//             // sys.debug( "Stuff: " + sys.inspect( nested ) );      
//             for( i in nested ) {
//                 // sys.puts( "Processing new li" );
//                 var n_n_d = htmlparser.DomUtils.getElementsByTagName("a", i);
//                 var out = n_n_d[0] + " : " + n_n_d[1] + "\n";
//                 sys.puts( out );
//                 file.write( out );
//             }
//             file.end();
//            sys.puts( "Wrote out file" );
        }
    });
    var parser = new htmlparser.Parser(handler);
    parser.parseComplete(rawHtml);
    // sys.puts(sys.inspect(handler.dom, false, null));
}

var fullPage = '';

var all_r = http.createClient(80, 'cran.r-project.org' );
var request = all_r.request('GET', '/doc/manuals/R-intro.html',
    {'host': 'cran.r-project.org'});
request.addListener('response', function (response) {
    sys.puts('STATUS: ' + response.statusCode);
    sys.puts('HEADERS: ' + JSON.stringify(response.headers));
    response.setEncoding('utf8');
    response.addListener('data', function (chunk) {
        fullPage += chunk;
        //sys.puts('BODY: ' + chunk);
    });

    response.addListener('end', function() {
        sys.puts( "Got all data, now processing" );
        parseR( fullPage );
    });
});

request.end();

// parseR();
