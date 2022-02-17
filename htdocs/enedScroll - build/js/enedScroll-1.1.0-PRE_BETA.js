/**
  *	VERSION - v1.1.0-PRE_BETA
  * BUILDING
  * @author Cameolon
 */
 (function( root, factory ){

 	if( typeof define === 'function' && define.amd ){
 		define( ['jquery'], factory );
 	}else if( typeof exports === 'commonJS' ){
 		module.exports = factory( require('jquery') );
 	}else{
 		root.enedScroll = factory( root.jQuery );
 	}

 }(this, function($){

 	var __VERSION__ = '1.1.0-PRE_BETA';

 	var __ = function( item ){

 		var utils = {};

 		var el = ( [ "object", "string", "number", "function" ].indexOf( typeof item ) >= 0 ) ? item : false;


 		utils.throw = function( level ){

 		};

	 	utils.exists = function(){

	 		var name 		= this.isType( 'string', item ) ? item : false;
	 		var byID 		= document.getElementById( name );
	 		var byClass 	= document.getElementsByClassName( name );

	 		return (item && typeof item !== 'undefined' && typeof item !== 'null') ? true : false;
	 	};

	 	utils.getType = function(){
	 		return typeof el;
	 	};

	 	utils.isType = function( types ){

	 		var types 	= ( types && typeof types === 'object' ) ? types : ( typeof types === 'string' ) ? new Array( types ) : false ;
	 		var catched = [];

	 		for( var key in types ){

	 			var type = types[key];

	 			if( utils.getType() === type ){
	 				catched.push( type );
	 			}

	 		}

	 		return ( catched.length > 0 ) ? true : false;
	 	
	 	};

	 	utils.offsetTop = function(){
	 		return ( el && typeof el.offsetTop === 'number' ) ? el.offsetTop : window.pageYOffset;
	 	}

	 	utils.offset = function(){
	 		var offset = { top: 0, left: 0 };

			if( el && el.getBoundingClientRect ){
				var rect = el.getBoundingClientRect();
				offset.top = rect.top;
				offset.left = rect.left;
			}

			return offset;

	 	};

 		utils.convVal = function( client, formatting, type ){

 			var global_client = null;
 			var number = 0;

 			var multiplication = ( ! formatting || formatting === false ) ? 1000 : 1;
 			var division = ( ! formatting || formatting === false ) ? 1 : 1000;

 			if( __(client).isType( "object" ) ){
 				global_client = client;
 			}

 			if( utils.isType( "string" ) ){
 				var verification = el.match(/(%)/g);
 				if( verification !== null && verification && verification.length === 1 ){
 					var percent = parseInt( el, 10 );
 					var clientHeightByOffsets = global_client.offsetBottom - global_client.offsetTop;
 					if( percent > 0 && percent <= 100 ){
 						number = ( ( percent / 100 ) * clientHeightByOffsets ) / division;
 					}else{
 						//throw wrong number
 					}
 				}else if( verification === null ){
 					var myNum = parseInt( el, 10 );
 					if( type === "duration" && myNum >= 1 && myNum <= 100000 ){
 						number = myNum;
 					}else if( type === "offset" && 
	 					( myNum >= 1 && myNum <= 100000 ) ||
	 					( myNum <= -1 && myNum >= -100000 )
	 					){
	 						number = myNum;
	 				}else{
	 					//throw wrong number
	 				}
 				}else{
 					//throw wrong number
 				}
 			}else if( utils.isType( "number" ) ){
 				var myNum = el;
 				if( type === "duration" ){
 					if( myNum >= 0.001 && myNum <= 10 ){
 						number = parseFloat( myNum.toFixed( 3 ) ) * multiplication;
 					}
 				}else if( type === "offset"){
 					if( ( myNum >= 0.001 && myNum <= 10 ) ||
 					( myNum <= -0.001 && myNum >= -10 ) ){
 						number = parseFloat( myNum.toFixed( 3 ) ) * multiplication;
 					}
 				}else{
 					number = 0;
 					//throw wrong number
 				}
 			}else{
 				//throw wrong number
 			}

 			return number;

 		}

 		/**
		  Checks item at an angle correct value

		  #defaults
		    The value must be @value >= 0.001 && @value <= 100
		  #explanation
		    Value is multipled 1000 times to convert time into pixels
 		  */
 		utils.getDuration = function( client, value_formating ){
 			var formating = ( value_formating ) ? true : false;
 			return utils.convVal( client, formating, 'duration' );
 		} 		
 		utils.getOffset = function( client, value_formating ){
 			var formating = ( value_formating ) ? true : false;
 			return utils.convVal( client, formating, 'offset' );
 		}

	 	return utils;

	 };

	var LOAD_EVENT_ON_READY = function(callback){
		
		if( "function" !== typeof callback ){
			//THROW ERROR
			return;
		}

		document.onreadystatechange = function(){
			if( document.readyState === 'interactive' ){
				callback.call();
			}
		}

	};

	var LOAD_EVENT = function(callback){
		
		if( "function" !== typeof callback ){
			//THROW ERROR
			return;
		}

		LOAD_EVENT_ON_READY( callback );
		document.addEventListener( 'scroll', callback );
		document.addEventListener( 'resize', callback );
		//document.addEventListener( 'mousewheel', callback );
		//document.addEventListener( 'DOMmouseScroll', callback );

	};

 	var enedScroll = function( scene, trigger, options ){

 		var CLIENT 		= false;
 		var TRIGGER 	= false;
 		var SELECTORS 	= [0,0];
 		var VISUAL		= {
				show_selectors: false,
				name_selectors:  '',
				color_top_selector:  '#1233d8',
				color_bottom_selector:  '#0cd2c9',
				show_trigger:  false,
				color_trigger:  'orange',
				zIndex_selectors:  '9999',
				zIndex_trigger:  '9999',
				scene_position:  'relative',
 		};

 		if( scene !== false && scene !== null && typeof scene !== "undefined" && __( scene ).isType( ['string', 'object'] ) ){
 			
 			CLIENT = scene;
 		
 		}else{
 			// throw ERROR
 		}

 		if( trigger !== false && trigger !== null && typeof trigger !== "undefined" && __( trigger ).isType( 'object' ) &&
 		    trigger.progress >= 0 &&  trigger.name && trigger.marginTop >= 0 ){

 			TRIGGER = trigger;

 		}else{
 			
 			// Stworzenie podstawowy Trigger jeżeli nie został podany
 			TRIGGER = enedScroll.Trigger( "Trigger", 0 );

 		}

 		if( options.selectors !== false && options.selectors !== null && typeof options.selectors !== "undefined" 
 			&& typeof options.selectors === "object" && options.selectors.length === 2 ){

 			if( options.selectors[0] !== false && options.selectors[0] !== null && typeof options.selectors[0] !== "undefined" && typeof options.selectors[0] === "number" &&
 				options.selectors[1] !== false && options.selectors[1] !== null && typeof options.selectors[1] !== "undefined" && typeof options.selectors[1] === "number" ){
 				SELECTORS = options.selectors;
 			}else{
	 			SELECTORS = [0,0];
	 		}

 		}else{
 			SELECTORS = [0,0];
 		}

 		if( options.visual === false || options.visual === null || typeof options.visual === "undefined" || typeof options.visual !== "object" ){
 			options.visual = {};
 		}
 		
 		this.client 		= this.__client(CLIENT, SELECTORS);
 		this.trigger 		= TRIGGER;
 		this.version 		= __VERSION__;

 		VISUAL 				= $.extend({}, VISUAL, options.visual);
		
		var VISUALISATION_PARENT = null;
		var VISUALISATION_AGENT = null;

 		var visualisation = function(){

 			if( VISUAL.show_selectors === true ){

	 			if( VISUALISATION_PARENT === null && VISUALISATION_AGENT === null ){

	 				VISUALISATION_PARENT = document.createElement( 'div' );
	 				VISUALISATION_AGENT = document.createElement( 'div' );

	 				VISUALISATION_PARENT.style.padding = "0px";
	 				VISUALISATION_PARENT.style.margin = "0px";
	 				VISUALISATION_PARENT.style.position = "absolute";
	 				VISUALISATION_PARENT.style.top = $(CLIENT).offset().top + "px";
	 				VISUALISATION_PARENT.style.left = "0px";
	 				VISUALISATION_PARENT.style.width = $(document).outerWidth() + "px";
	 				VISUALISATION_PARENT.style.height = "100%";

	 				VISUALISATION_AGENT.style.position = "absolute";
	 				VISUALISATION_AGENT.style.top = $(CLIENT).offset().top + "px";
	 				VISUALISATION_AGENT.style.left = "0px";
	 				VISUALISATION_AGENT.style.width = $(document).outerWidth() + "px";
	 				VISUALISATION_AGENT.style.height = "100%";

	 				if( VISUAL.scene_position === "relative" ){
	 					VISUALISATION_AGENT.style.top = "0px";
	 				}

	 				$(VISUALISATION_AGENT).appendTo( $(CLIENT) );

		 				if( $(document).find( $(VISUALISATION_AGENT) ).length > 0 ){
			 				$(VISUALISATION_PARENT).css('height', $(VISUALISATION_AGENT).outerHeight() + 'px');
			 				$(VISUALISATION_PARENT).attr( 'enedScroll-visual', '' );
			 				$(VISUALISATION_PARENT).appendTo( $('body') );
			 			}
	 				

	 			}

	 			var TOP_SELECTOR 		= document.createElement( 'div' );
	 			var TOP_SELECTOR_NAME	= document.createElement( 'span' );
	 			var BOTTOM_SELECTOR 	= document.createElement( 'div' );
	 			var BOTTOM_SELECTOR_NAME	= document.createElement( 'span' );

	 			$(TOP_SELECTOR_NAME).html('Top ' + VISUAL.name_selectors );
	 			$(BOTTOM_SELECTOR_NAME).html('Bottom ' + VISUAL.name_selectors );

	 			// TOP
	 			TOP_SELECTOR_NAME.style.display = "block";
	 			TOP_SELECTOR_NAME.style.width = "100%";
	 			TOP_SELECTOR_NAME.style.textAlign = "right";
	 			TOP_SELECTOR_NAME.style.borderBottom = "1px solid " + VISUAL.color_top_selector;
	 			TOP_SELECTOR_NAME.style.color = VISUAL.color_top_selector;
	 			TOP_SELECTOR_NAME.style.position = "absolute";
	 			TOP_SELECTOR_NAME.style.bottom = ( 0 - $(TOP_SELECTOR_NAME).outerHeight() ) + 'px';

	 			// BOTTOM
	 			BOTTOM_SELECTOR_NAME.style.display = "block";
	 			BOTTOM_SELECTOR_NAME.style.width = "100%";
	 			BOTTOM_SELECTOR_NAME.style.textAlign = "right";
	 			BOTTOM_SELECTOR_NAME.style.borderTop = "1px solid " + VISUAL.color_bottom_selector;
	 			BOTTOM_SELECTOR_NAME.style.color = VISUAL.color_bottom_selector;
	 			BOTTOM_SELECTOR_NAME.style.position = "absolute";
	 			BOTTOM_SELECTOR_NAME.style.top = ( 0 - $(BOTTOM_SELECTOR_NAME).outerHeight() ) + 'px';

	 			$(TOP_SELECTOR_NAME).appendTo( TOP_SELECTOR );
	 			$(BOTTOM_SELECTOR_NAME).appendTo( BOTTOM_SELECTOR );

	 			TOP_SELECTOR.style.display = "block";
	 			TOP_SELECTOR.style.position = "absolute";
	 			TOP_SELECTOR.style.width = "100%";
	 			TOP_SELECTOR.style.top = ( 0 + SELECTORS[0] ) + 'px';
	 			TOP_SELECTOR.style.zIndex = VISUAL.zIndex_selectors;

	 			BOTTOM_SELECTOR.style.display = "block";
	 			BOTTOM_SELECTOR.style.position = "absolute";
	 			BOTTOM_SELECTOR.style.width = "100%";
	 			BOTTOM_SELECTOR.style.bottom = ( 0 + SELECTORS[1] ) + 'px';
	 			BOTTOM_SELECTOR.style.zIndex = VISUAL.zIndex_selectors;
	 			
	 			$(TOP_SELECTOR).appendTo( VISUALISATION_PARENT );
	 			$(BOTTOM_SELECTOR).appendTo( VISUALISATION_PARENT );

	 			$(VISUALISATION_AGENT).remove();

 			}

 			var TRIGGER_VISUAL = null;
 			var TRIGGER_VISUAL_NAME = null;

 			if( VISUAL.show_trigger === true ){
 				if( TRIGGER_VISUAL === null ){

	 				var TRIGGER_VISUAL  = document.createElement( 'div' );
	 				var TRIGGER_VISUAL_NAME  = document.createElement( 'span' );

	 				TRIGGER_VISUAL.style.position = "fixed";
	 				TRIGGER_VISUAL.style.top = TRIGGER.marginTop + 'px';
	 				TRIGGER_VISUAL.style.right = "0px";
	 				TRIGGER_VISUAL.style.minWidth = "65px";
	 				TRIGGER_VISUAL.style.zIndex = VISUAL.zIndex_trigger;

	 				$(TRIGGER_VISUAL_NAME).html( TRIGGER.name );

	 				TRIGGER_VISUAL_NAME.style.width = "100%";
	 				TRIGGER_VISUAL_NAME.style.borderBottom = '1px solid ' + VISUAL.color_trigger;
	 				TRIGGER_VISUAL_NAME.style.color = VISUAL.color_trigger;
	 				TRIGGER_VISUAL_NAME.style.fontSize = "11px";
	 				TRIGGER_VISUAL_NAME.style.position = "absolute";
	 				TRIGGER_VISUAL_NAME.style.top = "0px";

	 				if( TRIGGER.marginTop < 14 ){
	 					TRIGGER_VISUAL_NAME.style.borderBottom = null;
	 					TRIGGER_VISUAL_NAME.style.borderTop = '1px solid ' + VISUAL.color_trigger;
	 				}

	 				$(TRIGGER_VISUAL).attr( 'enedScroll-Trigger-' + TRIGGER.name, '' );

	 				$(TRIGGER_VISUAL_NAME).appendTo( TRIGGER_VISUAL );
	 				$(TRIGGER_VISUAL).appendTo( $('body') );

 				}
 			}



 		}

 		$(document).ready(function(){
 			visualisation();
 		});

 		this.register_of_vars = {};
 		this.register_of_private_vars = {};

 		//this.__abstract( 0.1, 1 );
 		//this.__abstract( '200', 1 );
 		//this.__abstract( '100%', 1 );

 	};

 	enedScroll.Trigger = function( name, options ){

 		var PROPERTIES = {};

 		PROPERTIES.name 		= __(name).isType("string") ? name : null;
 		PROPERTIES.marginTop 	= ( options && __(options).isType( [ "number", "string" ] ) ) ? parseInt( options, 10 ) : 0;
 		PROPERTIES.progress 	= __(window).offsetTop() + PROPERTIES.marginTop;

 		LOAD_EVENT(function(){
 			PROPERTIES.progress 	= __(window).offsetTop() + PROPERTIES.marginTop;
 		});
 			
 		return PROPERTIES;
 		
 	};

 	enedScroll.prototype.__client = function( client, selectors ){

 		var $self = this;
 		var PROPERTIES = {};

 		var offsetTop = function(){
 			return $(client).offset().top + selectors[0];
 		}

 		var height = function(){
 			return $(client).outerHeight();
 		}

 		var offsetBottom = function(){
 			return $(client).offset().top + height() - selectors[1];
 		} 

 		var offset = function(){

 			var top 	= offsetTop() - $self.trigger.progress;
 			var bottom 	= offsetBottom() - $self.trigger.progress;

 			return [top, bottom];
 		} 

 		var progress = function(){
 			var val = ( - offset()[0] / ( offset()[1] - offset()[0] ) );
 			return ( val < 0.00001 ) ? 0 : ( val > 1 ) ? 1 : val;
 		} 
 		
 		PROPERTIES.object = $(client);
 		PROPERTIES.offsetTop = offsetTop();
 		PROPERTIES.offsetBottom = offsetBottom();
 		PROPERTIES.height = height();
 		//PROPERTIES.progress = progress();

 		// LOAD_EVENT(function(){
 		// 	$('.a').css( { 'opacity': ( 1 * progress() ) } );
 		// });

 		return PROPERTIES;

 	}

 	//int
 	//string
 	//percentage
 	enedScroll.prototype.__abstract = function( duration, o ){
 		
 		var $self 		= this;
 		var PROPERTIES 	= {};

 		var getOffset = function(){
 			var offset = ( o && __(o).isType( [ "number", "string" ] ) ) ? __( o ).getOffset( $self.client ) : 0;
 			return offset;
 		};

 		var offsetTop = function(){
 			return $self.client.offsetTop + getOffset();
 		};

 		var offset = function(){

 			var top = offsetTop() - $self.trigger.progress;

 			return [top];
 		};

 		var progress = function(){
 			var val = ( - offset()[0] / __( duration ).getDuration( $self.client ) );
 			return ( val < 0.0001 ) ? 0 : ( val > 1 ) ? 1 : val;
 		}

 		var state = function(){
 			var state = null;
 			
 			if( progress() <= 0 ){
 				state = "BEFORE";
 			}else if( progress() > 0 && progress() < 99.99999 ){
 				state = "DURING";
 			}
 			if( progress() >= 1 ){
 				state = "AFTER";
 			}

 			return state;
 		}



 		PROPERTIES.progress = progress();
 		PROPERTIES.state 	= state();

		LOAD_EVENT(function(){
 			PROPERTIES.progress = progress();
 			PROPERTIES.state 	= state();
 		});

 		return PROPERTIES;	

 	};

 	enedScroll.prototype.repeat = function( creations, repeat, linear ){

 		var linear = ( linear || typeof linear === "undefined" || linear === null ) ? true : false; 
 		var repeat_array = [];

 		

 			var layers = [];
 			
 			layers['IN_COLLECTION'] = [];
 			layers['OUT_COLLECTION'] = [];

 			for( var creation_key in creations ){

 				var creation = creations[creation_key];
 				var creation_style = creations[creation_key][0];
 				var creation_duration = ( creations[creation_key][1] && creations[creation_key][1][0] ) ? creations[creation_key][1][0] : 0;
 				var creation_offset = (  creations[creation_key][1] && creations[creation_key][1][1] ) ? creations[creation_key][1][1] : 0;
 				
 				var creation_name = (  creations[creation_key][3] && typeof creations[creation_key][3] === "string" ) ? creations[creation_key][3] : false;

 				var creation_duration_transition = ( creations[creation_key][2] && creations[creation_key][2][0] ) ? creations[creation_key][2][0] : 0;
 				var creation_offset_transition = ( creations[creation_key][2] && creations[creation_key][2][1] ) ? creations[creation_key][2][1] : 0;
 				
 				if( creations[creation_key][2] === null || typeof creations[creation_key][2] === "undefined" ){
 					creation_duration_transition = creation_duration;
 					creation_offset_transition = creation_offset;
 				}

 				layers['IN_COLLECTION'][creation_key] = [];
 				layers['OUT_COLLECTION'][creation_key] = [];

 				layers['IN_COLLECTION'][creation_key][0] = {};
 				layers['IN_COLLECTION'][creation_key][1] = creation_duration;
 				layers['IN_COLLECTION'][creation_key][2] = creation_offset;
 				layers['IN_COLLECTION'][creation_key][3] = creation_name;
 				layers['IN_COLLECTION'][creation_key][6] = true;

 				layers['OUT_COLLECTION'][creation_key][0] = {};
 				layers['OUT_COLLECTION'][creation_key][1] = creation_duration_transition;
 				layers['OUT_COLLECTION'][creation_key][2] = creation_offset_transition;
 				layers['OUT_COLLECTION'][creation_key][3] = creation_name;
 				layers['OUT_COLLECTION'][creation_key][6] = true;

 				$.each( creation_style, function( style_name, style_props ){

 					var matches = style_props.match(/(-?[0-9]+(\.[0-9]+)?,-?[0-9]+(\.[0-9]+)?)+/g);

 					if( matches !== null ){
 						var style_props_prop_out = false;
 						for( var style_props_value_key in matches ){
 							
 							var style_props_value = matches[style_props_value_key];
 							var separate = style_props_value.split(',');

 							var replacment = ( ! style_props_prop_out ) ? style_props : style_props_prop_out;

 							var template_reg_in = new RegExp('\\[' + style_props_value + '\\]', 'g');
 							var template_reg_out = new RegExp('\\[' + separate[1] + ',' + separate[0] + '\\]', 'g');

 							layers['IN_COLLECTION'][creation_key][0][style_name] = style_props;

 							if( linear ){
	 							var value_out = replacment.replace( template_reg_in, '[' + separate[1] + ',' + separate[0] + ']' );
	 							
	 							if( parseInt( style_props_value_key, 10 ) === ( parseInt( matches.length, 10) - 1 ) ){
	 								layers['OUT_COLLECTION'][creation_key][0][style_name] = value_out;
	 							}
	 						}

 							style_props_prop_out = value_out;
 						}
 					}
 				
 				}); // each

 			} // for

 		if( linear ){

 			var to_up = true;
 			var to_down = false;

 			for( var num_repeat = 0; num_repeat < repeat; num_repeat++ ){

 				if( to_up && ! to_down ){
	 				for( var t = 0; t <= ( layers['IN_COLLECTION'].length - 1 ); t++ ){

	 					repeat_array.push( layers['IN_COLLECTION'][t] );

	 					if( t === ( layers['IN_COLLECTION'].length - 1 ) ){
	 						top_up = false;
	 						to_down = true;
	 						num_repeat--;
	 					}
	 				}
	 			} else if( ! top_up && to_down ) {
	 				for( var t =  layers['OUT_COLLECTION'].length - 1; t >= 0; t-- ){

	 					repeat_array.push( layers['OUT_COLLECTION'][t] );

	 					if( t === 0 ){
	 						top_up = true;
	 						to_down = false;
	 					}
	 				}
	 			}
 			} // for

 		} // STWORZENIE TABLICY DLA POWTÓRZEŃ Z PRZEJŚCIAMI ( A, B, C, C, B, A )

 		if( ! linear ){

 			for( var num_repeat = 0; num_repeat < repeat; num_repeat++ ){
 				for( var t = 0; t <= ( layers['IN_COLLECTION'].length - 1 ); t++ ){
	 				repeat_array.push( layers['IN_COLLECTION'][t] );
	 			}
 			}

 		} // STWORZENIE TABLICY DLA POWTÓRZEŃ BEZ PRZEJŚĆ ( A, B, C, A, B, C )

 		return repeat_array;


 	}; // replay

 	enedScroll.prototype.privateVar = function( name, value ){
 		
 		var vars = this.register_of_private_vars;
 		var name = name + '-private';
 		// DODAWANIE WARTOŚCI

 		if( name && value  ){
 			if( typeof name === "string" && __(value).isType([ "object", "number", "string" ]) ){
 				vars[ name ] = value;
 			}
 		}


 		// ODCZYTYWANIE WARTOŚCI

 		if( name ){
 			if( typeof name === "string" && vars[ name ] ){
 				return vars[ name ];
 			}
 		}

 	}

 	enedScroll.prototype.var = function( name, value ){

 		var vars = this.register_of_vars;
 		// DODAWANIE WARTOŚCI

 		if( name && value  ){
 			if( typeof name === "string" && __(value).isType([ "object", "number", "string" ]) ){
 				vars[ name ] = value;
 			}
 		}


 		// ODCZYTYWANIE WARTOŚCI

 		if( name ){
 			if( typeof name === "string" && vars[ name ] ){
 				return vars[ name ];
 			}
 		}

 	};

 	enedScroll.prototype.fromTop = function( layer, include ){

 		if( typeof layer === "object" && layer ){

 			var layer_style = layer[0];
 			var layer_duration = ( layer[1] ) ? layer[1] : 0;
 			var layer_offset = ( layer[2] ) ? layer[2] : 0;
 			var layer_name = ( layer[3] ) ? layer[3] : false;

 			if( ! layer_name ){
 				layer[3] = false;
 			}
 			
 			// SET VALUE TO READ OFFSET FROM TOP
 			layer[4] = true;

 			// SET INCLUDING OFFSET AND DURATION TO GLOBAL LAYERS OFFSET
 			if( include || typeof include === "undefined" || include === null ){
 				layer[5] = true;
 			}else if( include === false ){
 				layer[5] = false;
 			}

 		}

 		return layer;

 	}

 	enedScroll.prototype.add = function( element, creations, delay ){

 		var $self = this;

 		var item_global_delay = 0;
 		var item_delay = ( delay && __(delay).isType(["number", "string"]) ) ? delay : 0;


 		var progressValue = function( value, progress ){
			var start 	= parseFloat( value[0], 10 ),
				end 	= parseFloat( value[1], 10 ),
				result 	= 0;

				if(start === 0 && end > 0){
					result = (0 + ( end * progress ));
				}
				if( start === 0 && end < 0){
					result = (0 + ( end * progress ));
				}

				if( end === 0 && start > 0){
					result = (start - ( start * progress ));
				}
				if( end === 0 && start < 0){
					result = (start - ( start * progress ));
				}

				if( start > 0 && end > 0 && start < end ){
					result = (start + ( (end - start) * progress ));
				}
				if( start > 0 && end > 0 && start > end ){
					result = (start - ( (start - end) * progress ));
				}

				if( start < 0 && end < 0 && start > end ){
					result = (start + ( (end - start) * progress ));
				}
				if( start < 0 && end < 0 && start < end ){
					result = (start - ( (start - end) * progress ));
				}

				if( start < 0 && end > 0 ){
					result = (start + ( (end - start) * progress ));
				}
				if( start > 0 && end < 0 ){
					result = (start - ( (start - end) * progress ));
				}

				return result;
 		}

 	  $.each( $(element), function( itemKey, self ){
 	  	
 		var item = self;
 		var item_style = {
 			exists: {}, values: {}, template: {}
 		};

 		var layers = {}; 
 		var layersLength = 0;
 		var layers_global_offset = 0;

 	  		var com = ( typeof item_delay === "string" ) ? item_delay.match(/\+|\-/g) : null;
 	  		var value = parseFloat( item_delay ) * itemKey;

 	  		if( typeof item_delay === "string" && com !== null && com.length > 0 && typeof com !== "undefined" ){
 	  			if( com[0] === "+" || com[0] === "-" ){
 	  				item_global_delay = __( value ).getOffset( $self.client, true );
 	  			}
 	  		}

 	  		if( com === null && typeof value === "number" ){
 	  			item_global_delay = value;
 	  		}

 	  	layers_global_offset += item_global_delay;

 		for( var x = 0; x < creations.length; x++ ){

 			var creation_style 				= ( creations[x][0] && typeof creations[x][0] === "object" ) ? creations[x][0] : {};
 			var creation_duration 			= ( creations[x][1] ) ? creations[x][1] : 0;
 			var creation_offset 			= ( creations[x][2] ) ? creations[x][2] : 0;
 			var creation_name	 			= ( creations[x][3] && typeof creations[x][3] === "string" ) ? creations[x][3] : false;
 			var creation_fromTop 			= ( creations[x][4] === false || typeof creations[x][4] === "undefined" || creations[x][4] === null ) ? false : true;
 			var creation_includeToGlobals 	= ( creations[x][5] || typeof creations[x][5] === "undefined" || creations[x][5] === null ) ? true : false;
 			
 			var creation_from_repeater 		= ( creations[x][6] && creations[x][6] === true ) ? true : false;

 			var _real_duration 	= ( creations[x][1] ) ? __( creations[x][1] ).getDuration( $self.client, true ) : 0;
 			var _real_offset 	= ( creations[x][2] ) ? __( creations[x][2] ).getOffset( $self.client, true ) : 0;

 			var layer_offset = 0;

 			//console.log( '1:' + creation_duration + ' 2:' + creation_offset + ' 3:' + creation_name + ' 4:' + creation_fromTop + ' 5:' + creation_includeToGlobals);

 			//_filter_var( " @my_num + 5 " );

 			if( creation_includeToGlobals || creation_includeToGlobals === true ){
 				layers_global_offset += _real_offset;
 			}

 			if( ! creation_fromTop || creation_fromTop === false ){
 				layer_offset = layers_global_offset;
 			}else if( creation_fromTop || creation_fromTop === true ){
 				layer_offset = _real_offset;
 			}

 			layers[x] = {};
 			layers[x]["LAYER_DURATION"] = _real_duration;
 			layers[x]["LAYER_OFFSET"] = layer_offset;
 			layers[x]["LAYER_ABSTRACT"] = $self.__abstract( _real_duration, layer_offset );
 			layers[x]["LAYER_STYLE"] = {};

 			if( creation_name ){
 				
 				var CREATION_VAR_PROPERTIES = {
 					duration: creation_duration,
 					real_duration: _real_duration,
 					offset: creation_offset,
 					real_offset: layer_offset,
 					offset_done: ( layer_offset + _real_duration ),
 				};

 				if( creation_from_repeater ){
 					creation_name = creation_name + '-' + (x + 1);
 				}

 				$self.var( creation_name, CREATION_VAR_PROPERTIES ); 
 				$self.privateVar( creation_name, layers[x]["LAYER_ABSTRACT"] ); 
 			}

 			$.each( creations[x][0], function( cssType, value ) {

 				layers[x]["LAYER_STYLE"][cssType] = {
 					template: value,
 					tmp: [],
 					values: [],
 					conflict: {
 						before: false,
 						after: false
 					}
 				};

 				var matches = value.match(/(-?[0-9]+(\.[0-9]+)?,-?[0-9]+(\.[0-9]+)?)+/g);
 				//var abc = value.match(/(\[[0-9]+,[0-9]+\])+/g).join("|");

 				var multiValue = false;

 				for( var j in matches ){


 					var each 	= matches[j].split(',');
 					var reg = new RegExp('\\[' + matches[j] + '\\]', 'g');


 					layers[x]["LAYER_STYLE"][cssType]["values"].push( matches[j] );

					var target = ( ! multiValue ) ? value : multiValue;
		 			var rep = target.replace( reg, each[0] );

		 			if( matches.length > 1 ){
		 				multiValue = rep;
		 			}

		 			if( parseInt( j, 10 ) === ( matches.length - 1 ) ){
		 				
		 				var split = rep.split(' ');

		 				for( var df in split ){

		 					var eachRep = split[df];
		 					var is_propName = eachRep.match( /^[a-zA-Z]+/g );
		 					var propName = ( is_propName ) ? is_propName[0] : df;

		 					if( layers[x]["LAYER_STYLE"][cssType]["tmp"].indexOf(propName) <= -1 ){
		 						layers[x]["LAYER_STYLE"][cssType]["tmp"].push(propName);
		 					}
		 					
							if( ! item_style['exists'][cssType] ){
 								item_style['exists'][cssType] = [];
 								item_style['values'][cssType] = {};
 							}

							if( 
 								item_style['exists'][cssType].indexOf(propName) <= -1
 							){
 								
								item_style['exists'][cssType].push( propName );
								item_style['values'][cssType][propName] = eachRep;

								if( Object.keys( item_style['values'][cssType] ).length > 1 ){
									var template = $.map( item_style['values'][cssType], function( a, b){
										return a;
									});

									item_style['template'][cssType] = template.join(' ');
								}else{
									item_style['template'][cssType] = item_style['values'][cssType][propName];
								}

 								
 							}
		 				
		 				} // for


		 			
		 			} // 


 					/** OLD CODE
	 				if( ! itemStyle[cssType] ){

	 					var target = ( ! multiValue ) ? value : multiValue;
	 					var rep = target.replace( reg, each[0] );

	 					if( matches.length > 1 ){
	 						multiValue = rep;
	 					}

	 					if( parseInt( j, 10 ) === ( matches.length - 1 ) ){
	 						itemStyle[cssType] = rep;
	 					}

	 				}
	 				*/

 				}
 			
 			});

 			if( creation_includeToGlobals || creation_includeToGlobals === true ){
 				layers_global_offset += _real_duration;
 			}
 			layersLength += 1;

 		}

 		for( layer_key in layers ){

 			var toLower = layer_key;
 			var toUpper = layer_key;

 			while( toLower > 0 ){
 				var check_num_lower = toLower - 1;
 			

 				$.each( creations[layer_key][0], function( cssType, value ) {

	 				if( layers[layer_key]["LAYER_STYLE"][cssType]["conflict"]["before"] !== false ){
	 					return;
	 				}

					var split = value.split(' ');

		 			for( var df in split ){

		 				var eachRep = split[df];
		 				var is_propName = eachRep.match( /^[a-zA-Z]+/g );
		 				var propName = ( is_propName ) ? is_propName[0] : df;
		 				
		 				if( layers[check_num_lower]["LAYER_STYLE"][cssType] && layers[check_num_lower]["LAYER_STYLE"][cssType]["tmp"].indexOf(propName) >= 0 ){
		 					layers[layer_key]["LAYER_STYLE"][cssType]["conflict"]["before"] = check_num_lower;
		 				}
		 					
		 				
		 			} // for

	 			});

 				toLower--;
 			} // while

 			while( toUpper < ( layersLength - 1 ) ){
				var check_num_upper = parseInt( toUpper, 10 ) + 1;

 				$.each( creations[layer_key][0], function( cssType, value ) {

	 				if( layers[layer_key]["LAYER_STYLE"][cssType]["conflict"]["after"] !== false ){
	 					return;
	 				}

					var split = value.split(' ');

		 			for( var df in split ){

		 				var eachRep = split[df];
		 				var is_propName = eachRep.match( /^[a-zA-Z]+/g );
		 				var propName = ( is_propName ) ? is_propName[0] : df;
		 				
		 				if( layers[check_num_upper]["LAYER_STYLE"][cssType] && layers[check_num_upper]["LAYER_STYLE"][cssType]["tmp"].indexOf(propName) >= 0 ){
		 					layers[layer_key]["LAYER_STYLE"][cssType]["conflict"]["after"] = check_num_upper;
		 				}
		 					
		 				
		 			} // for

 				});

 				toUpper++;
	 		} // while

 		}


 		// console.log( layers );

 		// console.log( item_style );
 		
 		$( item ).css( item_style['template'] );


 		LOAD_EVENT(function(){
 			for( var zx in layers  ){

 				var isFirstLayer = ( ( parseInt( zx, 10 ) - 1 ) < 0 ) ? true : false;
 				var isLastLayer = ( ( parseInt( zx, 10 ) ) === ( layersLength - 1 ) ) ? true : false;

 				$.each(layers[zx]["LAYER_STYLE"], function( type, props ){
 					
 					var conflict_before = props["conflict"]["before"];
 					var conflict_after = props["conflict"]["after"];

 					var setStatic = function( valueKey ){
  						var multiRep = false;
 							
 						for( var kh in props.values ){

							var target = ( ! multiRep ) ? props.template : multiRep;
							var first = props.values[kh].split(',')[valueKey];
							var regex = new RegExp( '\\[' + props.values[kh] + '\\]', 'g' );
							var ready = target.replace( regex, first );

							if( props.values.length > 1 ){
								multiRep = ready;
							}

							if( parseInt( kh, 10 ) === ( props.values.length  - 1 )){


							//	itemStyle[type] = ready;

								
						//console.log( ready );
		 				var split = ready.split(' ');

		 				//console.log( split );

		 				for( var vc in split ){

		 					var eachRep = split[vc];
		 					var is_propName = eachRep.match( /^[a-zA-Z]+/g );
		 					var propName = ( is_propName ) ? is_propName[0] : vc;
		 					
							if( ! item_style['exists'][type] ){
 								item_style['exists'][type] = [];
 								item_style['values'][type] = {};
 							}

							if( 
 								item_style['exists'][type].indexOf(propName) <= -1
 							){
 								
								item_style['exists'][type].push( propName );
 								
 							}

 								item_style['values'][type][propName] = eachRep;

								if( Object.keys( item_style['values'][type] ).length > 1 ){
									var template = $.map( item_style['values'][type], function( a, b){
										return a;
									});

									item_style['template'][type] = template.join(' ');
								}else{
									item_style['template'][type] = item_style['values'][type][propName];
								}

 							
		 				
		 				} // for



							}

 						}
 					}



 						if( 
 							( isFirstLayer && layers[parseInt( zx, 10 )]["LAYER_ABSTRACT"].state === "BEFORE" ) || 
 							( conflict_before !== false && layers[conflict_before]["LAYER_ABSTRACT"].state === "AFTER" && layers[zx]["LAYER_ABSTRACT"].state === "BEFORE" ) ||
 							( parseInt( zx, 10 ) > 0 && conflict_before === false && layers[parseInt( zx, 10 )]["LAYER_ABSTRACT"].state === "BEFORE" )
 						){ 
 							setStatic(0);
 						} 						

 						// if( 
 						// 	( isLastLayer && layers[parseInt( zx, 10 )]["LAYER_ABSTRACT"].state === "AFTER" ) ||
 						// 	( conflict_after !== false && layers[conflict_after]["LAYER_ABSTRACT"].state === "BEFORE" && layers[zx]["LAYER_ABSTRACT"].state === "AFTER" ) ||
 						// 	( parseInt( zx, 10 ) < ( layersLength - 1 ) && conflict_after === false && layers[parseInt( zx, 10 )]["LAYER_ABSTRACT"].state === "AFTER" )
 						// ){ 

 						if(layers[parseInt( zx, 10 )]["LAYER_ABSTRACT"].state === "AFTER"){ 
 							setStatic(1);
 						}

 						if( layers[parseInt( zx, 10 )]["LAYER_ABSTRACT"].state === "DURING" ){
	  						var multiRep = false;
	 							
	 						for( var kh in props.values ){

								var target = ( ! multiRep ) ? props.template : multiRep;
								var needAdd = false;

								var values = props.values[kh].split(',');
								var regex = new RegExp( '\\[' + props.values[kh] + '\\]', 'g' );
								var setProgress = progressValue( values, layers[parseInt( zx, 10 )]["LAYER_ABSTRACT"].progress );
							
								var is_propName = props.template.match( /^[a-zA-Z]+/g );
		 						var propName = ( is_propName ) ? is_propName[0] : vc;

								var progress = ( [ "rgba", "rgb" ].indexOf( propName ) >= 0 ) ? Math.floor( setProgress ) : setProgress;

								var ready = target.replace( regex, progress );

								if( props.values.length > 1 ){
									multiRep = ready;
								}

								if( parseInt( kh, 10 ) === ( props.values.length  - 1 )){
									
									//itemStyle[type] = ready;

									var split = ready.split(' ');

					 				for( var vc in split ){

					 					var eachRep = split[vc];
					 					var is_propName = eachRep.match( /^[a-zA-Z]+/g );
					 					var propName = ( is_propName ) ? is_propName[0] : vc;

			 								item_style['values'][type][propName] = eachRep;

											if( Object.keys( item_style['values'][type] ).length > 1 ){
												var template = $.map( item_style['values'][type], function( a, b){
													return a;
												});

												item_style['template'][type] = template.join(' ');
											}else{
												item_style['template'][type] = item_style['values'][type][propName];
											}

			 							
					 				
					 				} // for

								}

	 						}
 						}
 				
 				});

 			}

 			$( item ).css( item_style['template'] );
 		});

		});

		return $self;
 	}; // add

 	enedScroll.prototype.pin = function( element, timeline ){

 		var $self 		= this;
 		var pintable 	= [];

 		var initialize = function(){

 			makeTable();
 			setPin();

 		};

 		var createParent = function( parent_height, parent_padding ){

			var stamp = 'enedscroll-pin';
			var className = 'enedscroll-pin-coordinator';

			var Parent = document.createElement( 'div' );

			// currentParentHeight = (currentParentHeight - item.duration);

			Parent.className = className;
			Parent.style.width = $(element).outerWidth() + 'px';
			Parent.style.position = 'relative';
			Parent.style.display = 'inline-block';
			Parent.style.paddingTop = '0px';
			Parent.style.paddingBottom = parent_padding + 'px';
			Parent.style.minHeight = parent_height + 'px';
			Parent.style.height = 'auto';

			$(Parent).attr( 'enedscroll-pin-parent', '' );

			return Parent;

			// controller.pins[key].parent.item = Parent;
			// controller.pins[key].parent.height = ( (parentHeight - item.duration) + $(controller.target).outerHeight() );

			// pinParents[key] = {};
			// pinParents[key].item = Parent;
			// pinParents[key].height = ( (parentHeight - item.duration) + $(controller.target).outerHeight() );

			// if( !item.hasBefore && key == 0 ){
			// 	$(Parent).insertBefore(controller.target);
			// 	$(controller.target).appendTo(Parent);
			// }else{
			// 	$(Parent).appendTo(controller.pins[key - 1].parent.item);
			// 	$(controller.target).appendTo(Parent);
			// }
					
 		
 		};

 		var setIntoParent = function(){

 			for( var pin_key = ( pintable.length - 1 ) ; pin_key >= 0; pin_key-- ){

	 			if( ! pintable[pin_key].PIN_HAS_AFTER_ITEM || 
	 				pintable[pin_key].PIN_HAS_AFTER_ITEM === false ||
	 				pintable[pin_key].PIN_IS_LAST || 
	 				pintable[pin_key].PIN_IS_LAST === true
	 			){
	 				$( pintable[pin_key]["PIN_PARENT"] ).insertBefore( element );
	 				$( element ).appendTo( pintable[pin_key]["PIN_PARENT"] );
	 				
	 				pintable[pin_key]["PIN_TARGET"] = $(element);
	 			} else {
	 				$( pintable[pin_key]["PIN_PARENT"] ).insertBefore( pintable[ pin_key + 1 ]["PIN_PARENT"] );
	 				$( pintable[ pin_key + 1 ]["PIN_PARENT"] ).appendTo( pintable[pin_key]["PIN_PARENT"] );

	 				pintable[pin_key]["PIN_TARGET"] = $( pintable[ pin_key + 1 ]["PIN_PARENT"] );
	 			}
	 		}

 		};

 		var getTimeline = function(){

 		}

 		var makeTable = function(){

 			var pins_global_height = 0;
 			var pins_global_offset = 0;

 			var pins_abstracts = [];
 			var pins_parents = [];

 			var x = 0;
 			for( var key = ( timeline.length - 1 ) ; key >= 0; key-- ){

 				var duration = ( timeline[key][0] ) ? __( timeline[x][0] ).getDuration( $self.client ) : 0;

 				var PIN_IS_LAST = ( parseInt( key, 10 ) === ( timeline.length - 1 ) ) ? true : false;
 				
 				var PIN_REAL_DURATION = __( timeline[key][0] ).getDuration( $self.client );

 				if( PIN_IS_LAST ){
 					//pins_global_height = parseInt( $(element).outerHeight(), 10 ) + parseInt( $(element).css("margin-top"), 10 ) + parseInt( $(element).css("margin-bottom"), 10 );
 					pins_global_height = parseInt( $(element).outerHeight(), 10 );
 				}

 				//console.log( pins_global_height );
 				pins_parents[x] = createParent( pins_global_height, PIN_REAL_DURATION );

 				// console.log( PIN_REAL_DURATION );
 				//console.log( pins_global_height + ' : ' + PIN_REAL_DURATION );

 				pins_global_height += PIN_REAL_DURATION;
 				x++;
 			
 			}

 			var pin_parent_def_key = ( pins_parents.length - 1 );

 			if( timeline && typeof timeline === "object" && timeline.length > 0 ){
 				
 				for( var key in timeline ){

 					var duration = ( timeline[key][0] ) ? __( timeline[key][0] ).getDuration( $self.client, true ) : 0;
 					var offset = ( timeline[key][1] ) ? __( timeline[key][1] ).getOffset( $self.client, true ) : 0;

 					var PIN_IS_FIRST = ( parseInt( key, 10 ) === 0 ) ? true : false;
 					var PIN_IS_LAST = ( parseInt( key, 10 ) === ( timeline.length - 1 ) ) ? true : false;

 					pins_global_offset += offset;

 					var global_offset = parseFloat( pins_global_offset );

 					if( PIN_IS_FIRST ){
 						pins_global_height = parseInt( $(element).outerHeight(), 10 ) + parseInt( $(element).css("margin-top"), 10 ) + parseInt( $(element).css("margin-bottom"), 10 );
 					}

 					pintable[key] = {};

 					pintable[key]["PIN_ABSTRACT"] = $self.__abstract( duration, global_offset );
 					pintable[key]["PIN_HAS_BEFORE_ITEM"] = ( timeline[ parseInt( key, 10 ) - 1 ] ) ? true : false;
 					pintable[key]["PIN_HAS_AFTER_ITEM"] = ( timeline[ parseInt( key, 10 ) + 1 ] ) ? true : false;
 					pintable[key]["PIN_IS_FIRST"] = PIN_IS_FIRST;
 					pintable[key]["PIN_IS_LAST"] = PIN_IS_LAST;
 					pintable[key]["PIN_PARENT"] = pins_parents[ pin_parent_def_key ];
 					pintable[key]["PIN_DURATION"] = __( timeline[key][0] ).getDuration( $self.client );
 					pintable[key]["PIN_OFFSET"] = __( global_offset ).getOffset( $self.client );

 					if( timeline[key][2] && typeof timeline[key][2] === "string" ){
 						$self.var( timeline[key][2], {
 							'pin_duration': duration,
 							'pin_offset': timeline[key][1],
 							'pin_global_offset': global_offset,
 							'pin_done': ( global_offset + duration)
 						});
 						$self.privateVar( timeline[key][2], pintable[key]["PIN_ABSTRACT"] );
 					}

 					pins_global_height += __( timeline[key][0] ).getDuration( $self.client );
 					pins_global_offset += duration;
 					pin_parent_def_key--;
 				};
 				
 				setIntoParent();


 			}; // if

 			
 			

 		};

 		var setPin = function(){

 			LOAD_EVENT(function(){
 				
 				for( var pin_key = 0 ; pin_key < pintable.length; pin_key++ ){

 					var parent = $( pintable[pin_key]["PIN_PARENT"] );
 					var target = $( pintable[pin_key]["PIN_TARGET"] );
 					var target_pos_top = $(parent).offset().top;
 					var target_pos_left = $(parent).offset().left;

 		 		// 			if( ( pintable[pin_key]["PIN_IS_FIRST"] && 
 					// 	pintable[pin_key]["PIN_ABSTRACT"].state === "BEFORE" ) ||
 					// 	( pintable[pin_key]["PIN_HAS_BEFORE_ITEM"] &&
 					// 	pintable[pin_key]["PIN_ABSTRACT"].state === "BEFORE" &&
 					// 	pintable[pin_key - 1]["PIN_ABSTRACT"].state === "AFTER" )
 					// ){			

 					if( pintable[pin_key]["PIN_ABSTRACT"].state === "BEFORE" ||
 						pintable[pin_key]["PIN_ABSTRACT"].state === "AFTER" 
 					){

 						target[0].style.position = 'relative';
 						target[0].style.top = '0px';
 						target[0].style.left = '0px';

 						parent[0].style.height = 'auto';

 					}

 					if( pintable[pin_key]["PIN_ABSTRACT"].state === "DURING" ){
 						
 						var ABSTRACT_SELECTOR_TOP = $self.client.offsetTop + pintable[pin_key]["PIN_OFFSET"];

 						target[0].style.position = 'fixed';
 						target[0].style.top = ((target_pos_top - $(window).scrollTop() ) + ( ( __(window).offsetTop() + $self.trigger.marginTop ) - ABSTRACT_SELECTOR_TOP ) ) + 'px';
 						target[0].style.left = target_pos_left + 'px';

 						parent[0].style.height = parent[0].style.minHeight;

 					}

 					if( pintable[pin_key]["PIN_ABSTRACT"].state === "BEFORE" ){
 						parent[0].style.paddingTop = '0px';
 						parent[0].style.paddingBottom = pintable[pin_key]["PIN_DURATION"] + 'px';
 					}

 					// if( ( pintable[pin_key]["PIN_IS_LAST"] && 
 					// 	pintable[pin_key]["PIN_ABSTRACT"].state === "AFTER" ) ||
 					// 	( pintable[pin_key]["PIN_HAS_AFTER_ITEM"] &&
 					// 	pintable[pin_key]["PIN_ABSTRACT"].state === "AFTER" &&
 					// 	pintable[pin_key + 1]["PIN_ABSTRACT"].state === "BEFORE" )
 					// ){

 					if( pintable[pin_key]["PIN_ABSTRACT"].state === "AFTER" ){
 						parent[0].style.paddingTop = pintable[pin_key]["PIN_DURATION"] + 'px';
 						parent[0].style.paddingBottom = '0px';
 					}

 					//console.log( pin_key );
 					
 				
 				}
 			
 			});
 			
 		
 		};

 		initialize();


 	};

 	enedScroll.prototype.setPoint = function( duration, offset, name ){

 		var $self = this;

 		var CORRECT_POINT_DURATION = ( duration !== false && duration !== null && typeof duration !== "undefined" && __( duration ).isType([ "string", "number" ]) ) ? true : false;
 		var CORRECT_POINT_OFFSET = ( offset !== false && offset !== null && typeof offset !== "undefined" && __( offset ).isType([ "string", "number" ]) ) ? true : false;
 		var CORRECT_POINT_NAME = ( name !== false && name !== null && typeof name !== "undefined" && typeof name === "string" ) ? true : false;

 		if( CORRECT_POINT_OFFSET ){
 			
 			var POINT_DURATION 	= ( CORRECT_POINT_DURATION ) ? __( duration ).getDuration( $self.client, true ) : 0;
 			var POINT_OFFSET 	= ( CORRECT_POINT_OFFSET ) ? __( offset ).getOffset( $self.client, true ) : 0;

 			var POINT_ABSTRACT 	= $self.__abstract( POINT_DURATION, POINT_OFFSET );

 			if( CORRECT_POINT_NAME ){
 				$self.var( name, {
 					"point_duration": POINT_DURATION,
 					"point_offset": POINT_OFFSET,
 				});
 				$self.privateVar( name, POINT_ABSTRACT );
 			}
 		
 		}

 	};

 	enedScroll.prototype.is = function( name, events, callback ){

 		var $self = this;

 		var STATIC_EVENTS = ["BEFORE", "AFTER","ENTER"]; // Pojedycze wywoałnie dla tych eventów

 		var CORRECT_NAME = ( name !== false && name !== null && typeof name !== "undefined" && typeof name === "string" ) ? true : false;
 		var CORRECT_EVENTS = ( events !== false && events !== null && typeof events !== "undefined" && typeof events === "string" ) ? true : false;
 		var CORRECT_CALLBACK = ( callback !== false && callback !== null && typeof callback !== "undefined" && typeof callback === "function" ) ? true : false;

 		if( CORRECT_NAME && CORRECT_EVENTS && CORRECT_CALLBACK ){

 			var GET_VAR = $self.privateVar( name );
 			var CORRECT_VAR = ( GET_VAR !== false && GET_VAR !== null && GET_VAR !== "undefined" && typeof GET_VAR === "object" && GET_VAR.state ) ? true : false;

 			if( CORRECT_VAR ){

 				var EACH_EVENT = events.split(" ");
 				var POPULARITY = [];
 				var CALLBACK_PROPERTIES = {
 					progress: 0,
 					state: false,
 					var: false
 				}

 				for( var EVENT_KEY in EACH_EVENT ){
 					POPULARITY[ EACH_EVENT[EVENT_KEY] ] = 0;
 				}

 				LOAD_EVENT(function(){

 					var STATE = GET_VAR.state;

 					CALLBACK_PROPERTIES = {
	 					progress: GET_VAR.progress,
	 					state: GET_VAR.state,
	 					var: name
	 				};

 					if( STATE === "DURING" ){
 						if( EACH_EVENT.indexOf("UPDATE") >= 0 ){
 							CALLBACK_PROPERTIES.state = "UPDATE";
 							callback.call( window, CALLBACK_PROPERTIES );
 						}
 						if( EACH_EVENT.indexOf("ENTER") >= 0 & POPULARITY["ENTER"] < 1 ){
 							CALLBACK_PROPERTIES.state = "ENTER";
 							callback.call( window, CALLBACK_PROPERTIES );
 							POPULARITY["ENTER"] = 1;
 						}
 					}else{
 						if( EACH_EVENT.indexOf( STATE ) >= 0 && POPULARITY[STATE] < 1 ){
 							callback.call( window, CALLBACK_PROPERTIES );
 							POPULARITY[STATE] = 1;
 						}
 					}


 					for( var EVENT_KEY in EACH_EVENT ){
 						
 						var STATE_KEY = EACH_EVENT[EVENT_KEY];
 						
 						if( STATE === "DURING" ){
 							STATE = "ENTER";
 						}
		 					
		 				if( STATE_KEY !== STATE ){
		 					POPULARITY[STATE_KEY] = 0;
		 				}

	 				}

 					

	 			});

 			}
 		
 		}

 	};

 	return enedScroll;

 }));