(function($){

	//var env123 = '.stage-visual-window';

	// var env = new enedScroll.Environment( '.es-builder-stage' );

	// var trigger = new enedScroll.Trigger( "Trigger-1", 100, env );
	// var Scene1 = new enedScroll( $('.es-builder-scenery'), trigger, { selectors: [0, 0], visual: { show_selectors: true, show_trigger: true } } );
	// Scene1.pin( $('#es-builder-sample_box'), [
	//  	[0.05, 0]
	// ]);

	// Scene1.add( $('#es-builder-sample_box'), [
	// 	[{ 'background': 'rgb([249,0],[0,0],[6,0])' }, 0.2, 0 ],
	// ]);


	//console.log(Scene1);

		var convertValue = function(e){
		
		//e[0] = "#000000";
		//e[1] = "#ffffff";

		// #XXXXXX -> ["XX", "XX", "XX"]
		var value0 = e[0].match(/[A-Za-z0-9]{2}/g);
		var value1 = e[1].match(/[A-Za-z0-9]{2}/g);

		var to16 = function(a){
			return a.map(function(v){ return parseInt(v, 16) });
		};

		// ["XX", "XX", "XX"] -> [n, n, n]
		value0 = to16(value0);
		value1 = to16(value1);

		var value = [];

		for( var x = 0; x < value0.length; x++ ){
			value.push( "[" + value0[x] + "," + value1[x] + "]" );
		}

		// [ "[x,y]", "[x,y]", "[x,y]" ] -> rgb([x,y],[x,y],[x,y])
		return "rgb(" + value.join(",") + ")";

	}

})(jQuery);
