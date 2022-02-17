(function($) {

	var emptyContainer 	= $('.empty-container'),
		textContainer	= $('.text-container'),
		imagesContainer	= $('.images-container'),
		addImageBtn 	= $('.imgAdd'),
		closeBtn		= $('.close'),
		data			= $('.imagesData'),
		$uploader 		= wp.media.frames.file_frame = wp.media({
			title: 		'Wybierz obrazy',
			button: 	{
				text: 	'Dodaj obrazy'
			},
			multiple: 	true
		}),

		checker 		= function(content) {
			if(content == 'empty'){
				emptyContainer.css({'display':'block'});
				textContainer.css({'display':'none'});
			}else if(content == 'notEmpty'){
				textContainer.css({'display':'block'});
				emptyContainer.css({'display':'none'});
			}
		},

		list			= function() {

			var $array = [],
				$items = imagesContainer.find('.imageItem');

			if($items.length){
				
				$items.each(function(k,v) {
					
					var $url 	= $(this).find('img').attr('src'),
						$id 	= $(this).find('img').data('id');

					$array[k] = {
						'url'	: $url,
						'id'	: $id
					};

				});

				checker('notEmpty');
			}else{
				checker('empty');
			}
			data.val(JSON.stringify($array));

		};

		list();

		addImageBtn.on('click', function() {

			if($uploader){
				
				$uploader.open();

			}

			return false;
		});

		$uploader.on('select', function() {

			var attachments = $uploader.state().get('selection').toJSON();

			for(var x = 0;x<attachments.length;x++){
				imagesContainer.prepend('<div class="col-xs-4 imageItem"><header class="text-right"><span style="padding-right:10px;display:inline-table;">Usuń obraz</span><button type="button" class="close" aria-label="Close"><span aria-hidden="true">&times;</span></button> </header> <fieldset> <img src="' + attachments[x].url + '" data-id="' + attachments[x].id + '"> </fieldset> </div>');
			}
			console.log(attachments);

			list();

		});


		closeBtn.live('click', function(e) {

			e.preventDefault();

			$(this).closest('.imageItem').remove();

			list();

		});

})(jQuery);