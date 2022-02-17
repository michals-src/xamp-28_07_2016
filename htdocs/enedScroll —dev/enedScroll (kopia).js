/**
 * enedScroll
 * @version 1.0.1
 */
(function( root, factory ) {

	if( typeof define === 'function' && define.amd ){
		define( factory );
	}else if( typeof exports === 'commonJS' ){
		module.exports = factory();
	}else{
		root.enedScroll = factory(root.jQuery);
	}

}(this, function( $ ){

	/**
	 *
	 * Połączyć z pluginem
	*/

	// var DIRECTIONS = {
	// 		t: 'top'
	// 		//l: 'left'
	// 	};

	var VERSION = '1.0.1';

	/**
	 * Create new enedScroll
	 *
	 * @param (string || array) parent
	 * @param (array) selectors {top: value, bottom: value}
	 * @param (object) trigger
	 */
	var enedScroll = function(parent,selectors,trigger){
		
		"use strict";

		var __NAMESPACE__ 	= 'enedScroll',
			INTERFACE 		= Interface,
			CLIENT 			= null,
			TRIGGER 		= null,
			OPTIONS 		= null,
			VISUAL 			= null,
			self 			= this;


		if( ! INTERFACE.filters.type( 'object', document.getElementsByClassName( INTERFACE.filters.getClass(parent) )[0] )){
			return INTERFACE.throw( 'Parent in ' + __NAMESPACE__ + ' must be a object or string', 2 );
		}

		if( trigger && INTERFACE.filters.type( 'object', trigger ) ){
			TRIGGER = trigger;
		}else{
			TRIGGER = enedScroll.Trigger({name: 'default-trigger', margins: {top: 0,left:0}});
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
		VISUAL = enedScroll.Visual({'client': CLIENT, 'trigger': TRIGGER}, OPTIONS);

		this.trigger = TRIGGER;
		this.client = CLIENT;
		this.options = OPTIONS;
		this.helpers = this.helpers();


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
		 * @vars beforeC && afterC block BEFORE && AFTER events after 10 calls
		 * 
		 * @param (object) helper
		 * Is a interface of prototype helper which is loading by step
		 * depending on position of the trigger.
		 * @return (function)
		 * 
		 */
		//var beforeC = 0, afterC = 0;
		var loadHelper = function(helper,abstract){
			var scrollStatus = self.scrollStatus(abstract);
			if(typeof scrollStatus === 'string'){
				if(scrollStatus === 'before'){
		
					// beforeC++;
					// afterC = 0;

					return helper.before();

				}
				if(scrollStatus === 'in'){

					// beforeC = 0;
					// afterC = 0;

					return helper.in();

				}
				if(scrollStatus === 'after'){

					// afterC++;
					// beforeC = 0;

					return helper.after();

				}
			}
		}
		/*
		 * Public function
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

		var filterValue = function(value){

			var filter = 0;

			if(value){
				if(INTERFACE.filters.type('number', value)){
					value = value.toString();
				}
				var percentage = value.match(/(%)+/g);
				value = INTERFACE.filters.number(value);
				if( percentage ){
					if( value > 0 && value <= 100 ){
						var segment = CLIENT.segment(value);
						filter = segment;
					}
				}else if( ! percentage ){
					filter = value;
				}
			}

			return filter;

		}

		this.filterValue = function(value){
			if(value && INTERFACE.filters.type(['number', 'string'], value)){
				return filterValue(value);
			}
		}

		// var newDuration = function(duration, offset){

		// 	var options = {
		// 			'duration': filterValue(duration),
		// 			'offset': filterValue(offset)
		// 		},
		// 		abstractClient = enedScroll.Client(CLIENT.parentAsArray(), {top: CLIENT.selectors().top, bottom: 0}, options);
	
		// 	return abstractClient.progress(TRIGGER);

		// }

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
					'duration': filterValue(duration),
					'offset': filterValue(offset)
				},
				abstractClient = enedScroll.Client(CLIENT.parentAsArray(), {top: CLIENT.selectors().top, bottom: 0}, options);
	
			return abstractClient;

		}

		// var newDuration = function(duration){
		// 	if(duration){
		// 		if(INTERFACE.filters.type('number', duration)){
		// 			duration = duration.toString();
		// 		}
		// 		var percentage = duration.match(/(%)+/g);
		// 		duration = INTERFACE.filters.number(duration);
		// 		if( percentage ){
		// 			duration = (duration > 100) ? 100 : duration;
		// 			duration = (duration < 0) ? 0 : duration;
		// 			var progress = (CLIENT.progress(self.trigger) * (100 / duration));
		// 				progress = (progress > 1) ? 1 : progress,
		// 				progress = (progress < 0) ? 0 : progress;

		// 			return progress;
		// 		}else if( ! percentage ){
		// 			return CLIENT.progress(TRIGGER, modifyClient(duration));
		// 		}
		// 	}else{
		// 		return CLIENT.progress(TRIGGER);
		// 	}
		// }


		this.onUpdateHelper = function(abstract){
			
			var abstractClient = CLIENT;

			if(abstract){
				abstractClient = abstract;
			}

			return abstractClient.progress(TRIGGER);
		}



		/**
		 * Creation
		 */
		this.onUpdateCreation = function(creation){

			var onCreation = function(){
				if(creation){
					return creation();
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

	var CONFIG = {
		'show_all_selectors': false,
		'show_all_triggers': false,
		'color_selectors': 'red',
		'color_triggers': 'blue'	
	};
	enedScroll.option = function(){
		if(arguments.length){
			return Interface.extend(CONFIG, arguments[0]);
		}else{
			return Interface.extend({}, CONFIG);
		}
	};

	/**
	 * Create animation by function
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

		var plugins = proto.plugins = {};

		// SZABLON Pluginu
		//
		// plugins.listener = function(){
		// 	var output = {};

		// 	output.before = function(){ };
		// 	output.in = function(){ };
		// 	output.after = function(){ };
	
		// 	return self.loadHelper( output );
		// };

		plugins.creation = function(action, callback){
			var output = {};

			if( action && INTERFACE.filters.type('string', action) ){
				if( callback && INTERFACE.filters.type('function', callback) ){

					output.before = function(){
						if( action === 'before' ){
							return callback();
						}
					};
					output.in = function(){ 					
						if( action === 'in' ){
							return callback();
						}
					};
					output.after = function(){ 
						if( action === 'after' ){
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



		plugins.pin = function( target ){


			var controller = {};
			var module = {};
			var $ = getjQuery();

			var init = function(){

				controller.target = target;

				return module;
			};

			var currentParentHeight = 0;
			controller.setParent = function( parentHeight, timeline ){

				var className = 'enedScrollParent-';

				currentParentHeight = parentHeight;

				for( var keys in timeline ){
					
					var key = parseInt(keys, 10);
					var name = className + key;
					var item = timeline[key];

					if( $(document).find('.' + name).length === 0 ){

						var Parent = document.createElement( 'div' );

						currentParentHeight = (currentParentHeight - item.duration) + $(controller.target).outerHeight();
				
						Parent.className = name;
						Parent.style.width = '100%';
						Parent.style.position = 'relative';
						Parent.style.paddingTop = '0px';
						Parent.style.paddingBottom = item.duration + 'px';
						Parent.style.height = currentParentHeight + 'px';


						controller.pins[key].parent = {};
						controller.pins[key].parent.item = Parent;
						controller.pins[key].parent.height = ( (parentHeight - item.duration) + $(controller.target).outerHeight() );

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
					var parent = $('.enedScrollParent-' + key);
					var parentBefore = ( ! item.hasBefore && key == 0) ? false : $('.enedScrollParent-' + (key - 1));
					var parentAfter = ( ! item.hasAfter ) ? false : $('.enedScrollParent-' + (key + 1));



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
						controller.target[0].style.width = '100%';

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
							
							console.log( key );

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
						'state': state
					}

					var offset = ( key == 0 ) ? item.offset : ( item.offset - (timeline[(key - 1)].duration + timeline[(key - 1)].offset) );

					parentHeight = (parentHeight + item.duration + offset);
					
				}

				controller.setParent( parentHeight, timeline );
				controller.route( controller.pins );


			};

			return init();


		};


		plugins.pinOld_2 = function( target ){

			var functions = {};
			var controller = {};
			var pins = {};
			var $ = getjQuery();

			controller.target 	= null;
			pins.hasParent = false;

			var pinINIT = function(){

				if( INTERFACE.filters.type( [ 'object', 'string' ], target ) ){
					if( INTERFACE.filters.type( 'object', target ) ){
						controller.target = target[0];
					}
					if( INTERFACE.filters.type( 'string', target ) ){
						controller.target = document.getElementsByClassName(target);
					}
				}

				return functions;

			}


			functions.add = function( timeline ){

				var __NAMESPACE__ = 'enedScroll plugin Pin - add';

				pins.timeline = {};
				pins.parentHeight = 0;
				pins.length = 0;

				if( ! Array.isArray(timeline) ){
					return INTERFACE.throw( 'Timeline of ' + __NAMESPACE__ + ' must be an array.', 3 );
				}

				for( var index in timeline ){

					index = parseInt(index);

					timeline[index].duration = timeline[index].duration + (INTERFACE.get.height(controller.target));

					var abstract = self.abstract(timeline[index]),
						onUpdateHelper = self.onUpdateHelper(abstract);

					pins.timeline[index] = {
						'duration': timeline[index].duration,
						'offset': timeline[index].offset,
						'first': (index == 0) ? true : false,
						'last': (index == (timeline.length - 1)) ? true : false,
						'hasBefore': (timeline[ index - 1 ]) ? true : false,
						'hasAfter': (timeline[ index + 1 ]) ? true : false,
						'abstract': abstract,
						'onUpdateHelper': onUpdateHelper,
						'state': self.scrollStatus(abstract)
					}

					pins.parentHeight = (pins.parentHeight + timeline[index].duration + timeline[index].offset);
					pins.length++;

				}


				var parent = document.createElement('div');

					parent.className 				= 'pin123';
					parent.style.height 			= INTERFACE.get.height(controller.target) + 'px';
					parent.style.width 				= '100%';
					parent.style.paddingBottom 		= pins.parentHeight + 'px';

				var children = document.createElement('div');

					children.className 				= 'pin123-children';
					children.style.height 			= INTERFACE.get.height(controller.target) + 'px';
					children.style.width 			= '100%';

				if( ! document.getElementsByClassName('pin123').length ){

					controller.target.parentNode.insertBefore( parent, controller.target );
					parent.appendChild( children );
					children.appendChild( controller.target );

				}


				for( var index in pins.timeline ){

					var pin = pins.timeline[index];
				

					var CLIENT = pin.abstract;
					var a = pin.abstract.selectorsOffset(TRIGGER).top;
					var b = TRIGGER.margins.top;
					var c = INTERFACE.get.offsetTop();
					var d = CLIENT.selectorsPosition( TRIGGER ).top;
					var e = INTERFACE.get.offset( parent.className ).top;

				}

				createPins( pins, parent );

			}
			
			var createPins = function( properties, element ){

				var options = properties.timeline;

				for( var index in options ){

					var output = {};
					var pin = options[index];
					index = parseInt(index);

					output.before = function(){

						if( ( ! pin.hasBefore && index == 0 ) || ( pin.hasBefore && options[index - 1].state === 'after' ) ){
							
							var top = ( ( ! pin.hasBefore && index == 0 ) ) ? 0 : ( ( options[index - 1].duration + options[index - 1].offset ) );
							var bottom = ( ( ! pin.hasBefore && index == 0 ) ) ? properties.parentHeight : ( properties.parentHeight - ( options[index - 1].duration + options[index - 1].offset ) );
						
							addStyle( document.getElementsByClassName(element.className)[0], {
								'position': 'relative',
								'top': '0',
								'left': '0',
								'padding-top': top,
								'z-index': '100'
							});

							document.getElementsByClassName(element.className)[0].style.paddingBottom = bottom + 'px';

							controller.target.style.position = 'relative';
							controller.target.style.left = '0';
							controller.target.style.top = '0';


						}
						
						// addStyle( element, {
						// 	'position': 'relative',
						// 	'top': '0',
						// 	'left': '0',
						// 	'padding-top': '0',
						// 	'z-index': '100',
						// 	'padding-bottom': ( filterValue(options.duration) + parseInt(options.offset) ),
						// });
						
						// addStyle(pins.target, {
						// 	'position': 'relative',
						// 	'top': '0',
						// 	'left': '0',
						// 	'padding-top': '0',
						// 	'z-index': '100'
						// });
						
						//console.log( ( Interface.get.offset(controller.target.className).top ) );

					}

					output.in = function(){

						//console.log( 'a ' + (Interface.get.offset(controller.target.className).top - TRIGGER.margins.top) + ' b ' + window.scrollY );
						
						//console.log((Interface.get.offset(controller.target.className).top - document.body.getBoundingClientRect().top ) / 2);
						
						//console.log(controller.target.getBoundingClientRect().top);
						//console.log(controller.target.getBoundingClientRect().top - document.body.getBoundingClientRect().top);

						// if( abc == false){
						// 	abc = (Interface.get.offset(controller.target.className).top - document.body.getBoundingClientRect().top ) / 2;
						// }

						//console.log( Math.floor(Interface.get.offset(controller.target.className).top) );
						//console.log( options[index].abstract.selectorsOffset(TRIGGER).top );



						var CLIENT = options[index].abstract;
						var a = options[index].abstract.selectorsOffset(TRIGGER).top;
						var b = TRIGGER.margins.top;
						var c = INTERFACE.get.offsetTop();
						var d = CLIENT.selectorsPosition( TRIGGER ).top;
						var e = INTERFACE.get.offset( element.className ).top;

					

						//console.log( INTERFACE.get.offset( 'pin123-children').top + ( c - d ) );
						
						//console.log( c - CLIENT.selectorsPosition( TRIGGER ).top );

						//console.log( CLIENT.selectorsAbstract().top + ( c - d ) );

						// e + ( c - d )
						

						addStyle( controller.target, {
							'position': 'fixed',
							'top': INTERFACE.get.offset( 'pin123-children').top + ( c - d ),
							'left': Interface.get.offset(controller.target.className).left,
							'padding-top': '0',
							'z-index': '100',
						});

					}
					output.after = function(){

						if( ( ! options[index].hasAfter && index === (properties.length - 1)) || (options[index].hasAfter && options[index + 1].state === 'before') ) {
							var top = ( ( ! pin.hasAfter && index === (properties.length - 1)) ) ? properties.parentHeight : ( properties.parentHeight - ( options[index + 1].duration + options[index + 1].offset ) );
							var bottom = ( ( ! pin.hasAfter && index === (properties.length - 1)) ) ? 0 : ( ( options[index + 1].duration + options[index + 1].offset ) );
							
								// addStyle( element, {
								// 	'position': 'relative',
								// 	'top': top,
								// 	'left': '0',
								// 	'padding-top': '0',
								// 	'z-index': '100'
								// });

							controller.target.style.position = 'relative';
							controller.target.style.left = '0';
							controller.target.style.top = '0';

							document.getElementsByClassName(element.className)[0].style.paddingTop = top + 'px';
							document.getElementsByClassName(element.className)[0].style.paddingBottom = bottom + 'px';

						}

					}

					self.loadHelper(output, options[index].abstract);

				}

			}

			return pinINIT();

		}
		plugins.pinOLD = function(name, target, options){
			var output = {};
				myName = self.abstract(options),
				onUpdateHelper = self.onUpdateHelper(myName);

			var iscreate = false;

			var before = true, after = true;
			if(options && options.before === false){
				before = false;
			}
			if(options && options.after === false){
				after = false;
			}

			if(pinLeft == 0){
				pinLeft = INTERFACE.get.offset(target[0].className).left;
			}

			// if(document.getElementsByClassName(name).length){
			// 	var parent = target[0].parentNode;
			// 	parent.style.paddingBottom = (filterValue(options.duration) + parseInt(options.offset)) + 'px';
				
			// }
			console.log(iscreate);
			if(!iscreate){
				var newElement = document.createElement('div');
				newElement.className = name;
				newElement.style.height = INTERFACE.get.height(target[0]) + 'px';
				newElement.style.width = '100%';
				newElement.style.paddingBottom = (filterValue(options.duration) + parseInt(options.offset)) + 'px';
				target[0].parentNode.insertBefore(newElement, target[0]);
				newElement.appendChild(target[0]);
				iscreate = true;
			}

			output.before = function(){
				if(before){
					addStyle(target[0].parentNode, {
						'position': 'relative',
						'padding-top': '0',
						'z-index': '100',
						'padding-bottom': filterValue(options.duration),
						'text-align': 'center'
					});
					addStyle(target[0], {
						'position': 'relative',
						'z-index': '100',
						'left': '0',
						'top': '0',
						'margin-top': '0',
						'margin-bottom': '0'
					});
					pinTop = 0;
				}
			};
			output.in = function(){	
				
				if(pinTop == 0){
					pinTop = Interface.get.offset(target[0].className).top;
				}
				
				if(isAfter){
					isIN = true;
				}
				
				addStyle(target[0], {
					'position': 'fixed',
					'top': Math.floor(pinTop),
					'left': pinLeft,
					'margin-top': 0
				});

				
			};
			output.after = function(){
				if(isIN && isAfter){
					isIN = false;
					console.log(isIN);
				}
				if(!isIN){
					isAfter = true;
					pinTop = 0;
					addStyle(target[0].parentNode, {
						'position': 'relative',
						'padding-bottom': '0',
						'padding-top': filterValue(options.duration) + parseInt(options.offset),
						'z-index': '100',
					});
					addStyle(target[0], {
						'position': 'relative',
						'z-index': '100',
						'left': '0',
						'top': '0'
					});
				}
			};
	
			return self.loadHelper( output, myName );
		};

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

		proto.collection = function(value, options, callback){

			for(var x = 0;x <= (options.repeat - 1); x++){
				var before = false;
				var after = false;
				var helperOptions = { duration: options.duration, offset: (parseInt(options.offset) + (parseInt(options.bound) * x)), before: before, after: after }
				
				var output = proto.getValue(value, helperOptions);
				//console.log(output);
				callback(output);
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
	enedScroll.Trigger = function( options ){

		"use strict";

		var __NAMESPACE__ 	= 'enedScroll.Trigger',
			INTERFACE 		= Interface,
			CONFIG 			= { 
								margins: { top: 0, left: 0 },
								types: ['string'],
								name: options.name
							  },
			TRIGGER 		= {};

		if( ! CONFIG.name ){
			return INTERFACE.throw( 'Name of element in ' + __NAMESPACE__ + ' is required', 3 );
		}
		if( ! INTERFACE.filters.type( CONFIG.types, CONFIG.name ) ){
			return INTERFACE.throw( 'Type of element in ' + __NAMESPACE__ + ' must be a string', 3 );
		}
		
		// Throw new Exception about wrong type of margins
		if( ! INTERFACE.filters.type( 'object', options.margins ) && options.margins ){
			INTERFACE.throw( 'Margins of trigger in ' + __NAMESPACE__ + ' must be an array. Set default [0,0]', 2 );
		}
		if( options.margins || INTERFACE.filters.type( 'object', options.margins ) ){
			CONFIG.margins = options.margins;
		}

		TRIGGER.progress = function(){
			return (INTERFACE.get.offsetTop() + TRIGGER.margins.top);
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
			CLIENT 			= {
				get: {}
			};

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
		 * Float set percentage value of parent height
		 */
		CLIENT.segment = function(value){
			var segment = 100;
			if(value){
				if(value > 0 && value <= 100){
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

			if( selectors.top > 0 ){
				state = 'before';
			}else if( selectors.top <= 0 && selectors.bottom >= 0 ){
				state = 'in'
			}else{
				state = 'after';
			}

			return state;
		};
		CLIENT.progress = function(trigger, newSelectorsOffset){
			var selectors = (newSelectorsOffset && INTERFACE.filters.type('object', newSelectorsOffset)) ? newSelectorsOffset : CLIENT.selectorsOffset(trigger),
				progress = (selectors.top / (selectors.top - selectors.bottom)),
				guard = (progress < 0 ) ? 0 : (progress >= 0 && progress <= 1) ? progress : 1;
			return guard;
		};

		return CLIENT;

	}




	enedScroll.Visual = function(included, options){

		var TRIGGER 	= null,
			CLIENT 		= null,
			OPTIONS 	= {};

		var onShow = function(){
			
			if( OPTIONS['show_all_triggers'] ){
				var trigger = document.createElement('div');
				trigger.className = TRIGGER.name;
				document.body.appendChild(trigger);
				Interface.css( trigger, {
					'position': 'fixed',
					'z-index': '99999',
					'width': '70px',
					'height': '1px',
					'background-color': 'red',
					'top': TRIGGER.margins.top
				});
			}		

			if( OPTIONS['show_all_triggers'] ){

				var selectorTop 	= document.createElement('div'),
					selectorBottom 	= document.createElement('div'),
					parent 			= CLIENT.parent();

				selectorTop.className = 'enedScroll-visual-selector';
				selectorBottom.className = 'enedScroll-visual-selector';

				if(parent.childNodes[0]){
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
					'z-index': '99999',
					'width': '100%',
					'height': '1px',
					'background-color': 'red',
					'top': CLIENT.selectors().top,
					'left': '0'
				});
				Interface.css( selectorBottom, {
					'position': 'absolute',
					'z-index': '99999',
					'width': '100%',
					'height': '1px',
					'background-color': 'red',
					'bottom': CLIENT.selectors().bottom,
					'left': '0'
				});

			}

		}

		if( included && options ){
			if( included.client && included.trigger ){
				TRIGGER = included.trigger;
				CLIENT = included.client;
				OPTIONS = options;
				onShow();
			}
		}

	}




	var Interface = enedScroll.Interface = (function(window){

		"use strict";

		var CORE = {};

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


		var filters = CORE.filters = {};
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
							if( type.indexOf(typeof elements[x]) === 0 ||  type.indexOf(typeof elements[x]) === 1){
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

		return CORE;

	})(window);

	return enedScroll;

}));