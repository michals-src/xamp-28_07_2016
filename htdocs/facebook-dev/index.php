<?php

session_start();

require_once __DIR__ . '/Facebook/autoload.php';

$app = new Cameolon\Facebook([
	'app_id'	=> '777146465768072', 
	'app_secret'	=> 'd3677d3278aa1fc015dcb751b28f3dc1'
]);

$login = $app->Login();

if( $login->isLogged() ){
	print_r($login->getAccessToken());
}else{
	$login ->urlLink();
}
