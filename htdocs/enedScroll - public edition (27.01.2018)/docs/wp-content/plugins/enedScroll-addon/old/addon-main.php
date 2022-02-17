<?php
/**
 * Plugin Name: enedScroll Article Builder
 * Author: Cameolon
 * Version: 0.0.1-pre_beta
 */

function es_addon_dir_path(){
	
	return plugin_dir_path(__FILE__);
}

function es_addon_dir_url(){
	
	return plugin_dir_url( __FILE__ );
}

function es_addon_assets(){
	
	global $post_type;

	if( "page" === $post_type ){

		wp_enqueue_style( 'enedscroll-addon', es_addon_dir_url() . 'css/admin_style.css', array(), null );
		wp_enqueue_script( 'jquery', 'https://ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js', array(), '3.1.0', true );
	 	wp_enqueue_script( 'enedscroll-addon', es_addon_dir_url() . 'js/admin_script.js', array(), false, true );

	}

}
add_action( 'admin_enqueue_scripts', 'es_addon_assets' );

function es_post_removeSupport(){
	remove_post_type_support( 'page', 'editor' );
}
add_action( 'init', 'es_post_removeSupport', 10 );

function es_page_meta_box( $post_type, $post ) {
    add_meta_box( 
        'enedscroll-page-builder',
        'enedScroll builder',
        'es_page_meta_box_render',
        'page',
        'normal',
        'default'
    );
}
add_action( 'add_meta_boxes', 'es_page_meta_box', 10, 2 );

function es_page_meta_box_render(){

	$ID = get_the_ID();
	$post = get_post( $ID );
	$post_meta = get_post_meta( $ID, 'es_builder_private' );

	$content_user = ( ! empty( $post->post_content ) ) ? $post->post_content : '';
	$content_private = ( ! empty( $post_meta[0] ) ) ? $post_meta[0] : '';

	//print_r($post_meta);

	?>
		<div id="output-builder" style="display: none;""><?php echo $content_user; ?></div>
		<textarea type="hidden" name="es-builder-output-user" id="es-builder-output-user"> <?php echo $content_user; ?> </textarea>
		<textarea type="hidden" name="es-builder-output-private" id="es-builder-output-private"><?php echo $content_private; ?></textarea>
		<div class="es-builder-content">
			
			<div class="es-builder-tools">
				<ul class="es-builder-tools-list">
					<li><button class="btn btn-action" id="add-article">Dodaj artykuł</button></li>
					<li><button class="btn btn-action btn-visual" id="add-row" disabled="disabled">Dodaj wiersz</button></li>
					<li><button class="btn btn-action btn-visual" id="add-column" disabled="disabled">Dodaj kolumnę</button></li>
					<li><button class="btn btn-action btn-visual" id="add-clear" disabled="disabled">Dodaj clear</button></li>
					<li><button class="btn btn-action btn-visual" id="content-edit" disabled="disabled">Edytuj zawartość</button></li>
					<li><button class="btn btn-action btn-visual"  id="class-edit" disabled="disabled">Edytuj klasy</button></li>
					<li><button class="btn btn-action btn-visual" id="remove-selected" disabled="disabled">Usuń zaznaczony element </button></li>
					<br/>
					<li><button class="btn btn-action btn-visual" id="move-before" disabled="disabled">Przenieś przed</button></li>
					<li><button class="btn btn-action btn-visual" id="move-in" disabled="disabled">Przenieś do</button></li>
					<li><button class="btn btn-action btn-visual" id="move-after" disabled="disabled">Przenieś za</button></li>
				</ul>
			</div>

			<div class="es-builder-visual" id="es-builder-visual">
				
				<?php 

					echo $content_private;

				?>

			</div>
			<!-- <article>

					<div class="cols specification">
						<div class="col-xsmall-8">
							<div class="label">Selectors</div>
							<nav class="navbar-column">
								<a href="#">Dodaj kolumnę</a>
								<a href="#">Edytuj kolumnę</a>
								<a href="#">Usuń kolumnę</a>
							</nav>
						</div>	
						<div class="col-xsmall-8 content">
							
						
								<div class="col-medium-3 col-xsmall-8" >
									 <h2>Lorem ipsum oraz inne</h2> 
									<div class="label">Trigger</div>
									<nav class="navbar-column">
										<a href="#">Dodaj kolumnę</a>
										<a href="#">Edytuj kolumnę</a>
										<a href="#">Usuń kolumnę</a>
									</nav>
								</div>
								<div class="col-medium-5 col-xsmall-8">
									<header><p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nostrum quia, deleniti suscipit velit, possimus expedita nisi dolorem, et dolore, dignissimos nam. Neque optio cumque harum vel mollitia, est facilis veritatis.</p></header>
									<div class="row">
										<p>Type <i class="lighting">Object</i></p>
									</div>				
									<div class="row">
										<p>Default <i class="lighting">100</i></p>
										<p class="label">Belongs to first item.</p>
									</div> 

									<div class="label">Opis triggera</div>
									<nav class="navbar-column">
										<a href="#">Dodaj kolumnę</a>
										<a href="#">Edytuj kolumnę</a>
										<a href="#">Usuń kolumnę</a>
									</nav>

								</div>
								<div class="col-medium-3 col-xsmall-8" >
									<div class="label">Trigger</div>
									<nav class="navbar-column">
										<a href="#">Dodaj kolumnę</a>
										<a href="#">Edytuj kolumnę</a>
										<a href="#">Usuń kolumnę</a>
									</nav>
								</div>
								<div class="col-medium-5 col-xsmall-8">
									<div class="label">Opis triggera</div>
									<nav class="navbar-column">
										<a href="#">Dodaj kolumnę</a>
										<a href="#">Edytuj kolumnę</a>
										<a href="#">Usuń kolumnę</a>
									</nav>

								</div>
							
						</div> 
					</div>

					<div class="cols">
						<div class="col-small-8">col 8</div>
					</div>
					<div class="cols">
						<div class="col-small-7">col 7</div>
						<div class="col-small-1">col 1</div>
					</div>
					<div class="cols">
						<div class="col-small-6">col 6</div>
						<div class="col-small-2">col 2</div>
					</div>
					<div class="cols">
						<div class="col-small-5">col 5</div>
						<div class="col-small-3">col 3</div>
					</div>
					<div class="cols">
						<div class="col-small-4">col 4</div>
						<div class="col-small-4">col 4</div>
					</div> 
				</article> -->

		</div>

	<?php
}

