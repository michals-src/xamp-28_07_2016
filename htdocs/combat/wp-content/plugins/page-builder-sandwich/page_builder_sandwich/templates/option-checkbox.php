<script type="text/html" id="tmpl-pbs-option-checkbox">
	<label>
		<# var checked = data.value === data.checked ? 'checked' : ''; #>
		<input type="checkbox" value="1" {{ checked }} />
		{{ data.name }}
	</label>
	<# if ( data.desc ) { #>
		<p class="pbs-description">{{{ data.desc }}}</p>
	<# } #>
</script>
