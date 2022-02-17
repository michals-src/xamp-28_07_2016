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

		<div class="col-md-2 date">

			<?php if( is_home() || is_front_page() || is_archive() ): ?>

				<a href="<?php echo get_permalink(); ?>">
					<?php echo montessori_event_date(); ?>
				</a>

			<?php elseif( is_single()) : ?>

				<?php echo montessori_event_date(); ?>

			<?php endif; ?>

		</div>

		<div class="col-md-10 entry-content">

			<?php 
			
			the_content( sprintf( '<span class="btn-neutral">%1$s</span>', 'Czytaj więcej' ) ); 
			
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