#!/usr/local/bin/node

require.paths.unshift('bin');

var sys = require('sys'),
    fs = require('fs'),
    r = require( 'load_r' ),
    htmlparser = require( '../htmlparser' );

function parse_ul( tag, attrs ) {

}

function parseR(rawHtml) {
    //var file = fs.createWriteStream( 'funcs.json', { 'flags' : 'w+' } );
    
    var started = false;
    var results = "";
    HTMLParser( rawHtml, {
        start: function( tag, attrs, unary ) {
            sys.puts( "Found tag: " + tag );
            if( false ) {
                if( started == true || ( 'ul' == tag && 'index-vr' == attrs['class'] ) ) {
                    //sys.puts( "Tag: " + tag );
                    started = true;
                    results += "<" + tag;
                
                    for ( var i = 0; i < attrs.length; i++ )
                        results += " " + attrs[i].name + '="' + attrs[i].escaped + '"';
                    
                    results += (unary ? "/" : "") + ">";
                }
            }
        },
        end: function( tag ) {
            if( false ) {
            if( started && 'ul' == tag ) {
                results += "</" + tag + ">";
                started = false;
            }
            }
        },
        chars: function( text ) {
            results += text;
        },
        comment: function( text ) {
            results += "<!--" + text + "-->";
        }
    } );
    
    sys.puts( results );
}

r.load( parseR );
