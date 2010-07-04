var r;

function start(callback) {
    var spawn = require('child_process').spawn;
    r = spawn('R', [ '--no-save', '--verbose' ] ); //, [ '--no-restore', '--no-save', '--verbose' ]);
    r.stderr.addListener('data', function( data ) {
        sys.puts( "ERROR: " + data );
    });
    r.stdout.addListener( 'data', function( data ) {
        // sys.puts( "R:" + data );
        if( callback ) { callback(data); }
    });
}

function command(message) {
    // sys.puts( "Message: " + message );
    r.stdin.write( "png('" + (new Date()).valueOf() + ".png')" + "\n" );
    r.stdin.write(message + "\n");
}

commands = [
    // From http://flowingdata.com/2010/01/21/how-to-make-a-heatmap-a-quick-and-easy-solution/
    'nba <- read.csv("ppg2008.csv", sep=",")',
    'nba <- nba[order(nba$PTS),]',
    'row.names(nba) <- nba$Name',
    'nba <- nba[,2:20]',
    'nba_matrix <- data.matrix(nba)',
    'nba_heatmap <- heatmap(nba_matrix, Rowv=NA, Colv=NA, col = cm.colors(256), scale="column", margins=c(5,10))',
    'nba_heatmap <- heatmap(nba_matrix, Rowv=NA, Colv=NA, col = heat.colors(256), scale="column", margins=c(5,10))'
 ];

start();

var sys = require('sys');
for( var i in commands ) {
    command( commands[i] );
}
