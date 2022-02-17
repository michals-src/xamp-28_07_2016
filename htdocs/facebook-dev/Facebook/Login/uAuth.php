<?php

namespace Cameolon\Login;

use \Facebook\Facebook;

Class uAuth{

	private $callback = '/cb.php';

	// Facebook object
	private $fb;
	// Login permissions object
	private $permissions;
	// User access token string
	private $accessToken;
	
	public function __construct(Facebook $fb, Permissions $permissions){
		$this->fb = $fb;
		$this->permissions = $permissions;
		$this->accessToken = (!empty($_SESSION['access_token'])) ? $_SESSION['access_token'] : false;
	}

	public function urlLink(){

		$helper = $this->getRedirectLoginHelper();
		$permissions = $this->permissions->get();
		$loginUrl = $helper->getLoginUrl( 'http://facebook.dev/' . $this->callback, $permissions );

		echo '<a href="' . htmlspecialchars($loginUrl) . '">Zaloguj się ( Facebook )</a>';

	}

	public function isLogged(){
		return $this->getAccessToken();
	}

	public function getRedirectLoginHelper(){
		return $this->fb->getRedirectLoginHelper();
	}

	public function getAccessToken(){
		return $this->accessToken;
	}

	public function getRedirectLogin(){
		return $this->_IN();
	}

	private function _IN(){

		$helper = $this->getRedirectLoginHelper();
		$_SESSION['access_token'] = (string) $helper->getAccessToken();

		header("Location: /");

	}

}