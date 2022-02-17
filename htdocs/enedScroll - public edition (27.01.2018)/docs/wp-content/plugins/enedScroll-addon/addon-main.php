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
	 	
	 	wp_enqueue_style( 'fontawesome', 'https://use.fontawesome.com/releases/v5.0.2/css/all.css', array(), null );

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
	$post_meta = get_post_meta( $ID, 'es_builder_output' );
	$output = ( ! empty( $post_meta ) ) ? $post_meta : '';

	?>
		<input type="hidden" name="es-builder-output-user" id="es-builder-output-user" value='<?php echo htmlspecialchars( json_encode( $output[0] ) ); ?>'>
		<div id="es-builder-frame" class="es-builder-frame">
			
<!-- 			<div class="es-builder-tools">
				<ul class="es-builder-tools-list">
					<li><button class="btn btn-action btn-visual" id="add-column" disabled="disabled">Dodaj kolumnę</button></li>
					<li><button class="btn btn-action btn-visual" id="add-clear" disabled="disabled">Clear</button></li>
					<li><button class="btn btn-action btn-visual" id="content-edit" disabled="disabled">Edytuj</button></li>
					<li><button class="btn btn-action btn-visual"  id="class-edit" disabled="disabled">Klasy</button></li>
					<li><button class="btn btn-action btn-visual" id="remove-selected" disabled="disabled">Usuń</button></li>
					<li><button class="btn btn-action btn-visual" id="move-before" disabled="disabled">Przenieś przed</button></li>
					<li><button class="btn btn-action btn-visual" id="move-in" disabled="disabled">Przenieś do</button></li>
					<li><button class="btn btn-action btn-visual" id="move-after" disabled="disabled">Przenieś za</button></li>
				</ul>
			</div> -->
			
			<input type="hidden" name="memorizer" id="memorizer">

			<div class="es-builder-content" id="es-builder-content">
				
<!-- 				<article>
					<header>
						<div class="live-tools">
							<a href="#" data-live-action="remove">Klasy</a>
							<a href="#" data-live-action="remove">Usuń</a>
						</div>
					</header>
						<div class="item-content">
							<div class="cols">
								<header>
									<div class="live-tools">
										<a href="#" data-live-action="remove">Klasy</a>
										<a href="#" data-live-action="remove">Powiel</a>
										<a href="#" data-live-action="remove">Usuń</a>
									</div>
								</header>
								<div class="col-small-4">
									<header>
										<div class="live-tools">
											<a href="#" data-live-action="remove">Edytuj</a>
											<a href="#" data-live-action="remove">Powiel</a>
											<a href="#" data-live-action="remove">Usuń</a>
										</div>
									</header>
									<div class="column-content">
										<p>Brak zawartości</p>
									</div>
								</div>
								<div class="col-small-4">
									<header>
										<div class="live-tools">
											<a href="#" data-live-action="remove">Edytuj</a>
											<a href="#" data-live-action="remove">Powiel</a>
											<a href="#" data-live-action="remove">Usuń</a>
										</div>
									</header>
									<div class="column-content">
										<p>Brak zawartości</p>
									</div>
								</div>
							</div>
						</div>
					<footer>
						<div class="live-tools">
							<a href="#">Dodaj wiersz</a>
						</div>
					</footer>
				</article> -->

				<div class="fill-content">
					
				<?php 

					if( ! empty( $output ) ){
						
						foreach ( $output[0] as $key => $rows ) {
							
							echo '<article>';
							echo '<header><div class="live-tools"><a role="btn-action" data-ca="remove">Usuń</a><a role="btn-action" data-ca="clone">Powiel</a></div></header>';
							echo '<div class="item-content">';

							foreach ($rows as $key => $cols) {
								
								echo '<div class="' . $cols->class . '">';
								echo '<header><div id="" class="live-tools"><a role="btn-action" data-ca="change_class">Klasy</a><a role="btn-action" data-ca="add_col">Dodaj kolumnę</a><a role="btn-action" data-ca="add_break"><i class="fa fa-plus" aria-hidden="true"></i> Przerywnik</a><a role="btn-action" data-ca="clone">Powiel</a><a role="btn-action" data-ca="remove">Usuń</a></div></header>';
								echo '<div class="item-content">';

								foreach ($cols->children as $key => $properties) {

									$classes = explode( ' ', $properties->class );

									if( in_array( 'clear', $classes) ){

										echo '<div class="clear">';
										echo '<header><div id="" class="live-tools"><a role="btn-action" data-ca="change_class"><i class="fa fa-cog" aria-hidden="true"></i> Klasy</a><a role="btn-action" data-ca="remove"><i class="fa fa-trash-o" aria-hidden="true"></i> Usuń</a></div></header>';
										echo '</div>';

									}else{
										
										$content = ( '' !== $properties->content ) ? $properties->content : 'Brak zawartości';

										echo '<div class="' . $properties->class . ' column">';
										echo '<header><div id="" class="live-tools"><a role="btn-action" data-ca="change_class">Klasy</a><a role="btn-action" data-ca="edit">Edytuj</a><a role="btn-action" data-ca="clone">Powiel</a><a role="btn-action" data-ca="remove">Usuń</a></div></header>';
										echo '<div class="column-content">';
										echo '<p>' . strip_tags( $content ) . '</p>';
										echo '</div>';
										echo '</div>';

									}
								
								}

								echo '</div>';
								echo '</div>';
							
							}

							echo '</div>';
							echo '<footer><div id="" class="live-tools"><a role="btn-action" data-ca="add_row">Dodaj wiersz</a></div></footer>';
							echo '</article>';

						}
					
					}

				?>

				</div>

				<div class="empty-content center">
					<h2>Brak elementów</h2>
				</div>

				<div class="center">
					<a href="#" role="btn-action" data-ca="add_article">
						<button class="btn">Dodaj artykuł</button>
					</a>
				</div>

			</div>

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
	
	<div class="es-fullwin-modal">

		<div class="es-fullwin-titlebar">
			<h3>Dodaj kolumnę</h3>
		</div>
		
		<div class="es-fullwin-content">

			<div class="cols">
				<div class="col-xsmall-8">
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
				</div>
				<div class="col-xsmall-8">
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
				</div>
				<div class="col-xsmall-8">
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
				</div>
				<div class="col-xsmall-8">
					<div class="es-fullwin-field">
						<label for="xsmall">xsmall</label>
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
				</div>
				<div class="col-xsmall-8">
					<div class="es-fullwin-field">
						<label for="ownclass">Własna klasa</label>
						<input type="text" name="ownclass" id="ownclass">
					</div>
				</div>
			</div>
		</div>

		<div class="es-fullwin-footer">
			<button class="add-column_editor">Dodaj kolumnę</button>
			<button class="es-fullwin-close">Zamknij</button>
		</div>
	
	</div>
	<div class="es-fullwin-back"></div>

