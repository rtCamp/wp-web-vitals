<?php
/**
 * Main plugin class.
 *
 * @author  Towhidul Islam <towhidul@rtcamp.com>
 *
 * @package web-vitals-admin-bar
 */

namespace Web_Vitals_Admin_Bar\Inc;

use Web_Vitals_Admin_Bar\Inc\Traits\Singleton;

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
		add_action( 'admin_bar_menu', array( $this, 'add_admin_bar_menu_items' ) );
		add_action( 'wp_enqueue_scripts', array( $this, 'web_vitals_enqueue_scripts' ), 1 );
		add_action( 'wp_head', array( $this, 'web_vitals_enqueue_styles' ), 1 );
	}

	/**
	 * To enqueue script for web vitals.
	 *
	 * @return void
	 */
	public function web_vitals_enqueue_scripts() {
		wp_enqueue_script( 'wp_web_vital_script', sprintf( '%s/assets/js/script.js', WEB_VITALS_ADMIN_BAR_URL ), array( 'jquery' ), WEB_VITALS_ADMIN_BAR_VERSION, false );
	}

	/**
	 * To enqueue style for web vitals.
	 *
	 * @return void
	 */
	public function web_vitals_enqueue_styles() {
		wp_register_style( 'wp_web_vital_style', sprintf( '%s/assets/css/style.css', WEB_VITALS_ADMIN_BAR_URL ), array(), WEB_VITALS_ADMIN_BAR_VERSION );
		wp_enqueue_style( 'wp_web_vital_style' );
	}

	/**
	 * Add menu items to admin bar for Web Vitals.
	 *
	 */
	public function add_admin_bar_menu_items() {
		global $wp_admin_bar;

		if ( is_admin() ) {
			return;
		}

		$node = array(
			'id'     => 'web_vitals_admin_bar',
			'parent' => 'top-secondary',
			'title'  => '<div id="web-vitals-admin-container"">
				<div class="fcp web-vitals-admin-bar">
					<div class="web-vitals-good"></div>
					<div class="web-vitals-ni"></div>
					<div class="web-vitals-poor"></div>
				</div>
				<div class="lcp web-vitals-admin-bar">
					<div class="web-vitals-good"></div>
					<div class="web-vitals-ni"></div>
					<div class="web-vitals-poor"></div>
				</div>
				<div class="fid web-vitals-admin-bar">
					<div class="web-vitals-good"></div>
					<div class="web-vitals-ni"></div>
					<div class="web-vitals-poor"></div>
				</div>
				<div class="cls web-vitals-admin-bar">
					<div class="web-vitals-good"></div>
					<div class="web-vitals-ni"></div>
					<div class="web-vitals-poor"></div>
				</div>
			</div>',
			'href'   => '#',
		);

		$wp_admin_bar->add_node( $node );
	}

}
