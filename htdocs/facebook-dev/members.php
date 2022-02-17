<?php

if( ! session_start() ){
  session_start();
}


// Logged in
echo '<h3>Access Token</h3>';
$access_token = $_SESSION['access_token_page_fb'];

require_once __DIR__ . '/Fb/autoload.php';

$fb = new Facebook\Facebook([
    'app_id' => '777146465768072',
    'app_secret' => 'd3677d3278aa1fc015dcb751b28f3dc1',
    'default_graph_version' => 'v2.5'
]);

$linkData = [
 'link' => 'www.yoururl.com',
 'message' => 'Your message here'
];
$pageAccessToken = $access_token;

try {
 $response = $fb->post('/me/feed', $linkData, $pageAccessToken);
} catch(Facebook\Exceptions\FacebookResponseException $e) {
 echo 'Graph returned an error: '.$e->getMessage();
 exit;
} catch(Facebook\Exceptions\FacebookSDKException $e) {
 echo 'Facebook SDK returned an error: '.$e->getMessage();
 exit;
}
$graphNode = $response->getGraphNode();
$post_id = $graphNode->getProperty('id');
echo '<a href="https://facebook.com/' . $post_id . '"> Zobacz artykuł </a>';