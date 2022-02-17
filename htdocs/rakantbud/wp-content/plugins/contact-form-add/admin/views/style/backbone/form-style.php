<div id="formStyleCont"></div>

<script type="text/template" id="formStyle-template">

<div class="form-group">
	<div class="checkbox">
		<label><input type="checkbox" id="styleEnabled" <% if ( enabled ) { %> <%- 'checked' %> <% } %> > <?php smuzform_translate_e( 'Włączony' ) ?></label>
	</div>
	<p class="description"><?php smuzform_translate_e( 'Jeśli jest wyłączony większość z stylu formularza będzie pochodziło z WP theme.' ) ?></p>
</div>

<?php include smuzform_admin_view( 'style/backbone/incsettings.php' ) ?>

</script>