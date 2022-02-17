<!doctype html>
<html>
	<head>
		<meta charset="utf-8">
		<meta http-equiv="X-UA-Compatible" content="IE=edge">
		<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
		<link rel="stylesheet" href="css/animate.css">
		<link rel="stylesheet" href="css/style.css">
		<link rel="stylesheet" href="css/bootstrap-grid.min.css">
		<title> enedScroll </title>
	</head>
	<body class="blocked">
		
	<section class="head-screen">
		<div class="act-header screeen-wh">
			
			<div class="middle">
				<div class="middle-item">
				
					<div class="container">

						<header>
							<h2 class="pacifico" style="color:#1036ff;text-shadow: 0 15px 60px #b5b3af;">enedScroll</h2>
						</header>
						<p class="describe screnn-v600" style="opacity:0;margin-left:auto;margin-right:auto;">It is a jQuery plugin that allows to manipulate css attributes and create events in many ways. See documentation and introduce with enedScroll.</p>
					
<!-- 					<div class="col-4 navigation">
						<div class="middle">
							<div class="middle-item">
								<nav role="main">
									<header>
										<h5>See also</h5>
									</header>
									<h3><a href="#">Documentation</a></h3>
									<h3><a href="#">Buy now</a></h3>
								</nav>
							</div>
						</div>
					</div>
					</div> -->


				</div>
			</div>
			
		</div>
	</section>

	<section class="normal-screen screen-documentation">
		<div class="container">
			<header> <h4>Documentation</h4> </header>
		</div>
		<div class="row no-gutters">
			
			<div class="col-md-5">
				<picture class="left h500">
					<img src="images/photo-1490004531003.png" style="display: block;width: 100%;">
				</picture>
			</div>
			<div class="col-md-4 offset-md-1 text">
				<p class="medium">Detailed documentation will help you understand better how you change your website into someting really cool.</p>
				<a href="#">Read documentation</a>
			</div>

		</div>
	</section>

	<section class="normal-screen screen-demos">
		<div class="container">
			
			<header class="main-title">
				<h4><span>D</span><span>e</span><span>m</span><span>o</span><span>s</span></h4>
			</header>

			<div class="row no-gutters">
					
					<div class="col-sm-6 col-md-3">
						<!-- <header class="friendly"> <h6>Title</h6> </header> -->
						<ul>
							<li><a href="demos/opacity_transition.html">Opacity transition</a></li>
							<li><a href="demos/3d_cube_rotate.html">CSS cube rorate</a></li>
							<li><a href="demos/spatial_images.html">Spatial images</a></li>
						</ul>
					</div>
					<div class="col-sm-6 col-md-3">
						<!-- <header class="friendly"> <h6>Title</h6> </header> -->
						<ul>
							<li><a href="demos/opacity_elements.html">Opacity elements</a></li>
							<li><a href="demos/showing_text.html">Showing a text</a></li>
							<li><a href="demos/progressbar.html">Progress bar</a></li>
						</ul>
					</div>
					<div class="col-sm-6 col-md-3">
						<!-- <header class="friendly"> <h6>Title</h6> </header> -->
						<ul>
							<li><a href="demos/sliding_images.html">Sliding images</a></li>
							<li><a href="demos/change_text_color.html">Change text color</a></li>
							<li><a href="demos/class_manipulation.html">Class manipulation</a></li>
						</ul>
					</div>
					<div class="col-sm-6 col-md-3">
						<!-- <header class="friendly"> <h6>Title</h6> </header> -->
						<ul>
							<li><a href="demos/repeat_actions.html">Repeat actions</a></li>
							<li><a href="demos/fullscreen_gallery.html">Fullscreen gallery</a></li>
							<li><a href="demos/scene_information.html">Scene information</a></li>
						</ul>
					</div>
				
			</div>
		</div>
	</section>

	<section class="normal-screen screen-fullpage-example">
		<div class="container">
		<div class="row no-gutters">

			<div class="col-sm-12 text-center">
				<a href="index.html" style="display: block;border:none;">
					<img src="images/example.png" alt="enedScroll - example" style="width: 100%;">
				</a>
			</div>

		</div>
		</div>
	</section>

	<section class="normal-screen screen-buy">
		<div class="row no-gutters">

			<div class="text-area col-md-6 text-center">
				<header> 
					<h4>Purchase now</h4> 
					<p>Only 14$</p>
				</header>
				<a href="#">Buy now</a>
				<p class="label">on Codecanyon</p>
			</div>
			<div class="col-md-6 text-right">
				<picture class="right h500">
					<img src="images/open-shop.png" style="display: block;width: 100%;">
				</picture>
			</div>

		</div>
	</section>


		<script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js"></script>
		<script type="text/javascript" src="core_build.js?v=1.01.1"></script>

		<script>
			(function ($) {


				var $winWidth = $(window).width();
				var $winHeight = $(window).height();

				$('.screeen-wh').css({ 'width': ($winWidth - 15) + 'px', 'height': $winHeight + 'px' });

				$('.act-header header').addClass( 'animated' ).one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
					$('body').removeClass('blocked');
					return $(this).removeClass('animated').addClass('in');
				});


			})(jQuery);
		</script>

		<script type="text/javascript" src="js/script.js?v=2"></script>

	</body>
</html>

<!-- Photo by Amy on Unsplash
 -->