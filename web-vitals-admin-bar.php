<?php
/**
 * Plugin Name: Web Vitals Admin Bar
 * Plugin URI:  https://github.com/rtCamp/web-vitals-admin-bar
 * Description: Minimal plugin which shows Web Vitals analytic graphs in the admin bar.
 * Version:     1.0
 * Author:      rtCamp
 * Author URI:  https://rtcamp.com
 * License:     GPL2
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: web-vitals-admin-bar
 *
 * @package web-vitals-admin-bar
 */

use Web_Vitals_Admin_Bar\Inc\Plugin;

define( 'WEB_VITALS_ADMIN_BAR_PATH', untrailingslashit( plugin_dir_path( __FILE__ ) ) );
define( 'WEB_VITALS_ADMIN_BAR_URL', untrailingslashit( plugin_dir_url( __FILE__ ) ) );
define( 'WEB_VITALS_ADMIN_BAR_PLUGIN_NAME', plugin_basename( __FILE__ ) );
define( 'WEB_VITALS_ADMIN_BAR_VERSION', '1.0' );


// We already making sure that file is exists and valid.
require_once( sprintf( '%s/autoloader.php', WEB_VITALS_ADMIN_BAR_PATH ) ); // phpcs:ignore
require_once( sprintf( '%s/inc/functions.php', WEB_VITALS_ADMIN_BAR_PATH ) ); // phpcs:ignore

Plugin::get_instance();
