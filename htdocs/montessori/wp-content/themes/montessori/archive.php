<?php 
/**
 * Archiwum
 *
 * @package Montessori
 */

 get_header(); ?>

		<div class="col-md-9 col-sm-12 col-xs-12 right-side">
			<div class="content white-box">
				<div class="content-scroll">

				<header class="content-header">

					<div class="row">
						<div class="col-md-2 col-md-push-8 widgets-field">

						<?php if ( is_active_sidebar( 'sidebar-1' ) ) : ?>

					        <?php dynamic_sidebar( 'sidebar-1' ); ?>

					   	<?php endif; ?>	

						</div>
						<div class="col-md-offset-2 col-md-6 col-md-pull-2">

							<?php the_archive_title( '<h1>', '</h1>' ); ?>

						</div>
					</div>

				</header>
					<?php 

						if( have_posts() ):

							while( have_posts() ): the_post();
								
								get_template_part('formats/post/content', '');

							endwhile;

							the_posts_pagination( array(
								'prev_text'          => '&larr;',
								'next_text'          => '&rarr;'
							) );


						else:

							get_template_part( 'content', 'none' );

						endif;

					?>
				
				</div>
				<footer class="partners">
					<div class="row">

					  <div class="col-md-3 col-sm-12 col-xs-12 col-md-offset-1 title">
						<strong>Partnerzy</strong>
					  </div>

					  <div class="col-md-7 col-sm-12 col-xs-12 links">
							<a href="http://naszaszkola.com.pl/">
								<img src="<?php echo get_template_directory_uri(); ?>/images/ns.png" alt="Nasza szkoła">
							</a>
							<a href="http://naszaszkola.com.pl/">
								<img src="<?php echo get_template_directory_uri(); ?>/images/progres.png" alt="Nasza szkoła">
							</a>
							<a href="http://naszaszkola.com.pl/">
								<img src="<?php echo get_template_directory_uri(); ?>/images/queen.png" alt="Nasza szkoła">
							</a>
							<a href="http://naszaszkola.com.pl/">
								<img src="<?php echo get_template_directory_uri(); ?>/images/libratus.png" alt="Nasza szkoła">
							</a>
					  </div>

					</div>
				</footer>
			</div>
		</div>

<?php get_footer(); ?>