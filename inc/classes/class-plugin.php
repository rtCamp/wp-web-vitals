<?php
/**
 * Main plugin class.
 *
 * @author  Towhidul Islam <towhidul@rtcamp.com>
 *
 * @package wp-web-vitals
 */

namespace WP_Web_Vitals\Inc;

use WP_Web_Vitals\Inc\Traits\Singleton;

/**
 * Class Plugin
 */
class Plugin {

	use Singleton;

	/**
	 * Plugin constructor.
	 */
	protected function __construct() {
		$this->setup_hooks();
	}

	/**
	 * To setup actions/filters.
	 *
	 * @return void
	 */
	protected function setup_hooks() {
		/**
		 * Actions
		 */
		add_action( 'admin_bar_menu', [ $this, 'add_admin_bar_menu_items' ] );
		add_action( 'wp_enqueue_scripts', [ $this, 'web_vitals_enqueue_scripts' ], 1 );
		add_action( 'wp_head', [ $this, 'web_vitals_enqueue_styles' ], 1 );
		add_action( 'admin_menu', [ $this, 'admin_menu' ] );
		add_action( 'admin_init',  [ $this, 'register_setting' ] );
	}

	/**
	 * To enqueue script for web vitals.
	 *
	 * @return void
	 */
	public function web_vitals_enqueue_scripts() {
		wp_enqueue_script( 'wp_web_vitals_script', sprintf( '%s/assets/js/script.js', WP_WEB_VITALS_URL ), [ 'jquery' ], WP_WEB_VITALS_VERSION, false );

		wp_localize_script(
			'wp_web_vitals_script',
			'wpWebVitals',
			[
				'cruxApiKey' => get_option( 'wp_web_vitals_crux_api_key' ),
			]
		);
	}

	/**
	 * To enqueue style for web vitals.
	 *
	 * @return void
	 */
	public function web_vitals_enqueue_styles() {
		wp_register_style( 'wp_web_vitals_style', sprintf( '%s/assets/css/style.css', WP_WEB_VITALS_URL ), [], WP_WEB_VITALS_VERSION );
		wp_enqueue_style( 'wp_web_vitals_style' );
	}

	/**
	 * Add menu items to admin bar for Web Vitals.
	 */
	public function add_admin_bar_menu_items() {
		global $wp_admin_bar, $wp;

		if ( is_admin() ) {
			return;
		}

		$node = [
			'id'     => 'web_vitals_admin_bar',
			'parent' => 'top-secondary',
			'title'  => '<div id="web-vitals-admin-container"></div>',
			'href'   => '#',
		];

		if ( wp_web_vitals_is_amp() ) {
			$data = [
				'currentURL' => home_url( add_query_arg( [], $wp->request ) ),
				'cruxApiKey' => get_option( 'wp_web_vitals_crux_api_key' ),
			];

			ob_start();
			require_once WP_WEB_VITALS_PATH . '/templates/amp-script.php';
			$amp_script = ob_get_clean();
			$node['title'] = $amp_script;
		}

		$wp_admin_bar->add_node( $node );
	}

	/**
	 * Add admin menu
	 */
	public function admin_menu() {
		add_options_page(
			__( 'WP Web Vitals', 'wp-web-vitals' ),
			__( 'WP Web Vitals', 'wp-web-vitals' ),
			'manage_options',
			'wp-web-vitals',
			[
				$this,
				'admin_option_page'
			]
		);
	}

	/**
	 * Admin settings page display callback.
	 */
	public function admin_option_page() {
		require_once WP_WEB_VITALS_PATH . '/templates/admin-option-page.php';
	}

	/**
	 * Register admin settings
	 */
	public function register_setting(){

		register_setting( 'wp_web_vitals', 'wp_web_vitals_crux_api_key' );

		add_settings_section(
			'wp_web_vitals_general',
			'',
			'',
			'wp-web-vitals'
		);


		add_settings_field(
			'wp_web_vitals_crux_api_key',
			__( 'Chrome UX Report API Key', 'wp-web-vitals' ),
			[ $this, 'api_key_option_html' ],
			'wp-web-vitals',
			'wp_web_vitals_general',
			[
				'label_for' => 'wp_web_vitals_crux_api_key',
				'class' => 'crux-api-key',
			]
		);

	}

	/**
	 * Admin settings page API Key option field
	 */
	public function api_key_option_html(){
		$api_key = get_option( 'wp_web_vitals_crux_api_key' );
		require_once WP_WEB_VITALS_PATH . '/templates/admin-option-api-key.php';
	}
}
