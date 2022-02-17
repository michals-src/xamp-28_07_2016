<?php get_header(); ?>

<nav class="navbar cols">
	<div class="holder">
		<div class="brand">
			<h6>enedScroll</h6>
		</div>
		<ul>

			<li><a href="<?php echo esc_url( home_url( '/' ) ); ?>">Home</a></li>
			<li><span class="nav-btn" data-target="#primary-full-navigation"> <i></i> <i></i> </span></li>

		</ul>
	</div>
</nav>

<div class="nav-full" id="primary-full-navigation">
	<div class="middle">
		<div class="ghost-text">
			<h1>enedScroll</h1>
		</div>
			<div class="middle-item">
				<div class="holder">
					
					<div class="cols">
						<div class="col-xsmall-6">
							<header>
								<h3>Also see</h3>
							</header>
						</div>
						<div class="col-xsmall-2">
							<span class="exit-btn" data-target="#primary-full-navigation"> <i></i> <i></i> </span>
						</div>
					</div>
					
					<div class="navbar-full">
						<!-- <ul>
							<li><a href="#">Getting start</a></li>
							<li><a href="#">Defaults</a></li>
							<li><a href="#">Create Trigger</a></li>
							<li><a href="#">Calling enedScroll</a></li>
							<li><a href="#">Essential functions</a></li>
						</ul> -->
						<?php wp_nav_menu( array(
							'theme_location'=>'documentation_nav',
							// 'walker' => new Documentation_Walker(),
							'menu_class' => 'page-navigation'
						)); ?>
					</div>
			</div>
		</div>
	</div>
</div>

<header role="main">
	<div class="holder content">

		<div class="middle">
			<div class="middle-item center">
				<h3>Documentation</h1>
				<h1 class="t-color large"><?php the_title(); ?></h1>
			</div>
		</div>

	</div>
	
	<div class="ghost-text">
		<h1>Documentation</h1>
	</div>

</header>

<div class="holder page">

	<?php
	
		while ( have_posts() ) : the_post();

			the_content();

		endwhile;

	?>

</div>

<?php get_footer(); ?>