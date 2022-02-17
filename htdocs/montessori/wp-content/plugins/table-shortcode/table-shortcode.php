<?php 
/**
 * Plugin Name: Table Shortcode
 * Plugin URI: http://pluginlyspeaking.com/plugins/table-shortcode/
 * Description: Build your table, select a pre-built layout and display it thanks to a shortcode.
 * Author: PluginlySpeaking
 * Version: 1.1
 * Author URI: http://www.pluginlyspeaking.com
 * License: GPL2
 */

add_action( 'wp_enqueue_scripts', 'psts_add_script' );

function psts_add_script() {
	wp_enqueue_style( 'psts_css', plugins_url('css/psts.css', __FILE__));
	wp_enqueue_script('jquery');	
}

// Enqueue admin styles
add_action( 'admin_enqueue_scripts', 'psts_add_admin_style' );
function psts_add_admin_style() {
	wp_enqueue_style( 'psts_admin_css', plugins_url('css/psts_admin.css', __FILE__));
}

// Check for the PRO version
add_action( 'admin_init', 'psts_free_pro_check' );
function psts_free_pro_check() {
    if (is_plugin_active('pluginlyspeaking-tableshortcode-pro/pluginlyspeaking-tableshortcode-pro.php')) {

        function my_admin_notice(){
        echo '<div class="updated">
                <p><strong>PRO</strong> version is activated.</p>
              </div>';
        }
        add_action('admin_notices', 'my_admin_notice');

        deactivate_plugins(__FILE__);
    }
}

function psts_create_type() {
  register_post_type( 'psts_type',
    array(
      'labels' => array(
        'name' => 'Table Shortcode',
        'singular_name' => 'Table Shortcode'
      ),
      'public' => true,
      'has_archive' => false,
      'hierarchical' => false,
      'supports'           => array( 'title' ),
      'menu_icon'    => 'dashicons-plus',
    )
  );
}

add_action( 'init', 'psts_create_type' );


function psts_admin_css() {
    global $post_type;
    $post_types = array( 
                        'psts_type',
                  );
    if(in_array($post_type, $post_types))
    echo '<style type="text/css">#edit-slug-box, #post-preview, #view-post-btn{display: none;}</style>';
}

function psts_remove_view_link( $action ) {

    unset ($action['view']);
    return $action;
}

add_filter( 'post_row_actions', 'psts_remove_view_link' );
add_action( 'admin_head-post-new.php', 'psts_admin_css' );
add_action( 'admin_head-post.php', 'psts_admin_css' );

function psts_check($cible,$test){
  if($test == $cible){return ' checked="checked" ';}
}

add_action('add_meta_boxes','psts_init_settings_metabox');

function psts_init_settings_metabox(){
  add_meta_box('psts_settings_metabox', 'Settings', 'psts_add_settings_metabox', 'psts_type', 'side', 'high');
}

function psts_add_settings_metabox($post){
	
	$prefix = '_psts_';
	
	$location_headers = get_post_meta($post->ID, $prefix.'location_headers',true);
	$border  = get_post_meta($post->ID, $prefix.'border',true);	
	?>
	<table class="psts_table">
		<tr>
			<td colspan="2"><label for="location_headers">Headers location : </label>
				<select name="location_headers" class="psts_select_100">
					<option <?php selected( $location_headers, "none"); ?> id="no_header" value="none">None</option>
					<option <?php selected( $location_headers, "horizontal");  ?> id="only_horizontal_header" value="horizontal">Horizontal</option>
					<option <?php selected( $location_headers, "vertical");  ?> id="only_vertical_header" value="vertical">Vertical</option>
					<option <?php selected( $location_headers, "both");  ?> id="both_header" value="both">Horizontal + Vertical</option>
				</select>
			</td>
		</tr>
		<tr>
			<td><label for="border">Display borders : </label></td>
			<td><input type="radio" id="border_yes" name="border" value="yes" <?php echo (empty($round_corner)) ? '' : psts_check($border,'yes'); ?>> Yes <input type="radio" id="border_no" name="border" value="no" <?php echo (empty($border)) ? 'checked="checked"' : psts_check($border,'no'); ?>> No<br></td>
		</tr>
	</table>
	
	<?php 
	
}

