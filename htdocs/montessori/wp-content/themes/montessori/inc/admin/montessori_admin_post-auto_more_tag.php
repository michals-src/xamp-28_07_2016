<?php
/**
 * Funkcje dotyczące postów w panelu administracyjnym
 *
 * @usage Admin
 * @package Montessori
 */
namespace Montessori\Admin;

use Montessori\Admin\Settings\DefOptions;

Class mti_post_more_tag extends DefOptions{

	/**
	 * @var boolean
	 */
	protected $is_active;

	/**
	 * @var int
	 */
	protected $words_limit;

	/**
	 * @var int
	 */
	protected $has_notice;

	/**
	 * @var object
	 */
	static $instance;

	public function __construct(){

		parent::__construct();

		$this->is_active = ( get_option( 'montessori_post_more_tag' ) ) ? get_option( 'montessori_post_more_tag' ) : $this->getOption( 'montessori_post_more_tag' );
		$this->words_limit = ( get_option( 'montessori_post_more_tag_int' ) ) ? get_option( 'montessori_post_more_tag_int' ) : $this->getOption( 'montessori_post_more_tag_int' );
		$this->has_notice = ( get_option( 'montessori_post_more_info' ) ) ? get_option( 'montessori_post_more_info' ) : $this->getOption( 'montessori_post_more_info' );


		if( ! empty( $this->is_active ) ){
			$this->actions();
		}

	}

	public static function getInstance(){

		if( self::$instance === null ) self::$instance = new Self;

		return self::$instance;

	}

	protected function actions(){

		add_filter( 'wp_insert_post_data' , array($this, 'post_more_tage_filter') , 99, 2 );

		if( ! empty( $this->has_notice ) ){
			$this->showNotice();
		}

	}

	/* Dodanie komunikatu przy tworzeniu i edycji postu */
	protected function showNotice(){

		mti_notice( array(
			'id'	=> 'post-more-info',
			'text'	=> sprintf('Odnośnik <strong>"%1$s"</strong> zostanie umieszczony po %2$s znakach automatycznie.', 'czytaj więcej', $this->words_limit),
			'pages'	=> array('post.php', 'post-new.php'),
			'post_type'	=> 'post'
		) );

	}

	/* Dodanie "czytaj więcej" jeżeli wartość z post_meta o kluczu "has_more" ma wartość false */
	public function post_more_tage_filter( $data, $postarr ){

		/* ID postu */
		$post_ID = $postarr['post_ID'];
		
		/* Odczytanie wartości dla _mti_has_more z post_meta edytowanego artykułu */
		/**
		 * (bool) _mti_has_more
		 * true - tag został dodany
		 * false - tag nie został dodany
		 */
		$meta = get_post_meta($post_ID, '_mti_has_more');


		$post_content = $data['post_content'];
		$new_content = $post_content;

		$content = preg_replace('/\s+/', '', $post_content);
		$chars_count = strlen($content);
		$more = $this->words_limit;

		$find_more_tag = preg_match('|<!--more-->|i', $post_content);

		$post_types = array('post');

		if((in_array($data['post_type'], $post_types) && empty($meta) && empty($find_more_tag)) || (in_array($data['post_type'], $post_types) && empty($find_more_tag) && !empty($meta))):

			if($more < $chars_count){

				/* Jeżeli jest rekord true dla _mti_has_more, a w artykule nie ma znacznika "more" usuwa stary rekord */
				if(empty($find_more_tag) && !empty($meta)){
					delete_post_meta($post_ID, '_mti_has_more');
				}

				$new_content = mb_substr($post_content, 0, $more) . '<!--more-->' . mb_substr($post_content, $more);
				update_post_meta($post_ID, '_mti_has_more', true);

			}

			$data['post_content'] = $new_content;

		endif;

		return $data;

	}

}


mti_post_more_tag::getInstance();