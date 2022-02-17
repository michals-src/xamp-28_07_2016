(function($) {

	"use strict";

	var $document, $window, $width, $height;

	$document = $(document);
	$window = $(window);
	$width = $window.width();
	$height = $window.height();


	$.fn.tigner = function(e,f) {
		
			var 	$this			=	$(this),
					$start			=	(typeof e !== 'undefined' && e.length) ? e[0] : 0,
					$end			=	(typeof e !== 'undefined' && e.length) ? e[1] : 0,
					$perecent		=	(typeof e !== 'undefined' && e[2]) ? '%' : 'px',
					$attributes 	= {
						'start'			: $start,
						'end'			: $end,
						'perecent'		: $perecent
					};


			return $this.each(function(k,v) {

				var 	$startElement 	= $('<div class="stgn" style="width:100%;height:1px;position:absolute;top:'+$attributes.start+$attributes.perecent+';left:0;"></div>'),
						$endElement 	= $('<div class="etgn" style="width:100%;height:1px;position:absolute;bottom:'+$attributes.end+$attributes.perecent+';left:0"></div>');

				$(this).addClass('tignered');
				$(this).css({'position':'relative'});
				$(this).prepend($startElement);
				$(this).append($endElement);

				
				$(document).on('scroll', function() {

					var 	$pickerTop 			= $('.tigner').offset().top,
							$startElementTop	= $this.find('.stgn').offset().top,
							$endElementTop		= $this.find('.etgn').offset().top,
							heightFull 			= $endElementTop - $startElementTop;


						var partPer 	= Math.floor(((($pickerTop - $startElementTop) * 100) / heightFull)),
							part 		= (partPer < 0) ? 0 : partPer;

						if(part > 100 && $pickerTop > $endElementTop)
						{
							part = 100;
						}
						
						if($.isFunction(f)){
							var $data = {
								this: 		$this,
								num: 		part,
								selectors: 	{
									top: 	$startElementTop,
									bottom: $endElementTop
								}
							};

							return f($data);
						}
					
				

				});

			});

	};


	$('[data-scroll="smooth"]').on('click', function() {
		
		var $target 	= $(this).attr('href'),
			$targetTop 	= $($target).offset().top;

		$('html, body').stop().animate({'scrollTop': $targetTop}, 600, 'swing');

		return false;
		
	})

	$('.scroll-down').tigner([-75,0], function(e) {
		var $this 		= 	e.this,
			$num		=	e.num;

			$this.find('a').css({'opacity': (1 - ($num / 100))});
			
	});

	
	// $('.about').tigner([0,0], function(e) {
	// 	var $this 				= 	e.this,
	// 		$num				=	e.num,
	// 		$startElementTop	=	e.selectors.top,
	// 		$endElementTop		=	e.selectors.bottom,
	// 		heightFull			= 	($endElementTop - $startElementTop) - ( $this.find('._st').height());

	// 		$this.find('._st').css({'margin': '0', 'position':'absolute', 'top':  (($num / 100) * heightFull) + 'px'});
			
	// });


	$(document).find('header[role="presentation"]').css({'height': $height});
	$(window).resize(function() {
		$width = $window.width();
		$height = $window.height();
		$(document).find('header[role="presentation"]').css({'height': $height});
	});

	/**
	 * Rozwijanie nawigacji
	 * Rozdzielczość < 992px
	 *
	 * Event dla .nav-hamburger
	 */
	

	$('nav .nav-hamburger').on('click', function() {

				var $navigation	= $(this).closest('nav'),
					$content 	= $navigation.find('.nav-content');

				if(!$('body').hasClass('in')){
					$('body').css({'right': $content.width()+'px'});
				}else if($('body').hasClass('in')){
					$('body').css({'right': '0px'});
				}

				
				$('body').toggleClass('in');
			
	});

	var	$hide_nav = function() {
			$('nav .nav-content li a').on('click', function() {

				$('body').removeClass('in');
				$('body').css({'right': '0'});

			});
		};

	if($width < 992){
		$('body').addClass('nav');
		$hide_nav();
	}
	$(window).resize(function() {
		if($width < 992){
			$('body').addClass('nav');

			$hide_nav();

		}else if($('body').hasClass('nav')){
			$('body').removeClass('nav');
		}
	});

	$('.sdoc').on('click', function() {
		$('._sig .dd').first().find('a').click();
	});

	lightbox.option({
      'resizeDuration': 200,
      'wrapAround': true,
      'albumLabel': 'Obraz %1 z %2',
      'alwaysShowNavOnTouchDevices': true
    });
	

})(jQuery);