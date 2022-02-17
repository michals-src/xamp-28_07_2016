<?php
/**
 * Strona 404
 *
 * @package Montessori
 */

get_header(); ?>

<div class="col-md-9 col-sm-12 col-xs-12 right-side">
	<div class="content white-box">

		<section class="not-found middle-block">
			<div class="not-found-content middle-content">
				
				<header>
					<h2><?php echo montessori_page_404()['title']; ?></h2>
				</header>

				<p><?php echo montessori_page_404()['desc']; ?></p>
				<?php get_search_form(); ?>

			</div>
		</section>

	</div>
</div>

<?php get_footer(); ?>