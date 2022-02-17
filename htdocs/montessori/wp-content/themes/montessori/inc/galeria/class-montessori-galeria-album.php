<?php

/**
 * Komentarz
 */

namespace Montessori;

use Montessori\GaleriaPost;

Class GaleriaAlbum extends GaleriaPost{

	/**
	 * @var integer
	 */
	protected $album_ID;

	/**
	 * @var boolean
	 */
	protected $exists;

	/**
	 * @var string
	 */
	protected $title;

	/**
	 * @var array
	 */
	protected $images;

	/**
	 * Ilość obrazów w albumie
	 * @var integer
	 */
	protected $count;

	/**
	 * @var string
	 */
	protected $thumbnail;


	public function __construct( $album_id ){

		$this->album_id = $this->post_ID = $album_id;

		parent::__construct();

		$this->albumExists();

		$this->albumTitle();

		$this->albumImages();

		$this->albumCount();

		$this->albumThumbnail();

	}

	public function Exists(){

		return $this->exists;

	}

	public function getCount(){

		return $this->count;

	}

	public function getImages(){

		return $this->images;

	}

	public function getTitle(){

		return $this->title;

	}

	public function getAlbumID(){

		return $this->album_ID;

	}

	public function getAttachment( $attachment_id = false, $size = 'thumbnail' ){

		return wp_get_attachment_image( $attachment_id, $size );

	}

	public function getAttachmentSrc( $attachment_id = false, $size = 'large' ){

		return wp_get_attachment_image_src( $attachment_id, $size );

	}

	public function getThumbnail(){

		return $this->thumbnail;
		
	}

	public function thumbnail(){

		return $this->getAttachment( $this->thumbnail );
		
	}

	public function getElementUnitesGallery( $attachment_id = false ){

		$image = $this->getAttachment( $attachment_id );
		$imageSrc = $this->getAttachmentSrc( $attachment_id );
		$imageToUG = str_replace( '>', 'data-image="' . $imageSrc[0] . '">', $image );

		return $imageToUG;

	}

	protected function albumCount(){

		$count = 0;
		if( ! empty( $this->getImages()[0] ) ) {

			foreach ($this->getImages()[0] as $key => $image) {
				
				if( ! empty( $this->getAttachment( $image ) ) ){

					$count++;

				}

			}

		}

		$this->count = $count;

	}

	protected function albumThumbnail(){

		$images_exists = array();

		if( ! empty( $this->getImages()[0] ) ) {

			foreach ($this->getImages()[0] as $key => $image) {
				
				if( ! empty( $this->getAttachment( $image ) ) ){

					$images_exists[] = $image;

				}

			}

		}

		

		$this->thumbnail = $images_exists[0];

	}

	protected function albumImages(){

		$this->images = $this->getMeta( $this->album_ID );

	}

	protected function albumTitle(){

		$this->title = $this->get( 'post_title' );

	}

	protected function albumExists(){

		$postMeta = $this->getMeta();

		$this->exists = ( !empty($postMeta) && is_array($postMeta) ) ? true : false;

	}

}