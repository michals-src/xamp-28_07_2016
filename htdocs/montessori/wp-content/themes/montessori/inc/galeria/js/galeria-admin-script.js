(function( $ ) {

	

	var $btnAddImgs  	= $('#imgs-add-btn'),
		$btnAddNewImgs  = $('#new-imgs-add-btn'),
		$box		 	= $('.entry-montessori-box'),
		$content	 	= $('.entry-content'),
		$contentNone 	= $('.entry-content-none'),
		$hidden	 	 	= $('.montessori-galeria-hidden'),

		$uploader	 	= wp.media.frames.file_frame = wp.media({
			title: 'Zdjęcia',
			button: {
				text: 'Dodaj obraz'
			},
			multiple: true
		}),

		$images 		= [];


	$images = JSON.parse($hidden.attr( 'value' ));

	var openUploader = function(){

		if($uploader){

			$uploader.open();

		}
		return false;

	}

	$btnAddImgs.on('click', openUploader);	
	$btnAddNewImgs.on('click', openUploader);

	$('.entry-content-images').sortable({

		start: function(){

			$('.galeria-img-preview').remove();

		},

		update: function(e,ui){
			$images = new Array();

			$content.find('picture').each(function(k,v) {

				var id = $(this).find('img').attr('data-id');

				$images.push( parseInt(id, 10) );

			});

			$hidden.attr( 'value', JSON.stringify( $images ) );

		}

	});

	$uploader.on('select', function() {

		var attachments = $uploader.state().get('selection').toJSON();

		if(attachments.length > 0){

			$contentNone.css({'display': 'none'});

			$content.css({'display': 'block'});

		}

		for(var x = 0; x <= (attachments.length - 1); x++){

			var sizes 	= attachments[x].sizes,
				size = sizes.thumbnail;
			
			if( $.inArray( attachments[x].id, $images ) == -1 ){

				
				// Checkbox	
				var asFirst = $('.image-as-first');

				if(asFirst.prop('checked')){
					
					//Dodawanie nowego zdjęcia jako pierwsze

					$images.unshift( attachments[x].id );

					$content.find('.entry-content-images').prepend('<picture><header> <span id="img-prev" class="img-prev dashicons dashicons-eye" title="Podgląd zdjęcia" alt="Podgląd"> podgląd </span> <span id="img-delete" class="img-delete dashicons dashicons-no" title="Usuń zdjęcie" alt="Usuń"> usuń </span> </header><img id="image-' + attachments[x].id + '" class="img-' + size.orientation + '" src="' + size.url + '" width="' + size.width + 'px" height="' + size.height + 'px" data-id="' + attachments[x].id + '" data-medium="' + sizes.medium.url + '"></picture>');
				
				}else{
					
					//Dodawanie nowego zdjęcia na koniec

					$images.push( attachments[x].id );

					$content.find('.entry-content-images').append('<picture><header> <span id="img-prev" class="img-prev dashicons dashicons-eye" title="Podgląd zdjęcia" alt="Podgląd"> podgląd </span> <span id="img-delete" class="img-delete dashicons dashicons-no" title="Usuń zdjęcie" alt="Usuń"> usuń </span> </header><img id="image-' + attachments[x].id + '" class="img-' + size.orientation + '" src="' + size.url + '" width="' + size.width + 'px" height="' + size.height + 'px" data-id="' + attachments[x].id + '" data-medium="' + sizes.medium.url + '"></picture>');
				
				}

			}
		
		}

		$hidden.attr( 'value', JSON.stringify( $images ) );

	});



	/**
	 * Usuwanie obrazka
	 */

	$('picture').find('.img-delete').live('click', function() {

	  	$(this).closest('picture').remove();

	 	$images = new Array();

		$content.find('picture').each(function(k,v) {

			var id = $(this).find('img').attr('data-id');

			$images.push( parseInt(id, 10) );

		});

		$hidden.attr( 'value', JSON.stringify( $images ) );

	 });


	/**
	 * Podgląd obrazka
	 */

	 $('picture').find('.img-prev').live('click', function() {

	 		$('body').find('.galeria-img-preview').remove();

	 		var tmpImage = new Image();

				tmpImage.src = $(this).closest('picture').find('img').attr('data-medium');

				$(tmpImage).one('load', function(){ 

				 	orgWidth = tmpImage.width;
				 	
				 	orgHeight = tmpImage.height;

				 	$('body').append('<div class="galeria-img-preview" style="position:fixed;z-index:10;left:50%;top:50%;margin-top:-' + (orgHeight / 2) + 'px;margin-left:-' + (orgWidth / 2) + 'px;"><header><span class="img-prev-close dashicons dashicons-no"> Zamknij </span></head><img src="' + tmpImage.src + '" style="box-shadow: 0 10px 25px #000;"></div>');

			});


	 });

	 $('body').on('click', function() {

	 	$(this).find('.galeria-img-preview').remove();

	 });

	 $('.galeria-img-preview').on('click', function() {

	 	$(this).remove();

	 });


})(jQuery);