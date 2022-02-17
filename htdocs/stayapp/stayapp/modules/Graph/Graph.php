<?php

namespace stayapp\graph;

use stayapp\auth\Auth;

Class Graph{

	protected $view = 'search';
	protected $url = array();
	protected $method = 'index';
	protected $controller = '';
	protected static $exceptions = array();


	public function setView( $url = false )
	{

		$this->url = $url;

		if(!empty($this->isLogged()))
		{
			$this->view = 'search';
		}

		$this->controller();

	}

	protected function controller()
	{
			
		require_once 'controllers/' . $this->view . '.php';
		
		$this->controller = 'stayapp\graph\controller\\' . $this->view;
		if(class_exists($this->controller)){

			$this->controller = new $this->controller;

			if(!empty($this->url[1]) && method_exists($this->controller, $this->url[1]))
			{
				$this->method = $this->url[1];
			}

			call_user_method($this->method, $this->controller);

		}	

	}

	public function getView($view)
	{

		require_once 'Views/header.php';
		require_once 'Views/'. $view . '.php';
		require_once 'Views/footer.php';

	}

	public function setException($args = array())
	{
		$_SESSION['_exception'] = $args;
	}

	public function getException()
	{
		if(!empty($_SESSION['_exception']))
		return $_SESSION['_exception'];
	}

	protected function isPOST(){
		if($_SERVER['REQUEST_METHOD'] === 'POST')
			return true;
	}

	protected function isGET(){
		if($_SERVER['REQUEST_METHOD'] === 'GET')
			return true;
	}

	public function isLogged()
	{
		if(!empty($_SESSION['uid']))
			return $_SESSION['uid'];
	}

}