var currentCommandIndex = 0;
var commands = [];
var lastWasLt = false;

function addToChat(message) {
    var msgClass = 'R' == message['type' ] ? 'r-type' : '';
    $('.chat-messages').append( '<div class="message">' +
                                '<div class="nick">' + message['nick'] + '</div>' +
                                '<div class="body ' + msgClass + '">' + message['message'] + "</div>" +
                                "</div>" );
}

function receiveMessage( data, success ) {
    if( success ) {
        JSON.parse(data).forEach(function (message) {
            updateNicks( message['nicks'] );
            addToChat( message['message'] );
        });
        setTimeout(connectChatStream, 50 );
    }
    else {
        setTimeout(connectChatStream, 10000 );
    }
}

function updateNicks( nicks ) {
    var ul = $('<ul></ul>');
    $(nicks).each( function(index,item) {
        ul.append( $('<li>'+item+'</li>') );
    });
    $('.participants ul').html( ul.html() );
}
    
function sendChat( item ) {
    item.stopPropagation();
    var msg = $('.chat').find(':text').val();
    var type = $('.chat .type').val();
    commands.push( msg );
    currentCommandIndex = commands.length;
    var nick = $('.nick').val();
    $.post('/stream', { message : msg, type : type }, onMessageSent );
    $('.chat').find(':text').val('');
    $('.chat').find(':text').focus();
}

function onMessageSent(data,success) {
    console.log( "Sent message" );
}
function connectChatStream() {
    // console.log( "Reconnecting to stream" );
    $.ajax( { type : 'GET', url : '/stream', success : receiveMessage, error : function() { setTimeout( connectChatStream, 10000 ); } } );
}

function setupChat() {
    // Connect us to the server
    connectChatStream();

    // Send off a message when we say something
    $('.send-chat').click( sendChat );

    // capture keycodes
    captureKeycodes();
}

function checkForMessageType( event ) {
    // if we have a < followed by a - then we probably are using R
    if( 45 == event.which ) {
        if( lastWasLt ) {
            $('.type').val('R');
        }
    }
    
    lastWasLt = ( 60 == event.which && event.shiftKey );
}

function captureKeycodes() {
    $('.chat :text').keypress(function(event) {
        // console.log( "Got an event!" );
        if (event.keyCode == '13') {
            sendChat( event );
            event.preventDefault();
        }
        else if( true == event.ctrlKey && event.which == 38 ) {
            // retrieve the earlier event
            if( currentCommandIndex > 0 ) {
                currentCommandIndex -= 1;
                $('.chat :text' ).val( commands[currentCommandIndex] );
            }
        }
        else if( true == event.ctrlKey && event.which == 40 ) {
            // retrieve the later event
            if( currentCommandIndex < commands.length ) {
                currentCommandIndex += 1;
                $('.chat :text' ).val( commands[currentCommandIndex] );
            }
        }
        
        checkForMessageType( event );
    });
}
