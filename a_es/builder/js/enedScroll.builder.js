/**

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

		for( var x = 0; x < value.length; x++ ){
			value.push( "[" + value0[x] + "," + value1[x] + "]" );
		}

		// [ "[x,y]", "[x,y]", "[x,y]" ] -> rgb([x,y],[x,y],[x,y])
		return "rgb(" + value.join(",") + " )";

	}

*/
(function($){

	var esBuilder = function(){

		var esB = this;

		var globalSettings = esB.globalSettings = esB.loadDefaults();
		
		var LAYERS = esB.layers = [];
		var GLOBAL_LAYERS = esB.Layers();
		var TIMELINE = esB.Timeline();

		TIMELINE.visibility();

		var verifyScale = function( duration, offset ){
			
			var setValues = ( parseInt( duration, 10 ) + parseInt( offset, 10 ) + globalSettings.globalOffset );

			if( globalSettings.globalDuration < setValues ){
				globalSettings.globalDuration = setValues;
			}

			TIMELINE.scale();
			TIMELINE.visual().measures();

		};

		var createLayer = function(){

			var layers = globalSettings.windows.layers;
			var layerDurtion = parseFloat( $(layers.duration).val(), 10 );
			var layerOffset = parseFloat( $(layers.offset).val(), 10 );

			LAYERS.push( { 
				"duration": layerDurtion, 
				"offset": ( layerOffset + globalSettings.globalOffset ),
				"layer_offset": layerOffset,
				"style": {
					"transform": {},
					"opacity": false,
					"color": false,
				}
			} );

			verifyScale( layerDurtion, layerOffset );

			if( ! globalSettings.isActive && globalSettings.countLayer == 0 ){
				
				globalSettings.isActive = true;

				TIMELINE.visual().measures();
				TIMELINE.visibility();

			}

			$(layers.duration).val( layers.defaultDuration );
			$(layers.offset).val( layers.defaultOffset );

			globalSettings.countLayer += 1;

			TIMELINE.visual().layers();
			GLOBAL_LAYERS.init();

			globalSettings.nextLayer += 1;
			$(layers.noLayer).val( globalSettings.nextLayer );

			if( layerOffset >= 0 ){
				globalSettings.globalOffset += parseFloat( layerDurtion, 10 ) + parseFloat( layerOffset, 10 );
			}

		};

		var removeLayer = function(){

		};

		var saveLayer = function(){

			var EDIT_SETTINGS = globalSettings.windows.edit;

			var translateX_0 = $(EDIT_SETTINGS.translate.x.start).val();
			var translateX_1 = $(EDIT_SETTINGS.translate.x.end).val();
			var translateY_0 = $(EDIT_SETTINGS.translate.y.start).val();
			var translateY_1 = $(EDIT_SETTINGS.translate.y.end).val();
			var translateZ_0 = $(EDIT_SETTINGS.translate.z.start).val();
			var translateZ_1 = $(EDIT_SETTINGS.translate.z.end).val();

			if( parseInt( translateX_0, 10 ) != parseInt( translateX_1, 10 ) ){
				GLOBAL_LAYERS.translate( "x", [ parseInt( translateX_0, 10 ), parseInt( translateX_1, 10 ) ], "add" );
			}else if( parseInt( translateX_0, 10 ) == parseInt( translateX_1, 10 ) ){
				GLOBAL_LAYERS.translate( "x", [ parseInt( translateX_0, 10 ), parseInt( translateX_1, 10 ) ], "remove" );
			}
			if( parseInt( translateY_0, 10 ) != parseInt( translateY_1, 10 ) ){
				GLOBAL_LAYERS.translate( "y", [ parseInt( translateY_0, 10 ), parseInt( translateY_1, 10 ) ], "add" );
			}else if( parseInt( translateY_0, 10 ) == parseInt( translateY_1, 10 ) ){
				GLOBAL_LAYERS.translate( "y", [ parseInt( translateY_0, 10 ), parseInt( translateY_1, 10 ) ], "remove" );
			}
			if( parseInt( translateZ_0, 10 ) != parseInt( translateZ_1, 10 ) ){
				GLOBAL_LAYERS.translate( "z", [ parseInt( translateZ_0, 10 ), parseInt( translateZ_1, 10 ) ], "add" );
			}else if( parseInt( translateZ_0, 10 ) == parseInt( translateZ_1, 10 ) ){
				GLOBAL_LAYERS.translate( "z", [ parseInt( translateZ_0, 10 ), parseInt( translateZ_1, 10 ) ], "remove" );
			}

			var scaleX_0 = $(EDIT_SETTINGS.scale.x.start).val();
			var scaleX_1 = $(EDIT_SETTINGS.scale.x.end).val();
			var scaleY_0 = $(EDIT_SETTINGS.scale.y.start).val();
			var scaleY_1 = $(EDIT_SETTINGS.scale.y.end).val();
			var scaleZ_0 = $(EDIT_SETTINGS.scale.z.start).val();
			var scaleZ_1 = $(EDIT_SETTINGS.scale.z.end).val();


			if( parseInt( scaleX_0, 10 ) != parseInt( scaleX_1, 10 ) ){
				GLOBAL_LAYERS.scale( "x", [ parseInt( scaleX_0, 10 ), parseInt( scaleX_1, 10 ) ], "add" );
			}else if( parseInt( scaleX_0, 10 ) == parseInt( scaleX_1, 10 ) ){
				GLOBAL_LAYERS.scale( "x", [ parseInt( scaleX_0, 10 ), parseInt( scaleX_1, 10 ) ], "remove" );
			}
			if( parseInt( scaleY_0, 10 ) != parseInt( scaleY_1, 10 ) ){
				GLOBAL_LAYERS.scale( "y", [ parseInt( scaleY_0, 10 ), parseInt( scaleY_1, 10 ) ], "add" );
			}else if( parseInt( scaleY_0, 10 ) == parseInt( scaleY_1, 10 ) ){
				GLOBAL_LAYERS.scale( "y", [ parseInt( scaleY_0, 10 ), parseInt( scaleY_1, 10 ) ], "remove" );
			}
			if( parseInt( scaleZ_0, 10 ) != parseInt( scaleZ_1, 10 ) ){
				GLOBAL_LAYERS.scale( "z", [ parseInt( scaleZ_0, 10 ), parseInt( scaleZ_1, 10 ) ], "add" );
			}else if( parseInt( scaleZ_0, 10 ) == parseInt( scaleZ_1, 10 ) ){
				GLOBAL_LAYERS.scale( "z", [ parseInt( scaleZ_0, 10 ), parseInt( scaleZ_1, 10 ) ], "remove" );
			}

			var rotateX_0 = $(EDIT_SETTINGS.rotate.x.start).val();
			var rotateX_1 = $(EDIT_SETTINGS.rotate.x.end).val();
			var rotateY_0 = $(EDIT_SETTINGS.rotate.y.start).val();
			var rotateY_1 = $(EDIT_SETTINGS.rotate.y.end).val();
			var rotateZ_0 = $(EDIT_SETTINGS.rotate.z.start).val();
			var rotateZ_1 = $(EDIT_SETTINGS.rotate.z.end).val();

			if( parseInt( rotateX_0, 10 ) != parseInt( rotateX_1, 10 ) ){
				GLOBAL_LAYERS.rotate( "x", [ parseInt( rotateX_0, 10 ), parseInt( rotateX_1, 10 ) ], "add" );
			}else if( parseInt( rotateX_0, 10 ) == parseInt( rotateX_1, 10 ) ){
				GLOBAL_LAYERS.rotate( "x", [ parseInt( rotateX_0, 10 ), parseInt( rotateX_1, 10 ) ], "remove" );
			}
			if( parseInt( rotateY_0, 10 ) != parseInt( rotateY_1, 10 ) ){
				GLOBAL_LAYERS.rotate( "y", [ parseInt( rotateY_0, 10 ), parseInt( rotateY_1, 10 ) ], "add" );
			}else if( parseInt( rotateY_0, 10 ) == parseInt( rotateY_1, 10 ) ){
				GLOBAL_LAYERS.rotate( "y", [ parseInt( rotateY_0, 10 ), parseInt( rotateY_1, 10 ) ], "remove" );
			}
			if( parseInt( rotateZ_0, 10 ) != parseInt( rotateZ_1, 10 ) ){
				GLOBAL_LAYERS.rotate( "z", [ parseInt( rotateZ_0, 10 ), parseInt( rotateZ_1, 10 ) ], "add" );
			}else if( parseInt( rotateZ_0, 10 ) == parseInt( rotateZ_1, 10 ) ){
				GLOBAL_LAYERS.rotate( "z", [ parseInt( rotateZ_0, 10 ), parseInt( rotateZ_1, 10 ) ], "remove" );
			}

			var skewX_0 = $(EDIT_SETTINGS.skew.x.start).val();
			var skewX_1 = $(EDIT_SETTINGS.skew.x.end).val();
			var skewY_0 = $(EDIT_SETTINGS.skew.y.start).val();
			var skewY_1 = $(EDIT_SETTINGS.skew.y.end).val();

			if( parseInt( skewX_0, 10 ) != parseInt( skewX_0, 10 ) ){
				GLOBAL_LAYERS.skew( "x", [ parseInt( skewX_0, 10 ), parseInt( skewX_0, 10 ) ], "add" );
			}else if( parseInt( skewX_0, 10 ) == parseInt( skewX_0, 10 ) ){
				GLOBAL_LAYERS.skew( "x", [ parseInt( skewX_0, 10 ), parseInt( skewX_0, 10 ) ], "remove" );
			}skewY_1
			if( parseInt( skewY_0, 10 ) != parseInt( skewY_1, 10 ) ){
				GLOBAL_LAYERS.skew( "y", [ parseInt( skewY_0, 10 ), parseInt( skewY_1, 10 ) ], "add" );
			}else if( parseInt( skewY_0, 10 ) == parseInt( skewY_1, 10 ) ){
				GLOBAL_LAYERS.skew( "y", [ parseInt( skewY_0, 10 ), parseInt( skewY_1, 10 ) ], "remove" );
			}

			var opacity_0 = $(EDIT_SETTINGS.opacity.start).val();
			var opacity_1 = $(EDIT_SETTINGS.opacity.end).val();

			if( parseInt( opacity_0, 10 ) != parseInt( opacity_1, 10 ) ){
				GLOBAL_LAYERS.opacity( [ parseInt( opacity_0, 10 ), parseInt( opacity_1, 10 ) ], "add" );
			}else if( parseInt( opacity_0, 10 ) == parseInt( opacity_1, 10 ) ){
				GLOBAL_LAYERS.opacity( [ parseInt( opacity_0, 10 ), parseInt( opacity_1, 10 ) ], "remove" );
			}

			var color_0 = $(EDIT_SETTINGS.color.start).val();
			var color_1 = $(EDIT_SETTINGS.color.end).val();

			if( color_0 != color_1 ){
				GLOBAL_LAYERS.color( [ color_0, color_1 ], "add" );
			}else if( color_0 == color_1 ){
				GLOBAL_LAYERS.color( [ color_0, color_1 ], "remove" );
			}

		$('[enedscroll-visual=""]').remove();
		$('[enedscroll-trigger-trigger=""]').remove();


		var environment = new enedScroll.Environment( globalSettings.windows.environment.dom );
		var trigger = new enedScroll.Trigger( "trigger", 100, environment );

		var Scene = new enedScroll( globalSettings.windows.environment.scene, trigger, { selectors: [0, 0], visual: { show_selectors: true, show_trigger: true } } );

		console.log( Scene );
		Scene.add( globalSettings.windows.environment.item, esB.Layers().getResources() );

		};

		globalSettings.windows.layers.createBtn[0].addEventListener( "click", createLayer );
		globalSettings.windows.layers.trashBtn[0].addEventListener( "click", removeLayer );

		$(globalSettings.windows.edit.saveBtn).on( "click", saveLayer );

		createLayer();

	};

	esBuilder.prototype.loadDefaults = function(){

		var defaults = {};

		defaults.globalDuration = 5;
		defaults.globalOffset = 0;
		defaults.isActive = false;
		defaults.nextLayer = 1;
		defaults.countLayer = 0;

		defaults.windows = {};
			defaults.windows.environment = {};
				defaults.windows.environment.dom = $(".es-builder-stage");
				defaults.windows.environment.scene = $(".es-builder-scenery");
				defaults.windows.environment.item = $('#es-builder-sample_box');

			defaults.windows.layers = {};
				defaults.windows.layers.window = $("#es-edit-timeline");
				defaults.windows.layers.defaultDuration = 1;
				defaults.windows.layers.defaultOffset = 0;
				defaults.windows.layers.noLayer = $('input[name="layer_name"]');
				defaults.windows.layers.duration = $('input[name="layer_duration"]');
				defaults.windows.layers.offset = $('input[name="layer_offset"]');
				defaults.windows.layers.createBtn = $('button[name="layer_create"]');
				defaults.windows.layers.trash = $('select[name="layer_trash"]');
				defaults.windows.layers.trashBtn = $('button[name="layer_remove"]');

			defaults.windows.edit = {
				"noLayer": $('select[name="layer_settings_number"]'),
				"saveBtn": $('#es-builder-layer-settings-save'),
				"translate": {
					"x": {
						"start": $("#translateX-0"),
						"end": $("#translateX-1"),
					},
					"y": {
						"start": $("#translateY-0"),
						"end": $("#translateY-1"),
					},
					"z": {
						"start": $("#translateZ-0"),
						"end": $("#translateZ-1"),
					},
				},
				"scale": {
					"x": {
						"start": $("#scaleX-0"),
						"end": $("#scaleX-1"),
					},
					"y": {
						"start": $("#scaleY-0"),
						"end": $("#scaleY-1"),
					},
					"z": {
						"start": $("#scaleZ-0"),
						"end": $("#scaleZ-1"),
					},
				},
				"rotate": {
					"x": {
						"start": $("#rotateX-0"),
						"end": $("#rotateX-1"),
					},
					"y": {
						"start": $("#rotateY-0"),
						"end": $("#rotateY-1"),
					},
					"z": {
						"start": $("#rotateZ-0"),
						"end": $("#rotateZ-1"),
					},
				},
				"skew": {
					"x": {
						"start": $("#skewX-0"),
						"end": $("#skewX-1"),
					},
					"y": {
						"start": $("#skewY-0"),
						"end": $("#skewY-1"),
					},
				},
				"opacity": {
					"start": $("#opacity-0"),
					"end": $("#opacity-1"),
				},
				"color": {
					"start": $("#color-0"),
					"end": $("#color-1"),
				},
			};

			defaults.windows.timeline = {};
				defaults.windows.timeline.window = $(".es-builder-timeline");
				defaults.windows.timeline.measures = $(".es-builder-timeline-measures");
				defaults.windows.timeline.measureClass = "es-builder-timeline-measure";
				defaults.windows.timeline.trigger = $(".es-builder-timeline-trigger");
				defaults.windows.timeline.layers = $(".es-builder-timeline-layers");
				defaults.windows.timeline.layerClass = "es-builder-timeline-layer";
				defaults.windows.timeline.none = $(".es-builder-timeline-layer-none");

		return defaults;

	};

	esBuilder.prototype.Timeline = function(){

		var esB = this;
		var props = {};

		var globalSettings = esB.globalSettings;
		var timelineSettings = globalSettings.windows.timeline;
		var GLOBAL_LAYERS  = esB.Layers();

		props.scale = function(){

			var timelineWidth = ( parseInt( $( timelineSettings.layers ).width(), 10 ) - 12 ); // Padding lewy 3px + prawy 3px
			var width =  parseFloat( timelineWidth / globalSettings.globalDuration );

			return width;

		};

		props.visibility = function(){

			if( ! globalSettings.isActive ){

				$( timelineSettings.measures ).css( "opacity", "0" );
				$( timelineSettings.trigger ).css( "opacity", "0" );

			}else{
				$( timelineSettings.none ).removeClass("in");

				$( timelineSettings.measures ).css( "opacity", "1" );
				$( timelineSettings.trigger ).css( "opacity", "1" );
			}

		};

		props.visual = function(){

			var _props = {};
			var width = esB.Timeline().scale();

			_props.measures = function(){

				var width = esB.Timeline().scale();

				if( $('[es-builder-measure=""]').length > 0 ){
					$(globalSettings.windows.timeline.measures).find( '[es-builder-measure=""]' ).remove();
				}
				
				for( var m = 0; m < globalSettings.globalDuration; m++ ){

					var element = document.createElement( "div" );
					
					$( element ).addClass( globalSettings.windows.timeline.measureClass );
					$( element ).attr( "es-builder-measure", "" );
					$( element ).addClass( "col" );
					//$( element ).css( "width", width );
					$( element ).html( m + 1 );

					$(element).appendTo( $( globalSettings.windows.timeline.measures ) );
				}

			};

			_props.layers = function(){

				var scale = esB.Timeline().scale();

				if( $('[es-builder-layer=""]').length > 0 ){
					$(globalSettings.windows.timeline.layers).find( '[es-builder-layer=""]' ).remove();
				}
				
				for( var m = 0; m < globalSettings.countLayer; m++ ){
					var layerDurtion = esB.layers[m].duration;
					var layerOffset = esB.layers[m].offset;

					var element = document.createElement( "div" );
					var child = document.createElement( "div" );

					$( element ).attr( "es-builder-layer", "" );
					$( element ).addClass( globalSettings.windows.timeline.layerClass );

					$(child).attr( "role", "child" );

					$(child).css( "width", ( layerDurtion * scale ) );
					$(child).css( "left", ( layerOffset * scale ) );

					$(child).appendTo( $( element ) );
					$(element).appendTo( $( globalSettings.windows.timeline.layers ) );
				}

			};

			return _props;

		};

		return props;

	};

	esBuilder.prototype.Layers = function(){

		var props = {};

		var esB = this;
		var props = {};

		var globalSettings = esB.globalSettings;
		var editSettings = globalSettings.windows.edit;
		var timelineSettings = globalSettings.windows.timeline;

		var LAYERS = esB.layers;

		props.init = function(){

			if( globalSettings.countLayer > 0 ){

				$(editSettings.noLayer).find( 'option[value="null"]' ).remove();

				if( $('[es-builder-edit-option=""]').length > 0 ){
					$(editSettings.noLayer).find( '[es-builder-edit-option=""]' ).remove();
				}

				for( var j = 0; j < globalSettings.countLayer; j++ ){

					var option = document.createElement( "option" );
					
					$(option).attr( "value", ( j + 1 ) );
					$(option).attr( "es-builder-edit-option", "" );
					$(option).html( ( j + 1 ) );

					editSettings.noLayer.append( option );

				}

				editSettings.noLayer.removeAttr( "disabled" );
				editSettings.saveBtn.removeAttr( "disabled" );

			}else{

				if( $(editSettings.noLayer).find( 'option[value="none"]' ).length == 0 ){
					var option = document.createElement( "option" );
					
					$(option).attr( "value", "null" );
					$(option).html( "none" );

					editSettings.noLayer.append( option );
					editSettings.noLayer.attr( "disabled", "disabled" );
					editSettings.saveBtn.attr( "disabled", "disabled" );
				}

			}

		};

		var getStyle = function( b ){

			var c = {};

			var transform = Object.values( b.transform ).filter(v => v != false && typeof v === "string");
			var opacity = ( b.opacity != 0 && typeof b.opacity === "string" ) ? b.opacity : false;
			var color = ( b.color != 0 && typeof b.color === "string" ) ? b.color : false;

			if( transform != "" ){
				c["transform"] = transform.join(" ");
			}

			if( opacity != false ){
				c["opacity"] = opacity;
			}

			if( color != "" ){
				c["color"] = color;
			}

			return c;

		};

		props.getResources = function(){

			var arr = [];

			for( var k = 0; k < globalSettings.countLayer; k++ ){

				var temp = [];
				var duration = LAYERS[k].duration;
				var offset = LAYERS[k].layer_offset;

				temp[0] = getStyle( LAYERS[k].style );
				temp[1] = ( duration > 0 ) ? ( duration / 10 ) : 0;
				temp[2] = ( offset != 0 ) ? ( offset / 10 ) : 0;

				//if( Object.values( temp[0] ).length != 0 ){
					arr.push( temp );
				//}

			}
			return arr;

		};

		props.translate = function( axis, values, action ){
			
			var selectedLayer = parseInt( editSettings.noLayer.val(), 10 );
			var start = values[0];
			var end = values[1];
			var name = "translate" + axis.toUpperCase();

			if( "add" == action ){

				var value = "[" + start + "," + end + "]";
				var full = name + "(" + value + "px)";

				if( typeof LAYERS[ ( selectedLayer - 1 ) ].style.transform[name] === "undefined" ){
					LAYERS[ ( selectedLayer - 1 ) ].style.transform[name] = full;
				}

				LAYERS[ ( selectedLayer - 1 ) ].style.transform[name] = full;

			}

			if( "remove" == action ){
				LAYERS[ ( selectedLayer - 1 ) ].style.transform[name] = false;
			}

		};
		props.scale = function( axis, values, action ){

			var selectedLayer = parseInt( editSettings.noLayer.val(), 10 );
			var start = values[0];
			var end = values[1];
			var name = "scale" + axis.toUpperCase();

			if( "add" == action ){

				var value = "[" + start + "," + end + "]";
				var full = name + "(" + value + ")";

				if( typeof LAYERS[ ( selectedLayer - 1 ) ].style.transform[name] === "undefined" ){
					LAYERS[ ( selectedLayer - 1 ) ].style.transform[name] = full;
				}

				LAYERS[ ( selectedLayer - 1 ) ].style.transform[name] = full;

			}

			if( "remove" == action ){
				LAYERS[ ( selectedLayer - 1 ) ].style.transform[name] = false;
			}

		};
		props.rotate = function( axis, values, action ){

			var selectedLayer = parseInt( editSettings.noLayer.val(), 10 );
			var start = values[0];
			var end = values[1];
			var name = "rotate" + axis.toUpperCase();

			if( "add" == action ){

				var value = "[" + start + "," + end + "]";
				var full = name + "(" + value + "deg)";

				if( typeof LAYERS[ ( selectedLayer - 1 ) ].style.transform[name] === "undefined" ){
					LAYERS[ ( selectedLayer - 1 ) ].style.transform[name] = full;
				}

				LAYERS[ ( selectedLayer - 1 ) ].style.transform[name] = full;

			}

			if( "remove" == action ){
				LAYERS[ ( selectedLayer - 1 ) ].style.transform[name] = false;
			}

		};
		props.skew = function( axis, values, action ){

			var selectedLayer = parseInt( editSettings.noLayer.val(), 10 );
			var start = values[0];
			var end = values[1];
			var name = "skew" + axis.toUpperCase();

			if( "add" == action ){

				var value = "[" + start + "," + end + "]";
				var full = name + "(" + value + "deg)";

				if( typeof LAYERS[ ( selectedLayer - 1 ) ].style.transform[name] === "undefined" ){
					LAYERS[ ( selectedLayer - 1 ) ].style.transform[name] = full;
				}

				LAYERS[ ( selectedLayer - 1 ) ].style.transform[name] = full;

			}

			if( "remove" == action ){
				LAYERS[ ( selectedLayer - 1 ) ].style.transform[name] = false;
			}

		};
		props.opacity = function( values, action ){

			var selectedLayer = parseInt( editSettings.noLayer.val(), 10 );
			var start = values[0];
			var end = values[1];
			var name = "opacity";

			if( "add" == action ){

				var value = "[" + start + "," + end + "]";
				var full = value;

				if( typeof LAYERS[ ( selectedLayer - 1 ) ].style[name] === "undefined" ){
					LAYERS[ ( selectedLayer - 1 ) ].style[name] = full;
				}

				LAYERS[ ( selectedLayer - 1 ) ].style[name] = full;

			}

			if( "remove" == action ){
				LAYERS[ ( selectedLayer - 1 ) ].style[name] = false;
			}

		};

		var getRGB = function( e ){
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
		};

		props.color = function( values, action ){

			var selectedLayer = parseInt( editSettings.noLayer.val(), 10 );
			var name = "color";

			if( "add" == action ){

				var full = getRGB( values );

				if( typeof LAYERS[ ( selectedLayer - 1 ) ].style[name] === "undefined" ){
					LAYERS[ ( selectedLayer - 1 ) ].style[name] = full;
				}

				LAYERS[ ( selectedLayer - 1 ) ].style[name] = full;

			}

			if( "remove" == action ){
				LAYERS[ ( selectedLayer - 1 ) ].style[name] = false;
			}
		};

		return props;

	};

	esBuilder.prototype.loadPlugin = function(){

		$('[enedscroll-visual=""]').remove();
		$('[enedscroll-trigger-trigger=""]').remove();

		var esB = this;
		var globalSettings = esB.globalSettings;

		var environment = new enedScroll.Environment( globalSettings.windows.environment.dom );
		var trigger = new enedScroll.Trigger( "trigger", 100, environment );

		var Scene = new enedScroll( globalSettings.windows.environment.scene, trigger, { selectors: [0, 0], visual: { show_selectors: true, show_trigger: true } } );

		//console.log( Scene );
		Scene.add( globalSettings.windows.environment.item, esB.Layers().getResources() );

	};


	return new esBuilder();


})(jQuery);