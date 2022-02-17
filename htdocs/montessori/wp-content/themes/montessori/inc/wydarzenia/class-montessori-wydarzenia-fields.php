<?php

/**
 * Meta boxes
 */

namespace Montessori;

use Montessori\WydarzeniaPost;
use Montessori\WydarzeniaValues;

Class WydarzeniaFields{


	protected $postType;

	protected $album;


	public function __construct(){

		$this->postType = WydarzeniaPostType::getName();

	}

	public function getActions(){

		if(!empty($this->postType))

		add_action( 'init', array( $this, 'start_session' ) );

		add_action('add_meta_boxes', array($this, 'register_meta_box'));

		add_action('save_post', array($this, 'save_meta_box'), 10, 2);

		add_filter( 'post_row_actions', array( $this, 'remove_actions' ), 10, 2 );

		add_filter('manage_edit-' . $this->postType . '_columns', array( $this, 'new_columns' ));
		add_action( 'manage_' . $this->postType . '_posts_custom_column', array( $this, 'manage_columns' ), 10, 2 );

		add_action( 'admin_head', array( $this, 'showNotice' ) );

	}

	public function register_meta_box(){

		add_meta_box( 'event-date-box', 'Data wydarzenia', array($this, 'meta_box_callback'), $this->postType, 'side', 'high' );		

	}

	public function meta_box_callback( $post ){

		$event_ID = $post->ID;

		$event = new WydarzeniaValues( $event_ID );

		$eventDate = $event->getDate();
		$eventSettings = $event->getSettings();

		wp_nonce_field( basename(__FILE__), 'montessori-wydarzenia-nonce' );

	?>
			
		<label>Data wydarzenia</label>
		<input type="date" name="event-date-field" id="event-date-field" <?php echo ( ! empty( $eventDate ) ) ? 'value="' . $eventDate . '"' : '' ; ?> />
		<br/>
		<br/>
		<label class="checkbox-inline">
		  <input type="checkbox" name="event-shortDate" id="event-shortDate" <?php echo ( ! empty( $eventSettings['shortDate'] ) ) ? 'checked' : '' ; ?> > Nie pokazuj dnia daty wydarzenia
		</label>

	<?php

	}

	public function save_meta_box( $post_ID, $post ){

		$is_autosave = wp_is_post_autosave( $post_ID );
		$is_revision = wp_is_post_revision( $post_ID );
		$is_valid_nonce = ( ! empty ( $_POST['montessori-wydarzenia-nonce'] ) && wp_verify_nonce( $_POST['montessori-wydarzenia-nonce'], basename(__FILE__) ) ) ? true : false;

		$has_date = ( ! empty( $_POST['event-date-field'] ) ) ? $_POST['event-date-field'] : false;		
		$checkbox = ( ! empty( $_POST['event-shortDate'] ) ) ? true : false;

		if( $is_autosave || $is_revision || ! $is_valid_nonce){
			return;
		}

		if( ! $has_date ){

			$_SESSION['event-notice:error'] = true;

			return;

		}

		$settings = array(
			'shortDate'	=> $checkbox
		);

		update_post_meta( $post_ID, WydarzeniaPost::getMetaName()[0], $has_date );
		update_post_meta( $post_ID, WydarzeniaPost::getMetaName()[1], $settings );

	}

	public function remove_actions( $actions ){

		global $post;
	    
	    if( $post->post_type === $this->postType ) {

			unset( $actions['view'] );
			unset( $actions['inline hide-if-no-js'] );

		}

	    return $actions;

	}


	public function new_columns( $gallery_columns ) {
	    $columns['cb'] = '<input type="checkbox" />';
	    $columns['title'] = 'Tytuł';
	    $columns['event_date'] = 'Data wydarzenia';
	    $columns['date'] = 'Data dodania';
	 
	    return $columns;
	}


	public function manage_columns( $column, $post_id ) {
		
		switch ($column) {
			case 'event_date':
				
				$event = new WydarzeniaValues( $post_id );

				$time = strtotime( $event->getDate() );

				$timezone = get_option( 'timezone_string' ) ? get_option( 'timezone_string' ) : date_default_timezone_get();

				date_default_timezone_set( $timezone );

				echo date_i18n('F d, Y', $time);

			break;
		}

	}

	public function start_session(){

		if( ! session_id() )

		session_start();

	}

	public function showNotice(){

		if( ! empty( $_SESSION['event-notice:error'] ) ){
			
			mti_notice(
				array(
					'id'	=> 'wydarzenia-powiadomienie',
					'type'	=> 'error',
					'text'	=> 'Nie dodano daty wydarzenia',
					'dismissible' => true,
					'pages'	=> array('post.php', 'post-new.php'),
					'post_type'	=> $this->postType
				)
			);

			unset($_SESSION['event-notice:error']);

		}

	}

}