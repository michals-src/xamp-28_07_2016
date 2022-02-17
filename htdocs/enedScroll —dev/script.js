(function($) {

	enedScroll.option({
		'show_all_triggers': true,
		'show_all_selectors': true,
	});

	// var trigger = new enedScroll.Trigger({name: 'myElement', margins: {top: 200, left: 0}});
	// var animation2 = new enedScroll( $('.item2'), {top: 0, bottom: 0}, trigger );
	// //console.log(an2);

	// animation2.addCreation(function(){
		
	// 	var helpers = animation2.helpers;
	// 	var plugins = helpers.plugins;
	// 	/*  
		
	// 		Poprawić state dla helpera aby funkcja @before i @after działała porawnie
	// 		dla helperów z różnymi ustawieniami duraction i offset

	// 	*/

	// 	// Naprawić aby jedna funkcja działała wielokrotnie

	// 	// @ F U T U R E
	// 	// Poprawić aby funkcja before i after automatycznie wykrywało pierwszą i ostanią z listy funkcję :: @FUTURE
	// 	// i włączało i wyłączoła ładowanie @before i @after :: @FUTURE
	// 	// Poprzez stworzenie tablicy :: @FUTURE
	// 	// Odwołanie się do pluginu dodaje go do tasblicy; :: @FUTURE
	// 	// Plugins collect odtwarza tablicę z dodanymi pluginami :: @FUTURE
	// 	// i automatycznie włącza lub wyłącza dla danej funkcji ładowanie @before i @after :: @FUTURE

	// 	// plugins.creation('after', function(){
	// 	// 	console.log('IN');
	// 	// });

	// 	//plugins.value({ duration: '100', offset: '150', after: false });
	// 	//plugins.value2({ duration: '100', offset: '250', before: false, after: false });
	// 	//plugins.value({ duration: '100', offset: '350', before: false });

	// 	//console.log( helpers.getValue( [10, -50], { duration: '100%', offset: '0' } ) );

	// 	//plugins.collect();
		
	// 	$('.item2').css({'padding-bottom': helpers.getValue([0,150], {duration: 50, offset: 80, after: false}) });
	// 	$('.item2').css({'padding-bottom': helpers.getValue([150,0], {duration: 50, offset: 130, before: false, after: false}) });
	// 	$('.item2').css({'padding-bottom': helpers.getValue([0,150], {duration: 50, offset: 180, before: false, after: false}) });
	// 	$('.item2').css({'padding-bottom': helpers.getValue([150,0], {duration: 50, offset: 230, before: false, after: false}) });
	// 	$('.item2').css({'padding-bottom': helpers.getValue([0,150], {duration: 50, offset: 280, before: false, after: false }) });
	// 	$('.item2').css({'padding-bottom': helpers.getValue([150,25], {duration: 50, offset: 330, before: false }) });

	// });

	var trigger1 = new enedScroll.Trigger( 'Trigger', { top:55 } );
	var visual1 = new enedScroll.Visual({ 'color_trigger': 'red', 'show_trigger': true, 'show_selectors': true });
	var animation1 = new enedScroll( $('.item1'), {top:0,bottom:0}, trigger1, visual1 );

	var text = $('.myh2text');
		words = text.text().split('');

	text.empty();
	$.each(words, function(k,v){
		$('<span style="display:inline-block;margin-right:5px;"/>').text(v).appendTo(text);
	});

	/* multiple elements */
	var a0 = {
		duration: 100,
		offset: 0
	};

	animation1.addCreation(function( e ){

		var helpers = e.plugins;
		var collection = helpers.collection();

		//helpers.plugins.pin( 'pin1', $('.myText'), { duration: '200', offset: '0' });
		//helpers.plugins.pin( 'pin1', $('.myText'), { duration: '200', offset: '200', before: false});

		//0------------------------------------------000000
		var pin1 = helpers.pin( /* object || string */ $('.myText') ),
			
			timeline = [
				{ duration: 750, offset: 0 }
			];
			// timeline = [
			// 	{ duration: 200, offset: 0 },
			// 	{ duration: 200, offset: 300 }
			// ];
			//
		pin1.add( timeline );

		//pin1.add( { duration: 300, offset: 800 } );

		//0------------------------------------------000000

		//0------------------------------------------000000
		$('h2.myh2text span').each(function(k,v){
			a0.offset = (25 * k);

			var a = {duration: 100, offset: a0.offset, after: false};
			var b = {duration: 100, offset: (a0.offset + 100), before: false};

			// $(v).css( { 'transform': 'scale(' + helpers.getValue([1, 2.5], a) + ') translateY(-' + helpers.getValue([0, 10], a) + 'px)' } );
			// $(v).css( { 'transform': 'scale(' + helpers.getValue([2.5, 1], b) + ') translateY(-' + helpers.getValue([10, 0], b) + 'px)' } );


			collection.get(
				[
					//TRANSFORM
					collection.add([1,2.5], { duration: 100, offset: (25 * k), bound: 100, repeat: 2 }),
					collection.add([0,10], { duration: 100, offset: (25 * k), bound: 100, repeat: 2 }),
					//COLOR
					collection.add([0,49], { duration: 100, offset: (25 * k), bound: 100, repeat: 2 }),
					collection.add([0,89], { duration: 100, offset: (25 * k), bound: 100, repeat: 2 }),
					collection.add([0,251], { duration: 100, offset: (25 * k), bound: 100, repeat: 2 }),
				],
				function(res){

					$(v).css( { 'transform': 'scale(' + res[0] + ') translateY(-' + res[1] + 'px)', 'color': 'rgb(' + parseInt(res[2]) + ',' + parseInt(res[3]) + ',' + parseInt(res[4]) + ')' } );

				}
			);

			/**

				Features
				
				collection.get( $(item), { 
					'transform': 'scale([{v:1,1.25}{o:(25*k)}{b:100}{r:2}]px) translateY(-[{v:0,10}{o:(25*k)}{b:100}{r:2}]px)', 
					'color': 'rgb([{v:0,49}{o:(25*k)}{b:100}{r:2}],[{v:0,89}{o:(25*k)}{b:100}{r:2}],[{v:0,251}{o:(25*k)}{b:100}{r:2}])' 
				} );

				collection.get( $(item), { 
					'transform': 'scale({1,1.25}px) translateY(-{0,10}px)', 
					'color': 'rgb({0,49},{0,89},{0,251}' 
				}, {
					'1-5': '{d:100}{o:(25*k)}{b:100}{r:2}',
					//'1,2,3,4,5': '{d:100}{o:(25*k)}{b:100}{r:2}',
				} );

				1-5 = 1,2,3,4,5

			*/


		});
		//0------------------------------------------000000


		//		
			// collection.get(
			// 	[
			// 		collection.add([1,1.5], { duration: 100, offset: 0, bound: 100, repeat: 6 }),
			// 		collection.add([1,0], { duration: 100, offset: 0, bound: 100, repeat: 2 }),
			// 	],
			// 	function(res){

			// 		$('.abc').css({'transform': 'scale('+ res[0] + ')', 'opacity': res[1] });
			// 	}
			// );
		//


		/**
		▒█▀▄▀█ ▒█▀▀▀█ ▒█░░▒█ ▒█▀▀▀ 　 ▒█▀▀▀ ▒█░░░ ▒█▀▀▀ ▒█▀▄▀█ ▒█▀▀▀ ▒█▄░▒█ ▀▀█▀▀ 
		▒█▒█▒█ ▒█░░▒█ ░▒█▒█░ ▒█▀▀▀ 　 ▒█▀▀▀ ▒█░░░ ▒█▀▀▀ ▒█▒█▒█ ▒█▀▀▀ ▒█▒█▒█ ░▒█░░ 
		▒█░░▒█ ▒█▄▄▄█ ░░▀▄▀░ ▒█▄▄▄ 　 ▒█▄▄▄ ▒█▄▄█ ▒█▄▄▄ ▒█░░▒█ ▒█▄▄▄ ▒█░░▀█ ░▒█░░
		*/

		/**
			USING getValue
		*/

		// var a = helpers.getValue([0,50], {duration: 100, offset: 0});
		// var b = helpers.getValue([0,50], {duration: 100, offset: 100});
		// var c = helpers.getValue([50,-50], {duration: 100, offset: 200});
		// var d = helpers.getValue([50,0], {duration: 100, offset: 300});
		// var e = helpers.getValue([-50,0], {duration: 100, offset: 400});

		// $('.abc').css({ 'transform': 'translateX(' + a + 'px)' });
		// if(a === 50){
		// 	$('.abc').css({ 'transform': 'translateX(50px) translateY(' + b + 'px)' });
		// }
		// if(a === 50 && b === 50){
		// 	$('.abc').css({ 'transform': 'translateX(' + c + 'px) translateY(' + b + 'px)' });
		// }
		// if(a === 50 && b === 50 && c === -50){
		// 	$('.abc').css({ 'transform': 'translateX(-50px) translateY(' + d + 'px)' });
		// }
		// if(d === 0){
		// 	$('.abc').css({ 'transform': 'translateX('+ e +'px) translateY(0px)' });
		// }

		/**
			USING COLLECTION
		*/
		collection.get([
				collection.add([0,50], {duration: 100, offset: 0, bound: 0, repeat: 1}), // right 50
				collection.add([0,50], {duration: 100, offset: 100, bound: 0, repeat: 1}), // top 50
				collection.add([50,-50], {duration: 100, offset: 200, bound: 0, repeat: 1}), // right -50
				collection.add([50,0], {duration: 100, offset: 300, bound: 0, repeat: 1}), // top 0
				collection.add([-50,0], {duration: 100, offset: 400, bound: 0, repeat: 1}), // right 0
			], function( res ){

				var a = res[0]; // from 0 to 50 -> [0 right to 50 right move]
				var b = res[1]; // from 0 to 50 -> [0 top to 50 top move]
				var c = res[2]; // from 50 to -50 -> [50 right to -50 left move]
				var d = res[3]; // from 50 to 0 -> [50 top to 0 top move]
				var e = res[4]; // from -50 to 0 -> [-50 left to 0 left move]

				$('.abc').css({ 'transform': 'translateX(' + a + 'px)' });
				if( a === 50 ){
					$('.abc').css({ 'transform': 'translateX(' + a + 'px) translateY(' + b + 'px)' });
				}
				if( b === 50 ){
					$('.abc').css({ 'transform': 'translateX(' + c + 'px) translateY(' + b + 'px)' });
				}
				if( c === -50 ){
					$('.abc').css({ 'transform': 'translateX(' + c + 'px) translateY(' + d + 'px)' });
				}
				if( d === 0 ){
					$('.abc').css({ 'transform': 'translateX(' + e + 'px) translateY(' + d + 'px)' });
				}

			});

		////////////////////////////////////////////////////////////////////////////////

		//0------------------------------------------000000
			// helpers.collection([1, 1.5], { duration: 100, offset: '0', bound: '200', repeat: 3, afterF: false }, function(result){
			// 	$('.abc').css({'transform': 'scale('+ result + ')' });
			// });
			// helpers.collection([1.5,1], { duration: 100, offset: '100', bound: '200', repeat: 3, beforeF: false }, function(data){
			// 	$('.abc').css({'transform': 'scale('+ data + ')' });
			// });
		//0------------------------------------------000000

		// helpers.collection.pair(function(){
		// 	console.log('abc');
		// });
		// console.log(helpers);

		// $('.abc').css({'transform': 'scale('+ helpers.getValue([1,1.5], {duration: 100, offset: 0, after: false}) + ')' });
		// $('.abc').css({'transform': 'scale('+ helpers.getValue([1.5,0.5], {duration: 100, offset: 100, before: false, after: false}) + ')' });
		// $('.abc').css({'transform': 'scale('+ helpers.getValue([0.5,1.5], {duration: 100, offset: 200, before: false, after: false}) + ')' });
		// $('.abc').css({'transform': 'scale('+ helpers.getValue([1.5,1], {duration: 100, offset: 300, before: false, after: false}) + ')' });
		// $('.abc').css({'transform': 'scale('+ helpers.getValue([1,1.5], {duration: 100, offset: 400, before: false, after: false}) + ')' });
		// $('.abc').css({'transform': 'scale('+ helpers.getValue([1.5,1], {duration: 100, offset: 500, before: false}) + ')' });

	


	});




	var triggerScreens = new enedScroll.Trigger( 'screensTrigger', { top: 200 } );
	var screensAnimation = new enedScroll( $('.screens-scene'), { top: 0, bottom: 0 }, triggerScreens );

	var screenDuration = parseInt( $('.screens-scene').find('.screen-1').outerHeight(), 10 );

	screensAnimation.addCreation( function( e ){

		var helpers = e.plugins;
		var screen = helpers.screen();

		screen.collection([
			screen.add( $('.screens-scene').find('.screen-1'), 'top', { duration: screenDuration, offset: 0, isVisible: false } ),
			screen.add( $('.screens-scene').find('.screen-2'), 'left', { duration: screenDuration, offset: screenDuration } ),
			screen.add( $('.screens-scene').find('.screen-3'), 'right', { duration: screenDuration, offset: (screenDuration * 2) } ),
			screen.add( $('.screens-scene').find('.screen-4'), 'scale', { duration: screenDuration, offset: (screenDuration * 3) } ),
		]);

	} );


	var triggerScreens2 = new enedScroll.Trigger( 'screensTrigger2', { top: 200 } );
	var screensAnimation2 = new enedScroll( $('.screens-scene-2'), { top: 0, bottom: 0 }, triggerScreens2 );

	var screenDuration2 = parseInt( $('.screens-scene-2').find('.screen-1').outerHeight(), 10 );

	screensAnimation2.addCreation( function( e ){

		var helpers = e.plugins;
		var screen = helpers.screen();

		screen.collection([
			screen.add( $('.screens-scene-2').find('.screen-1'), 'top', { duration: screenDuration2, offset: 0, isVisible: false } ),
			screen.add( $('.screens-scene-2').find('.screen-2'), 'left', { duration: screenDuration2, offset: screenDuration2 } ),
			screen.add( $('.screens-scene-2').find('.screen-3'), 'right', { duration: screenDuration2, offset: (screenDuration2 * 2) } ),
			screen.add( $('.screens-scene-2').find('.screen-4'), 'scale', { duration: screenDuration2, offset: (screenDuration2 * 3) } ),
		]);

	} );







	var trigger2 = new enedScroll.Trigger( 'Trigger2', { top: 250 } );
	var visual2 = new enedScroll.Visual({ 'color_trigger': 'orange' });
	var animation2 = new enedScroll( $('.item2'), {top:0,bottom:0}, trigger2, visual2 );
	animation2.addCreation(function( e ){


		// screen.show( '.screen-top', 'top', {duration:200,offset:400} );
		// screen.show( '.screen-bottom', 'bottom', {duration:200,offset:600} );
		

		/**
			SCREEN
			  -- show -left
			  -- show -right
			  -- show -top
			  -- show -bottom
			  -- show -scale
			  -- show -bounce
			  -- show -touched

			  -- hide -left
			  -- hide -right
			  -- hide -top
			  -- hide -bottom
			  -- hide -scale
			  -- hide -bounce
			  -- hide -touched

			  /// EVENTS
			  -- show
			  -- hide
			  -- remove

			  -- toggle
			  -- stop jako parametr Done
		*/

	});

	var triggerSlice = new enedScroll.Trigger( 'slicer', { top: '10%' } );
	var sceneSlice = new enedScroll( $('.item-slice'), { top: 0, bottom: 0 }, triggerSlice );
	var items = $('.item-slice').find('.abc111');
	var done = [];
	var kjn = 0;

	sceneSlice.addCreation(function( e ){

		var helpers = e.plugins;
		var collection = helpers.collection();

		// for( var x = 0; x < ( items.length - 1 ); x++ ){

		// 	collection.get(
		// 		[
		// 			collection.add( [0,1], { duration: 150, offset: (150 * x), bound: 0, repeat: 1 } )
		// 		],
		// 		function(e){

		// 			if( ! done[x] && e[0] === 1 ){
		// 				console.log( 'a' );
		// 				$(items[x + 1]).animate( { 'right': '50px' }, 300 );
		// 				done[x] = 'ok';
		// 			}
		// 			if( done[x] && e[0] <= 1 ){
		// 				$(items[x + 1]).animate( { 'right': '0' }, 300 );
		// 				delete done[x];
		// 			}

		// 		}
		// 	);

		// }

		var pin = helpers.pin( $(this).find('.scene') );
		var timeline = [{
			duration: 1800, offset: 0
		}];
		pin.add(timeline);

		helpers.slice([
			{duration: 500, offset: 0},
			{duration: 500, offset: 500},
			{duration: 500, offset: 1000}
		], function(e){

			$.each( items, function( key, item){

			if(e[key]){
				if( e[key].state === 'after' && ! done[key] && $(items[key + 1]) ){
					kjn += 150;
					$('.n').animate({top: '-'+kjn+'px'}, 300);
					//$(items[key + 1]).animate({opacity: '.5'}, 300);
					done[key] = 'ok';
				}else if( e[key].state === 'during' && done[key] && $(items[key + 1]) || e[key].state === 'before' && done[key] && $(items[key + 1]) ){
					kjn -= 150;
					$('.n').animate({top: '-'+kjn+'px'}, 300);
					//$(items[key + 1]).animate({opacity: '1'}, 300);
					delete done[key];
				}
			}

			} );


		});


		/*
			
			for( key in items ){

				helpers.slice([
					{duration: 150, offset: 0},
					{duration: 150, offset: 150},
					{duration: 150, offset: 300},
					{duration: 150, offset: 600},
				]);

			}

		*/

	});


	var trigger6 = new enedScroll.Trigger( 'Trigger6', {top:550} );
	var visual6 = new enedScroll.Visual({ 'color_trigger': 'blue' });
	var animation6 = new enedScroll( $('.item6'), { top:0,bottom:0 }, trigger6, visual6 );
	animation6.addCreation(function( e ){

		var helpers = e.plugins;

		helpers.show( '.showIn', 'in', { duration: 100, offset: 0 } );

		/**
			Features
			
			helpers.show( $( item ), 'in-d:100-o:0' );
			
		*/


	});


	var trigger7 = new enedScroll.Trigger( 'Trigger7', {top:'90%'} );
	var animation7 = new enedScroll( $('.item7'), {top:0,bottom:0}, trigger7 );
	animation7.addCreation(function( e ){

		var helpers = e.plugins;

		helpers.show( '.showOut', 'out', { duration: 100, offset: 0 } );

	});



	// enedScroll.options({ }); 1/2 - dodać funkcję edycji ustawień dla jednej funkcji
	// var myTrigger = new enedScroll.Trigger('myTrigger');

	// var animation1 = new enedScroll( $(parent), [top_selector,bottom_selector], myTrigger );

	// animation1.addWorkspace( animation1, '.item_class', [top_selector,bottom_selector], {style} ); /* Pause */
	// animation1.options({}); /* -- */
	// animation1.addCreation(function(e){ /* + */

	// e = { /* -- */
	// 	duration,
	// 	state (before, in, after)
	// }

	// 	animation1.helpers.plugins;
	// 		- pin // duration /* + */
	// 		- move element // duration
	// 		- show IN // duration
	// 		- show OUT // duration
	//		- show toggle // duration
	//		- animation // Włączająca się animacja

	// 	animation1.helpers.getValue(from, to);
	// 	animation1.helpers.css.transform(type, [from, to], unit);
	// 	animation1.helpers.css.opacity(from, to);
	// 	animation1.helpers.css.top(from, to); // margin
	// 	animation1.helpers.css.left(from, to); // margin
	// 	animation1.helpers.css.right(from, to); // margin
	// 	animation1.helpers.css.bottom(from, to); // margin

	// });



})(jQuery);