add_action('add_meta_boxes','psts_init_advert_metabox');

function psts_init_advert_metabox(){
  add_meta_box('psts_advert_metabox', 'Upgrade to PRO Version', 'psts_add_advert_metabox', 'psts_type', 'side', 'low');
}

function psts_add_advert_metabox($post){	
	?>
	
	<ul style="list-style-type:disc;padding-left:20px;">
		<li>Unlimited nb of row</li>
		<li>Unlimited nb of column</li>
		<li>More than 30+ layouts</li>
		<li>Use your theme's font</li>
		<li>Highlight your cells on hover</li>
		<li>Device restriction</li>
		<li>User restriction</li>
		<li>And more...</li>
	</ul>
	<a style="text-decoration: none;display:inline-block; background:#33b690; padding:8px 25px 8px; border-bottom:3px solid #33a583; border-radius:3px; color:white;" target="_blank" href="http://pluginlyspeaking.com/plugins/table-shortcode/">See all PRO features</a>
	<span style="display:block;margin-top:14px; font-size:13px; color:#0073AA; line-height:20px;">
		<span class="dashicons dashicons-tickets"></span> Code <strong>TS10OFF</strong> (10% OFF)
	</span>
	<?php 
	
}

add_action('add_meta_boxes','psts_init_layout_metabox');

function psts_init_layout_metabox(){
  add_meta_box('psts_layout_metabox', 'Select your Table Layout', 'psts_add_layout_metabox', 'psts_type', 'normal');
}

