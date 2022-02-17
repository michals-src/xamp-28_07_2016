<?php

/**
 * Komentarz
 */

namespace Montessori;

use Montessori\GaleriaPost;

Class GaleriaFilters{


	public function getActions(){

		add_action( 'init', array( $this, 'start_session' ) );

		add_filter( 'post_gallery', array( $this, 'post_gallery_filter' ), 10, 2 );

		add_action( 'save_post', array( $this, 'save_from_posts' ), 10, 2 );

		add_action( 'admin_head', array( $this, 'showNotice' ) );

	}

	public function post_gallery_filter( $output, $attr ){

		global $post, $wp_locale;

	    static $instance = 0;

	    $instance++;

	    $attrs = shortcode_atts(array(
	        'order'      => 'ASC',
	        'orderby'    => ( ! empty($attr['orberby']) ) ? $attr['orberby'] : 'menu_order ID',
	        'id'         => $post->ID,
	        'itemtag'    => 'dl',
	        'icontag'    => 'dt',
	        'captiontag' => 'dd',
	        'columns'    => '3',
	        'size'       => 'thumbnail',
	        'include'    => '',
	        'exclude'    => ''
	    ), $attr);

	    extract($attrs);

	    $id = intval($id);

	    if ( 'RAND' == $order )
	        $orderby = 'none';
	    if ( !empty($include) ) {
	        $include = preg_replace( '/[^0-9,]+/', '', $include );
	        $_attachments = get_posts( array('include' => $include, 'post_status' => 'inherit', 'post_type' => 'attachment', 'post_mime_type' => 'image', 'order' => $order, 'orderby' => $orderby) );
	        $attachments = array();
	        foreach ( $_attachments as $key => $val ) {
	            $attachments[$val->ID] = $_attachments[$key];
	        }
	    } elseif ( !empty($exclude) ) {
	        $exclude = preg_replace( '/[^0-9,]+/', '', $exclude );
	        $attachments = get_children( array('post_parent' => $id, 'exclude' => $exclude, 'post_status' => 'inherit', 'post_type' => 'attachment', 'post_mime_type' => 'image', 'order' => $order, 'orderby' => $orderby) );
	    } else {
	        $attachments = get_children( array('post_parent' => $id, 'post_status' => 'inherit', 'post_type' => 'attachment', 'post_mime_type' => 'image', 'order' => $order, 'orderby' => $orderby) );
	    }

	    if ( empty($attachments) )
	        return '';
	    if ( is_feed() ) {
	        $output = "\n";
	        foreach ( $attachments as $att_id => $attachment )
	            $output .= wp_get_attachment_link($att_id, $size, true) . "\n";
	        return $output;
	    }

	    $itemtag = tag_escape($itemtag);
	    $captiontag = tag_escape($captiontag);
	    $columns = intval($columns);
	    $itemwidth = $columns > 0 ? floor(100/$columns) : 100;
	    $float = is_rtl() ? 'right' : 'left';
	    $selector = "gallery-{$instance}";
	    $output = apply_filters('gallery_style', "<div id='$selector' class='gallery galleryid-{$id}'>");

	    $i = 0;

	    foreach ( $attachments as $id => $attachment ) {

	        $img = wp_get_attachment_image( $id, $size );
	        $src = wp_get_attachment_image_src( $id, 'large' )[0];

	        $ug_img = str_replace( '>', 'data-image="' . $src . '" data-description="Image 2 Description">', $img );

	        $output .= $ug_img;

	       
	    }

	    $output .= "</div>\n";

	    return $output;

	}

	public function save_from_posts( $post_id, $post ){

		global $post_type;

		$is_autosave = wp_is_post_autosave( $post_id );
		$is_reviosion = wp_is_post_revision( $post_id );
		$types = array( 'post', 'page', 'wydarzenia' );

		$post_content = ( ! empty( $post->post_content ) ) ?  preg_match_all('/\[gallery.*ids=.(.*).\]/', $post->post_content, $post_gallery) : '';
		$post_gallery = ( ! empty( $post_gallery ) ) ? $post_gallery : [];


		if ( $is_autosave || $is_reviosion || ! in_array($post_type, $types ) || empty( $post->post_content ) || empty( $post_gallery ) ){
			return;
		}
 		

		$countAdded = 0;

		foreach($post_gallery[1] as $key => $gallery_ids ) {
			
			$to_array = explode( ',', rtrim($gallery_ids, ',') );
			$to_array_last = preg_match_all('/(.*)\s/', str_replace('"', '', end($to_array)), $lastToInt);

			$to_array[(count($to_array) - 1)] = ($to_array_last) ? $lastToInt[0][0] : $to_array[(count($to_array) - 1)];
			$to_array = array_filter($to_array);

			$galeriaPost = new GaleriaPost();
			$response = $galeriaPost->addGallery(array(
					'gallery_title'		 => htmlspecialchars( stripcslashes( get_the_title() ) ),
					'gallery_parent'	 => get_the_ID(),
					'gallery_images'	 => $to_array,
					'gallery_instance'	 => $key
				)
			);

			if($response){
				$countAdded++;
			}


		}

		

		if($countAdded > 0){

			$_SESSION['galeria-notice'] = $countAdded;

		}

	
		

	}

	public function start_session(){

		if( ! session_id() ){
			session_start();
		}

	}

	public function showNotice(){

		if( ! empty( $_SESSION['galeria-notice'] ) ){

			$countAdded = $_SESSION['galeria-notice'];

			$odmiana = 'galerię';

			if( $countAdded === 1 ){

				$odmiana = 'galerię';

			}else if( $countAdded > 1 && $countAdded <= 5 ){

				$odmiana = 'galerie';

			}else if( $countAdded > 5 ){

				$odmiana = 'galerii';

			}

			mti_notice(
				array(
					'id'	=> 'galeria-powiadomienie',
					'type'	=> 'success',
					'text'	=> 'Dodanio ' . $countAdded . ' ' . $odmiana,
					'dismissible' => true,
					'pages'	=> array('post.php', 'post-new.php'),
					'post_type'	=> 'post'
				)
			);

			unset($_SESSION['galeria-notice']);
		}

	}


}