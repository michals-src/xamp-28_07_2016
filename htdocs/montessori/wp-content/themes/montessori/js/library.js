(function($){

	$('.gallery').each(function() {

		$(this).unitegallery({
			theme_bullets_color: "blue",
			grid_num_rows: 4,
			lightbox_textpanel_enable_description: true
		});

	});

	$('#album').unitegallery({
		theme_bullets_color: "blue",
		grid_num_rows: 3,
		lightbox_textpanel_enable_description: true,
		tile_width: 110,
		tile_height: 110
	});


   $('table').footable();
   

})(jQuery);