<?php

namespace stayapp\auth;

use stayapp\db\Database;

Class Auth extends Database{

	private $username = '';
	private $password = '';
	private $user_meta = [];

	public function __construct($username = false, $password = false)
	{
		$this->username 	= mysql_escape_string($username);
		$this->password 	= mysql_escape_string($password);
		$this->user_meta 	= $this->userMeta();
	}

	private function userMeta()
	{
		return ($this->setQuery("SELECT * FROM `app_users` WHERE `user_nickname` = :username LIMIT 1")
									 ->setVars(array(
									 	':username'	=> $this->username
									 ))
									 ->fetch(\PDO::FETCH_ASSOC))?: [];
	}

	private function comparePassword($hash)
	{
		if(password_verify($this->password, $hash))
		return true;
	}

	public function getUser()
	{
		if($this->comparePassword($this->getMeta('user_password')))
		return true;
	}

	private function getMeta($name)
	{
		if(isset($this->user_meta[$name]))
		return $this->user_meta[$name];
	}

}