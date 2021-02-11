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
 * @link https://wordpress.org/support/article/editing-wp-config-php/
 *
 * @package WordPress
 */

// ** MySQL settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define( 'DB_NAME', 'portfolio_db' );

/** MySQL database username */
define( 'DB_USER', 'root' );

/** MySQL database password */
define( 'DB_PASSWORD', '' );

/** MySQL hostname */
define( 'DB_HOST', 'localhost' );

/** Database Charset to use in creating database tables. */
define( 'DB_CHARSET', 'utf8mb4' );

/** The Database Collate type. Don't change this if in doubt. */
define( 'DB_COLLATE', '' );

/**#@+
 * Authentication Unique Keys and Salts.
 *
 * Change these to different unique phrases!
 * You can generate these using the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}
 * You can change these at any point in time to invalidate all existing cookies. This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define( 'AUTH_KEY',         '.?SSH`jo`a.fJ`?HrCV$rt{@1Jz1-K=,IFp9rZ7Fwv?(R%+;/NK;47cs|X_7!MK{' );
define( 'SECURE_AUTH_KEY',  'IxG%GT]Q<[-%?cy&JNU}kOx(zmx=6}rQ{|4?G)QQN]34Nne:uSR_:.H$(C~(E9#$' );
define( 'LOGGED_IN_KEY',    'GI tdPz0uTCoHLwa RO8vFQkx$T9tx/zGIay^0P85t$t>}`Ll1Q[4e/^~boy>CLY' );
define( 'NONCE_KEY',        ']4q/vTd:ToWhv&#N$lo`gu`2oIGUKA1Ep&0b>(x!1#our>|QZ R){Bcl1WM%}eh9' );
define( 'AUTH_SALT',        'z6Xs /YN/P-=;Q%o8@2gPM-cvj&m%%KNX$8w{nQ+`aDPw4TOE*!li>c7NC0NU(Db' );
define( 'SECURE_AUTH_SALT', 'Wr9ukG TPY{}YM=x>yG^m$O{36LHK]^&%^7_]k[viC|UfjN?1ytr]8P|U_!wOkfG' );
define( 'LOGGED_IN_SALT',   '!Tp?1+z3w,7l-6WlG$99uA>A-R4:pT+McUmHA17JslF_*zCQ!jLQUNb&!e_lyuh!' );
define( 'NONCE_SALT',       'A+WK;&HZ81_gzb31VN nNNlFb:C<^9vui;jIds!8jx);Pa@LJ1 4@NP@eLd1q<(8' );

/**#@-*/

/**
 * WordPress Database Table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 */
$table_prefix = 'wp_';

/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 *
 * For information on other constants that can be used for debugging,
 * visit the documentation.
 *
 * @link https://wordpress.org/support/article/debugging-in-wordpress/
 */
define( 'WP_DEBUG', false );

/* That's all, stop editing! Happy publishing. */

/** Absolute path to the WordPress directory. */
if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', __DIR__ . '/' );
}

/** Sets up WordPress vars and included files. */
require_once ABSPATH . 'wp-settings.php';
