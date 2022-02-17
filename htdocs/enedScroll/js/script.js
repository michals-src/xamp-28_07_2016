(function($){

	var myDotter = new dotter( $('.dots') ).get();

	var wW = $(window).width();
	var wH = $(window).height();

	var headerScene = $('.scene-1');
	var headerText = headerScene.find('.header-text');
	var headerDesc = headerScene.find('.header-desc');
	var htSplit = headerText.text().split('');
	headerText.html('');

	var params = {
		0: { x: -166, y: -198, r: -25 },
		1: { x: -45, y: -55, r:-25 },
		2: { x: -27, y: 147, r: 18 },
		3: { x: -99, y: -200, r: 26 },
		4: { x: 15, y: -56, r: 32 },
		5: { x: -217, y: 28, r: -25 },
		6: { x: -148, y: -225, r: 6 },
		7: { x: 57, y: -63, r: 20 },
		8: { x: -171, y: 106, r: 18 },
		9: { x: 71, y: 22, r: 32 }
	};

	$.each( htSplit, function(key,value){
		var X = params[key].x;
		var Y =  params[key].y;
		var Rotate =  params[key].r;

		headerText.append( '<span style="display:inline-block;transform: translate( ' + X + 'px, ' + Y + 'px ) rotate('+ Rotate +'deg) ">' + value + '</span>' );
	});

	var t1 = new enedScroll.Trigger( 't1', { top: 0 } );
	var a1 = new enedScroll( $('.scene-1'), { top: 0, bottom: 0 }, t1 );
	var spans = headerText.find('span');
	var tout = 0;

	a1.addCreation(function(e){

		var plugins = e.plugins, pin = plugins.pin, collection = plugins.collection();
		var self = this;

		var p1 = pin( $('.header-text-pin') ), p1T = [{ duration: 1500, offset: 0 }];
		p1.add(p1T);
	

		$.each( spans, function(key,value){

			//var values = $(value).css('transform').split('(')[1].split(')')[0].split(',');
			//var rotate =  Math.round(Math.atan2(values[1], values[0]) * (180/Math.PI) );

			var translateX = params[key].x;
			var translateY = params[key].y;
			var rotate = params[key].r;

			collection.get(
				[
					collection.add( [ parseInt(translateX), 0 ], { duration: 800, offset: 0, bound: 0, repeat: 1 } ),
					collection.add( [ parseInt(translateY), 0 ], { duration: 800, offset: 0, bound: 0, repeat: 1 } ),
					collection.add( [ parseInt(rotate), 0 ], { duration: 800, offset: 0, bound: 0, repeat: 1 } ),
				],
				function(e){
					$(value).css({ 'transform': 'translate('+ e[0] +'px, '+ e[1] +'px) rotate('+ e[2] +'deg)' });
				}
			);

		});

		plugins.slice([
			{ duration: 50, offset: 800 },
			{ duration: 15, offset: 950 },
			{ duration: 15, offset: 1400 }
		], function(e){

			if( ['during','after'].indexOf( e[0].state ) >= 0 && ! headerDesc.hasClass('in') ){
				headerDesc.addClass('in');
			}else if( e[0].state === 'before' && headerDesc.hasClass('in') ){
				headerDesc.removeClass('in');
			}


			if(  ['during','after'].indexOf(e[1].state) >= 0 && ! headerText.hasClass('blysk') ){

				$.each( spans, function(key,value){
					setTimeout(function(){
						
							$(value).animate({opacity: .5}, 120, function(){
								$(this).animate({opacity:1}, 120);
							});

					}, tout);
					tout += 50;

				});
				
				headerText.addClass('blysk');

			}

			if( e[1].state === 'before' && headerText.hasClass('blysk') ){
				tout = 0;
				headerText.removeClass('blysk');
			}



			if( ['during','after'].indexOf(e[2].state) >= 0 && ! headerText.hasClass('out') ){
				headerText.css({'opacity': 0});
				$.each(spans, function(key,value){
					$(spans[key]).css({'position': 'relative', 'top': params[key].y, 'left': params[key].x});
				});
				headerText.addClass('out');
			}
			if( e[2].state === 'before' && headerText.hasClass('out') ){
				headerText.css({'opacity': 1});
				$.each(spans, function(key,value){
					$(spans[key]).css({'position': 'relative', 'top': 0, 'left': 0});
				});
				headerText.removeClass('out');
			}



			if( headerText.hasClass('out') ){
				$('header[role="main"]').removeClass('state-1');
				$(headerScene).css({ opacity:0, 'z-index': '3' });
				$('.dots').css({ 'position': 'absolute', 'z-index': '-1' });
			}
			if( ! headerText.hasClass('out') ){
				if( ! $('header[role="main"]').hasClass('state-1') ){
					$('header[role="main"]').addClass('state-1');
				}
				$(headerScene).css({ opacity:1, 'z-index': '5' });
				$('.dots').css({ 'position': 'absolute', 'z-index': '4' });
			}


		} );


	});


	// var t2 = new enedScroll.Trigger( 't2', {top: '0'} );
	// var a2 = new enedScroll( $('.scene-3'), {top:0,bottom:0}, t2 );
	// var value = 0;
	// a2.addCreation(function(e){

	// 	var plugins = e.plugins;
	// 	var pin = plugins.pin;
	// 	var self = this;

	// 	var pin1 = pin( $(this).find('.articles-pin-parent') );
	// 	var timeline = [{ duration: 2000, offset: 0 }];

	// 	pin1.add(timeline);

	// 	plugins.slice([
	// 		{duration: 550, offset: 0},
	// 		{duration: 550, offset: 550}
	// 	],function(e){

	// 		for( key in e ){
	// 			var key = parseInt(key);
	// 			var item =  $(self).find('.block')[key];
	// 			var nextItem = $(self).find('.block')[key + 1];
	// 			var beforeItem = $(self).find('.block')[key - 1];

			
		
	// 			if( ['after'].indexOf( e[key].state ) >= 0 && ! $(item).hasClass('get') ){
	// 				var next = (nextItem) ? $(nextItem).height() + 125 : 0;
	// 				value += Math.floor( parseInt( next ) );
					
	// 				$(self).find('.articles-slider').css({ 'top': '-'+ value +'px' });
	// 				//$('.scene-4').css({ 'transform': 'translateY(-'+ ( value  - 200 ) +'px)' });
	// 				$(item).addClass('get');
	// 			}
	// 			if( ['during', 'before'].indexOf( e[key].state ) >= 0 && $(item).hasClass('get') ){
	// 				var before = (nextItem) ? $(nextItem).height() + 125 : 0;
	// 				value -= Math.floor( parseInt( before ) );
					
	// 				$(self).find('.articles-slider').css({ 'top': '-'+ value +'px' });
	// 				//$('.scene-4').css({ 'transform': 'translateY(-'+ ( value - 200 ) +'px)' });
	// 				$(item).removeClass('get');
	// 			}

	// 		};
			

	// 	});


	// });

	$('.j-wh').css({ 'height': $(window).height() + 'px' });

	$('.show-ghost').on('click', function(){

		$('.ghost').addClass( 'in' );
		$('body').addClass('n-s');

		return false;
	});

	$('.ghost .exit').on('click', function(){

		$(this).closest( '.ghost' ).removeClass('in');
		$('body').removeClass('n-s');

		return false;
	});

})(jQuery);