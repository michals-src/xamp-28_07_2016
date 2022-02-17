<?php

/**
 * Edycja sekcji klasa
 *
 * Cability => edit_posts
 *
 * @subpackage Combat
 * @version  1.0.0
 * 
 * @return  editor
 */

Class editor
{

	private $user_can = false;
	private $editor_fields = '';
	private $content = '';
	private $editor_class = '';
	private $post_type = '';
	private $post_id = '';

	public function __construct($args = [], $post_meta = false)
	{
		$this->user_can = current_user_can('edit_posts');

		if(!$this->user_can)
			return;

		$this->nonce = $args['nonce'];
		$this->content = $args['tresc'];
		$this->editor_class = $$args['klasa'];
		$this->post_meta = $post_meta;
		$this->post_id = $args['id'];
		$this->post_type = $args['post_meta'];

		add_filter( 'mce_css', array($this, 'plugin_mce_css') );
	}

	public function Editor()
	{
		$this->saveContent();

		return $this->form();
	}

	public function input($args = [])
	{
					
		$this->editor_fields .= '<div class="form-group">';

		if(!empty($args['label'])){
			$this->editor_fields .= '<label class="form-label">'.$args['label'].'<label>';
		}

		$this->editor_fields .= '<input type="text" name="'.$args['nazwa'].'" value="'.$args['tresc'].'" class="form-control">';
		$this->editor_fields .= '</div>';


	}

	private function form()
	{
	?>
	
		<form action="#" method="post">
			
			<?php 

				wp_nonce_field(basename(__FILE__), $this->nonce);
				
				$args = array('media_buttons' => false);
				wp_editor($this->content, $this->editor_class, $args);
				
			?>

			<input type="submit" class="btn btn-default" name="editor-btn" value="Zapisz zmiany" />

		</form>

	<?php
	}

	private function saveContent()
	{

		if(!$_POST['editor-btn'])
			return;

		$nonce = (!empty($_POST[$this->nonce]) && wp_verify_nonce($_POST[$this->nonce], basename(__FILE__))) ? true : false;

		if(!$nonce)
			return;

		if(!$this->post_id){
			$this->post_id = wp_insert_post(array(
				'post_status' => $this->post_type
			));
		}else{
			wp_update_post();
		}


		if($this->post_meta)
		
			update_post_meta();


	}

	public function plugin_mce_css($mce_css)
	{
	
		if ( ! empty( $mce_css ) )
		$mce_css .= ',';

		$css = array(
			get_template_directory_uri() . '/css/bootstrap.min.css,',
			get_template_directory_uri() . '/css/style.css'
		);
		$css = implode(',', $css);
		$mce_css .= $css;

		return $mce_css;

	}

}