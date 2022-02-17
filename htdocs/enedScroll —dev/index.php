<!doctype html>
<html>

	<head>
		<link rel="stylesheet" href="style.css">
		<title>enedScroll</title>
	</head>
	<body>

		<div class="container">
		
		<div class="archicetures" style="margin-bottom: 100px;">
			<h2>Architectures</h2>
			<div class="links">
				<a href="screen.html"> Screen </a>
				<a href="official.php"> OFFICIAL ENEDSCROLL WEBSITE </a>
			</div>
		</div>

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

			<div class="item1" id="item1" style="height: 1000px;">
					
					<div class="myText"  style="text-align: center;width: 300px;margin-left:auto;margin-right: auto;position: relative;z-index: 99999;">
						<h2 class="myh2text" style="text-align: center;margin:0;left:0;">My text animation</h2>
						<p>This is description of text</p>
						<div class="abc dfdfgrt dsfg" style="width:250px;height: 150px;margin:0 auto;background: red;z-index: 9999999999999"></div>
					</div>

					
	
			</div>
			<div class="item2">
				<h2>Sreen plugin</h2>

				<div class="screens-scene">
				
					<div class="screen-1" style="background: #4eedff;color: #0d6b75;"> <div class="screen"> <div class="screen-child"> <h2>SCREEN 1</h2> </div> </div> </div>

					<div class="screen-2" style="background: #b458e2;color: #fff;"> <div class="screen"> <div class="screen-child"> <h2>SCREEN 1</h2> </div> </div> </div>

					<div class="screen-3" style="background: #ffe86f;color: #8e7c1d;"> <div class="screen"> <div class="screen-child"> <h2>SCREEN 1</h2> </div> </div> </div>

					<div class="screen-4" style="background: #54da03;color: #fff;"> <div class="screen"> <div class="screen-child"> <h2>SCREEN 1</h2> </div> </div> </div>

				</div>

				<div class="div" style="padding: 35px;width:100%;"></div>

				<div class="screens-scene-2">
				
					<div class="screen-1" style="background: #4eedff;color: #0d6b75;"> <div class="screen"> <div class="screen-child"> <h2>SCREEN 1</h2> </div> </div> </div>

					<div class="screen-2" style="background: #b458e2;color: #fff;"> <div class="screen"> <div class="screen-child"> <h2>SCREEN 1</h2> </div> </div> </div>

					<div class="screen-3" style="background: #ffe86f;color: #8e7c1d;"> <div class="screen"> <div class="screen-child"> <h2>SCREEN 1</h2> </div> </div> </div>

					<div class="screen-4" style="background: #54da03;color: #fff;"> <div class="screen"> <div class="screen-child"> <h2>SCREEN 1</h2> </div> </div> </div>

				</div>

			</div>
			<div class="item3">
				<h2>Move element</h2>
			</div>
			<div class="item4">
				<h2>Margin manipulate element</h2>
			</div>
			<div class="item5">
				<h2>Transform element</h2>
			</div>
			<div class="item-slice">
				<div class="scene" style="width:100%;height: 600px;">
					<div class="c" style="overflow:hidden;">
					<div class="n" style="position:relative;">
						<div class="abc111 1" style="width: 300px;height: 150px;background: #ddd;"></div>				
						<div class="abc111 2" style="width: 300px;height: 150px;background: #ccc;"></div>				
						<div class="abc111 3" style="width: 300px;height: 150px;background: #bbb;"></div>				
						<div class="abc111 4" style="width: 300px;height: 150px;background: #aaa;"></div>				
					</div>
					</div>
				</div>
			</div>
			<div class="item6">
				<h2 class="showIn">Show in element</h2>
			</div>
			<div class="item7">
				<h2 class="showOut">Show out element</h2>
			</div>
		</div>
		
		<script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js"></script>
		<script type="text/javascript" src="enedScroll.js?v=1"></script>
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