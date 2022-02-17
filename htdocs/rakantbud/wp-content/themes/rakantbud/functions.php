<?php

function scripts_enqueue()
{
	wp_enqueue_script('jquery-js', 'https://code.jquery.com/jquery-1.12.0.min.js', array(), '1.12.0', true);
	wp_enqueue_script('jquery-migrate-js', 'https://code.jquery.com/jquery-migrate-1.2.1.min.js', array(), '1.2.1', true);

	wp_enqueue_script('bootstrap-js', get_template_directory_uri() . '/js/bootstrap.min.js', array(), '3.3.6', true);
	wp_enqueue_style('bootstrap-css', get_template_directory_uri() . '/css/bootstrap.min.css', array(), '3.3.6', 'all');

	wp_enqueue_script('lightbox-js', get_template_directory_uri() . '/js/lightbox.min.js', array('jquery'), '1.0.0', true);
	wp_enqueue_style('lightbox-css', get_template_directory_uri() . '/css/lightbox.min.css', array(), '1.0.0', 'all');

	/**
		@Szablon Rakantbud
	 */
	wp_enqueue_script('script-js', get_template_directory_uri() . '/js/script.js', array(), '1.0.3', true);
	wp_enqueue_style('style-css', get_template_directory_uri() . '/css/style.css', array(), '1.0.0', 'all');

}
add_action('wp_enqueue_scripts', 'scripts_enqueue');

function setup()
{
	register_nav_menu('Main', 'nawigacja strony');
}
add_action('init', 'setup');

require_once get_template_directory() . '/inc/themesettings.php';
require_once get_template_directory() . '/inc/rakantbudGallery.php';