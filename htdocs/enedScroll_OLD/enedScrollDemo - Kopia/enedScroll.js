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

	// Browser globals (root is window)
	root.enedscroll = factory(root.jQuery);

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


	function __enedScroll(element, settings){

		this.element = element;
		this.selector = {set: false};

		if(typeof this.selector.set === 'undefined' || this.selector.set === null || !this.selector.set){
			this.selectors([0,0]);
		}

	}

	$.extend(__enedScroll.prototype, {
		call: function(){
			var $this 		= (this.element.child) ? this.element.child.constructor : this.element.constructor,
				$self 		= this,
				$actions 	= this.actions;

			$(document).on('scroll', function() {

				$self.selector = {
					'imaginary': {
						'top'		: ($this.offset().top + $self.pos[0]),
						'bottom' 	: (($this.offset().top + $this.outerHeight()) + $self.pos[1])
					}
				}

				//console.log(($self.selector.imaginary.bottom - $self.selector.imaginary.top));

				var 	$pickerTop 			= $('.ened').offset().top,
						$startElementTop	= $self.selector.imaginary.top,
						$endElementTop		= $self.selector.imaginary.bottom,
						heightFull 			= $endElementTop - $startElementTop;


				var partPer 	= (((($pickerTop - $startElementTop) * 10) / heightFull) / 10),
					part 		= (partPer < 0.0001) ? 0 : partPer,
					inset		= false;


					if(part > 1 && $pickerTop > $endElementTop)
					{
						part = 1;
					}
					if(part > 0 && part < 1){
						inset = true;
					}

					$.each($actions, function(k, v) {
						var value = (k > 1 && $.isNumeric(k)) ? (k / 100) : k,
							data = {
								'this'	: $self.element.constructor,
								'num'	: Math.round(part * Math.pow(10, 5)) / Math.pow(10, 5),
								'in'	: inset
							};

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
							/* Wywołanie jednego eventu po natychmiastowym najechaniu */
							if(inset){
								v(data);
							}
						}

						/* Zwrócenie funkcji przy osiągnięciu podanej wartości */
						if($.isNumeric(value)){
							value = Math.round(value * Math.pow(10, 15)) / Math.pow(10, 15);
							if(value == 1){
								value = 0.99;
							}
							if(value == 0){
								value = 0.0001;
							}
							if(part >= value && inset){
								v(data);
							}
						}
					});

			});
		},
		selectors: function(position){
			this.pos = position;

			var parent = (this.element.child) ? this.element.child.constructor : this.element.constructor;
			if(typeof this.selector.set === 'undefined' || this.selector.set === null || !this.selector.set){

				this.selector = {
					'set' : false
				};
				
				if(enedscroll.options.selectorsSetColor){
					$(document).find(parent).css({position: 'relative'});
					$(document).find(parent).prepend('<div class="_ens"></div>');
					$(document).find(parent).append('<div class="_ene"></div>');
				}

			}
			
			var $start  	= (this.pos[0]) ? this.pos[0] : 0,
				$end  		= (this.pos[1]) ? this.pos[1] : 0;

			if($start != 0){
				parent.find('._ens').css({'top': $start + 'px'});
			}
			if($end != 0){
				parent.find('._ene').css({'bottom': -($end) + 'px'});
			}

			this.selector.set = true;


		},
		set: function(actions){
			this.actions = actions;

			this.call();
		},
		createSpace: function(name, location, style){

			this.element.child 	= {
				name: name,
				location: location,
				style: style
			}

			$(location).append('<div class="'+name+'"></div>');
			if(this.element.child.style){
				$('.'+name).css(style);
			}
			
			if(enedscroll.options.selectorsSetColor){
				this.element.constructor.find('._ens').remove();
				this.element.constructor.find('._ene').remove();
				this.element.constructor.attr('style', '');
			}

			this.element.child.constructor = $('.' + this.element.child.name);
			this.selector.set = false;
			this.selectors([this.pos[0],this.pos[1]]);


		}
	});
	
	var $l = {}, $counter = 0;

	$.fn.extend({
		ened: function(){
			return $.each(this, function(k,v){
				var a = {
						name: v,
						constructor: $(this)
					};

				$(this).attr('data-ened-key', $counter);

				$l[$counter] = new __enedScroll(a);
				$counter++;
			});
		},
		selectors: function(position){		
			return $.each(this, function(k,v){

				var key = $(this).attr('data-ened-key');
				if(typeof key === 'undefined' || key == null || !key){
					console.log('Not defined ened key for this element');
				}else{
					if(typeof position === 'undefined' || position == null || !position){
						position = [0,0];
					}
					$l[key].selectors(position);
				}

			});
		},
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
		createSpace: function(name, location, style){
			return $.each(this, function(k,v){

				var key = $(this).attr('data-ened-key');
				if(typeof key === 'undefined' || key == null || !key){
					console.log('Not defined ened key for this element');
				}else{

					if(typeof name === 'undefined' || name == null || !style){
						name = '';
						console.log('Space element\'s name of class is required');
					}
					if(typeof location === 'undefined' || location == null || !style){
						location = '';
						console.log('Space location is required');
					}
					if(typeof style === 'undefined' || style == null || !style){
						style = {};
					}

					if(name && location){
						$l[key].createSpace(name, location, style);
					}else{
						console.log('Something\'s gonna wrong !');
					}
				}

			});
		}
	});

	return new enedScroll();
}));