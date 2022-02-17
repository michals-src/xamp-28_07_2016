<?php

/**
 * Meta boxes
 */

namespace Montessori;

use Montessori\TabelaValues;
use Montessori\TabelaPost;

Class TabelaFields{


	protected $postType;

	protected $table;


	public function __construct(){

		$this->postType = TabelaPostType::getName();

	}

	public function getActions(){

		if(!empty($this->postType))

		add_action('add_meta_boxes', array($this, 'register_meta_box'));

		add_action('admin_footer', array($this, 'modals'));

		// add_action('save_post', array($this, 'save_meta_box'), 10, 2);

		// add_filter( 'post_row_actions', array( $this, 'remove_actions' ), 10, 2 );

		// add_filter('manage_edit-' . $this->postType . '_columns', array( $this, 'new_columns' ));
		// add_action( 'manage_' . $this->postType . '_posts_custom_column', array( $this, 'manage_columns' ), 10, 2 );
	}

	public function register_meta_box(){

		add_meta_box( 'table-type-box', 'Rodzaj tabeli', array($this, 'meta_box_callback_1'), $this->postType, 'normal', 'high' );		

		// add_meta_box( 'gallery-img-thumbnail-box', 'Miniaturka albumu', array($this, 'meta_box_thumbnail'), $this->postType, 'side' );

	}

	public function meta_box_callback_1( $post ){

		$table_ID = $post->ID;
		$this->table = new TabelaValues( $table_ID );

		$hasContent = ( $this->table->Exists() ) ? 'block' : 'none';
		$contentNone = ( ! $this->table->Exists() ) ? 'block' : 'none';

	?>

		<div class="entry-montessori-box">
			
			<?php wp_nonce_field( basename(__FILE__), 'montessori-table_type-nonce' ); ?>

			<div class="entry-content" style="display: <?php echo $hasContent; ?>">
				<div class="entry-content-box entry-current-content">
				
					<header>
						<h2>Edytor tabeli</h2>
					</header>

					<div class="entry-notice">
							
							<div class="message">
								<p>Aby zaznaczyć / odznaczyć komórkę należy na nią kliknąć.</p>
							</div>
							<div class="message">
								<p>Aby edytować treść komórki należy ją zaznaczyć i kliknąć przycisk <strong>Edycja komórki</strong>.</p>
							</div>

					</div>

					<div class="table-content"></div>


				</div>
				<div class="entry-table-editor">

					<div class="options-field btn-actions">

						<div class="floor">

							<h4>Ustawienia komórki tabeli</h4>
							<?php 
								$ceilContentEditor = json_encode(array( 'oneItem' ), JSON_UNESCAPED_SLASHES);
								$ceilSettings = json_encode(array( 'all' ), JSON_UNESCAPED_SLASHES);
								$ceilMerge = json_encode(array( 'join' ), JSON_UNESCAPED_SLASHES);
								$ceilDelete = json_encode(array( 'all' ), JSON_UNESCAPED_SLASHES);

								$rowDelete = json_encode(array( 'isRow', 'oneRow' ), JSON_UNESCAPED_SLASHES);
								$addrowup = json_encode(array( 'oneRow' ), JSON_UNESCAPED_SLASHES);
								$addrowdown = json_encode(array( 'oneRow' ), JSON_UNESCAPED_SLASHES);
							?>
							<div class="item"> <button class="button" data-modal="ceilContentEditor" data-et='<?php echo $ceilContentEditor; ?>'> <span class="dashicons dashicons-edit"></span> Edycja komórki </button> </div>
							<div class="item"> <button class="button" data-et='<?php echo $ceilSettings; ?>'> <span class="dashicons dashicons-write-blog"></span>  Właściwości komórki </button> </div>
							<div class="item"> <button class="button" data-event="mergecells" data-et='<?php echo $ceilMerge; ?>'> <span class="dashicons dashicons-admin-post"></span>  Scal komórki </button> </div>
							<div class="item"> <button class="button" data-event="deletecells" data-et='<?php echo $ceilDelete; ?>'> <span class="dashicons dashicons-no"></span> Usuń komórkę </button> </div>

						</div>

						<div class="floor">

							<h4>Ustawienia wiersza tabeli</h4>
							<div class="item"> <button class="button"  data-event="deleterows" data-et='<?php echo $rowDelete; ?>'> Usuń wiersz </button> </div>
							<div class="item"> <button class="button"  data-event="addrowup" data-et='<?php echo $addrowup; ?>'> Dodaj wiersz powyżej </button> </div>
							<div class="item"> <button class="button"  data-event="addrowdown" data-et='<?php echo $addrowdown; ?>'> Dodaj wiersz poniżej </button> </div>

						</div>

						<div class="floor">

							<h4>Ustawienia kolumny</h4>
							<div class="item"> <button class="button"> Usuń kolumnę </button> </div>

						</div>

					</div>

				</div>
			</div>

			<div class="entry-content-box entry-content-none" style="display: <?php echo $contentNone; ?>">
				<center>
					
					<div class="icon-lg"><span class="dashicons dashicons-warning"></span></div>
					<h2>Utwórz tabelę</h2>
					<h4>Nie dodano jeszcze tabeli</h4>
					<button id="table-add-btn" class="button" data-modal="creationTableModal"> <span class="dashicons dashicons-plus"></span> Utwórz tabelę </button>

				</center>
			</div>

		</div>

	<?php

	}

	public function ceilContentEditorModal(){

		$editor_id = 'ceilContent';
		$settings = array(  'media_buttons' => true,
				'textarea_name' => 'message', 
				'editor_height' => '250',
				'teeny' => true,
				'editor_class' => 'ceilContent-textarea',
				'tinymce' => array('resize' => false) );
		wp_editor( '', $editor_id, $settings );

		?>

		<div class="form-field">
			<button id="advance-content-modal_btn" class="modal-save button button-primary button-large" data-modal-submit="advance-content">Zmień treść</button>
		</div>

		<?php

	}

	public function createTableModal(){
		?>

			<form action="#">

					<div class="form-field">
						<h2>Ilość kolumn</h2>
						<select name="rows-select" id="setRows" class="form-property" style="width: 100%:">
							<option value="1">1</option>
							<option value="2">2</option>
							<option value="3">3</option>
							<option value="4">4</option>
							<option value="5" selected>5</option>
							<option value="6">6</option>
							<option value="7">7</option>
						</select>
					</div>
					
					<div class="form-field">
						<h2>Ilość komórek</h2>
						<select name="col-select" id="setCol" class="form-property" style="width: 100%:">
							<option value="1">1</option>
							<option value="2">2</option>
							<option value="3">3</option>
							<option value="4">4</option>
							<option value="5">5</option>
							<option value="6" selected>6</option>
							<option value="7">7</option>
							<option value="8">8</option>
							<option value="9">9</option>
						</select>
					</div>
					
					<div class="form-field">
						<button id="create-table-modal_btn" class="modal-save button button-primary button-large" data-modal-submit="create-table">Utwórz tabelę</button>
					</div>
					
			</form>

		<?php
	}

	public function modals(){
		
		new Modal( array(

			'id'	=> 'creationTableModal',
			'container_id'	=> 'createTable',
			'title'	=> 'Utwórz tabelę',
			'modal_class'	=> false,
			'modal_container_class'	=> false,
			'callback'	=> array($this, 'createTableModal')

		) );
		
		new Modal( array(

			'id'	=> 'ceilContentEditor',
			'container_id'	=> 'ceilContentEditor',
			'title'	=> 'Edycja komórki',
			'modal_class'	=> false,
			'modal_container_class'	=> false,
			'callback'	=> array($this, 'ceilContentEditorModal')

		) );

	}


	// public function meta_box_thumbnail( $post ){

	// 	$album_ID = $post->ID;
	// 	$this->album = new GaleriaAlbum( $album_ID );

	// 	$thumbnail = $this->album->thumbnail();
		
	// 	echo '<div style="padding: 25px;"><center>';

	// 	if( ! empty( $thumbnail )){

	// 		echo $thumbnail;

	// 	} else {

	// 		echo ' Brak miniaturki ';

	// 	}

	// 	echo '</center></div>';

	// }

	// public function save_meta_box( $post_ID, $post ){

	// 	$is_autosave = wp_is_post_autosave( $post_ID );
	// 	$is_revision = wp_is_post_revision( $post_ID );
	// 	$is_valid_nonce = ( !empty( $_POST['montessori-galeria-nonce'] ) && wp_verify_nonce( $_POST['montessori-galeria-nonce'], basename(__FILE__) ) ) ? true : false;
	// 	$has_data = (!empty($_POST['montessori-galeria-hidden'])) ? $_POST['montessori-galeria-hidden'] : false;

	// 	if( $is_autosave || $is_revision || ! $is_valid_nonce || !$has_data){
	// 		return;
	// 	}

	// 	$images = json_decode(stripcslashes($has_data));

	// 	update_post_meta( $post_ID, GaleriaPost::getMetaName(), $images );

	// }

	// public function remove_actions( $actions ){

	// 	global $post;
	    
	//     if( $post->post_type === $this->postType ) {

	// 		unset( $actions['view'] );
	// 		unset( $actions['inline hide-if-no-js'] );

	// 	}

	//     return $actions;

	// }


	// public function new_columns( $gallery_columns ) {
	//     $columns['cb'] = '<input type="checkbox" />';
	//     $columns['title'] = 'Tytuł';
	//     $columns['count_images'] = 'Ilość zdjęc';
	//     $columns['album_thumbnail'] = 'Miniaturka';
	//     $columns['date'] = 'Data';
	 
	//     return $columns;
	// }


	// public function manage_columns( $column, $post_id ) {
		
	// 	$this->album = new GaleriaAlbum( $post_id );

	// 	switch ($column) {
	// 		case 'count_images':
				
	// 			echo "<b>" . $this->album->getCount() . "</b>";

	// 		break;
	// 		case 'album_thumbnail':
				
	// 			echo "<b>" . $this->album->thumbnail() . "</b>";
				
			
	// 		break;
	// 	}

	// }

}