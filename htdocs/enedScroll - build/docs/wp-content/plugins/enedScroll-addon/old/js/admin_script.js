(function($){

	var $esContent = $('.es-builder-content');
	var $esTools = $esContent.find('.es-builder-tools');
	var $btnAction = $esContent.find('.btn-action');
	var $btnVisual = $esContent.find('.btn-action.btn-visual');
	var $esVisual = $esContent.find('.es-builder-visual');

	var $esOutput = $('#output-builder');

	var hash = function(){

		var time = $.now();
		var extVal = Math.floor( (Math.random() * 99999 ) + 1000 );

		return time + '' + extVal;

	};

	var buildReload = function(){

		$('#es-builder-output-user').val( $esOutput.html() );
		$('#es-builder-output-private').val( $esVisual.html() );

	};

	var clickableItem = null;
	$(document).on( 'click', '[data-clickable="true"]', function(e){

		e.stopPropagation();

		$(this).toggleClass('checked');

		if( ! $(this).hasClass('checked') ){
			$btnVisual.attr('disabled', 'disabled');
			clickableItem = null;
		} 

		if( $(this).hasClass('checked') ){
			
			// Remove last selected item
			if( clickableItem ) $(clickableItem).removeClass('checked');
			
			// Register this item
			clickableItem = $(this);
			$btnVisual.removeAttr('disabled');
		}

		return false;

	});

	var disableBtnVisual = function(){
		
		clickableItem = null;
		$btnVisual.attr('disabled', 'disabled');

	};

	$('#remove-selected').on( 'click', function(e){

		$esOutput.find('[data-ix="' + $(clickableItem).attr('data-ix') + '"]').remove();
		$(clickableItem).remove();

		disableBtnVisual();
		buildReload();

	});

	$('#class-edit').on( 'click', function(e){

		$('.es-fullwin.class-editor').addClass('show');
		$('body').addClass('freeze');

		var classes = $(clickableItem).attr('class').split(' ');
		classes.splice( classes.indexOf('checked'), 1 );

		$('.es-fullwin.class-editor').find('#exists-classes').val( classes.join(' ') );

		return false;

	});

	$('.class-editor_save').on( 'click', function(e){

		var classes = $('.es-fullwin.class-editor').find('#exists-classes').val();

		classes += ' checked';

		$esOutput.find('[data-ix="' + $(clickableItem).attr('data-ix') + '"]').attr( 'class', classes );
		$(clickableItem).attr( 'class', classes );

		$('body').removeClass('freeze');
		$(this).closest('.es-fullwin').removeClass('show');

		buildReload();

		return false;

	});

	$('.checked').removeClass('checked');
	disableBtnVisual();

	var moveItem = null;
	var moveDir = null;
	$('#move-after').on( 'click', function(e){

		$(this).toggleClass('cancel');

		if( $(this).hasClass('cancel') ){
			alert( 'Zaznacz element za którym chcesz umieść ten element' );
			$(this).text('Anuluj');
			moveItem = $(clickableItem);
			moveDir = "after";
		}	
		if( ! $(this).hasClass('cancel') ){
			$(this).text('Przenieś za');
			moveItem = null;
			moveDir = null;
		}

		return false;

	});
	$('#move-in').on( 'click', function(e){

		$(this).toggleClass('cancel');

		if( $(this).hasClass('cancel') ){
			alert( 'Zaznacz element w którym chcesz umieść ten element' );
			$(this).text('Anuluj');
			moveItem = $(clickableItem);
			moveDir = "in";
		}	
		if( ! $(this).hasClass('cancel') ){
			$(this).text('Przenieś do');
			moveItem = null;
			moveDir = null;
		}

		return false;

	});
	$('#move-before').on( 'click', function(e){

		$(this).toggleClass('cancel');

		if( $(this).hasClass('cancel') ){
			alert( 'Zaznacz element przed którym chcesz umieść ten element' );
			$(this).text('Anuluj');
			moveItem = $(clickableItem);
			moveDir = "before";
		}	
		if( ! $(this).hasClass('cancel') ){
			$(this).text('Przenieś przed');
			moveItem = null;
			moveDir = null;
		}

		return false;

	});

	$(document).on( 'click', '[data-clickable="true"]', function(){

		if( moveItem === null && moveDir === null ) return

		switch( moveDir ){

			case "before":

				var item = $esOutput.find('[data-ix="' + $(moveItem).attr('data-ix') + '"]');

				$(moveItem).insertBefore($(clickableItem));
				$(item).insertBefore( $esOutput.find('[data-ix="' + $(clickableItem).attr('data-ix') + '"]') );

				$('#move-before').trigger('click');

			  break;			
			case "in":
				var item = $esOutput.find('[data-ix="' + $(moveItem).attr('data-ix') + '"]');

				$(moveItem).appendTo($(clickableItem));
				$(item).appendTo( $esOutput.find('[data-ix="' + $(clickableItem).attr('data-ix') + '"]') );

				$('#move-in').trigger('click');
			  break;			
			case "after":
				var item = $esOutput.find('[data-ix="' + $(moveItem).attr('data-ix') + '"]');

				$(moveItem).insertAfter($(clickableItem));
				$(item).insertAfter( $esOutput.find('[data-ix="' + $(clickableItem).attr('data-ix') + '"]') );

				$('#move-after').trigger('click');
			  break;

		};


		moveItem = null;
		moveDir = null;

		buildReload();

	});


	/**

		F U N C T I O N S

	 */

	var ArticleBeta = function( $orign ){

		this.orign = $orign;
		this.items = this.create();

		return this.items;

	};

	ArticleBeta.prototype.create = function(){

		/**	
			ADMIN CONTENT
		 */
		var ArticleAdmin = document.createElement('article');

		var INDEX = 'article-' + this.orign;

		$(ArticleAdmin)
			.attr( 'data-ix', INDEX )
			.attr('data-clickable', 'true');

		/**	
			USER CONTENT
		 */
		var ArticleUser = document.createElement('article');

		$(ArticleUser)
			.attr( 'data-ix', INDEX );

		return { 'admin': ArticleAdmin, 'user': ArticleUser };

	}

	// var articleCount = 0;
	// var article = function(){

	// 	var index =hash();
	// 	var orign = 'article-' + hash();

	// 	var item = document.createElement('article');
	// 	var content = document.createElement('div');

	// 	item.className = 'article-' + articleCount + '-' + index;

	// 	$(item).attr('data-orign', orign );

	// 	$(item).attr('data-clickable', 'true');

	// 	var nav = document.createElement('nav');
	// 	var navChild = document.createElement('a');
	// 	var navChild2 = document.createElement('a');

	// 	content.className = 'active-content-article-' + articleCount + '-' + index;

	// 	$(navChild).attr('id', 'new-row').attr('href', '#').attr('data-content', content.className).text('Dodaj wiersz');
	// 	$(navChild2).attr('id', 'remove-article').attr('href', '#').attr('data-content', item.className).text('Usuń artykuł');

	// 	$(nav).append(navChild);
	// 	$(nav).append(navChild2);

	// 	$(item).append( content );
	// 	$(item).append( nav );

	// 	articleCount++;

	// 	return item;

	// };

	var RowBeta = function( $orign ){

		this.orign = $orign;
		this.items = this.create();

		return this.items;

	};

	RowBeta.prototype.create = function(){

		/**	
			ADMIN CONTENT
		 */
		var RowAdmin = document.createElement('div');

		var INDEX = 'row-' + this.orign;

		$(RowAdmin)
			.addClass('cols')
			.attr( 'data-ix', INDEX )
			.attr('data-clickable', 'true');

		/**	
			USER CONTENT
		 */
		var RoweUser = document.createElement('div');

		$(RoweUser)
			.addClass('cols')
			.attr( 'data-ix', INDEX );

		return { 'admin': RowAdmin, 'user': RoweUser };

	}

	var Column = function( $orign, $classes ){

		this.orign = $orign;
		this.classes = $classes;
		this.items = this.create();

		return this.items;

	};

	Column.prototype.create = function(){

		/**	
			ADMIN CONTENT
		 */
		var ColAdmin = document.createElement('div');
		var ColAdminLabel = document.createElement('span');
		var ColAdminContent = document.createElement('div');

		var INDEX = 'column-' + this.orign;

		$(ColAdmin)
			.addClass( this.classes )
			.attr( 'data-ix', INDEX )
			.attr('data-clickable', 'true');

		var ColAdminLabelText = 'Kolumna';
		if( this.classes.length > 0 ) ColAdminLabel = this.classes

		$(ColAdminLabel)
			.addClass( 'label' )
			.html(  ColAdminLabelText );

		$(ColAdmin).append(ColAdminLabel);

		$(ColAdminContent)
			.addClass( 'editable_item' )
			.addClass( 'no-margins' )
			.attr( 'data-ix', INDEX + '_content' )
			.html(  '<p>Zawartośc tekstowa kolumny</p>' );

		$(ColAdmin).append(ColAdminContent);

		/**	
			USER CONTENT
		 */
		var ColUser = document.createElement('div');

		$(ColUser)
			.addClass( this.classes )
			.attr( 'data-ix', INDEX );

		return { 'admin': ColAdmin, 'user': ColUser };

	}

	// var rowCount = 0;
	// var row = function( orginal ){

	// 	var index = hash();
	// 	var orign = 'row-' + hash();

	// 	var item = document.createElement('div');
	// 	var content = document.createElement('div');

	// 	item.id = rowCount;
	// 	item.className = 'each-row row-' + rowCount + '-' + index;

	// 	$(item).attr('data-orign', orign );

	// 	var nav = document.createElement('nav');
	// 	var navChild = document.createElement('a');
	// 	var navChild2 = document.createElement('a');
	// 	var navChild3 = document.createElement('a');

	// 	content.className = 'active-content-' + rowCount + '-' + index;

	// 	$(navChild).attr('id', 'new-col').attr('href', '#').attr('data-content', content.className).text('Dodaj kolumnę');
	// 	$(navChild2).attr('id', 'remove-col').attr('href', '#').attr('data-content', 'row-' + rowCount + '-' + index).text('Usuń wiersz');
	// 	$(navChild3).attr('id', 'new-clear').attr('href', '#').attr('data-content', content.className).text('Dodaj clear');
		
	// 	content.className += ' cols';
	// 	$(nav).append(navChild);
	// 	$(nav).append(navChild2);
	// 	$(nav).append(navChild3);

	// 	$(item).append( content );
	// 	$(item).append( nav );

	// 	rowCount++;

	// 	return item;

	// };

	// $(document).on( 'click', '#remove-article, #remove-col', function(){
		
	// 	var target = $(this).attr('data-content');
		
	// 	$('#output-builder').find('[data-orign="' + $(this).attr('data-orign') + '"]').remove();
	// 	$('.' + target).remove();

	// 	$('#es-builder-output-user').val($('#output-builder').html());
	// 	$('#es-builder-output-private').val($('#es-builder-visual').html());

	// 	return false;

	// });

	$esContent.on( 'click', '#add-article', function(){

		var ArticleTemps = new ArticleBeta( hash() );

		$esVisual.append( ArticleTemps.admin );
		$esOutput.append( ArticleTemps.user );

		buildReload();

		// var content = article();
		
		// if( $esVisual.find('article').length <= 0 ){
		// 	$esVisual.html(content);
		// 	visualIsEmpty = false;
		// }else{
		// 	$esVisual.find('article').last().after(content);
		// }

		// $(content).find('nav a').attr( 'data-orign', $(content).attr('data-orign') );
		
		// var articleItem = document.createElement('article');
		// $(articleItem).attr( 'data-orign', $(content).attr('data-orign') );

		// $('#output-builder').append( articleItem );
		
		// $('#es-builder-output-user').val($('#output-builder').html());
		// $('#es-builder-output-private').val($('#es-builder-visual').html());

		return false;

	});

	$esContent.on( 'click', '#add-row', function(){

		var RowTemps = new RowBeta( hash() );

		$(clickableItem).append( RowTemps.admin );
		$esOutput.find('[data-ix="' + $(clickableItem).attr('data-ix') + '"]').append( RowTemps.user );

		buildReload();

		// var content = row();
		// $('.' + $(this).attr('data-content') ).append( content );

		// $(content).find('nav a').attr( 'data-orign', $(content).attr('data-orign') );

		// var rowItem = document.createElement('div');
		// $(rowItem).addClass('cols').attr( 'data-orign', $(content).attr('data-orign') );
		
		// $('#output-builder' ).find('[data-orign="' + $(this).attr('data-orign') + '"]').append( rowItem );

		// $('#es-builder-output-user').val($('#output-builder').html());
		// $('#es-builder-output-private').val($('#es-builder-visual').html());

		return false;

	});

	$esContent.on( 'click', '#add-clear', function(){

		var IX = 'clear-' + hash();
		var content = document.createElement('div');
		content.className = 'clear';

		$(content).attr( 'data-clickable', 'true' )
				  .attr( 'data-ix', IX );

		$( clickableItem ).append( content );

		var clearItem = document.createElement('div');
		$(clearItem).addClass('clear').attr( 'data-ix', IX );
		
		$esOutput.find('[data-ix="' + $(clickableItem).attr('data-ix') + '"]').append( clearItem );

		buildReload();

		return false;

	});

	// var colTarget = null;
	// var colTargetBuilder = null;
	$esContent.on( 'click', '#add-column', function(){

		$('.es-fullwin.columns').addClass('show');
		$('body').addClass('freeze');

		return false;
	});

	// var colCount = 0;
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
		var ColumnTmps = new Column( hash(), ColumnClasses );

		if( ColumnClasses.length === 0 ) return 

		$(clickableItem).append( ColumnTmps.admin );
		$esOutput.find('[data-ix="' + $(clickableItem).attr('data-ix') + '"]').append( ColumnTmps.user );

		// $(element).attr( 'data-orign', orign );
		
		// label.className = 'label';
		// label.innerText = 'Pusty element';

		// nav.className = 'navbar-column clear hidden';

		// $(navChild1).attr('id', 'new-col').attr('href', '#').attr('data-content', content.className).text('Dodaj kolumnę');
		// $(navChild2).attr('id', 'new-clear').attr('href', '#').attr('data-content', content.className).text('Dodaj clear');
		// $(navChild3).attr('id', 'edit-col-content').attr('href', '#').attr('data-content', content.className).text('Edytuj zawartość');
		// $(navChild4).attr('id', 'remove-col').attr('href', '#').attr('data-content', 'column-id-' + colCount + '-' + index).text('Usuń kolumnę');

		// $(nav).append( navChild1 );
		// $(nav).append( navChild2 );
		// $(nav).append( navChild3 );
		// $(nav).append( navChild4 );

		// $(nav).find('a').attr('data-orign', orign);

		// $(content).append( label );
		// $(element).append( content );

		// $(element).append( nav );

		// $('.' + colTarget).append(element);

		// var columnItem = document.createElement('div');
		// columnItem.className = classes.join(' ');
		// $(columnItem).attr('data-orign', orign);

		// $('#output-builder').find('[data-orign="' + colTargetBuilder + '"]').append(columnItem);

		// colTarget = null;
		// colTargetBuilder = null;


		$('.es-fullwin.columns').removeClass('show');
		$('body').removeClass('freeze');

		buildReload();

		// colCount++;

		return false;
	});

	// var editorTarget = null;
	// var editorTargetBuilder = null;
	$(document).on( 'click', '#content-edit', function(){

		$('.es-fullwin.content-column').addClass('show');
		$('body').addClass('freeze');

		var $target = $(clickableItem);
		var $targetIX = $target.attr( 'data-ix' );

		var $hidden = $( $target ).find('[data-ix="' + $targetIX + '_content"] #column-content-editor[data-ix="' + $targetIX + '_hidden"]');
		var $hidden_value = ( $hidden.length != 0 ) ? $hidden.val() : false;

		if( $hidden_value ){

			if( $('.frontend-es-fullwin-content-column.wp-editor-area[aria-hidden="false"]').length > 0 ){
				$('.frontend-es-fullwin-content-column.wp-editor-area[aria-hidden="false"]').val( $hidden_value );
			}else if($('.frontend-es-fullwin-content-column.wp-editor-area[aria-hidden="true"]').length > 0){
				tinyMCE.get('es-fullwin-content-column').setContent( $hidden_value );
			}
			$('#es-fullwin-column-content-title').attr( 'value', $target.find('[data-ix="' + $targetIX + '_content"]').find('p').html() );

			$esOutput.find('[data-ix="' + $targetIX + '"]').find('[editor-item=""]').html('');

		}

		if( $hidden.length === 0 ){

			var $hidden = document.createElement('input');
			$( $hidden )
				.attr( 'name', 'column-content-editor')
				.attr( 'id', 'column-content-editor' )
				.attr( 'type', 'text' )
				.attr( 'data-ix', $targetIX + '_hidden' )
				.attr( 'hidden', '' );
			$( $target ).find('[data-ix="' + $targetIX + '_content"]').append( $hidden );

		}

		if( $esOutput.find('[data-ix="' + $targetIX + '"]').find('[editor-item=""]').length === 0 ){

			var $editor_content = document.createElement('div');
			$($editor_content)
				.attr( 'data-ix', $targetIX + '_item' )
				.attr( 'editor-item', '' );

			$esOutput.find('[data-ix="' + $targetIX + '"]').prepend( $editor_content );

		}

		buildReload();

		return false;

	});

	$(document).on( 'click', '.add-content-editor', function(){

		var contentTitle = $('#es-fullwin-column-content-title').val();
		var editorContent = tinyMCE.get('es-fullwin-content-column').getContent();

		if( $('.frontend-es-fullwin-content-column.wp-editor-area[aria-hidden="false"]').length > 0 ){
			editorContent = $('.frontend-es-fullwin-content-column.wp-editor-area[aria-hidden="false"]').val();
		}

		var $target = $(clickableItem);
		var $targetIX = $target.attr( 'data-ix' );

		if( contentTitle === '' ){
			contentTitle = 'Treść edytora';
		}
		
		$esOutput.find('[data-ix="' + $targetIX + '_item"]').html(editorContent);

		$target.find('[data-ix="' + $targetIX + '_content"] #column-content-editor[data-ix="' + $targetIX + '_hidden"]').attr( 'value', editorContent );

		$target.find('[data-ix="' + $targetIX + '_content"]').find('p').html( contentTitle );

		tinyMCE.get('es-fullwin-content-column').setContent(' ');

		$('.es-fullwin.content-column').removeClass('show');
		$('body').removeClass('freeze');

		// editorTarget = null;
		// editorTargetBuilder = null;

		buildReload();

	});

	$(document).on( 'click', '.editor-close', function(){

		var $target = $(clickableItem);
		var $targetIX = $target.attr( 'data-ix' );

		tinyMCE.get('es-fullwin-content-column').setContent('');
		
		$esOutput.find('[data-ix="' + $targetIX + '_item"]').html( $target.find('[data-ix="' + $targetIX + '_content"] #column-content-editor[data-ix="' + $targetIX + '_hidden"]').val() );

		//$('#output-builder').find('[data-orign="' + editorTargetBuilder + '"]').find('[editor-item=""]').html( $('.' + editorTarget).find('#column-content-editor').val() );
	
		// editorTarget = null;
		// editorTargetBuilder = null;

		buildReload();
	});







	$(document).on( 'click', '.es-fullwin-close', function(){
		$('body').removeClass('freeze');
		$(this).closest('.es-fullwin').removeClass('show');
	});

})(jQuery);