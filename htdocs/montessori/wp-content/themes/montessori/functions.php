<?php
/**
 * @package Montessori
 */

/* 
 * Sktypty i style 
 */
function montessori_scripts(){

	wp_enqueue_style('bootstrap', get_template_directory_uri() . '/css/bootstrap.min.css', array(), '3.7', 'all');
	wp_enqueue_script('bootstrap', get_template_directory_uri() . '/js/bootstrap.min.js', array( 'jquery' ), '3.7', true);
	
	wp_enqueue_style('unitegallery', get_template_directory_uri() . '/css/unitegallery/unite-gallery.css', array(), '1.0.0', 'all');
	wp_enqueue_script('unitegallery', get_template_directory_uri() . '/js/unitegallery/unitegallery.min.js', array( 'jquery' ), '1.0', true);
	wp_enqueue_script('unitegallery-theme', get_template_directory_uri() . '/inc/unitegallery/themes/tilesgrid/ug-theme-tilesgrid.js', array( 'jquery' ), '1.0', true);

	wp_enqueue_script('dataTables',  'https://cdn.datatables.net/v/dt/dt-1.10.13/fc-3.2.2/fh-3.1.2/r-2.1.1/sc-1.4.2/datatables.min.js', array( 'jquery' ), '1.10.13', true);

	wp_enqueue_style('footable', get_template_directory_uri() . '/css/footable.core.bootstrap.min.css', array(), '3.0.0', 'all');
	wp_enqueue_script('footable', get_template_directory_uri() . '/js/footable.core.min.js', array( 'jquery' ), '3.0.0', true);

	wp_enqueue_style('montessori', get_template_directory_uri() . '/style.css', array(), '1.0.3', 'all');
	wp_enqueue_script('montessori', get_template_directory_uri() . '/js/library.js', array( 'jquery' ), '1.0.3', true);

}
add_action('wp_enqueue_scripts', 'montessori_scripts');

function montessori_setup(){

	add_theme_support( 'post-thumbnails' );
	add_image_size( 'montessori-thumbnail-image', 650, 420, true );

	add_theme_support( 'post-formats', array(
		'aside', 'image', 'video', 'quote', 'link', 'gallery', 'status', 'audio'
	) );

	add_theme_support( 'html5', array(
		'search-form', 'gallery', 'caption'
	) );

	register_nav_menus(array(
		'primary'	=> 'Główna nawigacja strony'
	));

	add_editor_style( array( 'css/editor-style.css', 'css/bootstrap.min.css', ) );

}
add_action('after_setup_theme', 'montessori_setup');

/**
 * Przestrzeń widget.
 */
function montessori_widgets_init() {
	
	register_sidebar( array(
		'name'          => __( 'Sidebar', 'twentyseventeen' ),
		'id'            => 'sidebar-1',
		'description'   => __( 'Sidebar wyświetlany na głównej stronie.', 'twentyseventeen' ),
		'before_widget' => '<section id="%1$s" class="widget %2$s">',
		'after_widget'  => '</section>',
		'before_title'  => '<h2 class="widget-title">',
		'after_title'   => '</h2>',
	) );

}
add_action( 'widgets_init', 'montessori_widgets_init' );


require_once get_template_directory() . '/inc/mti-template-init.php';
