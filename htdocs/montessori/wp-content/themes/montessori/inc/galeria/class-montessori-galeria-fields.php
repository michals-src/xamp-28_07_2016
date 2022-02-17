<?php

/**
 * Meta boxes
 */

namespace Montessori;

use Montessori\GaleriaAlbum;
use Montessori\GaleriaPost;

Class GaleriaFields extends GaleriaAlbum{


	protected $postType;

	protected $album;


	public function __construct(){

		$this->postType = GaleriaPostType::getName();

	}

	public function getActions(){

		if(!empty($this->postType))

		add_action('add_meta_boxes', array($this, 'register_meta_box'));

		add_action('save_post', array($this, 'save_meta_box'), 10, 2);

		add_filter( 'post_row_actions', array( $this, 'remove_actions' ), 10, 2 );

		add_filter('manage_edit-' . $this->postType . '_columns', array( $this, 'new_columns' ));
		add_action( 'manage_' . $this->postType . '_posts_custom_column', array( $this, 'manage_columns' ), 10, 2 );
	}

	public function register_meta_box(){

		add_meta_box( 'gallery-img-box', 'Galeria', array($this, 'meta_box_callback'), $this->postType, 'normal', 'high' );	

		add_meta_box( 'gallery-img-thumbnail-box', 'Miniaturka albumu', array($this, 'meta_box_thumbnail'), $this->postType, 'side' );

	}

	public function meta_box_callback( $post ){

		$album_ID = $post->ID;
		$this->album = new GaleriaAlbum( $album_ID );

		$hasContent = ( $this->album->Exists() ) ? 'block' : 'none';
		$contentNone = ( ! $this->album->Exists() ) ? 'block' : 'none';

	?>

		<div class="entry-montessori-box">
		
			<input type="hidden" name="montessori-galeria-hidden" class="montessori-galeria-hidden" value="<?php echo str_replace('"', '', json_encode( (!empty($this->album->getImages()[0]) ? $this->album->getImages()[0] : []) ) ); ?>">
			
			<?php wp_nonce_field( basename(__FILE__), 'montessori-galeria-nonce' ); ?>

			<div class="entry-content" style="display: <?php echo $hasContent; ?>">
				<header>

					<div class="item">
						<button id="new-imgs-add-btn" class="button-primary"> Dodaj nowe zdjęcia </button>
					</div>
					<div class="item">
						<input type="checkbox" name="image-as-first" class="image-as-first" checked>
						<span> Dodaj nowe zdjęcie jako pierwsze </span>
					</div>
					<div class="item">
						<strong><?php echo $this->album->getCount() ?></strong> zdjęć w albumie
					</div>

				</header>
				<div class="entry-content-box entry-content-images">
				<?php 
					if(!empty($this->album->getImages())){

						$images = $this->album->getImages()[0];

						foreach ($images as $key => $image) {

						  $img = $this->album->getAttachment( $image );

						  if(!empty($img)):

						  $image = str_replace( '>', 'data-id="' . $image .'" data-medium="' . wp_get_attachment_image_src($image, 'medium')[0] . '">', $img);

						  ?>
							
							<picture>
								<header>
									<span id="img-prev" class="img-prev dashicons dashicons-eye" title="Podgląd zdjęcia" alt="Podgląd"> podgląd </span>
									<span id="img-delete" class="img-delete dashicons dashicons-no" title="Usuń zdjęcie" alt="Usuń"> usuń </span>
								</header>
								<?php echo $image; ?>
							</picture>		

						  <?php

						  endif;

						}

					}
				?>

				</div>
			</div>

			<div class="entry-content-box entry-content-none" style="display: <?php echo $contentNone; ?>">
				<center>

					<h2>Nie dodano żadnych zdjęć</h2>
					<h4> do albumu <?php echo $this->album->getTitle(); ?></h4>
					<button id="imgs-add-btn" class="button"> Dodaj zdjęcia </button>

				</center>
			</div>

		</div>

	<?php

	}

	public function meta_box_thumbnail( $post ){

		$album_ID = $post->ID;
		$this->album = new GaleriaAlbum( $album_ID );

		$thumbnail = $this->album->thumbnail();
		
		echo '<div style="padding: 25px;"><center>';

		if( ! empty( $thumbnail )){

			echo $thumbnail;

		} else {

			echo ' Brak miniaturki ';

		}

		echo '</center></div>';

	}

	public function save_meta_box( $post_ID, $post ){

		$is_autosave = wp_is_post_autosave( $post_ID );
		$is_revision = wp_is_post_revision( $post_ID );
		$is_valid_nonce = ( !empty( $_POST['montessori-galeria-nonce'] ) && wp_verify_nonce( $_POST['montessori-galeria-nonce'], basename(__FILE__) ) ) ? true : false;
		$has_data = (!empty($_POST['montessori-galeria-hidden'])) ? $_POST['montessori-galeria-hidden'] : false;

		if( $is_autosave || $is_revision || ! $is_valid_nonce || !$has_data){
			return;
		}

		$images = json_decode(stripcslashes($has_data));

		update_post_meta( $post_ID, GaleriaPost::getMetaName(), $images );

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
	    $columns['count_images'] = 'Ilość zdjęc';
	    $columns['album_thumbnail'] = 'Miniaturka';
	    $columns['date'] = 'Data';
	 
	    return $columns;
	}


	public function manage_columns( $column, $post_id ) {
		
		$this->album = new GaleriaAlbum( $post_id );

		switch ($column) {
			case 'count_images':
				
				echo "<b>" . $this->album->getCount() . "</b>";

			break;
			case 'album_thumbnail':
				
				echo "<b>" . $this->album->thumbnail() . "</b>";
				
			
			break;
		}

	}

}