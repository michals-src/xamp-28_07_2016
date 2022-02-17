<?php

/**
 * Komentarz
 */

namespace Montessori;

use \WP_Query;
use Montessori\WydarzeniaPostType;

Class WydarzeniaPost{

	protected static $posts;

	protected $post;

	public $post_ID;

	protected $postMeta;

	protected static $postMeta_name = array( '_wydarzenie_data', '_wydarzenie_ustawienia' );


	public function __construct(){

		$this->Post();

	}


	public static function getMetaName(){

		return self::$postMeta_name;

	}


	public function getMeta( $type = '0' ){


		if( empty( $type ) ){

			$type = '0';

		}

		return $this->postMeta( $type );

	}

	public function Get( $val ){

		if( ! empty($this->post->$val) )

		return $this->post->$val;

	}

	public static function getAllEvents(){

		return self::allPosts();

	}

	public function addEvent( $args = array() ){

		return $this->createPost( $args );

	}

	protected static function allPosts(){

		$args = array(
			'post_type' 	=> WydarzeniaPostType::getName(),
			'post_status' 	=> 'publish'
		);
		$posts = get_posts( $args );

		return $posts;

	}

	protected function Post(){

		$this->post = get_post( $this->post_ID );

	}

	protected function postMeta( $type = '0' ){

		if( empty( $type ) ){

			$type = '0';

		}

		$meta = get_post_meta( $this->post_ID, self::$postMeta_name[$type] ) ? get_post_meta( $this->post_ID, self::$postMeta_name[$type] ) : '';
		return $meta;

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