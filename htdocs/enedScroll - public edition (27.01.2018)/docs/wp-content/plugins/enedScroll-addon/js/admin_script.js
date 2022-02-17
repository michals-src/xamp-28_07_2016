(function($){


	/**
	 * Zwraca @object []
	 */
	var structure = function( item ){

		this.build = [];
		this.target = false;

		if( $('#es-builder-output-user').val() && $('#es-builder-output-user').val() != '' && $('#es-builder-output-user').val() != '""' ){
			this.build = JSON.parse( $('#es-builder-output-user').val() );
		}

	};

	/**
		
		[
		  [0] => [
			 [0] => {
				'class': 'cols',
				'children': [
					[0] => {
						'class': 'col-xs-5 col-sm-8',
						'content': '<p>Hello world !</p>'
					}
				]
			 }
		  ]
		]

	*/

	structure.prototype.split = function( splitter ){
		
		if( ! this.target ){
			return this.target = [];
		}

		return this.target.split( splitter );

	};

	structure.prototype.tree = function(){

		var $self = this;
		var prototype = {};

		var levels = $self.split( "," );

		prototype.currentTreeLevel = false,

		prototype.map = function(){

			if( typeof levels === "undefined" ){
				levels = [];
			}

			prototype.currentTreeLevel = $self.build;

			$.each( levels, function( key, value ){

				if( typeof prototype.currentTreeLevel[value] !== "undefined" ){
					prototype.currentTreeLevel = prototype.currentTreeLevel[value];
				}else{
					prototype.currentTreeLevel = false;
				}

			});

			return prototype.currentTreeLevel;

		};

		prototype.insert = function( value ){

			if( typeof value === "undefined" ){
				value = null;
			}

			var lastIndex = parseInt( levels[levels.length - 1], 10 );

			if( levels.length === 0 ){
				var mapa = $self.build;
			}

			if( levels.length > 0 ){
				var mapa = prototype.map();
			}

			var index = mapa.push( value );

			return ( index - 1 >= 0 ) ? ( index - 1 ) : false;

		};

		prototype.clone = function(){

			var lastIndex = parseInt( levels[levels.length - 1], 10 );

			var clonedArray = $.map(prototype.map(), function (obj) {
                      return $.extend(true, {}, obj);
                  });

			var cloned = $.each( prototype.map(), function(key, value){
				if( prototype.map().length === 0  ){
					return [];
				}
				return { key: value };
			});

			//var clone = prototype.map().slice();
			var clone = JSON.parse ( JSON.stringify( prototype.map() ) );
			var $_parent = $self.build;

			if( levels.length > 1 ){
				levels.splice(-1,1);
				$self.target = levels.join(',');
				$_parent = prototype.map();
			}

			$_parent.splice( ( lastIndex + 1 ), 0, clone );

			return ( lastIndex + 1 );

			//console.log( $self.build );

		};

		prototype.erase = function(){

			var lastIndex = parseInt( levels[levels.length - 1], 10 );
			
			if( prototype.map() && typeof lastIndex === "number" ){

				if( levels.length === 1 ){
					var mapa = $self.build;
				}

				if( levels.length > 1 ){
					levels.splice(-1,1);
					$self.target = levels.join(',');
					var mapa = prototype.map();
				}

				mapa.splice( lastIndex, 1 );

			}

		};

		return prototype;

	};

	structure.prototype.add = function( path, value ){

		if( typeof path === "undefined" ){
			path = false;
		}

		this.target = path;

		return this.tree().insert( value );

	};

	structure.prototype.clone = function( path ){

		if( typeof path === "undefined" ){
			path = false;
		}

		this.target = path;

		return this.tree().clone();

	};

	structure.prototype.delete = function( path ){

		if( typeof path === "undefined" ){
			return;
		}

		this.target = path;

		this.tree().erase();

		return this.build;

	};

	structure.prototype.addArticle = function( path, properties ){

		var value = [];
		return this.add( path, value );

	};

	structure.prototype.addRow = function( path, properties ){

		var value = {
			'class': 'cols',
			'children': []
		};
		return this.add( path, value );

	};

	structure.prototype.addBreak = function( path, properties ){

		var value = {
			'class': 'clear'
		};
		return this.add( path + ',children', value );

	};

	structure.prototype.addColumn = function( path, properties ){

		var value = {
			'class': properties['class'],
			'content': properties['content']
		};
		return this.add( path + ',children', value );

	};

	structure.prototype.prepareTo = function( input ){

		$(input).val( JSON.stringify( this.build ) );

	};


	var es_builder = new structure();

	/**
		GLOBAL ELEMENTS
	*/
	var es_builder_elements = {
		'content': $('#es-builder-content'),
		'content_fill': $('#es-builder-content .fill-content'),
		'content_null': $('#es-builder-content .empty-content'),
		'memorizer': $('#es-builder-content .empty-content'),
		'push_container': null
	}

	var es_button_action = $('a[role="btn-action"]');

	//var es_builder_structure = $('a[role="btn-action"]');

	function null_content(){
		if( es_builder_elements.content_fill.find( 'article' ).length <= 0 ){
			es_builder_elements.content_null.css( 'display', 'block' );
		}else{
			es_builder_elements.content_null.css( 'display', 'none' );
		}
	};

	null_content();



	function create_element( type, id, class_name ){
			
		var element = document.createElement( type );

		if( "null" !== id ){
			$(element).attr( 'id', id );
		}

		if( "null" !== class_name ){
			$(element).addClass( class_name );
		}

		return element;

	};

	function move_into_section( item, section ){

		var item = $(item);
		var section = $(section);

		return section.append( item );

	};

	function create_article(){

		var index = es_builder.addArticle();

		var article = create_element( 'article', '', 'clickable' );
		var article_content = create_element( 'div', '', 'item-content' );
		var article_tools_1 = create_element( 'div', '', 'live-tools' );
		var article_tools_2 = create_element( 'div', '', 'live-tools' );
		var article_header = create_element( 'header' );
		var article_footer = create_element( 'footer' );

		//$(article_content).attr('data-index', index);

		var remove_article = create_element( 'a' );
			$(remove_article).attr( 'role', 'btn-action' );
			$(remove_article).attr( 'data-ca', 'remove' );
			//$(remove_article).attr( 'data-path', index );
			$(remove_article).html( '<i class="fa fa-trash-o" aria-hidden="true"></i> Usuń' );
			move_into_section( remove_article, article_tools_1 );

		var clone_article = create_element( 'a' );
			$(clone_article).attr( 'role', 'btn-action' );
			$(clone_article).attr( 'data-ca', 'clone' );
			//$(clone_article).attr( 'data-path', index );
			$(clone_article).html( '<i class="fa fa-clone" aria-hidden="true"></i> Powiel' );
			move_into_section( clone_article, article_tools_1 );

		var add_row = create_element( 'a' );
			$(add_row).attr( 'role', 'btn-action' );
			$(add_row).attr( 'data-ca', 'add_row' );
			//$(add_row).attr( 'data-path', index );
			$(add_row).html( '<i class="fa fa-plus" aria-hidden="true"></i> Dodaj wiersz' );
			move_into_section( add_row, article_tools_2 );


		move_into_section( article_tools_1, article_header );
			move_into_section( article_header, article );

		move_into_section( article_content, article );

		move_into_section( article_tools_2, article_footer );
			move_into_section( article_footer, article );

		move_into_section( article, es_builder_elements.content_fill );

		//structure.add( article_count );
	//	article_count++;

		//console.log(object_structure);

	};

	var row_count = 0;
	function create_row( path ){

		var index = es_builder.addRow(path);

		var row = create_element( 'div', '', 'clickable' );
		var row_content = create_element( 'div', '', 'item-content' );
		var row_tools_1 = create_element( 'div', '', 'live-tools' );
		var row_header = create_element( 'header' );

		$(row).addClass('cols');
		//$(row_content).attr('data-index', path + ',' + index);

		var class_row = create_element( 'a' );
			$(class_row).attr( 'role', 'btn-action' );
			$(class_row).attr( 'data-ca', 'change_class' );
			//$(class_col).attr( 'data-path', create_col_path + ',children,' + index );
			$(class_row).html( '<i class="fa fa-cog" aria-hidden="true"></i> Klasy' );
			move_into_section( class_row, row_tools_1 );

		var add_row = create_element( 'a' );
			$(add_row).attr( 'role', 'btn-action' );
			$(add_row).attr( 'data-ca', 'add_col' );
			//$(add_row).attr( 'data-path', path + ',' + index );
			$(add_row).html( '<i class="fa fa-plus" aria-hidden="true"></i> Dodaj kolumnę' );
			move_into_section( add_row, row_tools_1 );

		var add_row = create_element( 'a' );
			$(add_row).attr( 'role', 'btn-action' );
			$(add_row).attr( 'data-ca', 'add_break' );
			//$(add_row).attr( 'data-path', path + ',' + index );
			$(add_row).html( '<i class="fa fa-plus" aria-hidden="true"></i> Przerywnik' );
			move_into_section( add_row, row_tools_1 );

		var clone_row = create_element( 'a' );
			$(clone_row).attr( 'role', 'btn-action' );
			$(clone_row).attr( 'data-ca', 'clone' );
			//$(clone_row).attr( 'data-path', path + ',' + index );
			$(clone_row).html( '<i class="fa fa-clone" aria-hidden="true"></i> Powiel' );
			move_into_section( clone_row, row_tools_1 );

		var remove_row = create_element( 'a' );
			$(remove_row).attr( 'role', 'btn-action' );
			$(remove_row).attr( 'data-ca', 'remove' );
			//$(remove_row).attr( 'data-path', path + ',' + index );
			$(remove_row).html( '<i class="fa fa-trash-o" aria-hidden="true"></i> Usuń' );
			move_into_section( remove_row, row_tools_1 );


		move_into_section( row_tools_1, row_header );
			move_into_section( row_header, row );

		move_into_section( row_content, row );

		move_into_section( row, es_builder_elements['push_container'] );

	};

	function create_break( path ){

		var index = es_builder.addBreak(path);

		var clear = create_element( 'div' );
		var clear_tools_1 = create_element( 'div', '', 'live-tools' );
		var clear_header = create_element( 'header' );

		$(clear).addClass('clear');
		//$(row_content).attr('data-index', path + ',' + index);

		var class_clear = create_element( 'a' );
			$(class_clear).attr( 'role', 'btn-action' );
			$(class_clear).attr( 'data-ca', 'change_class' );
			//$(class_col).attr( 'data-path', create_col_path + ',children,' + index );
			$(class_clear).html( '<i class="fa fa-cog" aria-hidden="true"></i> Klasy' );
			move_into_section( class_clear, clear_tools_1 );

		var remove_clear = create_element( 'a' );
			$(remove_clear).attr( 'role', 'btn-action' );
			$(remove_clear).attr( 'data-ca', 'remove' );
			//$(remove_row).attr( 'data-path', path + ',' + index );
			$(remove_clear).html( '<i class="fa fa-trash-o" aria-hidden="true"></i> Usuń' );
			move_into_section( remove_clear, clear_tools_1 );


		move_into_section( clear_tools_1, clear_header );
			move_into_section( clear_header, clear );

		move_into_section( clear, es_builder_elements['push_container'] );

	};

	var create_col_path = false;
	function create_col_select( path ){

		create_col_path = path;
		$('body').addClass('freeze');
		$('.es-fullwin.columns').addClass('show');

	};

	$(document).on( 'click', '.add-column_editor', function(){

		var xsmall = $('#xsmall').val();
		var small = $('#small').val();
		var medium = $('#medium').val();
		var large = $('#large').val();
		var ownclass = $('#ownclass').val();

		var classes = [];

		if( xsmall !== 'null' ){
			classes.push(xsmall);
		}
		if( small !== 'null' ){
			classes.push(small);
		}
		if( medium !== 'null' ){
			classes.push(medium);
		}
		if( large !== 'null' ){
			classes.push(large);
		}
		if( ownclass !== 'null' ){
			classes.push(ownclass);
		}

		var ColumnClasses = classes.join(' ');
		create_col( ColumnClasses );
		$('.es-fullwin-close').trigger('click');

	});

	function create_col( ColumnClasses ){

		var index = es_builder.addColumn( create_col_path, {
			"class": ColumnClasses,
			"content": false
		});

		var col = create_element( 'div' );
		var col_content = create_element( 'div', '', 'column-content' );
		var col_tools_1 = create_element( 'div', '', 'live-tools' );
		var col_header = create_element( 'header' );

		ColumnClasses += ' column';

		$(col).addClass(ColumnClasses);
		//$(col_content).attr('data-index', create_col_path + ',children,' + index);
		$(col_content).html('<p>Brak zawartości</p>');

		var class_col = create_element( 'a' );
			$(class_col).attr( 'role', 'btn-action' );
			$(class_col).attr( 'data-ca', 'change_class' );
			//$(class_col).attr( 'data-path', create_col_path + ',children,' + index );
			$(class_col).html( '<i class="fa fa-cog" aria-hidden="true"></i> Klasy' );
			move_into_section( class_col, col_tools_1 );

		var edit_col = create_element( 'a' );
			$(edit_col).attr( 'role', 'btn-action' );
			$(edit_col).attr( 'data-ca', 'edit' );
			//$(edit_col).attr( 'data-path', create_col_path + ',children,' + index );
			$(edit_col).html( '<i class="fa fa-file-text-o" aria-hidden="true"></i> Edytuj' );
			move_into_section( edit_col, col_tools_1 );

		var clone_col = create_element( 'a' );
			$(clone_col).attr( 'role', 'btn-action' );
			$(clone_col).attr( 'data-ca', 'clone' );
			//$(clone_col).attr( 'data-path', create_col_path + ',children,' + index );
			$(clone_col).html( '<i class="fa fa-clone" aria-hidden="true"></i> Powiel' );
			move_into_section( clone_col, col_tools_1 );

		var remove_col = create_element( 'a' );
			$(remove_col).attr( 'role', 'btn-action' );
			$(remove_col).attr( 'data-ca', 'remove' );
			//$(remove_col).attr( 'data-path', create_col_path + ',children,' + index );
			$(remove_col).html( '<i class="fa fa-trash" aria-hidden="true"></i> Usuń' );
			move_into_section( remove_col, col_tools_1 );


		move_into_section( col_tools_1, col_header );
			move_into_section( col_header, col );

		move_into_section( col_content, col );

		move_into_section( col, es_builder_elements['push_container'] );

	};

	var edit_view_path = false;
	var edit_view = function( path ){
		
		edit_view_path = path;

		$('body').addClass('freeze');
		$('.es-fullwin.content-column').addClass('show');

		es_builder.target = path;
		var map_tree = es_builder.tree().map();
		var map = ( map_tree && typeof map_tree === "object" ) ? map_tree : [];

		
		if( $('.es-fullwin.content-column .mce-tinymce.mce-container.mce-panel').length === 0 ||
			$('.es-fullwin.content-column .wp-editor-area[aria-hidden="false"]').length === 1 
			){
			$('.es-fullwin.content-column .wp-editor-area').val('');
			
			if( map.content ){
				$('.es-fullwin.content-column .wp-editor-area').val( map.content );
			}

		}else if( $('.es-fullwin.content-column .mce-tinymce.mce-container.mce-panel').length > 0 ||
				  $('.es-fullwin.content-column .wp-editor-area[aria-hidden="true"]').length === 1
			){
			tinyMCE.get('es-fullwin-content-column').setContent('');

			if( map.content ){
				tinyMCE.get('es-fullwin-content-column').setContent( map.content );
			}

		}
	
	};

	$(document).on( 'click', '.add-content-editor', function(){

		es_builder.target = edit_view_path;
		var map_tree = es_builder.tree().map();
		var content = false;

		if( $('.es-fullwin.content-column .mce-tinymce.mce-container.mce-panel').length === 0 ||
			$('.es-fullwin.content-column .wp-editor-area[aria-hidden="false"]').length === 1 
			){
			
			content = $('.es-fullwin.content-column .wp-editor-area').val();
			$('.es-fullwin.content-column .wp-editor-area').val('');
		
		}else if( $('.es-fullwin.content-column .mce-tinymce.mce-container.mce-panel').length > 0 ||
				  $('.es-fullwin.content-column .wp-editor-area[aria-hidden="true"]').length === 1
			){
			
			content = tinyMCE.get('es-fullwin-content-column').getContent();
			tinyMCE.get('es-fullwin-content-column').setContent('');
		
		}

		map_tree.content = content;

		if( ! content || content === "" ){
			content = "<p>Brak zawartości</p>";
		}

		var p = create_element('p');
		$(p).text( $(content).text() );

		$(es_builder_elements['push_container']).html( p );

		$('.es-fullwin-close').trigger('click');

	});

	var clone = function( path ){

		es_builder.target = path;

		var levels = es_builder.split(',');
		var cleanPath = [];
		$.each( levels, function( key, value ){
			if( value !== "children" ){
				cleanPath.push(value);
			}
		});

		var item = false;
		$.each( cleanPath, function( key, level ){

			if( key === 0 ){
				item = $(es_builder_elements.content_fill).find('article').eq(level);
			}

			if( key === 1 ){
				item = $(item).find('.cols').eq(level);
			}

			if( key === 2 ){
				item = $(item).find('.item-content').children()[ parseInt( level, 10 ) ];
			}

		});
		
		var clone = $(item).clone();
		$(item).after( clone );

		es_builder.clone( path );

	};

	var remove = function( path ){

		es_builder.target = path;

		var levels = es_builder.split(',');
		var cleanPath = [];
		$.each( levels, function( key, value ){
			if( value !== "children" ){
				cleanPath.push(value);
			}
		});

		var item = false;
		$.each( cleanPath, function( key, level ){

			if( key === 0 ){
				item = $(es_builder_elements.content_fill).find('article').eq( parseInt( level, 10 ) );
			}

			if( key === 1 ){
				item = $(item).find('.cols').eq( parseInt( level, 10 ) );
			}

			if( key === 2 ){
				item = $(item).find('.item-content').children()[ parseInt( level, 10 ) ];
			}

		});
		
		es_builder.delete( path );
		$(item).remove();

	};

	var class_edit_view = function( path ){
		
		$('body').addClass('freeze');
		$('.es-fullwin.class-editor').addClass('show');

		es_builder.target = path;
		var map = es_builder.tree().map();

		$('.es-fullwin.class-editor #exists-classes').val( map.class );

	};
	
	$(document).on( 'click', '.class-editor_save', function(){

		var map = es_builder.tree().map();
		map.class = $('.es-fullwin.class-editor #exists-classes').val();

		var levels = es_builder.split(',');
		var cleanPath = [];
		$.each( levels, function( key, value ){
			if( value !== "children" ){
				cleanPath.push(value);
			}
		});

		var item = false;
		$.each( cleanPath, function( key, level ){

			if( key === 0 ){
				item = $(es_builder_elements.content_fill).find('article').eq(level);
			}

			if( key === 1 ){
				item = $(item).find('.cols').eq(level);
			}

			if( key === 2 ){
				item = $(item).find('.item-content').children()[ parseInt( level, 10 ) ];
			}

		});

		var privateClass = false;
		if( $(item).hasClass( 'column' ) ){
			privateClass = true;
		}

		$(item).attr( 'class', $('.es-fullwin.class-editor #exists-classes').val() );
		
		if( privateClass ){
			$(item).addClass( 'column' );
		}
		
		$('.es-fullwin-close').trigger('click');

		return false;

	});

	$(document).on( 'click', '[role="btn-action"]', function(){

		var calling_action = $(this).attr( 'data-ca' );
		//var path = $(this).attr( 'data-path' );

		var path = [];
		// Pierwszy poziom
		// Scieżka dla przycisków z artykułu
		path.push( $(this).closest('article').index() );

		// Druga wartość
		// Scieżka dla przycisków z row
		if( $(this).closest('header').parent().hasClass('cols') ){
			path.push( $(this).closest('header').parent().index() );
		}

		// Trzeci poziom
		// Scieżka dla przycisków z kolumny
		if( $(this).closest('.item-content').parent().hasClass('cols') ){
			path.push( $(this).closest('.item-content').parent().index() );
			path.push( 'children' );
			if( $(this).closest('.column').length > 0 ){
				path.push( $(this).closest('.column').index() );
			}else if( $(this).closest('.clear').length > 0 ){
				path.push( $(this).closest('.clear').index() );
			}
		}

		var path = path.join(',');

		es_builder_elements['push_container'] = $(this).closest('article').find('.item-content')[0];
		if( $(this).closest('header').parent().hasClass('cols') ){
			es_builder_elements['push_container'] = $(this).closest('header').parent().find('.item-content')[0];
		}
		if( $(this).closest('.item-content').parent().hasClass('cols') ){
			es_builder_elements['push_container'] = $(this).closest('.column').find('.column-content')[0];
		}


		switch( calling_action ){

			case "add_article":
				create_article();
			  break;
			case "add_row":
				create_row( path );
			  break;
			case "add_col":
				create_col_select( path );
			  break;
			case "add_break":
				create_break( path );
			  break;

			case "edit":
				edit_view( path );
			  break;

			case "clone":
				clone( path );
			  break;

			case "remove":
				remove( path );
			  break;

			case "change_class":
				class_edit_view( path );
			  break;

			case "move_before":
			  break;
			case "move_after":
			  break;
			case "move_into":
			  break;

		};

		es_builder.prepareTo( $('#es-builder-output-user') );

		null_content();

		return false;

	});

	$(document).on( 'click', '.es-fullwin-close', function(){
		
		es_builder.prepareTo( $('#es-builder-output-user') );
		
		$('body').removeClass('freeze');
		$(this).closest('.es-fullwin').removeClass('show');
	
	});

})(jQuery);