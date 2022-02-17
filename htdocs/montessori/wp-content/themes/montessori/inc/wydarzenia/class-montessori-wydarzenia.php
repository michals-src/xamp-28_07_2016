<?php
/**
 * 
 */

namespace Montessori;

use Montessori\WydarzeniaPostType;
use Montessori\WydarzeniaFields;
use Montessori\WydarzeniaViewer;

Class Wydarzenia{

	/**
	 * @var Montessori Wydarzenia PostType
	 */
	protected $postType;

	/**
	 * @var Montessori Wydarzenia fields
	 */
	protected $fields;

	/**
	 * @var Montessori Wydarzenia shortcode
	 */
	protected $viewer;


	public function __construct(){

		$this->postType = new WydarzeniaPostType();

		$this->fields = new WydarzeniaFields();

		$this->viewer = new WydarzeniaViewer();

		$this->actions();

	}

	protected function actions(){

		$this->getActions( 'postType' );

		$this->getActions( 'fields' );
		
		$this->getActions( 'viewer' );

	}

	protected function getActions( $obj ){

		if(!empty($this->$obj))

			return $this->$obj->getActions();

	}

}