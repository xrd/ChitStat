function addToChat(message) {
    $('.chat-messages').append( '<div class="message">' +
                                '<div class="nick">' + message['nick'] + '</div>' +
                                '<div class="body">' + message['message'] + "</div>" +
                                "</div>" );
}

function receiveMessage( data, success ) {
    console.log( "Received something" );
    if( success ) {
        JSON.parse(data).forEach(function (message) {
            console.log( "Parsed message, inserting." );
            addToChat( message );
        });
        setTimeout(connectChatStream, 50 );
    }
    else {
        setTimeout(connectChatStream, 10000 );
    }
}
    
function sendChat( item ) {
    item.stopPropagation();
    var msg = $('.chat').find(':text').val();
    var nick = $('.nick').val();
    $.post('/stream', { message : msg, nick : nick }, onMessageSent );
    // console.log( "Got a chat!" );
    $('.chat').find(':text').val('');
    $('.chat').find(':text').focus();
}

function onMessageSent(data,success) {
    console.log( "Sent message" );
}
function connectChatStream() {
    console.log( "Reconnecting to stream" );
    $.ajax( { type : 'GET', url : '/stream', success : receiveMessage, error : function() { setTimeout( connectChatStream, 10000 ); } } );
}

function randomName() {
    $('.nick').val( parseInt( Math.random()* 1000000 ) );
}

function setupChat() {
    // Connect us to the server
    connectChatStream();

    // create random name
    randomName();

    // Send off a message when we say something
    $('.send-chat').click( sendChat );
}
