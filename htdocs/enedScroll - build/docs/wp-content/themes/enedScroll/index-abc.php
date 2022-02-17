<!doctype html>
<html>
	<head>
		<meta charset="utf-8">
		<meta http-equiv="X-UA-Compatible" content="IE=edge">
		<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
		<link rel="stylesheet" href="css/style.css">
		<title> enedScroll </title>
	</head>
	<body>

<!-- 	<h1>Simple text</h1>
	<h2>Simple text</h2>
	<h3>Simple text</h3>
	<h4>Simple text</h4>
	<h5>Simple text</h5>
	<h6>Simple text</h6>
	<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Perferendis, consequuntur exercitationem tenetur quod nostrum nemo, laudantium odit error. Consequuntur ea, harum ipsa iure aut reiciendis. Suscipit doloribus eaque animi necessitatibus?</p>
	<span>Simple text</span>
	<header>
		<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Cumque facere tenetur eos distinctio earum voluptate maxime mollitia, placeat expedita aliquam officiis et voluptates quam est cum! Earum sed illo alias?</p>
		<span>Simple text</span>
	</header>
	<footer>
		<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ullam qui tempora repudiandae voluptatum neque facere. Iste nam asperiores dicta porro maxime voluptates tempora accusantium soluta quisquam, ducimus. Vitae, vel, nam.</p>
		<span>Simple text</span>
	</footer> -->

		<header role="main" class="state-1">

			<div class="_cot wrap wrap-inner">
				<div class="text-logo left-side">
					<h1>enedScroll</h1>
				</div>
				<nav class="menu-horizontal right-side">
						<ul>
							<li><a href="#">Documentation</a></li>
							<li class="decorated"><a href="#">Buy now</a></li>
						</ul>
				</nav>
			</div>

		</header>

		<div class="scene-1">


			<div class="header-text-pin" style="width: 100%;">
			<div class="j-wh">
				<div class="bp-c" style="position:relative;z-index:5;">
				<div class="bpc-c">

						<h1 class="header-text" style="text-align: center;color:#1f1f77;">enedScroll</h1>
						<h2 class="header-desc" style="text-align: center;color:#fff;">Make your website awesome</h2>

				</div>
				</div>

				<canvas class="dots" id="dots" style="position: fixed;top: 0; left: 0;z-index:4;"></canvas>

			</div>
			</div>



		</div>

		<div class="scene-2">

				<div class="_cot-small">

						<h1 class="text">It's so easy</h1>
						<p class="sub-text">The plugin allows you to manipulate each item you want to by scrolling. Let include enedScroll and start change your site to something cool.</p>

						<div class="links">
							<a href="#" class="show-ghost" > <button>See demos</button> </a>
							<a href="documentation.html"> <button>Documentation</button> </a>
						</div>

				</div>

		</div>

		<div class="ghost">
			<div class="bp-c">
			<div class="bpc-c">
				<div class="ghost-box">
					<header>
						<h1 class="ghost-title"> Demos </h1>
						<i class="exit">X</i>
					</header>
					<div class="ghost-content">
						<!-- TEXT ; BLOCK ; Trigger CALLING ANIMATION ; SCREEN ; PIN ; SHOW (IN OUT) ; EVENTS -->
						<h4 class="title"> Text </h4>
						<ul class="horizontal">

							<li><a href="/demos/text/translate.html"> Translates </a></li>
							<li><a href="/demos/text/scale.html"> Scale </a></li>
							<li><a href="/demos/text/spacing.html"> Spacing </a></li>
							<li><a href="/demos/text/transform.html"> Transform each letter </a></li>
							<li><a href="/demos/text/color.html"> Changing color </a></li>

						</ul>
						<h4 class="title"> Canvas </h4>
						<ul class="horizontal">

							<li><a href="/demos/canvas/add.html"> Add items </a></li>
							<li><a href="/demos/canvas/color.html"> Changing items color </a></li>

						</ul>
						<h4 class="title"> Box </h4>
						<ul class="horizontal">

							<li><a href="/demos/box/rotate.html"> Rotate </a></li>
							<li><a href="/demos/box/size.html"> Changing size </a></li>
							<li><a href="/demos/box/move.html"> Moving </a></li>
							<li><a href="/demos/box/round.html"> Changing rounding </a></li>

						</ul>
						<h4 class="title"> Calling animation </h4>
						<ul class="horizontal">

							<li><a href="/demos/call/carousel.html"> Carousel animation </a></li>
							<li><a href="/demos/call/stretching.html"> Stretching animation </a></li>
							<li><a href="/demos/call/jump.html"> Jumping animation </a></li>

						</ul>
						<h4 class="title"> Screen </h4>
						<ul class="horizontal">

							<li><a href="demos/screen/in.html"> Show in </a></li>
							<li><a href="demos/screen/out.html"> Hide </a></li>

						</ul>
						<h4 class="title"> Pin </h4>
						<ul class="horizontal">

							<li><a href="demos/pin/normal.html"> Normal pinnig </a></li>
							<li><a href="demos/pin/steps.html"> Pinning by steps </a></li>
							<li><a href="demos/pin/one_scene.html"> One scene pinning </a></li>

						</ul>
						<h4 class="title"> Events </h4>
						<ul class="horizontal">

							<li><a href="demos/events/screen_show.html"> Screen show in </a></li>
							<li><a href="demos/events/screen_callback.html"> Screen callback </a></li>
							<li><a href="demos/events/call.html"> Call function by state </a></li>
							<li><a href="demos/events/call_slice.html"> Call function by slice </a></li>

						</ul>
					</div>
				</div>
			</div>
			</div>
		</div>

		<footer>
			<p> <?php echo date('Y'); ?> &copy; enedScroll </p>
		</footer>
