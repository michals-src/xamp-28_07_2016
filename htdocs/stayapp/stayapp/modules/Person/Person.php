<?php

namespace stayapp\person;

use stayapp\db\Database;

Class Person extends Database{

	private $args = [];
	private $person_meta = [];

	public function __construct($args = [], $id = false, $k = false)
	{
		foreach ($args as $key => $value) {
			$this->args[] = mysql_escape_string(ucfirst($value));
		}
		$this->person_meta	= $this->personMeta();

		$this->id = $id;
		$this->k = $k;

	}

	private function personMeta()
	{
		$zero = (!empty($this->args[0]))? $this->args[0]: '';
		$one = (!empty($this->args[1]))? $this->args[1]: '';

		$by0 = ($this->setQuery("SELECT * FROM `app_persons` WHERE `person_name` = :name AND `person_surname` = :surname ORDER BY `person_id` DESC")->setVars(array(':name'	=> $zero, ':surname'	=> $one ))->fetchAll())? : [];
		$by1 = ($this->setQuery("SELECT * FROM `app_persons` WHERE `person_name` = :name AND `person_surname` = :surname ORDER BY `person_id` DESC")->setVars(array(':name'	=> $one, ':surname'	=> $zero ))->fetchAll())? : [];
		if(!empty($by0)){
			return $by0;
		}else if(!empty($by1)){
			return $by1;
		}
	}

	public function getPersons()
	{
		if(!empty($this->person_meta))
		return $this->person_meta;
	}

	public function getValues()
	{
		if(!empty($this->k)){
			if(!empty($this->person_meta[($this->k - 1)]))
			return $this->person_meta[($this->k - 1)];
		}else{
			if(!empty($this->person_meta[0]))
			return $this->person_meta[0];
		}
	}

	public function getValue($v = '')
	{
		if(!empty($this->k)){
			if(!empty($this->person_meta[($this->k - 1)][$v]))
			return $this->person_meta[($this->k - 1)][$v];
		}else{
			if(!empty($this->person_meta[0][$v]))
			return $this->person_meta[0][$v];
		}
	}

	public function saveResults($diff = [])
	{
		return $this->saveMeta($diff);
	}

	public function makeNew($args = [])
	{
		return $this->createPerson($args);
	}

	private function saveMeta($diff)
	{
		if(empty($diff)){ return; }

		$sql = [
			'exec' => [
				':name' => $this->getValue('person_name'),
				':surname' => $this->getValue('person_surname')
			]
		];

		foreach ($diff as $key => $value) {
			$sql['sql'][] = "`{$key}` = :{$key}";
			$sql['exec'][":{$key}"] = $value;
		}
		if(!empty($this->id)){
			$sql['exec'][':person_id'] = $this->id;
			$sql['and'] = ' AND `person_id` = :person_id ';
		}
		$sql['sql'] = implode(', ', $sql['sql']);
		$sql['and'] = (!empty($sql['and'])) ? $sql['and'] : '';
		$update = $this->setQuery("UPDATE `app_persons` SET {$sql['sql']} WHERE `person_name` = :name AND `person_surname` = :surname {$sql['and']}")
			 ->setVars($sql['exec']);

		return true;

	}

	private function createPerson($args)
	{
		if(empty($args)){ return; }
		
		$v = [];
		foreach ($args as $key => $value) {
			$v[":{$key}"] = $value;
		}

		$vs = implode(', ', array_keys($v));
		$this->setQuery("INSERT INTO `app_persons` (`person_name`, `person_surname`, `person_date`, `person_phone`, `person_count`, `person_card_date`, `person_admittance`) VALUES ({$vs})")
			 ->setVars($v);

		return true;
	}

}