<?php 
/**
 * Stopka
 *
 * @package Montessori
 */
?>
	</div><!-- .row -->
</div><!-- .container -->
	<?php wp_footer(); ?>
	<footer>
		<div class="text">Montessori</div>
		<strong>Akademia Sukcesu Nasza Szkoła</strong>
		<p><?php echo montessori_information_street(); ?>, <?php echo montessori_information_postal_code(); ?>, tel. <?php echo montessori_information_phone(); ?></p>
	</footer>
	<div class="footer-bg hidden-sm hidden-xs">
		<img src="<?php echo get_template_directory_uri(); ?>/images/hands.png">
	</div>
</body>
</html>