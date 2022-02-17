(function($) {



	var rocket = $('.area-rocket').ened();

	/*Zabezpieczenie przed ponownym najechaniem i uruchomieniem animacji rakiety*/
	/*Musi być poza funkcją żeby się nie zerowała na wartość false*/
	var onScreen = false;
	var rocketCounter = function(){
		/* Odliczanie */
		var c = 5;
		$cc = setInterval(function(){
			if(c >= 0){
				$('.rocket-counter').html(c);
				c = c - 1;
			}
			if(c < 0){
				$('.rocket-counter').addClass('rocket-counter-blink');
				setTimeout(function() {
					$('.rocket-fire').addClass('rocket-start');
				}, 2200);
			}
		},1000);
	};
	var rocketStart = function(){
		/* Lot rakiety */
		setTimeout(function() {

			$('.rocket').animate({'top': '-1900px', 'opacity': '0'}, 500);
			$('.rocket-fire').animate({'top': '-1900px', 'opacity': '0'}, 500);
			$('.rocket-counter').remove();
			$('.rocket-text').addClass('in');

		}, 9000);
	};

	/*
	
	DO ZROBIENIA
	Dodanie możliwości tworzenia 2 lub więcej animacji 
	np. wejście - wyjście dla elementu (createSpace -> tworzone są 2 lub więcej elementów)

	 */

	rocket
		.set({
			before: function(e){
				//console.log('Before');
			},
			after: function(e){
				//console.log('After');
			},
			focusin: function(e){
				if(!onScreen){
					rocketCounter();
					rocketStart();
				}
				/*Zabezpieczenie przed ponownym najechaniem i uruchomieniem animacji*/
				onScreen = true;
			},
			0.98: function(e){
				console.log(e);
			}
		});

	var primaryText = $('.primary-text').ened(),
		text 		= $('.primary-text .text-1'),
		textHeight 	= $(text).outerHeight();
	
	var primaryTextSpace = {
		'position': 'absolute',
		'height': '150px',
		'top': '0',
		'left': '0'
	};

	primaryText
		.selectors([0, (-(textHeight))])
		.set({
			before: function(e){
				var self = e.this;

				$(self).css({'min-height': textHeight, 'height': textHeight, 'padding-top': '0', 'padding-bottom': '200px'});
				$(text).css({'position': 'relative', 'top': '0'});
				$(self).find('span').css({'transform': '1', 'opacity': '1'});
				$(self).closest('.el-1').css({'margin-bottom': '0'});
			},
			after: function(e){
				var self = e.this;

				$(self).css({'height': textHeight, 'padding-top': '200px', 'padding-bottom': '0'});
				$(text).css({'position': 'relative', 'top': '0px'});
				$(self).find('span').css({'transform': '0', 'opacity': '0'});
				$(self).closest('.el-1').css({'margin-bottom': '75px'});
			},
			focusin: function(e){
				var self = e.this;

				$(self).css({'height': textHeight});
				$(text).css({'position': 'fixed', 'top': ($('.ened').position().top) + 'px'});
				$(self).find('span').css({'transform': 'scale('+(1 - (1 * e.num))+')', 'opacity': (1 - (1 * e.num))});
				$(self).closest('.el-1').css({'margin-bottom': (75 * e.num) + 'px'});
				//console.log($(self).find('._ene').offset().top);
			}
		});

	var galleryPin 			= {};

		galleryPin.class 		= '.gallery-pin';
		galleryPin.self		 	= $('.el-2');
		galleryPin.enedScroll 	= $('.el-2').ened();
		galleryPin.height 		= $(galleryPin.self).find('.gallery-pin').outerHeight();
		galleryPin.duration		= 2000;
		galleryPin.gallery  	= {};
		galleryPin.gallery.parent  = $(galleryPin.self).find('.gallery-pin');
		galleryPin.gallery.width = $(galleryPin.self).find('.gallery-pin .gallery').width();

	/*
	
	  Dodać
	- selector-top - parametry
	- selector-bottom - parametry
	- ened trigger (div) - parametry np. wysokość od góry itp.

	- pomśleć i dodać parametry innych elementów
	 */
	galleryPin.enedScroll
		.selectors([-100, -100])
		.set({
			before: function(e){
				var self = e.this;

				$(self).css({'height': galleryPin.height, 'padding-top': 0, 'padding-bottom': galleryPin.duration + 'px'});
				$(self).find('.field-2').css({'overflow': 'hidden', 'position': 'relative', 'top': '0'});
			},
			after: function(e){
				var self = e.this;

				$(self).css({'padding-top': galleryPin.duration + 'px', 'padding-bottom': 0});
				$(self).find('.field-2').css({'position': 'relative', 'top': '0'});
				galleryPin.gallery.parent.find('picture').last().css({'transform': 'scale(1)'});
				galleryPin.gallery.parent.find('picture').last().find('.picture-2-text').css({'transform': 'scale(1)', 'opacity': '0'});				
			},
			focusin: function(e){
				var self = e.this;

				$(self).find('.field-2').css({'overflow': 'hidden', 'position': 'fixed', 'top': ($('.ened').position().top + 100)});
				galleryPin.gallery.parent.css({'position': 'relative', 'left': '-'+((galleryPin.gallery.width - ($(window).width() / 2) - 100)* (e.num * 3.3))+'px'});
				galleryPin.gallery.parent.find('picture').last().css({'transform': 'scale(1)'});
				galleryPin.gallery.parent.find('picture').last().find('.picture-2-text').css({'transform': 'scale(1)', 'opacity': '0'});
			},
			0.3: function(e){
				var self = e.this;

				galleryPin.gallery.parent.css({'position': 'relative', 'left': '-'+(galleryPin.gallery.width - ($(window).width() / 2) - 100)+'px'})	
				$(self).find('.field-2').css({'overflow': 'visible'});
				galleryPin.gallery.parent.find('picture').last().css({'transform': 'scale('+(1 + (1.5 * ((-0.3 * 3.3) + (e.num * 3.3))))+')'});
				galleryPin.gallery.parent.find('picture').last().find('.picture-2-text').css({'transform': 'scale('+(1 - (0.6 * ((-0.3 * 3.3) + (e.num * 3.3))))+')', 'opacity': (0 + (1 * ((-0.3 * 3.3) + (e.num * 3.3))))});

			},
			0.6: function(e){
				galleryPin.gallery.parent.find('picture').last().css({'transform': 'scale(2.5)'});
				galleryPin.gallery.parent.find('picture').last().find('.picture-2-text').css({'transform': 'scale(0.4)', 'opacity': '1'});
			},
			0.7: function(e){
				var self = e.this;

				galleryPin.gallery.parent.find('picture').last().css({'transform': 'scale('+(2.5 - (1.5 * ((-0.7 * 3.3) + (e.num * 3.3))))+')'});
				galleryPin.gallery.parent.find('picture').last().find('.picture-2-text').css({'transform': 'scale('+(0.4 + (0.6 * ((-0.7 * 3.3) + (e.num * 3.3))))+')', 'opacity': (1 - (1 * ((-0.7 * 3.3) + (e.num * 3.3))))});				
			}
		});

})(jQuery);