<?php

namespace stayapp\db;

Class Database extends Connection
{


	private $query = '';


	protected function setQuery($query = '')
	{

		$this->query = $this->db()->prepare($query);

		return $this;
	}

	protected function setVars($args = [])
	{
		$this->query->execute($args);

		return $this;
	}

	protected function fetch()
	{
		return $this->query->fetch(\PDO::FETCH_ASSOC);
	}

	protected function fetchAll()
	{
		return $this->query->fetchAll(\PDO::FETCH_ASSOC);
	}



}