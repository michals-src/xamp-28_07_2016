(function($) {

	var $button 	= $('.uploader'),
		$Uploader 	= wp.media.frames.file_frame = wp.media({
			title: 		'Wybierz obraz',
			button: 	{
				text: 	'Użyj obrazu'
			},
			multiple: 	false
		});

		$button.on('click', function() {

			var $this = $(this);

			$Uploader.open();

			$Uploader.on('select', function() {
				var attachment = $Uploader.state().get('selection').toJSON();

				$this.closest('.prev').find('.imgPrev').html('<img src="' + attachment[0].url + '" />');
				$this.closest('.prev').find('.img-data').val(attachment[0].url);
			});

			return false;

		});

})(jQuery);