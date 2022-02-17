<?php
/**
 *	
 *	@subpackage: combat
 *  @version: 1.0.0
 *
*/

function combat_scripts()
{
	/**
	 * jQUery
	 *
	 * @version  1.12.0
	 */
	wp_enqueue_script('jquery', 'https://code.jquery.com/jquery-1.12.0.min.js', array(), '1.12.0', true);
	wp_enqueue_script('jquery-migrate', 'https://code.jquery.com/jquery-migrate-1.2.1.min.js', array(), '1.2.1', true);
	
	/**
	 * Bootstrap
	 * @subpackage : combat
	 */
	wp_enqueue_style( 'bootstrap', get_template_directory_uri() . '/css/bootstrap.min.css', array(), '3.3.7', 'all' );
	wp_enqueue_script( 'bootstrap', get_template_directory_uri() . '/js/bootstrap.min.js', array(), '3.3.7', true );

	/**
	* lightbox jQuery
	*/
	wp_enqueue_script('lightbox-js', get_template_directory_uri() . '/js/lightbox.min.js', array('jquery'), '1.0.0', true);
	wp_enqueue_style('lightbox-css', get_template_directory_uri() . '/css/lightbox.min.css', array(), '1.0.0', 'all');

	/**
	 * @subpackage : combat
	 */
	wp_enqueue_style( 'stylesheet', get_template_directory_uri() . '/css/style.css', array(), '1.0.2', 'all' );
	wp_enqueue_script( 'script', get_template_directory_uri() . '/js/jquery.script.js', array(), '1.0.0', true );

}
add_action( 'wp_enqueue_scripts', 'combat_scripts' );

function combat_init(){

	register_nav_menu('primary-navigation', 'Główna nawigacja strony');

}
add_action( 'init', 'combat_init' );


require_once get_template_directory() . '/inc/walker.php';
require_once get_template_directory() . '/inc/customizer.php';
require_once get_template_directory() . '/inc/editor.php';