<!--
		<div class="scene-3">


			<div class="container">
			<div class="articles-pin-parent">
			<div class="articles-container">
			<div class="articles-slider">
			<div class="articles-parent">

				<div class="block">
					<div class="bp-c">
					<div class="bpc-c">

						<article class="left">
							<picture style="display: inline-block;"><img src="at-1.png"></picture>
							<div class="desc">
								<h1 style="font-size: 55px;">Little code, big effects</h1>
								<p style="font-size: 35px;">A few lines of code gives you many cool options</p>
							</div>
						</article>


					</div>
					</div>
				</div>

				<div class="block">
					<div class="bp-c">
					<div class="bpc-c">

						<article class="right">
							<div class="desc">
								<h1 style="font-size: 55px;">Large library of demos</h1>
								<p style="font-size: 35px;">Many demos which you can see will give you a lot of ways to create amazing animations.</p>
							</div>
							<picture><img src="at-2.png" ></picture>
						</article>


					</div>
					</div>
				</div>

				<div class="block">
					<div class="bp-c">
					<div class="bpc-c">

						<article>
							<picture><img src="at-3.png" ></picture>
							<div class="desc">
								<h1>Do more with plugins</h1>
								<p>Plugins which are in enedScroll will allow you to use more convenience by creating own code.</p>
							</div>
						</article>


					</div>
					</div>
				</div>

			</div>
			</div>
			</div>
			</div>
			</div>

		</div>

		<div class="scene-4">

			<div class="bp-c">
				<div class="bpc-c">
					<div class="wrap-inner">
						<div class="text">
							<h1>Only <span class="decorated">12$</span></h1>
							<h1><span>Purchase</span> now</h1>
						</div>
						<div class="wrap-inner">
							<a href="#"><button class="btn">Buy now</button></a>
						</div>
					</div>
				</div>
			</div>


		</div> -->


		<script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js"></script>
		<script type="text/javascript" src="js/enedScroll.js"></script>
		<script type="text/javascript" src="js/dotter.js"></script>
		<script type="text/javascript" src="js/script.js"></script>

	</body>
</html>
