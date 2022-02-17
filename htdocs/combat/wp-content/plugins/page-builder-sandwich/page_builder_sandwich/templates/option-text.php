<script type="text/html" id="tmpl-pbs-option-text">
	<div class="pbs-option-subtitle">{{ data.name }}</div>
	<input type="text" value="{{ data.value }}"/>
	<# if ( data.desc ) { #>
		<p class="pbs-description">{{{ data.desc }}}</p>
	<# } #>
</script>