</div>

<div class="es-fullwin class-editor">
	
	<div class="es-fullwin-modal">
		<div class="es-fullwin-titlebar">
			<h3>Zmiana klas elementu</h3>
		</div>
		
		<div class="es-fullwin-content">
			
			<div class="es-fullwin-field">
				<label for="selected_item_classes">Aktualne klasy elementu</label>
				<input type="text" name="exists-classes" id="exists-classes">
			</div>

		</div>

		<div class="es-fullwin-footer">
			<button class="class-editor_save">Zapisz</button>
			<button class="es-fullwin-close">Anuluj</button>
		</div>
	</div>

	<div class="es-fullwin-back"></div>

</div>

<div class="es-fullwin content-column">
	<div class="es-fullwin-modal">
	
		<div class="es-fullwin-titlebar">
			<h3>Treść kolumny</h3>
		</div>

		<div class="es-fullwin-content">
			<?php 
				$settings = array(
				    'tinymce'       => array(
				        'setup' => 'function (ed) {
				            tinymce.documentBaseURL = "' . get_admin_url() . '";
				        }',
				    ),
				    'quicktags'     => TRUE,
				    'editor_class'  => 'frontend-es-fullwin-content-column',
				    'textarea_rows' => '100',
				    'editor_height' => '375px',
				    'media_buttons' => TRUE,
				);
				wp_editor( $content, 'es-fullwin-content-column', $settings ); 
			?> 
		</div>

		<div class="es-fullwin-footer">
			<button class="add-content-editor">Dodaj treść</button>
			<button class="es-fullwin-close editor-close">Zamknij</button>
		</div>
	
	</div>

	<div class="es-fullwin-back"></div>
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
    if ( empty( $_POST['es-builder-output-user'] ) ) return;

    // - Update the post's metadata.

    // if ( ! empty( $_POST['es-builder-output-user'] ) ) {
    // 	remove_action( 'save_post', 'es_builder_save_page', 13, 2 );
    // 	wp_update_post( array( 'ID' => $post_id, 'post_content' => $_POST['es-builder-output-user'] ) );
    // 	add_action( 'save_post', 'es_builder_save_page', 13, 2 );
    // }

    $item_structure_clean = stripcslashes( $_POST['es-builder-output-user'] );
    $item_structure_array = json_decode( $item_structure_clean );

	update_post_meta( $post_id, 'es_builder_output', $item_structure_array );


}
add_action( 'save_post', 'es_builder_save_page', 13, 2 );


function content_filter( $content ){

	if( ! in_array( get_post_type() , [ "post", "page" ]) ){
		return $content;
	}

	$es_builder_output = get_post_meta( get_the_ID(), 'es_builder_output' );

	if( empty( $es_builder_output ) ){
		return $content;
	}

	foreach ( $es_builder_output[0] as $key => $rows ) {
		
		echo '<article es-builder-element="">';

		foreach ($rows as $key => $cols) {
			
			echo '<div class="' . $cols->class . '">';

			foreach ($cols->children as $key => $properties) {
			
				echo '<div class="' . $properties->class . '">';
				if( ! empty( $properties->content ) ){
					echo do_shortcode( $properties->content );
				}
				echo '</div>';
			
			}

			echo '</div>';
		
		}

		echo '</article>';

	}

	return;

}
add_filter( 'the_content', 'content_filter', 10, 2 );