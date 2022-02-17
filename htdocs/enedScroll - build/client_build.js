/*

	var trigger 	= 	enedScroll.Trigger( string, array || object );
	var visual 		= 	enedScroll.Visual( object );
		


	@element object || string
	@equipment object

		var scene 		= 	new enedScroll( element, trigger, {
			selectors: object || array,
			visual: @visual
		});

	scene
		Before i after dla pierwszego i ostatniego wydarzenia, aby można zrobić np. poruszanie się elementu
		.add( element,
			[
				[ { properties }, duration, offset, name ],
				[ { properties }, duration, offset, name ],
				... + n
			],
		)
		.screen
		.pin
		.slice
		.call
		 // .style
		.one
		.toggleClass
		.addClass
		.removeClass
		.is-state
		.has-sth
		
		 // .create


*/

(function($){

	var trigger = new enedScroll.Trigger( 'sth', 150 );

	var core = new enedScroll( $('.scene1'), trigger, {
		selectors: [0,0],
		visual: {
			show_selectors: true,
			name_selectors: 'abc',
			show_trigger: true
		}
	});

	core.setPoint( 0.1, 0, "moj_punkt" );

	// BEFORE ENTER UPDATE AFTER
	core.is( "moj_punkt", "AFTER", function(e){
		//console.log( core );
	} );

	/**
		@object || @string item
		@array style
		@delay
	*/
	core.var( "text_element", $('.dev-box span') );

	/*
	core.add( $('.dev-box span'), [
		/**
			@array style
			@int duration
			@int offset

		[ {  'transform': 'translateY([0,-30]px) translateX([0,-15]px) scale([1,2])' }, 0.3 ],		
		[ { 'transform': 'translateY([-30,0]px) translateX([-15,0]px) scale([2,1])' }, 0.3 ],
		[ { 'transform': 'rotate([0,360]deg)' }, 0.3, -0.3 ],

	], '+0.08');

	*/
	

	// core.add( $('.dev-box'), [
	// 	/**
	// 		@array style || @object repeat
	// 		@int duration
	// 		@int offset
	// 	*/
	// 	[ { 'transform': 'rotate([0,360]deg) scale([1,2])', 'opacity': '[1,0]' }, 0.3, 0.5 ],
	// 	[ { 'transform': 'scale([2,1])', 'color': 'rgba([0,255],[0,255],[0,255],1)' }, 0.2],
	// 	[ { 'transform': 'scale([1,2])' }, 0.2],
	// 	[ { 'transform': 'scale([2,1])' }, 0.2],
	// 	[ { 'transform': 'scale([1,2])' }, 0.2],

	// ]);	

	/**
		REPEAT FUNCTION
		@object styles
		  @object style properties
		  	[0] = css style
		  	[1] = [
		  		[0] = duration
		  		[1] = offset
		  	]
		  	[2] = [
		  		[0] = transition_duration // OPCJA, GDY PRZEJŚCIA ( A,B,C,C,B,A ) SĄ USTAWIONE
		  		[1] = transition_offset // OPCJA, GDY PRZEJŚCIA ( A,B,C,C,B,A ) SĄ USTAWIONE
		  	] || @ boolean => dziedziczenie z wartości z [1] ( default: true )
		@int number of repeats
		@boolean use transition | (default: true)
	 */
	 
	// var repeat = core.repeat( [
	// 	[ { 'transform': 'scale([1,2])' }, [0.4] ]
	// ], 12 );

	// core.add( $('.dev-box'), repeat);

	var a = false;
	var abc = function(e){
		if(e.state === "ENTER"){
			$('.dev-box').html('BOX PIN');
		}else{
			$('.dev-box').html('BOX NIE PIN');
		}

		if( e.var === 'pin-1' && e.state === "ENTER" && !a ){
			$('.dev-box').animate({ 'width': '+=100px' }, 500);
			a = true;
		}

		if( e.var === 'pin-1' && ["BEFORE", "AFTER"].indexOf(e.state) >= 0 && a === true ){
			$('.dev-box').animate({ 'width': '-=100px' }, 500);
			a = false;
		}

		if( e.var === 'pin-3' && e.state === "AFTER" ){
			console.log( 'THIS EVENT HAS DONE AT OFFSET: ' + core.var('pin-3')['pin_done'] );
		}
	};

	core.pin( $('.dev-box'), [[0.2,0,'pin-1'], [0.2,0.1,'pin-2'], [0.2,0.1,'pin-3']] );
	core.is( 'pin-1', 'ENTER AFTER BEFORE', abc );
	core.is( 'pin-2', 'ENTER AFTER BEFORE', abc );
	core.is( 'pin-3', 'ENTER AFTER BEFORE', abc );

	/**
		@object || @string item
		@array timeline
		@boolean true => offset ustawiany jest od góry elementu
			(default) false => offset ustawiany jest od poprzednika
	 */
	
	// core.pin( $('.dev-box'), 
	// 	[ [4.8, 0.2] ]
	// );


	var ass = new enedScroll.Trigger( 'xde', 0 );
	var f = new enedScroll( $('.myscene'), ass, {
		selectors: [0,0],
		visual: {
			show_selectors: true,
			show_trigger: true
			/**
				show_selectors: true || false,
				name_selectors:  string,
				color_top_selector:  string,
				color_bottom_selector:  string,
				show_trigger:  true || false,
				color_trigger:  string,
				zIndex_selectors:  string,
				zIndex_trigger:  string,
				scene_position:  relative,
			*/
		}
	});

	f.pin( $('.st-pin'), [ [10,0,'my-first-pin-var'] ])
	f.add( $('.st-pin'), f.repeat([
		[ { 'transform': 'scale([1,0.7])' }, [ 0.5, 0.5 ], [ 0.5, 1.5 ], 'scaling'  ]
	], 3) )
	f.add( $('.st-p'), [
			// [ { style }, duration, offset, name_of_var ]
			f.fromTop([ { 'transform': 'translate([0,-25]%,0)' }, 0.5, f.var('scaling-1')["offset_done"] + 0.5, 'first_window' ]),
			f.fromTop([ { 'transform': 'translate([-25,-50]%,0)' }, 0.5, f.var('scaling-3')["offset_done"] + 0.5 ]),
			f.fromTop([ { 'transform': 'translate([-50,-75]%,0)' }, 0.5, f.var('scaling-5')["offset_done"] + 0.5, 'last_window' ]),
		] );
	f.setPoint( f.var('scaling-6')["offset_done"] , 0, 'm-p-abc');
	f.is( 'my-first-pin-var', "UPDATE BEFORE AFTER", function(e){
		//console.log( e.progress );
	} );

	/*
		enedScroll.pin( element,
			@objetc timeline
			[
			                                    DO ZROBIENIA
				[ duration, offset (DEFAULT: 0), {{ NAZWA }} ],
				[ duration, offset (DEFAULT: 0), {{ NAZWA }} ],
				... + n
			]
		);

		enedScroll.fromTop(
			@object [ { style }, duration, offset ], 
			@boolean include to global_offset (default: true)
		);
	*/

	/**
		◘ .animate // wywołanie animacji po przekroczeniu podanego offsetu oraz przywracanie początkowego stanu
		○ .setEvent // dla pojedyńczej akcji ( WYWOŁANIE FUNKCJI PO PRZEKROCZENIU PODANEGO OFFSETU | BRAK DURATION )
		◘ .is // wywołanie funkcji dla podanych wydarzeń dodanego elementu ( BEFORE AFTER )
		◘ .setPoint // offset && duration || offset

		◘ DO ZROBIENIA
		○ NOTATKA // NIE UWZGLĘDNIAĆ

		Visual
			.selectors
			.trigger
	*/


})(jQuery);