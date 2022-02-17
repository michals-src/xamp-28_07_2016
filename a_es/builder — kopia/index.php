<!DOCTYPE html>
<html lang="PL-pl">
	<head>

		<title>BUILDER enedScroll</title>
		<meta charset="utf-8">

		<link rel="stylesheet" type="text/css" href="css/open-iconic.css?v=1.1.0">
		<link rel="stylesheet" type="text/css" href="css/style.css">
		<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.1/css/bootstrap.min.css" integrity="sha384-WskhaSGFgHYWDcbwN70/dfYBj47jz9qbsMId/iRN3ewGhXQFZCSftd1LZCfmhktB" crossorigin="anonymous">

		<script type="text/javascript" src="js/angular.js"></script>
		<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>

	</head>
	<body>


		<section>
			<div class="container">
				<header role="main">
					<h3 class="logotext">enedScroll</h3>
					<h6 class="label">Visual builder</h6>
				</header>	
			</div>
		</section>
		<section>
			<div class="container">
				<div class="row">
					<div class="col-xs-12 col-md-8"> 
						<div class="es-builder-stage es-builder-column">
							
							<div class="spacer-2"></div>
							<div class="es-builder-scenery">
								<div id="es-builder-sample_box" class="es-builder-sample_box">
									<span>SAMPLE BOX</span>
								</div><!-- sample-box --> 
							</div>
							<div class="spacer-5"></div>
							<div class="spacer-4"></div>

						</div>
					</div><!-- stage --> 
					<div class="col-xs-12 col-md-4"> 
						<div class="es-builder-settings">

								<header>
										<div class="row align-items-center">
											<div class="col-12">
												<p class="m-0 text-blocked"><strong><span class="oi" data-glyph="cog"></span> <span>Settings</span></strong></p>
												<div class="row">
													<div class="col-12 mt-3">
														<div class="mb-3">
															<strong><p class="mb-0 text-muted">Layer No.</p></strong>
														</div>
														<select name="layer_settings_number" class="form-control" disabled="disabled">
															<option value="null">None</option>
														</select>
														 <small class="form-text text-muted">Select a layer to edit.</small>
													</div>
												</div>
											</div>
										</div>
								</header>
								<div class="mt-4">
									<div class="es-builder-column es-builder-settings-container">


											<!-- Translate X Y Z -->
											<div class="settings-group text-muted">
												<div class="mb-3">
													
													<div class="mb-3">
														<button class="btn settings-btn" type="button" data-toggle="collapse" data-target="#translateCollapse" aria-expanded="false">
															<div class="row">
																<div class="col-10">
																	<strong><p class="mb-0 text-muted">Translate</p></strong>
																</div>
																<div class="col-2 text-center caret-bottom">
																	<span class="oi" data-glyph="caret-bottom"></span>
																</div>
															</div>
														</button>
													</div>

													<div class="collapse" id="translateCollapse">
														<div class="form-group">
															<div class="row no-gutters">	
																<div class="col-2">
																	<div class="line-label item-group-left">
																		<p>X</p>
																	</div>
																</div>
																<div class="col">
																    <input type="number" class="form-control item-group-middle" id="translateX-0" placeholder="start" value="0">
																	<small class="form-text text-muted">Start value</small>
																</div>
																<div class="col">
																	<input type="number" class="form-control item-group-right" id="translateX-1" placeholder="start" value="0">
																	<small class="form-text text-muted">End value</small>
																</div>
															</div>
														</div><!-- translateX -->
														<div class="form-group">
															<div class="row no-gutters">
																<div class="col-2">
																	<div class="line-label item-group-left">
																		<p>Y</p>
																	</div>
																</div>
																<div class="col">
																	<input type="number" class="form-control item-group-middle" id="translateY-0" placeholder="start" value="0">
																	<small class="form-text text-muted">Start value</small>
																</div>
																<div class="col">
																	<input type="number" class="form-control item-group-right" id="translateY-1" placeholder="start" value="0">
																	<small class="form-text text-muted">End value</small>
																</div>
															</div>
														</div><!-- translateY -->
														<div class="form-group">
															<div class="row no-gutters">
																<div class="col-2">
																	<div class="line-label item-group-left">
																		<p>Z</p>
																	</div>
																</div>
																<div class="col">
																	<input type="number" class="form-control item-group-middle" id="translateZ-0" placeholder="start" value="0">
																	<small class="form-text text-muted">Start value</small>
																</div>
																<div class="col">
																	<input type="number" class="form-control item-group-right" id="translateZ-1" placeholder="start" value="0">
																	<small class="form-text text-muted">End value</small>
																</div>
															</div>
														</div><!-- translateZ -->
													</div>

												</div>
											</div>

											
											<!-- Scale X Y Z -->
											<div class="settings-group text-muted">
												<div class="mb-3">

													<div class="mb-3">
														<button class="btn settings-btn" type="button" data-toggle="collapse" data-target="#scaleCollapse" aria-expanded="false">
															<div class="row">
																<div class="col-10">
																	<strong><p class="mb-0 text-muted">Scale</p></strong>
																</div>
																<div class="col-2 text-center caret-bottom">
																	<span class="oi" data-glyph="caret-bottom"></span>
																</div>
															</div>
														</button>
													</div>

													<div class="collapse" id="scaleCollapse">
														<div class="form-group">
															<div class="row no-gutters">
																<div class="col-2">
																	<div class="line-label item-group-left">
																		<p>X</p>
																	</div>
																</div>
																<div class="col">
																	<input type="number" class="form-control item-group-middle" id="scaleX-0" value="0">
																	<small class="form-text text-muted">Start value</small>
																</div>
																<div class="col">
																	<input type="number" class="form-control item-group-right" id="scaleX-1" value="0">
																	<small class="form-text text-muted">End value</small>
																</div>
															</div>
														</div><!-- scaleX -->
														<div class="form-group">
															<div class="row no-gutters">
																<div class="col-2">
																	<div class="line-label item-group-left">
																		<p>Y</p>
																	</div>
																</div>
																<div class="col">
																	<input type="number" class="form-control item-group-middle" id="scaleY-0" value="0">
																	<small class="form-text text-muted">Start value</small>
																</div>
																<div class="col">
																	<input type="number" class="form-control item-group-right" id="scaleY-1" value="0">
																	<small class="form-text text-muted">End value</small>
																</div>
															</div>
														</div><!-- scaleY -->
														<div class="form-group">
															<div class="row no-gutters">
																<div class="col-2">
																	<div class="line-label item-group-left">
																		<p>Z</p>
																	</div>
																</div>
																<div class="col">
																	<input type="number" class="form-control item-group-middle" id="scaleZ-0" value="0">
																	<small class="form-text text-muted">Start value</small>
																</div>
																<div class="col">
																	<input type="number" class="form-control item-group-right" id="scaleZ-1" value="0">
																	<small class="form-text text-muted">End value</small>
																</div>
															</div>
														</div><!-- scaleZ -->
													</div>

												</div>
											</div>

											
											<!-- Rotate X Y Z -->
											<div class="settings-group text-muted">
												<div class="mb-3">

													<div class="mb-3">
														<button class="btn settings-btn" type="button" data-toggle="collapse" data-target="#rotateCollapse" aria-expanded="false">
															<div class="row">
																<div class="col-10">
																	<strong><p class="mb-0 text-muted">Rotate</p></strong>
																</div>
																<div class="col-2 text-center caret-bottom">
																	<span class="oi" data-glyph="caret-bottom"></span>
																</div>
															</div>
														</button>
													</div>

													<div class="collapse" id="rotateCollapse">
														<div class="form-group">
															<div class="row no-gutters">
																<div class="col-2">
																	<div class="line-label item-group-left">
																		<p>X</p>
																	</div>
																</div>
																<div class="col">
																	<input type="number" class="form-control item-group-middle" id="rotateX-0" value="0">
																	<small class="form-text text-muted">Angle start</small>
																</div>
																<div class="col">
																	<input type="number" class="form-control item-group-right" id="rotateX-1" value="0">
																	<small class="form-text text-muted">Angle end</small>
																</div>
															</div>
														</div><!-- rotateX -->
														<div class="form-group">
															<div class="row no-gutters">
																<div class="col-2">
																	<div class="line-label item-group-left">
																		<p>Y</p>
																	</div>
																</div>
																<div class="col">
																	<input type="number" class="form-control item-group-middle" id="rotateY-0" value="0">
																	<small class="form-text text-muted">Angle start</small>
																</div>
																<div class="col">
																	<input type="number" class="form-control item-group-right" id="rotateY-1" value="0">
																	<small class="form-text text-muted">Angle end</small>
																</div>
															</div>
														</div><!-- rotateY -->
														<div class="form-group">
															<div class="row no-gutters">
																<div class="col-2">
																	<div class="line-label item-group-left">
																		<p>Z</p>
																	</div>
																</div>
																<div class="col">
																	<input type="number" class="form-control item-group-middle" id="rotateZ-0" value="0">
																	<small class="form-text text-muted">Angle start</small>
																</div>
																<div class="col">
																	<input type="number" class="form-control item-group-right" id="rotateZ-1" value="0">
																	<small class="form-text text-muted">Angle end</small>
																</div>
															</div>
														</div><!-- rotateZ -->
													</div>

												</div>
											</div>

											
											<!-- Skew X Y -->
											<div class="settings-group text-muted">
												<div class="mb-3">

													<div class="mb-3">
														<button class="btn settings-btn" type="button" data-toggle="collapse" data-target="#skewCollapse" aria-expanded="false">
															<div class="row">
																<div class="col-10">
																	<strong><p class="mb-0 text-muted">Skew</p></strong>
																</div>
																<div class="col-2 text-center caret-bottom">
																	<span class="oi" data-glyph="caret-bottom"></span>
																</div>
															</div>
														</button>
													</div>

													<div class="collapse" id="skewCollapse">
														<div class="form-group">
															<div class="row no-gutters">
																<div class="col-2">
																	<div class="line-label item-group-left">
																		<p>X</p>
																	</div>
																</div>
																<div class="col">
																	<input type="number" class="form-control item-group-middle" id="skewX-0" value="0">
																	<small class="form-text text-muted">Angle start</small>
																</div>
																<div class="col">
																	<input type="number" class="form-control item-group-right" id="skewX-1" value="0">
																	<small class="form-text text-muted">Angle end</small>
																</div>
															</div>
														</div><!-- skewX -->
														<div class="form-group">
															<div class="row no-gutters">
																<div class="col-2">
																	<div class="line-label item-group-left">
																		<p>Y</p>
																	</div>
																</div>
																<div class="col">
																	<input type="number" class="form-control item-group-middle" id="skewY-0" value="0">
																	<small class="form-text text-muted">Angle start</small>
																</div>
																<div class="col">
																	<input type="number" class="form-control item-group-right" id="skewY-1" value="0">
																	<small class="form-text text-muted">Angle end</small>
																</div>
															</div>
														</div><!-- skewY -->
													</div>

												</div>
											</div>

											
											<!-- Opacity -->
											<div class="settings-group text-muted">
												<div class="mb-3">

													<div class="mb-3">
														<button class="btn settings-btn" type="button" data-toggle="collapse" data-target="#opacityCollapse" aria-expanded="false">
															<div class="row">
																<div class="col-10">
																	<strong><p class="mb-0 text-muted">Opacity</p></strong>
																</div>
																<div class="col-2 text-center caret-bottom">
																	<span class="oi" data-glyph="caret-bottom"></span>
																</div>
															</div>
														</button>
													</div>

													<div class="collapse" id="opacityCollapse">
														<div class="form-group">
															<div class="row no-gutters">
																<div class="col">
																	<input type="number" class="form-control item-group-left" id="opacity-0" value="0" max="1" min="0">
																	<small class="form-text text-muted">Start value</small>
																</div>
																<div class="col">
																	<input type="number" class="form-control item-group-right" id="opacity-1" value="0" max="1" min="0">
																	<small class="form-text text-muted">End value</small>
																</div>
															</div>
														</div><!-- Opacity -->
													</div>

												</div>
											</div>

											<!-- Color -->
											<div class="settings-group text-muted">
												<div class="mb-3">

													<div class="mb-3">
														<button class="btn settings-btn" type="button" data-toggle="collapse" data-target="#colorCollapse" aria-expanded="false">
															<div class="row">
																<div class="col-10">
																	<strong><p class="mb-0 text-muted">Color</p></strong>
																</div>
																<div class="col-2 text-center caret-bottom">
																	<span class="oi" data-glyph="caret-bottom"></span>
																</div>
															</div>
														</button>
													</div>

													<div class="collapse" id="colorCollapse">
														<div class="form-group">
															<div class="row no-gutters">
																<div class="col">
																	<input type="color" class="form-control item-group-left" id="color-0" value="#000000">
																	<small class="form-text text-muted">Start value</small>
																</div>
																<div class="col">
																	<input type="color" class="form-control item-group-right" id="color-1" value="#000000">
																	<small class="form-text text-muted">End value</small>
																</div>
															</div>
														</div><!-- Color -->
													</div>

												</div>
											</div>

									</div> <!-- es-builder-settings-container -->
								</div> <!-- mt -->

								<footer>
									<button id="es-builder-layer-settings-save" class="btn btn-primary" disabled="disabled">Save settings</button>
								</footer>

						</div>
					</div><!-- SETTINGS --> 
				</div>
			</div>
		</section>
		<section> 
			<div class="container">
				<div class="es-builder-column es-builder-timeline">
					
					<header>
						<div class="row align-items-center">
							<div class="col-1">
								<p class="m-0"><strong>Timeline</strong></p>
							</div>
							<div class="col text-left">

								<button class="btn btn-sm btn-outline-light" type="button">
									<strong><p class="mb-0"><span class="oi" data-glyph="pencil" es-builder-expand="#es-edit-timeline"></span></p></strong>
								</button>
								
							</div>
						</div>
					</header>
					<div class="es-builder-timeline-container">
							
							<div class="es-builder-timeline-measures row no-gutters">
								<!-- <div class="es-builder-timeline-measure prototype"></div> -->
							</div><!-- es-builder-timeline-measures -->
							
							<div class="es-builder-timeline-trigger"></div> <!-- es-builder-timeline-trigger -->

							<div class="es-builder-timeline-layers">
								<div class="es-builder-timeline-layer-none in">
									<h2>No layer exists.</h2>
									<p>Create it now usign edit button above.</p>
								</div>
								<!-- <div class="es-builder-timeline-layer prototype">
									<div role="child"></div>
								</div> -->
							</div><!-- es-builder-timeline-layers -->
					</div>

				</div>
				<!-- TIMELINE -->
			</div>
		</section>


		</div>

		<div class="es-black-bg"></div>
		<div id="es-edit-timeline" class="timeline-settings-panel panel">
			<div class="p-3">


				<header>
					<div class="row align-items-center">
						<div class="col-7">
							<p class="m-0 text-uppercase"><strong>Timeline settings</strong></p>
						</div>
					</div>
				</header>
			
				<div class="win timeline-settings-panel-container">
					<div class="mt-5">

						
						<!-- settings -->
						<div class="settings-group text-muted">
							<div class="mb-3">

								<div class="mb-3">
									<strong><p class="mb-0 text-muted">Layer No.</p></strong>
								</div>

								<div id="timelineCollapse">
									<div class="form-group">
										<div class="row">
											<div class="col-12 form-group">
												<input type="text" class="form-control" name="layer_name" placeholder="Layer name" disabled="disabled" value="1">
											</div>
						
											<div class="col-12 form-group">
												<div class="row">
													<div class="col-6">
														<div class="mb-3">
															<strong><p class="mb-0 text-muted">Duration</p></strong>
														</div>
														<input name="layer_duration" type="number" class="form-control" min="0" max="20" value="1" step="1">
													</div> <!-- Duration -->
													<div class="col-6">
														<div class="mb-3">
															<strong><p class="mb-0 text-muted">Offset</p></strong>
														</div>
														<input name="layer_offset" type="number" class="form-control" min="0" max="20" value="0">
													</div> <!-- Offset -->
												</div>
											</div>
											<div class="col-12 form-group">
												<button class="btn btn-primary" name="layer_create" type="button">Add Layer</button>
											</div>

										</div><!-- Row -->
									</div><!-- Layer -->
								</div>		

								<div id="timelineCollapse mt-5">
									<div class="form-group mt-5">
										<div class="row">
											<div class="col-12 form-group">
												<div class="mb-3">
													<strong><p class="mb-0 text-danger">Layer No. <span class="badge badge-danger">Remove</span></p></strong>
												</div>
												<select name="layer_trash" class="form-control is-invalid">
													<option value="1">1</option>
													<option value="2">2</option>
													<option value="2">3</option>
													<option value="2">4</option>
												</select>
											</div><!-- Select -->
											<div class="col-12 form-group">
												<button class="btn btn-danger" name="layer_remove" type="button">Trash</button>
											</div><!-- Button -->
										</div>
									</div><!-- Trash -->
								</div>

								<div id="timelineCollapse mt-5">
									<div class="form-group mt-5">
										<div class="row">
											<div class="col-12 form-group">
												<div class="col-12 form-group text-right">
													<button class="btn btn-lg btn-primary" name="close" type="button" es-builder-hide="#es-edit-timeline" >Close</button>
												</div><!-- Button -->
											</div>
										</div>
									</div><!-- Trash -->
								</div>

							</div>
						</div>

					</div>
				</div>

			</div>
		</div>



		<script src="https://code.jquery.com/jquery-3.3.1.slim.min.js" integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo" crossorigin="anonymous"></script>
		<script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.3/umd/popper.min.js" integrity="sha384-ZMP7rVo3mIykV+2+9J3UJ46jBk0WLaUAdn689aCwoqbBJiSnjAK/l8WvCWPIPm49" crossorigin="anonymous"></script>
		<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.1.1/js/bootstrap.min.js" integrity="sha384-smHYKdLADwkXOn1EmN1qk/HfnUcbVRZyYmZ4qpPea6sjB/pTJ0euyQp0Mk8ck+5T" crossorigin="anonymous"></script>
		
		<script type="text/javascript" src="js/scrollreveal.js"></script>

		<script type="text/javascript" src="js/enedScroll.src.js"></script>
		<script type="text/javascript" src="js/enedScroll.builder.js"></script>
		<script type="text/javascript" src="js/enedScroll.js"></script>
		<script>
			(function($){

				var $esBulderExpand = $('[es-builder-expand]');
				var $esBulderHide = $('[es-builder-hide]');

				$esBulderExpand.on( "click", function( e ){

					e.preventDefault();
					$(document).find( $(this).attr("es-builder-expand") ).addClass( "in" );
					$(".es-black-bg").addClass( "in" );

				});

				$esBulderHide.on( "click", function( e ){

					e.preventDefault();
					$(document).find( $(this).attr("es-builder-hide") ).removeClass( "in" );
					$(".es-black-bg").removeClass( "in" );

				});

			})(jQuery);
		</script>

	</body>
</html>