<?php 

	/**
	 * Template Name: Strona główna
	 *
	 * @package WordPress
	 * @subpackage Rakantbud
	 * @since Rakant-Bud 1.0
	 */
?>
<?php get_template_part('content', 'header'); ?>

	<div class="_sct about">
			<div class="_ats" style="display:block;">
					<ul class="_lstn">
						<li class="_dflx text-center">
							<img src="<?php echo get_template_directory_uri(); ?>/images/b1.png" width="100%">
						</li>
					</ul>
			</div>
	</div>

	<div class="_sct description">
		<div class="container">
		<div class="row">
			<div class="col-lg-5 col-md-5 col-sm-5 hidden-xs" style="margin-top:100px;">
				<img src="<?php echo get_template_directory_uri(); ?>/images/dimg.jpg" style="width: 100%;height:300px;"/>
			</div>
			<div class="col-lg-offset-1 col-md-offset-1 col-sm-offset-1 col-lg-6 col-md-6 col-sm-6 col-xs-12">
				<div class="_ctnt-txt">
					<h2 class="_ftt"> <i class="glyphicon glyphicon-thumbs-up"></i> O nas</h2>
					<p>
						Witamy. 

						Firma nasza posiada wieloletnie doświadczenie w wykonywaniu izolacji termicznej oraz remonty i wykończenia wnętrz budynków  mieszkalnych i usługowych .
					</p>
					<div class="_atrs">
						<h4 style="margin-bottom:25px;"><span class="label label-warning" style="padding-top:8px;"><i class="glyphicon glyphicon-option-vertical" style="margin-right:5px;"></i> Wykonujemy również</span></h4>
						<ul class="row _lstn">
							
							<li class="col-lg-6 col-md-6"><i class="attr-1"><span class="path1"></span><span class="path2"></span><span class="path3"></span><span class="path4"></span><span class="path5"></span></i> Wykonanie podbitki z szalówki, na podbudowie płyty OSB i tynków szlachetnych </li>
							<li class="col-lg-6 col-md-6"><i class="attr-2"></i> Mycie i malowanie elewacji </li>
							<li class="col-lg-6 col-md-6"><i class="attr-3"><span class="path1"></span><span class="path2"></span><span class="path3"></span><span class="path4"></span></i>Ocieplenie poddaszy i zabudowa płytą GK</li>
							<li class="col-lg-6 col-md-6"><i class="attr-4"></i> Układanie kamienia elewacyjnego </li>
							<li class="col-lg-6 col-md-6"><i class="attr-5"></i> Układanie granitu na schodach i tarasach </li>
							<li class="col-lg-6 col-md-6"><i class="attr-6"></i> Wykonamy detale architektoniczne jakie zażyczysz </li>

						</ul>
					</div>
				</div>
			</div>
		</div>
		</div>
	</div>

	<div class="_sct  portfolio _aps">
		<div class="portfolio-list">
			<div class="container">
				<h2 class="_ftt"> <i class="glyphicon glyphicon-camera"></i> Galeria </h2>
			</div>
			
			<div class="row portfolio-list-content">
				<?php 

				$images = RakantbudGallery::getImages();
				$counter = 0;

				foreach($images[0] as $key => $value):

					$attachment = wp_get_attachment_image_src($value->id, 'large');
					
					if($key <= 6):
						if($key === $counter):

					?>
						
						<div class="portfolio-item col-md-4 col-sm-4 col-xs-12">

							<a href="<?php echo $value->url; ?>" style="
								display:inline-block !important;
								height:100%;
							" data-lightbox="podgląd">
								<img src="<?php echo $attachment[0]; ?>">
							</a>

						</div>

					<?php
							$counter = $counter + 3;
						endif;
					endif;

				endforeach; ?>

			</div>

			<div class="container text-center reference">
			<?php $portfolio =  get_page_by_title( strtolower( 'Nasze projekty' ) ); ?>
				<a href="<?php echo get_permalink($portfolio->ID); ?>" style="position:relative;z-index:1000;">
					<button>Zobacz całą galerię</button>
				</a>
			</div>
		</div>
	</div>
	<div class="_sct kontakt">
		<div class="container">
			<h2 class="_ftt"> <i class="glyphicon glyphicon-envelope"></i> Kontakt </h2>
		</div>
		<div class="row" style="margin:0;">

				<div class="col-lg-5 col-md-5 col-sm-12 col-xs-12 kontakt-info">

					<div class="col-md-12 col-sm-6 col-xs-12 cil">
						<h1>
							<div class="glyphicon glyphicon-earphone"></div>
						</h1>
						<p class="hidden-sm hidden-xs cilT">Kontakt telefoniczny</p>
						<strong style="color:#fff;"><?php echo RakantbudSettings::get('rb_st_phone'); ?></strong>
					</div>
					<div class="col-md-12 col-sm-6 col-xs-12 cil">
						<h1>
							<div class="glyphicon glyphicon-envelope"></div>
						</h1>
						<p class="hidden-sm hidden-xs cilT">Adres Email</p>
						<strong style="color:#fff;"><?php echo RakantbudSettings::get('rb_st_email'); ?></strong>
					</div>

				</div>

				<div class="col-lg-5 col-md-5 col-sm-12 col-xs-12">
					<div style="width:100%;">
						<?php if ( function_exists( 'smuzform_render_form' ) ) { smuzform_render_form('34'); } ?>
					</div>
				</div>

		</div>
	</div>


<?php get_footer(); ?>