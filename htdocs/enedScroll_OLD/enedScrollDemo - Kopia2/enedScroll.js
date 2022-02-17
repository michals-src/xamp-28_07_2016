/**
 * enedScroll v1.0.0
 * enedscroll.com
 * 
 * LICENSE enedScroll
 * 
 */
if (typeof jQuery === 'undefined') {
  throw new Error('enedScroll\'s JavaScript requires jQuery')
}

+function ($) {
  'use strict';
  var version = $.fn.jquery.split(' ')[0].split('.')
  if ((version[0] < 2 && version[1] < 9) || (version[0] == 1 && version[1] == 9 && version[2] < 1) || (version[0] > 3)) {
    throw new Error('enedScroll\'s JavaScript requires jQuery version 1.9.1 or higher, but lower than version 4')
  }
}(jQuery);

(function( $, window, document ) {

	$.enedScrollDefaults = {
		topPosition: '50%',
		selectorsColor: false
	};

	$.enedScroll = function(q){
		return $.extend($.enedScrollDefaults, q);
	}

	function enedScroll(element, settings){

		this.element 				= element;
		this.settings 				= settings;

		if(typeof this.setSelectors === 'undefined' || this.setSelectors === null){
			this.selectors([0,0]);
		}

	}

	$.extend(enedScroll.prototype, {
		call: function(){
			var $this 		= (this.element.child) ? this.element.child.constructor : this.element.constructor,
				$self 		= this.element.constructor,
				$actions 	= this.actions;

			$(document).on('scroll', function() {

				var 	$pickerTop 			= $('.ened').offset().top,
						$startElementTop	= $this.find('.enedS').offset().top,
						$endElementTop		= $this.find('.enedE').offset().top,
						heightFull 			= $endElementTop - $startElementTop;

				var partPer 	= (((($pickerTop - $startElementTop) * 10) / heightFull) / 10),
					part 		= (partPer < 0.0001) ? 0 : partPer;


					if(part > 1 && $pickerTop > $endElementTop)
					{
						part = 1;
					}

					//console.log(part);
					$.each($actions, function(k, v) {
						var value = (k > 1) ? (k / 100) : k;

						var data = {
							this: $self,
							num: part
						};
						
						if(part >= value){
							v(data);
						}
					});

			});
		},
		selectors: function(pos, percentage){
			this.pos 		= pos;
			this.percentage = percentage;

			var parent = (this.element.child) ? this.element.child.constructor : this.element.constructor;
			if(typeof this.setSelectors === 'undefined' || this.setSelectors === null){

				$(document).find(parent).css({position: 'relative'});
				$(document).find(parent).prepend('<div class="enedS"></div>');
				$(document).find(parent).append('<div class="enedE"></div>');

			}
			
			var $start  	= (this.pos[0]) ? this.pos[0] : 0,
				$end  		= (this.pos[1]) ? this.pos[1] : 0,
				$percentage = (this.percentage) ? '%' : 'px';

			if($start != 0){
				parent.find('.enedS').css({'top': $start + $percentage});
			}
			if($end != 0){
				parent.find('.enedE').css({'bottom': $end + $percentage});
			}

			if(this.settings.selectorsColor){
				$('.enedS').addClass('color');
				$('.enedE').addClass('color');
			}

			this.setSelectors = true;


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

			this.element.child.constructor = $('.' + this.element.child.name);
			
			this.element.constructor.find('.enedS').remove();
			this.element.constructor.find('.enedE').remove();
			this.setSelectors = null;
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
					},
					s = $.enedScrollDefaults;

				$(this).attr('data-ened-key', $counter);

				$l[$counter] = new enedScroll(a,s);
				$counter++;
			});
		},
		selectors: function(a,p){		
			return $.each(this, function(k,v){

				var key = $(this).attr('data-ened-key');
				if(typeof a === 'undefined' || a == null){
					a = [0,0];
				}
				if(typeof p === 'undefined' || p == null){
					p = false;
				}
				$l[key].selectors(a, p);

			});
		},
		set: function(actions){
			return $.each(this, function(k,v){

				var key = $(this).attr('data-ened-key');
				if(typeof actions === 'undefined' || actions == null){
					actions = function() {};
				}
				$l[key].set(actions);

			});
		},
		createSpace: function(name, location, style){
			return $.each(this, function(k,v){

				var key = $(this).attr('data-ened-key');
				if(typeof name === 'undefined' || name == null){
					name = '';
				}
				if(typeof location === 'undefined' || location == null){
					location = '';
				}
				if(typeof style === 'undefined' || style == null){
					style = {};
				}

				$l[key].createSpace(name, location, style);

			});
		}
	});


})(jQuery, window, document);