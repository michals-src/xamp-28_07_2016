(function($) {

	var field = $('.field-1').ened();
/* 
Zmiana pozycji .ened nie wpływa na padding-top i padding-bottom na początku i końcu, wszystko przechodzi płynnie // Sprawdź

Funkcja dla 1 ( 0.99, zamienić na 1 )
*/


	field
		.createSpace('text-space', '.field-1', {
			position: 'absolute !important',
			width: '100%',
			height: '150px',
			top: '0'
		})
		.set({
			0: function(e){
				var $this = e.this;

				$this.find('.content-field-1').css({'position': 'relative','top':'0'});
				$this.find('h1').css({'color': '#657eff'});
			},
			0.001: function(e){
				var $this = e.this,
					top = (($('.content-field-1').position().top + $('.ened').position().top) - $this.find('.text-space').position().top);

				//console.log($this.find('.text-space').offset().top);
				$this.find('.content-field-1').css({'position': 'fixed','top': top + 'px'});
				$this.find('.content-field-1 p').css({'padding-left': '15px','padding-right':'15px'});

				$this.find('h1').css({'color': 'rgba('+Math.floor(101 + (154 * e.num))+','+Math.floor(126 + (129 * e.num))+','+Math.floor(255 - (255 * e.num))+',1)'});
			},
			0.99: function(e){
				var $this = e.this;

				$this.find('.content-field-1').css({'position': 'relative','top': ($this.find('.text-space').height()) + 'px'});
			}
		});
		


		/* Tekst */
		var aaa = $('h1').text().split(''),
			m = 0;

		$('h1').html('');
		$(aaa).each(function(k,v) {
			$('h1').append('<span style="display:inline-block;">'+v+'</span>');
		});

		$('h1 span').each(function(k,v) {
			var d = $(v);

			d.ened().createSpace('dd-'+k, '.field-1', {
				position: 'absolute',
				top: m + 'px',
				width: '100%',
				height: '100px'
			}).set({
				0: function(e){
					var $this = e.this;

					$this.css({'transform': 'scale(1)'});
				},
				0.001: function(e){
					var $this = e.this;

					$this.css({'transform': 'scale('+(1 + (0.7 * (e.num * 2)))+')'});
				},
				0.5: function(e){
					var $this = e.this;

					$this.css({'transform': 'scale('+(2.4 - (0.7 * (e.num * 2)))+')'});
				}
			});

			m = m + 30;
		});

})(jQuery);