function psts_add_layout_metabox($post){
	
	$prefix = '_psts_';
	$type_layout = get_post_meta($post->ID, $prefix.'type_layout',true);	
	$table_layout = get_post_meta($post->ID, $prefix.'table_layout',true);	
	
	?>
	
	<div id="psts_layout_list">
		<label id="type_layout_label" class="psts_label_title" for="type_layout">Select your layout category  </label><br />
		<select id="type_layout_select" name="type_layout" class="psts_select_25">
			<option <?php selected( $type_layout, "full_colored"); ?> id="type_layout_1" value="full_colored">Full Colored</option>
			<option <?php selected( $type_layout, "standard");  ?> id="type_layout_2" value="standard">Standard</option>
			<option <?php selected( $type_layout, "light_colored");  ?> id="type_layout_3" value="light_colored">Light Colored</option>
		</select>
		
		<h5 class="psts_admin_title">Choose your layout</h5>
		
		<ul id="custom_layout_list_1" class="psts_w_li_31 psts_ul_layout" style="display: none;">
			<li>
				<input type="radio" id="table_layout_11" name="table_layout" value="psts_layout_11" <?php echo (empty($table_layout)) ? 'checked="checked"' : psts_check($table_layout,'psts_layout_11'); ?>>
				<label for="table_layout_11">
					<img src="<?php echo plugins_url('img/table_layout/layout_11.PNG', __FILE__); ?>" > 
				</label>
			</li>
			<li>
				<input type="radio" id="table_layout_12" name="table_layout" value="psts_layout_12" <?php echo (empty($table_layout)) ? '' : psts_check($table_layout,'psts_layout_12'); ?>>
				<label for="table_layout_12">
					<img src="<?php echo plugins_url('img/table_layout/layout_12.PNG', __FILE__); ?>" > 
				</label>
			</li>
			<li>
				<input type="radio" id="table_layout_13" name="table_layout" value="psts_layout_13" <?php echo (empty($table_layout)) ? '' : psts_check($table_layout,'psts_layout_13'); ?>>
				<label for="table_layout_13">
					<img src="<?php echo plugins_url('img/table_layout/layout_13.PNG', __FILE__); ?>" > <br />
				</label>
			</li>
		</ul>
		
		<ul id="custom_layout_list_2" class="psts_w_li_31 psts_ul_layout" style="display: none;">
			<li>
				<input type="radio" id="table_layout_21" name="table_layout" value="psts_layout_21" <?php echo (empty($table_layout)) ? 'checked="checked"' : psts_check($table_layout,'psts_layout_21'); ?>>
				<label for="table_layout_21">
					<img src="<?php echo plugins_url('img/table_layout/layout_21.PNG', __FILE__); ?>" > 
				</label>
			</li>
			<li>
				<input type="radio" id="table_layout_22" name="table_layout" value="psts_layout_22" <?php echo (empty($table_layout)) ? '' : psts_check($table_layout,'psts_layout_22'); ?>>
				<label for="table_layout_22">
					<img src="<?php echo plugins_url('img/table_layout/layout_22.PNG', __FILE__); ?>" > 
				</label>
			</li>
			<li>
				<input type="radio" id="table_layout_23" name="table_layout" value="psts_layout_23" <?php echo (empty($table_layout)) ? '' : psts_check($table_layout,'psts_layout_23'); ?>>
				<label for="table_layout_23">
					<img src="<?php echo plugins_url('img/table_layout/layout_23.PNG', __FILE__); ?>" > <br />
				</label>
			</li>
		</ul>
		
		<ul id="custom_layout_list_3" class="psts_w_li_31 psts_ul_layout" style="display: none;">
			<li>
				<input type="radio" id="table_layout_31" name="table_layout" value="psts_layout_31" <?php echo (empty($table_layout)) ? 'checked="checked"' : psts_check($table_layout,'psts_layout_31'); ?>>
				<label for="table_layout_31">
					<img src="<?php echo plugins_url('img/table_layout/layout_31.PNG', __FILE__); ?>" > 
				</label>
			</li>
			<li>
				<input type="radio" id="table_layout_32" name="table_layout" value="psts_layout_32" <?php echo (empty($table_layout)) ? '' : psts_check($table_layout,'psts_layout_32'); ?>>
				<label for="table_layout_32">
					<img src="<?php echo plugins_url('img/table_layout/layout_32.PNG', __FILE__); ?>" > 
				</label>
			</li>
			<li>
				<input type="radio" id="table_layout_33" name="table_layout" value="psts_layout_33" <?php echo (empty($table_layout)) ? '' : psts_check($table_layout,'psts_layout_33'); ?>>
				<label for="table_layout_33">
					<img src="<?php echo plugins_url('img/table_layout/layout_33.PNG', __FILE__); ?>" > <br />
				</label>
			</li>
		</ul>
	</div>
	
	<script type="text/javascript">
		$=jQuery.noConflict();
		jQuery(document).ready( function($) {
			
			if($('#type_layout_1').is(':selected')) {
				$('#custom_layout_list_1').show();
				$('#custom_layout_list_2').hide();
				$('#custom_layout_list_3').hide();
			}
			if($('#type_layout_2').is(':selected')) {
				$('#custom_layout_list_1').hide();					
				$('#custom_layout_list_2').show();
				$('#custom_layout_list_3').hide();
			}
			if($('#type_layout_3').is(':selected')) {
				$('#custom_layout_list_1').hide();
				$('#custom_layout_list_2').hide();
				$('#custom_layout_list_3').show();
			}
			
			$('select[name=type_layout]').live('change', function(){
				if($('#type_layout_1').is(':selected')) {
					$('#custom_layout_list_1').show();
					$('#custom_layout_list_2').hide();
					$('#custom_layout_list_3').hide();
				}
				if($('#type_layout_2').is(':selected')) {
					$('#custom_layout_list_1').hide();					
					$('#custom_layout_list_2').show();
					$('#custom_layout_list_3').hide();
				}
				if($('#type_layout_3').is(':selected')) {
					$('#custom_layout_list_1').hide();
					$('#custom_layout_list_2').hide();
					$('#custom_layout_list_3').show();
				}
			});
		});
	</script>
	
	<?php 
	
}

