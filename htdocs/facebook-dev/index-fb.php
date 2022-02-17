<?php
if( ! session_start() ){
  session_start();
}
require_once __DIR__ . '/Fb/autoload.php';

$userAccessToken = 'EAALCz4MH0ogBAHUZBSLLPLCiOAxvHvWy9ZBtRKPlnSnXdGq2ZCkLZAC2DsMBTM3QQvDb0mTbzQGjWZBDfbMkUtKyg7dYROMZBF4fDY8bR4x0XpD9jbwuzmAnGV7gsIJrYbQaDmOitYgVXJ37SoMS6THPOMo0B4U458TOwjh2D3CQZDZD';

$fb = new Facebook\Facebook([
    'app_id' => '777146465768072',
    'app_secret' => 'd3677d3278aa1fc015dcb751b28f3dc1',
    'default_graph_version' => 'v2.5'
]);

// $longLivedToken = $fb->getOAuth2Client()->getLongLivedAccessToken($userAccessToken);

// $fb->setDefaultAccessToken($longLivedToken);

// $response = $fb->sendRequest('GET', '1958323974402404', ['fields' => 'access_token'])
//     ->getDecodedBody();

// $foreverPageAccessToken = $response['access_token'];
// echo $foreverPageAccessToken;


$helper = $fb->getRedirectLoginHelper();

$permissions = ['email', 'manage_pages', 'publish_pages', 'pages_manage_cta']; // Optional permissions
$loginUrl = $helper->getLoginUrl('http://facebook.dev/callback.php', $permissions);

echo '<a href="' . htmlspecialchars($loginUrl) . '">Log in with Facebook!</a>';