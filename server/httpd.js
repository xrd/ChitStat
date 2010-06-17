require.paths.unshift('node-lib/express/lib')

var sys = require('sys'),
    fs = require( 'fs' ),
    http = require('http');

function httpdServeFiles() {
    require('express');

    configure(function(){
        set('root', __dirname)
    })
    
    get('/user', function(){
        this.redirect('/user/' + this.currentUser.id)
    })
    
    get('/user/:id', function(id){
        this.render('user.haml.html', {
            locals: {
                user: this.currentUser,
                usersOnline: Session.store.length()
            }
        })
    })
    
    run();
}

// server static web files
function serveFiles(localDir, webDir) {
    fs.readdirSync(localDir).forEach(function(file) {
	var local = localDir + "/" + file,
	    web = webDir + "/" + file;
	
	if (fs.statSync(local).isDirectory()) {
	    serveFiles(local, web);
	} else {
	    chatServer.passThru(web, router.staticHandler(local));
	}
    });
}

exports.start = function(chatServer) {
    httpdServeFiles();
    //serveFiles(__dirname + "/web", "");
    //chatServer.passThru("/js/nodechat.js", router.staticHandler(__dirname + "/../web/nodechat.js"));
    //chatServer.passThru("/", router.staticHandler(__dirname + "/web/index.html"));
}