add_action('add_meta_boxes','psts_init_advanced_tools_metabox');

function psts_init_advanced_tools_metabox(){
  add_meta_box('psts_advanced_tools_metabox', 'Advanced Table Shortcode tools', 'psts_add_advanced_tools_metabox', 'psts_type', 'normal');
}

function psts_add_advanced_tools_metabox($post){
	?>
	
	<table id="advanced_tools_table">
		<tr>
			<th>Shortcode</th>
			<th>Description</th>
			<th>Example</th>
			<th>More Info</th>
		</tr>
		<tr>
			<td>
				<p>[psts_mail mail=""]</p>
			</td>
			<td>
				<p>Display a "mailto" link, that will open up an e-mail client.</p>
			</td>
			<td>
				<p>[psts_mail mail="sample@sample.com"]</p>
			</td>
			<td>
				<p><strong>Field Mail :</strong> Enter the full mail.</p>
			</td>
		</tr>
		<tr>
			<td>
				<p>[psts_url url="" text="" target=""]</p>
			</td>
			<td>
				<p>Display a standard link.</p>
			</td>
			<td>
				<p>[psts_url url="http://www.google.com" text="Click Me" target="blank"]</p>
			</td>
			<td>
				<p><strong>Field Url :</strong> Start with "http" to leave your website.</p>
				<p><strong>Field Target :</strong> Use "blank" for a new tab. Use "self" to replace the current page.</p>
			</td>
		</tr>
		<tr>
			<td>
				<p>[psts_image src="" alt="" height="" width =""]</p>
			</td>
			<td>
				<p>Display an image.</p>
			</td>
			<td>
				<p>[psts_image src="http://your_source/image.jpg" alt="opt_alt" height="100" width ="100"]</p>
			</td>
			<td>
				<p><strong>Field Height and Width :</strong> Do not specify "px".</p>
			</td>
		</tr>
		<tr>
			<td>
				<p>[psts_text text="" size="" color=""]</p>
			</td>
			<td>
				<p>Display a text with some easy css.</p>
			</td>
			<td>
				<p>[psts_text text="New Title" size="12" color="red"]</p>
			</td>
			<td>
				<p><strong>Field Size :</strong> Do not specify "pt".</p>
				<p><strong>Field Color :</strong> It can be a word, hexa or rgb color.</p>
			</td>
		</tr>
	</table>
	
	<?php
}

add_action('add_meta_boxes','psts_init_table_metabox');

function psts_init_table_metabox(){
  add_meta_box('psts_table_metabox', 'Build your table', 'psts_add_table_metabox', 'psts_type', 'normal');
}

