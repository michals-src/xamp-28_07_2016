<?php

/**
 * Komentarz
 */

namespace Montessori;

use Montessori\GaleriaAlbum;
use Montessori\GaleriaPost;

Class GaleriaViewer{

	public function getActions(){

		add_shortcode( 'galeria', array( $this, 'shortcode_callback' ) );

	}

	public function shortcode_callback( $atts ){

		$atts = shortcode_atts( array(
			'type'	=> 'album'
		), $atts);

		switch( $atts['type'] ):

			case 'album':

				return $this->albums();

				break;

			default:
				break;

		endswitch;

	}

	public function albums(){

		$showAlbum = (!empty($_GET['show_album'])) ? true : false;

	

		if(!$showAlbum){

			$content = $this->loadAlbums();

		} else {

			$content = $this->loadPictures( $_GET['show_album'] );

		} 



		return $content;
	}

	protected function loadAlbums(){

		global $montessori_template_settings;

		$paged = ( get_query_var( 'paged' ) ) ? absint( get_query_var( 'paged' ) ) : 1;
		$limit = (get_option('montessori_gallery_albums_limit')) ? get_option('montessori_gallery_albums_limit') : $montessori_template_settings->option( 'montessori_gallery_albums_limit' );
		$noAlbums = (get_option('montessori_gallery_albums_no')) ? get_option('montessori_gallery_albums_no') : $montessori_template_settings->option( 'montessori_gallery_albums_no' );

		$args = array(
			'post_type' 		=> GaleriaPostType::getName(),
			'post_status' 		=> 'publish',
            'no_found_rows'     => false,
            'posts_per_page'	=> $limit,
            'paged'				=> $paged
		);

		$albums = new \WP_Query( $args );

		if( $albums->have_posts() ):

			$content .= '<div class="row albums-content">';

			while( $albums->have_posts() ) : $albums->the_post();

				$data = new GaleriaAlbum( get_the_ID() );

				$content .= '<div class="col-xs-6 col-sm-6 col-md-4 album">';
				$content .= '<a href="?show_album='. get_the_ID() .'">';

				$content .= '<picture>';
				$content .= $data->thumbnail();
				$content .= '</picture>';

				$content .= '<p> ' . $data->getTItle() . ' </p>';

				$content .= '</a>';
				$content .= '</div>';

			endwhile;

			$big = 999999999;


		 	$pagination = paginate_links( 
		 		array(
					'base' => str_replace( $big, '%#%', esc_url( get_pagenum_link( $big ) ) ),
					'format' => '/paged/%#%',
					'current' => max( 1, get_query_var('paged') ),
					'total' => $albums->max_num_pages,
					'type'	=> 'array'
				) 
		 	);

		 	if(!empty($pagination)){

		 		$content .= '<div class="col-xs-12 col-sm-12 col-md-12"><ul class="pagination">'; 
		 		
		 		foreach ($pagination as $key => $link) {
		 			
		 			$content .= '<li>' . $link . '</li>';

		 		}

		 		$content .= '</div>'; 

		 	}



			$content .= '</ul></div>';

		  else:

			$content .= '<h2 class="title-as-info"> ' . $noAlbums . ' </h2>';

		endif; 

		return $content;

	}

	protected function loadPictures( $album_ID ){

		global $montessori_template_settings;

		$album = new GaleriaAlbum( $album_ID );
		$noImages = (get_option('montessori_gallery_images_no')) ? get_option('montessori_gallery_images_no') : $montessori_template_settings->option( 'montessori_gallery_images_no' );

		if( $album->Exists() ):

			$pictures = $album->getImages()[0];

			$content .= '<span>' . $album->getTItle() . '</span>';

			$content .= '<div id="album" class="album-content">';

			foreach ($pictures as $key => $picture) {
				
				$content .= $album->getElementUnitesGallery( $picture );

			}

			$content .= '</div>';


		  else:

		  	$content .= '<h2> ' . $noImages . ' </h2>';

		endif;

		return $content;

	}

	
}