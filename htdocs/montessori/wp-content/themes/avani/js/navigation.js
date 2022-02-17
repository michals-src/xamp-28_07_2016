/**
 * File navigation.js.
 *
 * Handles toggling the navigation menu for small screens and enables TAB key
 * navigation support for dropdown menus.
 */
( function() {
	var container, button, menu, links, subMenus, i, len;

	var rootElement = document.documentElement;
	if (-1 !== rootElement.className.indexOf('no-js')) {
		rootElement.className = rootElement.className.replace(/\bno-js\b/,'js');
	}
	
	container = document.getElementById( 'site-navigation' );
	if ( ! container ) {
		return;
	}

	button = container.getElementsByTagName( 'button' )[0];
	if ( 'undefined' === typeof button ) {
		return;
	}

	menu = container.getElementsByTagName( 'ul' )[0];

	// Hide menu toggle button if menu is empty and return early.
	if ( 'undefined' === typeof menu ) {
		button.style.display = 'none';
		return;
	}

	menu.setAttribute( 'aria-expanded', 'false' );
	if ( -1 === menu.className.indexOf( 'nav-menu' ) ) {
		menu.className += ' nav-menu';
	}

	button.onclick = function() {
		if ( -1 !== container.className.indexOf( 'toggled' ) ) {
			container.className = container.className.replace( ' toggled', '' );
			button.setAttribute( 'aria-expanded', 'false' );
			menu.setAttribute( 'aria-expanded', 'false' );
		} else {
			container.className += ' toggled';
			button.setAttribute( 'aria-expanded', 'true' );
			menu.setAttribute( 'aria-expanded', 'true' );
		}
	};

	// Get all the link elements within the menu.
	links    = menu.getElementsByTagName( 'a' );
	subMenus = menu.getElementsByTagName( 'ul' );

	// Set menu items with submenus to aria-haspopup="true".
	for ( i = 0, len = subMenus.length; i < len; i++ ) {
		subMenus[i].parentNode.setAttribute( 'aria-haspopup', 'true' );
		
		// Child menu toggle functionality.
		addDropToggle(subMenus[i]);
		childToggle = subMenus[i].previousSibling;
		childToggle.onclick = function() {
			var self = this;
			if (-1 !== self.className.indexOf('toggled-on')) {
				self.className = self.className.replace(' toggled-on', '');
				self.parentNode.className = self.parentNode.className.replace(' toggled-on', '');
				self.setAttribute('aria-expanded', 'false');
			} else {
				self.className += ' toggled-on';
				self.parentNode.className += ' toggled-on';
				self.setAttribute('aria-expanded', 'true');
			}
		};
	}
	
	// Add dropdown toggle button to submenus.
	function addDropToggle( ele ) {
		var txt, spn, btn;
		txt = document.createTextNode('expand child menu');
		spn = document.createElement('SPAN');
		spn.appendChild(txt);
		spn.className = 'screen-reader-text';
		btn = document.createElement('BUTTON');
		btn.appendChild(spn);
		btn.className = 'dropdown-toggle';
		btn.setAttribute('aria-expanded', 'false');
		ele.parentNode.insertBefore(btn, ele);
	}

	// Each time a menu link is focused or blurred, toggle focus.
	for ( i = 0, len = links.length; i < len; i++ ) {
		links[i].addEventListener( 'focus', toggleFocus, true );
		links[i].addEventListener( 'blur', toggleFocus, true );
	}

	/**
	 * Sets or removes .focus class on an element.
	 */
	function toggleFocus() {
		var self = this;

		// Move up through the ancestors of the current link until we hit .nav-menu.
		while ( -1 === self.className.indexOf( 'nav-menu' ) ) {

			// On li elements toggle the class .focus.
			if ( 'li' === self.tagName.toLowerCase() ) {
				if ( -1 !== self.className.indexOf( 'focus' ) ) {
					self.className = self.className.replace( ' focus', '' );
				} else {
					self.className += ' focus';
				}
			}

			self = self.parentElement;
		}
	}

	// Handles toggling the sidebar for small screens.
	( function () {
		var sidebarContainer, toggleButton;
		sidebarContainer = document.getElementById( 'secondary' );
		if (!sidebarContainer) {
			return;
		}

		toggleButton = sidebarContainer.getElementsByTagName('button')[0];
		if ('undefined' === typeof toggleButton) {
			return;
		}

		toggleButton.onclick = function() {
			if (-1 !== sidebarContainer.className.indexOf('toggled')) {
				sidebarContainer.className = sidebarContainer.className.replace(' toggled', '');
				toggleButton.setAttribute('aria-expanded', 'false');
			} else {
				sidebarContainer.className += ' toggled';
				toggleButton.setAttribute('aria-expanded', 'true');
			}
		};
	} ) ();
} )();
