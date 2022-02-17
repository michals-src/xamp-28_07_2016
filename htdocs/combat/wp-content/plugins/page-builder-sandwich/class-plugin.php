<?php
/**
 * The main plugin file
 *
 * @package Page Builder Sandwich
 */

/**
Plugin Name: Page Builder Sandwich Lite
Description: The easiest way to build your website without any code. A true drag & drop page builder for WordPress.
Author: Gambit Technologies
Version: 2.17
Author URI: http://gambit.ph
Plugin URI: http://pagebuildersandwich.com
Text Domain: page-builder-sandwich
Domain Path: /languages
SKU: PBS
 */


if ( ! defined( 'ABSPATH' ) ) { exit; // Exit if accessed directly.
}

/**
 * Detect if there is another version of PBS currently activated. If there is,
 * show an error since multiple plugins will cause errors.
 */
if ( defined( 'VERSION_PAGE_BUILDER_SANDWICH' ) ) {
	trigger_error( 'Seems like you have the Lite version of Page Builder Sandwich activated. Please deactivate it first then try again.',E_USER_ERROR );
	return;
}

// Identifies the current plugin version.
defined( 'VERSION_PAGE_BUILDER_SANDWICH' ) or define( 'VERSION_PAGE_BUILDER_SANDWICH', '2.17' );

// The slug used for translations & other identifiers.
defined( 'PAGE_BUILDER_SANDWICH' ) or define( 'PAGE_BUILDER_SANDWICH', 'page-builder-sandwich' );

defined( 'PBS_FILE' ) or define( 'PBS_FILE', __FILE__ );

// Shows/hides Lite code.
define( 'PBS_IS_LITE', true );

// Shows/hides Pro code.
define( 'PBS_IS_PRO', false );

// EDD auto-update Stuff.
define( 'PBS_EDD_SL_STORE_URL', 'http://pagebuildersandwich.com/?edd=nocache' );
define( 'PBS_EDD_SL_ITEM_NAME', 'Page Builder Sandwich' );


// This is the main plugin functionality.
require_once( 'class-compatibility.php' );
require_once( 'class-render-shortcode.php' );
require_once( 'class-page-builder-sandwich.php' );
require_once( 'class-migration.php' );
require_once( 'class-intro.php' );
require_once( 'class-meta-box.php' );
require_once( 'class-icons.php' );
require_once( 'class-helpscout.php' );
require_once( 'class-stats-tracking.php' );
require_once( 'class-shortcodes.php' );
require_once( 'class-element-widget.php' );
require_once( 'class-element-sidebar.php' );
require_once( 'class-element-html.php' );
require_once( 'class-element-map.php' );
require_once( 'class-translations.php' );
if ( ! PBS_IS_LITE && ! class_exists( 'EDD_SL_Plugin_Updater' ) ) {
	include( 'page_builder_sandwich/inc/EDD_SL_Plugin_Updater.php' );
}
if ( ! PBS_IS_LITE ) {
	require_once( 'class-licensing.php' );
	require_once( 'class-icons-uploader.php' );
	require_once( 'class-element-newsletter.php' );
	require_once( 'class-element-carousel.php' );
	require_once( 'class-element-pretext.php' );
} else {
	require_once( 'class-lite-tracking.php' );
}

