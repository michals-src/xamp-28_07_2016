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

(function( $, window, document ) {

	$.enedScrollDefaults = {
		topPosition: '50%',
		selectorsColor: false
	};

	$.enedScroll = function(q){
		return $.extend($.tignerScrollDefaults, q);
	}

	function enedScroll(element, settings){
		this.element = options;
		this.callback = callback;
		this.settings = settings;

		this.selectors();
	}

	$.extend(enedScroll.prototype, {
		selectors: function(){
			// this.options.element.self.prepend('<div class="top"></div>');
			// this.options.element.self.append('<div class="bottom"></div>');

			if(this.settings.selectorsColor){
				$('.top').addClass('color');
				$('.bottom').addClass('color');
			}

		}
	});

	/*
	Dodanie sceny dla odpowiedniego osiągnięcia procentu
	if(value<>=%)
	 */
	
	var $l = {}, $counter = 0;

	$.fn.extend({
		ened: function(){
			return $.each(this, function(k,v){
				var a = {
						name: v,
						self: $(this)
					},
					s = $.tignerScrollDefaults;

				$(this).attr('data-ened-key', $counter);

				$l[$counter] = new tignerScroll(a,s);
			});
		}
	});


	/*
		
		$.tignerScrollDefaults = {
			tignerPosition: '50%',
			tignerColor: false,
			selectorsColor: false,
			selectorsWidth: 100%
		};

		var area1 = $('div')
						.ened();

		area1
			.selectors()
			.set()
			.createSpace()

	 */
	

	// function test(obj, a){
	// 	this.obj = obj;
	// 	this.self = a;
	// 	console.log('Inilized test for ' + this.obj);
	// }

	// test.prototype = {
	// 	abc: function(){
	// 		console.log(this.obj);
	// 	},
	// 	colr : function(c) {
	// 		this.c = c;
	// 		console.log(this.obj + ' want to set ' + c + ' color');
	// 	}
	// }

	// var c = {}, counter = 0;

	// $.fn.extend({
	// 	test :  function() {
	// 		return $(this).each(function(k,v) {

	// 			$(this).attr('data-tigner-key', counter);
				
	// 			c[counter] = new test($(this)[0].className, $(this));
	// 			counter++;

	// 		});
	// 	},
	// 	abc : function() {
	// 		return $(this).each(function(k,v) {
	// 			var key = $(this).attr('data-tigner-key');
	// 			c[key].abc();
	// 		});
	// 	},
	// 	colr : function(a) {
	// 		return $(this).each(function(k,v) {
	// 			var key = $(this).attr('data-tigner-key');
	// 			c[key].colr(a);
	// 		});
	// 	}
	// });


})(jQuery, window, document);