<?php
/**
 * Formularz szukaj
 *
 * @package Montessori
 */
 ?>
<form role="search" method="get" action="<?php echo esc_url( home_url( '/' ) ); ?>" style="margin-top: 35px;">
	<label>
		<span class="screen-reader-text">Szukaj dla:</span>
		<input type="search" class="form-control" placeholder="Szukaj &hellip;" value="<?php echo get_search_query(); ?>" name="s" />
	</label>
	<button type="submit" class="btn btn-primary"> Szukaj </button>
</form>