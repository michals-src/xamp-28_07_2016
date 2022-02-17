<script type="text/html" id="tmpl-pbs-preview-premium-element">
	<div class="pbs-lite-preview-lightbox">
		<div class="pbs-lite-preview-description">
			<h2>{{ data.title }}</h2>
			<p>{{{ data.description }}}</p>
			<p>
				<a href="https://pagebuildersandwich.com/buy/?utm_source=lite-plugin&utm_medium=preview&utm_campaign=Page%20Builder%20Sandwich" target="_blank"><?php _e( 'Go Premium Now', PAGE_BUILDER_SANDWICH ) ?></a>
			</p>
			<p class="pbs-lite-preview-note"><?php _e( 'Click anywhere to close', PAGE_BUILDER_SANDWICH ) ?></p>
		</div>
		<div class="pbs-lite-preview-image">
			<img src="{{ data.image }}"/>
		</div>
	</div>
</script>
