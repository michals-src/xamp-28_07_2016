<?php

function stayfit_setup()
{
	wp_enqueue_style( 'bootstrap', get_template_directory_uri() . '/css/bootstrap.min.css', array(), '3.0', 'all' );
	wp_enqueue_script( 'bootstrap-', get_template_directory_uri() . '/js/bootstrap.min.js', array( 'jquery' ), '3.0', true );

	wp_enqueue_style( 'theme', get_template_directory_uri() . '/css/style.css', array(), '1.0.5', 'all' );
	wp_enqueue_script( 'theme', get_template_directory_uri() . '/js/jquery.libs.js', array( 'jquery' ), '1.0.1', true );

}
add_action('wp_enqueue_scripts', 'stayfit_setup');

add_action( 'after_setup_theme', 'register_my_menu' );
function register_my_menu() {
  register_nav_menu( 'primary', __( 'Primary Menu', 'theme-slug' ) );
}

require_once get_template_directory() . '/inc/facebook.php';
require_once get_template_directory() . '/inc/kontakt.php';


