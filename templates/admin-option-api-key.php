<?php 
/**
 * Admin option template for CrUX API key input field.
 *
 * @package WP_Web_Vitals
 * @since 1.0.0
 */

?>

<input
	type="text"
	id="wp_web_vitals_crux_api_key"
	name="wp_web_vitals_crux_api_key"
	value="<?php esc_attr_e( $api_key ); ?>"
	class="regular-text"
/>
