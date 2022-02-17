<?php

/**
 * Komentarz
 */

namespace Montessori;

Class TabelaPostType{

	/**
	 * @var Nazwa Post Type
	 */
	protected static $post_type_name = 'tabela';
	
	/**
	 * @var Tytuł dla nagłówków
	 */
	protected $label_name = 'Tabele';

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
			'add_new'            => 'Dodaj tabelę',
			'add_new_item'       => 'Dodaj tabelę',
			'new_item'           => 'Dodaj tabelę',
			'edit_item'          => 'Edytuj tabelę',
			'view_item'          => 'Zobacz tabelę',
			'all_items'          => 'Wszystkie tabele',
			'search_items'       => 'Znajdź tablę',
			'parent_item_colon'  => 'Rodzic',
			'not_found'          => 'Nie znaleziono tabeli',
			'not_found_in_trash' => 'Nie znaleziono żadnych tabeli w koszu'
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
			'rewrite'            => array( 'slug' => 'tabela' ),
			'capability_type'    => 'post',
			'has_archive'        => false,
			'hierarchical'       => true,
			'menu_position'      => null,
			'menu_icon'			 => 'dashicons-welcome-add-page',
			'supports'           => array( 'title' )
		);

	}

}