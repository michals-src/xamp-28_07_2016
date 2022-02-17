/**
 * File unwind.js.
 *
 * Handles the primary JavaScript functions for the theme.
 */
jQuery( function( $ ) {

	// no-js Body Class.
	$ ( 'body.no-js' ).removeClass( 'no-js' );
	if ( $( 'body' ).hasClass( 'css3-animations' ) ) {

		var resetMenu = function() {
			$( '.main-navigation ul ul' ).each( function() {
				var $$ = $( this );
				var width = Math.max.apply(Math, $$.find( '> li > a' ).map( function() { return $( this ).width(); } ).get() );
				$$.find( '> li > a' ).width( width );
			} );
		};
		resetMenu();
		$( window ).resize( resetMenu );

	}

	// Featured posts slider.
	$( document ).ready( function() {
		if ( $.isFunction( $.fn.flexslider ) ) {
			$( '.featured-posts-slider' ).flexslider( {
				animation: "slide",
				controlNav: false
			} );
			$( '.gallery-format-slider' ).flexslider( {
				animation: "slide"
			} );
		}
	} );

    // Setup FitVids for entry content, video post formats, SiteOrigin panels and WooCommerce pages. Ignore Tableau.
    if ( typeof $.fn.fitVids !== 'undefined' ) {
        $( '.entry-content, .entry-content .panel, .entry-video, .woocommerce #main' ).fitVids( { ignore: '.tableauViz' } );
    }

	// Fullscreen search.
	$( '#search-button' ).click( function( e ) {
		e.preventDefault();
		var $$ = $( this );
		$$.toggleClass( 'close-search' );

		$( "input[type='search']" ).each( function () { $( this ).attr( 'size', $( this ).attr( 'placeholder' ).length ); } );

		var fullscreenSearch = function() {
			var vpw = $( window ).width(),
				vph = $( window ).height();
			$( '#fullscreen-search' ).css( { 'height': vph - 60 + 'px', 'width': vpw + 'px' } );
		};
		fullscreenSearch();
		$( window ).resize( fullscreenSearch );

		// Disable scrolling when fullscreen search is open
		if ( $$.hasClass( 'close-search' ) ) {
			$( 'body' ).css( 'margin-right', ( window.innerWidth - $( 'body' ).width() ) + 'px' );
			$( 'body' ).css( 'overflow', 'hidden' );
		} else {
			$( 'body' ).css( 'overflow', '' );
			$( 'body' ).css( 'margin-right', '' );
		}

		$( '#fullscreen-search' ).slideToggle( 'fast' );

		$( '#fullscreen-search input' ).focus();

	} );

	$( '#fullscreen-search-form' ).submit( function() {
		$(this).find( 'button svg' ).hide();
		$(this).find( 'button svg:last-child' ).show();
	} );

	// Close fullscreen search with escape key.
	$( document ).keyup( function(e) {
		if ( e.keyCode == 27 ) { // escape key maps to keycode `27`
			$( '#search-button.close-search' ).trigger( 'click' );
		}
	} );

	// Mobile menu.
	var $mobileMenu = false;
	$( '#mobile-menu-button' ).click( function(e){
		e.preventDefault();

		$( '#search-button.close-search' ).trigger( 'click' );

		var $$ = $(this);
		$$.toggleClass( 'to-close' );
		var $mobileMenuDiv = $( '#mobile-navigation' );

		if( $mobileMenu === false ) {
			$mobileMenu = $mobileMenuDiv
				.append( $( '.main-navigation ul' ).first().clone() )
				.appendTo( $mobileMenuDiv ).hide();
		}

		if ( $( '.main-navigation .shopping-cart' ).length ) {
			$mobileMenu.append( $( '.main-navigation .shopping-cart .shopping-cart-link' ).clone() );
		}

		$mobileMenu.slideToggle( 'fast' );

		$mobileMenu.find( '.menu-item-has-children > a' ).after( '<button class="dropdown-toggle" aria-expanded="false"><svg version="1.1" class="svg-icon-submenu" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="32" height="32" viewBox="0 0 32 32"><path d="M30.054 14.429l-13.25 13.232q-0.339 0.339-0.804 0.339t-0.804-0.339l-13.25-13.232q-0.339-0.339-0.339-0.813t0.339-0.813l2.964-2.946q0.339-0.339 0.804-0.339t0.804 0.339l9.482 9.482 9.482-9.482q0.339-0.339 0.804-0.339t0.804 0.339l2.964 2.946q0.339 0.339 0.339 0.813t-0.339 0.813z"></path></svg></button>' );
		$mobileMenuDiv.find( '.menu-item-has-children a' ).width('100%');
		$mobileMenuDiv.find( '.dropdown-toggle' ).click( function( e ) {
			e.preventDefault();
			$( this ).next( '.children, .sub-menu' ).slideToggle( 'fast' );
		} );
	} );

	// Sticky menu.
	if( $('.top-bar').hasClass('sticky-menu') && !$('body').hasClass('is-mobile') ) {
		var $tbs = false,
			pageTop = $('#page').offset().top,
			$tb = $('.top-bar');

		var smSetup = function () {
			pageTop = $('#page').offset().top;

			if ($tbs === false) {
				$tbs = $('<div class="top-bar-sentinel"></div>').insertAfter($tb);
			}


			var top  = window.pageYOffset || document.documentElement.scrollTop;
			$tb.css({
				'position': 'relative',
				'top': 0,
				'left': 0,
				'width': null,
			});

			var adminBarOffset = $( '#wpadminbar' ).css('position') === 'fixed' ? $('#wpadminbar').outerHeight() : 0;

			if( $( 'body' ).hasClass( 'woocommerce-demo-store' ) ) {
				adminBarOffset = $( '.demo_store' ).outerHeight() + $( '.demo_store' ).offset().top - $( document ).scrollTop();
			}

			$tbs.show().css({
				'height': $tb.outerHeight(),
				'margin-bottom' : $tb.css('margin-bottom')
			});
			$tb.css({
				'position': 'fixed',
				'top': adminBarOffset,
				'left': 0 - self.pageXOffset+'px',
				'width': '100%',
			});
		};
		smSetup();
		$(window).resize( smSetup ).scroll( smSetup );

	}

} );
