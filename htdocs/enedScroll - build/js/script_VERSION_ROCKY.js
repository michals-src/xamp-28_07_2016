(function( $ ){

	var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
	$.fn.extend({
	    animateCss: function (animationName) {
	        this.addClass('animated ' + animationName).one(animationEnd, function() {
	            $(this).removeClass('animated ' + animationName);
	        });
	        return this;
	    }
	});

	var TriggerDOC = new enedScroll.Trigger( 'Trigger-DOC', 0 );
	var SceneDocument = new enedScroll( $('body'), TriggerDOC, { selectors: [0, 0], visual: { show_selectors: false, show_trigger: false } } );
	
	var Trigger1 = new enedScroll.Trigger( 'Trigger-1', 150 );
	var Scene1 = new enedScroll( $('.signature'), Trigger1, { selectors: [0, 0], visual: { show_selectors: false, show_trigger: false } } );

	var Trigger2 = new enedScroll.Trigger( 'Trigger-2', 100 );
	var Scenery = new enedScroll( $('.scenery'), Trigger2, { selectors: 0, visual: { show_selectors: false, show_trigger: false } } );

	SceneDocument
		.add( $('.wallpaper'), [
			[{'top': '[350,0]px'}, 0.3, 0, 'wallpaper-action' ]
		]);

	var $acts = $('.acts');
	var $stage = $('.stage');

	Scene1.add( $('.sc1-welcome .signature'), [
		[{'transform': 'translateY([0,-145]px)'}, 0.5, 0, 'welcome-signature' ]
	]);
	
	//	PINS
	Scenery.pin( $('.act-1'), [ [ 2, 0.1, 'act-1-pin' ] ] );
	Scenery.pin( $('.act-2'), [ [ 3, Scenery.var('act-1-pin').pin_done + ( $(window).height() / 1000 ), 'act-2-pin' ] ] );
	Scenery.pin( $('.act-3'), [ [ 4, Scenery.var('act-2-pin').pin_done + ( $(window).height() / 1000 ), 'act-3-pin' ] ] );
	Scenery.pin( $('.act-4'), [ [ 1, Scenery.var('act-3-pin').pin_done + ( $(window).height() / 1000 ), 'act-4-pin' ] ] );
	Scenery.pin( $('.act-5'), [ [ 0.5, Scenery.var('act-4-pin').pin_done + ( $(window).height() / 1000 ), 'act-5-pin' ] ] );
	//Scenery.pin( $('.informations'), [ [ 3, Scenery.var('act-5-pin').pin_done + ( $(window).height() / 1000 ), 'informations-pin' ] ] );

	Scenery.add( $('.progress-line .progress'), [
		[{ 'width': '[0,100]%' }, Scenery.var('act-4-pin').pin_done, 0, 'progress-bar']
	]);

	Scenery.is( 'progress-bar', 'BEFORE ENTER AFTER', function(e){
		if( e.state === "ENTER" ){
			$('.progress-bar').animate({'opacity': '1'}, 300);
		}else{
			$('.progress-bar').animate({'opacity': '0'}, 300);
		}
	});


	// ACT 1 TEXT
	var $act_1_child_each = $('.act-1 .child').text().split(' ');
	$('.act-1 .child').html(' ');
	$.each( $act_1_child_each, function(key,value){
		var span = document.createElement('span');
		$(span).html(value);
		$('.act-1 .child').append( span ).append(' ');
	});

	Scenery.add( $('.act-1'), [
		[{ 'opacity': '[0,1]' }, 0.3, 0, 'show-stage'  ]
	] );

	Scenery
	.add( $( '.act-1 header' ), [
		[{ 'transform': 'rotateX([0,90]deg)' }, 1.5, 1 ]
	])
	.add( $( '.act-1 .child span' ), [
		[{ 'transform': 'rotateY([0,90]deg)' }, 0.5, 1.2 ],
		[{ 'opacity': '[1,0]' }, 0.25, -0.3 ]
	], '+0.08');

	//ACT 2
	Scenery.is( 'act-2-pin', 'BEFORE ENTER AFTER', function(e){

		if( e.state === "ENTER" ){
			$('.act-2').animate({ opacity: '1' }, 200, function(){

				$( '.act-2 header').addClass('animated lightSpeedIn').one(animationEnd, function() {
		            $(this).removeClass('animated lightSpeedIn');
		            $( '.act-2 header').css('opacity', '1');
		        });
				
				//$( '.act-2 header').removeClass( 'animated' );
			});
		}else{

			$( '.act-2 header').addClass('animated bounceOut').one(animationEnd, function() {
		            $(this).removeClass('animated bounceOut');
		            $( '.act-2 header').css('opacity', '0');
		     });
		
			//$( '.act-2 header').removeClass( 'animated' );
		}

	});

	Scenery
	.add( $( '.act-2 .child'), [
		Scenery.fromTop([ { 'opacity': '[0,1]' }, 0.5, Scenery.var('act-2-pin').pin_offset + 0.5, 'act-2-child-in' ])
	] );




	// ACT 3

	var $bob = $('.act-3 header .bob');
	var $steve = $('.act-3 header .steve');
	var $rocky = $('.act-3 header .rocky');

	Scenery.is( 'act-3-pin', 'BEFORE ENTER AFTER', function(e){

		if( e.state === "ENTER" || e.state === "AFTER" ){
			$('.act-3').animate({'opacity': '1'}, 200);

			$bob.animate({'opacity': '1'}, 1100, function(){
				$steve.animate({'opacity': '1'}, 800);
			});

		}else if( e.state === "BEFORE" ){

			$bob.animate({'opacity': '0'}, 600,function(){
				$steve.animate({'opacity': '0'}, 600, function(){
					$('.act-3').animate({'opacity': '0'}, 300);
				});
			});


		}

	});

	var $rocky_repeat = Scenery.repeat([ [ { 'transform': 'scale([1,2])' }, [0.4, (Scenery.var('act-3-pin').pin_offset + 1) ], [0.4,0.2], 'rocky-scaling' ] ], 1);
	$rocky_repeat[0][0]["opacity"] = "[0,1]";
	Scenery.add( $rocky[0], $rocky_repeat);

	Scenery.add( $('.act-3 .child .consider span'), [
		[{'transform': 'scale([1.5,1]) translateY([-15,0]px) translateX([-5,0]px)', 'opacity': '[0,1]'}, 0.3, Scenery.var('rocky-scaling')[1].offset_done, 'hm-text' ]
	], '+0.25');

	Scenery.setPoint( 0, Scenery.var('hm-text')[3].offset_done + 0.35, 'hm-text-event');
	Scenery.is( 'hm-text-event', 'BEFORE AFTER', function(e){
		if( e.state === "AFTER" ){
			$('.act-3 .child .text').css('opacity', '1').addClass('tada animated');
		}else{
			$('.act-3 .child .text').css('opacity', '0').removeClass('tada animated');
		}
	});


	Scenery.add( $('.act-4'), [
		[ { 'transform': 'scale([0,1]) rotate([0,720]deg)' }, 0.45, Scenery.var('act-4-pin').pin_offset - 0.2 ]
	]);


	Scenery.add( $('.wallpaper'), [
		[ { 'transform': 'translateX([0,-50]%)' }, 1, Scenery.var('act-5-pin').pin_offset + 0.3 ]
	]);	
	Scenery.add( $('.wallpaper-bg'), [
		[ { 'transform': 'translateX([0,-50]%)' }, 1, Scenery.var('act-5-pin').pin_offset + 0.3 ]
	]);
	
	Scenery.add( $('.act-5'), [
		[ { 'opacity': '[1,0]' }, 0.5, Scenery.var('act-5-pin').pin_done ]
	]);	
	Scenery.add( $('.informations'), [
		[ { 'opacity': '[0,1]' }, 0.5, Scenery.var('act-5-pin').pin_done ]
	]);




})(jQuery);