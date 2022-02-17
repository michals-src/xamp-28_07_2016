<?php

namespace stayapp\graph\controller;

use stayapp\graph\Graph;
use stayapp\person\Person;

Class search extends Graph{

	protected $q;
	protected $id;
	protected $k;
	protected $person;

	public function __construct()
	{
		if(!$this->isLogged()){ return; }

		$this->q = (!empty($_GET['q'])) ? htmlspecialchars($_GET['q']): '';
		$this->id = (!empty($_GET['id'])) ? htmlspecialchars($_GET['id']): '';
		$this->k = (!empty($_GET['k'])) ? htmlspecialchars($_GET['k']): '';
		$args = array_filter(explode(' ', $this->q ));

		$this->person = new Person($args, $this->id, $this->k);
	}

	public function index()
	{
		$this->getView('search');
	}

	public function get()
	{
		$this->getView('person');
	}

	public function save()
	{
		if(!$this->isPOST()){ return; }
		$array = [];

		$imie = (!empty($_POST['pn'])) ? $_POST['pn'] : '';
		$nazwisko = (!empty($_POST['psn'])) ? $_POST['psn'] : '';
		$data = (!empty($_POST['pd'])) ? $_POST['pd'] : '';
		$telefon = (!empty($_POST['pp'])) ? $_POST['pp'] : '';
		$liczbaWejsc = (!empty($_POST['pc'])) ? $_POST['pc'] : '';
		$dataKarnetu = (!empty($_POST['pcd'])) ? $_POST['pcd'] : '';
		$wejscia = (!empty($_POST['pat'])) ? $_POST['pat'] : '';

		$array['person_name'] = $imie;
		$array['person_surname'] = $nazwisko;
		$array['person_date'] = $data;
		$array['person_phone'] = $telefon;
		$array['person_count'] = $liczbaWejsc;
		$array['person_card_date'] = $dataKarnetu;
		$array['person_admittance'] = $wejscia;

		$diff = array_diff($array, $this->person->getValues());
		$set = $this->person->saveResults($diff);
		

		if(!empty($set)){
			$this->q = "{$array['person_name']} {$array['person_surname']}";
		}

		header("Location: /person/get{$this->uri()}");
	}

	public function create()
	{
		if($this->isGET()){

			$this->getView('create');

		}else if($this->isPOST()){

			$array = [];

			$imie = (!empty($_POST['pn'])) ? $_POST['pn'] : '';
			$nazwisko = (!empty($_POST['psn'])) ? $_POST['psn'] : '';
			$data = (!empty($_POST['pd'])) ? $_POST['pd'] : '';
			$telefon = (!empty($_POST['pp'])) ? $_POST['pp'] : '';
			$liczbaWejsc = (!empty($_POST['pc'])) ? $_POST['pc'] : '';
			$dataKarnetu = (!empty($_POST['pcd'])) ? $_POST['pcd'] : '';
			$wejscia = (!empty($_POST['pat'])) ? $_POST['pat'] : '';

			$array['person_name'] = $imie;
			$array['person_surname'] = $nazwisko;
			$array['person_date'] = $data;
			$array['person_phone'] = $telefon;
			$array['person_count'] = $liczbaWejsc;
			$array['person_card_date'] = $dataKarnetu;
			$array['person_admittance'] = $wejscia;


			$make = $this->person->makeNew( $array );

			if(!empty($make)){
				$this->q = "{$array['person_name']} {$array['person_surname']}";
			}

			header("Location: /person/get{$this->uri()}");

		}else{
			return;
		}
	}

	protected function uri()
	{
		$q = (!empty($this->q)) ? "?q={$this->q}" : '';
		$id = (!empty($this->id)) ? "&id={$this->id}" : '';
		$k = (!empty($this->k)) ? "&k={$this->k}" : '';

		return $q .''. $id .''. $k;
	}

}