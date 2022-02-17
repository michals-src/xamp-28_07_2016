<?php 
/**
 * Wyświetlanie stron
 *
 * @package Montessori
 */

 get_header(); ?>

		<div class="col-md-9 col-sm-12 col-xs-12 right-side">
			<div class="content white-box <?php echo (montessori_has_page_subpages() || montessori_is_subpage()) ? 'page-subnav' : ''; ?>">
				<div class="content-scroll">

					<?php
					
						while(have_posts()): the_post();
							
							$type = (montessori_has_page_subpages() || montessori_is_subpage()) ? 'subnav' : '';

							get_template_part('formats/page/content', $type);

						endwhile;
						
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