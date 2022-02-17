<?php
/**
 * The template for displaying the footer.
 *
 * Contains the closing of the #content div and all content after.
 *
 * @link https://developer.wordpress.org/themes/basics/template-files/#template-partials
 *
 * @package Avani
 */

?>

	</div><!-- #content -->
	<?php avani_footer_widgets(); ?>
	<footer id="colophon" class="site-footer">
		<div class="site-info">
			<?php avani_footer_info(); ?>
		</div><!-- .site-info -->
	</footer><!-- #colophon -->
</div><!-- #page -->

<?php wp_footer(); ?>

</body>
</html>
