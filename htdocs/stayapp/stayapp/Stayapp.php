<?php

namespace stayapp;

use stayapp\graph\Graph;

Class StayApp extends Graph{

	public function __construct()
	{
		$url = $this->parseUrl();

		return $this->setView($url);
	}

	private function parseUrl()
	{
		if(!empty($_GET['url'])){
			return explode('/', filter_var(rtrim($_GET['url'], '/'), FILTER_SANITIZE_URL));
		}
	}

}