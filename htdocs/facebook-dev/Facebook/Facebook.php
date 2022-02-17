<?php

namespace Cameolon;

use Cameolon\Login\uAuth;
use Cameolon\Login\Permissions;

Class Facebook{

	private $app_id;
	private $app_secret;
	protected $default_graph_version;

	private $fb;
	private $SDK_DIR = 'SDK';

	public function __construct($config = array()){

		require_once __DIR__ . '/' . $this->SDK_DIR . '/autoload.php';
		$this->fb = new \Facebook\Facebook( $config );

	}

	public function Login(){
		return new uAuth($this->fb, new Permissions());
	}


	
}