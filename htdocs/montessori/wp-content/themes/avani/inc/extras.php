<?php
/**
 * Custom functions that act independently of the theme templates.
 *
 * Eventually, some of the functionality here could be replaced by core features.
 *
 * @package Avani
 */

/**
 * Adds custom classes to the array of body classes.
 *
 * @param array $classes Classes for the body element.
 * @return array
 */
function avani_body_classes( $classes ) {
	// Adds a class of group-blog to blogs with more than 1 published author.
	if ( is_multi_author() ) {
		$classes[] = 'group-blog';
	}

	// Adds a class of hfeed to non-singular pages.
	if ( ! is_singular() ) {
		$classes[] = 'hfeed';
	}

	// Adds a class for content sidebar alignment.
	if ( ! is_active_sidebar( 'sidebar-1' ) ||
		'only-content' === get_theme_mod( 'avani_layout', 'content-sidebar' ) ) :
		$classes[] = 'only-content';
	elseif ( 'sidebar-content' === get_theme_mod( 'avani_layout', 'content-sidebar' ) ) :
		$classes[] = 'sidebar-content';
	else :
		$classes[] = 'content-sidebar';
	endif;

	return $classes;
}
add_filter( 'body_class', 'avani_body_classes' );

/**
 * Add a pingback url auto-discovery header for singularly identifiable articles.
 */
function avani_pingback_header() {
	if ( is_singular() && pings_open() ) {
		echo '<link rel="pingback" href="', bloginfo( 'pingback_url' ), '">';
	}
}
add_action( 'wp_head', 'avani_pingback_header' );

/**
 * Change Read more text.
 *
 * Change excerpt read more link text based on custom text entered in
 * theme customizer.
 *
 * @return string
 */
function avani_excerpt_teaser() {
	$url  = esc_url( get_permalink() );
	$text = esc_html__( 'Continue reading', 'avani' );
	$title = get_the_title();

	if ( 0 === strlen( $title ) ) :
		$screen_reader = '';
	else :
		$screen_reader = sprintf( '<span class="screen-reader-text">%s</span>', $title );
	endif;

	$excerpt_teaser = sprintf( '<p><a class="more-link" href="%1$s">%2$s %3$s</a></p>', $url, $text, $screen_reader );
	return $excerpt_teaser;
}
add_filter( 'excerpt_more', 'avani_excerpt_teaser' );

/**
 * Enqueue inline link color to 'head'
 */
function avani_link_color() {
	$output = '';
	$color = get_theme_mod( 'avani_theme_color', '' );
	
	// Escape $color. Output only if $color is a 3 or 6 digit hex color (with #).
	if ( '' !== $color && preg_match( '|^#([A-Fa-f0-9]{3}){1,2}$|', $color ) ) {
		$output .= sprintf( '
			button:hover,
			input:hover[type="button"],
			input:hover[type="reset"],
			input:hover[type="submit"] {
				background-color: %1$s;
				border-color: %1$s;
			}

			button:focus,
			input:focus[type="button"],
			input:focus[type="reset"],
			input:focus[type="submit"] {
				background-color: %1$s;
				border-color: %1$s;
			}

			input:focus,
			textarea:focus {
				border-color: %1$s;
			}

			a {
				color: %1$s;
			}

			.nav-menu a:hover,
			.nav-menu a:focus {
				color: %1$s;
			}

			.nav-next a:hover,
			.nav-previous a:hover,
			.nav-next a:focus,
			.nav-previous a:focus {
				color: %1$s;
			}

			.widget-title > span {
				border-bottom: 2px solid %1$s;
			}', $color
		);
	}
	if ( '' !== $output ) {
		wp_add_inline_style( 'avani-style', $output );
	}
}
add_action( 'wp_enqueue_scripts', 'avani_link_color', 50 );

/**
 * function to show the footer info, copyright information
 */
function avani_footer_info() {
	printf( esc_html__( 'Theme by %1$s. Powered by %2$s', 'avani' ), '<a href="https://www.premiumwp.com/" target="_blank" title="PremiumWP">PremiumWP</a>', '<a href="http://wordpress.org/" target="_blank" title="WordPress.org">WordPress</a>' );
}

