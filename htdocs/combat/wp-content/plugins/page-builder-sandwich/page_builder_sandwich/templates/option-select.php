<script type="text/html" id="tmpl-pbs-option-select">
	<div class="pbs-option-subtitle">{{ data.name }}</div>
	<select>
		<# for ( var value in data.options ) { #>
			<# if ( value.match( /^\!/ ) ) { #>
				<option value="{{ value }}" disabled="disabled">{{ data.options[ value ] }}</option>
			<# } else if ( data.value === value ) { #>
				<option value="{{ value }}" selected="selected">{{ data.options[ value ] }}</option>
			<# } else { #>
				<option value="{{ value }}">{{ data.options[ value ] }}</option>
			<# } #>
		<# } #>
	</select>
	<# if ( data.desc ) { #>
		<p class="pbs-description">{{{ data.desc }}}</p>
	<# } #>
</script>
