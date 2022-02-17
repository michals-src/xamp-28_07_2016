<?php

/**
 * Facebook SDK
 *
 * @version : 5.3.1
 */

namespace fb;

use Facebook\Facebook;

Class fb {

	protected $fb;

	/**
	 * Wczytywanie biblioteki Facebook PHP SDK
	 *
	 * @return  Facebook PHP SDK
	 */
	public function __construct(){
		require get_template_directory() . '/inc/src/Facebook/autoload.php';

		$this->fb = new Facebook([
		  'app_id' => '1727715354148258',
		  'app_secret' => '00cb6e4282338bcb802dda2a5c654079',
		  'default_graph_version' => 'v2.6',
		  'default_access_token' => '1727715354148258|zZ0uk4qr942YaoLODMkgxTuXglw', // optional
		]);
	}

	/**
	 * Pomoce Facebook PHP SDK
	 * @return null
	 */
	private function helpers()
	{

		// Use one of the helper classes to get a Facebook\Authentication\AccessToken entity.
		//   $helper = $fb->getRedirectLoginHelper();
		//   $helper = $fb->getJavaScriptHelper();
		//   $helper = $fb->getCanvasHelper();
		//   $helper = $fb->getPageTabHelper();
		

		return;

	}

	/**
	 * Artykuły
	 * @return object
	 */
	public function getFeed(){

		try {
		  
		  $request = $this->fb->get('/1447195698891356?fields=feed.limit(5),link,name');
		  $feed = $request->getGraphObject()->asArray()['feed'];
		  $feed = (object) $feed;


		  return $feed;

	  
		} catch(\Facebook\Exceptions\FacebookResponseException $e) {
		  // When Graph returns an error
		  echo 'Graph zwrócił błąd: ' . $e->getMessage();
		  exit;
		} catch(\Facebook\Exceptions\FacebookSDKException $e) {
		  // When validation fails or other local issues
		  echo 'Facebook SDK wzrócił błąd: ' . $e->getMessage();
		  exit;
		}
	}


	/**
	 * Attachments
	 * @param  object $item Artykuł 
	 * @return object       Item attachments
	 */
	public function getAttachment($item)
	{
		if($item){
			try {
			  
			  
			  	$item = (object) $item;

			  	$requestName = "/{$item->id}?fields=attachments,parent_id";
			  	$request = $this->fb->get($requestName);

			  	$attachments = $request->getGraphObject()->asArray();
			  	$attachments = (object) $attachments;

			  	return $attachments;


		  
			} catch(\Facebook\Exceptions\FacebookResponseException $e) {
			  // When Graph returns an error
			  echo 'Graph zwrócił błąd: ' . $e->getMessage();
			  exit;
			} catch(\Facebook\Exceptions\FacebookSDKException $e) {
			  // When validation fails or other local issues
			  echo 'Facebook SDK wzrócił błąd: ' . $e->getMessage();
			  exit;
			}
		}else{
			echo ' Nie podano parametru ';
		}
	}

	public function getImage($item){
		if($item){
			try {
			  
			  
			  	$item = (object) $item;

			  	$requestName = "/{$item->id}?fields=name,picture,icon,images";
			  	$request = $this->fb->get($requestName);

			  	$images = $request->getGraphObject()->asArray();
			  	$images = (object) $images;

			  	return $images;


		  
			} catch(\Facebook\Exceptions\FacebookResponseException $e) {
			  // When Graph returns an error
			  echo 'Graph zwrócił błąd: ' . $e->getMessage();
			  exit;
			} catch(\Facebook\Exceptions\FacebookSDKException $e) {
			  // When validation fails or other local issues
			  echo 'Facebook SDK wzrócił błąd: ' . $e->getMessage();
			  exit;
			}
		}else{
			echo ' Nie podano parametru ';
		}
	}

	public function me($fields = []){
		return $this->getFields(['id' => '1447195698891356'], $fields);
	}

	public function getFields($item = '', $fields = [])
	{
		if(!$item)
			return;

		try {
			  
			  
		  	$item = (object) $item;

		  	$request = $this->setRequest($item, $fields);
		  	$request = $this->fb->get($request);

		  	$response = (object) $request->getGraphObject()->asArray();

		  	return $response;


	  
		} catch(\Facebook\Exceptions\FacebookResponseException $e) {
		  // When Graph returns an error
		  echo 'Graph: ' . $e->getMessage();
		  exit;

		} catch(\Facebook\Exceptions\FacebookSDKException $e) {
		  // When validation fails or other local issues
		  echo 'Facebook SDK wzrócił błąd: ' . $e->getMessage();
		  exit;
		}

	}

	private function setRequest($item, $fields)
	{
		$fields = implode(',', $fields);
		return "/{$item->id}?fields={$fields}";
	}
}
