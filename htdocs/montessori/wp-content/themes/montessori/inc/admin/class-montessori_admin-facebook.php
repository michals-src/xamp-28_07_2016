<?php

namespace Montessori\Admin;

use Facebook\Facebook;


Class MontessoriFacebook{

	/**
	 * @cokie
	 */
	private $sessionName = 'mf_u';

	/**
	 * @var int
	 */
	private $sessionTime = ((86400 * 365) * 5);

	/**
	 * @var string
	 */
	private $prefix = 'montessori_fb_';

	/**
	 * ID docelowej strony
	 * @var int
	 */
	private $targetPage;

	/**
	 * @var object
	 */
	private $fb;

	/**
	 * @var object
	 */
	private static $Instance;

	/**
	 * @var object
	 */
	private static $montessori_settings;

	public function __construct(){

		global $montessori_template_settings;

		if( ! session_start() ){
			session_start();
		}

		$this->montessori_settings = $montessori_template_settings;

		$app_id = $this->montessori_settings->option('montessori_facebook_app_id');
		$app_secret = $this->montessori_settings->option('montessori_facebook_app_secret');
		$this->fb = new Facebook([
			'app_id' => $app_id,
			'app_secret' => $app_secret,
			'default_graph_version' => 'v2.5',
			'cookie' => true
		]);


		$this->actions();
		$this->getSessionNotification();
		$this->getRedirectFBActions();

	}

	public function getInstance(){

		if( ! self::$Instance ){ self::$Instance = new Self; }
		return self::$Instance;

	}

	private function getPages(){
		
		$pages = $this->getObject( '/me?fields=accounts{app_id,name}' )->asArray();
		$array = [];

		if( ! empty( $pages['accounts'] ) ){
			foreach ($pages['accounts'] as $key => $value) {
				$array[$value['id']] = $value['name'];
			}
		}

		return $array;

	}

	public function actions(){
		// WP_akcje
		if( ! empty( $this->montessori_settings->option('montessori_facebook_auto_post') ) && $this->getSession() ){
			add_action( 'save_post', array( $this, 'facebook_save_post'), 1 );
		}
	}

	public function facebook_save_post( $post_ID ){

		global $post_type, $pagenow;

		$is_autosave = wp_is_post_autosave( $post_ID );
		$is_revision = wp_is_post_revision( $post_ID );

		if( $is_autosave || $is_revision){
			return;
		}

		$targetPage = $this->montessori_settings->option( 'montessori_facebook_page_target' );

		if( $targetPage !== 'brak' && array_key_exists($targetPage, $this->getPages()) && $this->getSession() ):

		if( $post_type === 'post' && in_array( $pagenow, array( 'post.php' ) ) ) {

			$post = get_post( $post_ID );
			$meta = (get_post_meta( $post->ID, '_fb_post_created' )) ? get_post_meta( $post->ID, '_fb_post_created' ) : false;
			$post_content = get_extended($post->post_content);
			$post_url = get_permalink( $post_ID );
		
			if( ! empty( $post->post_content ) && $post->post_status === 'publish' && empty( $meta ) ):
				
			$fb_content = [];

			$this->fb()->setDefaultAccessToken( $this->getSession() );

			$response = $this->fb()->sendRequest('GET', $targetPage, ['fields' => 'access_token'])
			    ->getDecodedBody();
			$foreverPageAccessToken = $response['access_token'];

			$content_message = $this->montessori_settings->option( 'montessori_facebook_article_content' );
			$message = str_replace( '{{wstęp_artykułu}}', $post_content['main'], $content_message );
			
			$url = preg_match( '{{odnośnik_artykułu}}', $message );

			if( ! empty( $url ) ){
				$message = str_replace( '{{odnośnik_artykułu}}', '', $message );
				$fb_content['link'] = $post_url;
			}

			$fb_content['message'] = $message;
			$fb_content['caption'] = 'Caption';
			
			$this->fb()->post( '/me/feed', $fb_content, $foreverPageAccessToken );
			add_post_meta( $post_ID, '_fb_post_created', time() );

			endif;

		}

		if( ! $this->getSession() ){
				
			mti_notice( array(
				'id'	=> 'post-facebook',
				'text'	=> 'Sesja facebook wygasła. Proszę zalogować się ponownie.',
				'pages'	=> array('post-new.php'),
				'post_type'	=> 'post'
			) );

		}

		endif;
	}

	protected function getRedirectFBActions(){
		$this->getRedirectSession();
		$this->deleteRedirectSession();
	}

	public function getSession(){
		return $this->readSession();
	}

	private function readSession(){
		return ( ! empty( get_option( $this->prefix . $_COOKIE[ $this->sessionName ] )  ) ) ? get_option( $this->prefix . $_COOKIE[ $this->sessionName ] ) : false;
	}

	/**
	 * Powiadomienie o automatycznym dodawaniu artykułów na stronę facebooka
	 * Komunikat jest wyświetlany przy włączonej opcji automatycznego dodawania artykułów na facebooka
	 */
	public function getSessionNotification(){

		$noticePages = array( 'post-new.php' );

		if( ! empty( $this->getSession() ) && ! empty( $this->montessori_settings->option('montessori_facebook_auto_post') ) ) {

			mti_notice( array(
				'id'	=> 'post-facebook',
				'text'	=> 'Poniższy artykuł zostanie automatycznie dodany na stronę facebooka zgodnie z ustawieniami.',
				'pages'	=> $noticePages,
				'post_type'	=> 'post'
			) );


		}

	}

	public function setSession( $access_token = null ){
		return $this->session( $access_token );
	}

	private function session( $access_token = null ){

		if( ! empty( $access_token ) ){

			$graph = $this->fb->get( '/me', $access_token )->getGraphObject();
			$id = $graph->getProperty('id');

			if( ! get_option( $this->prefix . $id ) ){
				add_option( $this->prefix . $id, $access_token, 'no');
			}else{
				update_option( $this->prefix . $id, $access_token, 'no');
			}

			setcookie( $this->sessionName, $id, $this->getSessionTime(), '/' );
			wp_redirect( admin_url('/themes.php?page=ustawienia_szablonu') );
			exit;

		}

		return;

	}

	protected function getRedirectSession(){


		if ( ! $this->getSession() && ! empty( $_GET['fb_redirect'] ) && $_GET['fb_a'] === 'loi' ):

			$helper = $this->fb->getRedirectLoginHelper();
			try {
			  $accessToken = $helper->getAccessToken();
			} catch(\Facebook\Exceptions\FacebookResponseException $e) {
			  // When Graph returns an error
			  echo 'Graph zwrócił błąd: ' . $e->getMessage();
			 // exit;
			} catch(\Facebook\Exceptions\FacebookSDKException $e) {
			  // When validation fails or other local issues
			  echo 'Facebook SDK zwrócił błąd: ' . $e->getMessage();
			  //exit;
			}

			$accessToken = (string) $accessToken;
			$this->setSession( $accessToken );
					
		endif;

	}

	protected function deleteRedirectSession(){

		if ( $this->getSession() && ! empty( $_GET['fb_redirect'] ) && $_GET['fb_a'] === 'loo' ):

			delete_option( $prefix . $_COOKIE[ $this->sessionName ] );
			unset( $_COOKIE[ $this->sessionName ] );
			setcookie( $this->sessionName, $_COOKIE[ $this->sessionName], $this->getSessionTime( 'delete' ), '/' );
			wp_redirect( admin_url('/themes.php?page=ustawienia_szablonu') );
			exit;

		endif;

	}

	public function getLoginUrl(){

		if( ! $this->getSession() ):

		$helper = $this->fb->getRedirectLoginHelper();
		$permissions = ['email', 'manage_pages', 'publish_pages', 'pages_manage_cta'];
		$loginUrl = $helper->getLoginUrl( admin_url( 'themes.php?page=ustawienia_szablonu' ) . '&fb_a=loi&fb_redirect=' . time(), $permissions );

		return '<a href="' . htmlspecialchars($loginUrl) . '">Zaloguj się przez Facebooka</a>';

		endif;

		return;

	}

	public function getLogoutUrl(){

		if( ! empty( $this->getSession() ) ):

		$helper = $this->fb->getRedirectLoginHelper();
		$logoutUrl = $helper->getLogoutUrl( $this->getSession(), admin_url( 'themes.php?page=ustawienia_szablonu' ) . '&fb_a=loo&fb_redirect=' . time() );

		//return '<a href="' . htmlspecialchars( $logoutUrl ) . '">Wyloguj się przez Facebooka</a>';

		endif;

		return;

	}

	private function getSessionTime( $type = false ){

		if( empty( $type ) || $type === 'create' ){
			return (time() + $this->sessionTime);
		}

		if( ! empty ( $type ) && $type === 'delete' ){
			return (time() - $this->sessionTime);
		}

		return time();

	}

	public function fb(){
		return $this->fb;
	}

	public function getObject( $endpoint ){

		$request = $this->fb->get( $endpoint, $this->getSession() );
		return $request->getGraphObject();

	}

	public function content(){

				if( ! $this->getSession() && ! $_GET['fb_redirect'] ) :

					echo $this->getLoginUrl();


				else:

					$me = $this->getObject( '/me' );

				?>

				<div class="fb-info" style="margin-top: 15px;margin-bottom: 15px;">
					<p>Zalogowano jako <strong><?php echo $me->getProperty( 'name' ); ?></strong></p>
					<div><?php echo $this->getLogoutUrl(); ?></div>
				</div>

				<?php

				$pages = $this->getObject( '/me?fields=accounts{app_id,name}' );




				endif;
	}

}

add_action( 'admin_init', array(__NAMESPACE__ . '\\MontessoriFacebook', 'getInstance'));
