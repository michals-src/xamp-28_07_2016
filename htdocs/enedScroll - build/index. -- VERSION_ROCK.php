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
	<body>
		
		<section class="sc sc1-welcome" style="height:100%;margin-bottom: -400px;">
			<header></header>
			<div class="middle" style="height:100%;">
				<div class="middle-item">

					<div class="signature">
						<h2>enedScroll</h2>
					</div>
					
				</div>
			</div>

		</section>
	
		<section class="scenery row" style="position: relative;height: 100%;">
			
			<div class="scene">
				<div class="acts stage">
					
					<!-- 1 ACT -->
					<div class="act act-1" style="text-align: center;">
						<div class="middle">
							<div class="middle-item">
 								<div class="container">
									
									<header class="firendly">
										<h2 class="bold title" style="display:block;">Hi there.</h2>
									</header>
									<p class="large bold child">I want you to get acquainted with my model. So this is the animal.</p>

								</div>
							</div>
						</div>
					</div>

					<!-- 2 ACT -->
					<div class="act act-2" style="text-align: center;">
						<div class="middle">
							<div class="middle-item">
 								<div class="container" style="text-align: left;">
									
									<header class="friendly">
										<h3 class="bold title" style="display:block;">How can we call him ?</h3>
									</header>
									<p class="medium bold child" style="color: #eee;margin-top: -12px;">Let’s think ...</p>

								</div>
							</div>
						</div>
					</div>

					<!-- 3 ACT -->
					<div class="act act-3" style="text-align: center;">
						<div class="middle">
							<div class="middle-item">
 								<div class="container">
									
									<header class="friendly">
										<h3 class="bold title amaranth" style="display:block;">
											<span class="bob" style="opacity: 0;">Bob,</span>
											<span class="steve" style="opacity: 0;">Steve</span>
											<span class="rocky" style="display: inline-block;">or Rocky</span>
										</h3>
									</header>

									<p class="child">
										<span class="consider" style="color: #eee;">
											<span style="display: inline-block;margin-right: -10px;">H</span>
											<span style="display: inline-block;margin-right: -10px;">m</span>
											<span style="display: inline-block;margin-right: -10px;">m</span>
											<span style="display: inline-block;">m</span>
										</span>
										<span class="text" style="opacity:0;display: inline-block;text-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);">I know !</span>
									</p>

								</div>
							</div>
						</div>
					</div>

					<!-- 4 ACT -->
					<div class="act act-4" style="text-align: center;height: 100%;">
						<div class="middle">
							<div class="middle-item">
 								<div class="container">
									
									<h2 class="bold title amaranth friendly"> Rocky </h2>
									<p class="child pacifico medium">
										Let's call him Rocky
									</p>

								</div>
							</div>
						</div>
					</div>

					<!-- 5 ACT -->
					<div class="act act-5" style="text-align: center;height: 100%;">
						<div class="middle">
							<div class="middle-item">
 								<div class="container">
									
									<h5 class="bold title pacifico" style="text-shadow: 0 20px 35px rgba(0,0,0,.2);">
										It was example of demonstration how enedScroll works.
									</h5>

									<p class="child bold medium">
										Now get some information about it.
									</p>

								</div>
							</div>
						</div>
					</div>


				</div>
			</div>
		</section>

					<!-- 6 ACT -->
					<section class="act informations">

					  <div class="container-fluid">

						  <div class="row no-gutters">
							<div class="col-md-6 information" style="text-shadow: 0 15px 30px rgba(0,0,0,0.2)">
								<div class="middle">
									<div class="middle-item">
										<h3 class="amaranth bold friendly"> Documentation </h3>
										<p class="label-medium bold">Let's start journey with enedScroll</p>
										<a href="#"><button>See documentation</button></a>
									</div>
								</div>
							</div>

						<div class="col-md-6 information">
							<div class="middle">
								<div class="middle-item">
									<h3 class="pacifico friendly"> Purchase now </h3>
									<p class="label-medium" style="font-size: 40px;font-weight: normal; color: #c8edff;">only 14$</p> 
									<a href="#"><button>Buy now</button></a>
									<p class="label">on Codecanyon</p>
								</div>
							</div>
						</div>

						</div>
					  </div>

					</section>

					<footer>
						<p class="bold label">enedScroll &copy; 2017</p>
					</footer>


		<div class="wallpaper" style="z-index: 8;">
			<div class="pictures">
				<picture style="display:block;">
					<img src="images/amy.png" alt="Rocky" style="width: 100%;">
				</picture>
			</div>
		</div>

		<div class="progress-bar" style="z-index: 9;">
			<div class="progress-line">
				<span class="progress"></span>
			</div>
		</div>

		<div class="wallpaper-bg" style="background-color: #dadedf; width: 100%; height: 100%; position: fixed; top: 0; left: 0;z-index: 3;"></div>

<!-- 		<section class="target-place">
			<div class="target-image">
				<picture>
					<img src="images/amy-339675.jpg" alt="Rocky">
				</picture>
			</div>
		</section> -->

		<!-- <div class="div" style="height: 20000px;"></div> -->

		<script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js"></script>
		<script type="text/javascript" src="core_build.js"></script>

		<script>
			(function ($) {

				var winWidth = $(window).width();
				var winHeight = $(window).height();

				$.each( $('.act'), function( key, item ){
					$(item).css({ 'width': winWidth + 'px', 'height': winHeight + 'px' });
				});

				$('.wallpaper').css({ 'width': winWidth + 'px', 'height': winHeight + 'px' });
				$('.information').css({ 'height': winHeight + 'px' });


				//$('.sc').css('height', $(window).height());
				//$('.target-place').css('height', $('.target-place img').height());
			})(jQuery);
		</script>

		<script type="text/javascript" src="js/script.js?v=2"></script>

	</body>
</html>

<!-- Photo by Amy on Unsplash
 -->