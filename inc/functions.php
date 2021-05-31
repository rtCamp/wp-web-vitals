<?php
/**
 * Don't load directly.
 *
 * @package wp-web-vitals
 */

if ( ! defined( 'ABSPATH' ) ) {
	die( '-1' );
}

/**
 * Check if AMP plugin is active.
 *
 * @return bool
 */
function wp_web_vitals_is_amp() {

	return function_exists( 'amp_is_request' ) && amp_is_request();

}
