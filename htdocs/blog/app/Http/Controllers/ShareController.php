<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

Class ShareController extends Controller{

	public function index(){
		return view('share.index');
	}

	public function store(Request $a){

		var_dump($a);

	}

}