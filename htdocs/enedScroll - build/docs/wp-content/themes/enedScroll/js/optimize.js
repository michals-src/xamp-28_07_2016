(function($){

	$('.nav-btn').on('click', function(){

		var target = $(this).attr('data-target');

		if( typeof target !== "undefined" ){
			$('body').addClass('freeze');
			$(target).addClass('in');
			if( $(target).hasClass('in') ){
				setTimeout(function(){
					$(target).removeClass('in');
					$(target).addClass('on');
				}, 150);
			}
		}

	});

	$('.exit-btn').on('click', function(){

		var target = $(this).attr('data-target');

		if( typeof target !== "undefined" ){

			$(target).addClass('in');

			if( $(target).hasClass('in') ){
				$(target).removeClass('on');
				setTimeout(function(){
					$(target).removeClass('in');
					$('body').removeClass('freeze');
				}, 900);
			}
		}

	});

})(jQuery);