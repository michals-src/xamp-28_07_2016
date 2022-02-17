/**
 * enedScroll v1.0.0
 * enedScroll.com
 * 
 * LICENSE enedScroll
 * 
 */
if (typeof jQuery === 'undefined') {
  throw new Error('enedScroll\'s JavaScript requires jQuery')
}

(function (root, factory) {
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

	var version = $.fn.jquery.split(' ')[0].split('.')
	if ((version[0] < 2 && version[1] < 9) || (version[0] == 1 && version[1] == 9 && version[2] < 1) || (version[0] > 3)) {
		throw new Error('enedScroll\'s JavaScript requires jQuery version 1.9.1 or higher, but lower than version 4')
	}

	function enedScroll(){
		this.init();
		this.options = $.extend({}, this.constructor.defaults);
	}

	enedScroll.defaults = {
		'enedPosition': 		'70px',
		'enedSetColor': 		false,
		'selectorsSetColor': 	false,
		'enedColor': 			'orange',
		'selectorsColor': 		'red',
		'z-index': 				'99999'
	}

	enedScroll.prototype.option = function(options){
		return $.extend(this.options, options);
	};

	enedScroll.prototype.init = function(options){
		var self = this;
		$(document).ready(function(){
			self.style();
		});
		$('body').append('<div class="ened"></div>');
	};
	enedScroll.prototype.style = function(){
		var enedColor 		= (this.options['enedSetColor']) 		? this.options['enedColor'] 		: 'transparent',
			selectorsColor 	= (this.options['selectorsSetColor']) 	? this.options['selectorsColor'] 	: 'transparent',
			values 			= {
								'.ened': {
									'position'			: 'fixed',
									'z-index'			: this.options['z-index'],
									'top' 				: this.options['enedPosition'],
									'right' 			: '0',
									'width' 			: '55px',
									'height' 			: '1px',
									'background-color' 	: enedColor
								},
								'._ens': {
									'position' 			: 'absolute',
									'z-index'			: this.options['z-index'],
									'width'				: '100%',
									'height' 			: '1px',
									'top' 				: '0',
									'left' 				: '0',
									'background-color' 	: selectorsColor	
								},
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
							styleString = '';

		$.each(values, function(k,v) {
			var j = JSON.stringify(v).replace(/\"/g, "").replace(/\,/g, ";");
			styleString = styleString + k + j + ' ';
		});

		$('head').append('<style type="text/css">' + styleString.toString() + '</style>');
	};


	function __enedScroll(element){

		this.elements = [];
		this.parentCache = element;


		// Przenieść do funkcji set
		// if(typeof this.selector.set === 'undefined' || this.selector.set === null || !this.selector.set){
		// 	this.selectors([0,0]);
		// }

	}

	$.extend(__enedScroll.prototype, {
		call: function(){

			var $this = this;

			$.each(this.elements, function(key, value){

			var $self 		= value.location.find(value.name),
				$value 		= value,
				$actions 	= value.actions;


			$(document).on('scroll touchmove touchstart touched mousewheel DOMmousewheel', function(e) {

				$value.selectors.top = $self.offset().top + value.manipulate[0];
				$value.selectors.bottom = ($self.offset().top + $self.outerHeight()) + value.manipulate[1];

				var 	$pickerTop 			= $('.ened').offset().top,
						$startElementTop	= $value.selectors.top,
						$endElementTop		= $value.selectors.bottom,
						heightFull 			= $endElementTop - $startElementTop;

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

					$pickerTop = 70 + scroll;

				}

				var partPer 	= (((($pickerTop - $startElementTop) * 10) / heightFull) / 10),
					part 		= (partPer < 0.0001) ? 0 : partPer,
					inset		= {
						before: false,
						after: false,
						focused: false
					};

					if(part >= 1 && $pickerTop > $endElementTop)
					{
						part = 1;
						inset.after = true;
					}
					if(part <= 0 && $pickerTop < $startElementTop){
						inset.before = true;
					}
					if(part > 0 && part < 1){
						inset.focused = true;
					}

					var helpernum 	= false,
						helpers 	= {
							private: {
								getPosVal: function(val1){

									var num 	= part,
										pos 	= val1,
										value 	= (((-pos) * (1 / (1 - pos))) + (num * (1 / (1 - pos))));

									// Wartości dalej są tworzone przy użyciu getVal
									helpernum = value;
									return value;
								}
							},
							public: {
								getVal: function(val1){
									/*
										@param (array) val1 => początkowa i końcowa cyfra
									*/
									var num 	= (!helpernum) ? part : helpernum,
										start 	= (!val1[0]) ? 0 : val1[0],
										end 	= (!val1[1]) ? 0 : val1[1],

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
										/* od 0 do góry dodatnie */
										if(start === 0 && end > 0){
											value = progress1;
										}
										/* od dodatniej wartości do 0 */
										if(start > 0 && end === 0){
											value = progress2;
										}
										/* do startu wartość rośnie dodatnia */
										if(start > 0 && end > 0 && start < end){
											value = progress3;
										}
										/* do startu wartość maleje dodatnia */
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

										/* wartość z dodatniej do minusowej start === końcowa wartość */
										if(start > 0 && end < 0 && start === (-end)){
											value = progress5;
										}
										/* wartość z minusowej do dodatniej start === końcowa wartość */
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
								pin: {
									before: function(val1, val2){
										/*
											({parent, item}, duration)
										*/
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
									set: function(val1, val2){
										/*
											({parent, item}, duration)
										*/
										
											var parent 		= (!val1.parent) ? false : val1.parent,
												item 		= (!val1.item) ? false : val1.item,
												index 		= (!val1.index) ? 1 : val1.index,
												duration 	= (!val2 || !$.isNumeric(val2)) ? false : val2;

											if(!parent || !item || !duration){
												return;
											}
											
											var childrens 			= $(parent).find(item),
												childrensEndPos 	= ($value.manipulate[0] != $value.manipulate[1]) ? $value.manipulate[0] : 0,
												defaultTop 		= (parseInt(enedscroll.options.enedPosition) - $value.manipulate[0]);
											
											$(parent).css({'margin-bottom': childrens.height(), 'padding-top': (duration * index) + 'px', 'padding-bottom': (duration - (duration * index)) + 'px'});
											$(childrens).css({'position': 'fixed', 'top': (index != 1) ? -((((duration * index) + (parseInt(enedscroll.options.enedPosition))) / 10) + 20) : defaultTop + 'px'});
											
											//console.log((((($(childrens).position().top * index) - defaultTop) / 2) * index) + 20);
											//console.log($(childrens).position().top);
											//console.log((($(childrens).position().top * index) + (parseInt(enedscroll.options.enedPosition))) / 10);
										
									},
									after: function(val1, val2){
										/*
											({parent, item}, duration)

											opcja top z indexem
										*/
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


					inset.selectors = {
						'top': $value.manipulate[0],
						'bottom': $value.manipulate[1]
					}

					$.each($actions, function(k, v) {
						/*
							Usunięcie z helpers.pin dla funkcji before pin.focusin i after 
							Usunięcie z helpers.pin dla funkcji after pin.focusin i before 
							Usunięcie z helpers.pin dla funkcji focusin pin.before i after 

							Usunięcie z before,after funkcji getVal
						*/
						var value = (k > 1 && $.isNumeric(k)) ? (k / 100) : k,
							numeric = ($.isNumeric(value) && value > 0.01) ? helpers.private.getPosVal(value) : part,
							data = {
								'this'	  : $this.parentCache.constructor,
								'num'	  : Math.round(numeric * Math.pow(10, 5)) / Math.pow(10, 5),
								'params'  : inset,
								'helpers' : helpers.public
							};

						/*
							!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
							!!!!!! Stworzenie jednej funkcji odpowiedzialnej za focusin, before, after !!!!!!
							!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
						*/

						if(value === 'before'){
							/* Zamiast używać 0.00 - podstawowe wartości przed najechaniem na element */
							if(part <= 0){
								v(data);
							}
						}
						if(value === 'after'){
							/* Zamiast używać 0.99 - podstawowe wartości po przejechaniu elementu */
							if(part >= 1){
								v(data);
							}
						}
						if(value === 'focusin'){
							/* Wywołanie funkcji po natychmiastowym najechaniu */
							if(inset.focused){
								v(data);
							}
						}

						/* 
							Zwrócenie funkcji przy osiągnięciu podanej wartości
							jeżeli {value} jest cyfrą.
						*/
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
			}); // each
		},
		get: function(){
			
			this.setSelectors();
			this.call();

		},
		setSelectors: function(){

			var $self = this;

			$.each($self.elements, function(key, value){

				var item 	= value.location.find(value.name),
					top 	= item.offset().top,
					bottom 	= top + $(item).outerHeight();

				$self.elements[key].selectors = {
					'top'		: (top + value.manipulate[0]),
					'bottom' 	: (bottom + value.manipulate[1]),
				}

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
		set: function(actions){

			this.parentCache.actions = actions;
			this.elements.push(this.parentCache);

			// this.selectors.push({
			// 	'top'		: (this.element.constructor.offset().top + this.element.manipulate[0]),
			// 	'bottom' 	: ((this.element.constructor.offset().top + this.element.constructor.outerHeight()) + this.element.manipulate[1]),
			// });

			//this.setSelectors(true);

			//;this.actions = actions;

			//this.call();
		},
		/**

			@(array) 
			 [
				(string) || (object) @miejsce_utworzenia_elementów
			 	(string) @klasa_elementu_do_utworzenia
			 	(array) @styl_elementu
			 ]
			@(function) callback

		*/
		addSpace: function(param1, callback){

			var childParent 	= (typeof param1[0] === 'object') ? param1[0] : $(param1[0]),
				childClass 		= param1[1],
				childPos 		= (param1[2]) ? param1[2] : [0,0],
				childStyle 		= (param1[3]) ? param1[3] : false,
				childActions 	= callback;

			childParent.append('<div class="' + childClass + '"></div>');
			if(childStyle){
				childParent.find('.' + childClass).css(childStyle);
			}

			this.elements.push({
				name 			: childParent.find('.' + childClass)[0],
				constructor 	: childParent.find('.' + childClass),
				childClass 		: childClass,
				location 		: childParent,
				actions 		: childActions,
				manipulate		: childPos,
				type 			: 'child'
			});


			// $(location).append('<div class="'+name+'"></div>');
			// if(this.element.childrens.style){
			// 	$('.'+name).css(style);
			// }
			
			// if(enedscroll.options.selectorsSetColor){
			// 	this.element.constructor.find('._ens').remove();
			// 	this.element.constructor.find('._ene').remove();
			// 	this.element.constructor.attr('style', '');
			// }

			// this.element.childrens.constructor = $('.' + this.element.childrens.name);
			// this.selector.set = false;
			// this.selectors([this.pos[0],this.pos[1]]);


		}
	});
	
	var $l = {}, $counter = 0;

	$.fn.extend({
		// (array) selectors [top, bottom]
		ened: function(param1){
			return $.each(this, function(k,v){

				var pos = (param1 && $.isArray(param1)) ? param1 : [0,0],
					a = {
						name: v,
						constructor: $(this),
						location: $(document),
						manipulate: pos,
						selectors: {},
						type: 'parent'
					};

				$(this).attr('data-ened-key', $counter);

				$l[$counter] = new __enedScroll(a);

				$counter++;

			});
		},
		// selectors: function(position){		
		// 	return $.each(this, function(k,v){

		// 		var key = $(this).attr('data-ened-key');
		// 		if(typeof key === 'undefined' || key == null || !key){
		// 			console.log('Not defined ened key for this element');
		// 		}else{
		// 			if(typeof position === 'undefined' || position == null || !position){
		// 				position = [0,0];
		// 			}
		// 			$l[key].selectors(position);
		// 		}

		// 	});
		// },
		set: function(actions){
			return $.each(this, function(k,v){

				var key = $(this).attr('data-ened-key');
				if(typeof key === 'undefined' || key == null || !key){
					console.log('Not defined ened key for this element');
				}else{
					if(typeof actions === 'undefined' || actions == null || !actions){
						actions = function() {};
					}
					$l[key].set(actions);
				}

			});
		},
		// (array) 
		//  [
		// 	  (string) || (object) @miejsce_utworzenia_elementów
		// 	  (string) @klasa_elementu_do_utworzenia
		//  ]
		// (array) @styl_elementu
		// (function) callback
		addSpace: function(param1, param2, param3){
			return $.each($(this), function(k,v){

				var key = $(this).attr('data-ened-key');
				if(typeof key === 'undefined' || key == null || !key){
					console.log('Not defined ened key for this element');
				}else{

					$l[key].addSpace(param1, param2, param3);

					// var spacesCount = ($.isNumeric(param1) && param1 > 0 && param1 < 15) ? param1 : 0;
					// if(typeof spacesCount === 'undefined' || spacesCount == null || !style){
					// 	name = '';
					// 	console.log('The number of spaces is required');
					// }
					// if(typeof location === 'undefined' || location == null || !style){
					// 	location = '';
					// 	console.log('Space location is required');
					// }
					// if(typeof style === 'undefined' || style == null || !style){
					// 	style = {};
					// }

					// if(name && location){
					// 	$l[key].createSpace(name, location, style);
					// }else{
					// 	console.log('Something\'s gonna wrong !');
					// }
				}

			});
		},
		get: function(){
			return $.each($(this), function(k,v){

				var key = $(this).attr('data-ened-key');
				if(typeof key === 'undefined' || key == null || !key){
					console.log('Not defined ened key for this element');
				}else{

					$l[key].get();

				}

			});	
		}
	});

	return new enedScroll();
}));