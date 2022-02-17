<?php
/*
Plugin Name: Daniele Alessandra TinyMCE Recover
Description: Ripristina i pusanti “Sottolineato” e “Giustificato” rimossi dall’editor di WordPress dalla versione 4.7
Version: 1.0
Author: Daniele Alessandra
Author URI: http://www.danielealessandra.com/
*/
function danielealessandra_plugin_restore_old_buttons( $row_buttons ){
    array_splice( $row_buttons, array_search('italic', $row_buttons) + 1, 0, 'underline' );
    array_splice( $row_buttons, array_search('alignright', $row_buttons) + 1, 0, 'alignjustify' );
    return $row_buttons;
}
add_filter( 'mce_buttons', 'danielealessandra_plugin_restore_old_buttons', 1 );