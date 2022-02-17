<!doctype html>
<html>
	<head>
		<meta charset="utf-8">
		<meta http-equiv="X-UA-Compatible" content="IE=edge">
		<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
		<link rel="stylesheet" href="demo.css">
		<title> DEMO 1 </title>
	</head>
	<body>
		<div class="container">
		<div class="paper">
			<header role="main">
				<h1>enedScroll</h1>
			</header>
			<div class="workspace">
			<div class="line">
				<div class="pin">
					<field>
						<header> 

						<h2>My title</h2> 
						<h2 class="beta-text">My beta text</h2> 

						</header>

						<div class="content" id="myBox">
							Lorem ipsum dolor sit amet, consectetur adipisicing elit. Iure sequi dolores adipisci soluta ut eaque dolore provident, natus omnis! Doloribus provident reprehenderit necessitatibus accusamus quisquam impedit nobis odit mollitia error.
						</div>
						<footer>
							Box footer
						</footer>

					</field>
				</div>
			</div>
			</div>
			<img src="https://www.w3schools.com/html/img_the_scream.jpg" id="myImg" style="display: none;">
			<div class="free-space" style="height: 1000px;"></div>
		</div>
		</div>
		<script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js"></script>
		<script type="text/javascript" src="enedScroll.js"></script>
		<script>
		(function($){

				var text = $('.beta-text');
				var split = text.text().split(' ');

				text.html('');

				$.each(split, function(k,v){

				var dh = '<div style="display:inline-block;margin-right:10px;">';
				var s = v.split('');
					$.each(s, function(a,b){
						dh += '<span style="display:inline-block;">'+b+'</span>';
					});
					dh += '</div>';
					text.append(dh);
				});

				var lt = text.find('span');
				var d = text.find('span.done');
				var x = 0;
				var mbc = setInterval( function(){

					var item = lt[x];

					$(item).animate( {  opacity: 0, myT: 90 }, {
					    step: function(now,fx) {
					    	if(fx.prop === 'myT'){
					      		$(this).css('transform','rotateY('+now+'deg)'); 
					      	}
					    },
					    duration: 600
					}, 'linear' );

					
					x++;

					if( x >= lt.length){
						clearInterval(mbc);
					}

				}, 50 );

			





				// enedScroll.option({
				// 	'show_all_triggers': true
				// });

				// var pinTrigger = new enedScroll.Trigger( { name: 'pinTrigger', margins: { top: '15%' } } );
				// var controller = new enedScroll( $('.pin'), { top: 0, bottom: 0}, pinTrigger );

				// controller.addCreation( function(){

				// 	var target = $(this.parent).find('field');
				// 	var helpers = this.helpers;

				// 	var pin = helpers.plugins.pin( target );
				// 	var timeline = [ 
				// 		{ duration: 50, offset: 0 },
				// 		{ duration: 50, offset: 150 },
				// 		{ duration: 50, offset: 300 }
				// 	];

				// 	//console.log( $(target).outerHeight() );

				// 	pin.add( timeline );


				// } );

			})(jQuery);
		</script>
	</body>
</html>