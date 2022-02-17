(function( $ ) {


/**
 *
 * Okno modal
 *
 */

 	var Modal = {
	 		Buttons: 'a[data-modal], button[data-modal], input[data-modal]',
	 		Submit: 'button[data-modal-submit]',
	 		HideButton: '.modal-exit',
	 		Verify 	: function( item ){
	 			return ( item.data('modal') ) ? item.data('modal') : false;
	 		},
	 		Opened	: function( item ){
	 			return ( item.hasClass( 'in' ) ) ? true : false;
	 		},
	 		Active: function(){
	 			return $('.modal-field.in');
	 		},
	 		Show	: function(){

	 			var _self 	 = $(this),
	 				_modal 	 = Modal.Verify( _self );

	 			if( _modal )
	 			$( '#' + _modal ).addClass('in');

	 			return false;

	 		},
	 		Close 	: function( e , item ){

				var _this 	 = (item) ? item : $(this);
					_parent  = _this.closest('.modal-field'),
					_isIN	 = Modal.Opened( _parent );

				if(_isIN)
				_parent.removeClass('in');

				return false;

	 		},
	 		Submitted : function( e ){

	 			var _this = ( $(this) ) ? $(this) : e.currentTarget,
	 				_data = _this.data('modal-submit'),
	 				_cond = (e.data) ? e.data[0] : null,
	 				_func = (e.data) ? e.data[1] : null;

	 			if( _data === _cond )

	 			_func.call(_this);

	 			return false;

	 		},
	 		/**	
	 		* Funkcja zamienia atrybut id elementów formularza
	 		* znajdujących się w otwartym oknie modalnym
	 		* na wartość dodaną do tablicy o nazwie atrybutu id z 
	 		* wcześniej wpisaną wartością w polu
	 		*/
	 		FormValues: function( parent ){

	 			var _form 	 = $(parent),
	 				_values  = [];

	 			_form.find('.form-property').each( function(key, value) {

	 	 			var _this 	= $(value),
	 	 				_id 	= (_this.attr('id')) ? _this.attr('id') : null,
	 	 				_class	= (_this.attr('class')) ? _this.attr('class') : null,
	 	 				_value 	= _this.val(),
	 	 				_type	= typeof _this;

	 	 			_values[_id] = {$element: _this, id: _id, class: _class, value: _value, type: _type};

	 	 		});

	 	 		return _values;

	 		}	
 	}

 	$(Modal.Buttons).on('click', Modal.Show);
 	$(Modal.HideButton).on('click', Modal.Close);


/**
* Roll
*/

	var Roll = {

		Buttons: 'a[data-roll], button[data-roll], input[data-roll]',
		Opened: function( element ){
			return ( element.hasClass('in') && element.data('expanded') === true) ? true : false;
		},
		Event: function(){

			var _this = $(this),
				_data = (_this.data('roll')) ? _this.data('roll') : null,
				_target = $(document).find(_data);

			if( ! Roll.Opened( _target ) ){

				Roll.Show(_target);

			}else{

				Roll.Hide(_target);

			}



			return false;

		},
		Show: function( target ){
			
			var _this = target,
				_opened = $(document).find('.roll.in');

			Roll.Hide(_opened);

			_this.addClass('in');
			_this.attr('data-expanded', 'true');

		},
		Hide: function( target ){

			var _this = target;

			_this.removeClass('in');
			_this.attr('data-expanded', 'false');

		}

	}

	$(Roll.Buttons).on('click', Roll.Event);




/**
 *
 * F U N K C J E
 *
 */


 	var createResizeDiv = function() {

 		var _textField 	= $('.text-field'),
 			_content	= '';

 		_textField.on('keyup', function(){

	 		var _self 	= $(this),
	 			_value	 = _self.val(),
	 			_resizer = _self.closest('td').find('.text-field-resizer');

	 		_content = _value;
	 		_content = _content.replace(/\n/g, '<br>');
	 		_resizer.html(_content + '<br class="line-break">');

	 		_self.css('height', $(_resizer).height());

	 	});

 	}


 	/*
     * Tabela
 	 */

 	 var Table = {

 	 	Buttons: {
 	 		Array: [],
 	 		Events: {
 	 			interface: function(e){

	 	 		 	var _this = ( $(this) ) ? $(this) : e.currentTarget,
		 				_func = (e.data) ? e.data[0] : null,
		 				_selected = Table.Item.Selected;

		 			_func.call(_this, _selected);

		 			return false;			

 	 			}
 	 		},
 	 		Permissions: {

 	 			Array: {
 	 				realObject: 0,
 	 				items: [],
 	 				result: [],
 	 				permit: []
 	 			},
 	 			Init: function(){

 	 				// (bool) Parametr mówiący czy wszystkie zaznaczone elementy można połączyć ze sobą
	 	 			Table.Buttons.Permissions.Array.permit.join = false;
	 	 			// (bool) Parametr mówiący czy jest zaznaczony tylko jeden element
	 	 			Table.Buttons.Permissions.Array.permit.oneItem = false;
	 	 			// (bool) Parametr mówiący czy wszystkie zaznaczone elementy tworzą 1 kolumnę
	 	 			Table.Buttons.Permissions.Array.permit.oneColumn = false;
	 	 			// (bool) Parametr mówiący czy wszystkie zaznaczone elementy tworzą 1 rząd
	 	 			Table.Buttons.Permissions.Array.permit.oneRow = false;
	 	 			// (bool) Parametr mówiący czy wszystkie zaznaczone elementy tworzą kolumnę
	 	 			Table.Buttons.Permissions.Array.permit.isColumn = false;
	 	 			// (bool) Parametr mówiący czy wszystkie zaznaczone elementy tworzą rząd
	 	 			Table.Buttons.Permissions.Array.permit.isRow = false;
	 	 			// (bool) Parametr mówiący o ilości rzędów
	 	 			Table.Buttons.Permissions.Array.permit.existsRows = 0;

	 	 			Table.Buttons.Permissions.setNeighbors();
	 	 			Table.Buttons.Permissions.Verify();

 	 			},
 	 			Verify: function(){

 	 				var Permissions = Table.Buttons.Permissions.Get(),
 	 					Buttons = 'button[data-et], a[data-et]',
 	 					_count = 0;

 	 				$(Buttons).each(function( key, value ) {

 	 					var _this = $(this),
 	 						_permission = _this.data('et'),
 	 						_enabled = false;

 	 					$.each(_permission, function( k,v ){
 	 						if( (Permissions[v] && ! _enabled) || v === 'all' && Table.Buttons.Permissions.Array.items.length > 0){
 	 							_enabled = true;
 	 						}
 	 					});

 	 					if(_enabled){
 	 						_this.removeAttr('disabled', '');
 	 					}else{
 	 						_this.attr('disabled', 'disabled');
 	 					}

 	 					_count = 0;

 	 				});

 	 			},
 	 			Get: function(){
 	 				return Table.Buttons.Permissions.Array.permit;
 	 			},
 	 			setNeighbors: function(){

 	 				Table.Buttons.Permissions.Array.items = [];

 	 				var realObject = Table.Buttons.Permissions.Array.realObject,
 	 					items = Table.Buttons.Permissions.Array.items;

	 	 			$.each(Table.Item.Selected, function( k, v ) {

	 	 				if( ! $.isEmptyObject(v) ){
	 	 					realObject++;
	 	 				}

	 	 				$.each(v, function( key, value ) {

	 	 					if(value && Table.Buttons.Permissions.Array.permit.existsRows < realObject){
	 	 						Table.Buttons.Permissions.Array.permit.existsRows++;
	 	 					}

	 	 					
	 	 					var row = value.row,
	 	 						col = value.col,
	 	 						neighbor = [];

	 	 					if(Table.Item.Selected[row][col - 1]){
	 	 						neighbor.left = true;
	 	 					}else{
	 	 						neighbor.left = false;
	 	 					}

	 	 					if(Table.Item.Selected[row][col + 1]){
	 	 						neighbor.right = true;
	 	 					}else{
	 	 						neighbor.right = false;
	 	 					}

	 	 					if(Table.Item.Selected[row - 1] && Table.Item.Selected[row - 1][col]){
	 	 						neighbor.top = true;
	 	 					}else{
	 	 						neighbor.top = false;
	 	 					}

	 	 					if(Table.Item.Selected[row + 1] && Table.Item.Selected[row + 1][col]){
	 	 						neighbor.bottom = true;
	 	 					}else{
	 	 						neighbor.bottom = false;
	 	 					}

	 	 					items.push(neighbor);

	 	 				});

	 	 			});


	 	 			Table.Buttons.Permissions.setResults();

 	 			},
 	 			setResults: function(){

 	 			 	var $left = 0,
	 	 				$right = 0,
	 	 				$top = 0,
	 	 				$bottom = 0,
	 	 			
	 	 				result =  Table.Buttons.Permissions.Array.result,
 	 					items = Table.Buttons.Permissions.Array.items;

	 	 			$.each(items, function(key, value) {

	 	 				if(value.right){
	 	 					$right++;
	 	 				}
	 	 				if(value.left){
	 	 					$left++;
	 	 				}
	 	 				if(value.top){
	 	 					$top++;
	 	 				}
	 	 				if(value.bottom){
	 	 					$bottom++;
	 	 				}

	 	 			});	


	 	 			var existsRows = Table.Buttons.Permissions.Array.permit.existsRows;

 	 				if( $right === (items.length - existsRows) ){
	 	 				result.right = true;
	 	 			}else{
	 	 				result.right = false;
	 	 			}

	 	 			if( $left === (items.length - existsRows) ){
	 	 				result.left = true;
	 	 			}else{
	 	 				result.left = false;
	 	 			}

	 	 			var a = items.length / Table.Buttons.Permissions.Array.permit.existsRows;
	 	 			var b = Table.Buttons.Permissions.Array.permit.existsRows;

	 	 			if( $bottom === (a * b) - a ){
	 	 				result.bottom = true;
	 	 			}else{
	 	 				result.bottom = false;
	 	 			}

	 	 			if( $top === (a * b) - a ) {
	 	 				result.top = true;
	 	 			}else{
	 	 				result.top = false;
	 	 			}


	 	 			Table.Buttons.Permissions.set();

 	 			},
 	 			set: function(){

	 	 				var result = Table.Buttons.Permissions.Array.result;

		 	 			if( Table.Buttons.Permissions.Array.permit.existsRows === 1 ){

		 	 				if( result.left && result.right && Table.Buttons.Permissions.Array.items.length !== 1){
		 	 					Table.Buttons.Permissions.Array.permit.join = true;
		 	 				}else{
		 	 					Table.Buttons.Permissions.Array.permit.join = false;
		 	 				}

		 	 				Table.Buttons.Permissions.Array.permit.oneRow = true;

		 	 				if( Table.Buttons.Permissions.Array.items.length === 1){
		 	 					Table.Buttons.Permissions.Array.permit.oneColumn = true;
		 	 				}

		 	 			}else if( Table.Buttons.Permissions.Array.permit.existsRows > 1){

		 	 				if( result.top && result.bottom && result.left && result.right ){
		 	 					Table.Buttons.Permissions.Array.permit.join = true;
		 	 				}else{
		 	 					Table.Buttons.Permissions.Array.permit.join = false;
		 	 				}

		 	 				if( Table.Buttons.Permissions.Array.permit.existsRows === Table.Buttons.Permissions.Array.items.length ){
		 	 					Table.Buttons.Permissions.Array.permit.oneColumn = true;
		 	 				}else{
		 	 					Table.Buttons.Permissions.Array.permit.oneColumn = false;
		 	 				}

		 	 				if( Table.Buttons.Permissions.Array.permit.join ){
		 	 					Table.Buttons.Permissions.Array.permit.isRow = true;
		 	 					Table.Buttons.Permissions.Array.permit.isColumn = true;
		 	 				}else{
		 	 					Table.Buttons.Permissions.Array.permit.isRow = false;
		 	 					Table.Buttons.Permissions.Array.permit.isColumn = false;
		 	 				}

		 	 				Table.Buttons.Permissions.Array.permit.oneRow = false;

		 	 			}

			 	 		if(Table.Item.Count == 1){
							Table.Buttons.Permissions.Array.permit.oneItem = true;
							Table.Buttons.Permissions.Array.permit.join = false;
						}else{
							Table.Buttons.Permissions.Array.permit.oneItem = false;
						}

	 	 		}

 	 		} // Permissions
 	 	},

 	 	create: function(){

 	 		var _this = $(this),
 	 			_form = Modal.Active().find('form'),
 	 			_values = Modal.FormValues(_form);

				Modal.Close(false, _this);

				$(document).find('.entry-current-content .table-content').html('<table></table>');

				for( var __intX = 0; __intX <= (_values.setRows.value - 1); __intX++ ){

					$(document).find('.entry-current-content .table-content table').append('<tr data-tr="' + __intX + '" style="text-align:center;">');

					for( var __intA = 0; __intA <= (_values.setCol.value - 1); __intA++ ){

						var _textarea = $(document.createElement('textarea'));

						_textarea.attr('name', 'text-field(' + __intX + ':' + __intA + ')[]');
						_textarea.addClass('text-field');

						$(document).find('.entry-current-content .table-content table tr[data-tr="' + __intX + '"]').append('<td class="td-text-field" rowspan="1" colspan="1" data-col="' + __intA + '" data-row="' + __intX + '" style="width: 130px;">' + _textarea[0].outerHTML + '<div class="text-field-editor-content"></div></td>');
					
					}

					$(document).find('.entry-current-content table').append('</tr>');

				}

				$('.entry-montessori-box .entry-content').css({'display': 'block'});
				$('.entry-montessori-box .entry-content-none').css({'display': 'none'});

				Table.Buttons.Permissions.Init();

				return false;

 	 	},
 	 	Item: {

 	 		Buttons: 'th, td',
 	 		Selected: [],
 	 		Count: 0,
 	 		Select: function(){

				var _this = $(this),
					_isIN = _this.hasClass('in'),
					_row = _this.data('row'),
					_col = _this.data('col'),
					_rowspan = _this.attr('rowspan'),
					_colspan = _this.attr('colspan');

				if( ! _isIN ){

					Table.Item.Count++;

					_this.addClass('in');
					_this.find('textarea').focus();

					var _group = (_rowspan > 1 || _colspan > 1) ? true : false;

					for(var yLine = 0;yLine <= (_rowspan - 1);yLine++){

						if( ! Table.Item.Selected[_row + yLine] ){
							Table.Item.Selected[_row + yLine] = {};
						}

						for(var xLine = 0;xLine <= (_colspan - 1);xLine++){
							Table.Item.Selected[_row + yLine][_col + xLine] = {this: _this, row: (_row + yLine), col: (_col + xLine), rowspan: _rowspan, colspan: _colspan, group: _group};
						}

					}

				}else{

					Table.Item.Count--;

					_this.removeClass('in');

					for(var yLine = 0;yLine <= (_rowspan - 1);yLine++){
						for(var xLine = 0;xLine <= (_colspan - 1);xLine++){
							delete Table.Item.Selected[_row + yLine][_col + xLine];
						}
					}

	 	 		}

	 	 		Table.Buttons.Permissions.Init();

	 	 	},
	 	 	getActive: function(){

				var _selected = Table.Item.Selected;

				var _active = {
					this: null,
					textarea: null,
					content: null,
					count: 0
				};

				$.each( _selected, function( key, value) {
					$.each( value, function( k, v) {

						_active.this = v.this;
						_active.textarea = _active.this.find('textarea');
						_active.content = _active.this.find('.text-field-editor-content');

						_active.count++;

					});
				});

				return _active;


	 	 	}

 	 	}

 	 }

 	 /*  Przycisk "Submit" tworzenia tabeli */
	$(Modal.Submit).on('click', ['create-table', Table.create], Modal.Submitted);

	/* Zaznaczanie elementów tabeli */
	$(document).on('click', Table.Item.Buttons, Table.Item.Select);


 	Table.Buttons.Events.Editor = {

 	 	Open: function(){

 	 		if( Modal.Opened( $('#ceilContentEditor') ) ){

				var _content = tinymce.get('ceilContent');
				var _active = Table.Item.getActive();

				if(Table.Item.Count === 1){
					_content.setContent(_active.textarea.val());
				}

			}

		},

		Save: function(){

			var _content = tinymce.get('ceilContent');
			var _active = Table.Item.getActive();

			if(Table.Item.Count === 1){

				var _get = _content.getContent();

				$(_active.this).find( _active.textarea ).attr('value', _get);
				$(_active.this).find( _active.content ).html(_get);

			}

			Modal.Close( false, Modal.Active() );

			return false;

		}

 	 }

	/* !---- Okno modalne z edytorem wordpress ----! */
	$(Modal.Buttons).on('click', Table.Buttons.Events.Editor.Open);
	$(Modal.Submit).on('click', ['advance-content', Table.Buttons.Events.Editor.Save], Modal.Submitted);


	Table.Buttons.Events.MergeCells = function( Selected ){

		var _neighbours = Table.Buttons.Permissions.Array.items,
			_rowspan = Table.Buttons.Permissions.Array.permit.existsRows,
			_colspan = _neighbours.length / _rowspan,
			__firstItem = null,
			__isGroup = false,
			__Values = [];

		$.each(Selected, function( key, value ){

			$.each(value, function( k, v){

				var _this = v.this,
					_value = _this.find('textarea').val(),
					_group = v.group;

				if( ! __firstItem ){
					__firstItem = _this;
				}

				if( _group && ! __isGroup ){
					__Values.push(_value);
					__isGroup = true;
				}else if( ! _group ){
					__Values.push(_value);
				}

				if( _this !== __firstItem ){

					$(document).find(_this).remove();

				}

			});

		});

		__firstItem.attr('colspan', _colspan);
		__firstItem.attr('rowspan', _rowspan);
		__firstItem.find('textarea').attr('value', '');
		__firstItem.find('textarea').attr('value', __Values.join(''));
		__firstItem.find('.text-field-editor-content').html(__Values.join(''));
		__firstItem.removeClass('in');

		Table.Item.Selected = [];
		Table.Item.Count = 0;
		Table.Buttons.Permissions.Init();

	}
	$('button[data-event="mergecells').on('click', [Table.Buttons.Events.MergeCells], Table.Buttons.Events.interface);

	Table.Buttons.Events.DeleteCells = function( Selected ){

		$.each(Selected, function( key, value ){
			$.each(value, function( k, v){

				var _this = v.this;
				$(document).find(_this).remove();

			});
		});

		Table.Item.Selected = [];
		Table.Item.Count = 0;
		Table.Buttons.Permissions.Init();

	}
	$('button[data-event="deletecells').on('click', [Table.Buttons.Events.DeleteCells], Table.Buttons.Events.interface);
	
	Table.Buttons.Events.DeleteRows = function( Selected ){

		$.each(Selected, function( key, value ){
			$.each(value, function( k, v){

				var _this = v.this,
					_rowSpan = v.rowspan;
				$(_this).closest('tr').remove();

			});
		});

		$('table tr').each(function( key, value ){
			
			var _this = $(this),
				_childrens = 'td';

			_this.attr('data-tr', _this.index());
			_this.find(_childrens).attr('data-row', _this.index());

		});

		Table.Item.Selected = [];
		Table.Item.Count = 0;
		Table.Buttons.Permissions.Init();

	}
	$('button[data-event="deleterows').on('click', [Table.Buttons.Events.DeleteRows], Table.Buttons.Events.interface);

	Table.Buttons.Events.AddRowUp = function( Selected ){

		var created = false,
			row = null;

		$.each(Selected, function( key, value ){
			$.each(value, function( k, v){

				var _this = v.this;

				if( ! created ){
					row = $(document.createElement('tr'));
					var _thisRow = $(_this).closest('tr');
					_thisRow.before(row);
				}

			});
		});

		if(created){
			created = false;
		}

		var columnsCount = $('table').find('tr').first().find('td').length;
		for(var o = 0;o<columnsCount;o++){
			var td = $(document.createElement('td'));
			td.attr('colspan', '1');
			td.attr('rowspan', '1');
			td.attr('data-col', o);
			row.append(td);
		}

		$('table tr').each(function( key, value ){
			
			var _this = $(this),
				_childrens = 'td';

			_this.attr('data-tr', _this.index());
			_this.find(_childrens).attr('data-row', _this.index());

		});

		Table.Item.Selected = [];
		Table.Item.Count = 0;
		Table.Buttons.Permissions.Init();

	}
	$('button[data-event="addrowup').on('click', [Table.Buttons.Events.AddRowUp], Table.Buttons.Events.interface);







/**

	Lista

		- (+) poprawić pole komórki. Edycja tylko przez wp_editor. Treść wyświetlana w komórce z wp_editor. Dane z edytora zapisywane w textarea.
		 przycisk w komórce lub obok z przejściem do okna modal z edytorem zaznaczonej komórki
		- (+) poprawić Table.Buttons.Permissions.Array.Join aby dobrze działało gdy komórka zajmuje więcej niż 1 wiersz lub kolumnę
		
		- Poprawić funkcję scalania komórek // aktualnie zaznaczone komórki łączą się z komórkami połączonymi poprzednio
		  // Po scaleniu komórek głowna komórka nie jest odznaczona i występuje problem z dostępnością przycisku "scal komórki"
		  // Funkcja usuwania ma ten sam problem

		- (+) przyzwolenia dla przycisków dla jakiej ilości zaznaczonych elementów mają być dąstępne
		- dodać przyciski odpowiednia dla komórki / kolumna / wiersz
		- zaprogramować przyciski
		- dodanie szablonów dla tabeli
		- dodanie <thead> i <tbody> // wybór czy tabela ma być z nagłówkiem (elementy th) czy nie
		- zapisywanie tabeli w formie array
		- stworzenie konwertera zamieniającego tabele w formie array na html
		- stworzenie responsywnych tabeli dla urząrzeń przenośnych
		- doanie shortcode



*/



})(jQuery);