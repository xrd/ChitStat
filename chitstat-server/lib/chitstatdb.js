var db;
require.paths.unshift('../node-lib/riak-js/lib');
var Riak = require('riak-node');

module.exports = {

    init : function() {
        db = new Riak.Client();
    },

    store : function( input ) {
        db.save('messages', undefined, input )(); 
    }
};