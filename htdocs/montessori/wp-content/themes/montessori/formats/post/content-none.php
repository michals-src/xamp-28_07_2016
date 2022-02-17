<?php
/**
 * Część szablonu odpowiedzialna za wyświetlenie tekstu o braku artykułów
 *
 *
 * @package WordPress
 * @subpackage Montessori
 * @since 1.0
 * @version 1.0
 */

?>

<section class="not-found middle-block">
	<div class="not-found-content middle-content">
		
		<header>
			<h2><?php echo montessori_post_page_error()['title']; ?></h2>
		</header>

		<?php if( is_home() && current_user_can( 'publish_posts' ) ): ?>
	
			<p><?php printf( '<a href="%1$s">Utwórz</a> nowy artykuł', esc_url( admin_url('post-new.php') ) ); ?></p>

		<?php else: ?>

			<p><?php echo montessori_post_page_error()['desc']; ?>.</p>

		<?php endif; ?>

	</div>
</section>