function psts_add_table_metabox($post){
	
	global $wpdb;
	$prefix = '_psts_';

	$hidden_nb_col = get_post_meta($post->ID, $prefix.'hidden_nb_col',true);
	if ($hidden_nb_col == "")
		$hidden_nb_col = 2;
	for ($i = 1; $i <= $hidden_nb_col; $i++) {
		${"psts_table_col_" . $i} = get_post_meta($post->ID, $prefix.'psts_table_col_'.$i.'',true);
	}
	$i = 0;
	$j = 0;

	echo '<table id="all_things">';
	?>
	<tr class="item-chose first_tr">
		<td class="psts_td_button nb_column">
			<a class="suppr-col"></a>
		</td>
		<?php
		for ($i = 1; $i <= $hidden_nb_col; $i++) {
			?>
			<td class="psts_td_button nb_column">
				<a class="suppr-col" href="javascript:void(0);" ><img title="Delete a column" src="<?php echo plugins_url('img/table_column_delete.png', __FILE__); ?>" width="32" height="32" /></a>
			</td>
			<?php
		}
		?>
	</tr>
	
	
	<?php
	if($psts_table_col_1 != "" && count( $psts_table_col_1 ) > 0)
	{
		foreach ($psts_table_col_1 as $k => $thing) {
			?>
			<tr class="item-chose other_tr">	
			<td class="psts_td_button">
				<a class="suppr-chose" href="javascript:void(0);"><img title="Delete a row" src="<?php echo plugins_url('img/table_row_delete.png', __FILE__); ?>" width="32" height="32" /></a>
			</td>
			<?php			
			for ($i = 1; $i <= $hidden_nb_col; $i++) {
				${"psts_table_col_" . $i . "_c"} = ${"psts_table_col_" . $i}[$k];
				?>

				<td class="psts_td_thin">
					<textarea id="" class="duree_des_choses" style="resize:both;" name="<?php echo "psts_table_col_".$i."[]";?>" ><?php echo ${"psts_table_col_" . $i . "_c"}; ?></textarea>
				</td>
				
				<?php			
			}
			?>
			</tr>
			<?php
		}			
	}else{
		?>
	
		<tr class="item-chose other_tr">
			<td class="psts_td_button">
				<a class="suppr-chose" href="javascript:void(0);"><img title="Delete a row" src="<?php echo plugins_url('img/table_row_delete.png', __FILE__); ?>" width="32" height="32" /></a>
			</td>
			<td class="psts_td_thin">
				<textarea id="" class="duree_des_choses" style="resize:both;" name="psts_table_col_1[]" ></textarea>
			</td>
			<td class="psts_td_thin">
				<textarea id="" class="duree_des_choses" style="resize:both;" name="psts_table_col_2[]" ></textarea>
			</td>
		</tr>
	
	<?php	
	} ?>
	
	<?php
	echo '</table>';
	?>
	
	<input id="psts_hidden_nb_col" name="hidden_nb_col" type="hidden" value="<?php echo $hidden_nb_col; ?>"/>
	
	<!-- lien ajout -->
	<p class="psts_link_add">
	<a id="ajout-chose" style="margin-top: 10px; position: relative; display: inline-block;" href="javascript:void(0);"><img title="Add a row" src="<?php echo plugins_url('img/table_row_add.png', __FILE__); ?>" width="32" height="32" /></a>
	<a id="ajout-col" style="margin-top: 10px; position: relative; display: inline-block;" href="javascript:void(0);"><img title="Add a column" src="<?php echo plugins_url('img/table_column_add.png', __FILE__); ?>" width="32" height="32" /></a>
	<a id="reset-all" style="margin-top: 10px; position: relative; display: inline-block;" href="javascript:void(0);"><img title="Erase all the data" src="<?php echo plugins_url('img/table_new.png', __FILE__); ?>" width="32" height="32" /></a>
	</p>
	<p class="psts_desc">Limited to 4 columns and 3 rows in the FREE version.</p>
	<!-- script-->
	<script type="text/javascript">// <![CDATA[
	$=jQuery.noConflict();
	jQuery(document).ready(function($){

		//suppresion champ
		function remove_chose(){
			$('.suppr-chose').on('click',function(){
				if($('.item-chose').length > 2)
				{
					$(this).parent().parent().remove();
				}
			});
			$('.first_tr .suppr-col').on('click',function(){
				if($('.nb_column').length > 2)
				{
					var column_nb = $('.first_tr .suppr-col').index(this);
					if(column_nb != -1)
					{
						$( ".item-chose" ).each(function() {
						  $('td:eq(' + column_nb + ')', this).remove();
						});
						$( ".other_tr" ).each(function() {
							var test_number = 1;
						  $( "td.psts_td_thin textarea", this ).each(function() {
							  $(this).attr('name','psts_table_col_' + test_number + '[]');
							  test_number = test_number + 1;
							});
						});
						
						$('#psts_hidden_nb_col').val($('.other_tr:last .psts_td_thin').length);
					}
				}
			});
		}
		remove_chose();

		//ajout champ
		$('#ajout-chose').on('click',function(){
			if($('.item-chose').length < 4)
			{
				$('.item-chose:last').clone().appendTo('#all_things');
				$('.item-chose:last textarea').val('');
				remove_chose();
			}
		});
		
		$('#ajout-col').on('click',function(){
			if($('.nb_column').length < 5)
			{
				$('#all_things tr').append($("<td class='psts_td_thin'>"));
				$('.first_tr td:last').addClass( "nb_column" );
				$('.first_tr td:last').html('<a class="suppr-col" href="javascript:void(0);" ><img title="Delete a column" src="<?php echo plugins_url('img/table_column_delete.png', __FILE__); ?>" width="32" height="32" /></a>');
				$( ".other_tr" ).each(function() {
				  $('td:last', this).html('<textarea id="" class="duree_des_choses" style="resize:both;"></textarea>');
				});
				
				$( ".other_tr" ).each(function() {
					var test_number = 1;
				  $( "td.psts_td_thin textarea", this ).each(function() {
					  $(this).attr('name','psts_table_col_' + test_number + '[]');
					  test_number = test_number + 1;
					});
				});
				
				$('#psts_hidden_nb_col').val($('.other_tr:last .psts_td_thin').length);
				
				remove_chose();
			}
		});
		
		$('#reset-all').on('click',function(){
			var r = confirm("You will erase all the data.\n Are you sure ?");
			if (r == true) {
				$('.item-chose textarea').val('');
			} else {
			} 			
			remove_chose();
		});
		
		
	});

	// ]]></script>
	<?php
}	

