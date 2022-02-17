<?php

namespace stayapp\graph\controller;

use stayapp\graph\Graph;
use stayapp\auth\Auth;

Class login extends Graph{

	public function index()
	{
		if($this->isPOST() || $this->isLogged()){ return; }
		$this->getView('login');
	}

	public function login()
	{
		if(!$this->isPOST() || $this->isLogged()){ return; }

		$username = (!empty($_POST['username'])) ? $_POST['username'] : '';
		$password = (!empty($_POST['password'])) ? $_POST['password'] : '';
		
		$user = new Auth($username, $password);
		
		if(!$user->getUser())
		{
			$this->setException(array(
				'loginMSG'	=> 'Nieprawidłowa nazwa użytkownika lub hasło'
			));

			header("Location: /");
			return;
		}
		
		$_SESSION['uid'] = md5('logged');
		header("Location: /");

		
	}

}