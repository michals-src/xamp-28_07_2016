<?php
/**
 * Funkcje dotyczące powiadomień w panelu administracyjnym
 *
 * @usage Admin
 * @package Montessori
 */

if(!class_exists('Mti_Notice')):

Class Mti_Notice{

	/* (string) Global $pagenow */
	private $pagenow;

	/* (string) Global $post_type */
	private $post_type;

	/* (object) Class to verify if is exists*/
	private static $self = false;

	/* (Array) Zbiór powiadomień */
	private $notices = array();


	/* (Array) Zbiór argumentów powiadomienia */
	private $args = array();



	/*
		Przypisanie globalnych zmiennych dla prywatnych zmiennych funkcji
	*/
	public function __construct( $args ){

		$this->setArgs($args);
		$this->actions();

	}

	public function setGlobals(){

		global $pagenow, $post_type;

		$this->pagenow = $pagenow;
		$this->post_type = $post_type;

		return $this->notice();

	}

	public function actions(){

		add_action( 'admin_notices', array($this, 'setGlobals') );

	}

	/**
     * 
	 * Dodanie dla tablicy $args argumentów (bool) setPage (bool) setPost_type 
	 * Określających $pages i $post_type na których ma się wyświetlać komunikat
     * 
	*/
	private function verification(){

		$this->args->setPage = false;
		$this->args->setPost_type = false;

		/* Wyświetlanie komunikatu dla wybranej pages */
		if( ! empty( $this->args->pages ) ){
			
			if( in_array( $this->pagenow, $this->args->pages ) ) $this->args->setPage = true;
		
		}

		/* Wyświetlanie komunikatu dla wybranej post_type */
		if( ! empty( $this->args->post_type ) ){

			/* Weryfikacja typu post_type */
			if( is_array( $this->args->post_type ) ){

				if( in_array( $this->post_type, $this->args->post_type ) ) $this->args->setPost_type = true;
			
			}elseif( is_string( $this->args->post_type ) ){
				
				if( $this->post_type == $this->args->post_type ) $this->args->setPost_type = true;
			
			}

		}

		/* Wyświetlanie komunikatu dla wszystkich pages */
		if( empty( $this->args->pages ) ){

			$this->args->setPage = true;

		}

		/* Wyświetlanie komunikatu dla wszystkich post_type */
		if( empty( $this->args->post_type ) ){

			$this->args->setPost_type = true;

		}

	}

	private function getConfigToView(){
		
		$this->verification();
		if($this->args->setPage && $this->args->setPost_type)
			return true;
	}

	private function notice(){

		if($this->getConfigToView())
			return $this->noticeHTML();

	}

	private function noticeHTML(){

		$dismissible = ($this->args->dismissible) ? 'is-dismissible' : '';

		?>

			<div id="<?php echo $this->args->id; ?>" class="notice notice-<?php echo $this->args->type . ' ' . $dismissible; ?>">
				<p><?php echo $this->args->text; ?></p>
			</div>

		<?php

	}

	private function setArgs($args){

		$this->args = $args;

	}

}


function mti_notice( $args ){

	$defaults = array(

		'id'	=> 'mti-notice', // (string)
		'type'	=> 'info', // (string)
		'text'	=> '', // (string)
		'dismissible' => true, // (bool)
		'pages'	=> array(), // (array)
		'post_type'	=> '', // (string) (array)

	);

	$args = (object) array_merge( $defaults, $args );

	if(!$args->id || !$args->type || !$args->text || !$args->dismissible){
		return;
	}

	/* (string) id */
	if(is_array($args->id) || is_int($args->id) || is_bool($args->id)){
		$args->id = $defaults['id'];
	}
	/* (string) type */
	if(is_array($args->type) || is_int($args->type) || is_bool($args->type)){
		$args->type = $defaults['type'];
	}
	/* (string) text */
	if(is_array($args->text) || is_int($args->text) || is_bool($args->text)){
		$args->text = $defaults['text'];
	}
	/* (bool) dismissible */
	if(is_array($args->dismissible) || is_int($args->dismissible) || is_string($args->dismissible)){
		$args->dismissible = $defaults['dismissible'];
	}
	/* (array) pages */
	if(is_bool($args->pages) || is_int($args->pages) || is_string($args->pages)){
		$args->pages = $defaults['pages'];
	}
	/* (string) || (array) post-type */
	if(is_bool($args->pages) || is_int($args->pages)){
		$args->post_type = $defaults['post_type'];
	}

	
	$Mti_Notice = new Mti_Notice($args);

}

endif;
