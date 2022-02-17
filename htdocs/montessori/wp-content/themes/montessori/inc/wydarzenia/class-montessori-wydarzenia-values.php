<?php

/**
 * 
 */

namespace Montessori;

use Montessori\WydarzeniaPost;

Class WydarzeniaValues extends WydarzeniaPost{

		/**
	 * @var integer
	 */
	protected $event_ID;

	/**
	 * @var boolean
	 */
	protected $exists;

	/**
	 * @var string
	 */
	protected $title;

	/**
	 * @var string
	 */
	protected $date;

	/**
	 * @var array
	 */
	protected $settings;



	public function __construct( $event_ID ){

		$this->event_ID = $this->post_ID = $event_ID;

		parent::__construct();

		$this->eventExists();

		$this->eventTitle();

		$this->eventDate();

		$this->eventSettings();

	}

	public function Exists(){

		return $this->exists;

	}

	public function getSettings(){
		if( ! empty( $this->settings[0] ) ):
			return $this->settings[0];
		endif;
	}

	public function getDate(){
		if( ! empty( $this->date[0] ) ):
			return $this->date[0];
		endif;
	}

	public function getTitle(){

		return $this->title;

	}

	public function getEventID(){

		return $this->event_ID;

	}

	protected function eventSettings(){

		$this->settings = $this->getMeta( '1' );

	}

	protected function eventDate(){

		$this->date = $this->getMeta( '0' );

	}

	protected function eventTitle(){

		$this->title = $this->get( 'post_title' );

	}

	protected function eventExists(){

		$postMeta = $this->getDate();

		$this->exists = ( ! empty( $postMeta ) && is_string( $postMeta ) ) ? true : false;

	}

}