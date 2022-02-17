<?php

//Filtrowanie stylu dla admin bar
if(is_admin_bar_showing()):

	function montessori_adminbar_head() {
		remove_action('wp_head', '_admin_bar_bump_cb');
	}
	add_action('get_header', 'montessori_adminbar_head');

	function montessori_adminbar_newhead() {
		$css = '<style type="text/css" media="screen">
			html { padding-top: 32px !important; }
			* html body { padding-top: 32px !important; }
			@media screen and ( max-width: 782px ) {
				html { padding-top: 46px !important; }
				* html body { padding-top: 46px !important; }
			}
		</style>';

		echo $css;
	}
	add_action('wp_head', 'montessori_adminbar_newhead');

endif;