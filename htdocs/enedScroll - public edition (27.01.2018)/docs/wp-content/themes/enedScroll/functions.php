<?php

function theme_setup(){

	register_nav_menus( array(
		'documentation_nav'    => 'Navigation of documentation'
	) );

	add_editor_style( array(  'css/docs-v2.css', 'css/prism.css', 'css/wp_editor.css' ) );

}
add_action( 'after_setup_theme', 'theme_setup' );

function impletent_assets(){

	wp_enqueue_style( 'docs-v2', get_template_directory_uri() . '/css/docs-v2.css', array(), null );
	wp_enqueue_script( 'jquery', 'https://ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js', array(), '3.1.0', true );
  wp_enqueue_script( 'enedscroll', get_template_directory_uri() . '/js/optimize.js', array(), false, true );

	wp_enqueue_style( 'prism', get_template_directory_uri() . '/css/prism.css', array(), null );
	wp_enqueue_script( 'prism', get_template_directory_uri() . '/js/prism.js', array(), false, true );

}
add_action( 'wp_enqueue_scripts', 'impletent_assets' );

require get_parent_theme_file_path( '/inc/documentation-walker.php' );
require get_parent_theme_file_path( '/inc/shortcodes.php' );
require get_parent_theme_file_path( '/inc/mce-wrapper.php' );