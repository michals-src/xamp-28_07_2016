<!doctype html>
<html>

	<head>
		<link rel="stylesheet" href="style.css">
		<title>enedScroll</title>
	</head>
	<body>

		<div class="container">
		<!--
		<div class="item0">
			<div class="a" style="width:100%;height:400px;"></div>
			<div class="spacer s1"></div>
			<div id="trigger" class="spacer s1"></div>
			<div class="spacer s0"></div>
			<div id="pin" class="box1 red">
				<p>Unpinned.</p>
				<a href="#" class="viewsource">view source</a>
			</div>
			<div class="spacer s2"></div>
			<div class="a" style="width:100%;height:400px;"></div>
		</div>
		-->

			<div class="item1" id="item1" style="height: 800px;">
					
					<div class="myText"  style="text-align: center;width: 300px;margin-left:auto;margin-right: auto;position: relative;z-index: 99999;">
						<h2 class="aa" style="text-align: center;margin:0;left:0;">My text animation</h2>
						<p>This is description of text</p>
						<div class="abc dfdfgrt dsfg" style="width:250px;height: 150px;margin:0 auto;background: red;z-index: 9999999999999"></div>
					</div>

					
	
			</div>
			<div class="item2" style="height: auto;">
				<h2>Pin element</h2>
				<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet consequuntur maiores velit, non quasi voluptate voluptatem porro inventore hic! Adipisci ex cumque excepturi mollitia unde expedita odit assumenda voluptates porro.</p>
				<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet consequuntur maiores velit, non quasi voluptate voluptatem porro inventore hic! Adipisci ex cumque excepturi mollitia unde expedita odit assumenda voluptates porro.</p>
				<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet consequuntur maiores velit, non quasi voluptate voluptatem porro inventore hic! Adipisci ex cumque excepturi mollitia unde expedita odit assumenda voluptates porro.</p>
				<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet consequuntur maiores velit, non quasi voluptate voluptatem porro inventore hic! Adipisci ex cumque excepturi mollitia unde expedita odit assumenda voluptates porro.</p>
				<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet consequuntur maiores velit, non quasi voluptate voluptatem porro inventore hic! Adipisci ex cumque excepturi mollitia unde expedita odit assumenda voluptates porro.</p>
				<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet consequuntur maiores velit, non quasi voluptate voluptatem porro inventore hic! Adipisci ex cumque excepturi mollitia unde expedita odit assumenda voluptates porro.</p>
				<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet consequuntur maiores velit, non quasi voluptate voluptatem porro inventore hic! Adipisci ex cumque excepturi mollitia unde expedita odit assumenda voluptates porro.</p>
				<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet consequuntur maiores velit, non quasi voluptate voluptatem porro inventore hic! Adipisci ex cumque excepturi mollitia unde expedita odit assumenda voluptates porro.</p>
				<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet consequuntur maiores velit, non quasi voluptate voluptatem porro inventore hic! Adipisci ex cumque excepturi mollitia unde expedita odit assumenda voluptates porro.</p>
			</div>
			<div class="item3">
				<h2>Transform element</h2>
			</div>
			<div class="item4">
				<h2>Move element</h2>
			</div>
			<div class="item4">
				<h2>Margin manipulate element</h2>
			</div>
			<div class="item5">
				<h2>Opacity element</h2>
			</div>
			<div class="item5">
				<h2>Show in element</h2>
			</div>
			<div class="item5">
				<h2>Show out element</h2>
			</div>
		</div>
		
		<script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js"></script>
		<script type="text/javascript" src="enedScroll.js"></script>
		<script type="text/javascript" src="script.js"></script>

		<script type="text/javascript" src="ScrollMagic.js"></script>
		<script src="//cdnjs.cloudflare.com/ajax/libs/ScrollMagic/2.0.5/plugins/debug.addIndicators.min.js"></script>
		<script>
	// $(function () { // wait for document ready
	// 	// init controller
	// 	var controller = new ScrollMagic.Controller();

	// 	// show pin state
	// 	function updateBox (e) {
	// 		if (e.type == "enter") {
	// 			$("#pin p").text("Pinned.");
	// 		} else {
	// 			$("#pin p").text("Unpinned.");
	// 		}
	// 	}

	// 	// build scenes
	// 	new ScrollMagic.Scene({triggerElement: "#trigger", duration: 100})
	// 		.setPin("#pin")
	// 		.setClassToggle("#pin", "green")
	// 		.on("enter leave", updateBox)
	// 		.addIndicators() // add indicators (requires plugin)
	// 		.addTo(controller);

	// 	new ScrollMagic.Scene({triggerElement: "#trigger", duration: 100, offset: 200})
	// 		.setPin("#pin")
	// 		.setClassToggle("#pin", "green")
	// 		.on("enter leave", updateBox)
	// 		.addIndicators() // add indicators (requires plugin)
	// 		.addTo(controller);

	// 	new ScrollMagic.Scene({triggerElement: "#trigger", duration: 100, offset: 400})
	// 		.setPin("#pin")
	// 		.setClassToggle("#pin", "green")
	// 		.on("enter leave", updateBox)
	// 		.addIndicators() // add indicators (requires plugin)
	// 		.addTo(controller);
	// });

		</script>
	</body>

</html>