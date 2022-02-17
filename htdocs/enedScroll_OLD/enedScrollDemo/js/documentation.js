(function($) {
	

	$('.main-area ul.nav li a').on('click', function() {
		if(!$(this).closest('ul').hasClass('sub-nav')){
			$('.main-area ul.nav').find('li.current-item').removeClass('current-item');
		}else{
			$(this).closest('ul').find('li.current-item').removeClass('current-item');
		}
		$(this).closest('li').addClass('current-item');
	});

	$('fieldset')
		.ened()
		.set({
			before: function(e){
				var navId = $(e.this)[0].id;
				$('.main-area ul.nav').find('a[href="#'+navId+'"]').closest('li').removeClass('current-item');
				
			},
			focusin: function(e){
				var navId = $(e.this)[0].id;
				$('.main-area ul.nav').find('a[href="#'+navId+'"]').closest('li').addClass('current-item');
			},
			after: function(e){
				var navId = $(e.this)[0].id;
				$('.main-area ul.nav').find('a[href="#'+navId+'"]').closest('li').removeClass('current-item');
			}
		})
		.get();
	
	$('field.sub-field')
		.ened()
		.set({
			before: function(e){
				var navId = $(e.this)[0].id;
				$('.main-area ul.nav').find('a[href="#'+navId+'"]').closest('li').removeClass('current-item');	
			},
			focusin: function(e){
				var navId = $(e.this)[0].id;
				$('.main-area ul.nav').find('a[href="#'+navId+'"]').closest('li').addClass('current-item');
			},
			after: function(e){
				var navId = $(e.this)[0].id;
				$('.main-area ul.nav').find('a[href="#'+navId+'"]').closest('li').removeClass('current-item');
			}
		})
		.get();
	
	$('.open-nav').click(function(){

		$('.main-area ul.nav').toggleClass('opened');

		return false;
	})

	if($(window).outerWidth() > 992){
		$('.navigation-scene').css({'height': $('.doc-content').outerHeight()});
		
		$('.navigation-scene')
		.ened([50,-100])
		.set({
			focusin: function(e){
				var helpers = e.helpers,
					pin		= helpers.pin;

					pin.set({parent: $(e.this), item: '.nav'}, $('.doc-content').outerHeight());
			},
			before: function(e){
				var helpers = e.helpers,
					pin		= helpers.pin;

					pin.before({parent: $(e.this), item: '.nav'}, $('.doc-content').outerHeight());
			},
			after: function(e){
				var helpers = e.helpers,
					pin		= helpers.pin;

					pin.after({parent: $(e.this), item: '.nav'}, $('.doc-content').outerHeight());
			},
		})
		.get();
	}

})(jQuery);