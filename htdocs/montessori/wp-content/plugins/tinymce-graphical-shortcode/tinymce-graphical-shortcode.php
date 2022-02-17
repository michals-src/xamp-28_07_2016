<?php
/*
Plugin Name: TinyMCE graphical shortcode
Plugin URI: 
Description: Replace spots shortcode with a nice graphic
Version: NaN
Author: Simon Dunton
Author URI: http://www.wpsites.co.uk
*/


class tinymce_shortcode_replace

{



	function __construct() {

		
		add_filter('mce_external_plugins', array( &$this, 'add_tcustom_tinymce_plugin' ));
       add_filter('tiny_mce_before_init', array( &$this, 'myformatTinyMCE' ) );

	}
	
	//include the tinymce javascript plugin
    function add_tcustom_tinymce_plugin($plugin_array) {
       $plugin_array['icitspots'] = WP_PLUGIN_URL.'/tinymce-graphical-shortcode/tinymce-plugin/icitspots/editor_plugin.js';
        return $plugin_array;
    }

	//include the css file to style the graphic that replaces the shortcode
    function myformatTinyMCE($in)
    {
        $in['content_css'] .= ",".WP_PLUGIN_URL.'/tinymce-graphical-shortcode/tinymce-plugin/icitspots/editor-style.css';
         return $in;
    }


 
}



add_action("init", create_function('', 'new tinymce_shortcode_replace();'));





?>