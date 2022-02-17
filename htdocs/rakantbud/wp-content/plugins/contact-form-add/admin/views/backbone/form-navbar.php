<script type="text/template" id="formNavBar-template">

<li class="navBarActionsLi">
  <a id="formStyleAction"><?php smuzform_translate_e( 'Style' ) ?></a>
</li>

<li class="navBarActionsLi">
  <a id="formNotificationAction"><?php smuzform_translate_e( 'Powiadomienia' ) ?></a>
</li>

<li class="navBarActionsLi">
	<a id="formEntriesAction"><?php smuzform_translate_e( 'Otrzymane wiadomości' ) ?></a>
</li>

<li class="navBarActionsLi">
	<a id="formExportAction"><?php smuzform_translate_e( 'Umieść' ) ?></a>
</li>

<!-- Modal -->
<div id="exportModal" class="modal fade" role="dialog">
  <div class="modal-dialog">

    <!-- Modal content-->
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal">&times;</button>
        <h4 class="modal-title"><?php smuzform_translate_e( 'Umieść ' ) ?><%= title %></h4>
      </div>
      <div class="modal-body">
        <div class="form-group">
        	<label for="formShortcode"><?php smuzform_translate_e( 'Shortcode.' ) ?></label>
        	<input id="formShortcode" type="text" readonly value="[sform id='<%= tmpid %>']" class="form-control" />
        	<small><?php smuzform_translate_e( 'Służy, aby umieścić go w treści artykułu lub strony w kolejności tekstu.' ) ?></small>
        </div>
        <div class="form-group">
        	<label for="formShortcodeFunc"><?php smuzform_translate_e( 'PHP Template Function.' ) ?></label>
        	<textarea id="formShortcodeFunc" class="form-control" readonly>if ( function_exists( 'smuzform_render_form' ) ) { smuzform_render_form('<%= tmpid %>'); }</textarea>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-default" data-dismiss="modal"><?php smuzform_translate_e( 'Zamknij' ) ?></button>
      </div>
    </div>

  </div>
</div>

</script>