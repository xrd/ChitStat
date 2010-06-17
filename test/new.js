#!/usr/local/bin/node

require.paths.unshift( "node-lib/express/lib" );
require( 'express' )

configure( function() {
    set( 'root', __dirname )
    set( 'port', 9123 )
})

get( '/user', function() {
    this.redirect( "/User/" + this.currentUser.id );
})

get( "/user/:id", function() {
    this.render( "user.html.haml", { 
        locals : {
            user : this.currentUser,
            usersOnline : Session.store.length()
        }
    })
})

run()