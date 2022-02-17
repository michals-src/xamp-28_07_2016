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
define('DB_NAME', 'wp_learn');

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
define('AUTH_KEY',         '6+QatHEdP0uoW}~c~(Kfi=q]=^:u1j)(DN`*?M{f6^&k>`ht+p5&xLsuNyb;Q8]U');
define('SECURE_AUTH_KEY',  'ietLzvp1^)s.` x$?XN4 nn f<%{Ln]<<UI& WDII5*-b!+CzEt:^q-=npHs-4A`');
define('LOGGED_IN_KEY',    'Q]JcvlB@t >=5P62:aT} >;])i1?fz{Ej_S$$|b7X`L5^9Oo}3NhEMU$20wp;= C');
define('NONCE_KEY',        'cbJ$4Pe(;nd/kcD1FJ7r,24}sxWX5z;/i~}uai:F,p6NfWRAjm(DO_ m;gZ]z#aK');
define('AUTH_SALT',        '3_#zh9?h3f]}E^b9]x#<9?wa5waCvS?7BE5pgVZ,wY2R?q*7U(v;Ue/;##4@]Bj*');
define('SECURE_AUTH_SALT', 'd@&FPdP0zU**4K5H$G!]bzbuN]w5n)VmB+08W13W{.7)f^.S72(3O!x~I?rf2l{J');
define('LOGGED_IN_SALT',   'XC8V +#.S oI6[`? FK&(}mQKo2K7$Khoe{ItKr|4L.Jg*zVzZu5qnx-$gEKvr#[');
define('NONCE_SALT',       '[`XkOFwVBuH_Nt7ATK@hkvUM{*jC9E O6uZk3sa~9&Jf=6O#Z?YDF~:Z_PG4$?m<');

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