function footer_boxes(){

	global $post_type;

	if( "page" !== $post_type ){
		return;
	}
?>

<!-- <div class="es-fullwin-template-row"></div>
<div class="es-fullwin-template-editor"></div> -->

<div class="es-fullwin columns">
	<input type="hidden" id="es-element-target" value="">
	<div class="middle">
		<div class="middle-item">
			<div class="es-fullwin-content">
				<header>
					<h1>Rozmiary kolumny</h1>
				</header>
				<div class="es-fullwin-field">
					<label for="large">large</label>
					<select name="large" id="large">
						<option value="null">Wybierz rozmiar</option>
						<option value="col-large-1">1</option>
						<option value="col-large-2">2</option>
						<option value="col-large-3">3</option>
						<option value="col-large-4">4</option>
						<option value="col-large-5">5</option>
						<option value="col-large-6">6</option>
						<option value="col-large-7">7</option>
						<option value="col-large-8">8</option>
					</select>
				</div>
				<div class="es-fullwin-field">
					<label for="medium">medium</label>
					<select name="medium" id="medium">
						<option value="null">Wybierz rozmiar</option>
						<option value="col-medium-1">1</option>
						<option value="col-medium-2">2</option>
						<option value="col-medium-3">3</option>
						<option value="col-medium-4">4</option>
						<option value="col-medium-5">5</option>
						<option value="col-medium-6">6</option>
						<option value="col-medium-7">7</option>
						<option value="col-medium-8">8</option>
					</select>
				</div>
				<div class="es-fullwin-field">
					<label for="small">small</label>
					<select name="small" id="small">
						<option value="null">Wybierz rozmiar</option>
						<option value="col-small-1">1</option>
						<option value="col-small-2">2</option>
						<option value="col-small-3">3</option>
						<option value="col-small-4">4</option>
						<option value="col-small-5">5</option>
						<option value="col-small-6">6</option>
						<option value="col-small-7">7</option>
						<option value="col-small-8">8</option>
					</select>
				</div>
				<div class="es-fullwin-field">
					<label for="xsmall">xmall</label>
					<select name="xsmall" id="xsmall">
						<option value="null">Wybierz rozmiar</option>
						<option value="col-xsmall-1">1</option>
						<option value="col-xsmall-2">2</option>
						<option value="col-xsmall-3">3</option>
						<option value="col-xsmall-4">4</option>
						<option value="col-xsmall-5">5</option>
						<option value="col-xsmall-6">6</option>
						<option value="col-xsmall-7">7</option>
						<option value="col-xsmall-8">8</option>
					</select>
				</div>
				<div class="es-fullwin-field">
					<label for="ownclass">Własna klasa</label>
					<input type="text" name="ownclass" id="ownclass">
				</div>
				<div class="es-fullwin-field">
					<button class="add-column_editor">Dodaj kolumnę</button>
					<button class="es-fullwin-close">Zamknij</button>
				</div>
			</div>
		</div>
	</div>
</div>

<div class="es-fullwin class-editor">
	<div class="middle">
		<div class="middle-item">
			<div class="es-fullwin-content">
				<header> <h1>Zmień klasy</h1> </header>
				<div class="es-fullwin-field">
					<label for="selected_item_classes">Posiadane klasy elementu</label>
					<input type="text" name="exists-classes" id="exists-classes">
				</div>
				<div class="es-fullwin-field">
					<button class="class-editor_save">Zapisz</button>
					<button class="es-fullwin-close">Anuluj</button>
				</div>
			</div>
		</div>
	</div>
</div>

<div class="es-fullwin content-column">
	<input type="hidden" id="es-element-target" value="">
	<div class="middle">
		<div class="middle-item">
			<div class="es-fullwin-content">
				<header>
					<h1>Treść kolumny</h1>
				</header>
				<div class="es-fullwin-field">
					<input type="text" name="es-fullwin-column-content-title" id="es-fullwin-column-content-title">
				</div>
				<div class="es-fullwin-field">
					<?php 
						$settings = array(
						    'tinymce'       => array(
						        'setup' => 'function (ed) {
						            tinymce.documentBaseURL = "' . get_admin_url() . '";
						        }',
						    ),
						    'quicktags'     => TRUE,
						    'editor_class'  => 'frontend-es-fullwin-content-column',
						    'textarea_rows' => 25,
						    'editor_height' => 425,
						    'media_buttons' => TRUE,
						);
						wp_editor( $content, 'es-fullwin-content-column', $settings ); 
					?> 
				</div>
				<div class="es-fullwin-field">
					<button class="add-content-editor">Dodaj treść</button>
					<button class="es-fullwin-close editor-close">Zamknij</button>
				</div>
			</div>
		</div>
	</div>
