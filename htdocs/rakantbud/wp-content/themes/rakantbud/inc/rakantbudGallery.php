<?php
/**
 * Dodatek "Galeria"
 *
 * @version 1.0.0 [Wersja galerii]
 * @subpackage Rakantbud
 * @since  1.0.0 [Wersja szablonu]
 * @author  Michał Sierzputowski michal.sierzputowski@onet.pl
 */

Class RakantbudGallery{

	public function __construct(){

		add_action('admin_menu', array($this, 'admin_menu'));
		add_action('admin_enqueue_scripts', array($this, 'enqueue_scripts'));

		add_shortcode('rakantbudGaleria', array($this, 'shortcode'));

	}

	public function admin_menu()
	{

		$menu = add_menu_page( 'Galeria zdjęć', 'Galeria zdjęć', 'publish_posts', 'galeria', array($this, 'admin_page'), 'dashicons-format-gallery' );
		add_action("load-$menu", array($this, 'saveRakantbudGallery'));
	}

	public function admin_page()
	{

		wp_nonce_field(basename(__FILE__), 'rakantbudGallery_nonce');
		$post = get_posts(array('post_type' => 'rakantbudGallery', 'post_status' => 'publish'));
		$post_meta = get_post_meta($post[0]->ID, 'rakantbudGallery_Items');


		?>

		<div class="postbox" style="margin-top: 20px;">
			<div class="inside" style="padding: 25px;">
				<form action="#" method="post">
					<input type="hidden" name="dataGallery" class="imagesData">
					<div class="row">
						<div class="colg-lg-12 col-md-12 col-sm-12 col-xs-12">
							<div class="col-xs-1"><button class="btn btn-primary imgAdd"> <i class="glyphicon glyphicon-pencil" style="margin-right:10px;"></i> Dodaj zdjęcia </button></div>
							<div class="col-xs-1" style="margin-left:30px;"><input type="submit" name="savGallery" value="Zapisz zmiany" class="btn btn-warning"></div>
						</div>
						<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 container">
							<div class="text-center empty-container" style="padding:35px;">
								<h2 style="margin-bottom:5px;">Nie dodano jeszcze żadnych zdjęć</h2>
								<p style="margin-bottom:35px;">Dodaj zdjęcia do galerii zdjęć</p>
								<button class="btn btn-default imgAdd"> Dodaj zdjęcia </button>
							</div>
							<div class="text-center text-container" style="padding:35px;">
								<h2 style="margin-bottom:5px;">Galeria zdjęć</h2>
								<p style="margin-bottom:35px;">Znjadują się zdjęcia które wyświetlą się w galerii zdjęć na stronie</p>
							</div>
							<div class="images-container">
							<?php if(!empty($post_meta)): ?>
								<?php foreach ($post_meta[0] as $key => $value): ?>
									<?php 

										$attachment = wp_get_attachment_image_src($value->id, 'medium');

									?>
									<div class="col-xs-4 imageItem">
										<header class="text-right">
											<span style="padding-right:10px;display:inline-table;">Usuń obraz</span>
											<button type="button" class="close" aria-label="Close"><span aria-hidden="true">&times;</span></button>
										</header>
										<fieldset>
											<img src="<?php echo $attachment[0]; ?>" data-id="<?php echo $value->id; ?>">
										</fieldset>
									</div>

								<?php endforeach; ?>
							<?php endif; ?>
						</div>
					</div>
				</form>
			</div>
		</div>

		<?php
	}

	public function saveRakantbudGallery()
	{
		if($_POST)
		{
			$is_valid_nonce = (isset($_POST['rakantbudGallery_nonce']) && wp_verify_nonce($_POST['rakantbudGallery_nonce'], basename(__FILE__))) ? "true" : "false";

			if(!$is_valid_nonce){ return; }
			
			$data = json_decode(str_replace("\\", '', $_POST['dataGallery']));
			$get_post = get_posts(array('post_type' => 'rakantbudGallery'));
			$rakantbudGallery = array(
				'post_title' 	=> 'Galeria zdjęć',
				'post_status' 	=> 'publish',
				'post_type'		=> 'rakantbudGallery'
			);

			if(!$get_post){
				$post_id = wp_insert_post($rakantbudGallery);
			}else{
				$post_id = $get_post[0]->ID;
			}

			update_post_meta($post_id, 'rakantbudGallery_Items', $data);

			wp_redirect('#');

		}
	}

	public static function getImages()
	{
		$post = get_posts(array('post_type' => 'rakantbudGallery', 'post_status' => 'publish'));
		$post_meta = get_post_meta($post[0]->ID, 'rakantbudGallery_Items');

		return $post_meta;
	}

	/**
	 * Shortcode galerii
	 * @return @content
	 */
	public function shortcode()
	{

		$content = '<div class="portfolio-list">';
		$content .= '<div class="container">';

		$content .= '<div class="row portfolio-list-content text-center">';

		$images = self::getImages();
		if($images):
			foreach ($images[0] as $key => $value):

				$attachment = wp_get_attachment_image_src($value->id, 'large');
						
				$content .= '<div class="portfolio-item col-lg-4 col-md-4 col-sm-6 col-xs-12">';

				$content .= '<a href="'.$value->url.'" data-lightbox="podgląd">';
				$content .= '<img src="'.$attachment[0].'">';
				$content .= '</a>';
				$content .= '</div>';

			endforeach;
		else:
			$content .= '<h2> Nie dodano obazów </h2>';
		endif;

		$content .= '</div></div></div>';

		return $content;

	}

	public function enqueue_scripts()
	{
		wp_enqueue_media();
		wp_enqueue_script('bootstrap-js', get_template_directory_uri() . '/js/bootstrap.min.js', array(), '3.3.6', true);
		wp_enqueue_style('bootstrap', get_template_directory_uri() . '/css/bootstrap.customized.min.css', array(), '3.3.6', 'all');
		
		wp_enqueue_style('rakantbudGallery', get_template_directory_uri() . '/inc/css/gallery.admin.css', array(), '1.0.0', 'all');
		wp_enqueue_script('rakantbudGallery-js', get_template_directory_uri() . '/inc/js/gallery.admin.js', array(), '1.0.0', true);
		
	}

}

$galeria = new RakantbudGallery();