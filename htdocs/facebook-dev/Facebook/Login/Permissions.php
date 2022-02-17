<?php

namespace Cameolon\Login;

Class Permissions{
	
	protected $loginPermissions;

	public function __construct(){

		$this->loginPermissions = array(
			'email', 'manage_pages', 'publish_pages', 'pages_manage_cta'
		);

	}

	public function addNew( $value ){
		$this->loginPermissions[] = $value;
	}

	public function get(){
		return $this->loginPermissions;
	}

}