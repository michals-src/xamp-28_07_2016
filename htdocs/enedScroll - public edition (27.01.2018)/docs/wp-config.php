<?php
/**
 * The base configuration for WordPress
 *
 * The wp-config.php creation script uses this file during the
 * installation. You don't have to use the web site, you can
 * copy this file to "wp-config.php" and fill in the values.
 *
 * This file contains the following configurations:
 *
 * * MySQL settings
 * * Secret keys
 * * Database table prefix
 * * ABSPATH
 *
 * @link https://codex.wordpress.org/Editing_wp-config.php
 *
 * @package WordPress
 */

// ** MySQL settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define('DB_NAME', 'enedScroll');

/** MySQL database username */
define('DB_USER', 'root');

/** MySQL database password */
define('DB_PASSWORD', '');

/** MySQL hostname */
define('DB_HOST', 'localhost');

/** Database Charset to use in creating database tables. */
define('DB_CHARSET', 'utf8mb4');

/** The Database Collate type. Don't change this if in doubt. */
define('DB_COLLATE', '');

/**#@+
 * Authentication Unique Keys and Salts.
 *
 * Change these to different unique phrases!
 * You can generate these using the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}
 * You can change these at any point in time to invalidate all existing cookies. This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define('AUTH_KEY',         'R:wXxnV1C|H*L9u/!@y+Ztq-tm{$uIR/`QP&WC[[}hc5Wa_Oh$ R)[`L;tLy/7db');
define('SECURE_AUTH_KEY',  'd*;0-tC:32iKux:*.nVK)FgeI6EtNZ;//37^P7j.Q9lV0>BT)ucfpe{|HkN(JlL%');
define('LOGGED_IN_KEY',    '$&o$=+|jaS=TO/Vee:mY{5!N?:lGA6T/+A%&-<Ym+jibAyt@:6rnXW{[gkwer]/k');
define('NONCE_KEY',        ')L8&4$Ls**>(])/Mm,IrSL)@D<?Fe2_%2%wU.^d@DQ6gk;Il+!uA`$K.Kj]JN4Pl');
define('AUTH_SALT',        '{fhXvydqy5 TkJ@s{R]Y^w=9T{gUqq,u)KlWJ`Cf.~>B#/FB{$HGb%Drrw!?,8q<');
define('SECURE_AUTH_SALT', 'pM%QK(>gA~n_u$n1Vbps30_9xvMX_I<,BF6aH%%J7w0VsvHP+N~U|8#}7ea#qk`C');
define('LOGGED_IN_SALT',   'Yhk }?Eqj5xYCq(45jZ<>kPM@8a]_d 8&Kq|GGXdwK`yCl&I*l^(_Rd}W%x_XO)<');
define('NONCE_SALT',       'F,*F4 1uW9|Pq.*,OOrP2+rjA!Je[p93J6jlc<Ig^Mg^//vF1}ZveM+B)5m<As(.');

define('WP_POST_REVISIONS', false );

/**#@-*/

/**
 * WordPress Database Table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 */
$table_prefix  = 'wp_';

/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 *
 * For information on other constants that can be used for debugging,
 * visit the Codex.
 *
 * @link https://codex.wordpress.org/Debugging_in_WordPress
 */
define('WP_DEBUG', false);

/* That's all, stop editing! Happy blogging. */

/** Absolute path to the WordPress directory. */
if ( !defined('ABSPATH') )
	define('ABSPATH', dirname(__FILE__) . '/');

/** Sets up WordPress vars and included files. */
require_once(ABSPATH . 'wp-settings.php');
