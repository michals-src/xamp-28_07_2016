<?php
/**
 * Stats tracking for awesome PBS stats. 2 Parts:
 * 1. Usage stats tracking,
 * 2. Deactivation reason tracking.
 *
 * @package Page Builder Sandwich
 */

if ( ! defined( 'ABSPATH' ) ) { exit; // Exit if accessed directly.
}


defined( 'PBS_STATS_URL' ) or define( 'PBS_STATS_URL', 'http://pagebuildersandwich.com/wp-json/pbs/v1/submit_stats' );
defined( 'PBS_DEACTIVATE_URL' ) or define( 'PBS_DEACTIVATE_URL', 'http://pagebuildersandwich.com/wp-json/pbs/v1/submit_deactivate' );

if ( ! class_exists( 'PBSStatsTracking' ) ) {

	/**
	 * This is where all the stats tracking functionality happens.
	 */
	class PBSStatsTracking {

		/**
		 * Hook into the frontend.
		 */
		function __construct() {
			// Opt-in usage.
			add_action( 'wp_ajax_pbs_save_content_tracking', array( $this, 'send_tracking_data' ) );
			add_filter( 'pbs_localize_scripts', array( $this, 'add_track_opt_in' ) );
			add_action( 'wp_footer', array( $this, 'add_optin_template' ) );
			add_action( 'wp_ajax_pbs_optin_answer', array( $this, 'optin_answer_handler' ) );

			// Deactivate question.
			if ( PBS_IS_LITE ) {
				add_filter( 'pbs_localize_admin_scripts', array( $this, 'deactivation_modal_labels' ) );
				add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_ajax' ) );
				add_action( 'admin_footer', array( $this, 'add_deactivate_question_template' ) );
				add_action( 'wp_ajax_pbs_deactivate_answer', array( $this, 'deactivate_answer_handler' ) );
			}
		}



		/**
		 * Sends the data to be tracked to PBS API (blocking), called by an ajax call.
		 *
		 * @since 2.11.1
		 */
		public function send_tracking_data() {

			// Allow others to stop usage tracking.
			if ( ! apply_filters( 'pbs_stats_tracking', true ) ) {
				die();
			}

			// Only do this if opted in.
			if ( get_option( 'pbs_stats_tracking_opted_in' ) !== 'yes' ) {
				die();
			}

			// Check if we have the necessary fields.
			if ( empty( $_POST['post_id'] ) || ! isset( $_POST['main-content'] ) || empty( $_POST['save_nonce'] ) ) {
				die();
			}

			// Security check.
			if ( ! wp_verify_nonce( $_POST['save_nonce'], 'pbs_save' . get_current_user_id() ) ) {
				die();
			}

			// Sanitize data.
			$post_id = intval( $_POST['post_id'] );
			$content = sanitize_post_field( 'post_content', $_POST['main-content'], $post_id, 'db' );

			$data = array(
				'referrer' => trailingslashit( get_site_url() ),
				'post_id' => $post_id,
				'content' => trim( str_replace( "\n", '', $content ) ),
				'is_lite' => PBS_IS_LITE ? '1' : '0',
				'theme' => wp_get_theme()->Name,
				'icon_searches' => '',
			);

			if ( ! empty( $_POST['icon_searches'] ) ) {
				$data['icon_searches'] = sanitize_text_field( $_POST['icon_searches'] );
			}

			// Generate a unique hash that will be used for security checks.
			$data['hash'] = md5( $data['referrer'] . $data['post_id'] . $data['content'] . $data['is_lite'] . $data['theme'] . $data['icon_searches'] );

			$request = wp_remote_post( PBS_STATS_URL,
				array(
					// 'timeout' => 20,
					'sslverify' => false,
					'body' => $data,
				)
			);

			die();
		}


		/**
		 * Adds the JS parameters needed for showing the opt-in form.
		 *
		 * @since 2.11
		 *
		 * @param array $params The localization parameters for the main PBS script.
		 *
		 * @return array The modified localization parameters.
		 *
		 * @see _pbs-stats_tracking.js
		 */
		public function add_track_opt_in( $params ) {

			if ( ! apply_filters( 'pbs_stats_tracking', true ) ) {
				return $params;
			}

			if ( get_option( 'pbs_stats_tracking_opted_in' ) === false ) {
				$params['optin_nonce'] = wp_create_nonce( 'pbs_optin' );
				$params['show_opt_in_stats_track'] = '1';
			} else if ( get_option( 'pbs_stats_tracking_opted_in' ) === 'yes' ) {
				$params['stats_tracking_opted_in'] = '1';
			}
			return $params;
		}


		/**
		 * Adds the opt-in template used to render the modal.
		 *
		 * @since 2.11
		 */
		public function add_optin_template() {
			if ( ! apply_filters( 'pbs_stats_tracking', true ) ) {
				return;
			}
			if ( get_option( 'pbs_stats_tracking_opted_in' ) !== false ) {
				return;
			}

			include 'page_builder_sandwich/templates/stats-tracking-optin.php';
		}


		/**
		 * Ajax handler for opting-in or out of stats tracking. This just saves
		 * the 'yes' or 'no' answer in the options table.
		 *
		 * @since 2.11
		 */
		public function optin_answer_handler() {
			if ( empty( $_POST['nonce'] ) || empty( $_POST['optin'] ) ) {
				die();
			}
			$nonce = sanitize_text_field( trim( $_POST['nonce'] ) );
			$optin = sanitize_text_field( trim( $_POST['optin'] ) );
			if ( ! wp_verify_nonce( $nonce, 'pbs_optin' ) ) {
				die();
			}

			if ( 'yes' != $optin ) {
				$optin = 'no';
			}
			update_option( 'pbs_stats_tracking_opted_in', $optin );

			die();
		}


		/**
		 * Enqueues the ajax script that we need for showing the deactivation questions.
		 *
		 * @since 2.11
		 */
		public function enqueue_ajax() {
			$screen = get_current_screen();
			if ( empty( $screen ) ) {
				return;
			}
			if ( 'plugins' != $screen->id ) {
				return;
			}

			wp_enqueue_script( 'wp-util' );
		}


		/**
		 * Adds the translation strings used in JS.
		 *
		 * @since 2.11
		 *
		 * @param array $params The localization params.
		 *
		 * @return array The modified localization params.
		 */
		public function deactivation_modal_labels( $params ) {
			$screen = get_current_screen();
			if ( empty( $screen ) ) {
				return $params;
			}
			if ( 'plugins' != $screen->id ) {
				return $params;
			}

			$params['deactivate_textarea_error_label'] = __( 'Please describe your issue so we can fix it!', PAGE_BUILDER_SANDWICH );
			$params['deactivate_textarea_feature_label'] = __( 'What feature are you looking for?', PAGE_BUILDER_SANDWICH );
			$params['deactivate_textarea_alternative_label'] = __( 'What&apos;s the name of the plugin?', PAGE_BUILDER_SANDWICH );
			$params['deactivate_textarea_other_label'] = __( 'What reason?', PAGE_BUILDER_SANDWICH );
			$params['deactivate_textarea_feedback_label'] = __( 'Feedback', PAGE_BUILDER_SANDWICH );

			$params['deactivate_email_error_label'] = __( 'Enter your email if you want us to let you know if we have resolved your issues', PAGE_BUILDER_SANDWICH );
			$params['deactivate_email_feature_label'] = __( 'Enter your email if you want us to let you know if we have added your feature request', PAGE_BUILDER_SANDWICH );
			$params['deactivate_email_alternative_label'] = __( 'Enter your email if you want us to let you know if we have updates', PAGE_BUILDER_SANDWICH );
			$params['deactivate_email_other_label'] = __( 'Enter your email if you want us to let you know if we have resolved your issues', PAGE_BUILDER_SANDWICH );
			$params['deactivate_email_feedback_label'] = __( 'Enter your email if you want us to let you know if we have resolved your issues', PAGE_BUILDER_SANDWICH );

			return $params;
		}


		/**
		 * Adds the deactivate question template
		 *
		 * @since 2.11
		 */
		public function add_deactivate_question_template() {
			$screen = get_current_screen();
			if ( empty( $screen ) ) {
				return;
			}
			if ( 'plugins' != $screen->id ) {
				return;
			}

			?>
			<script type="text/html" id="tmpl-pbs-deactivate-question">
				<div class="pbs-deactivate-question">
					<h2><?php _e( 'Deactivating? Let Us Know Why!', PAGE_BUILDER_SANDWICH ) ?></h2>
					<p><?php _e( 'Let us know your reason and we&apos;ll use your feedback to make Page Builder Sandwich a better fit for you and other users.', PAGE_BUILDER_SANDWICH ) ?></p>
					<p><label for="pbs_has_error"><input type="radio" name="pbs_reason" id="pbs_has_error" value="error"> <?php _e( 'It&apos;s not working correctly', PAGE_BUILDER_SANDWICH ) ?></label></p>
					<p><label for="pbs_missing_feature"><input type="radio" name="pbs_reason" id="pbs_missing_feature" value="missing_feature"> <?php _e( 'It&apos;s missing a feature', PAGE_BUILDER_SANDWICH ) ?></label></p>
					<p><label for="pbs_found_alternative"><input type="radio" name="pbs_reason" id="pbs_found_alternative" value="found_alternative"> <?php _e( 'I found a better alternative', PAGE_BUILDER_SANDWICH ) ?></label></p>
					<p><label for="pbs_other"><input type="radio" name="pbs_reason" id="pbs_other" value="other"> <?php _e( 'Other', PAGE_BUILDER_SANDWICH ) ?></label></p>
					<p class="pbs-deactivate-advanced"><label for="pbs_description"><span id="pbs_description_label"><?php _e( 'Feedback', PAGE_BUILDER_SANDWICH ) ?></span><textarea name="pbs_description" id="pbs_description"></textarea></label></p>
					<p class="pbs-deactivate-advanced"><label for="pbs_email"><span id="pbs_email_label"><?php _e( 'Enter your email so we can let you know if we have resolved your issues', PAGE_BUILDER_SANDWICH ) ?></span><input type="text" name="pbs_email" id="pbs_email"></label></p>
					<p class='pbs-buttons'>
						<input type="hidden" id="pbs_deactivate_nonce" value="<?php echo esc_attr( wp_create_nonce( 'pbs_deactivate' ) ) ?>"/>
						<a href='#' class='pbs-button pbs-button-deactivate-yes'><?php _e( 'Send Feedback & Deactivate', PAGE_BUILDER_SANDWICH ) ?></a>
						<a href='#' class='pbs-button pbs-button-deactivate-no'><?php _e( 'Just Deactivate', PAGE_BUILDER_SANDWICH ) ?></a>
					</p>
				</div>
			</script>
			<?php
		}


		/**
		 * Sends the deactivation data to pbs.com
		 *
		 * @since 2.11
		 */
		public function deactivate_answer_handler() {
			if ( empty( $_POST['nonce'] ) || empty( $_POST['reason'] ) ) {
				die();
			}
			$nonce = sanitize_text_field( trim( $_POST['nonce'] ) );
			if ( ! wp_verify_nonce( $nonce, 'pbs_deactivate' ) ) {
				die();
			}

			$data = array(
				'reason' => sanitize_text_field( trim( $_POST['reason'] ) ),
			);

			if ( ! empty( $_POST['description'] ) ) {
				$data['description'] = sanitize_text_field( trim( $_POST['description'] ) );
			}
			if ( ! empty( $_POST['email'] ) ) {
				$data['email'] = sanitize_text_field( trim( $_POST['email'] ) );
			}

			$request = wp_remote_post( PBS_DEACTIVATE_URL,
				array(
					'timeout' => 20,
					'sslverify' => false,
					'body' => $data,
				)
			);

			die();
		}
	}
}

new PBSStatsTracking();
