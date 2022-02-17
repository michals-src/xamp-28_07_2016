<?php

/**
 * Komentarz
 */

namespace Montessori;

use \WP_Query;
use Montessori\TabelaPostType;

Class TabelaPost{

	protected static $posts;

	protected $post;

	public $post_ID;

	protected $postMeta;

	protected static $postMeta_name = 'tabela';


	public function __construct(){

		$this->Post();

		$this->postMeta();

	}


	public static function getMetaName(){

		return self::$postMeta_name;

	}


	public function getMeta(){

		return $this->postMeta;

	}

	public function Get( $val ){

		if( ! empty($this->post->$val) )

		return $this->post->$val;

	}

	public static function getAllAlbums(){

		return self::allPosts();

	}

	public function addTable( $args = array() ){

		return $this->createPost( $args );

	}

	protected static function allPosts(){

		$args = array(
			'post_type' 	=> TabelaPostType::getName(),
			'post_status' 	=> 'publish'
		);
		$posts = get_posts( $args );

		return $posts;

	}

	protected function Post(){

		$this->post = get_post($this->post_ID);

	}

	protected function postMeta(){

		$this->postMeta = get_post_meta($this->post_ID, self::$postMeta_name);

	}

	protected function createPost( $args = array() ){

		// $getGallery = get_posts( array(
		// 	'post_parent'	=> $args['gallery_parent'],
		// 	'post_type'		=> GaleriaPostType::getName(),
		// 	'post_status'	=> 'publish',
		// 	'menu_order'	=> $args['gallery_instance']
		// ) );


		// if(empty($getGallery)){
			
		// 	$post_ID = wp_insert_post( array(
		// 		'post_title'	=> $args['gallery_title'],
		// 		'post_parent'	=> $args['gallery_parent'],
		// 		'post_type'		=> GaleriaPostType::getName(),
		// 		'post_status'	=> 'publish',
		// 		'menu_order'	=> $args['gallery_instance'],
		// 	) );

		// 	update_post_meta( $post_ID, GaleriaPost::getMetaName(), $args['gallery_images'] );

		// 	return true;

		// }

	}

}