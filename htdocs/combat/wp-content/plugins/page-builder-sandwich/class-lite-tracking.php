<?php
/**
 * Plugin usage tracking for lite users.
 *
 * @package Page Builder Sandwich
 */

if ( ! defined( 'ABSPATH' ) ) { exit; // Exit if accessed directly.
}

if ( ! class_exists( 'PBSLiteTracking' ) ) {

	/**
	 * This is where all the tracking functionality happens.
	 */
	class PBSLiteTracking {

		/**
		 * Hook into WordPress.
		 */
		function __construct() {
			if ( ! PBS_IS_LITE ) {
				return;
			}

			add_action( 'wp_ajax_pbs_lite_tracking_ping', array( $this, 'frontend_pinged' ) );
			add_action( 'wp_ajax_pbs_lite_tracking_rated', array( $this, 'rated' ) );
			add_filter( 'pbs_localize_scripts', array( $this, 'add_tracking_params' ) );
			if ( ! is_admin() ) {
				add_action( 'admin_bar_menu', array( $this, 'add_admin_bar_rate_button' ), 9999 );
			}

			// For Testing.
			// @codingStandardsIgnoreStart
			// delete_option( 'pbs_lite_tracking_seconds' );
			// delete_option( 'pbs_lite_tracking_shown60' );
			// delete_option( 'pbs_lite_tracking_shown120' );
			// delete_option( 'pbs_lite_tracking_shown180' );
			// delete_option( 'pbs_lite_tracking_rated' );
			// @codingStandardsIgnoreEnd
		}


		/**
		 * Trigger the tour to show only for first time usage.
		 *
		 * @since 2.8.2
		 *
		 * @param array $args Localization array.
		 *
		 * @return array The modified localization array.
		 */
		public function add_tracking_params( $args ) {
			$args['lite_tracking_seconds'] = (int) get_option( 'pbs_lite_tracking_seconds' );
			$args['lite_tracking_rated'] = get_option( 'pbs_lite_tracking_rated' );
			$args['lite_tracking_nonce'] = wp_create_nonce( 'pbs_lite_tracking' );
			return $args;
		}


		/**
		 * Rated click ajax handler.
		 *
		 * @since 2.8.2
		 */
		public function rated() {
			$nonce = sanitize_text_field( trim( $_POST['nonce'] ) );
			if ( ! wp_verify_nonce( $nonce, 'pbs_lite_tracking' ) ) {
				die();
			}

			update_option( 'pbs_lite_tracking_rated', true );

			die();
		}


		/**
		 * 15 second ping ajax handler. Adds 15 seconds to the timer then decides
		 * whether to show the rating box or not.
		 *
		 * @since 2.8.2
		 */
		public function frontend_pinged() {

			// Security.
			$nonce = sanitize_text_field( trim( $_POST['nonce'] ) );
			if ( ! wp_verify_nonce( $nonce, 'pbs_lite_tracking' ) ) {
				die();
			}

			// Don't continue if all rating requests are complete.
			if ( get_option( 'pbs_lite_tracking_shown180' ) || get_option( 'pbs_lite_tracking_rated' ) ) {
				die();
			}

			$seconds = (int) get_option( 'pbs_lite_tracking_seconds' ) + 15;
			update_option( 'pbs_lite_tracking_seconds', $seconds );
			$show_rate = false;

			if ( ! get_option( 'pbs_lite_tracking_shown60' ) ) {
				if ( $seconds / 60 >= 60 ) {
					update_option( 'pbs_lite_tracking_shown60', true );
					$show_rate = true;
				}
			}

			if ( ! get_option( 'pbs_lite_tracking_shown120' ) ) {
				if ( $seconds / 60 >= 120 ) {
					update_option( 'pbs_lite_tracking_shown120', true );
					$show_rate = true;
				}
			}

			if ( ! get_option( 'pbs_lite_tracking_shown180' ) ) {
				if ( $seconds / 60 >= 180 ) {
					update_option( 'pbs_lite_tracking_shown180', true );
					$show_rate = true;
				}
			}

			if ( $show_rate ) {
				die( 'show' );
			}
			die();
		}



		/**
		 * Adds the rate box to the admin bar.
		 *
		 * @since 2.8.2
		 *
		 * @param Object $wp_admin_bar The admin bar object.
		 *
		 * @return Object The modified admin bar object.
		 */
		public function add_admin_bar_rate_button( $wp_admin_bar ) {
			if ( ! PageBuilderSandwich::is_editable_by_user() ) {
				return $wp_admin_bar;
			}

			$args = array(
				'id' => 'pbs_rate',
				'title' => '<span class="ab-icon"></span>'
					. __( 'Rate PB Sandwich!', PAGE_BUILDER_SANDWICH )
					. '<span id="pbs-rate-info">'
					. '<span id="pbs-rate-desc">' . __( "Hey there!<br>It looks like you've been actively building your pages for more than an hour now. I'd like to ask a favor from you and rate Page Builder Sandwich in the WordPress.org plugin directory. Getting a great review from you would be awesome!", PAGE_BUILDER_SANDWICH ) . '</span>' .
					'<span id="pbs-rate-go">' . __( "Sure I'll rate", PAGE_BUILDER_SANDWICH ) . '</span>' .
					'<span id="pbs-rate-no">' . __( 'Maybe later', PAGE_BUILDER_SANDWICH ) . '</span>',
				'href'  => '#',
				'meta'  => array( 'class' => 'pbs-adminbar-icon pbs-hidden' ),
			);
			$wp_admin_bar->add_node( $args );

			return $wp_admin_bar;
		}
	}
}

new PBSLiteTracking();
