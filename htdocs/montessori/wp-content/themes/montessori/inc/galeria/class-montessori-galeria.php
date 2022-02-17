<?php

/**
 * Komentarze
 */

namespace Montessori;

use Montessori\GaleriaPostType;
use Montessori\GaleriaFields;
use Montessori\GaleriaViewer;
use Montessori\GaleriaFilters;

Class Galeria{

	/**
	 * @var Montessori Galeria PostType
	 */
	protected $postType;

	/**
	 * @var Montessori Galeria fields
	 */
	protected $fields;

	/**
	 * @var Montessori filtry wspomagające galerię
	 */
	protected $filters;

	/**
	 * @var Wyświetalnie galerii
	 */
	protected $viewer;



	public function __construct(){

		$this->postType = new GaleriaPostType();

		$this->fields = new GaleriaFields();

		$this->filters = new GaleriaFilters();

		$this->viewer = new GaleriaViewer();

		$this->actions();

	}

	/**
	 * Odwołanie się do add_acttion
	 */
	protected function actions(){

		$this->getActions( 'postType' );

		$this->getActions( 'fields' );

		$this->getActions( 'filters' );

		$this->getActions( 'viewer' );
		
		add_action( 'admin_enqueue_scripts', array( $this, 'adminScripts' ) );

	}

	/**
	 * Dodanie bibliotek galleri w panelu administracyjnym
	 */
	public function adminScripts(){

		global $typenow;

		if( $typenow === GaleriaPostType::getName() ) : 
		
		wp_enqueue_media();

		wp_enqueue_style( 'jquery', 'http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.2/themes/smoothness/jquery-ui.css', array(), '1.8.2', 'all');
		
		wp_enqueue_style('montessori-galeria', MONTESSORI_GALERIA_URI . '/css/galeria-admin-style.css', array(), '1.0.1', 'all');

		wp_enqueue_script('montessori-galeria', MONTESSORI_GALERIA_URI . '/js/galeria-admin-script.js', array( 'jquery' ), '1.0.1', true);

		else :

			return;

		endif;

	}

	protected function getActions( $obj ){

		if(!empty($this->$obj)){
		
			return $this->$obj->getActions();
			
		}

	}


}