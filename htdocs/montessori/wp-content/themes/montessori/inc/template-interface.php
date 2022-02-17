<?php

/**
 * Sprawdzenie czy strona ma podstrony
 * @return (bool)
 */
function montessori_has_page_subpages(){

	global $post;

	$children = get_pages( array( 'child_of' => $post->ID ) );
	$type = ( count ($children ) === 0 ) ? false : true;

	return $type;

}

/**
 * Sprawdzenie czy strona jest podstroną
 * @return (bool)
 */
function montessori_is_subpage(){

	global $post;

	$children = ( is_page() && $post->post_parent ) ? true : false;

	return $children;

}

/**
 * Dodanie wartości "sub_menu" dla funkcji wp_nav_menu
 * @return (array)
 */
function montessori_wp_nav_menu_objects_sub_menu( $sorted_menu_items, $args ) {

  if ( isset( $args->sub_menu ) ) {
    $root_id = 0;
    

    foreach ( $sorted_menu_items as $menu_item ) {
      if ( $menu_item->current ) {

        $root_id = ( $menu_item->menu_item_parent ) ? $menu_item->menu_item_parent : $menu_item->ID;
        break;
      }
    }
    

    if ( ! isset( $args->direct_parent ) ) {
      $prev_root_id = $root_id;
      while ( $prev_root_id != 0 ) {
        foreach ( $sorted_menu_items as $menu_item ) {
          if ( $menu_item->ID == $prev_root_id ) {
            $prev_root_id = $menu_item->menu_item_parent;

            if ( $prev_root_id != 0 ) $root_id = $menu_item->menu_item_parent;
            break;
          } 
        }
      }
    }
    $menu_item_parents = array();
    $children = array();
    foreach ( $sorted_menu_items as $key => $item ) {

      if ( $item->ID == $root_id ) $menu_item_parents[] = $item->ID;
      if ( in_array( $item->menu_item_parent, $menu_item_parents ) ) {

        $menu_item_parents[] = $item->ID;
    	$children[] = $item;
      } else if ( ! ( isset( $args->show_parent ) && in_array( $item->ID, $menu_item_parents ) ) ) {

        unset( $sorted_menu_items[$key] );
      }
    }
    return $sorted_menu_items;
  } else {
    return $sorted_menu_items;
  }

}
add_filter( 'wp_nav_menu_objects', 'montessori_wp_nav_menu_objects_sub_menu', 10, 2 );


/**
 * Stopka artykułu
 * @return (string)
 */
function montessori_entry_meta(){

	$format = get_post_format();

	if ( current_theme_supports( 'post-formats', $format ) ) {

		$class = array(
			'aside' 	=> 'list-alt', 
			'image' 	=> 'picture', 
			'video'		=> 'facetime-video', 
			'quote' 	=> 'pushpin', 
			'link' 		=> 'link', 
			'gallery' 	=> 'th-large', 
			'status' 	=> 'flag', 
			'audio' 	=> 'headphones', 
			'chat' 		=> 'comment'
		);

		$glyphicon = (!empty($class[$format])) ? $class[$format] : 'option-vertical';
		
    printf( 
      '<span class="entry-format">%1$s<a href="%2$s">%3$s %4$s</a></span>',
			sprintf( 
        '<span class="screen-reader-text">%s </span>', 'Format'),
			   esc_url( get_post_format_link( $format ) 
      ),
			sprintf( '<span class="glyphicon glyphicon-%s"></span>', $glyphicon),
			get_post_format_string( $format )

		);

	}

}

/**
 * Sprawdzanie rodzaju obrazu wyróżniającego
 * 2 rodzaje vertical | horizontal
 * @return (string)
 */
function montessori_thumbnail_type(){

  $thumbnail = get_the_post_thumbnail_url( get_the_ID(), 'montessori-thumbnail-image' );
  list( $width, $height, $type, $attr) = getimagesize( $thumbnail );
  $size = 'horizontal';

  if( $width >= $height && $width >= 340){
    $size = 'horizontal';
  }else if( $width < $height || $width < 340 ){
    $size = 'vertical';
  }

  return $size;

}

function montessori_thumbnail_class(){

  $thumbnail = get_the_post_thumbnail( get_the_ID(), 'montessori-thumbnail-image' );
  $class = montessori_thumbnail_type();
  $vertical = ($class === 'vertical') ? true : false;

  if( $vertical === true ){
    $class .= ' alignleft';
  }

  return $class;

}

function montessori_post_format(){

  global $post_type;
  $format = '';

  if( $post_type ){ 

    // Jako pierwszy wczytywany jest typ postu
    $format = $post_type;

  }else if( has_post_thumbnail() ){ 

    // Jako drugi wczytywany jest post z obrazem wyróżniającym
    $format = 'thumbnail';

  }else if( get_post_format() ){

    // Jako trzeci wczytywany jest format postu
    $format = get_post_format();

  }

  return $format;

}