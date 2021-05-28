<div class="wrap">
	<h1><?php esc_html_e( 'WP Web Vitals', 'wp-web-vitals' ); ?></h1>

	<form method="post" action="options.php" novalidate="novalidate">
		<?php
			settings_fields( 'wp_web_vitals' );
			do_settings_sections( 'wp-web-vitals' );
			submit_button();
		?>
	</form>
</div>
