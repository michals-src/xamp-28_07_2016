
<?php
/*
Name: MCE Wrapper
URI: http://trepmal.com/
Description: TinyMCE button that wraps selection in given tag
Author: Kailey Lampert
Version: 1.0
Author URI: http://kaileylampert.com/

Copyright (C) 2011  Kailey Lampert

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

add_action( 'init', 'mce_wrapper_init', 9);
function mce_wrapper_init() {
	if (is_admin())
		new mcewrapper();
}

class mcewrapper {

	var $headerName = 'HeaderBtn';
	var $rowName = 'RowBtn';
	var $iName = 'IBtn';
	var $internalVersion = 600;

	/**
	 * mcewrapper::mcewrapper()
	 * the constructor
	 *
	 * @return void
	 */
	function mcewrapper()  {

		// Modify the version when tinyMCE plugins are changed.
		add_filter('tiny_mce_version', array (&$this, 'change_tinymce_version') );

		// init process for button control
		add_action('init', array (&$this, 'addbuttons') );

	}

	/**
	 * mcewrapper::addbuttons()
	 *
	 * @return void
	 */
	function addbuttons() {

		// Don't bother doing this stuff if the current user lacks permissions
		if ( !current_user_can('edit_posts') && !current_user_can('edit_pages') )
			return;

		// Add only in Rich Editor mode
		if ( get_user_option('rich_editing') == 'true') {

			// add the button for wp2.5 in a new way
			add_filter("mce_external_plugins", array (&$this, 'add_tinymce_plugin' ));
			add_filter('mce_buttons', array (&$this, 'register_button' ), 0);
		}
	}

	/**
	 * mcewrapper::register_button()
	 * used to insert button in wordpress 2.5x editor
	 *
	 * @return $buttons
	 */
	function register_button($buttons) {

		array_push( $buttons, $this->headerName, $this->rowName, $this->iName );

		return $buttons;
	}

	/**
	 * mcewrapper::add_tinymce_plugin()
	 * Load the TinyMCE plugin : editor_plugin.js
	 *
	 * @return $plugin_array
	 */
	function add_tinymce_plugin($plugin_array) {

		$plugin_array[$this->headerName] =  get_template_directory_uri() . '/js/editor_plugin.js';
		$plugin_array[$this->rowName] =  get_template_directory_uri() . '/js/editor_plugin.js';
		$plugin_array[$this->iName] =  get_template_directory_uri() . '/js/editor_plugin.js';

		return $plugin_array;
	}

	/**
	 * mcewrapper::change_tinymce_version()
	 * A different version will rebuild the cache
	 *
	 * @return $version
	 */
	function change_tinymce_version($version) {
		$version = $version + $this->internalVersion;
		return $version;
	}


}
