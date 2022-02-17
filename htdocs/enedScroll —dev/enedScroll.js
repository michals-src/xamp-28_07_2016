/**
 * enedScroll
 * @version 1.1.0
 */
(function( root, factory ) {

	if( typeof define === 'function' && define.amd ){
		define( factory );
	}else if( typeof exports === 'commonJS' ){
		module.exports = factory();
	}else{
		root.enedScroll = factory(root.jQuery);
	}

}(this, function(){

	/**
	 *
	 * Połączyć z pluginem
	*/

	// var DIRECTIONS = {
	// 		t: 'top'
	// 		//l: 'left'
	// 	};

	var VERSION = '1.1.0';

	// var sth = {};

	// var eS = sth.main = function(){

	// 	this.item = 'my Item';
	// 	this.beta = true;
	// 	this.direction = 'VERTICAL';

	// };
	// sth.private = {
	// 	'one': function(){ },
	// 	'two': function(){ },
	// 	'three': function(){ }
	// };

	// eS.bindFunction = function(){
	// 	return this;
	// }
	// eS.prototype.abc = function(){

	// 	return 'I will be cry';
	// }


	/**
	 * Create new enedScroll
	 *
	 * @param (string || object) parent
	 * @param (array) selectors {top: value, bottom: value}
	 * @param (object) trigger
	 */
	var enedScroll = function(parent,selectors,trigger,visual){
		
		"use strict";

		var __NAMESPACE__ 	= 'enedScroll',
			INTERFACE 		= Interface,
			CLIENT 			= null,
			TRIGGER 		= null,
			OPTIONS 		= null,
			VISUAL 			= null,
			DRAW 			= null,
			self 			= this;


		if( ! INTERFACE.filters.type( 'object', document.getElementsByClassName( INTERFACE.filters.getClass( parent) )[0] )){
			return INTERFACE.throw( 'Parent in ' + __NAMESPACE__ + ' must be an object or string', 2 );
		}

		if( trigger && INTERFACE.filters.type( 'object', trigger ) ){
			TRIGGER = trigger;
		}else{
			TRIGGER = enedScroll.Trigger( 'default-trigger', {top: 0,left:0});
		}

		this.version = VERSION;

		/* 
		 * Get new Element using enedScroll.Client
		 * Get there functions here is required to get connection
		 * between all of these functions
		 *
		 * CLIENT - is name of added element
		 * OPTIONS - default options
		 * VISUAL - execute options
		 */
		CLIENT = enedScroll.Client(parent,selectors);
		OPTIONS = enedScroll.option();
		VISUAL = ( visual && INTERFACE.filters.type( 'object', visual ) ) ? visual : enedScroll.Visual();
		DRAW = enedScroll.Draw({'client': CLIENT, 'trigger': TRIGGER, 'visual': VISUAL}, OPTIONS);

		this.trigger = TRIGGER;
		this.client = CLIENT;
		this.options = OPTIONS;
		this.helpers = this.helpers();

		this.filterValue = function(e){
			if(e && INTERFACE.filters.type(['number', 'string'], e)){
				return INTERFACE.filters.value(e, CLIENT);
			}
		}

		this.scrollStatus = function(abstract){
			var client = CLIENT;

			if(abstract){
				client = abstract;
			}

			self.state = client.state(TRIGGER);
			return self.state;
		}


		/*
		 * (Private) function Load helper from callback
		 * at moment for assigned action
		 *
		 * BEFORE - load before CLIENT IN - load during CLIENT AFTER - load after CLIENT
		 * 
		 * @param (object) helper
		 * Is a interface of prototype helper which is loading by step
		 * depending on position of the trigger.
		 * @return (function)
		 * 
		 */
		var loadHelper = function(helper,abstract){
			var scrollStatus = self.scrollStatus(abstract);
			if(typeof scrollStatus === 'string'){
				if(scrollStatus === 'before'){
		
					return helper.before();

				}
				if(scrollStatus === 'during'){

					return helper.in();

				}
				if(scrollStatus === 'after'){

					return helper.after();

				}
			}
		}
		/*
		 * (Public) function load helper
		 */
		this.loadHelper = function(helper,abstract){
			if(typeof helper === 'object'){
				if(helper.before && helper.in && helper.after){
					var output = function(){
						return loadHelper(helper,abstract);
					}
					return output();
				}
			}
		}

		//
		// DO USUNIĘCIA
		// Prototyp modyfikacji funkcji CLIENT.selectorsOffset
		// Funkcja pozwala na ponowne użycie funkcji CLIENT z dodatkowymi parametrami {duration offset}
		// i otrzymaniu odpowiednich wartości (progress) dla wyznaczonego pola poprzez parametry {duration offset}
		//
			// var modifyClient = function(duration){
			// 	var selectorTop = (CLIENT.offset().top + CLIENT.selectors().top) - TRIGGER.margins.top,
			// 		selectorBottom = (duration + CLIENT.selectors().top) + (CLIENT.offset().top - TRIGGER.margins.top);

			// 	return { 'top': selectorTop, 'bottom': selectorBottom };
			// };

		this.abstract = function(options){
			
			var duration = 0,
				offset 	 = 0;

			if(options){
				if(options.duration){
					duration = options.duration;
				}
				if(options.offset){
					offset = options.offset;
				}
			}

			var options = {
					'duration': self.filterValue(duration),
					'offset': self.filterValue(offset)
				},
				abstractClient = enedScroll.Client(CLIENT.parentAsArray(), {top: CLIENT.selectors().top, bottom: 0}, options);
			

			return abstractClient;

		}

		/**
		* Get current progress of helper
		* @param (object) abstract
		*
		* @return (int)
		*/
		this.onUpdateHelper = function(abstract){
			
			var target = CLIENT;

			if(abstract){
				target = abstract;
			}

			return target.progress(TRIGGER);
		}




		/**
		 * Call to created creation
		 *
		 * @param (object) creation
		 * @return document event
		 */
		this.onUpdateCreation = function(creation){

			var parent = this.client.parent();
			var data = {
				plugins: this.helpers
			};

			
			var onCreation = function(){
				if(creation){
					data.progress = Math.round( self.client.progress( self.trigger ) * Math.pow(10, 5) ) / Math.pow(10, 5);
					data.state = self.client.state(self.trigger);
					return creation.call( parent, data );
				}
			}

			document.onreadystatechange = function () {
			    if (document.readyState == "interactive") {
			        onCreation();
			    }
			}
			document.addEventListener( 'scroll', onCreation );
			document.addEventListener( 'resize', onCreation );
			//document.addEventListener( 'mousewheel', onCreation );
			//document.addEventListener( 'DOMmouseScroll', onCreation );

		}
	};

	/**
	 * Default options
	 */
	var CONFIG = {
		'show_all_selectors': false,
		'show_all_triggers': false,
		'color_selectors': '#ffd100',
		'color_triggers': '#00ea00'	
	};
	enedScroll.option = function(){
		if(arguments.length){
			return Interface.extend(CONFIG, arguments[0]);
		}else{
			return Interface.extend({}, CONFIG);
		}
	};

	/**
	 * It is scene as function called creation
	 * Using this function you can create animation
	 * 
	 * @param (function) creation
	 * @return (function) creation
	 */
	enedScroll.prototype.addCreation = function(creation){

		var __NAMESPACE__ = 'enedScroll.addCreation',
			self = this;

		if( typeof creation !== 'function' ){
			return Interface.throw( 'Creation in ' + __NAMESPACE__ + ' must be a function', 3 );
		}
		var getCreation = function(){
			return self.onUpdateCreation(creation);
		};
		return getCreation();
	};

	enedScroll.prototype.helpers = function(){

		var proto = {},
			TRIGGER = this.trigger,
			CLIENT = this.client,
			INTERFACE = Interface,
			self = this;


		var addStyle = function(element, css){
			return INTERFACE.css(element, css);
		};

		var filterValue = function(value){
			return self.filterValue(value);
		};

		var getjQuery = function(){
			if( typeof jQuery === 'undefined' ){
				return INTERFACE.throw( 'Plugin requires jQuery version 1.x.x', 3 );
			}
			return jQuery;
		};


		// SZABLON Pluginu
		//
		// plugins.listener = function(){
		// 	var output = {};

		// 	output.before = function(){ };
		// 	output.in = function(){ };
		// 	output.after = function(){ };
	
		// 	return self.loadHelper( output );
		// };

		proto.call = function(state, callback){
			var output = {};

			if( state && INTERFACE.filters.type('string', state) ){
				if( callback && INTERFACE.filters.type('function', callback) ){

					output.before = function(){
						if( state === 'before' ){
							return callback();
						}
					};
					output.in = function(){ 					
						if( state === 'in' ){
							return callback();
						}
					};
					output.after = function(){ 
						if( state === 'after' ){
							return callback();
						}
					};
			
					return self.loadHelper( output );

				}
			}
		};

		/*
		 * Plugin
		 * @param (array) options
		 * @return function
		 */


		var pinParents = {};
		proto.pin = function( target ){

			var controller = {};
			var module = {};
			var $ = getjQuery();


			var init = function(){

				controller.target = target;

				return module;
			};

			var currentParentHeight = 0;
			controller.setParent = function( parentHeight, timeline ){

				var stamp = 'enedscroll-pin';
				var className = 'enedscroll-pin-parent';

				currentParentHeight = parentHeight;

				for( var keys in timeline ){
					
					var key = parseInt(keys, 10);
					var item = timeline[key];

					if( ! pinParents[key] ){

						var Parent = document.createElement( 'div' );

						currentParentHeight = (currentParentHeight - item.duration);

						Parent.className = className;
						Parent.style.width = $(controller.target).width() + 'px';
						Parent.style.position = 'relative';
						Parent.style.display = 'inline-block';
						Parent.style.paddingTop = '0px';
						Parent.style.paddingBottom = item.duration + 'px';
						Parent.style.height = currentParentHeight + 'px';

						$(Parent).attr( 'enedscroll-pin-parent', '' );

						controller.pins[key].parent.item = Parent;
						controller.pins[key].parent.height = ( (parentHeight - item.duration) + $(controller.target).outerHeight() );

						pinParents[key] = {};
						pinParents[key].item = Parent;
						pinParents[key].height = ( (parentHeight - item.duration) + $(controller.target).outerHeight() );

						if( !item.hasBefore && key == 0 ){
							$(Parent).insertBefore(controller.target);
							$(controller.target).appendTo(Parent);
						}else{
							$(Parent).appendTo(controller.pins[key - 1].parent.item);
							$(controller.target).appendTo(Parent);
						}

					}
					
				}


			};

			controller.route = function( elements ){

				var parentHeight = 0;
				for( var keys in elements ){

					var output = {};

					var key = parseInt( keys, 10 );
					var item = elements[key];


					// var parent = $('.enedScrollParent-' + key);
					var parent = $(pinParents[key].item);


					// var parentBefore = ( ! item.hasBefore && key == 0) ? false : $('.enedScrollParent-' + (key - 1));
					// var parentAfter = ( ! item.hasAfter ) ? false : $('.enedScrollParent-' + (key + 1));
					var parentBefore = ( ! item.hasBefore && key == 0) ? false : $(pinParents[(key - 1)].item);
					var parentAfter = ( ! item.hasAfter ) ? false : $(pinParents[(key + 1)].item);



					output.before = function(){

						if( ( ! item.hasBefore && key == 0 ) || ( item.hasBefore && elements[key - 1].state === 'after' ) ){

							var top = ( ( ! item.hasBefore && key == 0 ) ) ? 0 : ( ( elements[key - 1].duration + elements[key - 1].offset ));
							var bottom = ( ( ! item.hasBefore && key == 0 ) ) ? controller.parentHeight : ( controller.parentHeight - ( elements[key - 1].duration + elements[key - 1].offset ) );
							
							parent[0].style.paddingTop = '0px';
							parent[0].style.paddingBottom = item.duration + 'px';
							parent[0].style.height = parent.height();
							
							if( ( item.hasBefore && key != 0 && elements[key - 1].state === 'after' ) ){
								parentBefore[0].style.paddingTop = elements[key - 1].duration + 'px';
								parentBefore[0].style.paddingBottom = '0px';
								parentBefore[0].style.height = parentBefore.height();
							}
							
							//parent[0].style.paddingTop = ( ( ! item.hasBefore && key == 0 ) ) ? 0 : (  );


							//console.log(parent);

							// addStyle( controller.parent[0], {
							// 	'position': 'relative',
							// 	'top': '0',
							// 	'left': '0',
							// 	'padding-top': top,
							// 	'padding-bottom': bottom,
							// 	'z-index': '100'
							// });
							// controller.parent[0].style.height = $(controller.target).height() + 'px';

							controller.target[0].style.position = 'relative';
							controller.target[0].style.left = '0';
							controller.target[0].style.top = '0';


						}

						if( item.state === 'before' ){
							parent[0].style.paddingTop = '0px';
							parent[0].style.paddingBottom = item.duration + 'px';
							parent[0].style.height = parent.height();
						}

					};
					output.in = function(){

						controller.target[0].style.position = 'fixed';
						controller.target[0].style.top =  ($(parent).offset().top - $(window).scrollTop()) + ($(window).scrollTop() - item.abstract.selectorsPosition(TRIGGER).top) + 'px';
						controller.target[0].style.left =  $(parent).offset().left + 'px';
						//controller.target[0].style.width = '100%';

						//console.log( $(item.parent).offset().top + ($(window).scrollTop() - item.abstract.selectorsPosition(TRIGGER).top) );

						// var element = controller.target.position().top + TRIGGER.margins.top;
					
						// //console.log( INTERFACE.get.offset(controller.target[0].className) );
						// var duration = ( item.hasBefore ) ? elements[key - 1].duration : 0;
						// var offset = ( item.hasBefore ) ? elements[key - 1].offset : item.offset;

						// // controller.parent[0].style.height = $(controller.tagret).height() + 'px';

						// controller.target[0].style.position = 'fixed';
						// controller.target[0].style.top =  (( (($(controller.parent).offset().top + duration + offset) - $(window).scrollTop()) ) + ($(window).scrollTop() - item.abstract.selectorsPosition(TRIGGER).top)) + 'px';
						// controller.target[0].style.width = '100%';

						// //console.log( $(controller.target).offset().top - $(window).scrollTop() );

					};
					output.after = function(){
						if( ( ! item.hasAfter ) || (item.hasAfter && elements[key + 1].state === 'before') ) {
							var top = ( ( ! item.hasAfter ) ) ? controller.parentHeight : ( controller.parentHeight - ( elements[key + 1].duration + elements[key + 1].offset ) );
							var bottom = ( ( ! item.hasAfter ) ) ? 0 : ( ( elements[key + 1].duration + elements[key + 1].offset ) );
							
							// console.log( key );

							parent[0].style.paddingTop = item.duration + 'px';
							parent[0].style.paddingBottom = '0px';
							

							// if( ( ! item.hasAfter ) ){
							// 	parent[0].style.paddingTop = '0px';
							// 	parent[0].style.paddingBottom = item.duration;
							// 	parent[0].style.height = parent.height();
							// }
							// if( ( item.hasAfter && elements[key + 1].state === 'before') ){
							// 	parentAfter[0].style.paddingTop = elements[key + 1].duration + 'px';
							// 	parentAfter[0].style.paddingBottom = '0px';
							// 	parentAfter[0].style.height = parentAfter.height();
							// }							

							controller.target[0].style.position = 'relative';
							controller.target[0].style.left = '0';
							controller.target[0].style.top = '0';

							// controller.parent[0].style.paddingTop = top + 'px';
							// controller.parent[0].style.paddingBottom = bottom + 'px';
							// controller.parent[0].style.height = $(controller.target).height + 'px';

						}

						if( item.state === 'after' ){
							parent[0].style.paddingTop = item.duration + 'px';
							parent[0].style.paddingBottom = '0px';
						}
					};

					self.loadHelper(output, item.abstract)

				}

			};

			module.add = function( timeline ){
				
				var parentHeight = 0;
				controller.pins = {};
				
				for( var keys in timeline ){

					key = parseInt(keys, 10);
					var item = timeline[key];

					var abstract = self.abstract(item);
					var state = self.scrollStatus(abstract);

					controller.pins[key] = {
						'duration': item.duration,
						'offset': item.offset,
						'isFirst': ( key == 0 ) ? true : false,
						'isLast': ( key == (timeline.length - 1) ) ? true : false,
						'hasBefore':  timeline[(key - 1)] ? true : false,
						'hasAfter': timeline[(key + 1)] ? true : false,
						'abstract': abstract,
						'state': state,
						'parent': {}
					}

					var offset = ( key === 0 ) ? item.offset : ( item.offset - (timeline[(key - 1)].duration + timeline[(key - 1)].offset) );
					
					//var sth = (key === 0) ? ( $(controller.target).outerHeight() + item.duration ) : ( item.offset - controller.pins[key - 1].duration );
					var sth = (key === 0) ? ( $(controller.target).outerHeight() + item.duration ) : item.duration;

					//parentHeight = ( parentHeight + item.duration + offset );
					//parentHeight = ( parentHeight + item.offset ) - item.duration;

					parentHeight = parentHeight + sth;
					
				}



				controller.setParent( parentHeight, timeline );
				controller.route( controller.pins );


			};

			return init();


		};

		proto.value = function(){

			var controller = {};
			var modules = {};

			controller.render = function(value,options){
				var output = {};
					myName = self.abstract(options),
					onUpdateHelper = self.onUpdateHelper(myName);

				var before = true, after = true;
				if(options.before === false){
					before = false;
				}
				if(options.after === false){
					after = false;
				}

				output.before = function(){
					if(before){
						return value[0];
					}
				};
				output.in = function(){	
				
					var start 	= value[0],
						end 	= value[1],
						result 	= 0;

					if(start === 0 && end > 0){
						result = (0 + ( end * onUpdateHelper ));
					}
					if( start === 0 && end < 0){
						result = (0 + ( end * onUpdateHelper ));
					}

					if( end === 0 && start > 0){
						result = (start - ( start * onUpdateHelper ));
					}
					if( end === 0 && start < 0){
						result = (start - ( start * onUpdateHelper ));
					}

					if( start > 0 && end > 0 && start < end ){
						result = (start + ( (end - start) * onUpdateHelper ));
					}
					if( start > 0 && end > 0 && start > end ){
						result = (start - ( (start - end) * onUpdateHelper ));
					}

					if( start < 0 && end < 0 && start > end ){
						result = (start + ( (end - start) * onUpdateHelper ));
					}
					if( start < 0 && end < 0 && start < end ){
						result = (start - ( (start - end) * onUpdateHelper ));
					}

					if( start < 0 && end > 0 ){
						result = (start + ( (end - start) * onUpdateHelper ));
					}
					if( start > 0 && end < 0 ){
						result = (start - ( (start - end) * onUpdateHelper ));
					}

					return result;
					
				};
				output.after = function(){ 
					if(after){
						return value[1];
					}
				};
		
				return self.loadHelper( output, myName );
			}

			controller.collection = function(a,b){

				var parent = self.client.parentAsArray();
				var output = [];

				for( var x = 0; x <= (a.length - 1); x++ ){
					for( var k = 0; k <= (a[x].length - 1); k++){
						if(typeof a[x][k] !== 'undefined'){
							output[x] = a[x][k];
						}
					}
				}

				return b.call(parent, output);

			}

			modules.add = function( value, options ){

				var output = [];
				var defaults = { duration: '100%', offset: 0, bound: 0, repeat: 1 };
				var options = INTERFACE.extend( defaults, options );

				for( var x = 0; x <= (options.repeat - 1); x++ ){

					var val = value;
					var item = options;

					var before = ( x == 0 ) ? true : false;
					var after = ( x === (item.repeat - 1) ) ? true : false;

					var newvalue = ( parseInt( ((x + 1) / 2), 10 ) == ((x + 1) / 2) ) ? [val[1], val[0]] : val;
					var newoptions = { duration: item.duration, offset: (item.offset + ( filterValue(item.bound) * x )), before: before, after: after };
					
					output[x] = controller.render(newvalue, newoptions);
					
				}
				return output;
			}

			modules.get = function(a,b){
				
				var defaults = { duration: '100%', offset: 0, bound: 0, repeat: 1 };
				var options = defaults;

				if( a && a.length === 2 && INTERFACE.filters.type( 'number', [ a[0], a[1] ] ) ){
					if( INTERFACE.filters.type( 'object', b ) ){
						options = INTERFACE.extend( defaults, b );
					}
					return controller.render( a,options );
				}else if( a && a.length > 0 && INTERFACE.filters.type( 'object', [ a[0] ] ) && INTERFACE.filters.type( 'function', b ) ){
					return controller.collection( a,b );
				}

				return null;

			}

			return modules;

		}

		proto.getValue = function(value, options){
			var output = {};
				myName = self.abstract(options),
				onUpdateHelper = self.onUpdateHelper(myName);
			
			var before = true, after = true;
			if(options.before === false){
				before = false;
			}
			if(options.after === false){
				after = false;
			}

			output.before = function(){
				if(before){
					return value[0];
				}
			};
			output.in = function(){	
			
				var start 	= value[0],
					end 	= value[1],
					result 	= 0;

				if(start === 0 && end > 0){
					result = (0 + ( end * onUpdateHelper ));
				}
				if( start === 0 && end < 0){
					result = (0 + ( end * onUpdateHelper ));
				}

				if( end === 0 && start > 0){
					result = (start - ( start * onUpdateHelper ));
				}
				if( end === 0 && start < 0){
					result = (start - ( start * onUpdateHelper ));
				}

				if( start > 0 && end > 0 && start < end ){
					result = (start + ( (end - start) * onUpdateHelper ));
				}
				if( start > 0 && end > 0 && start > end ){
					result = (start - ( (start - end) * onUpdateHelper ));
				}

				if( start < 0 && end < 0 && start > end ){
					result = (start + ( (end - start) * onUpdateHelper ));
				}
				if( start < 0 && end < 0 && start < end ){
					result = (start - ( (start - end) * onUpdateHelper ));
				}

				if( start < 0 && end > 0 ){
					result = (start + ( (end - start) * onUpdateHelper ));
				}
				if( start > 0 && end < 0 ){
					result = (start - ( (start - end) * onUpdateHelper ));
				}

				return result;
				
			};
			output.after = function(){ 
				if(after){
					return value[1];
				}
			};
	
			return self.loadHelper( output, myName );
		};

		proto.collection = function(){

			var modules = {};

			modules.add = function( value, options ){

				var output = [];
				for( var x = 0; x <= (options.repeat - 1); x++ ){

					var val = value;
					var item = options;

					var before = ( x == 0 ) ? true : false;
					var after = ( x === (item.repeat - 1) ) ? true : false;

					var newvalue = ( parseInt( ((x + 1) / 2), 10 ) == ((x + 1) / 2) ) ? [val[1], val[0]] : val;
					var newoptions = { duration: item.duration, offset: (item.offset + ( item.bound * x )), before: before, after: after };
					
					var o = proto.getValue(newvalue, newoptions);
					output[x] = proto.getValue(newvalue, newoptions);
					
				}
				return output;

			}

			modules.get = function( timeline, callback ){

				var output = [];
				for( var x = 0; x <= (timeline.length - 1); x++ ){
					for( var k = 0; k <= (timeline[x].length - 1); k++){
						if(typeof timeline[x][k] !== 'undefined'){
							output[x] = timeline[x][k];
						}
					}
				}
				callback(output);

			}

			return modules;

		}

		proto.show = function(item,type,options){

			var $ = getjQuery();
			var duration = options.duration;
			var offset = options.offset;
			var value = 1;

			if( type === 'in' ){
				value = proto.getValue([0,1], {duration: duration, offset: offset});
			}
			if( type === 'out' ){
				value = proto.getValue([1,0], {duration: duration, offset: offset});
			}

			$(item).css({'opacity': value});

		}

		var screenParent = null;
		proto.screen = function(){

			var controller = {};
			var modules = {};
			var $ = getjQuery();

			controller.addParent = function( width, height, screens ){

				var stamp = 'enedscroll-screen';
				var parentName = 'enedscroll-screens-parent';

				for( x = 0; x <= ( screens.length - 1 ); x++ ){

					if( screenParent === null ){

						var parent = document.createElement('div');
							parent.style.width = width + 'px';
							parent.style.height = height + 'px';
							parent.className = parentName;

						$(parent).insertBefore( $(screens[x].item) );
						$(screens[x].item).appendTo( parent );

						screenParent = parent;

						if( ! $( screenParent ).attr(stamp) ){
							$( screenParent ).attr( stamp, '' );
						}

					}else{
						$(screens[x].item).appendTo( screenParent );
					}

				}

				return { 'item': screenParent, 'class': '.' + parentName, 'width': width, 'height': height };


			}

			controller.route = function( screens, callback ){

				var progress = [];

				for( key in screens ){

					var screen 		= screens[key];
					var item		= screen.item;
					var type 		= screen.type;
					var options 	= { duration: screen.options.duration, offset: screen.options.offset };
					var isVisible 	= screen.isVisible;
					var onShow		= screen.onShow;
					var onHide		= screen.onHide;
					var isFirst 	= false;

					var selectors = CLIENT.selectorsPosition( TRIGGER );


					progress[key] = {};
					progress[key].position = { top: (selectors.top + ( screen.height * parseInt(key, 10) )), bottom: (selectors.top + (selectors.top + ( screen.height * (parseInt(key, 10) + 1) ) ) ) };
					progress[key].width = screen.width;
					progress[key].height = screen.height;
					progress[key].item = item;

					if( key === '0' && typeof screen.options.isVisible === 'undefined' ) {
						isFirst = true;
						type = 'undefined';
						$(item).css( { 'width': screen.width,  'height': screen.height } );
					}
					if( type === 'left' || type === 'right' ){
						$(item).css( { 'width': ( ( isVisible ) ? screen.width : '0' ),  'height': screen.height } );
					}
					if( type === 'top' ){
						$(item).css( { 'width': screen.width, 'height': ( ( isVisible ) ? screen.height : '0' ) } );
					}

					var abstract = self.abstract(options);
					var onUpdateHelper = self.onUpdateHelper(abstract);

					var output = {};

					output.before = function(){
						
						progress[key].state = 'BEFORE';

						if( isVisible === false && $.inArray( type, [ 'left', 'right' ] ) >= 0 ){
							$(item).css( 'width', '0');
						}else if( isVisible && $.inArray( type, [ 'left', 'right' ] ) >= 0 ){
							$(item).css( 'width', screen.width);
						}

						if( isVisible === false && $.inArray( type, [ 'top' ] ) >= 0 ){
							$(item).css( 'height', '0');
						}else if( isVisible && $.inArray( type, [ 'top' ] ) >= 0 ){
							$(item).css( 'height', screen.height);
						}

						if( isVisible === false && $.inArray( type, [ 'scale' ] ) >= 0 ){
							var scale = INTERFACE.filters.transform( { 'scale': '(0)' } );
							$(item).css( scale );
						}else if( isVisible && $.inArray( type, [ 'scale' ] ) >= 0 ){
							var scale = INTERFACE.filters.transform( { 'scale': '(1)' } );
							$(item).css( scale );
						}

					}
					output.in = function(){
						
						progress[key].state = 'DURING';

						if( isVisible === false && $.inArray( type, [ 'left', 'right' ] ) >= 0 ){
							$(item).css( 'width', (screen.width * onUpdateHelper ) );
						}else if( isVisible && $.inArray( type, [ 'left', 'right' ] ) >= 0 ){
							$(item).css( 'width', ( screen.width - (screen.width * onUpdateHelper ) ) );
						}

						if( isVisible === false && $.inArray( type, [ 'top' ] ) >= 0 ){
							$(item).css( 'height', (screen.height * onUpdateHelper ) );
						}else if( isVisible && $.inArray( type, [ 'top' ] ) >= 0 ){
							$(item).css( 'height', ( screen.height - (screen.height * onUpdateHelper ) ) );
						}

						if( isVisible === false && $.inArray( type, [ 'scale' ] ) >= 0 ){
							var scale = INTERFACE.filters.transform( { 'scale': '(' + ( 1 * onUpdateHelper ) + ')' } );
							$(item).css( scale );
						}else if( isVisible && $.inArray( type, [ 'scale' ] ) >= 0 ){
							var scale = INTERFACE.filters.transform( { 'scale': '(' + ( 1 - ( 1 * onUpdateHelper ) ) + ')' } );
							$(item).css( scale );
						}

					}
					output.after = function(){

						progress[key].state = 'AFTER';

						if( isVisible === false && $.inArray( type, [ 'left', 'right' ] ) >= 0 ){
							$(item).css( 'width', screen.width);
						}else if( isVisible && $.inArray( type, [ 'left', 'right' ] ) >= 0 ){
							$(item).css( 'width', '0');
						}

						if( isVisible === false && $.inArray( type, [ 'top' ] ) >= 0 ){
							$(item).css( 'height', screen.height);
						}else if( isVisible && $.inArray( type, [ 'top' ] ) >= 0 ){
							$(item).css( 'height', '0');
						}

						if( isVisible === false && $.inArray( type, [ 'scale' ] ) >= 0 ){
							var scale = INTERFACE.filters.transform( { 'scale': '(1)' } );
							$(item).css( scale );
						}else if( isVisible && $.inArray( type, [ 'scale' ] ) >= 0 ){
							var scale = INTERFACE.filters.transform( { 'scale': '(0)' } );
							$(item).css( scale );
						}

						if( onShow !== null && isVisible === false ){
							var data = ( onShow.data ) ? onShow.data : null ;
							onShow.callback.call( item, data );
						}
						if( onHide !== null && isVisible ){
							var data = ( onHide.data ) ? onHide.data : null ;
							onHide.callback.call( item, data );
						}


					}
					
					self.loadHelper( output, abstract );

				}

				if( INTERFACE.filters.type( ['function'], callback ) ){
					callback(progress);
				}

			}

			modules.collection = function( screens, callback ){

				var parentHeight = 0;
				for( x = 0; x <= ( screens.length - 1 ); x++ ){

					parentHeight += parseInt(screens[x].height, 10);

				}

				var width = 0;
				var height = 0;

				if( screens.length > 0 ){
					width = parseInt( screens[0].width, 10 );
					height = parseInt(screens[0].height, 10 );
				}

				var parent = controller.addParent( width, height, screens );
				var pinScreen = proto.pin( $(parent.item) );

				pinScreen.add( [ { duration: parentHeight, offset: 0 } ] );
				controller.route( screens, callback );

			}

			modules.add = function( screen, type, options ){

				var properties = {};

				if( ! $(screen).attr('enedscroll-screen-item') ){
					$(screen).attr( 'enedscroll-screen-item', '' );
				}
				if( ! $(screen).attr('screen-width') ){
					$(screen).attr( 'screen-width', $(screen).outerWidth() );
				}
				if( ! $(screen).attr('screen-height') ){
					$(screen).attr( 'screen-height', $(screen).outerHeight() );
				}

				properties.item 		= screen;
				properties.width 		= parseInt( $(screen).attr('screen-width'), 10 );
				properties.height 		= parseInt( $(screen).attr('screen-height'), 10 );
				properties.type 		= type;
				properties.options 		= options;

				properties.isVisible 	= ( INTERFACE.filters.type( 'boolean', properties.options.isVisible ) && properties.options.isVisible === true ) ? true : false;
				properties.onShow		= ( INTERFACE.filters.type( ['function', 'object'], properties.options.onShow ) && properties.options.onShow || Array.isArray(properties.options.onShow) ) ? properties.options.onShow : null ;
				properties.onHide		= ( INTERFACE.filters.type( ['function', 'object'], properties.options.onHide ) && properties.options.onHide || Array.isArray(properties.options.onHide) ) ? properties.options.onHide : null ;

				if( INTERFACE.filters.type( 'object', properties.onShow ) && properties.onShow || Array.isArray(properties.onShow) ){
					var response = ( Array.isArray(properties.onShow) || properties.onShow.data ) ? (( properties.onShow[0] ) ? properties.onShow[0] : properties.onShow.data) : null;
					var func = ( Array.isArray(properties.onShow) || properties.onShow.callback ) ? (( properties.onShow[1] ) ? properties.onShow[1] : properties.onShow.callback) : null;
					properties.onShow = { data: response, callback: func };
				}else if( INTERFACE.filters.type( 'function', properties.onShow ) && properties.onShow ){
					properties.onShow = { data: null, callback: properties.onShow };
				}

				if( INTERFACE.filters.type( 'object', properties.onHide ) && properties.onHide ||  Array.isArray(properties.onHide) ){
					var response = ( Array.isArray(properties.onHide) || properties.onHide.data ) ? (( properties.onHide[0] ) ? properties.onHide[0] : properties.onHide.data) : null;
					var func = ( Array.isArray(properties.onHide)|| properties.onHide.callback ) ? (( properties.onHide[1] ) ? properties.onHide[1] : properties.onHide.callback) : null;
					properties.onHide = { data: response, callback: func };
				}else if( INTERFACE.filters.type( 'function', properties.onHide ) && properties.onHide ){
					properties.onHide = { data: null, callback: properties.onHide };
				}


				$(properties.item).css( { 'position': 'absolute' } );

				if( $.inArray( properties.type, [ 'left', 'right' ] ) >= 0 ){
					$(properties.item).css( 'overflowX', 'hidden' );
					if( properties.type === 'left' ){
						$(properties.item).css( 'left', '0' );
					}
					if( properties.type === 'right' ){
						$(properties.item).css( 'right', '0' );
					}
				}else if( $.inArray( properties.type, [ 'top' ] ) >= 0 ){
					$(properties.item).css( { 'overflowY': 'hidden', 'top': '0' } );
				}else if( $.inArray( properties.type, [ 'scale' ] ) >= 0 ){
					if( ! properties.isVisible ){
						var scale = INTERFACE.filters.transform( { 'scale': '(0)' } );
						$(properties.item).css( scale );
					}else if( properties.isVisible ){
						var scale = INTERFACE.filters.transform( { 'scale': '(1)' } );
						$(properties.item).css( scale );
					}
				}

				return properties;
			
			}


			return modules;

		}

		proto.slice = function( slices, callback ){

			var output = {};
			var info = [];
			var parent = CLIENT.parent();

			for( key in slices ){

				info[key] = {};

				var abstract = self.abstract( slices[key] );
				var progress = self.onUpdateHelper( abstract );

				info[key].state = abstract.state(TRIGGER);
				info[key].progress = progress;

			}

			if( callback && INTERFACE.filters.type( 'function', callback ) ){
				callback.call( parent, info );
			}


		}

		return proto;

	};

	/**
	 * Creaate new trigger
	 * Function allows to create new trigger
	 * to manipulate scene. It's abstract element.
	 * If is visible then will be create DOM HTML element
	 * 
	 * @version 1.0.0
	 * @since 1.0.1
	 * @param (array) options //name, margins(top,left)
	 * @return (array) properties
	 */
	enedScroll.Trigger = function( name, options ){

		"use strict";

		var __NAMESPACE__ 	= 'enedScroll.Trigger',
			INTERFACE 		= Interface,
			CONFIG 			= { 
								margins: { top: 0, left: 0 },
								types: ['string'],
								name: name
							  },
			TRIGGER 		= {};

		if( ! CONFIG.name ){
			return INTERFACE.throw( 'Name of element in ' + __NAMESPACE__ + ' is required', 3 );
		}
		if( ! INTERFACE.filters.type( CONFIG.types, CONFIG.name ) ){
			return INTERFACE.throw( 'Type of element in ' + __NAMESPACE__ + ' must be a string', 3 );
		}
		
		// Throw new Exception about wrong type of margins
		if( ! INTERFACE.filters.type( 'object', options ) && options ){
			INTERFACE.throw( 'Margins of trigger in ' + __NAMESPACE__ + ' must be an array. Set default [0,0]', 2 );
		}
		if( options && INTERFACE.filters.type( 'object', options ) ){
			if( options.top && INTERFACE.filters.type( ['string','number'], options.top ) ) {
				CONFIG.margins.top = INTERFACE.filters.value( options.top );
			}
			if( options.left && INTERFACE.filters.type( ['string','number'], options.left ) ) {
				CONFIG.margins.left = INTERFACE.filters.value( options.left );
			}
		}

		TRIGGER.progress = function(){
			return (INTERFACE.get.offsetTop() + CONFIG.margins.top);
		}

		TRIGGER.name = CONFIG.name;
		TRIGGER.margins = CONFIG.margins;

		return TRIGGER;
		
	}

	/**
	 * Main element
	 * Properties
	 */
	enedScroll.Client = function(element,selectors,options){

		var __NAMESPACE__ 	= 'enedScroll.Client',
			INTERFACE 		= Interface,
			CLIENT 			= {};

		if( ! INTERFACE.filters.type( ['string', 'object'], element ) ){
			return INTERFACE.throw( 'Element in ' + __NAMESPACE__ + ' must be a string or array', 3 );
		}

		var selectors = ( INTERFACE.filters.type( 'object', selectors ) && INTERFACE.filters.type( 'number', [selectors.top, selectors.bottom] ) ) ? selectors : {top: 0, bottom: 0},
			className = INTERFACE.filters.getClass(element),
			parent = document.getElementsByClassName(className),
			duration = 0,
			offsetTop = 0;

		if(options){
			if(options.duration){
				duration = options.duration;
			}
			if(options.offset){
				offsetTop = options.offset;
			}
		}

		CLIENT.parent = function(){ return parent[0]; };
		CLIENT.parentAsArray = function(){ return parent; };
		CLIENT.className = function(){ return className; };
		CLIENT.selectors = function(){ return selectors; };
		CLIENT.offset = function(){ return INTERFACE.get.offset(CLIENT.className()); };
		/*
		 * Get part of CLIENT's height using percentage
		 * @param (int) value < min: 0 ; max: 100 >
		 *
		 * @return (int)
		 */
		CLIENT.segment = function(value){
			var segment = 100;
			if(value){
				if(value > 0 && value <= 200){
					segment = (INTERFACE.get.height(CLIENT.parent()) * (value / 100));
				}
			}
			return Math.floor(segment);
		};
		CLIENT.selectorsOffset = function(trigger){
			var TRIGGER = trigger,
				height = (duration && INTERFACE.filters.type('number', duration)) ? (duration + CLIENT.selectors().top) :  INTERFACE.get.height(CLIENT.parent());
				selectorTop = ((CLIENT.offset().top + offsetTop) + CLIENT.selectors().top) - TRIGGER.margins.top,
				selectorBottom = ((height + (CLIENT.offset().top + offsetTop)) - CLIENT.selectors().bottom) - TRIGGER.margins.top;

			return { 'top': selectorTop, 'bottom': selectorBottom };
		};
		CLIENT.selectorsPosition = function( trigger ){
			var TRIGGER = trigger,
				position = {},
				height = (duration && INTERFACE.filters.type('number', duration)) ? (duration + CLIENT.selectors().top) :  INTERFACE.get.height(CLIENT.parent());;
			
				position.top = (CLIENT.offset().top + offsetTop) + CLIENT.selectors().top + (INTERFACE.get.offsetTop() - TRIGGER.margins.top);
				position.bottom = ((height + (CLIENT.offset().top + offsetTop)) - CLIENT.selectors().bottom) + (INTERFACE.get.offsetTop() - TRIGGER.margins.top);

			return position;
		}
		CLIENT.selectorsAbstract = function(){
			var position = {},
				height = (duration && INTERFACE.filters.type('number', duration)) ? (duration + CLIENT.selectors().top) :  INTERFACE.get.height(CLIENT.parent());;
			
				position.top = (CLIENT.offset().top + offsetTop) + CLIENT.selectors().top;
				position.bottom = ((height + (CLIENT.offset().top + offsetTop)) - CLIENT.selectors().bottom);

			return position;
		}
		CLIENT.state = function(trigger){
			var state = 'out',
				selectors = CLIENT.selectorsOffset(trigger);

			if( selectors.top >= 0 ){
				state = 'before';
			}else if( selectors.top < 0 && selectors.bottom >= 0 ){
				state = 'during'
			}else{
				state = 'after';
			}

			return state;
		};
		CLIENT.progress = function(trigger, newSelectorsOffset){
			var selectors = (newSelectorsOffset && INTERFACE.filters.type('object', newSelectorsOffset)) ? newSelectorsOffset : CLIENT.selectorsOffset(trigger),
				progress = (selectors.top / (selectors.top - selectors.bottom)),
				guard = (progress <= 0 ) ? 0 : (progress >= 0 && progress <= 1) ? progress : 1;
			
			return guard;
		};

		return CLIENT;

	}


	enedScroll.Visual = function( options ){

		var __NAMESPACE__ = 'enedScroll.Visual'
		var GLOBAL_OPTIONS = enedScroll.option();
		var defaults = {
			'show_selectors': GLOBAL_OPTIONS.show_all_selectors,
			'color_selectors': GLOBAL_OPTIONS.color_selectors,
			'z-index_selectors': '99999',
			'show_trigger': GLOBAL_OPTIONS.show_all_triggers,
			'color_trigger': GLOBAL_OPTIONS.color_triggers,
			'z-index_trigger': '99999'
		};
		var options = ( ! Interface.filters.type( 'object', options ) || ! options ) ? {} : options;

		return Interface.extend( defaults, options );

	}

	enedScroll.Draw = function(included, options){

		var TRIGGER 	= null,
			CLIENT 		= null,
			VISUAL 		= {},
			OPTIONS 	= {};

		var showTrigger = false;
		var showSelectors = false;

		var draw = function(){
			
			var color_trigger = ( OPTIONS['color_triggers'] === VISUAL['color_trigger'] ) ? OPTIONS['color_triggers'] : VISUAL['color_trigger'];
			var color_selectors = ( OPTIONS['color_selectors'] === VISUAL['color_selectors'] ) ? OPTIONS['color_selectors'] : VISUAL['color_selectors'];

			if( OPTIONS['show_all_triggers'] || VISUAL['show_trigger'] ){

				if( VISUAL['show_trigger'] ){

					var trigger = document.createElement('div');
					trigger.className = TRIGGER.name;
					document.body.appendChild(trigger);

					Interface.css( trigger, {
						'position': 'fixed',
						'z-index': VISUAL['z-index_trigger'],
						'width': '70px',
						'height': '1px',
						'background-color': color_trigger,
						'top': TRIGGER.margins.top
					});

				}

			}

			if( OPTIONS['show_all_selectors'] || VISUAL['show_selectors'] ){

				if( VISUAL['show_selectors'] ){

					var selectorTop 	= document.createElement('div'),
						selectorBottom 	= document.createElement('div'),
						parent 			= CLIENT.parentAsArray()[0],
						classname 		= 'enedScroll-visual-selector';

					selectorTop.className = classname;
					selectorBottom.className = classname;

					
					if( parent.childNodes.length > 0 ){
						parent.insertBefore(selectorTop, parent.childNodes[0]);
					}else{
						parent.appendChild(selectorTop);
					}

					parent.appendChild(selectorBottom);

					Interface.css( parent, {
						'position': 'relative'
					});

					Interface.css( selectorTop, {
						'position': 'absolute',
						'z-index': VISUAL['z-index_selectors'],
						'width': '100%',
						'height': '1px',
						'background-color': color_selectors,
						'top': CLIENT.selectors().top,
						'left': '0'
					});
					Interface.css( selectorBottom, {
						'position': 'absolute',
						'z-index': VISUAL['z-index_selectors'],
						'width': '100%',
						'height': '1px',
						'background-color': color_selectors,
						'bottom': CLIENT.selectors().bottom,
						'left': '0'
					});

				}

			}

		}

		if( included && options ){
			if( included.client && included.trigger ){
				TRIGGER = included.trigger;
				CLIENT = included.client;
				VISUAL = included.visual;
				OPTIONS = options;
				draw();
			}
		}

	}




	var Interface = (function(window){

		"use strict";

		var CORE = {};

		// 3 levels of console error
		var throwLevel = [ 'log', 'warn', 'error' ],
			console = console || window.console;
		// If console not exists then nothing
		console.log = console.log || function() {};
		// Check if all of throwLevels are in console If not then default = log
		for(var c=0;c <= (throwLevel.length - 1);c++){
			if( ! console[throwLevel[c]] ){
				console[throwLevel[c]] = console.log;
			}
		}

		/**
		 * (Private) function
		 */
		var existsComputedStyle = function(element){
				return (element.currentStyle) ? element.currentStyle : window.getComputedStyle(element);
			},
			dimension = function(element,orientation,addMargins){
				var style = existsComputedStyle( element ),
					getNumber = filters.number,
					dimension = (orientation ? element['offset' + orientation] || element['client' + orientation] : element['outer' + orientation] || element['inner' + orientation]) || 0;
				
				if(addMargins){
					var margins = (orientation === 'Height' ? getNumber(style.marginTop) + getNumber(style.marginBottom) : getNumber(style.marginLeft) + getNumber(style.marginRight) ) || 0;
					dimension = dimension + margins;
				}
				return dimension;
			};

		/**
		 * Throw new exception in browser console
		 *
		 * @var (string) a // Message
		 * @var (int) b // Level of message validity => Compartment 1 - 3
		 * @return console
		 */
		CORE.throw = function(a,b){
			if(typeof a !== 'string' || !a){ a = ''; }
			if(typeof b !== 'number' || b > 4 || b < 0){ b = 1; }

			var method	= l[(b - 1)],

				args	= [a],
				m 		= Array.prototype.splice.call(args),
				f 	 	= Function.prototype.bind.call(console[method], console);
			
			f.apply(console,args);
		};

		CORE.extend = function(object){
			if(arguments.length){
				for(var x =0; x <= (arguments.length -1); x++){
					for(var newOption in arguments[x]){
						if( arguments[x].hasOwnProperty(newOption) ) {
							object[newOption] = arguments[x][newOption];
						}
					}
				}
			}
			return object;
		};

		CORE.css = function(element,style){
			for(var attribute in style){
				var value = style[attribute];
				if( value === parseFloat(value)){ value += 'px'; }
				element.style[filters.style(attribute)] = value;
			}
		};


		var get = CORE.get = {};
		get.offsetTop = function(){
			return window.pageYOffset;
		};
		get.offsetLeft = function(){
			return window.pageXOffset;
		};
		get.offset = function(element){
			var el = document.getElementsByClassName(element)[0],
				offset = {top: 0, left: 0};
			if(el && el.getBoundingClientRect){
				var rect = el.getBoundingClientRect();
				offset.top = rect.top;
				offset.left = rect.left;
			}
			return offset;
		}


		get.width = function(element, addMargins){
			return dimension(element, 'Width', addMargins);
		}
		get.height = function(element, addMargins){
			return dimension(element, 'Height', addMargins);
		}
		get.style = function(element, style){
			if(filters.type('string', style)){
				return existsComputedStyle(element)[filters.style(style)];
			}else if(filters.type('object', style)){
				var styles = {}, style = existsComputedStyle(element);
				style.forEach(function(key,value){
					styles[key] = style[filters.style(key)];
				});
				return styles;
			}
		}
		get.userAgent = function(){
			
			var name = navigator.appName, 
				ua = navigator.userAgent,
				version;
			
			var INFO = ua.match(/(opera|chrome|safari|firefox|msie|trident)\/?\s*(\.?\d+(\.\d+)*)/i);
				version = ua.match(/version\/([\.\d]+)/i)
				
				if(INFO && version != null) { INFO[2] = version[1]; }
				INFO = (INFO) ? [INFO[1], INFO[2]] : [name, navigator.appVersion,'-?'];

			return INFO;

		}


		var filters = CORE.filters = {};
		filters.transform = function(a){

			var ua = get.userAgent();
			var b = ( filters.type( 'object', a ) ) ? a : {};
			var c = [];
			var prefix = [];
			var d = {};

			for( var func in b ){
				c.push( func + '' + b[func] );
			}

			if( ua[0] === 'Trident' ){
				prefix.push('-ms-');
			}else if( ua[0] === 'Chrome' || ua[0] === 'Safari' ){
				prefix.push('-webkit-');
			}else if( ua[0] === 'Opera' ){
				prefix.push('-webkit-');
				prefix.push('-o-');
			}else if( ua[0] === 'Firefox' ){
				prefix.push('-moz-');
			}

			for( var key in prefix ){
				d[ prefix[key] + 'transform' ] =  c.join( ' ' );
			}

			return d;

		};
		filters.getClass = function(r){
			if(r){
				if(typeof r === 'object' && r[0].nodeType === 1){
					return r[0].className;
				}else if(typeof r === 'string'){
					return filters.clearClass(r);
				}
			}
		};
		filters.clearClass = function(r){
			if(typeof r === 'string'){
				return r.split('.').join('');
			}
		};
		/**
		*
		 * Check the @typeof element
		 *
		 * @param (array) || (string) type
		 * @param (all) element
		 * It is possible to verify of @typeof multiple elements by adding
		 * all of needed elements to an array as @type
		 *
		 * @return boolean
		 */
		filters.type = function(type,element){
			if( type && typeof type === 'string' || (typeof type == 'object' && Array.isArray(type)) ){
				var results = [],
					elements = ( ! Array.isArray(element) ) ? [element] : element,
					counter = 0;
					type = (typeof type === 'string') ? [type] : type;

				for(var i = 0;i <= (type.length - 1); i++){
					for(var x = 0;x <= (elements.length - 1); x++){
						if( ! results[x] ){
							if( type.indexOf(typeof elements[x]) >= 0 ){
								results[x] = true;
								counter++;
							}else{
								results[x] = false;
							}
						}
					}
				}
				
				return (counter === results.length) ? true : false;
			}
		};
		filters.number = function(number){
			if(filters.type('string', number)){
				return parseInt(number, 10);
			}
		};
		filters.style = function(style){
			return style.replace(/^[a-z]+(^[a-z])/g, '$1').replace(/-([a-z])/g, function(p){
				return p[1].toUpperCase();
			});
		};
		filters.value = function(value,client){

			var filter = 0;
			var CLIENT = (client) ? client : false;
			var winHeight = $(window).height();

			if(value && CORE.filters.type(['number', 'string'], value)){

				if(CORE.filters.type('number', value)){
					value = value.toString();
				}
				var percentage = value.match(/(%)+/g);
				value = CORE.filters.number(value);
				if( percentage ){
					if( value > 0 && value <= 200 ){
						var segment = (CLIENT) ? CLIENT.segment(value) : Math.floor( ( value / 100 ) * winHeight );
						filter = segment;
					}
				}else if( ! percentage ){
					filter = value;
				}

				return filter;
			}

			return value;

		}

		return CORE;

	})(window);

	return enedScroll;

}));