// Initializes plugin class.
if ( ! class_exists( 'PageBuilderSandwichPlugin' ) ) {

	/**
	 * Initializes core plugin that is readable by WordPress.
	 *
	 * @return	void
	 * @since	1.0
	 */
	class PageBuilderSandwichPlugin {

		/**
		 * Hook into WordPress.
		 *
		 * @return	void
		 * @since	1.0
		 */
		function __construct() {

			// Our translations.
			add_action( 'plugins_loaded', array( $this, 'load_text_domain' ), 1 );

			// Gambit links.
			add_filter( 'plugin_row_meta', array( $this, 'plugin_links' ), 10, 2 );

			// Plugin links for internal developer tools.
			add_filter( 'plugin_row_meta', array( $this, 'dev_tool_links' ), 10, 2 );

			// Put a notice on how to edit using PBS.
			add_action( 'admin_notices', array( $this, 'plugin_activation_notice' ) );

			// Update check.
			$this->check_update();

			new PBSMigration();
		}


		/**
		 * Loads the translations.
		 *
		 * @return	void
		 * @since	1.0
		 */
		public function load_text_domain() {
			load_plugin_textdomain( PAGE_BUILDER_SANDWICH, false, basename( dirname( __FILE__ ) ) . '/languages/' );
		}


		/**
		 * Adds plugin links.
		 *
		 * @access	public
		 * @param	array  $plugin_meta The current array of links.
		 * @param	string $plugin_file The plugin file.
		 * @return	array The current array of links together with our additions.
		 * @since	1.0
		 **/
		public function plugin_links( $plugin_meta, $plugin_file ) {
			if ( plugin_basename( __FILE__ ) === $plugin_file ) {

				if ( PBS_IS_LITE ) {
					$plugin_meta[] = sprintf( "<a href='%s' target='_blank'>%s</a>",
						'https://pagebuildersandwich.com/?utm_source=lite-plugin&utm_medium=plugin-meta-link&utm_campaign=Page%20Builder%20Sandwich
',
						__( 'Go Premium', PAGE_BUILDER_SANDWICH )
					);
				} else {
					$plugin_meta[] = sprintf( "<a href='%s' target='_blank' class='pbs-plugin-placeholder'>%s</a>",
						'mailto:support@pagebuildersandwich.com',
						__( 'Get Customer Support', PAGE_BUILDER_SANDWICH )
					);
				}
			}
			return $plugin_meta;
		}

		/**
		 * Adds plugin links for different developer tools (for internal use only, these won't show up in user's sites).
		 *
		 * @access	public
		 * @param	array  $plugin_meta The current array of links.
		 * @param	string $plugin_file The plugin file.
		 * @return	array The current array of links together with our additions.
		 * @since	2.16
		 **/
		public function dev_tool_links( $plugin_meta, $plugin_file ) {
			if ( plugin_basename( __FILE__ ) === $plugin_file ) {

				if ( file_exists( trailingslashit( plugin_dir_path( __FILE__ ) ) . 'design-element-cleanup.php' ) ) {
					$plugin_meta[] = sprintf( "<br><a href='%s' target='_blank'>%s</a>",
						plugins_url( 'design-element-cleanup.php', __FILE__ ),
						'[DEV TOOL] Pre-Designed Element HTML Cleaner'
					);
				}
			}
			return $plugin_meta;
		}

		/**
		 * Checks for plugin updates.
		 *
		 * @since 2.7.1
		 */
		public function check_update() {
			if ( PBS_IS_LITE ) {
				return;
			}
			if ( get_option( 'pbs_license_status' ) === 'valid' && get_option( 'pbs_license' ) ) {
				$edd_updater = new EDD_SL_Plugin_Updater( PBS_EDD_SL_STORE_URL, __FILE__, array(
						'version' => VERSION_PAGE_BUILDER_SANDWICH,
						'license' => get_option( 'pbs_license' ),
						'item_name' => PBS_EDD_SL_ITEM_NAME,
						'author' => 'Gambit Technologies',
						'url' => home_url(),
					)
				);
			}
		}


		/**
		 * Displays a notice for first time users to create a new page/post to start using PBS.
		 *
		 * @since 2.8.1
		 */
		public function plugin_activation_notice() {
			if ( get_option( 'pbs_plugin_activation_notice' ) === false ) {

				// Only show this once.
				update_option( 'pbs_plugin_activation_notice', 'done' );

				$post_type = null;
				if ( current_user_can( 'publish_pages' ) ) {
					$post_type = 'page';
				} else if ( current_user_can( 'publish_posts' ) ) {
					$post_type = 'post';
				}

				if ( $post_type ) {
					$new_post = get_default_post_to_edit( $post_type, true );
					$preview_link = esc_url( get_preview_post_link( $new_post ) );
					$nonce_action = 'update-post_' . $new_post->ID;
					$referer = wp_get_referer();

					?>
					<div class='updated'>
						<p>
							<form action='post.php' method='post' id='pbs-new-post' name='post' target='_self'>
								<input type='hidden' id='title' name='post_title' value='<?php echo esc_attr( 'Just Trying Out PBS', PAGE_BUILDER_SANDWICH ) ?>'/>
								<input type='hidden' id='post_ID' name='post_ID' value='<?php echo esc_attr( $new_post->ID ) ?>'>
								<input type='hidden' id='post_type' name='post_type' value='<?php echo esc_attr( $post_type ) ?>'>
								<input type='hidden' id='original_post_status' name='original_post_status' value='auto-draft'>
								<?php wp_nonce_field( $nonce_action ) ?>
								<input type='hidden' id='user-id' name='user_ID' value='<?php echo esc_attr( get_current_user_id() ) ?>'>
								<input type='hidden' id='hiddenaction' name='action' value='editpost'>
								<input type='hidden' id='originalaction' name='originalaction' value='editpost'>
								<input type='hidden' id='post_author' name='post_author' value='1'>
								<input type='hidden' id='referredby' name='referredby' value='<?php echo $referer ? esc_url( $referer ) : ''; ?>'>
								<input type='hidden' id='auto_draft' name='auto_draft' value='1'>
								<input type='hidden' name='wp-preview' id='wp-preview' value='dopreview' />

								<?php
								printf(
									esc_html__( "Thanks for activating Page Builder Sandwich! To get started, visit any page or post in your site. %sOr let's create a new %s right now and I'll tour you on how to use PB Sandwich.%s (This will create a new draft %s)", PAGE_BUILDER_SANDWICH ),
									'<a href="' . esc_url( $preview_link ) . '" onclick="document.getElementById(\'pbs-new-post\').submit(); return false;">',
									esc_html__( $post_type ),
									'</a>',
									esc_html__( $post_type )
								);
								?>
							</form>
						</p>
					</div>
					<?php

					// If the user doesn't have any privileges.
				} else {
					?>
					<div class='updated'>
						<p>
							<?php esc_html_e( 'Thanks for activating Page Builder Sandwich! To get started, visit any page or post in your site to begin using Page Builder Sandwich. You will need to have editing privileges to edit them.', PAGE_BUILDER_SANDWICH ) ?>
						</p>
					</div>
					<?php
				}
			}
		}
	}

	new PageBuilderSandwichPlugin();
}
