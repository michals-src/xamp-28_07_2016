<?php
/**
 * Avani Theme Customizer.
 *
 * @package Avani
 */

/**
 * Add postMessage support for site title and description for the Theme Customizer.
 *
 * @param WP_Customize_Manager $wp_customize Theme Customizer object.
 */
function avani_customize_register( $wp_customize ) {
	$wp_customize->get_setting( 'blogname' )->transport         = 'postMessage';
	$wp_customize->get_setting( 'blogdescription' )->transport  = 'postMessage';
	$wp_customize->get_setting( 'header_textcolor' )->transport = 'postMessage';

	// Define main panels for customizer.
	$wp_customize->add_section(
		'avani_theme_section' , array(
			'title'       => esc_html__( 'Theme Options', 'avani' ),
			'description' => esc_html__( 'Options to customize theme elements', 'avani' ),
			'priority'    => 1,
		)
	);

	// Site layout ( Sidebar / Main content) display and positioning options.
	$wp_customize->add_setting(
		'avani_layout', array(
			'default'           => 'content-sidebar',
			'sanitize_callback' => 'avani_sanitize_select',
		)
	);
	$wp_customize->add_control(
		'avani_layout', array(
			'label'     => esc_html__( 'Content layout', 'avani' ),
			'section'   => 'avani_theme_section',
			'settings'  => 'avani_layout',
			'type'      => 'select',
			'choices'   => array(
				'content-sidebar'   => esc_html__( 'Content-Sidebar', 'avani' ),
				'sidebar-content'   => esc_html__( 'Sidebar-Content', 'avani' ),
				'only-content'      => esc_html__( 'Only Content (No sidebar)', 'avani' ),
			),
		)
	);

	$wp_customize->add_setting(
		'avani_excerpt_option', array(
			'default'           => 'excerpt',
			'sanitize_callback' => 'avani_sanitize_select',
		)
	);
	$wp_customize->add_control(
		'avani_excerpt_option', array(
			'label'     => esc_html__( 'Excerpt or full content', 'avani' ),
			'section'   => 'avani_theme_section',
			'settings'  => 'avani_excerpt_option',
			'type'      => 'select',
			'choices'   => array(
				'excerpt' => esc_html__( 'Excerpt', 'avani' ),
				'content' => esc_html__( 'Full content', 'avani' ),
			),
		)
	);

	$wp_customize->add_setting(
		'avani_theme_color', array(
			'default'           => '',
			'sanitize_callback' => 'sanitize_hex_color',
		)
	);
	$wp_customize->add_control(
		new WP_Customize_Color_Control(
			$wp_customize, 'avani_theme_color', array(
				'label'    => esc_html__( 'Color Scheme', 'avani' ),
				'section'  => 'avani_theme_section',
				'settings' => 'avani_theme_color',
			)
		)
	);

	$wp_customize->add_setting(
		'avani_header_on_home_only', array(
			'default'           => '',
			'sanitize_callback' => 'avani_sanitize_checkbox',
		)
	);
	$wp_customize->add_control(
		'avani_header_on_home_only', array(
			'label'     => esc_html__( 'Display header image on home page only', 'avani' ),
			'section'   => 'avani_theme_section',
			'settings'  => 'avani_header_on_home_only',
			'type'      => 'checkbox',
		)
	);

	$wp_customize->add_setting(
		'avani_no_thumbnail_onpost', array(
			'default'           => '',
			'sanitize_callback' => 'avani_sanitize_checkbox',
		)
	);
	$wp_customize->add_control(
		'avani_no_thumbnail_onpost', array(
			'label'     => esc_html__( 'Do not display thumbnails on Single post', 'avani' ),
			'section'   => 'avani_theme_section',
			'settings'  => 'avani_no_thumbnail_onpost',
			'type'      => 'checkbox',
		)
	);
}
add_action( 'customize_register', 'avani_customize_register' );

/**
 * Binds JS handlers to make Theme Customizer preview reload changes asynchronously.
 */
function avani_customize_preview_js() {
	wp_enqueue_script( 'avani_customizer', get_template_directory_uri() . '/js/customizer.js', array( 'customize-preview' ), '20151215', true );
}
add_action( 'customize_preview_init', 'avani_customize_preview_js' );

/**
 * Sanitize select choices.
 *
 * @param str                  $option  Customizer Option selected.
 * @param WP_Customize_Setting $setting Setting instance.
 * @return string
 */
function avani_sanitize_select( $option, $setting ) {
	$choices = $setting->manager->get_control( $setting->id )->choices;
	if ( array_key_exists( $option, $choices ) ) :
		return $option;
	else :
		return $setting->default;
	endif;
}

/**
 * Validate checkbox value to be '1'
 *
 * @param  bool $option checkbox value.
 * @return bool
 */
function avani_sanitize_checkbox( $option ) {
	if ( 1 == $option ) : // WPCS: loose comparison ok.
		return 1;
	else :
		return '';
	endif;
}
