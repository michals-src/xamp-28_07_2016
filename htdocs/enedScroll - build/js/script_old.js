(function( $ ){

	var Trigger1 = new enedScroll.Trigger( 'Trigger-1', 150 );
	var Scene1 = new enedScroll( $('.signature'), Trigger1, { selectors: [0, 0], visual: { show_selectors: false, show_trigger: false } } );

	var Trigger2 = new enedScroll.Trigger( 'Trigger-2', 120 );
	var Stage = new enedScroll( $('.scenery'), Trigger2, { selectors: 0, visual: { show_selectors: false, show_trigger: false } } );

	var $acts = $('.acts');
	var $stage = $('.stage');

	Scene1.add( $('.sc1-welcome .signature'), [
		[{'transform': 'translateY([0,-145]px)'}, 0.15, 0, 'welcome-signature' ]
	]);
	
	Stage.pin( $('.scene'), [ [ 10, 0.17 ] ] );

	Scene1.add( $stage, [
		[{ 'opacity': '[0,1]' }, 0.2, Scene1.var('welcome-signature')['offset_done'], 'show-stage'  ]
	] );

	Scene1.is( 'show-stage', 'BEFORE AFTER', function(e){
		
		if( e.state === 'BEFORE' && $stage.find( '.act-1 h2' ).hasClass('tada animated') ){
			$stage.find( '.act-1 h2' ).removeClass('tada animated');
		}

		if( e.state === 'AFTER' ){
			$stage.find( '.act-1 h2' ).addClass('tada animated');
		}

	});

	var setAct = function( num_of_act ){

		var num_of_act = num_of_act.toString();

		$.each( $stage.find('.act'), function(key,item){
			$(item).appendTo($acts);
		});

		if( $stage.find( '.act-' + num_of_act ).length === 0 ){
			$acts.find('.act-' + num_of_act ).appendTo($stage);
		}

	}

	// FIRST ACT || HAS BEFORE && AFTER EVENT BECAUSE IS DEFAULT ACT
	Stage.setPoint( 0, 0, 'act-1' );
	Stage.is( 'act-1', 'BEFORE AFTER', function(e){
		setAct(1);
	});
	
	var $act_1_child_each = $('.act-1 .child').text().split(' ');

	$('.act-1 .child').html(' ');
	$.each( $act_1_child_each, function(key,value){
		var span = document.createElement('span');
		$(span).html(value);
		$('.act-1 .child').append( span ).append(' ');
	});

	Stage
	.add( $( '.act-1 header' ), [
		[{ 'transform': 'rotateX([0,90]deg)' }, 0.5, 1 ]
	])
	.add( $( '.act-1 .child span' ), [
		[{ 'transform': 'rotateY([0,90]deg)' }, 0.5, 1.2 ],
		[{ 'opacity': '[1,0]' }, 0.25, -0.3, 'act-1-end' ]
	], '+0.08');

	Stage.setPoint( 0, Stage.var('act-1-end')[ Stage.var('act-1-end').length - 1 ].offset_done + 0.25, 'act-2-start' );
	Stage.is( 'act-2-start', 'BEFORE AFTER', function(e){
		
		if( e.state === "AFTER" ){
			setAct(2);
			$( '.act-2 header').removeClass( 'lightSpeedOut animated' );
			$( '.act-2 header').addClass( 'lightSpeedIn animated' );
		}else{
			$( '.act-2 header').removeClass( 'lightSpeedIn animated' );
			$( '.act-2 header').addClass( 'lightSpeedOut animated' );
			setTimeout(function(){
				setAct(1)
			}, 500);
		}

	});


	Stage
		.add( $( '.act-2 .child'), [
			Stage.fromTop([ { 'opacity': '[0,1]' }, 0.5, Stage.var('act-2-start').point_offset + 0.5, 'act-2-child-in' ])
		] )
		.add( $( '.act-2'), [
			Stage.fromTop([ { 'transform': 'scale([1,0])' }, 0.4, Stage.var('act-2-child-in').offset_done + 0.25, 'act-2-header-out' ])
		] );


	var $bob = $('.act-3 header .bob');
	var $steve = $('.act-3 header .steve');
	var $rocky = $('.act-3 header .rocky');

	Stage.setPoint( 0, Stage.var('act-2-header-out').offset_done + 0.1, 'act-3-start' );
	Stage.is( 'act-3-start', 'BEFORE AFTER', function(e){
		
		if( e.state === "AFTER" ){
			setAct(3);
			$bob.animate({'opacity': '1'}, 1500);
			setTimeout(function(){
				$steve.animate({'opacity': '1'}, 1500);
			}, 1250);
		}else if( e.state === "BEFORE" || e.state === "AFTER" ){
			$bob.animate({'opacity': '0'}, 1500);
			$steve.animate({'opacity': '0'}, 1500);
			setTimeout(function(){
				setAct(2);
			}, 1600);
		}

	});

	var $rocky_repeat = Stage.repeat([ [ { 'transform': 'scale([1,2])' }, [0.6, (Stage.var('act-3-start').point_offset + 0.35) ], [0.6,0], 'rocky-scaling' ] ], 1);
	$rocky_repeat[0][0]["opacity"] = "[0,1]";
	Stage.add( $rocky[0], $rocky_repeat);

	Stage.add( $('.act-3 .child .consider span'), [
		[{'transform': 'scale([1.5,1]) translateY([-15,0]px) translateX([-5,0]px)', 'opacity': '[0,1]'}, 0.3, Stage.var('rocky-scaling')[1].offset_done, 'hm-text' ]
	], '+0.15');
	
	Stage.setPoint( 0, Stage.var('hm-text')[3].offset_done, 'hm-text-event');
	Stage.is( 'hm-text-event', 'BEFORE AFTER', function(e){
		if( e.state === "AFTER" ){
			$('.act-3 .child .text').css('opacity', '1').addClass('tada animated');
		}else{
			$('.act-3 .child .text').css('opacity', '0').removeClass('tada animated');
		}
	});


	// ZMIENIĆ WYŚWIETLANIE ACTÓW
	// Każdy section.act jako oddzielny div fixed
	// Użycie translateX i tanslateY dla wyświetlenia danego actu
	// ○ Coś w stylu systemu screen




})(jQuery);