<!doctype html>
<html>
	<head>
		<meta charset="utf-8">
		<meta http-equiv="X-UA-Compatible" content="IE=edge">
		<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
		<title> enedScroll </title>
		<style>
			span{
				display: inline-block;
			}
		</style>
	</head>
	<body style="margin: 0">
		
		<div class="scene-space" style="height: 300px;"></div>
		<div class="scene1" style="position:relative;height:200px;display:block;text-align: center;">
			<div class="time-100" style="position:absolute;top:0;left:0;width:100%;height:100px;background: rgba(215, 223, 255, 0.4);"></div>
			<div class="time-100" style="position:absolute;top:100px;left:0;width:100%;height:100px;background: rgba(196, 255, 196, 0.4);"></div>
<!-- 			<div class="scene-1-visual" style="position: absolute;z-index: 9999;top: 0;left: 0; width: 100%; height: 100%;">
				<div class="selector-top" style="position:absolute;top:0;left:0;width:100%;height:1px;background: red;text-align: right;">
					<span>Start</span>
				</div>
				<div class="selector-bottom" style="position:absolute;bottom:0;left:0;width:100%;height:1px;background: red;text-align: right;">
					<span>End</span>
				</div>
			</div> -->
		</div>
		<div id="scene2" class="scene2" style="position:relative;top:0;display:block;text-align: center;">
			
<!-- 			<div class="selector-1" style="position:absolute;top:0;left:0;width:100%;height:1px;background: red;"></div>
			<div class="time-100" style="position:absolute;top:0;left:0;width:100%;height:100px;background: rgba(215, 223, 255, 0.4);"></div>
			<div class="time-100" style="position:absolute;top:100px;left:0;width:100%;height:100px;background: rgba(196, 255, 196, 0.4);"></div>
 -->
			<!-- <div class="1" style="width:500px;height:100px;background: blue;"></div>
			<div class="2" style="width:500px;height:200px;background: green;"></div>
			<div class="3" style="width:500px;height:150px;background: purple;"></div>
			 -->

<!--  <div class="spacer s1"></div>
<div id="trigger" class="spacer s1"></div>
<div class="spacer s0"></div>
<div id="pin" class="box1 red" style="height:100px;">
	<p>Unpinned.</p>
	<a href="#" class="viewsource">view source</a>
</div>
<div class="spacer s2"></div> -->

			 <div class="work-space" style="position:relative;z-index: 5;box-sizing: border-box;">
				 <div id="devbox" class="dev-box" style="width:100px;height:100px;padding: 15px;text-align:center;background: lightblue;margin: auto;">
				 	<span>B</span>
				 	<span>O</span>
				 	<span>X</span>
				 </div>
<!-- 				 <div class="b" style="width:100px;height:100px;background: blue;margin-top: 50px;position: relative;">
				 	BOX
				 </div> -->
			</div>
		</div>
		<div class="scene-space" style="height: 500px;"></div>
	
	<div class="myscene" style="width: 100%; height: auto; display: block; position: relative; overflow: hidden;">
		<div class="st-pin" style="width: 100%;height: 600px;">
		<div class="st-p" style="width: 400%;height: 100%;transform-style: preserve-3d;">
			<div class="st" style="width: 25%;height:100%;display:inline-block;    background: #a29ade;    margin-right: -4px;"></div>
			<div class="st" style="width: 25%;height:100%;display:inline-block;	background: #66cdd8;    margin-right: -4px;"></div>
			<div class="st" style="width: 25%;height:100%;display:inline-block;    background: #d5d866;    margin-right: -4px;"></div>
			<div class="st" style="width: 25%;height:100%;display:inline-block;    background: #10ad6d;     margin-right: -0;"></div>
		</div>
		</div>
	</div>

		<div class="scene-space" style="height: 2000px;"></div>

		<script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js"></script>
		<script type="text/javascript" src="http://scrollmagic.io/scrollmagic/uncompressed/ScrollMagic.js"></script>
		<script type="text/javascript" src="http://scrollmagic.io/scrollmagic/uncompressed/plugins/debug.addIndicators.js"></script>
		<script type="text/javascript" src="core_build.js"></script>
		<script type="text/javascript" src="client_build.js?v=1"></script>

<script>
	$(function () { 
		$('.st-pin').css('height', $(window).height());
	// wait for document ready
		// init controller
		// var controller = new ScrollMagic.Controller();

		// // show pin state
		// function updateBox (e) {
		// 	if (e.type == "enter") {
		// 		$("#pin p").text("Pinned.");
		// 	} else {
		// 		$("#pin p").text("Unpinned.");
		// 	}
		// }

		// // build scenes
		// new ScrollMagic.Scene({triggerElement: "#trigger", duration: 150})
		// 	.setPin("#pin")
		// 	.setClassToggle("#pin", "green")
		// 	.on("enter leave", updateBox)
		// 	.addIndicators() // add indicators (requires plugin)
		// 	.addTo(controller);

		// new ScrollMagic.Scene({triggerElement: "#trigger", duration: 150, offset: 300})
		// 	.setPin("#pin")
		// 	.setClassToggle("#pin", "green")
		// 	.on("enter leave", updateBox)
		// 	.addIndicators() // add indicators (requires plugin)
		// 	.addTo(controller);

		// new ScrollMagic.Scene({triggerElement: "#trigger", duration: 1000, offset: 600})
		// 	.setPin("#pin")
		// 	.setClassToggle("#pin", "green")
		// 	.on("enter leave", updateBox)
		// 	.addIndicators() // add indicators (requires plugin)
		// 	.addTo(controller);

		// new ScrollMagic.Scene({triggerElement: "#trigger", duration: 500, offset: 1750})
		// 	.setPin("#pin")
		// 	.setClassToggle("#pin", "green")
		// 	.on("enter leave", updateBox)
		// 	.addIndicators() // add indicators (requires plugin)
		// 	.addTo(controller);
	});
</script>

	</body>
</html>

<!-- Photo by Amy on Unsplash
 -->