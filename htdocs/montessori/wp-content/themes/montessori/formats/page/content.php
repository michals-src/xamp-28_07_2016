<article <?php post_class(); ?>>
	<div class="row">
		<div class="col-md-12 col-sm-12 col-xs-12 article-content">

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