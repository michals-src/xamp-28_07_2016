(function($) {

	$.enedScroll({
		selectorsColor: false
	});
	
	var letters = $('.a2').text().split('');

	$('.a2').html('');
	$(letters).each(function(k,v) {
		$('.a2').append('<span style="display:inline-block;">'+v+'</span>');
	});

	var Element 		= $('.a2 span'),
		style 			= {
							height: '170px',
							position: 'absolute',
							left: '0',
							width: '100%'
						},
		top				= 25,
		m = $('.a2').offset().top,
		mb = 0;

		Element.each(function(k,v){

			var a = $(this).ened();
			style.top = top + '%';

			a
			.createSpace('sth-'+k, '.inner', style)
			.selectors()
			.set({
				0: function(e){
					var $this = e.this,
						$num = e.num;

					var p = ((50/10) * ($num * 2));
					if(k === 0){
						$('.ifa').css({'position': 'static', 'top': '0', 'left': '0'});
					}
					$this.css({'transform': 'translateX(-'+((140/10) * ($num * 2))+'px) translateY(-'+p+'px) scale('+( 1 + ((0.85)/10) * ($num * 2))+')', 'positon': 'relative', 'z-index': '5'});
					$this.css({'color': '#333'});
				},
				1: function(e){
					var $this = e.this,
						$num = e.num;

					if(k === 0 ){
						$('.ifa').css({'position': 'fixed', 'left': '0', 'top': '-110px'});
					}
				},
				50: function(e){
					var $this = e.this,
						$num = e.num;

					var p = ((50/10) * ($num * 2));
					$this.css({'transform': 'translateX(-'+(140 + (140 - ((140 / 10) * $num * 2)))+'px) translateY(-'+(50 - ((50) - (100 - p)))+'px) scale('+( 1.85 + ((0.85)/10) * ((10 - ($num * 2))))+')', 'positon': 'relative', 'z-index': '3'});
				},
				40: function(e){
					var $this = e.this;

					$this.css({'color': 'purple'});
				},
				60: function(e){
					var $this = e.this;

					$this.css({'color': 'pink'});
				},
				75: function(e){
					var $this = e.this;

					$this.css({'color': 'green'});
				},
				90: function(e){
					var $this = e.this;

					$this.css({'color': 'yellow'});
				},
				99: function(e){
					if(k == (Element.length - 1)){
						$('.ifa').css({'position': 'absolute', 'top': '380px'});
					}
				}
			});

			top = top + 8;

		});

		var lorem = $('.lorem').ened();

		lorem
			.selectors([-100,150], true)
			.set({
				0: function(e){
					var $this = e.this,
						$num = e.num;

					$this.css({opacity: (1 / 10) * $num});
				}
			});
	

})(jQuery);