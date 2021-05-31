<amp-state id="wpWebVitals">
  <script type="application/json">
	<?php echo json_encode( $data ); ?>
  </script>
</amp-state>
<amp-script src="<?php esc_attr_e( sprintf( '%s/assets/js/script.amp.js', WP_WEB_VITALS_URL ) ); ?>" width="100" height="32">
	<div id="web-vitals-admin-container"></div>
	<style><?php echo file_get_contents( sprintf( '%s/assets/css/style.css', WP_WEB_VITALS_URL ) ); ?></style>
</amp-script>
