(function($){
	
	var button 		 = $('.montessori-image-button'),
		uploader	 = wp.media.frames.file_frame = wp.media({
			title: 'Zdjęcia',
			button: {
				text: 'Zmień obraz'
			},
			multiple: false
		});

	var buttonID, hidden, preview, maxWidth, isWidth, isHeight;

	button.on('click', function() {

		buttonId 	 = $(this).attr('id');
		hidden 		 = $('.hidden-' + buttonId);
		preview		 = $('.preview-' + buttonId);
		maxWidth	 = ( $(this).attr('data-max-width') ) ? $(this).attr('data-max-width') : false;
		isWidth	 	 = ( $(this).attr('data-is-width') ) ? $(this).attr('data-is-width') : false;
		isHeight	 = ( $(this).attr('data-is-height') ) ? $(this).attr('data-is-height') : false;

		if( uploader ){
			uploader.open();
		}

		return false;

	});

	var uploadError = {
		sizes: {
			multiple: function(width, height){
				return 'Zły wymiar pliku. Szerokość powinna wynosić ' + width + 'px, a wysokość ' + height + 'px.';
			},
			isWidth: function(width){
				return 'Zły wymiar pliku. Szerokość powinna wynosić ' + width + '.';
			},
			isHeight: function(height){
				return 'Zły wymiar pliku. Wysokość powinna wynosić ' + height + '.';
			},
			Width: function(width){
				return 'Za duży wymiar pliku. Szerokość powinna wynosić maksymalnie' + width + '.';
			}
		},
		get: function( message ){
			if( message ){

				alert(message);

			}
		}
	};

	uploader.on( 'select', function() {

		var attachment 		 = uploader.state().get( 'selection' ).first().toJSON(),
			width 			 = attachment.sizes.full.width,
			height 			 = attachment.sizes.full.height;

		if( ( isWidth && isHeight ) || isWidth || isHeight) {
			if( isWidth !== width && isHeight !== height ){
				uploadError.get( uploadError.sizes.multiple(isWidth, isHeight) );
				//return;
			}
			if( isWidth !== width && ! isHeight ){
				uploadError.get( uploadError.sizes.isWidth(isWidth) );
				return;
			}
			if( isHeight !== height && ! isWidth ){
				uploadError.get( uploadError.sizes.isHeight(isHeight) );
				return;
			}
		}

		if( maxWidth ){
			if( width > maxWidth ){
				uploadError.get( getError.sizes.Width(maxWidth) );
				return;
			}
		}

		hidden.attr( 'value', attachment.url );
		preview.find('img').attr( 'src', attachment.url );

	});



})(jQuery);