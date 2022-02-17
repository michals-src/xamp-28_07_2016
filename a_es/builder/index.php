<!DOCTYPE html>
<html lang="PL-pl">
	<head>

		<title>BUILDER enedScroll</title>
		<meta charset="utf-8">

		<link rel="stylesheet" type="text/css" href="css/open-iconic.css?v=1.1.0">
		<link rel="stylesheet" type="text/css" href="css/style.css">

	</head>
	<body>

	<section class="mrgn pdds-b headerTop">
		<h3 class="logo-text">enedScroll</h3>
		<div class="space-2"></div>
	</section>

	<div class="pddh">

		<section class="_brg es-editor">
			<div class="rw ng">
				<div class="col-sm-6 stage-container">
					<div class="">
						<div class="stage-spy">
							<div class="box-parent">
								<div class="box">
									<strong><p>Element</p></strong>
								</div>
								<p class="desc" id="scrollInfo">Scroll down</p>
							</div>
							<div class="space-5"></div>
							<div class="space-5"></div>
						</div>
						<div class="dir-arrows">
							<div class="arrow arrowTop" role="arrowTop">
								<span class="oi" data-glyph="arrow-top"></span>
							</div>
							<div class="arrow arrowBottom" role="arrowBottom">
								<span class="oi" data-glyph="arrow-bottom"></span>
							</div>
						</div>
					</div>
				</div>
				<div class="col-sm-10" id="timeline">
					<div class="timeline-container">
						<div class="rw pdd pddv-s timeline-header">
							<div class="col-sm-10">
								<h4 class="mrgn timeline-headText">Timeline</h4>
							</div>
							<div class="col-sm-6 txrit pddn">
								<nav class="nvh navAction pddn">
									<ul>
										<li><a href="#" rel="dialog"><span class="nvIt">Edit</span> <span class="oi" data-glyph="cog"></span> </a></li>
									</ul>
								</nav>
							</div>
						</div>
						<div class="timeline-overlay">
							<div class="timeline-measures">
								<div class="timeline-measure">
									<span class="timeline-measureText">1</span>
									<div class="timeline-measureChild"></div>
								</div>
								<div class="timeline-measure">
									<span class="timeline-measureText">2</span>
									<div class="timeline-measureChild"></div>
								</div>							
								<div class="timeline-measure">
									<span class="timeline-measureText">3</span>
									<div class="timeline-measureChild"></div>
								</div>
							</div>
							<div class="timeline-layers">

								<div class="rw ng">
									<div class="col-sm-16">
										<div class="rw">
											<div class="col-sm-15 timeline-layer">
												<div class="timeline-layerVisual">
													<p>Layer 1</p>
													<div class="timeline-layerDuration"></div>
												</div>
											</div>
											<div class="col-sm-1">
												<div class="timeline-layerAction">
													<a href="#"><button rel="remove"><span class="oi" data-glyph="trash"></span></button></a>
												</div>
											</div>
										</div>
									</div>
									<div class="col-sm-16">
										<div class="col-sm-15 timeline-layer" role="creator">
											<div class="timeline-layerVisual">
												<p>Create layer</p>
											</div>
										</div>
										<div class="col-sm-1">											
											<div class="timeline-layerAction" role="creator">
												<a href="#"><button rel="create"><span class="oi" data-glyph="plus"></span></button></a>
											</div>
										</div>

									</div>
								</div>

							</div>
						</div>
					</div>
				</div>
			</div>
		</section>


	</div>
	<div aria-shown="false" role="dialog">
		<div class="modal-container pddvl">
			<header>
				<div class="rw">
					<div class="col-sm-10">
						<h1 class="dialogTitle">Settings</h1>
					</div>
					<div class="col-sm-6">
						<div class="dialogClose"></div>
					</div>
				</div>
			</header>
			<div class="dialog-container">
				<form action="/" method="post" onchange="return hello(this,event);">
					<div class="rw">
						<div class="col-sm-15">
							<label for="layerSelect">Select a layer number</label>
							<select name="layerSelect" id="layerSelect" class="fi">
								<option value="1">1</option>
								<option value="2">2</option>
								<option value="3">3</option>
								<option value="4">4</option>
								<option value="5">5</option>
							</select>
							<button>Abc</button>
						</div>
					</div>
				</form>
			</div>
		</div>
	</div>
				<script type="text/javascript">
		function hello(a,b){
			console.log(b);
			return false;
		};
	</script>

	</body>
</html>