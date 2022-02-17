/**
 * LooneScroll v1.0.0
 * url
 * license
 */
if (typeof jQuery === 'undefined') {
  throw new Error('looneScroll\'s JavaScript requires jQuery')
}

+function ($) {
  'use strict';
  var version = $.fn.jquery.split(' ')[0].split('.')
  if ((version[0] < 2 && version[1] < 9) || (version[0] == 1 && version[1] == 9 && version[2] < 1) || (version[0] > 3)) {
    throw new Error('looneScroll\'s JavaScript requires jQuery version 1.9.1 or higher, but lower than version 4')
  }
}(jQuery);

(function( $ ) {

	function tignerScroll(options){
		this.options = $.extend({}, this.constructor.defaults);
		this.option(options);
	}

	tignerScroll.defaults = {
		'nazwa': 'tignerScroll',
		'wersja': '1.0.0',
		'slColor': false
	};

	tignerScroll.prototype.option = function(options){
		$.extend(this.options, options);
	}

	$.fn.extend(tignerScroll.prototype, {
		init: function(){
			'use strict';

			$('body').append($('.tignerScroll'));
		},
		tigner: function(e,f){
			'use strict';

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

				var 	$startElement 	= $('<div class="stgn" style="top:'+$attributes.start+$attributes.perecent+';"></div>'),
						$endElement 	= $('<div class="etgn" style="bottom:'+$attributes.end+$attributes.perecent+';"></div>');

				
				$(this).addClass('tignered');
				$(this).css({'position':'relative'});
				$(this).prepend($startElement);
				$(this).append($endElement);

				
				$(document).on('scroll', function() {

					var 	$pickerTop 			= $('.tignerScroll').offset().top,
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
		}
	});

})(jQuery);