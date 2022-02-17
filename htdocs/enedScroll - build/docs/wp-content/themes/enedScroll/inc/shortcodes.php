<?php

function item_shortcode( $atts = array(), $content = null ){

	$atts = shortcode_atts(array(
		'type'	=> false,
		'class'		=> false,
	), $atts);

	if( ! isset( $atts['type'] ) ){
		return;
	}

	$class = ( $atts['class'] ) ? 'class="' . $atts['class'] . '"' : '';

	$output = '<' . $atts['type'] . ' ' . $class . '>'; 
	$output .= do_shortcode( $content );
	$output .= '</' . $atts['type'] . '>';

	return $output;

}
add_shortcode( 'item', 'item_shortcode' );

function markup_shortcode( $atts = array(), $content = null ){

	$output = '<code class="language-markup">';
	$output .= do_shortcode( $content );
	$output .= '</code>';

	return $output;

}
add_shortcode( 'markup', 'markup_shortcode' );

function code_shortcode( $atts = array(), $content = null ){

	$output = '<pre><code class="language-html">';
	$output .= do_shortcode( $content );
	$output .= '</code></pre>';

	return $output;

}
add_shortcode( 'code', 'code_shortcode' );

function code_js_shortcode( $atts = array(), $content = null ){

	$output = '<pre><code class="language-javascript">';
	$output .= do_shortcode( $content );
	$output .= '</code></pre>';

	return $output;

}
add_shortcode( 'js', 'code_js_shortcode' );

function article_shortcode( $atts = array(), $content = null ){

	$output = '<article>';
	$output .= do_shortcode( $content );
	$output .= '</article>';

	return $output;

}
add_shortcode( 'article', 'article_shortcode' );

function header_shortcode( $atts = array(), $content = null ){

	$output = '<header>';
	$output .= do_shortcode( $content );
	$output .= '</header>';

	return $output;

}
add_shortcode( 'header', 'header_shortcode' );

function row_shortcode( $atts = array(), $content = null ){

	$output = '<div class="row"><p>';
	$output .= do_shortcode( $content );
	$output .= '</p></div>';

	return $output;

}
add_shortcode( 'row', 'row_shortcode' );

function cols_shortcode( $atts = array(), $content = null ){

	$class = ( ! empty( $atts['class'] ) ) ? $atts['class']  : '';

	$output .= '<div class="cols ' . $class . '">';
	$output .= do_shortcode( $content );
	$output .= '</div>';

	return $output;

}
add_shortcode( 'cols', 'cols_shortcode' );

function col_shortcode( $atts = array(), $content = null ){

	$atts = shortcode_atts(array(
		'xsmall'	=> false,
		'small'		=> false,
		'medium'	=> false,
		'large'		=> false,
		'class'		=> false
	), $atts);

	$class = array();
	$ext_class = ( ! empty( $atts['class'] ) ) ? $atts['class'] : '' ;

	foreach( $atts as $size => $value ){

		if( $value !== false ){
			$class[] = 'col-' . $size . '-' . $value;
		}
	}

	$output = '<div class="' . join( ' ', $class ) . ' ' . $ext_class . '">';
	$output .= do_shortcode( $content );
	$output .= '</div>';

	return $output;

}
add_shortcode( 'col', 'col_shortcode' );

function specification_shortcode( $atts = array(), $content = null ){

	$output = '<div class="specification">';
	$output .= do_shortcode( $content );
	$output .= '</div>';

	return $output;

}
add_shortcode( 'specification', 'specification_shortcode' );