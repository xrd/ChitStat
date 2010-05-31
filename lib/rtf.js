function loadLayout() {
    var container = $('.layout');
    
    function relayout() {
	container.layout({resize: false});
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
    $('input').autocomplete( { source : [ 'foobar', 'barfoo' ] } );
}