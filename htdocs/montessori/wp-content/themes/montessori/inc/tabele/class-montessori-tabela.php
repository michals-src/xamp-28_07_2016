<?php

/**
 * Komentarze
 */

namespace Montessori;

use Montessori\TabelaPostType;
// use Montessori\TabelaFields;
// use Montessori\TabelaViewer;
// use Montessori\TabelaFilters;

Class Tabela{

	/**
	 * @var Montessori Tabela PostType
	 */
	protected $postType;

	/**
	 * @var Montessori Tabela fields
	 */
	protected $fields;

	/**
	 * @var Montessori filtry wspomagające plugin
	 */
	protected $filters;

	/**
	 * @var Wyświetalnie tabel
	 */
	protected $viewer;



	public function __construct(){

		$this->postType = new TabelaPostType();

		$this->fields = new TabelaFields();

		// $this->filters = new GaleriaFilters();

		// $this->viewer = new GaleriaViewer();

		$this->actions();

	}

	/**
	 * Odwołanie się do add_acttion
	 */
	protected function actions(){

		$this->getActions( 'postType' );

		$this->getActions( 'fields' );

		// $this->getActions( 'filters' );

		// $this->getActions( 'viewer' );
		
		add_action( 'admin_enqueue_scripts', array( $this, 'adminScripts' ) );

	}

	/**
	 * Dodanie bibliotek plugin w panelu administracyjnym
	 */
	public function adminScripts(){

		global $typenow, $pagenow ;

		if( $typenow === TabelaPostType::getName() && in_array( $pagenow, array('post-new.php', 'post.php')) ) :

		//wp_die($pagenow);
		
		wp_enqueue_media();

		wp_enqueue_style( 'jquery', 'http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.2/themes/smoothness/jquery-ui.css', array(), '1.0', 'all');
		
		wp_enqueue_style('montessori-tabela', MONTESSORI_TABELA_URI . '/css/tabela-admin-style.css', array(), '1.0.0', 'all');

		wp_enqueue_script('montessori-tabela', MONTESSORI_TABELA_URI . '/js/tabela-admin-script.js', array( 'jquery' ), '1.0.0', true);

		else:

			return;

		endif;

	}

	protected function getActions( $obj ){

		if(!empty($this->$obj))

			return $this->$obj->getActions();

	}


}