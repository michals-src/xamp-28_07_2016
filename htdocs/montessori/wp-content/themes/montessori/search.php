<?php 
/**
 * Strona wyszukiwania
 *
 * @package Montessori
 */
get_header(); ?>
		<div class="col-md-9 col-sm-12 col-xs-12 right-side">
			<div class="content white-box">
				<div class="content-scroll">
				
				<?php if ( have_posts() ) : ?>
				<header class="content-header">	
					<h1><?php echo sprintf('Wyniki wyszukiwania dla %1$s', get_search_query()); ?></h1>
				</header>
				<?php endif; ?>

					<?php 

						if(have_posts()):

							while(have_posts()): the_post();

								$format = montessori_post_format();

								get_template_part('formats/post/content', 'excerpt');

							endwhile;

							the_posts_pagination( array(
								'prev_text'          => '&larr;',
								'next_text'          => '&rarr;'
							) );

						else:
					?>
						<section class="not-found middle-block">
							<div class="not-found-content middle-content">
								
								<header>
									<h2>Brak rezultatów</h2>
								</header>

								<p>Nie znaleziono żadnych pasujących elementów dla wpisanego hasła.</p>
								<?php get_search_form(); ?>

							</div>
						</section>
					<?php endif; ?>

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