function loadLayout() {
    var container = $('.layout');
    
    function relayout() {
	container.layout({resize: false});

        // Update the height of the chat window so we keep scrolling working
        var height = $(container).find('.center').height();
        $(container).find('.chat-messages').css( 'height', ( height - 30 ) + "px" );
    }
    relayout();
    
    $(window).resize(relayout);
    
    $('#toggle-north').click(function () {
	$('.north').animate({height: 'toggle'}, {duration: 500, complete: relayout, step: relayout});
    });
    
    $('#toggle-south').click(function () {
	$('.south').animate({height: 'toggle'}, {duration: 500, complete: relayout, step: relayout});
    });

}

function loadContentFlow() {
    var myNewFlow = new ContentFlow('rendered', { reflectionHeight: 0 } ) ;
}

function loadAutocomplete() {
    // $('input').autocomplete( { source : [ 'foobar', 'barfoo' ] } );
}

function addToChat(message) {
    $('.chat-messages').append( '<div class="message">' +
                                '<div class="nick">' + message['nick'] + '</div>' +
                                '<div class="body">' + message['message'] + "</div>" +
                                "</div>" );
}

function receiveMessage( data, success ) {
    if( success ) {
        console.log( "Got something." );
        JSON.parse(data).forEach(function (message) {
            for (var id in message) {
                // circles[id].attr(message[id]);
                console.log( message['message'] )
                addToChat( message );
            };
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
    console.log( "Got a chat!" );
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
