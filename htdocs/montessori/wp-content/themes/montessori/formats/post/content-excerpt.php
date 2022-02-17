<?php
/**
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

			<h1><?php the_title(); ?></h1>

		</div>

	<?php endif; ?>

		<div class="col-xs-12 col-md-3 col-lg-2 date">

			<?php if( is_home() || is_front_page() || is_archive() || is_search() ): ?>

				<a href="<?php echo get_permalink(); ?>">
					<?php echo get_the_date('d.m'); ?>
				</a>

			<?php endif; ?>

		</div>

		<div class="col-xs-12 col-md-9 col-lg-10 entry-content">

			<?php 
			
			the_excerpt();
			
			if( current_user_can( 'edit_posts' ) || ( get_post_format() && get_post_format() !== '' ) ): 

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