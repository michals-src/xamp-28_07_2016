<?php

define('MONTESSORI_GALERIA_PATH', get_template_directory() . 'inc/galeria');
define('MONTESSORI_GALERIA_URI', get_template_directory_uri() . '/inc/galeria');

require_once 'class-montessori-galeria.php';
require_once 'class-montessori-galeria-post_type.php';
require_once 'class-montessori-galeria-post.php';
require_once 'class-montessori-galeria-album.php';
require_once 'class-montessori-galeria-fields.php';
require_once 'class-montessori-galeria-filters.php';
require_once 'class-montessori-galeria-viewer.php';

new Montessori\Galeria();


/**
 *
 * Funkcje galerii do implementacji dla stron szablonu
 *
 */
function montessori_get_album_title(){

	if( get_the_ID() ):

		$album = new Montessori\GaleriaAlbum( get_the_ID() );
		$title = $album->getTItle();

		return $title;

	else:

		return '';

	endif;

}

function montessori_album_title(){

	echo montessori_get_album_title();

}

function montessori_get_album_images( $array = false ){

	if( get_the_ID() ):

		$album = new Montessori\GaleriaAlbum( get_the_ID() );
		$images = $album->getImages()[0];

		if( ! $array ):

			$content = '<div id="album" class="album-content">';

			foreach ($images as $key => $image) {
						
				$content .= $album->getElementUnitesGallery( $image );

			}

			$content .= '</div>';

		else:

			$content = $images;

		endif;

		return $content;

	else:

		return '';

	endif;

}

function montessori_album_images(){

	echo montessori_get_album_images();

}