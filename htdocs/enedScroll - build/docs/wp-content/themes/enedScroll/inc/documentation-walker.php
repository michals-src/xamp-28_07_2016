<?php

class Documentation_Walker extends Walker_Nav_Menu{
 
   function start_el(&$output, $item, $depth, $args) {
 
      global $wp_query;
      $indent = ( $depth ) ? str_repeat( "\t", $depth ) : '';
      $aID = get_post_meta( $item->ID, '_menu_item_object_id', true );
      $a = get_post( $aID );
    // echo "<pre>",  print_r($a->post_content, true), "</pre>";

 
      $class_names = $value = '';
      $classes = empty( $item->classes ) ? array() : (array) $item->classes;
      $class_names = join( ' ', apply_filters( 'nav_menu_css_class', array_filter( $classes ), $item ) );
      $class_names = ' class="tab '. esc_attr( $class_names ) . '"';
      $output .= $indent . '<li id="menu-item-'. $item->ID . '"' . $value . $class_names .'>';
 
      $attributes = ! empty( $item->attr_title ) ? ' title="' . esc_attr( $item->attr_title ) .'"' : '';
      $attributes .= ! empty( $item->target ) ? ' target="' . esc_attr( $item->target ) .'"' : '';
      $attributes .= ! empty( $item->xfn ) ? ' rel="' . esc_attr( $item->xfn ) .'"' : '';
      $attributes .= ! empty( $item->url ) ? ' href="' . esc_attr( $item->url ) .'"' : '';
 
      if ($depth == 0) {
         $description = ! empty( $item->description ) ? '<em>' . esc_attr( $item->description ).'</em>' : '';
      } else {
         $description = "";
      }

      $descriptions = split( ',', $item->description );
      $description = array();

      foreach( $descriptions as $value ){
      	$description[] = '<span>' . $value . '</span>';
      }

      $description = join( ' ', $description );
 
      $item_output = $args->before;
      $item_output .= '<div class="cols"><div class="col-xsmall-8 col-small-6">';
      $item_output .= '<h3>' . apply_filters( 'the_title', $item->title, $item->ID ) . '</h3>';
      $item_output .= $description;
      $item_output .= '</div>';

      $item_output .= '<div class="col-xsmall-8  col-small-2 btn">';
      $item_output .= '<button role="slide"><a'. $attributes .'>';
      $item_output .= 'Read now';
      $item_output .= '</div></a>';

      $item_output .= $args->after;

      $output .= apply_filters( 'walker_nav_menu_start_el', $item_output, $item, $depth, $args );
   }
 
}