<div class="panel-group">
  <div class="panel panel-default">
    <div class="panel-heading">
      <h4 class="panel-title">
        <a data-toggle="collapse" href="#aformstyleSubmitBtn">
          <?php smuzform_translate_e( 'Przycisk akceptacji formularza' ) ?>
        </a>
      </h4>
    </div>
    <div id="aformstyleSubmitBtn" class="panel-collapse collapse">
      <div class="panel-body">

       <div class="form-group">

        <label for="styleSubmitBtnFontSize"><?php smuzform_translate_e( 'Wielkość liter' ) ?></label>
        <input type="number" value="<%- submitBtn.fontSize %>" id="styleSubmitBtnFontSize" class="form-control" />

       </div>

       <div class="form-group">

        <label for="styleSubmitBtnFontWeight"> 
          <input type="checkbox" id="styleSubmitBtnFontWeight" <% if ( submitBtn.fontWeight === 'bold' ) { %> <%- 'checked' %> <% } %> />
         <?php smuzform_translate_e( 'Pogrób tekst nagłówków' ) ?></label>
        
        
       </div>

       <div class="form-group">

        <label for="styleSubmitBtnAlignCenter"> 
          <input type="checkbox" id="styleSubmitBtnAlignCenter" <% if ( submitBtn.alignCenter ) { %> <%- 'checked' %> <% } %> />
         <?php smuzform_translate_e( 'Wyśrodkuj przycisk' ) ?></label>
        
        
       </div>
          
       <div class="form-group">

        <label for="styleSubmitBtnColor"><?php smuzform_translate_e( 'Kolor' ) ?></label>
        <input type="text" value="<%- submitBtn.color %>" id="styleSubmitBtnColor" class="colorpickerfield" />

       </div>

       <div class="form-group">

        <label for="styleSubmitBtnBgColor"><?php smuzform_translate_e( 'Kolor tła' ) ?></label>
        <input type="text" value="<%- submitBtn.bgColor %>" id="styleSubmitBtnBgColor" class="colorpickerfield" />

       </div>

       <div class="form-group">

        <label for="styleSubmitBtnBorderColor"><?php smuzform_translate_e( 'Kolor obramowania' ) ?></label>
        <input type="text" value="<%- submitBtn.borderColor %>" id="styleSubmitBtnBorderColor" class="colorpickerfield" />

       </div>

       <div class="form-group">

        <label for="styleSubmitBtnHoverBgColor"><?php smuzform_translate_e( 'Kolor tło po najechaniu kursorem' ) ?></label>
        <input type="text" value="<%- submitBtn.hoverBgColor %>" id="styleSubmitBtnHoverBgColor" class="colorpickerfield" />

       </div>

       <div class="form-group">
        <label for="" class=""><?php smuzform_translate_e( 'Obramowanie' ) ?></label>
        
        <div class="row nameFieldRow">

          
          <div class="form-group col-xs-3">
            <input id="styleSubmitBtnBorderSize" type="number" value="<%- submitBtn.borderSize %>" class="form-control" /> <br /> 
            <label for="styleSubmitBtnBorderSize" class="nameFieldLabelInline"><?php smuzform_translate_e( 'Wielkość' ) ?></label>
          </div>
          <div class="form-group col-xs-3">
            <input id="styleSubmitBtnBorderRadius" type="number" value="<%- submitBtn.borderRadius %>" class="form-control" /> <br /> 
            <label for="styleSubmitBtnBorderRadius" class="nameFieldLabelInline"><?php smuzform_translate_e( 'Zaokrąglonie' ) ?></label>
          </div>
          <div class="form-group col-xs-5">
            <select id="styleSubmitBtnBorderStyle" class="form-control">
              <option value="solid" <% if ( submitBtn.borderStyle === 'solid' ) { %> <%- 'selected' %> <% } %> ><?php smuzform_translate_e( 'Solid' ) ?></option>
              <option value="dotted" <% if ( submitBtn.borderStyle === 'dotted' ) { %> <%- 'selected' %> <% } %> ><?php smuzform_translate_e( 'Dotted' ) ?></option>
            </select>
            <br /> 
            <label for="styleSubmitBtnBorderStyle" class="nameFieldLabelInline"><?php smuzform_translate_e( 'Styl' ) ?></label>
          </div>

        </div>
      </div>

       <div class="form-group">
        <label for="" class=""><?php smuzform_translate_e( 'Margines' ) ?></label>
        
        <div class="row nameFieldRow">

          <div class="form-group col-xs-3">
            <input id="styleSubmitBtnMarginLeft" type="number" value="<%- submitBtn.marginLeft %>" class="form-control" /> <br /> 
            <label for="styleSubmitBtnMarginLeft" class="nameFieldLabelInline"><?php smuzform_translate_e( 'Lewo' ) ?></label>
          </div>
          <div class="form-group col-xs-3">
            <input id="styleSubmitBtnMarginRight" type="number" value="<%- submitBtn.marginRight %>" class="form-control" /> <br /> 
            <label for="styleSubmitBtnMarginRight" class="nameFieldLabelInline"><?php smuzform_translate_e( 'Prawo' ) ?></label>
          </div>
          <div class="form-group col-xs-3">
            <input id="styleSubmitBtnMarginTop" type="number" value="<%- submitBtn.marginTop %>" class="form-control" /> <br /> 
            <label for="styleSubmitBtnMarginTop" class="nameFieldLabelInline"><?php smuzform_translate_e( 'Góra' ) ?></label>
          </div>
          <div class="form-group col-xs-3">
            <input id="styleSubmitBtnMarginBottom" type="number" value="<%- submitBtn.marginRight %>" class="form-control" /> <br /> 
            <label for="styleSubmitBtnMarginBottom" class="nameFieldLabelInline"><?php smuzform_translate_e( 'Dół' ) ?></label>
          </div>

        </div>

      </div>

       <div class="form-group">
        <label for="" class=""><?php smuzform_translate_e( 'Margines wewnętrzny' ) ?></label>
        
        <div class="row nameFieldRow">

          <div class="form-group col-xs-3">
            <input id="styleSubmitBtnPaddingLeft" type="number" value="<%- submitBtn.paddingLeft %>" class="form-control" /> <br /> 
            <label for="styleSubmitBtnPaddingLeft" class="nameFieldLabelInline"><?php smuzform_translate_e( 'Lewo' ) ?></label>
          </div>
          <div class="form-group col-xs-3">
            <input id="styleSubmitBtnPaddingRight" type="number" value="<%- submitBtn.paddingRight %>" class="form-control" /> <br /> 
            <label for="styleSubmitBtnPaddingRight" class="nameFieldLabelInline"><?php smuzform_translate_e( 'Prawo' ) ?></label>
          </div>
          <div class="form-group col-xs-3">
            <input id="styleSubmitBtnPaddingTop" type="number" value="<%- submitBtn.paddingTop %>" class="form-control" /> <br /> 
            <label for="styleSubmitBtnPaddingTop" class="nameFieldLabelInline"><?php smuzform_translate_e( 'Góra' ) ?></label>
          </div>
          <div class="form-group col-xs-3">
            <input id="styleSubmitBtnPaddingBottom" type="number" value="<%- submitBtn.paddingRight %>" class="form-control" /> <br /> 
            <label for="styleSubmitBtnPaddingBottom" class="nameFieldLabelInline"><?php smuzform_translate_e( 'Dół' ) ?></label>
          </div>

        </div>

      </div>

      </div>
      
      <div class="panel-footer">
        
      </div>

    </div>
  </div>

</div>
