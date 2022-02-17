(function($) {

	$('.field-1').css({'height': $(window).height() + 'px'});
	$('.picture-1-child').css({'height': $('.head-picture').height() + 'px'});
	$('.picture-2-child').css({'height': $('.head-picture').height() + 'px'});


	var header = $('.area-1 .field-1 .head-picture').ened();

	// enedscroll.option({
	// 	'enedSetColor': true,
	// 	'selectorsSetColor': true
	// });

	header
		.set({
			focusin: function(e){

				var helpers = e.helpers;
				$('.area-1 .field-1 .head-picture .picture-elements .picture-1-child').css({'transform': 'translateY('+ helpers.getVal([0,-100]) +'px)', '-webkit-transform': 'translateY(-'+ helpers.getVal([0,100]) +'px)', '-moz-transform': 'translateY(-'+ helpers.getVal([0,100]) +'px)'});
				$('.area-1 .field-1 .head-picture .picture-elements .picture-2-child').css({'transform': 'translateY('+ helpers.getVal([0,60]) +'px)', '-webkit-transform': 'translateY('+ helpers.getVal([0,60]) +'px)', '-moz-transform': 'translateY('+ helpers.getVal([0,60]) +'px)'});

				$('.area-1 .field-1 .head-picture .title h1').css({'transform': 'translateY('+ helpers.getVal([0,-20]) +'px)', '-webkit-transform': 'translateY(-'+ helpers.getVal([0,20]) +'px)', '-moz-transform': 'translateY(-'+ helpers.getVal([0,20]) +'px)'});
				$('.area-1 .field-1 .head-picture .title p').css({'transform': 'translateY('+ helpers.getVal([0,30]) +'px)', '-webkit-transform': 'translateY('+ helpers.getVal([0,30]) +'px)', '-moz-transform': 'translateY('+ helpers.getVal([0,30]) +'px)'});

				$('.area-1 .field-2 .text-container .title').css({'transform': 'scale(1)', 'letter-spacing': '10px'});
				$('.area-1 .field-2 .text-container p').css({'transform': 'translateY(-100px)', 'opacity': '0'});
			
			},
			0.75: function(e){
				var helpers = e.helpers;


				$('.area-1 .field-2 .text-container .title').css({'transform': 'scale('+ helpers.getVal([1,1.6]) +')', 'letter-spacing': helpers.getVal([10, 4])});
				$('.area-1 .field-2 .text-container p').css({'transform': 'translateY('+ helpers.getVal([-100,0]) +'px)', 'opacity': helpers.getVal([0,1])});
			
			},
			after: function(e){
				$('.area-1 .field-2 .text-container .title').css({'transform': 'scale(1.6)', 'letter-spacing': '4px'});
				$('.area-1 .field-2 .text-container p').css({'transform': 'translateY(0)', 'opacity': '1'});
			}
		}).get();

	//var myTextContent = $('.area-1 .field-2 .text-content').ened();

	/*
	
	pomyśleć nad przypięciem elementu dla różnych wartości wywołania fukncji
	
	*/


	// myTextContent
	// 	.selectors([-150,-150])
	// 	.set({
	// 		before: function(e){
	// 			var helpers = e.helpers,
	// 				pin = helpers.pin;
				
	// 			pin.before({parent: $(e.this), item: '.my-text'}, 2000);

	// 		},
	// 		after: function(e){
	// 			var helpers = e.helpers,
	// 				pin = helpers.pin;
				
	// 			pin.after({parent: $(e.this), item: '.my-text'}, 2000);
	// 		},
	// 		focusin: function(e){
	// 			var helpers = e.helpers,
	// 				pin = helpers.pin;
				
	// 			pin.set({parent: $(e.this), item: '.my-text'}, 2000);

	// 		}
	// 	});

	var textSliderItems = $('.area-1 .field-3 .text-slider-to-container ul li'),
		textSliderLoadText = function(){
			var textSliderFirstText = $('.area-1 .field-3 .text-slider-to-container ul li.text-slider-current-item');
			$('.area-1 .field-3 .text-slider-content .text-slider-container h2').html($(textSliderFirstText).text());
		};

	textSliderLoadText();

	var textSliderContent = $('.area-1 .field-3 .text-slider-content').ened([-95,0]);

	$('.area-1 .field-3 .text-slider-content .text-slider .text-slider-counter span').html('/ ' + ((textSliderItems.length < 10) ? '0' + textSliderItems.length : textSliderItems.length));

	textSliderContent
		.set({
			before: function(e){
				var helpers = e.helpers,
					pin 	= helpers.pin;

					pin.before({parent: $(e.this), item: '.text-slider-box'}, 3100);
			},
			after: function(e){
				var helpers = e.helpers,
					pin 	= helpers.pin;

					pin.after({parent: $(e.this), item: '.text-slider-box'}, 3100);
			},
			focusin: function(e){
				var helpers = e.helpers,
					pin 	= helpers.pin;

					pin.set({parent: $(e.this), item: '.text-slider-box'}, 3100);
					$.each(textSliderItems, function(k,v){

						if($('.ened').offset().top >= $(v).offset().top){


							$('.area-1 .field-3 .text-slider-content .text-slider .text-slider-counter strong').html('0' + (k + 1));

							$('.area-1 .field-3 .text-slider-to-container ul li').removeClass('text-slider-current-item');
							$(v).addClass('text-slider-current-item');

						}

					});
			}
		}).get();

	textSliderItems.each(function(k,v){
		$(v).ened()
			.set({
				focusin: function(e){
					if(!textSliderItems[k].loaded){
						textSliderItems[k].loaded = true;
						$('.area-1 .field-3 .text-slider-content .text-slider-container').removeClass('in').addClass('out');
						setTimeout(function(){
							textSliderLoadText();
							$('.area-1 .field-3 .text-slider-content .text-slider-container').removeClass('out').addClass('in');
						}, 300);
					}
				},
				after: function(e){
					if(k != (textSliderItems.length - 1)){
						textSliderItems[k].loaded = false;
					}
				},
				before: function(e){
					if(k != 0){
						textSliderItems[k].loaded = false;
					}else{
						textSliderItems[k].loaded = true;
					}
				}
			})
	}).get();


//Możliwość tworzenia przestrzeni createSpace więcej niż 1
//Funkcja set (#nazwa_przestrzeni, {array(focusin,before,after,procenty)})

// Zamiast funkcji getValTo używanie createSpace 
// i wywoływanie odpowiednich animacji przez najechanie na odpowiednią przestrzeń


// @liczba_elementów_do_utworzenia
// @miejsce_utworzenia_elementów
//addSpace([parent, element_class, selectors, style], callback);


	$('.area-1 .field-3 .text-slider-to-container ul li.text-move')
		.addSpace(['li.text-move', 'el-1', [0,0], {'height': '250px'}], {
			focusin: function(e){
				var helpers = e.helpers;
				$('.text-slider-container').css({'transform': 'translateX('+helpers.getVal([0, 60])+'px)'});
			}
		})
		.addSpace(['li.text-move', 'el-2', [0,0], {'height': '250px'}], {
			focusin: function(e){
				var helpers = e.helpers;
				$('.text-slider-container').css({'transform': 'translateX(60px) translateY('+helpers.getVal([0, 60])+'px)'});
			}
		})
		.addSpace(['li.text-move', 'el-3', [0,0], {'height': '250px'}], {
			focusin: function(e){
				var helpers = e.helpers;
				$('.text-slider-container').css({'transform': 'translateY(60px) translateX('+helpers.getVal([60, -60])+'px)'});
			}
		})
		.addSpace(['li.text-move', 'el-4', [0,0], {'height': '250px'}], {
			focusin: function(e){
				var helpers = e.helpers;
				$('.text-slider-container').css({'transform': 'translateX(-60px) translateY('+helpers.getVal([60, 0])+'px)'});
			}
		})
		.addSpace(['li.text-move', 'el-5', [0,0], {'height': '250px'}], {
			focusin: function(e){
				var helpers = e.helpers;
				$('.text-slider-container').css({'transform': 'translateY(0) translateX('+helpers.getVal([-60, 0])+'px)'});
			}
		})
		.set({
			before: function(e){
				var helpers = e.helpers;
				$('.text-slider-container').css({'transform': 'translateY(0) translateX(0)'});
			},
			after: function(e){
				var helpers = e.helpers;
				$('.text-slider-container').css({'transform': 'translateY(0) translateX(0)'});
			}
		})
		.get();


	$('.area-1 .field-3 .text-slider-to-container ul li.text-setclass')
		.set({
			focusin: function(e){
				$('.text-slider-container').addClass('from-set');
			},
			before:function(e){
				$('.text-slider-container').removeClass('from-set');
			},
			after:function(e){
				$('.text-slider-container').removeClass('from-set');
			}
		})
		.get();

	$('.area-1 .field-3 .text-slider-to-container ul li.text-manipulate')
		.set({
			focusin: function(e){
				$('body').css({'background': '#2fa6d4'});
				$('.area-1 .field-3 .text-slider-content').addClass('manipulate');
			},
			before: function(e){
				$('body').css({'background': '#fff'});
				$('.area-1 .field-3 .text-slider-content').removeClass('manipulate');
			},
			after: function(e){
				$('body').css({'background': '#fff'});
				$('.area-1 .field-3 .text-slider-content').removeClass('manipulate');
			}
		})
		.get();	

	$('.area-1 .more-field')
		.ened([-110, -100])
		.set({
			focusin: function(e){
				var h = e.helpers;
				$(e.this).find('.clone').css({'transform': 'translateY('+ h.getVal([10, -35]) +'px)'});
				$('.area-1 .more-field').addClass('in');
			},
			before: function(e){
				$(e.this).find('.clone').css({'transform': 'translateY(10px)'});
				if($(e.this).hasClass('in')){
					$(e.this).removeClass('in');
				}
			},
			after: function(e){
				$(e.this).find('.clone').css({'transform': 'translateY(-35px)'});
			}
		})
		.get();


})(jQuery);