(function($) {

	enedScroll.option({
		'show_all_triggers': true
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

	var trigger2 = new enedScroll.Trigger({ name: 'Trigger2', margins: {top:55}});
	var animation1 = new enedScroll( $('.item1'), {top:0,bottom:0}, trigger2 );

	animation1.addCreation(function(){
		var helpers = animation1.helpers;

		//helpers.plugins.pin( 'pin1', $('.myText'), { duration: '200', offset: '0' });
		//helpers.plugins.pin( 'pin1', $('.myText'), { duration: '200', offset: '200', before: false});

		var pin1 = helpers.plugins.pin( /* object || string */ $('.myText') ),
			timeline = [
				{ duration: 200, offset: 0 },
				{ duration: 200, offset: 300 }
			];
		pin1.add( timeline );
		//pin1.add( { duration: 300, offset: 800 } );

		//0------------------------------------------
			helpers.collection([ 1, 1.5], { duration: 100, offset: '0', bound: '200', repeat: 3, afterF: false }, function(result){
				$('.abc').css({'transform': 'scale('+ result + ')' });
			});
			helpers.collection([1.5,1], { duration: 100, offset: '100', bound: '200', repeat: 3, beforeF: false }, function(data){
				$('.abc').css({'transform': 'scale('+ data + ')' });
			});
		//0------------------------------------------

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



	// enedScroll.options({ }); 1/2 - dodać funkcję edycji ustawień dla jednej funkcji
	// var myTrigger = new enedScroll.Trigger('myTrigger');

	// var animation1 = new enedScroll( $(parent), [top_selector,bottom_selector], myTrigger );

	// animation1.addWorkspace( animation1, '.item_class', [top_selector,bottom_selector], {style} );
	// animation1.options({});
	// animation1.addCreation(function(e){

	// e = {
	// 	duration,
	// 	state (before, in, after)
	// }

	// 	animation1.helpers.plugins;
	// 		- pin // duration
	//		- wave // fala np. tekstu lub elementów DOMHtml
	// 		- animate Text // duration
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