(function( $ ){


	var Trigger1 = new enedScroll.Trigger( 'Trigger-1', 0 );
	var Scene1 = new enedScroll( $('body'), Trigger1, { selectors: [0, 0], visual: { show_selectors: false, show_trigger: false } } );

	Scene1.setPoint( 0, 0.01, 'pointBodyBlocked' );
	Scene1.is( 'pointBodyBlocked', 'AFTER', function(e){
		$('body').removeClass('blocked');
		$('.act-header header').removeClass('animated').addClass('in');
	});

	var $act_1_child_each = $('.act-header .describe').text().split(' ');
	$('.act-header .describe').html(' ');
	$.each( $act_1_child_each, function(key,value){
		var span = document.createElement('span');
		span.style.display = 'inline-block';
		$(span).html(value);
		$('.act-header .describe').append( span ).append(' ');
	});

	Scene1.pin( $('.act-header'), [[ 5, 0 ]] );
	Scene1.add( $('.act-header .describe'), [
		[{ 'margin-top': '[-10,0]%', 'opacity': '[0,1]'}, 0.5, 0]
	], '+0.15');
	Scene1.add( $('.act-header .describe span'), [
		[{ 'transform': 'rotateX([90,0]deg)', 'opacity': '[0,1]'}, 0.5, 0.2]
	], '+0.15');

	//SCENE DOCS
	var Trigger2 = new enedScroll.Trigger( 'Trigger-2', ($(window).height() / 2) );
	var Scene2 = new enedScroll( $('.screen-documentation'), Trigger2, { selectors: [0, 0], visual: { show_selectors: false, show_trigger: false } } );

	Scene2.add( $('.screen-documentation img'), [
		[{ 'transform': 'scale([1,1.8]) rotate([0,15]deg)' }, 0.5, 0.1]
	]);
	Scene2.add( $('.screen-documentation p'), [
		[{ 'margin-top': '[30,110]px' }, 0.5, 0.1]
	]);

	//SCENE DEMOS
	var Scene4 = new enedScroll( $('.screen-demos'), Trigger2, { selectors: [-300, 0], visual: { show_selectors: false, show_trigger: false } } );
	var mainTitleRepeat = Scene4.repeat([
		[{ 'transform': 'scale([1,1.5]) translateY([0,-25]px)' }, [0.25, 0], [0.2, 0]]
	], 1);
	Scene4.add( $('.screen-demos .main-title span'), mainTitleRepeat, '+0.15');


	//SCENE BUY
	var Trigger3 = new enedScroll.Trigger( 'Trigger-3', $(window).height() );
	var Scene3 = new enedScroll( $('.screen-buy'), Trigger2, { selectors: [0, 0], visual: { show_selectors: false, show_trigger: false } } );

	Scene3.add( $('.screen-buy .text-area'), [
		[{ 'opacity': '[0.35,1]', 'transform': 'scale([0.8,1])'}, 0.2, 0]
	]);


})(jQuery);