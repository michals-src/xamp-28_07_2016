(function($) {

	$('.spinner').delay(1700).animate({'opacity': '0'}, 300, function() {
		$(this).remove();
	});

	lightbox.option({
	    'albumLabel': 'Obraz %1 z %2'
	});

})(jQuery);