</div>

<?php


}
add_action('admin_footer', 'footer_boxes'); // Fired on post edit page
// add_action('admin_footer-post.php', 'footer_boxes'); // Fired on post edit page
// add_action('admin_footer-post-new.php', 'footer_boxes'); // Fired on add new post page

function es_builder_save_page( $post_id ){
	
	//if ( wp_is_post_revision( $post_id ) )
		//return;

    /*
     * In production code, $slug should be set only once in the plugin,
     * preferably as a class property, rather than in each function that needs it.
     */
    $post_type = get_post_type($post_id);

    if ( "page" != $post_type ) return;
    if ( empty( $_POST['es-builder-output-private'] ) || empty( $_POST['es-builder-output-user'] ) ) return;

    // - Update the post's metadata.

    if ( ! empty( $_POST['es-builder-output-user'] ) ) {
    	remove_action( 'save_post', 'es_builder_save_page', 13, 2 );
    	wp_update_post( array( 'ID' => $post_id, 'post_content' => $_POST['es-builder-output-user'] ) );
    	add_action( 'save_post', 'es_builder_save_page', 13, 2 );
    }

	update_post_meta( $post_id, 'es_builder_private', $_POST['es-builder-output-private'] );


}
add_action( 'save_post', 'es_builder_save_page', 13, 2 );