add_action('save_post','psts_save_metabox');
function psts_save_metabox($post_id){
	
	$prefix = '_psts_';
	
	//Metabox Settings
	if(isset($_POST['location_headers'])){
		update_post_meta($post_id, $prefix.'location_headers', sanitize_text_field($_POST['location_headers']));
	}
	if(isset($_POST['border'])){
		update_post_meta($post_id, $prefix.'border', sanitize_text_field($_POST['border']));
	}

	if(isset($_POST['type_layout'])){
		update_post_meta($post_id, $prefix.'type_layout', sanitize_text_field($_POST['type_layout']));
	}
	if(isset($_POST['table_layout'])){
		update_post_meta($post_id, $prefix.'table_layout', sanitize_text_field($_POST['table_layout']));
	}

	
	if(isset($_POST['hidden_nb_col'])){
		update_post_meta($post_id, $prefix.'hidden_nb_col', esc_html($_POST['hidden_nb_col']));
	}
	if ( !defined( 'DOING_AJAX' ) || !DOING_AJAX ) {
		for ($i = 1; $i <= get_post_meta($post_id, $prefix.'hidden_nb_col',true); $i++) {
			if( isset($_POST['psts_table_col_'.$i.'']))
			{
				update_post_meta( $post_id, $prefix.'psts_table_col_'.$i.'', $_POST['psts_table_col_'.$i.''] );
			}
		}
	}	
}

add_action( 'manage_psts_type_posts_custom_column' , 'psts_custom_columns', 10, 2 );

function psts_custom_columns( $column, $post_id ) {
    switch ( $column ) {
	case 'shortcode' :
		global $post;
		$pre_slug = '' ;
		$pre_slug = $post->post_title;
		$slug = sanitize_title($pre_slug);
    	$shortcode = '<span style="border: solid 3px lightgray; background:white; padding:7px; font-size:17px; line-height:40px;">[ps_tableshortcode name="'.$slug.'"]</strong>';
	    echo $shortcode; 
	    break;
    }
}

function psts_add_columns($columns) {
    return array_merge($columns, 
              array('shortcode' => __('Shortcode'),
                    ));
}
add_filter('manage_psts_type_posts_columns' , 'psts_add_columns');


