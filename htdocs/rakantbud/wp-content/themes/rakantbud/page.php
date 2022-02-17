<?php get_template_part('content', 'header'); ?>

	<?php while(have_posts()) : the_post(); ?>

		<div class="page-content">
			
			<?php the_content(); ?>

		</div>

	<?php endwhile; ?>

<?php get_footer(); ?>