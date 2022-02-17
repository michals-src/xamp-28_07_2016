(function($) {

	var $tagC = $('.tags-content'),
		$tags = $tagC.find('.tags'),
		$tagI = $tagC.find('.tag-input'),
		$tagH = $tagC.find('.hidden'),
		$tagLR = false,
		$tagLL = 0,
		$args = ($tagH.val()) ? $tagH.val().split(',') : [];

		$tagI.focus(function() {
			$tagC.addClass('focus');
		}).blur(function() {
			$tagC.removeClass('focus');
		});

		$tagC.on('click', function() {
			$tagI.focus();
		})

		$tagI.on('keydown', function(e) {
			var $key = e.keyCode,
				$this = $(this)
				$value = $this.val();

			if($key === 32){
				if($value){

					$tags.append('<span>'+$.trim($value)+'</span>');
					$args.push($.trim($value));
					$this.val('');
					$this.focus();
					$tagLL = 0;

					$tagH.val($args);
				}
			}

			if($key === 8){
				
				var $last = $tags.find('span').last();

				if($tagLL < 1 || !$tagLR){
					$last.remove();
					$tagI.val($.trim($last.text()));

					$tagLR = true;
					$tagLL = parseFloat($.trim($last.text().length));

					$args.splice($.inArray($.trim($last.text()), $args), 1)
					$tagH.val($args);
				}else if($tagLL > 1 && $tagLR){
					console.log($tagLL);
					$tagLL--;
				}else{
					$tagLR = false;
				}

			}

		});

		$tags.on('click', 'span', function() {

			var $this = $(this),
				$value = $tagI.val();

				if(!$value){
					$tagI.val($.trim($this.text()));
					$this.remove();

					$tagLR = true;
					$tagLL = parseFloat($.trim($this.text().length));

					$args.splice($.inArray($.trim($this.text()), $args), 1)
					$tagH.val($args);
				}

		});

})(jQuery);