<?php require_once 'config.php'; ?>
<!doctype html>
<html>
<head>
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
	<link rel="apple-touch-icon" sizes="180x180" href="favicons/apple-touch-icon.png">
	<link rel="icon" type="image/png" href="favicons/favicon-32x32.png" sizes="32x32">
	<link rel="icon" type="image/png" href="favicons/favicon-16x16.png" sizes="16x16">
	<link rel="manifest" href="favicons/manifest.json">
	<link rel="mask-icon" href="favicons/safari-pinned-tab.svg" color="#5bbad5">
	<meta name="theme-color" content="#ffffff">
	<link rel="stylesheet" href="http://<?php echo BASE_D; ?>/css/style.css">
	<link rel="stylesheet" href="http://<?php echo BASE_D; ?>/css/bootstrap.min.css">
	<meta charset="utf-8"/>
	<title>enedScroll - make you website awesome !</title>
</head>
<body>

<div class="area-1 clearfix">
	<div class="field-1">
		<div class="head-picture">
			<div class="picture-elements">
				<div class="picture-1-child"></div>
				<div class="picture-2-child"></div>
			</div>
			<div class="title t-s01">
				<h1>enedScroll</h1>
				<p>Make your website awesome !</p>
			</div>
		</div>
	</div>
	<div class="field-2">
	  <div class="container-fluid">
		<div class="text-container">
			<h1 class="title t-s01">It's so easy</h1>
			<p>The plugin allows you to manipulate each item you want to. Just set up and start change your site to something cool.</p>
		</div>
	  </div>
	</div>
	<div class="field-3">
	  <div class="container-fluid">
		<div class="text-slider-content">
			<div class="text-slider">
			  <div class="text-slider-box clearfix">
				<h1 class="text-slider-counter"><strong>01</strong> <span>/ 05</span></h1>
				<div class="text-slider-container"><h2></h2></div>
			  </div>
			</div>
		</div>
		<div class="text-slider-to-container">
			<ul class="text-slider-hidden">
				<li class="text-slider-current-item"><h2>Pin elements</h2></li>
				<li class="text-setclass"><h2>Set class</h2></li>
				<li class="text-move">
					<h2>Move elements</h2>
				</li>
				<li class="text-manipulate"><h2>Manipulate other scene</h2></li>
				<li class="text-trigger"><h2>Trigger animations</h2></li>
			</ul>
		</div>
	  </div>
	</div>
	<div class="more-field">
	  <div class="container-fluid">
	  	<div class="text-container">
			<h2 class="title t-s01">and more</h2>
			<h1 class="title t-s01 clone">and more</h1>
			<p>
				Create animations using actually of element's position and start it e.g. in half.
				Set value of number when you want to start animation.
				It's magic.
			</p>
		</div>
	  </div>
	</div>
	<div class="field-4">
		<div class="container-fluid">
			<div class="purchase-field">
				<div class="purchase-text">
					<h2>Only <span>12$</span></h2>
					<h2><span>Purchase</span> now</h2>
				</div>
				<div class="purchase-btn">
					<a href="#"><button>Buy now</button></a>
					<span>on Codecanyon</span>
				</div>
			</div>
		</div>
	</div>
	<div class="docs-field">
		<div class="container-fluid">
			<div class="text-field">
				<h1>Documentation</h1>
				<p>Let’s start jourey with enedScroll</p>
				<a href="/documentation.php">See documentation</a>
			</div>
			<picture>
				<img src="images/docs_planet.png">
			</picture>
		</div>
	</div>
	<footer>
		<div class="container">
			<p>&copy <?php echo date('Y'); ?> enedScroll. All rights reserved.</p>
		</div>
	</footer>
</div>
<script>
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-89554230-1', 'auto');
  ga('send', 'pageview');

</script>
<script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js"></script>
<script type="text/javascript" src="http://<?php echo BASE_D; ?>/js/bootstrap.min.js"></script>
<script type="text/javascript" src="http://<?php echo BASE_D; ?>/js/enedscroll.js"></script>
<script type="text/javascript" src="http://<?php echo BASE_D; ?>/js/script.js?n=sdf"></script>
</body>
</html>