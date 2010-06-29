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

    $('#toggle-west').click(function () {
	$('.west').animate({width: 'toggle'}, {duration: 500, complete: relayout, step: relayout});
    });
    $('#toggle-east').click(function () {
	$('.east').animate({width: 'toggle'}, {duration: 500, complete: relayout, step: relayout});
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
