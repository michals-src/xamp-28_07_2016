<?php
/**
 * Część szablonu odpowiedzialna za wyświetlenie galerii
 *
 *
 * @package WordPress
 * @subpackage Montessori
 * @since 1.0
 * @version 1.0
 */

?>
<article <?php post_class(); ?>>
	<div class="row">

	<?php if( is_single() ): ?>

		<div class="col-md-offset-2 col-md-10 entry-header">

			<h1><?php montessori_album_title(); ?></h1>

		</div>

	<?php endif; ?>

		<div class="col-md-2 date">

			<?php if( is_home() || is_front_page() || is_archive() ): ?>

				<a href="<?php echo get_permalink(); ?>">
					<?php echo get_the_date('d.m'); ?>
				</a>

			<?php elseif( is_single()) : ?>

				<?php echo get_the_date('d.m'); ?>

			<?php endif; ?>

		</div>

		<div class="col-md-10 entry-content">

			<?php

			montessori_album_images(); 
			
			if( current_user_can( 'edit_posts' ) || get_post_format() ): 

			?>
				
				<div class="entry-footer">

					<?php edit_post_link( sprintf( '<span class="btn-neutral">%s</span>', 'Edytuj' ) ); ?>
					<?php if( montessori_has_post_format() ){
						montessori_entry_meta(); 
					} ?>

				</div>

			<?php endif; ?>

		</div>

	</div>
</article>