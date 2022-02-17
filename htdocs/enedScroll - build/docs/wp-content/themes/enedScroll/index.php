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

<!-- <div class="text holder">
	
	<h1>h1 text <small>h1 small</small> </h1>
	<h2>h2 text <small>h1 small</small> </h2>
	<h3>h3 text <small>h1 small</small> </h3>
	<h4>h4 text <small>h1 small</small> </h4>
	<h5>h5 text <small>h1 small</small> </h5>
	<h6>h6 text <small>h1 small</small> </h6>
	<p>p text</p>

	<h1 class="large">h1 text</h1>
	<h2 class="large">h2 text</h2>
	<h3 class="large">h3 text</h3>
	<h4 class="large">h4 text</h4>
	<h5 class="large">h5 text</h5>
	<h6 class="large">h6 text</h6>
	<p class="large">p text large</p>

</div> -->

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

<!-- 	<article>
		
		<div class="ghost-text"> <h3>#1</h3> </div>

		<h2>Simple text</h2>
		<button class="more"> <a href="#">See example</a> </button>

	</article> -->

</div>


<?php get_footer(); ?>