<?php

/**
 * Komentarz
 */

namespace Montessori;

Class WydarzeniaPostType{

	/**
	 * @var Nazwa Post Type
	 */
	protected static $post_type_name = 'wydarzenia';
	
	/**
	 * @var Tytuł dla nagłówków
	 */
	protected $label_name = 'wydarzenia';

	/**
	 * @var Wartośći dla zmiennej $args
	 */
	protected $labels;

	/**
	 * @var Wartości dla rejestracji Post Type
	 */
	protected $args;


	/**
	 * Przydzielenie zmiennym odpowiednich wartości
	 */
	public function __construct(){

		$this->setLabels();
		$this->setArgs();

	}

	public function getActions(){
		
		if(!empty($this->args))

		add_action('init', array($this, 'register'));

	}

	/**
	 * @return string
	 */
	public static function getName(){

		return self::$post_type_name;

	}

	/**
	 * Rejestracja Wordpress post_type
	 */
	public function register(){
	
		register_post_type( self::$post_type_name, $this->args );

	}

	public function setLabels(){

		$this->labels = array(
			'name'               => $this->label_name,
			'singular_name'      => $this->label_name,
			'menu_name'          => $this->label_name,
			'name_admin_bar'     => $this->label_name,
			'add_new'            => 'Dodaj wydarzenie',
			'add_new_item'       => 'Dodaj wydarzenie',
			'new_item'           => 'Dodaj wydarzenie',
			'edit_item'          => 'Edytuj wydarzenie',
			'view_item'          => 'Zobacz wydarzenie',
			'all_items'          => 'Wszystkie wydarzenie',
			'search_items'       => 'Znajdź wydarzenie',
			'parent_item_colon'  => 'Rodzic',
			'not_found'          => 'Nie znaleziono wydarzeń',
			'not_found_in_trash' => 'Nie znaleziono żadnych wydarzeń w koszu'
		);

	}

	public function setArgs(){

		$this->args = array(
			'labels'             => $this->labels,
			'public'             => true,
			'publicly_queryable' => true,
			'show_ui'            => true,
			'show_in_menu'       => true,
			'query_var'          => true,
			'rewrite'            => array( 'slug' => 'wydarzenia' ),
			'capability_type'    => 'post',
			'has_archive'        => false,
			'hierarchical'       => true,
			'menu_position'      => null,
			'menu_icon'			 => 'dashicons-calendar-alt',
			'supports'           => array( 'title', 'editor' )
		);

	}

}