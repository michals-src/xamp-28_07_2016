<div class="panel-group" id="fieldAdvancedCont">
  <div class="panel panel-default">
    <div class="panel-heading">
      <h4 class="panel-title">
        <a data-toggle="collapse" href="#collapseAdvanced<%= cssID %>">
          <?php smuzform_translate_e( 'Opcje zaawansowane' ) ?>
        </a>
      </h4>
    </div>
    <div id="collapseAdvanced<%= cssID %>" class="panel-collapse collapse">
      <div class="panel-body">
      	
      	<div class="form-group">
			<label for="fieldCssClasses"><?php smuzform_translate_e('CSS Klasy') ?></label>
			<input id="fieldCssClasses" type="text" value="<%- cssClasses %>" class="form-control" />
			<p class="description"><?php smuzform_translate_e( 'Klasy powinny być oddzielone spacją.' ) ?></p>
		</div>

      </div>
      
      <div class="panel-footer">
        
      </div>

    </div>
  </div>
</div>