function psts_shortcode($atts) {
	extract(shortcode_atts(array(
		"name" => ''
	), $atts));
		
	global $post;
    $args = array('post_type' => 'psts_type', 'numberposts'=>-1);
    $custom_posts = get_posts($args);
	$output = '';
	foreach($custom_posts as $post) : setup_postdata($post);
	$sanitize_title = sanitize_title($post->post_title);
	if ($sanitize_title == $name)
	{
		$postid = get_the_ID();	
	   
		$prefix = '_psts_';
		
		$location_headers = get_post_meta($post->ID, $prefix.'location_headers',true);
		
		$border  = get_post_meta($post->ID, $prefix.'border',true);
		if($border == "" || $border == "no")
			$border_class = "psts_no_border";
		if($border == "yes")
			$border_class = "";

		$table_layout = get_post_meta($post->ID, $prefix.'table_layout',true);	
	
		
		$hidden_nb_col = get_post_meta($post->ID, $prefix.'hidden_nb_col',true);
		for ($i = 1; $i <= $hidden_nb_col; $i++) {
			${"psts_table_col_" . $i} = get_post_meta($post->ID, $prefix.'psts_table_col_'.$i.'',true);
		}	
		
		$output = '';
		$output .= '<table class="psts_table_output '.$border_class.' '.$table_layout.'">';
		foreach ($psts_table_col_1 as $k => $thing) {
			$output .= '<tr>';
			for ($i = 1; $i <= $hidden_nb_col; $i++) {
				${"psts_table_col_" . $i . "_c"} = ${"psts_table_col_" . $i}[$k];
				
				if(($location_headers == "horizontal" && $k == 0) || ($location_headers == "vertical" && $i == 1) || ($location_headers == "both" && ($i == 1 || $k == 0)))
				{
					if(($location_headers == "horizontal" || $location_headers == "both") && $k == 0)
					{
						$output .= '<th class="psts_hori_color" >';
							$output .= ${"psts_table_col_" . $i . "_c"};
						$output .= '</th>';
					}
					else
					{
						if(($location_headers == "vertical" || $location_headers == "both") && $i == 1)
						{
							$output .= '<th class="psts_vert_color" >';
								$output .= ${"psts_table_col_" . $i . "_c"};
							$output .= '</th>';
						}
					}
				}else{	
					if($k % 2 == 0)
					{
						$output .= '<td class="psts_prim_color">';
							$output .= ${"psts_table_col_" . $i . "_c"};
						$output .= '</td>';	
					} else {
						$output .= '<td class="psts_second_color">';
							$output .= ${"psts_table_col_" . $i . "_c"};
						$output .= '</td>';	
					}
				}					
			}
			$output .= '</tr>';
		}
		$output .= '</table>';
		
	}
	endforeach; wp_reset_query();
	return $output;
}
add_shortcode( 'ps_tableshortcode', 'psts_shortcode' );

// Creation of the Shortcode "Email"
add_shortcode( 'psts_mail', 'psts_shortcode_mail' );
function psts_shortcode_mail($atts) {

	extract(shortcode_atts(array(	"mail" => ''), $atts));

	$output = '<a href="mailto:'.$mail.'">'.$mail.'</a>';

	return $output;

}

// Creation of the Shortcode "URL"
add_shortcode( 'psts_url', 'psts_shortcode_url' );
function psts_shortcode_url($atts) {

	extract(shortcode_atts(array(	"url" => '', "text" => '', "target" => 'self'), $atts));

	$output = '<a href="'.$url.'" target="_'.$target.'">'.$text.'</a>';

	return $output;

}

// Creation of the Shortcode "Image"
add_shortcode( 'psts_image', 'psts_shortcode_image' );
function psts_shortcode_image($atts) {

	extract(shortcode_atts(array(	"src" => '', "alt" => '', "height" => '', "width" => ''), $atts));

	$output = ' <img src="'.$src.'" alt="'.$alt.'" height="'.$height.'" width="'.$width.'"> ';


	return $output;

}

// Creation of the Shortcode "Text"
add_shortcode( 'psts_text', 'psts_shortcode_text' );
function psts_shortcode_text($atts) {

	extract(shortcode_atts(array(	"text" => '', "size" => '10', "color" => 'black'), $atts));

	$output = ' <p style="font-size:'.$size.'pt;color:'.$color.';">'.$text.'</p>';


	return $output;

}

	
?>