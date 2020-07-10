<?php
/**
 * Plugin Name: WP Web Vitals
 * Plugin URI:  https://github.com/rtCamp/wp-web-vitals
 * Description: Minimal plugin which allows WP user to login with google.
 * Version:     1.0
 * Author:      rtCamp
 * Author URI:  https://rtcamp.com
 * License:     GPL2
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: wp-web-vitals
 *
 * @package wp-web-vitals
 */

use WP_Web_Vitals\Inc\Plugin;

define( 'WP_WEB_VITALS_PATH', untrailingslashit( plugin_dir_path( __FILE__ ) ) );
define( 'WP_WEB_VITALS_URL', untrailingslashit( plugin_dir_url( __FILE__ ) ) );
define( 'WP_WEB_VITALS_PLUGIN_NAME', plugin_basename( __FILE__ ) );
define( 'WP_WEB_VITALS_VERSION', '1.0' );


// We already making sure that file is exists and valid.
require_once( sprintf( '%s/autoloader.php', WP_WEB_VITALS_PATH ) ); // phpcs:ignore
require_once( sprintf( '%s/inc/functions.php', WP_WEB_VITALS_PATH ) ); // phpcs:ignore

Plugin::get_instance();
