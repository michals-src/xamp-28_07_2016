<?php

/**
 * Szablon dla strony
 * 
 * 
 * @subpackage Combat
 * @return  Strona z informacją o "braku obsługi stron"
 */

get_header(); 

?>

	<section class="container-fluid" role="main" id="start">

		<header role="presentation">
			<div class="container hl">
				<a href="https://www.facebook.com/combat.bialystok.samoobrona/" target="_blank">
					<img src="<?php echo get_template_directory_uri() . '/images/hl.png'; ?>">
				</a>
			</div>
			<!-- Nawigacja -->
			<nav class="clearfix" role="primary">
				<div class="_pnv nav-content clearfix">
					<ul class="nav">
						<li>
							<a href="<?php echo home_url(); ?>" class="blink">Strona główna</a>
						</li>
					</ul>
				</div>
			</nav>
			<!-- / Nawigacja -->

			<div class="container" style="height:100%;display:table;margin-top:-35px;">

				<div class="_mco _bc">
					<div class="_mcc">

							<div class="_mctc">
								<h1 class="_st text-center"> Podana strona nie istnieje </h1>
								<h3 class="_st text-center"> Proszę przejść na stronę główną </h3>
							</div>

					</div>
				</div>

			</div>

		</header>

	</section>
<?php get_footer(); ?>