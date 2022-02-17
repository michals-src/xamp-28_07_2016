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
define('DB_NAME', 'montessori');

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
define('AUTH_KEY',         'y;Ec0 v~Zv3nFqNs-}$|rYQsp.p:`%Z0#p.m!L[bAl)._#z4?5T!,P613O{ _0U*');
define('SECURE_AUTH_KEY',  't-M7m7K)+O=8VD? mgtOf>y1RICyN@JF2ycM(%%I<zT78uq:b@:SWdke}{XBHCWA');
define('LOGGED_IN_KEY',    '{?=52*#`7VteR+|C;CStL,pw!w](GQBo.$baq:6D&upc=PK^Q>A[k<`B4vF<DVPk');
define('NONCE_KEY',        'IB&czkf0,QS/M(h`CA#=n S0N+Gb^$#[L^e|>!Ol,q,:?H/H6gg}v`8*WtG=J8Ii');
define('AUTH_SALT',        'c)CA,4ngY69f(^FqiAg[P#D/)!U:4oZ-mr%IAm{5w]BLoHDMxZ!:Th6-;gQN_EU)');
define('SECURE_AUTH_SALT', 'o=`%$nuPmDoR=7C0ZW0kj~u_^J+JEsskyex)9iujg`:rA8G|C%TETSn+kLt;xxB[');
define('LOGGED_IN_SALT',   'S0l9M<X}n)pH^4=q96cj6eG-rxOxf![^.DH71OM5Q#iFJ.rRi)XC^im)HXj&xi.]');
define('NONCE_SALT',       '^bH4e0LsSh^CX$d_@nkaQ&+1w4X~`1/HQ`h1qo*%?k8H%=H$%8>hR%6FVHbEM&b*');

/**#@-*/

/**
 * WordPress Database Table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 */
$table_prefix  = 'as_';

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
