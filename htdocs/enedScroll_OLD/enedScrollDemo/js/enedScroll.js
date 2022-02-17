/**
	* enedScroll Plugin
	* Author: Cameolon
	* Tags: jquery, enedScroll, scroll, 
	* Url: http://enedscroll.eu/
	* Docs: http://enedscroll.eu/documentation.php
	* License: read LICENSE
*/
if (typeof jQuery === 'undefined') {
  throw new Error('enedScroll\'s JavaScript requires jQuery')
}

(function (root, factory) {

	"use strict";

	if (typeof define === 'function' && define.amd) {
		// AMD. Register as an anonymous module.
		define(factory);
	} else if (typeof exports === 'object') {
		// CommonJS
		module.exports = factory();
	} else {
		// Browser globals (root is window)
		root.enedscroll = factory(root.jQuery);
	}

}(this, function($) {

	'use strict';


	/*
		Check jQuery version
		Should be > 1.9.1 && < 4
	*/
	var version = $.fn.jquery.split(' ')[0].split('.')
	if ((version[0] < 2 && version[1] < 9) || (version[0] == 1 && version[1] == 9 && version[2] < 1) || (version[0] > 3)) {
		throw new Error('enedScroll\'s JavaScript requires jQuery version 1.9.1 or higher, but lower than version 4')
	}


	/*
		Get to init prototype function
		Add default options for plugin
	*/
	function enedScroll(){

		'use strict';

		this.init();
		this.options = $.extend({}, this.constructor.defaults);
	}


	/*
		Default enedScroll's options
	*/
	enedScroll.defaults = {
		'enedPosition': 		'70px',
		'enedSetColor': 		false,
		'selectorsSetColor': 	false,
		'enedColor': 			'orange',
		'selectorsColor': 		'red',
		'z-index': 				'99999'
	}

	/*
		Change default options by user
		return array
	*/
	enedScroll.prototype.option = function(options){

		"use strict";

		return $.extend(this.options, options);
	};

	/*
		Add div with class .ened which 
		determine the position of the document
	*/
	enedScroll.prototype.init = function(options){

		"use strict";

		var self = this;
		$(document).ready(function(){
			self.style();
		});
		$('body').append('<div class="ened"></div>');
	};

	/*
		Add style to head using enedScroll default options
	*/
	enedScroll.prototype.style = function(){

			"use strict";

			/* Check if value of key enedSetcolor is true or false then add color for div or not */
		var enedColor 		= (this.options['enedSetColor']) 		? this.options['enedColor'] 		: 'transparent',
			/* Check if value of key selectorsSetColor is true or false then add color for div or not */
			selectorsColor 	= (this.options['selectorsSetColor']) 	? this.options['selectorsColor'] 	: 'transparent',
			values 			= {
								/* Div which is added by function init() */
								'.ened': {
									'position'			: 'fixed',
									'z-index'			: this.options['z-index'],
									'top' 				: this.options['enedPosition'],
									'right' 			: '0',
									'width' 			: '55px',
									'height' 			: '1px',
									'background-color' 	: enedColor
								},
								/* Top div's selector */
								'._ens': {
									'position' 			: 'absolute',
									'z-index'			: this.options['z-index'],
									'width'				: '100%',
									'height' 			: '1px',
									'top' 				: '0',
									'left' 				: '0',
									'background-color' 	: selectorsColor	
								},
								/* Bottom div's selector */
								'._ene': {
									'position' 			: 'absolute',
									'z-index'			: this.options['z-index'],
									'width'				: '100%',
									'height' 			: '1px',
									'bottom' 			: '0',
									'left' 				: '0',
									'background-color' 	: selectorsColor
								}
							},
							/* String to get values array by string */
							styleString = '';

		/* 
			Prepare array values to add it to head 
			Convert from array to string
		*/
		$.each(values, function(k,v) {

			"use strict";

			var j = JSON.stringify(v).replace(/\"/g, "").replace(/\,/g, ";");
			styleString = styleString + k + j + ' ';
		});

		$('head').append('<style type="text/css">' + styleString.toString() + '</style>');
	};

	/*
		(array) element
		Add (array) elements
		Add (array) element to (array) parentCache
		parentCache options for element e.g location, selectors, type etc.
	*/
	function __enedScroll(element){

		'use strict';

		this.elements = [];
		this.parentCache = element;

	}

	$.extend(__enedScroll.prototype, {
		/*
			Get each item from (array) items 
			Prepare data ( helpers, num, this ) to return in function

			return (object) function
		*/
		call: function(){

			"use strict";

			var $this = this;

			$.each(this.elements, function(key, value){

				"use strict";

				/* Get div element from "location" key in (array) elements */
			var $self 		= value.location.find(value.name),
				/* Item options from (array) elements */
				$value 		= value,
				$actions 	= value.actions;

			/* React on scrolling */
			$(document).on('scroll touchmove touchstart touched mousewheel DOMmousewheel', function(e) {

				"use strict";

				/* Get "top selector" position */
				$value.selectors.top = $self.offset().top + value.manipulate[0];
				/* Get "bottom selector" position */
				$value.selectors.bottom = ($self.offset().top + $self.outerHeight()) + value.manipulate[1];

						/* div.ened position */
				var 	$pickerTop 			= $('.ened').offset().top,
						$startElementTop	= $value.selectors.top,
						$endElementTop		= $value.selectors.bottom,
						heightFull 			= $endElementTop - $startElementTop;

				/* Method to get $pickerTop position on mobile devices */
				var mobile = /webkit|safari|opera|msie|mozilla.*mobile/i.test(navigator.userAgent),
					safariMobile = /safari.*mobile/i.test(navigator.userAgent),
					operaMobile = /opera.*mobile/i.test(navigator.userAgent),
					msieMobile = /msie.*mobile/i.test(navigator.userAgent),
					mozillaMobile = /mozilla.*mobile/i.test(navigator.userAgent);

				if(mobile){
					
					var scroll;

					if($(document).height() > $(window).height()){
						scroll = window.scrollY;
					}else if($(document).width() > $(window).width()){
						scroll = window.scrollX;
					}else{
						scroll = 0;
					}

					/* If is mobile uses this var which used window.scrollY */
					$pickerTop = parseInt(enedscroll.options.enedPosition, 10) + scroll;

				}

					/* (int) var //  Progress */
				var partPer 	= (((($pickerTop - $startElementTop) * 10) / heightFull) / 10),
					/* (int) var // if div.ened is before element add for (progress) partPer value 0 */
					part 		= (partPer < 0.0001) ? 0 : partPer,
					/* (array) var */
					inset		= {
						before: false,
						after: false,
						focused: false
					};

					/*
						Verify if div.ened is before, in or after element
					*/

					if(part >= 1 && $pickerTop > $endElementTop)
					{	
						// After
						part = 1;
						inset.after = true;
					}
					if(part <= 0 && $pickerTop < $startElementTop){
						// Before
						inset.before = true;
					}
					if(part > 0 && part < 1){
						// In
						inset.focused = true;
					}


					/* 
						Helpers
							- private // using to prepare data values
							- public // return in data

					*/
					var helpernum 	= false,
						helpers 	= {
							private: {
								/* 
									Prepare (int) progress if key is (int) in actions

									(int) val1
									return (int) value
								 */
								getPosVal: function(val1){

									"use strict";

									var num 	= part,
										pos 	= val1,
										value 	= (((-pos) * (1 / (1 - pos))) + (num * (1 / (1 - pos))));

									helpernum = value;
									return value;
								}
							},
							public: {
								/*
									Progress from (int) start value e.g 5 to (int) end value 20

									(array) val1 // [start_value, end_value]
									return (int) value
								*/
								getVal: function(val1){

									"use strict";

										/* (int) progress of element value  */
									var num 	= (!helpernum) ? part : helpernum,
										start 	= (!val1[0]) ? 0 : val1[0],
										end 	= (!val1[1]) ? 0 : val1[1],

										/* Conditions to set correct (int) progress value */
										progress1 = (start + (end * (num))),
										progress2 = (start + (-(start) * (num))),
										progress3 = (start + ((end - start) * (num))),
										progress4 = (start + (-(start - end) * (num))),
										progress5 = (start + ((end * 2) * (num))),
										progress7 = (start + ((end - start) * (num))),

										value;

									if(num < 0.001){
										value = start;
									}
									if(num > 0.001 && num < 0.99){
										if(start === 0 && end > 0){
											value = progress1;
										}
										if(start > 0 && end === 0){
											value = progress2;
										}
										if(start > 0 && end > 0 && start < end){
											value = progress3;
										}
										if(start > 0 && end > 0 && end < start){
											value = progress4;
										}

										if(start === 0 && end < 0){
											value = progress1;
										}
										if(start < 0 && end === 0){
											value = progress2;
										}
										if(start < 0 && end < 0 && start < end){
											value = progress3;
										}
										if(start < 0 && end < 0 && start > end){
											value = progress4;
										}

										if(start > 0 && end < 0 && start === (-end)){
											value = progress5;
										}
										if(start < 0 && end > 0 && (-start) === end){
											value = progress5;
										}

										if(start > 0 && end < 0 && start != (-end)){
											value = progress7;
										}
										if(start < 0 && end > 0 && (-start) != end){
											value = progress7;
										}
									}
									if(num > 0.99){
										value = end;
									}
									
									return value;

								},
								/* Pin helper to create pinning animations */
								pin: {
									/* 
										(array) val1
										(int) val2
									 */
									before: function(val1, val2){

										"use strict";

										var parent 		= (!val1.parent) ? false : val1.parent,
											item 		= (!val1.item) ? false : val1.item,
											duration 	= (!val2 || !$.isNumeric(val2)) ? false : val2;

										if(!parent || !item || !duration){
											return;
										}
										
										var childrens = $(parent).find(item),
											childrensEndPos = ($value.manipulate[0] != $value.manipulate[1]) ? $value.manipulate[0] : 0;
										$(parent).css({'max-height': childrens.height(), 'padding-top': '0', 'padding-bottom': duration + 'px'});
										$(childrens).css({'position': 'relative', 'top': '0px'});
										
									},
									/* 
										(array) val1
										(int) val2
									 */
									set: function(val1, val2){

										"use strict";

											var parent 		= (!val1.parent) ? false : val1.parent,
												item 		= (!val1.item) ? false : val1.item,
												index 		= (!val1.index) ? 1 : val1.index,
												duration 	= (!val2 || !$.isNumeric(val2)) ? false : val2;

											if(!parent || !item || !duration){
												return;
											}
											
											var childrens 			= $(parent).find(item),
												childrensEndPos 	= ($value.manipulate[0] != $value.manipulate[1]) ? $value.manipulate[0] : 0,
												defaultTop 		= (parseInt(enedscroll.options.enedPosition, 10) - $value.manipulate[0]);
											
											$(parent).css({'margin-bottom': childrens.height(), 'padding-top': (duration * index) + 'px', 'padding-bottom': (duration - (duration * index)) + 'px'});
											$(childrens).css({'position': 'fixed', 'top': (index != 1) ? -((((duration * index) + (parseInt(enedscroll.options.enedPosition, 10))) / 10) + 20) : defaultTop + 'px'});
													
									},
									/* 
										(array) val1
										(int) val2
									 */
									after: function(val1, val2){

										"use strict";

										var parent 		= (!val1.parent) ? false : val1.parent,
											item 		= (!val1.item) ? false : val1.item,
											index 		= (!val1.index) ? 1 : val1.index,
											duration 	= (!val2 || !$.isNumeric(val2)) ? false : val2;

										if(!parent || !item || !duration){
											return;
										}
										
										var childrens = $(parent).find(item),
											childrensEndPos = ($value.manipulate[0] != $value.manipulate[1]) ? (-$value.manipulate[0]) : 0,
											childrensEndPos = (childrensEndPos != 0 && $value.manipulate[1] != 0) ? (childrensEndPos + $value.manipulate[1]) : childrensEndPos;

										
										$(parent).css({'max-height': childrens.height(), 'padding-top': (duration * index) + 'px', 'padding-bottom': (duration - (duration * index)) + 'px'});
										$(childrens).css({'position': 'relative', 'top':  childrensEndPos + 'px'});

									}
								}
							}
					}

					/* Add to (array) inset position of selectors */
					inset.selectors = {
						'top': $value.manipulate[0],
						'bottom': $value.manipulate[1]
					}

					$.each($actions, function(k, v) {

						"use strict";

						var value = (k > 1 && $.isNumeric(k)) ? (k / 100) : k,
							numeric = ($.isNumeric(value) && value > 0.01) ? helpers.private.getPosVal(value) : part,
							data = {
								'this'	  : $this.parentCache.constructor,
								'num'	  : Math.round(numeric * Math.pow(10, 5)) / Math.pow(10, 5),
								'params'  : inset,
								'helpers' : helpers.public
							};

						/* return (object) function if div.ened is before element */
						if(value === 'before'){
							if(part <= 0){
								v(data);
							}
						}
						/* return (object) function if div.ened is after element */
						if(value === 'after'){
							if(part >= 1){
								v(data);
							}
						}
						/* return (object) function if div.ened is in element */
						if(value === 'focusin'){
							if(inset.focused){
								v(data);
							}
						}

						/* return (object) function if div.ened get (int) progress value of element */
						if($.isNumeric(value)){
							value = Math.round(value * Math.pow(10, 15)) / Math.pow(10, 15);
							if(value == 1){
								value = 0.99;
							}
							if(value == 0){
								value = 0.0001;
							}
							if(part >= value && inset.focused){
								v(data);
							}
						}
					});

			});
			});
		},
		/* Prepare selector by setSelectors function and call to call function */
		get: function(){
			
			"use strict";

			this.setSelectors();
			this.call();

		},
		/* Add selectors for item */
		setSelectors: function(){

			"use strict";

			var $self = this;

			$.each($self.elements, function(key, value){

				"use strict";

				var item 	= value.location.find(value.name),
					top 	= item.offset().top,
					bottom 	= top + $(item).outerHeight();

				/* Add selectors position to (array) */
				$self.elements[key].selectors = {
					'top'		: (top + value.manipulate[0]),
					'bottom' 	: (bottom + value.manipulate[1]),
				}

				/* Add html selectors if selectorsSetColor key in default options has true */
				if(enedscroll.options.selectorsSetColor){
				  if(!value.selectors.set || typeof value.selectors.set === 'undefined'){
					if(!item.find($('._ens')).length && !item.find($('._ene')).length){

						item.css({'position': 'relative'});
						item.prepend('<div class="_ens"></div>');
						item.append('<div class="_ene"></div>');

						if(value.manipulate[0] != 0){
							item.find('._ens').css({'top': value.manipulate[0] + 'px'});
						}
						if(value.manipulate[1] != 0){
							item.find('._ene').css({'bottom': -(value.manipulate[1]) + 'px'});
						}
						value.selectors.set = true;

					}
				  }
				}

				
			});

			
		},
		/*
			Add to (array) parentCache (array) actions
			Add to (array) elements item with parent type

			(array) actions
		*/
		set: function(actions){

			"use strict";

			this.parentCache.actions = actions;
			this.elements.push(this.parentCache);

		},
		/*
			Function build
			{parent_class, child_class, selectors, style}, function(){}

			(object) || (string) parent_class
			(string) child_class
			(array) selectors
			(array) style
		*/
		addSpace: function(param1, callback){

			"use strict";

				/* Check if parent_class is object or string */
			var childParent 	= (typeof param1[0] === 'object' && typeof param1[0] !== 'string') ? param1[0] : $(param1[0]),
				childClass 		= param1[1],
				childPos 		= (param1[2]) ? param1[2] : [0,0],
				childStyle 		= (param1[3]) ? param1[3] : false,
				childActions 	= callback;

			/* Add <div> with child_class to $(parent_class) */
			childParent.append('<div class="' + childClass + '"></div>');
			/* If style exists add for added <div> */
			if(childStyle){
				childParent.find('.' + childClass).css(childStyle);
			}

			/* Add item options to (array) elements with child type */
			this.elements.push({
				name 			: childParent.find('.' + childClass)[0],
				constructor 	: childParent.find('.' + childClass),
				childClass 		: childClass,
				location 		: childParent,
				actions 		: childActions,
				manipulate		: childPos,
				type 			: 'child'
			});
		}
	});
	

	/*
		(array) $l // Array of elements using .ened() function
		(int) $counter // Integer needed for $l var as key
	*/
	var $l = {}, $counter = 0;

	$.fn.extend({
		/**
			Function which call to __enedScroll class,
			Add item to (array) $l to sort all items using "ened" function

			Read about "set" function 
			http://enedscroll.eu/documentation.php#ened

			(array) position // default [0,0]
		*/
		ened: function(param1){

			"use strict";

			return $.each(this, function(k,v){

				"use strict";

				/* Change or set default selectors position */
				var pos = (param1 && $.isArray(param1)) ? param1 : [0,0],
					a = {
						name: v, // Item
						constructor: $(this), // constructor == name
						location: $(document),
						manipulate: pos, // Position of element
						selectors: {}, // Items selectors
						type: 'parent' // 2 types exists. Parent and child. Child items can be added by .addSpace function
					};

				/* Add for item data-ened-key html tag */
				$(this).attr('data-ened-key', $counter);

				/* Add to array new enedScroll class */
				$l[$counter] = new __enedScroll(a);

				$counter++;

			});
		},
		/*
			Actions to call if div.ened is in element

			Read about "set" function 
			http://enedscroll.eu/documentation.php#set

			(array) actions
		*/
		set: function(actions){

			"use strict";

			return $.each(this, function(k,v){

				"use strict";

				var key = $(this).attr('data-ened-key');
				try{
					if(typeof key === 'undefined' || key == null || !key){

						/* Throw error to console if html tag data-ened-ket not exists */
						throw new Error('enedScroll key is not defined for .' + $(this)[0].className);

					}else{
						if(typeof actions === 'undefined' || actions == null || !actions){
							actions = function() {};
						}
						$l[key].set(actions);
					}
				}catch(error){
					console.log(error);
				}

			});
		},
		/*
			Read about "addSpace" function 
			http://enedscroll.eu/documentation.php#addSpace

			(array) 	param1	// {parent,class_name,selectors,(array)css}
			(object) 	param2 	// function
		*/
		addSpace: function(param1, param2){

			"use strict";

			return $.each($(this), function(k,v){

				"use strict";

				var key = $(this).attr('data-ened-key');
				try{
					if(typeof key === 'undefined' || key == null || !key){
						
						/* Throw error to console if html tag data-ened-ket not exists */
						throw new Error('enedScroll key is not defined for .' + $(this)[0].className);
					
					}else{

						$l[key].addSpace(param1, param2);

					}
				}catch(error){
					console.log(error);
				}

			});
		},
		/* 
			Prepare selectors and events for element

			Read about "get" function 
			http://enedscroll.eu/documentation.php#get

		*/
		get: function(){

			"use strict";

			return $.each($(this), function(k,v){

				"use strict";

				var key = $(this).attr('data-ened-key');
				try{
					if(typeof key === 'undefined' || key == null || !key){
						
						/* Throw error to console if html tag data-ened-ket not exists */
						throw new Error('enedScroll key is not defined for .' + $(this)[0].className);
					
					}else{
						
						$l[key].get();

					}

				}catch(error){
					console.log(error);
				}

			});	
		}
	});

	/* New enedScroll class which gives option to change plugin default options */
	return new enedScroll();
}));