(function( $ ) {
	
	$.fn.tigner = function(e,f) {
		'use strict';
		var 	$this			=	$(this),
				$start			=	(typeof e !== 'undefined' && e.length) ? e[0] : 0,
				$end			=	(typeof e !== 'undefined' && e.length) ? e[1] : 0,
				$perecent		=	(typeof e !== 'undefined' && e[2]) ? '%' : 'px',
				$attributes 	= {
					'start'			: $start,
					'end'			: $end,
					'perecent'		: $perecent
				};


			return $this.each(function(k,v) {

				var 	$startElement 	= $('<div class="stgn" style="width:100%;height:1px;position:absolute;top:'+$attributes.start+$attributes.perecent+';left:0;"></div>'),
						$endElement 	= $('<div class="etgn" style="width:100%;height:1px;position:absolute;bottom:'+$attributes.end+$attributes.perecent+';left:0"></div>');

				$(this).addClass('tignered');
				$(this).css({'position':'relative'});
				$(this).prepend($startElement);
				$(this).append($endElement);

				
				$(document).on('scroll', function() {

					var 	$pickerTop 			= $('.tigner').offset().top,
							$startElementTop	= $this.find('.stgn').offset().top,
							$endElementTop		= $this.find('.etgn').offset().top,
							heightFull 			= $endElementTop - $startElementTop;


						var partPer 	= Math.floor(((($pickerTop - $startElementTop) * 100) / heightFull)),
							part 		= (partPer < 0) ? 0 : partPer;

						if(part > 100 && $pickerTop > $endElementTop)
						{
							part = 100;
						}
						
						if($.isFunction(f)){
							var $data = {
								this: 		$this,
								num: 		part,
								selectors: 	{
									top: 	$startElementTop,
									bottom: $endElementTop
								}
							};

							return f($data);
						}
					
				

				});

			});

	};


$(window).ready(function() {
	$('.prez .text-wall').addClass('_a01-00');
});

/*  */
$('.oferta').find('.oferta-pokaz ul.oferta-slides li').first().addClass('_seo');
var $o = '0';
$('.oferta').tigner([0,0], function(e) {
	var $this = e.this,
		$selectors = e.selectors;

		if($selectors.top > 1){
			if($o === '0'){
				$this.find('.oferta-pokaz ul.oferta-slides li').first().addClass('_oes');
				$o++;
			}
		}

});

var $goNext 			= 	$('._luner-nav ._luner-next'),
	$goPrev				= 	$('._luner-nav ._luner-previous'),
	$scene				=	$('._luner'),
	$element 			= 	$('._lune'),
	$nextAutoDuration 	= 9500,
	$readTime			= 20000,
	$sceneAuto			= '',

	$luner 		= 	{
			'sceneNext': function(){

				$scene.find('._seo').animate({'opacity': 0}, 700, function() {

					$(this).removeClass('_seo');
					$(this).removeClass('_oes');

					var $ne = $scene.find('li').first();

					if($(this).next().is('li') === true){
						$ne = $(this).next('li');
					}

					$ne.css({'opacity': 1}).addClass('_seo _oes');

				});
			},
			'scenePrev': function(){
				$scene.find('._seo').animate({'opacity': 0}, 700, function() {

					$(this).removeClass('_seo');
					$(this).removeClass('_oes');

					var $ne = $scene.find('li').last();

					if($(this).prev().is('li') === true){
						$ne = $(this).prev('li');
					}

					$ne.css({'opacity': 1}).addClass('_seo _oes');

				});
			},
			'sceneAuto': function(){
				$sceneAuto = setInterval(function() { $luner.sceneNext() }, $nextAutoDuration);
			},
			'sceneReading': function(){
				setTimeout(function() {
					setInterval(function() { $luner.sceneNext() }, $nextAutoDuration);
				}, $readTime);
			}
	};


$luner.sceneAuto();


$goPrev.on('click', function() {
	$luner.scenePrev();
	clearInterval($sceneAuto);
	$luner.sceneReading();
	return false;
});

$goNext.on('click', function() {
	$luner.sceneNext();
	clearInterval($sceneAuto);
	$luner.sceneReading();
	return false;
});



$('._list01-00 ul._list-inner-zakladki li').on('click', function() {
	$(this).toggleClass('_oopn');
});

/* // */

/**/

	var $nav 	= $('.prez header nav'),
		$brand 	= $('.prez header .header-brand '),
		$hg 	= ($(window).height() - $brand.height());

$('.prez header nav ._ic-nav').on('click', '._no', function() {

	$('body').addClass('_vfn');
	$nav.addClass('_nso');
	$('.prez header').addClass('_hno');

	return false;
}).on('click', '._nc',  function() {

	$nav.removeClass('_nso');
	$('body').removeClass('_vfn');
	$nav.removeAttr('style');

});


/* // */


var $ah = $('.aktualnosci').height();
$('.aktualnosci').tigner([0,0], function(e) {
	var $this = e.this,
		$num = e.num;

	if($num > 1){
		$this.find('.aktualnosci-text').addClass('_aha238');
	}
});

$('.mapa').tigner([0,0], function(e) {
	var $this = e.this,
		$num = e.num;

	var $q = 35;

		if($num > $q){
			$this.find('.content').addClass('inView');
		}

		if($num < $q){
			$this.find('.content').removeClass('inView');
		}
});

$('.cennik').tigner([0,0], function(e) {
	var $this = e.this,
		$num = e.num;

		if($num > 1){
			$this.addClass('inView');
		}
});

var $nav 	 	 = $('.prez header nav'),
	$navPos  	 = $nav.position().top,
	$navHeight 	 = $nav.outerHeight(),
	$navWidth 	 = $nav.width(),
	$cloned 	 = false; 


$(document).on('scroll', function() {



	if( $(window).scrollTop() > $navPos ){

		if(!$cloned){
			$('.prez header.header-normal').find('.logo').after('<div class="nav-clone" style="display:inline-table;vertical-align:middle;width:' + $navWidth + 'px;height:' + $navHeight + 'px"></div>');
			$('.prez header.header-horizontal').prepend('<div class="nav-clone" style="display:inline-table;vertical-align:middle;width:' + $navWidth + 'px;height:' + $navHeight + 'px"></div>');
			$cloned = true;
		}
		$nav.addClass('_fx');

	}else{
		if($cloned){
			$('.prez header').find('.nav-clone').remove();
			$cloned = false;
		}
		$('.prez header nav').removeClass('_fx');
	}

});

//var $videoWall = $('.prez .prez-wall video');
//$videoWall.play();

var $preField = $('.pre-field');

$preField.on('click', function() {


	var $title = $(this).find('.pre-title').text(),
		$content = $(this).find('.pre-text').clone(),
		$href = $(this).attr('pre-href');


	if(typeof $href !== 'undefined'){
		
		$('html, body').animate({ scrollTop: $($href).offset().top + 'px' }, 500);

	}

	if($content.text().length > 0)
	{
		$('body').addClass('_vfn');
		$('.pre-container').find('header h2').html($title);
		$('.pre-container').find('.pre-body p').html($content);

		$('.pre-container').addClass('show');
	}


});

$('.pre-container').find('.pre-close').on('click', function() {

	$('body').removeClass('_vfn');
	$('.pre-container').removeClass('show');

	return false;

});
	


})(jQuery);