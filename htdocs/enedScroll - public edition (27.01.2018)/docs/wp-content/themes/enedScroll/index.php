<?php get_header(); ?>

<header role="main">
	<div class="holder content">

		<div class="middle">
			<div class="middle-item center">
				<h1 class="t-color large">Documentation</h1>
				<h4>Introduce with enedScroll</h4>
			</div>
		</div>

	</div>
	
	<div class="ghost-text">
		<h1>Introduction</h1>
	</div>

</header>

	<?php wp_nav_menu( array(
		'theme_location'=>'documentation_nav',
		'walker' => new Documentation_Walker(),
		'menu_class' => 'tabs'
	)); ?>

<div class="holder">

	<article>
		<h2>Notes</h2>
		<p>
			<ul style="list-style: initial;">
				<li><p>Pin does not work corretly with padding-left, padding-right.</p></li>
				<li><p>Converting value [start,end] cannot has a whitespace.</p></li>
			</ul>
			Do not be worried. It will be repair as fast as it is possible.
		</p>
	</article>

</div>


<?php get_footer(); ?>