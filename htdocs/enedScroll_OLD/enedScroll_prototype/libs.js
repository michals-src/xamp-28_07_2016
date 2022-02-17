(function( $ ) {

	$.enedScroll({
		selectorsColor: true
	});

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
						$endElement 	= $('<div class="etgn" style="width:100%;height:1px;position:absolute;top:100%;left:0"></div>');

				$(this).addClass('tignered');
				$(this).css({'position':'relative'});
				$(this).prepend($startElement);
				$(this).append($endElement);

				
				$(document).on('scroll', function() {

					var 	$pickerTop 			= $('.tigner').offset().top,
							$startElementTop	= $this.find('.stgn').offset().top,
							$endElementTop		= $this.find('.etgn').offset().top,
							heightFull 			= $endElementTop - $startElementTop;


						var partPer 	= Math.floor(((($pickerTop - $startElementTop) * 10) / heightFull)),
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

	}

	// var text = $('.a2').text().split('');

	// $('.a2').html('');
	// $(text).each(function(k,v) {
	// 	$('.a2').append('<span style="display:inline-block;">'+v+'</span>');
	// });


	// $('.i').each(function(k,v){

	// 	$('.amb'+(k+1)).tigner([0,0], function(e) {
	// 		var $this = e.this,
	// 			$num = e.num;

	// 			if($num >= 0){
	// 				var p = ((50/10) * ($num * 2));
	// 				$('.a2 span').eq(k).css({'transform': 'translateX(-'+((140/10) * ($num * 2))+'px) translateY(-'+p+'px) scale('+( 1 + ((0.85)/10) * ($num * 2))+')', 'positon': 'relative', 'z-index': '5'});
	// 			}
	// 			if($num > 5){
	// 				var p = ((50/10) * ($num * 2));
	// 				$('.a2 span').eq(k).css({'transform': 'translateX(-'+(140 + (140 - ((140 / 10) * $num * 2)))+'px) translateY(-'+(50 - ((50) - (100 - p)))+'px) scale('+( 1.85 + ((0.85)/10) * ((10 - ($num * 2))))+')', 'positon': 'relative', 'z-index': '3'});
	// 			}

	// 			if($num >= 10){
	// 				$('.a2 span').eq(k).css({'transform': 'translateY(0px)'});
	// 				$('.a2 span').eq(k).css({'color': '#333'});
	// 			}
	// 			if($num === 0){
	// 				$('.a2 span').eq(k).css({'transform': 'translateY(0px)'});
	// 				$('.a2 span').eq(k).css({'color': '#333'});
	// 			}
	// 			if($num > 0){
	// 				$('.a2 span').eq(k).css({'color': '#2a2a65'});
	// 			}
	// 			if($num > 2.5){
	// 				$('.a2 span').eq(k).css({'color': '#3c3cab'});
	// 			}
	// 			if($num > 4){
	// 				$('.a2 span').eq(k).css({'color': '#4646d8'});
	// 			}
	// 			if($num > 7.5){
	// 				$('.a2 span').eq(k).css({'color': '#3c3cab'});
	// 			}
	// 			if($num > 8.5){
	// 				$('.a2 span').eq(k).css({'color': '#333'});
	// 			}
	// 	});

	// });

	

})(jQuery);