<?php

namespace Montessori\Admin\Settings;

Class SettingsValues extends DefOptions{

	protected static $instance;

	public function __construct(){
		parent::__construct();
	}

	public function getInstance(){

		if( self::$instance === null) { self::$instance = new Self; }
		return self::$instance;

	}

	public function logo(){
		return $this->defaults[ 'montessori_logo' ];
	}

	public function street(){
		return $this->defaults[ 'montessori_adress_street' ];
	}

	public function postal_code(){
		return $this->defaults[ 'montessori_adress_postal-code' ];
	}

	public function phone(){
		return $this->defaults[ 'montessori_adress_phone' ];
	}

	public function home_page_title(){
		return $this->defaults[ 'montessori_main_page_title' ];
	}

	public function post_page_error(){
		return array(
			'title' => $this->defaults[ 'montessori_post_page_error_title' ],
			'desc' => $this->defaults[ 'montessori_post_page_error_desc' ]
			);
	}

	public function page_404(){
		return array(
			'title' => $this->defaults[ 'montessori_page_404_title' ],
			'desc' => $this->defaults[ 'montessori_page_404_desc' ]
			);
	}

	public function option( $name ){
		return $this->getOption( $name );
	}

}

$values = SettingsValues::getInstance();

$GLOBALS['montessori_template_settings'] = $values;

