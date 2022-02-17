<article <?php post_class(); ?>>
	<div class="row">

		<div class="col-sm-12 col-md-3">

			<nav class="page-navigation">
				
				<div class="clearfix">

					<button class="roll-navigation" data-toggle="collapse" data-target="#bs-page-navigation-collapse" aria-expanded="false">
						Rozwiń nawigację podstron <span class="glyphicon glyphicon-menu-down"></span>
					</button>

				</div>
				
				<div class="page-navigation-collapse collapse" id="bs-page-navigation-collapse">
					
					<?php 
						wp_nav_menu(
							array(
								'theme_location' => 'primary',
								'sub_menu'       => true
							)
						); 
					?>

				</div>

			</nav>

		</div>

		<div class="col-md-9 col-sm-12 article-content">

			<div class="entry-header">
				
				<h1><?php the_title(); ?></h1>
			
			</div>
			
			<div class="entry-content">
				
				<?php

					the_content();

					wp_link_pages( array(
						'before'      => '<ul class="pagination pagination-nav">',
						'after'       => '</ul>',
						'link_before' => '<li>',
						'link_after'  => '</li>'
					) );
				?>

				<?php if(current_user_can( 'edit_posts' )): ?>
				
					<div class="entry-footer">

						<?php edit_post_link(sprintf('<span class="btn-neutral">%s</span>', 'Edytuj')); ?>
					
					</div>

				<?php endif; ?>

			</div>

		</div>
	</div>
</article>