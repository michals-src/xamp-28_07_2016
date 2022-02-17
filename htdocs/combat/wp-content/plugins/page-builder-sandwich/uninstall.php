<?php
/**
 * Uninstall file
 *
 * @package Page Builder Sandwich
 */

// If uninstall is not called from WordPress, exit.
if ( ! defined( 'WP_UNINSTALL_PLUGIN' ) ) {
	exit();
}

// Used by class-migration.php.
delete_option( 'pbs_no_migration_notice' );

// Used by class-intro.php.
delete_option( 'pbs_first_load_intro' );

// Used by class-licensing.php.
delete_option( 'pbs_license_status' );
delete_option( 'pbs_license' );

// Used by the admin notice for new users.
delete_option( 'pbs_plugin_activation_notice' );

// Used by class-lite-tracking.php.
delete_option( 'pbs_lite_tracking_seconds' );
delete_option( 'pbs_lite_tracking_shown60' );
delete_option( 'pbs_lite_tracking_shown120' );
delete_option( 'pbs_lite_tracking_shown180' );
delete_option( 'pbs_lite_tracking_rated' );

// Used by class-icons-uploader.php.
delete_option( 'pbs_uploaded_svg' );

// Used by class-stats-tracking.php.
delete_option( 'pbs_stats_tracking_opted_in' );
