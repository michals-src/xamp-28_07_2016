<?php

namespace stayapp\db;

Class Connection extends \PDO
{
	public function __construct()
	{
		
		parent::__construct('mysql:host=localhost;dbname=stayapp', 'root', '');
		parent::query ('SET NAMES utf8');
		parent::query ('SET CHARACTER_SET utf8_unicode_ci');

	}

	protected function db()
	{
		return new Self();
	}

}