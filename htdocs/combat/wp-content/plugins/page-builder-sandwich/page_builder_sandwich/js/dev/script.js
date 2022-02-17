/* globals ContentTools, ContentEdit, ContentSelect, pbsParams, PBSEditor, HS */

/**
 * IE 10 & IE 11 doesn't support SVG.innerHTML. This polyfill adds it.
 *
 * @see https://github.com/phaistonian/SVGInnerHTML
 */

/* jshint ignore:start */
(function (view) {

if ( ( !! window.MSInputMethodContext && !! document.documentMode ) ||
	 ( navigator.appVersion.indexOf( 'MSIE 10' ) !== -1 ) ) {
	var
	    constructors    = ['SVGSVGElement', 'SVGGElement']
	    , dummy         = document.createElement('dummy');

	if (!constructors[0] in view) {
	    return false;
	}

	if (Object.defineProperty) {

	    var innerHTMLPropDesc = {

	        get : function () {

	            dummy.innerHTML = '';

	            Array.prototype.slice.call(this.childNodes)
	            .forEach(function (node, index) {
	                dummy.appendChild(node.cloneNode(true));
	            });

	            return dummy.innerHTML;
	        },

	        set : function (content) {
	            var
	                self        = this
	                , parent    = this
	                , allNodes  = Array.prototype.slice.call(self.childNodes)

	                , fn        = function (to, node) {
	                    if (node.nodeType !== 1) {
	                        return false;
	                    }

	                    var newNode = document.createElementNS('http://www.w3.org/2000/svg', node.nodeName);

	                    Array.prototype.slice.call(node.attributes)
	                    .forEach(function (attribute) {
	                        newNode.setAttribute(attribute.name, attribute.value);
	                    });

	                    if (node.nodeName === 'TEXT') {
	                        newNode.textContent = node.innerHTML;
	                    }

	                    to.appendChild(newNode);

	                    if (node.childNodes.length) {

	                        Array.prototype.slice.call(node.childNodes)
	                        .forEach(function (node, index) {
	                            fn(newNode, node);
	                        });

	                    }
	                };

	            // /> to </tag>
	            content = content.replace(/<(\w+)([^<]+?)\/>/, '<$1$2></$1>');

	            // Remove existing nodes
	            allNodes.forEach(function (node, index) {
	                node.parentNode.removeChild(node);
	            });


	            dummy.innerHTML = content;

	            Array.prototype.slice.call(dummy.childNodes)
	            .forEach(function (node) {
	                fn(self, node);
	            });

	        }
	        , enumerable        : true
	        , configurable      : true
	    };

	    try {
	        constructors.forEach(function (constructor, index) {
	            Object.defineProperty(window[constructor].prototype, 'innerHTML', innerHTMLPropDesc);
	        });
	    } catch (ex) {
	        // TODO: Do something meaningful here
	    }

	} else if (Object['prototype'].__defineGetter__) {

	    constructors.forEach(function (constructor, index) {
	        window[constructor].prototype.__defineSetter__('innerHTML', innerHTMLPropDesc.set);
	        window[constructor].prototype.__defineGetter__('innerHTML', innerHTMLPropDesc.get);
	    });

	}
}

} (window));
/* jshint ignore:end */

/**
 * IE doesn't support constructor.name. This polyfill adds it.
 *
 * @see http://matt.scharley.me/2012/03/monkey-patch-name-ie.html
 */
 
if (Function.prototype.name === undefined && Object.defineProperty !== undefined) {
    Object.defineProperty(Function.prototype, 'name', {
        get: function() {
            var funcNameRegex = /function\s([^(]{1,})\(/;
            var results = (funcNameRegex).exec((this).toString());
            return (results && results.length > 1) ? results[1].trim() : '';
        },
        set: function() {}
    });
}

/**
 * Custom events cause errors in in IE 11. This polyfill fixes it.
 *
 * @see http://stackoverflow.com/a/31783177/174172
 */
(function () {

	function CustomEvent ( event, params ) {
		params = params || { bubbles: false, cancelable: false, detail: undefined };
		var evt = document.createEvent( 'CustomEvent' );
		evt.initCustomEvent( event, params.bubbles, params.cancelable, params.detail );
		return evt;
	}

	// Only do this for IE11 & IE10
	if ( ( !! window.MSInputMethodContext && !! document.documentMode ) ||
		 ( navigator.appVersion.indexOf( 'MSIE 10' ) !== -1 ) ) {

		CustomEvent.prototype = window.Event.prototype;

		window.CustomEvent = CustomEvent;
	}
})();


ContentEdit.INDENT = '';
ContentEdit.DEFAULT_MAX_ELEMENT_WIDTH = 2000;
ContentTools.HIGHLIGHT_HOLD_DURATION = 999999;

/* exported PBS */
var PBS = {};

window.addEventListener( 'DOMContentLoaded', function() {
    var editor;
	if ( ! document.querySelector( '[data-name="main-content"]' ) ) {
		return;
	}

	// Auto-start PBS if the localStorage key is set.
	if ( localStorage ) {
		if ( localStorage.getItem( 'pbs-open-' + pbsParams.post_id ) ) {
			localStorage.removeItem( 'pbs-open-' + pbsParams.post_id );
			var starterInterval = setInterval( function() {
				if ( document.querySelector( '.ct-widget--active' ) ) {
					document.querySelector('.ct-ignition__button--edit').dispatchEvent( new CustomEvent( 'click' ) );
					clearInterval( starterInterval );
				}
			}, 200);
		}
	}

	editor = ContentTools.EditorApp.get();
	window._contentToolsShim( editor );
	editor.init('*[data-editable]', 'data-name');

	// Longer interval time to save on processing intensity.
	editor.bind('start', function() {
		clearInterval( editor._toolbox._updateToolsTimeout );
		editor._toolbox._updateToolsTimeout = setInterval( editor._toolbox._updateTools, 300 );
	} );

	// Help buttons.
	document.addEventListener( 'click', function(ev) {
		if ( ev.target.getAttribute( 'id' ) === 'pbs-help-docs' && typeof HS !== 'undefined' && typeof HS.beacon !== 'undefined' && HS.beacon.open !== 'undefined' ) {
			if ( HS.beacon.open ) {
				HS.beacon.open();
			} else {
				window.open( 'http://docs.pagebuildersandwich.com/', '_blank' );
			}
		} else if ( ev.target.getAttribute( 'id' ) === 'pbs-help-docs' ) {
			window.open( 'http://docs.pagebuildersandwich.com/', '_blank' );
		} else if ( ev.target.getAttribute( 'id' ) === 'pbs-help-replay-tour' ) {
			window.pbsPlayTour();
		}
	});

	// Docs button
	document.querySelector( '#wp-admin-bar-pbs_help_docs' ).addEventListener( 'click', function(ev) {
		if ( typeof HS !== 'undefined' && typeof HS.beacon !== 'undefined' && HS.beacon.open !== 'undefined' ) {
			if ( HS.beacon.open ) {
				HS.beacon.open();
			} else {
				window.open( 'http://docs.pagebuildersandwich.com/', '_blank' );
			}
		} else {
			window.open( 'http://docs.pagebuildersandwich.com/', '_blank' );
		}
		ev.preventDefault();
		return false;
	});

	/**
	 * Remove the inspector scrollbar when a modal is visible. We are only
	 * going to use the Media Manager modal, so just check that one.
	 */
	editor.bind('start', function() {
		editor._toolboxScrollCheckInterval = setInterval( function() {
			var elements = document.querySelectorAll('.media-modal-backdrop');
			var hasModal = false;
			if ( elements ) {
				Array.prototype.forEach.call( elements, function( el ) {
					if ( el.offsetWidth !== 0 || el.offsetHeight !== 0 ) {
						hasModal = true;
					}
				});
			}
			var toolbox = document.querySelector('.ct-toolbox');
			if ( toolbox ) {
				if ( toolbox.style['overflow-y'] !== ( hasModal ? 'hidden' : '') ) {
					toolbox.style['overflow-y'] = hasModal ? 'hidden' : '';
				}
			}
		}, 300 );
	} );
	editor.bind('stop', function() {
		clearInterval( editor._toolboxScrollCheckInterval );
	} );


	/**
	 * Editor admin bar buttons become hovered when turning on PBS. This stops
	 * it by turning pointer-events to none temporarily after PBS starts.
	 */
	editor.bind('start', function() {
		var adminBar = document.querySelector( '#wpadminbar' );
		if ( adminBar ) {
			adminBar.style['pointer-events'] = 'none';
			setTimeout( function() {
				adminBar.style['pointer-events'] = '';
			}, 100 );
		}
	} );
	editor.bind('stop', function() {
		var adminBar = document.querySelector( '#wpadminbar' );
		if ( adminBar ) {
			adminBar.style['pointer-events'] = '';
		}
	} );


	/**
	 * Save contents handler.
	 */
	editor.bind('save', function (regions) {
	    var name, payload, xhr, xhrTracking;

	    // Set the editor as busy while we save our changes
	    this.busy(true);

	    // Collect the contents of each region into a FormData instance
	    payload = new FormData();
	    for (name in regions) {
	        if (regions.hasOwnProperty(name)) {
				var html = regions[name];

				html = wp.hooks.applyFilters( 'pbs.save', html );

	            payload.append(name, html);
	        }
	    }
		payload.append( 'action', 'gambit_builder_save_content' );
		payload.append( 'save_nonce', pbsParams.save_nonce );
		payload.append( 'post_id', pbsParams.post_id );

		// Change the post status.
		// This is filled up by the other save buttons in _content-tools-UI.js
		if ( pbsParams.new_post_status ) {
			payload.append( 'post_status', pbsParams.new_post_status );
			pbsParams.new_post_status = undefined;
		}

		// If there are pseudo element styles that need to be saved, include those.
		var styles = '';
		if ( document.querySelector( 'style#pbs-style' ) ) {
			styles = document.querySelector( 'style#pbs-style' ).innerHTML;
		}
		payload.append( 'style', styles );

		wp.hooks.doAction( 'pbs.save.payload', payload );

	    xhr = new XMLHttpRequest();

		xhr.onload = function() {
			editor.busy( false );
			if (xhr.status >= 200 && xhr.status < 400) {
				// Success.

				// If we're not in the permalink, direct to the permalink so that
				// if the user presses on refresh, they will see the new content.
				if ( xhr.responseText.match( /(http|https):\/\// ) ) {
					var currentHref = window.location.href.replace( /#\.*$/, '' );
					if ( xhr.responseText !== currentHref ) {
						window.location.href = xhr.responseText;
					}
				}
				new ContentTools.FlashUI( 'ok' );
			} else {
				// We reached our target server, but it returned an error
				new ContentTools.FlashUI( 'no' );
			}
		};

	    xhr.open('POST', pbsParams.ajax_url );
	    xhr.send( payload );

		// Stats tracking.
		if ( pbsParams.show_opt_in_stats_track || pbsParams.stats_tracking_opted_in ) {
		    xhrTracking = new XMLHttpRequest();
		    xhrTracking.open('POST', pbsParams.ajax_url );
			payload.append( 'action', 'pbs_save_content_tracking' );
		    xhrTracking.send( payload );
		}
	});


	/****************************************************************
	 * Debounced shift key listener to display all column outlines.
	 ****************************************************************/
	var _isShiftDown = false;
	var _showColumnOutlines = _.debounce(function() {
		if ( _isShiftDown ) {
			document.querySelector('html').classList.add('pbs-show-outlines');
		}
	}, 800);
	var showColumnOutlines = function(e) {
		if ( e.shiftKey ) {
			_isShiftDown = true;
			_showColumnOutlines();
		}
	};
	var hideColumnOutlines = function(e) {
		if ( e.which === 16 ) {
			_isShiftDown = false;
			document.querySelector('html').classList.remove('pbs-show-outlines');
		}
	};


	editor.bind('start', function() {
		document.querySelector('html').classList.add('pbs-editing');
		document.querySelector('html').classList.add('theme-' + pbsParams.theme_name);

		try {
			this.regions()['main-content'].children[0].focus();
		} catch (e) {}
		this.domRegions()[0].classList.add('pbs-editing');

		// Disable highlighting
	    document.removeEventListener('keydown', this._handleHighlightOn);
	    document.removeEventListener('keyup', this._handleHighlightOff);

		// Trigger a resize event when transitioning with the inspector.
		window._pbsBodyTransitionIntervalNum = 0;
		clearInterval( window._pbsBodyTransitionInterval );
		window._pbsBodyTransitionInterval = setInterval(function() {
			window._pbsBodyTransitionIntervalNum++;
			window.dispatchEvent( new CustomEvent( 'resize' ) );
			if ( window._pbsBodyTransitionIntervalNum >= 30 ) {
				clearInterval( window._pbsBodyTransitionInterval );
			}
		}, 16);

		// Add outline highlight listeners.
		document.addEventListener('keydown', showColumnOutlines);
		document.addEventListener('keyup', hideColumnOutlines);
	});


	editor.bind('stop', function() {
		this.domRegions()[0].classList.remove('pbs-editing');
		document.querySelector('html').classList.remove('pbs-editing');
		document.querySelector('html').classList.remove('theme-' + pbsParams.theme_name);

		// Trigger a resize event when transitioning with the inspector.
		window._pbsBodyTransitionIntervalNum = 0;
		clearInterval( window._pbsBodyTransitionInterval );
		window._pbsBodyTransitionInterval = setInterval(function() {
			window._pbsBodyTransitionIntervalNum++;
			window.dispatchEvent( new CustomEvent( 'resize' ) );
			if ( window._pbsBodyTransitionIntervalNum >= 30 ) {
				clearInterval( window._pbsBodyTransitionInterval );
			}
		}, 16);

		// Remove outline highlight listeners.
		document.removeEventListener('keydown', showColumnOutlines);
		document.removeEventListener('keyup', hideColumnOutlines);
	});


	// Before clicking the save button, make all our manual modifications permanent.
	document.body.addEventListener('mousedown', function(e) {
		if ( e.target.classList.contains( 'ct-ignition__button--confirm') || ( e.target.parentNode && e.target.parentNode.classList.contains( 'ct-ignition__button--confirm' ) ) ) {
			window.PBSEditor.updateModifiedContent();
		}
	});


	// If clicked outside of the editable area, select the closest element.
	document.body.addEventListener('mousedown', function(e) {
		var editorArea = document.querySelector('[data-name="main-content"]');

		var isInEditorArea = editorArea.contains( e.target );
		var isEditorArea = editorArea === e.target;

		// This element is right before the body element. We check this so that we don't interfere with modals.
		var editorSemiRoot = editorArea;
		while ( editorSemiRoot.parentNode.tagName.toLowerCase() !== 'body' ) {
			editorSemiRoot = editorSemiRoot.parentNode;
		}
		var isInEditorSemiRoot = editorSemiRoot.contains( e.target );


		// Only do this when we are editing.
		if ( editorArea.classList.contains( 'pbs-editing' ) && isInEditorSemiRoot && ! isEditorArea && ! isInEditorArea ) {
			var rect = editorArea.getBoundingClientRect();
			var mainRegion = ContentTools.EditorApp.get().regions()['main-content'];

			// Check the location of the click then select the topmost or bottommost element.
			var elem;
			var isTop = true;
			if ( e.pageY > window.scrollY + rect.top + rect.height / 2 ) {
				isTop = false;
				elem = mainRegion.children[ mainRegion.children.length - 1 ];
			} else {
				elem = mainRegion.children[0];
			}

			// Check if we need to create a new text element.
			if ( 'Text' !== elem.constructor.name ) {
				var p = new ContentEdit.Text('p', {}, '');
				if ( isTop ) {
					elem.parent().attach( p, 0 );
				} else {
					elem.parent().attach( p, elem.parent().children.indexOf( elem ) + 1 );
				}
				elem = p;
			}

			// Put the cursor on the element
			var index = 0;
			if ( ! isTop ) {
				if ( elem.content ) {
					index = elem.content.length();
				}
			}
			e.preventDefault();
			elem.focus();

	        var selection = new ContentSelect.Range( index, index );
	        selection.select( elem._domElement );

			return;
		}
	});

	wp.hooks.doAction( 'pbs.init' );
});



ContentEdit.DRAG_HOLD_DURATION = 400;

ContentEdit.Root.get().bind('drag', function () {
	document.querySelector('[data-name="main-content"]').classList.add('dragging');
});

ContentEdit.Root.get().bind('drop', function () {
	document.querySelector('[data-name="main-content"]').classList.remove('dragging');

	// After a drop, adjust row widths
	if ( window.pbsFixRowWidths ) {
		window.pbsFixRowWidths();
	}
});

// From http://davidwalsh.name/element-matches-selector
window.pbsSelectorMatches = function(el, selector) {
	var p = Element.prototype;
	var f = p.matches || p.webkitMatchesSelector || p.mozMatchesSelector || p.msMatchesSelector || function(s) {
		return [].indexOf.call(document.querySelectorAll(s), this) !== -1;
	};
	if ( el.nodeType !== 1 && el.parentNode ) {
		el = el.parentNode;
	}
	if ( el.nodeType !== 1 ) {
		return false;
	}
	return f.call(el, selector);
};


window.cssToStyleObject = function( cssString ) {
	var regex = /([\w-]*)\s*:\s*([^;]*)/g;
	var match, properties={};
	while ( match = regex.exec( cssString ) ) {
		properties[match[1]] = match[2];
	}
	return properties;
};
window.cssToStyleString = function( cssObject ) {
	var s = '';
	for ( var i in cssObject ) {
		if ( cssObject.hasOwnProperty( i ) ) {
			s += i + ':' + cssObject[ i ] + ';';
		}
	}
	return s;
};


/****************************************************************
 * Bring back the blank on mouse move in ContentTools. Since we
 * are using nested elements, the change breaks our containers.
 ****************************************************************/
ContentEdit.Element.prototype._onMouseMove = function() {};


/****************************************************************
 * These functions are used across the other included scripts.
 ****************************************************************/
/* exported __slice, __indexOf, __extends, __bind */
var __slice = [].slice;
var __indexOf = [].indexOf || function(item) {
	for ( var i = 0, l = this.length; i < l; i++ ) {
		if (i in this && this[i] === item) {
			return i;
		}
	}
	return -1;
};
var __hasProp = {}.hasOwnProperty;
var __extends = function(child, parent) {
	for (var key in parent) {
		if (__hasProp.call(parent, key)) {
			child[key] = parent[key];
		}
	}
	function ctor() { this.constructor = child; }
	ctor.prototype = parent.prototype;
	child.prototype = new ctor();
	child.__super__ = parent.prototype;
	return child;
};
var __bind = function(fn, me){
	return function(){
		return fn.apply(me, arguments);
	};
};


// Use this syntax to include other Javascript files, included files must start with "_"
/* globals ContentTools, ContentEdit, HTMLString */

/**
 * We need to perform some functions with ContentTools that shouldn't necessarily be part
 * of ContentTools itself since they are outside its scope. We add them in here
 */

window.PBSEditor = {};


window.PBSEditor.getToolUI = function( name ) {
	return ContentTools.EditorApp.get()._toolbox._toolUIs[ name ];
};


/**
 * Add a new property _ceElement to all domElement that reference a ContentEdit Element
 */
ContentEdit.Root.get().bind('mount', function (element) {
    // Map the element to it's DOM element
    element.domElement()._ceElement = element;
});




/**
 * Updates the whole Editor's content if something in the DOM was manually changed.
 */
window.PBSEditor.updateModifiedContent = function() {

	// Go through all the editable regions of CT
	var regions = ContentTools.EditorApp.get().regions();
	for ( var i in regions ) {
		if ( regions.hasOwnProperty( i ) ) {
			// Go through all the children / Element Nodes
			window.PBSEditor.updateModifiedContentRecursive( regions[ i ] );
		}
	}
};


/**
 * Updates the element's content status recursively
 */
window.PBSEditor.updateModifiedContentRecursive = function( element ) {

	var children = element.children;
	if ( children ) {
		for ( var k = 0; k < children.length; k++ ) {

			// Check if the html CT thinks it has matches the actual html in the Dom.
			var ctElement = children[ k ];

			if ( typeof ctElement.content !== 'undefined' && ctElement.content.html() !== ctElement._domElement.innerHTML ) {

				// Update the Element's content
				window.PBSEditor.updateElementContent( ctElement, ctElement._domElement.innerHTML );
			}

			window.PBSEditor.updateModifiedContentRecursive( ctElement );
		}
	}
};


/**
 * Updates an Element object's content into newContent.
 */
window.PBSEditor.updateElementContent = function( element, newContent ) {
	if ( element.constructor.name === 'Shortcode' ) {
		return;
	}

	// Retain preserve whitespace, or else some elements (e.g. preformatted) will lose line breaks.
	element.content = new HTMLString.String( newContent, element.content.preserveWhitespace() ).trim();
	element.updateInnerHTML();
	element.taint();
};


/**
 * Returns true if currently editing.
 */
window.PBSEditor.isEditing = function() {
	var editorArea = document.querySelector('[data-name="main-content"]');
	if ( ! editorArea ) {
		return false;
	}
	return editorArea.classList.contains( 'pbs-editing' );
};


/**
 * Gets the unique ID of an element if it exists. Null if there is none.
 * Mostly used for adding pseudo element styles using addPseudoElementStyles
 */
window.PBSEditor.getUniqueClassName = function( domElement ) {
	if ( domElement.getAttribute( 'class' ) ) {
		var classes = domElement.getAttribute( 'class' );
		var matches = classes.match( /pbsguid-\w+/ );
		if ( matches ) {
			return matches[0];
		}
	}
	return null;
};


/**
 * Removes the unique ID of an element if it has one.
 * Mostly used for adding pseudo element styles using addPseudoElementStyles
 */
window.PBSEditor.removeUniqueClassName = function( domElement ) {
	if ( domElement.getAttribute( 'class' ) ) {
		var classes = domElement.getAttribute( 'class' );
		var matches = classes.match( /pbsguid-\w+/ );
		if ( matches ) {
			domElement.classList.remove( matches[0] );
			return true;
		}
	}
	return false;
};


/**
 * Generates a unique ID.
 * Mostly used for adding pseudo element styles using addPseudoElementStyles
 */
window.PBSEditor.generateUniqueClassName = function() {
	var name;
	do {
		name = 'pbsguid-' + window.PBSEditor.generateHash();
	} while ( document.querySelector( '.' + name ) );
	return name;
};


/**
 * Generates a unique hash.
 * Used for identifying unique stuff.
 */
window.PBSEditor.generateHash = function() {
	return Math.floor( ( 1 + Math.random() ) * 0x100000000 ).toString(36).substring(1);
};


/**
 * Adds raw pseudo element styles directly into the style tag dedicated to pseudo element styles.
 * Similar to window.PBSEditor.addPseudoElementStyles, except that this doesn't
 * perform any duplication checks and just directly adds the styles.
 * @param string styles The styles to add.
 * @return string The added styles.
 */
window.PBSEditor.addPseudoElementStylesRaw = function( styles ) {

	// Create style tag if it doesn't exist yet.
	var styleTag = document.querySelector( 'style#pbs-style' );
	if ( ! styleTag ) {
		styleTag = document.createElement( 'style' );
		styleTag.setAttribute( 'id', 'pbs-style' );
		document.body.appendChild( styleTag );
	}
	var currentStyles = styleTag.innerHTML + styles;

	// Taint the whole editor.
	var mainRegion = ContentTools.EditorApp.get().regions()['main-content'];
	if ( typeof mainRegion._debouncedTaint === 'undefined' ) {
		mainRegion._debouncedTaint = _.debounce( function() {
			this.taint();
		}.bind( mainRegion ), 400 );
	}
	mainRegion._debouncedTaint();

	// Save the new styles.
	styleTag.innerHTML = currentStyles;
	return styles;
};

/**
 * Adds a pseudo element style. Adds the style tag used by PBS if it doesn't exist yet.
 * @param string selector The full selector (with the pseudo element) to add
 * @param object styles An object containing the style-name & style-value pairs to add
 * @return string The added style string.
 */
window.PBSEditor.addPseudoElementStyles = function( selector, styles ) {

	// Clean up first.
	var selectorStillExists = window.PBSEditor.removePseudoElementStyles( selector, Object.keys( styles ) );

	// Create style tag if it doesn't exist yet.
	var styleTag = document.querySelector( 'style#pbs-style' );
	if ( ! styleTag ) {
		styleTag = document.createElement( 'style' );
		styleTag.setAttribute( 'id', 'pbs-style' );
		document.body.appendChild( styleTag );
	}
	var currentStyles = styleTag.innerHTML;

	// Create a string of styles.
	var styleString = '';
	for ( var styleName in styles ) {
		if ( styles.hasOwnProperty( styleName ) ) {
			var value = styles[ styleName ];
			if ( value.trim ) {
				value = value.trim();
			}
			if ( value ) {
				styleString += styleName + ': ' + value + ';';
			}
		}
	}

	// Add the style.
	var escapedSelector = selector.replace( /\./g, '\\.' );
	if ( selectorStillExists ) {
		var re = new RegExp( '(' + escapedSelector + '\\s*\\{)', 'gm' );
		currentStyles = currentStyles.replace( re, '$1' + styleString );
	} else {
		currentStyles += selector + ' {' + styleString + '}';
	}

	// Taint the whole editor.
	var mainRegion = ContentTools.EditorApp.get().regions()['main-content'];
	if ( typeof mainRegion._debouncedTaint === 'undefined' ) {
		mainRegion._debouncedTaint = _.debounce( function() {
			this.taint();
		}.bind( mainRegion ), 400 );
	}
	mainRegion._debouncedTaint();

	// Save the new styles.
	styleTag.innerHTML = currentStyles;
	return styleString;
};


/**
 * Gets a pseudo element style.
 * @param string selector The full selector (with the pseudo element) to get
 * @param string style The name of the style to get
 * @return string The existing style, null if none was found.
 */
window.PBSEditor.getPseudoElementStyles = function( selector, style ) {

	// Create style tag if it doesn't exist yet.
	var styleTag = document.querySelector( 'style#pbs-style' );
	if ( ! styleTag ) {
		return null;
	}
	var currentStyles = styleTag.innerHTML;
	var selectorPattern = selector.replace( /\./g, '\\.' );

	var re = new RegExp( selectorPattern + '\\s*\\{([\\s\\S]*?)\\}', 'm' );
	var matches = currentStyles.match( re );
	if ( ! matches ) {
		return null;
	}
	var stylesMatch = matches[1].replace( /;$/, '' ).split( ';' );
	for ( var k = 0; k < stylesMatch.length; k++ ) {
		var styleMatch = stylesMatch[ k ].match( new RegExp( '^' + style + '\\s*:([\\s\\S]*$)' ) );
		if ( styleMatch ) {
			var value = styleMatch[1].trim();
			if ( value ) {
				value = value.replace( /\s*!important/, '' );
			}
			return value;
		}
	}
	return null;
};


/**
 * Removes a set of pseudo element styles. Also cleans up the style tag,
 * and also removes it if no longer needed.
 * @param string selector The full selector (with the pseudo element) to get
 * @param string|array styles A style name or a list of style names to remove.
 * @return boolean False if the guid used in the selector is no longer used. True if the guid is still used.
 */
window.PBSEditor.removePseudoElementStyles = function( selector, styles ) {

	if ( typeof styles === 'string' ) {
		styles = [ styles ];
	}
	var styleTag = document.querySelector( 'style#pbs-style' );
	if ( ! styleTag ) {
		return false;
	}
	var selectorPattern = selector.replace( /\./g, '\\.' );

	// Remove the style from the style tag.
	var re, stylesMatch;
	var currentStyles = styleTag.innerHTML;

	for ( var i = 0; i < styles.length; i++ ) {
		var styleName = styles[ i ];
		re = new RegExp( selectorPattern + '\\s*\\{([\\s\\S]*?)\\}', 'm' );
		var matches = currentStyles.match( re );
		if ( matches ) {
			stylesMatch = matches[1].replace( /;$/, '' ).split( ';' );
			for ( var k = 0; k < stylesMatch.length; k++ ) {
				if ( stylesMatch[ k ].match( new RegExp( '^' + styleName + '\\s*:' ) ) ) {
					stylesMatch.splice( k, 1 );
					break;
				}
			}
			stylesMatch = stylesMatch.join( ';' );
			currentStyles = currentStyles.replace( matches[0], '' );
			currentStyles += selector + ' {' + stylesMatch + '}';
		}
	}

	// Remove empty styles/selectors.
	currentStyles = currentStyles.replace( /(^|[^\}])+\{[\s]*\}/gm, '' ).trim();

	// If no more styles, remove the style tag.
	if ( ! currentStyles ) {
		styleTag.parentNode.removeChild( styleTag );
		return false;
	} else {
		styleTag.innerHTML = currentStyles;
	}

	// If return true if the guid selector is still being used. False if it isn't used anymore.
	re = new RegExp( selectorPattern + '\\s*\\{', 'gm' );
	return !! styleTag.innerHTML.match( re );
};

/**
 * Converts an SVG element into a URL string that can be added as a CSS background-image rule.
 * @param DOM Object svgElement The SVG dom element.
 * @return string The converted URL() string that can be added as a CSS background-image rule.
 */
window.PBSEditor.convertSVGToBackgroundImage = function( svgElement ) {
	// We always need this for SVG to work.
	svgElement.setAttribute( 'xmlns', 'http://www.w3.org/2000/svg' );
	var svgString = svgElement.outerHTML;
	// Convert all " to '.
	svgString = svgString.replace( /"/g, '\'' );
	// Convert all < to %3C
	svgString = svgString.replace( /</g, '%3C' );
	// Convert all > to %3E
	svgString = svgString.replace( />/g, '%3E' );
	// Convert all & to %26
	svgString = svgString.replace( /&/g, '%26' );
	// Convert all # to %23
	svgString = svgString.replace( /#/g, '%23' );
	// Remove all line breaks
	svgString = svgString.replace( /\n/g, '' );
	// Wrap in url("")
	// Prefix with data:image/svg+xml,
	svgString = 'url("data:image/svg+xml,' + svgString + '")';
	return svgString;
};



window.PBSEditor.isCtrlDown = false;
window.PBSEditor.isShiftDown = false;
window.addEventListener( 'DOMContentLoaded', function() {
	document.addEventListener( 'keydown', function( ev ) {
		if ( ev.ctrlKey || ev.metaKey ) {
			window.PBSEditor.isCtrlDown = true;
		}
		if ( ev.shiftKey ) {
			window.PBSEditor.isShiftDown = true;
		}
	} );
	document.addEventListener( 'keyup', function( ev ) {
		if ( ! ev.ctrlKey && ! ev.metaKey ) {
			window.PBSEditor.isCtrlDown = false;
		}
		if ( ! ev.shiftKey ) {
			window.PBSEditor.isShiftDown = false;
		}
	} );
});



/**
 * ContentTools does not support left & right placements ONLY, it always
 * includes the center. This adjusts things to ignore the center placement
 * only if left & right are given.
 */
( function() {
	var _Root = ContentEdit.Root.get();
	var proxied = _Root._getDropPlacement;
	_Root._getDropPlacement = function( x, y ) {
		if ( ! this._dropTarget ) {
			return null;
		}

		var placements = this._dropTarget.constructor.placements;
		if ( placements.indexOf( 'center' ) === -1 && placements.indexOf( 'left' ) !== -1 && placements.indexOf( 'right' ) !== -1 ) {

			var rect = this._dropTarget.domElement().getBoundingClientRect(), _ref, vert, horz;
	        _ref = [ x - rect.left, y - rect.top ], x = _ref[0], y = _ref[1];

			horz = 'center';
			if ( x < rect.width / 2 ) {
				horz = 'left';
			} else {
				horz = 'right';
			}

	        vert = 'above';
	        if ( y > rect.height / 2 ) {
	          vert = 'below';
	        }

			return [ vert, horz ];
		}

		return proxied.call( this, x, y );
	};
} )();

/* globals ContentEdit */

/**
 * Style function
 * Gets or sets a CSS style
 */
ContentEdit.Element.prototype.style = function(name, value) {
	var style;

	if ( typeof value === 'undefined' ) {
		if ( ! this._domElement ) {
			return null;
		}
		style = this._domElement.style[ name ];
		if ( ! style ) {
			style = window.getComputedStyle( this._domElement );
			return style[ name ];
		}
		return style;
	}

	if ( ! this._domElement ) {
		return value;
	}

	// Don't do anything if the value remains the same.
	if ( this._domElement.style[ name ] === value ) {
		return value;
	}

	this._domElement.style[ name ] = value;
	style = this._domElement.getAttribute('style');
	if ( style === null ) {
        this._attributes.style = '';
        if ( this.isMounted() ) {
			this._domElement.removeAttribute('style');
        }
		if ( typeof this.debouncedTaint === 'undefined' ) {
			this.debouncedTaint = _.debounce( function() {
				this.taint();
			}.bind(this), 400 );
		}
		return this.debouncedTaint();
	}
	return this.attr( 'style', style );
};


/**
 * Gets the default styling for the element.
 */
ContentEdit.Element.prototype.defaultStyle = function(name) {
	// Get the original state of the style attribute.
	var origStyleAttribute = this._domElement.getAttribute('style');

	// Reset the style.
	this._domElement.style[ name ] = '';

	// Get the style value.
	var defaultStyle = window.getComputedStyle( this._domElement );

	if ( typeof defaultStyle[ name ] !== 'undefined' ) {
		defaultStyle = defaultStyle[ name ];
	} else {
		defaultStyle = 0;
	}

	// Bring back the default style attribute.
	if ( origStyleAttribute ) {
		this._domElement.setAttribute( 'style', origStyleAttribute );
	} else {
		this._domElement.removeAttribute( 'style' );
	}

	return defaultStyle;
};


/**
 * Override attr so that changes trigger a debounced taint to fix the history/undo.
 */
ContentEdit.Element.prototype.attr = function(name, value) {
	name = name.toLowerCase();
	if (value === void 0) {
		return this._attributes[name];
	}

	if ( this._attributes[name] === value ) {
		return;
	}

	this._attributes[name] = value;
	if (this.isMounted() && name.toLowerCase() !== 'class') {
		this._domElement.setAttribute(name, value);
	}

	// Do the debounce taint.
	if ( typeof this.debouncedTaint === 'undefined' ) {
		this.debouncedTaint = _.debounce( function() {
			this.taint();
		}.bind(this), 400 );
	}

	ContentEdit.Root.get().trigger('debounced_taint', this);

	return this.debouncedTaint();
};


/**
 * Removes all CSS classes of the element.
 */
ContentEdit.Element.prototype.removeAllCSSClasses = function() {
	if ( this._domElement && this._domElement.classList ) {
		for ( var i = this._domElement.classList.length - 1; i >= 0; i-- ) {
			this.removeCSSClass( this._domElement.classList.item( i ) );
		}
	}
};

/* globals ContentTools, ContentEdit */

/**
 * Some necessary functions in ContentTools aren't implemented yet.
 * We'll implement it on our own first until they arrive
 */

window._contentToolsShim = function( editor ) {
	editor.start = function () {
	    ContentTools.EditorApp.getCls().prototype.start.call(this);
	    editor.trigger('start');
	};

	editor.stop = function () {
	    ContentTools.EditorApp.getCls().prototype.stop.call(this);
	    editor.trigger('stop');
	};

};

(function() {
	var proxied = ContentEdit.Element.prototype._addCSSClass;
    ContentEdit.Element.prototype._addCSSClass = function(className) {
		if ( className === 'ce-element--over' ) {
			ContentEdit.Root.get().trigger('over', this);
		}
		return proxied.call( this, className );
	};
})();

(function() {
	var proxied = ContentEdit.Element.prototype._removeCSSClass;
    ContentEdit.Element.prototype._removeCSSClass = function(className) {
		if ( className === 'ce-element--over' ) {
			ContentEdit.Root.get().trigger('out', this);
		}
		return proxied.call( this, className );
	};
})();


/**
 * Fires pbs.ct.ready when the edit button becomes available.
 */
window.addEventListener( 'DOMContentLoaded', function() {
	if ( ! document.querySelector( '[data-name="main-content"]' ) ) {
		return;
	}

	// Auto-start PBS if the localStorage key is set.
	var starterInterval = setInterval( function() {
		if ( document.querySelector( '.ct-widget--active' ) ) {
			wp.hooks.doAction( 'pbs.ct.ready' );
			clearInterval( starterInterval );
		}
	}, 200);
});

/* globals ContentTools, pbsParams */

/**
 * Override the CT editor to use the buttons we placed in the WP admin bar.
 */
ContentTools.IgnitionUI.prototype.mount = function() {

	// Use the admin bar buttons instead of creating the default ones
	this._domElement = document.querySelector('#wpadminbar');
	this._domEdit = document.querySelector('#wp-admin-bar-gambit_builder_edit');
	this._domEdit.classList.add( 'ct-ignition__button--edit' );
	this._domConfirm = document.querySelector('#wp-admin-bar-gambit_builder_save');
	this._domConfirm.classList.add( 'ct-ignition__button--confirm' );
	this._domCancel = document.querySelector('#wp-admin-bar-gambit_builder_cancel');
	this._domCancel.classList.add( 'ct-ignition__button--cancel' );
	this._domBusy = document.querySelector('#wp-admin-bar-gambit_builder_busy');
	this._domBusy.classList.add( 'ct-ignition__button--busy' );
    var ret = this._addDOMEventListeners();

	// The scroll changes when you click edit, don't change the scroll position.
	this._domEdit.addEventListener('mousedown', function() {
		this.prevScrollY = window.scrollY;
	});
	this._domEdit.addEventListener('click', function() {
		window.scrollTo( 0, this.prevScrollY );
	});

	// Save & change post status buttons.
	document.querySelector( '#wp-admin-bar-gambit_builder_save_options #pbs-save-publish' ).addEventListener( 'click', function(ev) {
		ev.preventDefault();
		pbsParams.new_post_status = 'publish';
		this._domConfirm.click();
		document.querySelector('#pbs-save-button').setAttribute( 'data-current-post-type', 'publish' );
		this._domConfirm.querySelector('.ab-item').childNodes[1].nodeValue = pbsParams.labels.save_and_update;
	}.bind(this));
	document.querySelector( '#wp-admin-bar-gambit_builder_save_options #pbs-save-draft' ).addEventListener( 'click', function(ev) {
		ev.preventDefault();
		pbsParams.new_post_status = 'draft';
		this._domConfirm.click();
		document.querySelector('#pbs-save-button').setAttribute( 'data-current-post-type', 'draft' );
		this._domConfirm.querySelector('.ab-item').childNodes[1].nodeValue = pbsParams.labels.save_as_draft;
	}.bind(this));
	document.querySelector( '#wp-admin-bar-gambit_builder_save_options #pbs-save-pending' ).addEventListener( 'click', function(ev) {
		ev.preventDefault();
		pbsParams.new_post_status = 'pending';
		this._domConfirm.click();
		document.querySelector('#pbs-save-button').setAttribute( 'data-current-post-type', 'pending' );
		this._domConfirm.querySelector('.ab-item').childNodes[1].nodeValue = pbsParams.labels.save_as_pending;
	}.bind(this));

	wp.hooks.doAction( 'pbs.ct.mounted' );

	return ret;
};

/* globals ContentTools */

(function() {
	var proxied = ContentTools.History.prototype.undo;
	ContentTools.History.prototype.undo = function() {
		var ret = proxied.call( this );
		wp.hooks.doAction( 'pbs.undo' );
		return ret;

	};
})();

(function() {
	var proxied = ContentTools.History.prototype.redo;
	ContentTools.History.prototype.redo = function() {

		var ret = proxied.call( this );
		wp.hooks.doAction( 'pbs.redo' );
		return ret;

	};
})();

/* globals ContentEdit */


/**
 * Also use the bounding client rect for determining the current size.
 * This is a fallback, for cases where the width & height attributes
 * are not present. Or else the SHIFT+CTRL/CMD+CLICK action on resizables
 * will not work.
 */
( function() {
	var proxied = ContentEdit.ResizableElement.prototype.size;
    ContentEdit.ResizableElement.prototype.size = function( newSize ) {
		var height, width, rect;
		if ( ! newSize && this._domElement ) {
			rect = this._domElement.getBoundingClientRect();
			width = parseInt( rect.width || 1, 10 );
			height = parseInt( rect.height || 1, 10 );
			return [ width, height ];
		}
		return proxied.call( this, newSize );
    };
} )();


/**
 * When clicking on a resizable element while holding down SHIFT + CTRL/CMD
 * will reset the size to their defaults.
 */
( function() {
	var proxied = ContentEdit.ResizableElement.prototype._onMouseDown;
	ContentEdit.ResizableElement.prototype._onMouseDown = function(ev) {
		var corner = this._getResizeCorner( ev.clientX, ev.clientY );

		if ( corner ) {
			if ( window.PBSEditor.isCtrlDown && window.PBSEditor.isShiftDown ) {
				this.style( 'width', 'auto' );
				this.style( 'height', 'auto' );
				this.attr( 'height', '' );
				this.attr( 'width', '' );
			}
		}

		proxied.call( this, ev );
	};
} )();



/**
 * Allow `*` droppers.
 */
( function() {
   var proxied = ContentEdit.Element.prototype.drop;
   ContentEdit.Element.prototype.drop = function( element, placement ) {
		var root = ContentEdit.Root.get();
		if ( element && typeof element.type !== 'undefined' ) {
			if ( ! this.constructor.droppers[ element.type() ] && ! element.constructor.droppers[ this.type() ] && element.constructor.droppers['*'] ) {
				element._removeCSSClass( 'ce-element--drop' );
				element._removeCSSClass( 'ce-element--drop-' + placement[0] );
				element._removeCSSClass( 'ce-element--drop-' + placement[1] );
				element.constructor.droppers['*']( this, element, placement );
				root.trigger( 'drop', this, element, placement );
				return;
			}
		}
		return proxied.call( this, element, placement );
	};
} )();
( function() {
   var proxied = ContentEdit.Element.prototype._onOver;
    ContentEdit.Element.prototype._onOver = function(ev) {
		var ret = proxied.call( this, ev );
		if ( ! ret ) {

	        var root = ContentEdit.Root.get();
	        var dragging = root.dragging();
	        if ( ! dragging ) {
				return;
	        }
	        if ( dragging === this ) {
				return;
	        }
	        if ( root._dropTarget ) {
				return;
	        }
	        if ( this.constructor.droppers['*'] ) {
				this._addCSSClass( 'ce-element--drop' );
				return root._dropTarget = this;
	        }
		}
		return ret;
    };
} )();

// @see https://gist.github.com/bfintal/63527d3f9dd85e0b15d6

/* globals PBSEditor */

PBSEditor.Frame = wp.media.view.Frame.extend({
	className: 'pbs-icon-modal',
	template:  wp.template( 'pbs-icon-frame' ),

	events: {
		'click .media-toolbar-primary button': '_primaryClicked'
	},

	initialize: function() {
		wp.media.view.Frame.prototype.initialize.apply( this, arguments );

		_.defaults( this.options, {
			title: 'My Modal', // Default title of the modal.
			button: 'My Button', // Default submit button of the modal.
			modal: true
		});

		// Initialize modal container view.
		if ( this.options.modal ) {
			this.modal = new wp.media.view.Modal({
				controller: this
			});

			this.modal.content( this );

			this.modal.on( 'open', _.bind( function () {
				this._onOpen();
			}, this ) );

			this.modal.on( 'close', _.bind( function() {
				this._onClose();
			}, this ) );
		}
	},
	
	open: function( args ) {
		if ( ! args ) {
			args = {};
		}
		if ( args.content ) {
			this.modal.content( args.content( this ) );
		}
		this.successCallback = args.successCallback ? args.successCallback : null;
		this.openCallback = args.openCallback ? args.openCallback : null;
		this.closeCallback = args.closeCallback ? args.closeCallback : null;
		this.modal.open();
		this.modal.el.children[0].classList.add( 'pbs-modal-frame' );
		if ( this.className ) {
			this.modal.el.children[0].classList.add( this.className );
		}

		this.modal.el.querySelector( '.media-frame-title h1' ).textContent = args.title ? args.title : this.options.title;
		this.modal.el.querySelector( '.media-toolbar-primary button' ).textContent = args.button ? args.button : this.options.button;

		this.modal.el.children[0].classList.add( 'pbs-frame-hide' );
		setTimeout( function() {
			this.modal.el.children[0].classList.remove( 'pbs-frame-hide' );
		}.bind(this), 50 );
	},

	close: function() {
		this.modal.close();
	},

	_primaryClicked: function() {
		this.modal.close();
		if ( this.successCallback ) {
			this.successCallback( this );
		}
		// Do stuff when the submit button is clicked.
	},

	_onOpen: function() {
		if ( this.openCallback ) {
			this.openCallback( this );
		}
		// Do stuff when modal opens.
	},

	_onClose: function() {
		if ( this.closeCallback ) {
			this.closeCallback( this );
		}
		// Do stuff when modal closes.
	}
});

/* globals PBSEditor */

PBSEditor.SearchFrame = PBSEditor.Frame.extend({
	className: 'pbs-icon-modal',
	template:  wp.template( 'pbs-icon-frame' ),

	events: {
		'click .media-toolbar-primary button': '_primaryClicked'
	},

	_onOpen: function() {

		PBSEditor.Frame.prototype._onOpen.apply( this );
		setTimeout( function() {
			var searchInput = this.modal.el.querySelector( 'input[type="search"]' );
			searchInput.focus();
			searchInput.select();
		}.bind( this ), 1 );
		if ( ! this.selected ) {
			this.modal.el.querySelector( '.media-toolbar-primary button' ).setAttribute( 'disabled', 'disabled' );
		}
		this.modal.el.querySelector( '.pbs-no-results' ).style.display = '';

	},
	_onClose: function() {
		this.modal.el.querySelector( 'input[type="search"]' ).focus();
	},
	searchKeyup: function( ev ) {
		clearTimeout( this._searchTimeout );
		this._searchTimeout = setTimeout( function() {
			this.doSearch(ev);
		}.bind( this ), 400 );
	},
	reset: function() {
		this.selected = null;
		this.model.el.querySelector( '.pbs-no-results' ).style.display = '';
		this.modal.el.querySelector( '.media-toolbar-primary button' ).setAttribute( 'disabled', 'disabled' );
	},
	doSearch: function( ev ) {
		var keyword = ev.target.value.trim().toLowerCase();
		var shortcodes = this.modal.el.querySelectorAll( '.pbs-search-list > *' );
		var hasResult = false;
		Array.prototype.forEach.call( shortcodes, function(el) {
			if ( keyword === '' || el.textContent.trim().toLowerCase().indexOf( keyword ) !== -1 ) {
				el.style.display = '';
				hasResult = true;
			} else {
				el.style.display = 'none';
			}
		} );
		this.modal.el.querySelector( '.pbs-no-results' ).style.display = hasResult ? '' : 'flex';
	},
	select: function( ev ) {
		var target = ev.target;
		while ( ! target.parentNode.classList.contains( 'pbs-search-list' ) ) {
			target = target.parentNode;
		}
		this.selected = target;
		if ( this.modal.el.querySelector( '.pbs-selected' ) ) {
			this.modal.el.querySelector( '.pbs-selected' ).classList.remove( 'pbs-selected' );
		}
		target.classList.add( 'pbs-selected' );

		this.modal.el.querySelector( '.media-toolbar-primary button' ).removeAttribute( 'disabled' );

		// Double clicking on an item selects it.
		if ( this._justClicked === target ) {
			this._primaryClicked();
		}
		this._justClicked = target;
		clearTimeout( this._justClickedTimeout );
		this._justClickedTimeout = setTimeout( function() {
			this._justClicked = false;
		}.bind( this ), 300 );
	}
});

/**
 * The Icon picker modal popup.
 *
 * Call by using: PBSEditor.iconFrame.open(). Additional arguments may be given.
 */

/* globals pbsParams, PBSEditor */

PBSEditor._IconFrame = PBSEditor.Frame.extend({
	className: 'pbs-icon-modal',
	template:  wp.template( 'pbs-icon-frame' ),

	events: {
		'click .media-toolbar-primary button': '_primaryClicked',
		'keyup [type="search"]': 'searchKeyup',
		'click .pbs-icon-display [data-name]': 'selectIcon'
	},
	_onOpen: function() {
		PBSEditor.Frame.prototype._onOpen.apply( this );
		setTimeout( function() {
			var searchInput = this.modal.el.querySelector( 'input[type="search"]' );
			if ( searchInput.value === '' ) {
				searchInput.value = 'dashicons';
				this.searchKeyup( { target: searchInput } );
			}
			searchInput.focus();
			searchInput.select();
		}.bind( this ), 1 );
		if ( ! this.selected ) {
			this.modal.el.querySelector( '.media-toolbar-primary button' ).setAttribute( 'disabled', 'disabled' );
		}
	},
	_onClose: function() {
		this.modal.el.querySelector( 'input[type="search"]' ).focus();
	},
	searchKeyup: function( ev ) {
		clearTimeout( this._searchTimeout );
		this._searchTimeout = setTimeout( function() {
			this.doSearch(ev);
		}.bind( this ), 400 );
	},
	reset: function() {
		this._searchResults = [];
		this.modal.el.querySelector( '.pbs-no-results' ).style.display = '';
		while ( this.modal.el.querySelector( '.pbs-search-list > *:not(.pbs-no-results)' ) ) {
			var item = this.modal.el.querySelector( '.pbs-search-list > *:not(.pbs-no-results)' );
			item.parentNode.removeChild( item );
		}
		this._prevKeyword = '';
		this.selected = null;
		this._currentGroup = null;
		this.modal.el.querySelector( '.media-toolbar-primary button' ).setAttribute( 'disabled', 'disabled' );
	},
	doSearch: function( ev ) {
		var keyword = ev.target.value.trim();

		if ( ! keyword ) {
			return;
		}
		if ( this._prevKeyword === keyword ) {
			return;
		}
		this.reset();
		this._prevKeyword = keyword;

		// Remember searches.
		if ( typeof pbsParams.icon_searches === 'undefined' ) {
			pbsParams.icon_searches = [];
		}
		if ( typeof ev.keyCode !== 'undefined' ) {
			pbsParams.icon_searches.push( keyword );
		}

		var request = new XMLHttpRequest();
		request.open( 'POST', pbsParams.ajax_url, true );
		request.setRequestHeader( 'Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8' );
		request.onload = function() {
			if (request.status >= 200 && request.status < 400) {
				if ( request.responseText ) {
					var response = JSON.parse( request.responseText );

					if ( typeof response.length !== 'undefined' || response.length === 0 ) {
						this.displayNoResults();
						return;
					}
					this._searchResults = response;

					this.displayResults();
					return;
				}
				this.displayNoResults();
			}
		}.bind( this );
		request.send( 'action=pbs_icon_search&nonce=' + pbsParams.icon_nonce + '&s=' + keyword );
	},
	displayNoResults: function() {
		this.modal.el.querySelector( '.pbs-no-results' ).style.display = 'flex';
		// var item = document.createElement( 'div' );
		// item.classList.add( 'pbs-no-results' );
		// item.innerHTML = 'No matches found';
		// this.modal.el.querySelector( '.pbs-icon-display' ).appendChild( item );
	},
	displayResults: function() {
		var keys = Object.keys( this._searchResults ), groupLabel;

		if ( ! keys.length ) {
			return;
		}

		var key = keys[0];
		var result = this._searchResults[ Object.keys( this._searchResults )[0] ];
		delete this._searchResults[ key ];

		// Create the list of groups if it doesn't exist yet.
		if ( typeof this.groups === 'undefined' ) {
			this.groups = {};
			for ( groupLabel in pbsParams.icon_groups ) {
				if ( pbsParams.icon_groups.hasOwnProperty( groupLabel ) ) {
					this.groups[ groupLabel ] = new RegExp( pbsParams.icon_groups[ groupLabel ], 'i' );
				}
			}
		}

		// Create the group label if it doesn't exist yet.
		var currGroup = '';
		for ( groupLabel in this.groups ) {
			if ( this.groups.hasOwnProperty( groupLabel ) ) {
				var groupRegex = this.groups[ groupLabel ];
				if ( key.match( groupRegex ) ) {
					currGroup = groupLabel;
					break;
				}
			}
		}
		if ( this._currentGroup !== currGroup ) {
			var item = document.createElement( 'h4' );
			item.innerHTML = groupLabel;
			item.classList.add( 'pbs-icon-group-title' );
			this.modal.el.querySelector( '.pbs-icon-display' ).appendChild( item );
			this._currentGroup = currGroup;
		}

		// Create the icon.
		var icon = document.createElement( 'div' );
		icon.innerHTML = result;
		icon.setAttribute( 'data-name', key );
		this.modal.el.querySelector( '.pbs-icon-display' ).appendChild( icon );

		if ( keys.length > 1 ) {
			setTimeout( function() {
				this.displayResults();
			}.bind( this ), 5 );
		}

		this.modal.el.querySelector( '.pbs-no-results' ).style.display = '';
	},
	selectIcon: function( ev ) {
		var target = ev.target;
		while ( ! target.getAttribute( 'data-name' ) ) {
			target = target.parentNode;
		}
		this.selected = target;
		if ( this.modal.el.querySelector( '.pbs-icon-display .pbs-selected' ) ) {
			this.modal.el.querySelector( '.pbs-icon-display .pbs-selected' ).classList.remove( 'pbs-selected' );
		}
		target.classList.add( 'pbs-selected' );

		this.modal.el.querySelector( '.media-toolbar-primary button' ).removeAttribute( 'disabled' );

		// Double clicking on an icon selects it.
		if ( this._justClicked === target ) {
			this._primaryClicked();
		}
		this._justClicked = target;
		clearTimeout( this._justClickedTimeout );
		this._justClickedTimeout = setTimeout( function() {
			this._justClicked = false;
		}.bind( this ), 300 );
	}
});

window.addEventListener( 'DOMContentLoaded', function() {
	PBSEditor.iconFrame = new PBSEditor._IconFrame();
});

wp.hooks.addAction( 'pbs.save.payload', function( payload ) {
	if ( typeof pbsParams.icon_searches !== 'undefined' ) {
		payload.append( 'icon_searches', pbsParams.icon_searches );
	}
} );

/**
 * The Icon picker modal popup.
 *
 * Call by using: PBSEditor.widgetFrame.open(). Additional arguments may be given.
 */

/* globals PBSEditor */

PBSEditor._WidgetFrame = PBSEditor.SearchFrame.extend({
	className: 'pbs-widget-modal',
	template:  wp.template( 'pbs-widget-frame' ),

	events: {
		'click .media-toolbar-primary button': '_primaryClicked',
		'keyup [type="search"]': 'searchKeyup',
		'click [data-widget-slug]': 'select'
	}
});

window.addEventListener( 'DOMContentLoaded', function() {
	PBSEditor.widgetFrame = new PBSEditor._WidgetFrame();
});

/**
 * The shortcode picker modal popup.
 *
 * Call by using: PBSEditor.shortcodeFrame.open(). Additional arguments may be given.
 */

/* globals PBSEditor, pbsParams, PBSShortcodes */

PBSEditor._ShortcodeFrame = PBSEditor.SearchFrame.extend({
	className: 'pbs-shortcode-modal',
	template:  wp.template( 'pbs-shortcode-frame' ),

	events: {
		'click .media-toolbar-primary button': '_primaryClicked',
		'keyup [type="search"]': 'searchKeyup',
		'click [data-shortcode-tag]': 'select'
	},
	_onOpen: function() {
		PBSEditor.SearchFrame.prototype._onOpen.apply( this );
		this.initShortcodeList();
	},
	initShortcodeList: function() {
		var shortcodeArea = this.modal.el.querySelector( '.pbs-search-list' );
		if ( ! shortcodeArea.querySelector( '*:not(.pbs-no-results)' ) ) {
			var allShortcodes = [], sc;

			// Gather all shortcodes.
			for ( var i = 0; i < pbsParams.shortcodes.length; i++ ) {
				sc = {
					'tag': pbsParams.shortcodes[ i ],
					'name': pbsParams.shortcodes[ i ],
					'desc': ''
				};
				if ( PBSShortcodes[ pbsParams.shortcodes[ i ] ] ) {
					var map = PBSShortcodes[ pbsParams.shortcodes[ i ] ];
					if ( map.label ) {
						sc.name = map.label;
					}
					if ( map.name ) {
						sc.name = map.name;
					}
					if ( map.desc ) {
						sc.desc = map.desc;
					}
				}
				allShortcodes.push( sc );
			}

			// Sort.
			allShortcodes.sort( function( a, b ) {
			    var x = a.name.toLowerCase();
			    var y = b.name.toLowerCase();
			    return x < y ? -1 : x > y ? 1 : 0;
			} );

			// Display.
			for ( var tag in allShortcodes ) {
				if ( allShortcodes.hasOwnProperty( tag ) ) {
					sc = allShortcodes[ tag ];

					var div = document.createElement( 'DIV' );
					div.setAttribute( 'data-shortcode-tag', sc.tag );
					var title = document.createElement( 'H4' );
					title.innerHTML = sc.name;
					div.appendChild( title );
					if ( sc.desc ) {
						var desc = document.createElement( 'P' );
						desc.innerHTML = sc.desc;
						div.appendChild( desc );
					}
					shortcodeArea.appendChild( div );
				}
			}
		}
	}
});

window.addEventListener( 'DOMContentLoaded', function() {
	PBSEditor.shortcodeFrame = new PBSEditor._ShortcodeFrame();
});

/**
 * The Icon picker modal popup.
 *
 * Call by using: PBSEditor.widgetFrame.open(). Additional arguments may be given.
 */

/* globals PBSEditor */

PBSEditor._PredesignedFrame = PBSEditor.SearchFrame.extend({
	className: 'pbs-predesigned-modal',
	template:  wp.template( 'pbs-predesigned-frame' ),

	events: {
		'click .media-toolbar-primary button': '_primaryClicked',
		'keyup [type="search"]': 'searchKeyup',
		'click [data-template]': 'select'
	},

	_onOpen: function() {
		PBSEditor.SearchFrame.prototype._onOpen.apply( this );
		this.initList();
	},

	initList: function() {
		if ( this.modal.el.querySelector( '.pbs-search-list > *:not(.pbs-no-results)' ) ) {
			return;
		}

		var container = this.modal.el.querySelector( '.pbs-search-list' );
		var designElements = document.querySelectorAll( '[data-design-element-template]' );
		Array.prototype.forEach.call( designElements, function( el ) {
			var templateID = el.getAttribute( 'id' );
			var name = el.getAttribute( 'data-name' );
			var description = el.getAttribute( 'data-description' );
			var image = el.getAttribute( 'data-image' );
			var elem;

			var button = document.createElement( 'DIV' );
			button.setAttribute( 'data-template', templateID );
			button.setAttribute( 'data-root-only', el.getAttribute( 'data-root-only' ) );

			if ( image ) {
				elem = document.createElement( 'img' );
				elem.setAttribute( 'src', image );
				elem.setAttribute( 'alt', name ? name : templateID );
				button.appendChild( elem );
			}

			if ( name ) {
				elem = document.createElement( 'h4' );
				elem.innerHTML = name;
				button.appendChild( elem );
			}

			if ( description ) {
				elem = document.createElement( 'p' );
				elem.classList.add( 'description' );
				elem.innerHTML = description;
				button.appendChild( elem );
			}

			container.appendChild( button );
		} );
	}
});

window.addEventListener( 'DOMContentLoaded', function() {
	PBSEditor.predesignedFrame = new PBSEditor._PredesignedFrame();
});

/**
 * The HTML editor modal popup.
 *
 * Call by using: PBSEditor.htmlFrame.open(). Additional arguments may be given.
 */

/* globals PBSEditor */

PBSEditor._HtmlFrame = PBSEditor.Frame.extend({
	className: 'pbs-html-modal',
	template:  wp.template( 'pbs-html-frame' ),

	events: {
		'click .media-toolbar-primary button': '_primaryClicked',
		'keydown textarea': 'tabHandler'
	},
	_onOpen: function() {
		PBSEditor.Frame.prototype._onOpen.apply( this );
		setTimeout( function() {
			var input = this.modal.el.querySelector( 'textarea' );
			input.focus();
			if ( input.value === '' ) {
				input.value = '<div>\n\t<p>Sample HTML</p>\n</div>';
				input.select();
			}
		}.bind( this ), 1 );
	},
	_onClose: function() {
		this.modal.el.querySelector( 'textarea' ).focus();
	},
	tabHandler: function(e) {
		if ( e.keyCode === 9 ) {
			// Get caret position/selection.
            var val = e.target.value,
                start = e.target.selectionStart,
                end = e.target.selectionEnd;

            // Set textarea value to: text before caret + tab + text after caret.
            e.target.value = val.substring(0, start) + '\t' + val.substring(end);

            // Put caret at right position again.
            e.target.selectionStart = e.target.selectionEnd = start + 1;

            // Prevent the focus lose
			e.preventDefault();
            return false;
		}
	},
	getHtml: function() {
		var html = this.modal.el.querySelector( 'textarea' ).value.trim();

		// This fixes malformed HTML.
		var dummy = document.createElement( 'div' );
	    dummy.innerHTML = html;
	    return dummy.innerHTML.replace( /\s{2,}/g, ' ' );
	},
	setHtml: function( html ) {
		html = html.trim();
		// Beautify.
		html = this.formatXml( html ).trim();
		this.modal.el.querySelector( 'textarea' ).value = html;
	},
	// @see https://gist.github.com/kurtsson/3f1c8efc0ccd549c9e31
	formatXml: function(xml) {
		var formatted = '';
	    var reg = /(>)(<)(\/*)/g;
	    xml = xml.toString().replace(reg, '$1\r\n$2$3');
	    var pad = 0;
	    var nodes = xml.split('\r\n');
	    for(var n in nodes) {
	      var node = nodes[n];
	      var indent = 0;
	      if (node.match(/.+<\/\w[^>]*>$/)) {
	        indent = 0;
	      } else if (node.match(/^<\/\w/)) {
	        if (pad !== 0) {
	          pad -= 1;
	        }
	      } else if (node.match(/^<\w[^>]*[^\/]>.*$/)) {
	        indent = 1;
	      } else {
	        indent = 0;
	      }

	      var padding = '';
	      for (var i = 0; i < pad; i++) {
	        padding += '  ';
	      }

	      formatted += padding + node + '\r\n';
	      pad += indent;
	    }
	    return formatted;
	}
});

window.addEventListener( 'DOMContentLoaded', function() {
	PBSEditor.htmlFrame = new PBSEditor._HtmlFrame();
});

/* globals ContentTools, ContentEdit, PBSEditor */

PBSEditor.Overlays = [];

PBSEditor.Overlay = (function() {

	function Overlay() {
		this._domElement = null;
		this._active = false;
		this._shown = false;
		this._isMounted = false;
		this._classname = '';

		PBSEditor.Overlays.push( this );

		ContentEdit.Root.get().bind('over', function( element ) {

			// Don't show overlays when dragging.
			if ( ContentEdit.Root.get().dragging() ) {
				return;
			}

			// After some time, hide the overlay if it wasn't used.
			clearTimeout( this._hideTimeout );
			this._hideTimeout = setTimeout( function() {
				if ( ! this._shown ) {
					this._hide();
				}
				this._shown = false;
			}.bind(this), 10 );

			if ( this.canApply( element ) ) {
				this.element = this.applyTo( element );
				this._shown = true;
				this._show( this.element );
			}
		}.bind(this) );

		ContentEdit.Root.get().bind('drag', function() {
			this._hide();
		}.bind(this));
		ContentEdit.Root.get().bind('drop', function() {
			this._hide();
		}.bind(this));

		document.addEventListener( 'mouseover', function( ev ) {
			if ( ! this._isMounted ) {
				return;
			}
			if ( ! Overlay.active ) {
				if ( window.pbsSelectorMatches( ev.target, '[data-name="main-content"], [data-name="main-content"] *, .pbs-quick-action-overlay, .pbs-quick-action-overlay *, .pbs-toolbar, .pbs-toolbar *' ) ) {
					return;
				}
				this._hide();
			}
		}.bind(this));

		ContentEdit.Root.get().bind('taint', function( element ) {
			if ( this.element === element ) {
				this._show( element );
			}
		}.bind(this) );
		ContentEdit.Root.get().bind('debounced_taint', function( element ) {
			if ( this.element === element ) {
				this._show( element );
			}
		}.bind(this) );

		var editor = ContentTools.EditorApp.get();
		editor.bind('start', function() {
			this._domElement = this.createElement();
			this.mount();
		}.bind(this) );
		editor.bind('stop', function() {
			this.unmount();
		}.bind(this) );
	}

	Overlay.prototype.mount = function() {
		this._domElement.classList.add( 'pbs-quick-action-overlay' );
		this._domElement.classList.add( 'pbs-overlay-' + this.constructor.name.toLowerCase() );
		if ( this._classname ) {
			this._domElement.classList.add( this._classname );
		}
		document.body.appendChild( this._domElement );
		this.addEventHandlers();
		this._isMounted = true;
	};

	Overlay.prototype.unmount = function() {
		this.removeEventHandlers();
		document.body.removeChild( this._domElement );
		this._isMounted = false;
	};

	Overlay.prototype.addEventHandlers = function() {
		this._mousedownBound = this._mousedown.bind( this );
		this._mousemoveBound = this._mousemove.bind( this );
		this._mouseupBound = this._mouseup.bind( this );
		this._mouseenterBound = this._mouseenter.bind( this );
		this._mouseleaveBound = this._mouseleave.bind( this );

		this._domElement.addEventListener( 'mousedown', this._mousedownBound );
		this._domElement.addEventListener( 'mouseenter', this._mouseenterBound );
		this._domElement.addEventListener( 'mouseleave', this._mouseleaveBound );
		document.addEventListener( 'mousemove', this._mousemoveBound );
		document.addEventListener( 'mouseup', this._mouseupBound );
	};

	Overlay.prototype.removeEventHandlers = function() {
		this._domElement.removeEventListener( 'mousedown', this._mousedownBound );
		this._domElement.removeEventListener( 'mouseenter', this._mouseenterBound );
		this._domElement.removeEventListener( 'mouseleave', this._mouseleaveBound );
		document.removeEventListener( 'mousemove', this._mousemoveBound );
		document.removeEventListener( 'mouseup', this._mouseupBound );
	};

	Overlay.prototype._mousedown = function(ev) {
		if ( ! this.canApply() ) {
			this._active = false;
			return;
		}
		this._active = true;
		this.startX = parseInt( ev.screenX, 10 );
		this.startY = parseInt( ev.screenY, 10 );
		this.deltaX = 0;
		this.deltaY = 0;
		Overlay.active = true;
		this._domElement.classList.add( 'pbs-active' );
		document.body.classList.add( 'pbs-overlay-is-active' );
		document.body.classList.add( 'pbs-overlay-' + this.constructor.name.toLowerCase() );
		this.onClick();
		this.onMoveStart();
	};

	Overlay.prototype._mousemove = function(ev) {
		if ( ! this._active ) {
			return;
		}

		this.deltaX = parseInt( ev.screenX, 10 ) - this.startX;
		this.deltaY = parseInt( ev.screenY, 10 ) - this.startY;

		ev.preventDefault();
		ev.stopPropagation();

		this.onMove();

		// Update the other overlays.
		Overlay.hideOtherOverlays( this );
	};

	Overlay.hideOtherOverlays = function( callingOverlay ) {
		Array.prototype.forEach.call( PBSEditor.Overlays, function( overlay ) {
			if ( overlay !== callingOverlay ) {
				overlay._hide();
			}
		} );
	};

	Overlay.prototype._mouseup = function() {
		this._active = false;
		Overlay.active = false;
		this._domElement.classList.remove( 'pbs-active' );
		document.body.classList.remove( 'pbs-overlay-is-active' );
		document.body.classList.remove( 'pbs-overlay-active-' + this.constructor.name.toLowerCase() );
	};

	Overlay.prototype._mouseenter = function() {
		this._domElement.classList.add( 'pbs-over' );
		document.body.classList.add( 'pbs-overlay-hovered' );
		document.body.classList.add( 'pbs-overlay-hovered-' + this.constructor.name.toLowerCase() );
		this.onEnter();
	};

	Overlay.prototype._mouseleave = function() {
		this._domElement.classList.remove( 'pbs-over' );
		document.body.classList.remove( 'pbs-overlay-hovered' );
		document.body.classList.remove( 'pbs-overlay-hovered-' + this.constructor.name.toLowerCase() );
		this.onLeave();
	};

	Overlay.prototype._show = function( element ) {
		var root = ContentEdit.Root.get();
		if ( element._domElement && ! root.dragging() ) {
			this._domElement.style.display = 'flex';
			this.show( element );
		}
	};

	Overlay.prototype._hide = function() {
		this._domElement.style.display = 'none';
		this.hide();
	};

	Overlay.active = false;
	Overlay.prevOverElement = null;

	Overlay.prototype.canApply = function( element ) {
		return ! Overlay.active;
	};

	// Override these.
	Overlay.prototype.createElement = function() {};
	Overlay.prototype.onMoveStart = function() {};
	Overlay.prototype.onMove = function() {};
	Overlay.prototype.onClick = function() {};
	Overlay.prototype.show = function( element ) {}; // jshint ignore:line
	Overlay.prototype.hide = function() {};
	Overlay.prototype.onEnter = function() {};
	Overlay.prototype.onLeave = function() {};
	Overlay.prototype.applyTo = function( element ) { return element; };

	return Overlay;
})();

/**
 * Prevent mouse events when an overlay is active.
 */
(function() {
	var proxied = ContentEdit.Element.prototype._onMouseDown;
    ContentEdit.Element.prototype._onMouseDown = function(ev) {
		if ( PBSEditor.Overlay.active ) {
			return;
		}
		return proxied.call( this, ev );
	};
})();
(function() {
	var proxied = ContentEdit.Element.prototype._onMouseMove;
    ContentEdit.Element.prototype._onMouseMove = function(ev) {
		if ( PBSEditor.Overlay.active ) {
			return;
		}
		return proxied.call( this, ev );
	};
})();
(function() {
	var proxied = ContentEdit.Element.prototype._onMouseOver;
    ContentEdit.Element.prototype._onMouseOver = function(ev) {
		if ( PBSEditor.Overlay.active ) {
			return;
		}
		return proxied.call( this, ev );
	};
})();
(function() {
	var proxied = ContentEdit.Element.prototype._onMouseOut;
    ContentEdit.Element.prototype._onMouseOut = function(ev) {
		if ( PBSEditor.Overlay.active ) {
			return;
		}
		return proxied.call( this, ev );
	};
})();
(function() {
	var proxied = ContentEdit.Element.prototype._onMouseUp;
    ContentEdit.Element.prototype._onMouseUp = function(ev) {
		if ( PBSEditor.Overlay.active ) {
			return;
		}
		return proxied.call( this, ev );
	};
})();

/* globals PBSEditor, __extends */

PBSEditor.MarginBottom = (function(_super) {
	__extends(MarginBottom, _super);

	function MarginBottom() {
		MarginBottom.__super__.constructor.call(this);

		this.supportedElements = [ 'Text', 'PreText', 'Image', 'Html', 'Icon', 'Map' ];
	}

	MarginBottom.prototype.createElement = function() {
		var element = document.createElement( 'DIV' );
		var label = document.createElement( 'DIV' );
		element.appendChild( label );
		return element;
	};

	MarginBottom.prototype.canApply = function( element ) {
		if ( ! MarginBottom.__super__.canApply.call(this, element) ) {
			return false;
		}
		if ( ! element ) {
			element = this.element;
		}
		if ( ! wp.hooks.applyFilters( 'pbs.overlay.margin_bottom.can_apply', true, element ) ) {
			return false;
		}
		return this.supportedElements.indexOf( element.constructor.name ) !== -1;
	};

	MarginBottom.prototype.show = function( element ) {
		var styles = getComputedStyle( element._domElement );
		var rect = element._domElement.getBoundingClientRect();

		this._domElement.style.top = ( rect.bottom + window.scrollY ) + 'px';
		this._domElement.style.height = styles.marginBottom;
		this._domElement.style.left = ( rect.left + 30 ) + 'px';
		this._domElement.style.width = ( rect.right - rect.left ) + 'px';

		this._domElement.firstChild.innerHTML = styles.marginBottom;
	};

	MarginBottom.prototype.onMoveStart = function() {
		var styles = getComputedStyle( this.element._domElement );
		this.initialValue = parseInt( styles.marginBottom, 10 );
	};

	MarginBottom.prototype.onMove = function() {
		var margin = this.deltaY + this.initialValue;
		if ( margin < 0 ) {
			margin = 0;
		}
		if ( window.PBSEditor.isShiftDown ) {
			var remainder = margin % 10;
			margin -= remainder;
		}
		this.element.style( 'margin-bottom', margin + 'px' );
		this._domElement.style.height = margin + 'px';
		this._domElement.firstChild.innerHTML = this._domElement.style.height;
	};

	MarginBottom.prototype.onClick = function() {
		if ( window.PBSEditor.isShiftDown && window.PBSEditor.isCtrlDown ) {
			this.element.style( 'margin-bottom', '' );
			this.onMoveStart();
			this._domElement.style.height = this.initialValue;
			this._domElement.firstChild.innerHTML = this._domElement.style.height;
			return;
		}
	};

	return MarginBottom;

})(PBSEditor.Overlay);




PBSEditor.MarginTop = (function(_super) {
	__extends(MarginTop, _super);

	function MarginTop() {
		MarginTop.__super__.constructor.call(this);

		this.supportedElements = [ 'Text', 'PreText', 'Image', 'Html', 'Icon', 'Map' ];
	}

	MarginTop.prototype.createElement = function() {
		var element = document.createElement( 'DIV' );
		var label = document.createElement( 'DIV' );
		element.appendChild( label );
		return element;
	};

	MarginTop.prototype.canApply = function( element ) {
		if ( ! MarginTop.__super__.canApply.call(this, element) ) {
			return false;
		}
		if ( ! element ) {
			element = this.element;
		}
		if ( ! wp.hooks.applyFilters( 'pbs.overlay.margin_top.can_apply', true, element ) ) {
			return false;
		}
		return this.supportedElements.indexOf( element.constructor.name ) !== -1;
	};

	MarginTop.prototype.show = function( element ) {
		var styles = getComputedStyle( element._domElement );
		var rect = element._domElement.getBoundingClientRect();

		this._domElement.style.top = ( rect.top + window.scrollY - parseInt( styles.marginTop, 10 ) ) + 'px';
		this._domElement.style.height = styles.marginTop;
		this._domElement.style.left = ( rect.left + 30 ) + 'px';
		this._domElement.style.width = ( rect.right - rect.left ) + 'px';

		this._domElement.firstChild.innerHTML = styles.marginTop;
	};

	MarginTop.prototype.onMoveStart = function() {
		var styles = getComputedStyle( this.element._domElement );
		this.initialValue = parseInt( styles.marginTop, 10 );
	};

	MarginTop.prototype.onMove = function() {
		var margin = this.deltaY + this.initialValue;
		if ( margin < 0 ) {
			margin = 0;
		}
		if ( window.PBSEditor.isShiftDown ) {
			var remainder = margin % 10;
			margin -= remainder;
		}
		this.element.style( 'margin-top', margin + 'px' );
		this._domElement.style.height = margin + 'px';
		this._domElement.firstChild.innerHTML = this._domElement.style.height;
	};

	MarginTop.prototype.onClick = function() {
		if ( window.PBSEditor.isShiftDown && window.PBSEditor.isCtrlDown ) {
			this.element.style( 'margin-top', '' );
			this.onMoveStart();
			this._domElement.style.height = this.initialValue;
			this._domElement.firstChild.innerHTML = this._domElement.style.height;
			return;
		}
	};

	return MarginTop;

})(PBSEditor.Overlay);

/* globals PBSEditor, __extends */

/**
 * Margin Top & Bottom for containers.
 */

PBSEditor.MarginBottomContainer = ( function( _super ) {
	__extends( MarginBottomContainer, _super );

	function MarginBottomContainer() {
		MarginBottomContainer.__super__.constructor.call( this );

		this._classname = 'pbs-overlay-marginbottom';
		this.supportedElements = [ 'Tabs', 'DivRow', 'Carousel' ];
	}

	MarginBottomContainer.prototype.getSupportedElement = function( element ) {
		var iterElem = element, lastMatchedElement = element;
		while ( iterElem.constructor.name !== 'Region' ) {
			if ( this.supportedElements.indexOf( iterElem.constructor.name ) !== -1 ) {
				lastMatchedElement = iterElem;
			}
			iterElem = iterElem.parent();
		}
		return lastMatchedElement;
	};

	MarginBottomContainer.prototype.applyTo = function( element ) {
		return this.getSupportedElement( element );
	};

	MarginBottomContainer.prototype.canApply = function( element ) {
		if ( ! element ) {
			element = this.element;
		}
		element = this.getSupportedElement( element );
		if ( ! wp.hooks.applyFilters( 'pbs.overlay.margin_bottom_container.can_apply', true, element ) ) {
			return false;
		}
		if ( this.supportedElements.indexOf( element.constructor.name ) !== -1 ) {
			return true;
		}
		return false;
	};

	return MarginBottomContainer;

} )( PBSEditor.MarginBottom );


PBSEditor.MarginTopContainer = ( function( _super ) {
	__extends( MarginTopContainer, _super );

	function MarginTopContainer() {
		MarginTopContainer.__super__.constructor.call( this );

		this._classname = 'pbs-overlay-margintop';
		this.supportedElements = [ 'Tabs', 'DivRow', 'Carousel' ];
	}

	MarginTopContainer.prototype.getSupportedElement = function( element ) {
		var iterElem = element, lastMatchedElement = element;
		while ( iterElem.constructor.name !== 'Region' ) {
			if ( this.supportedElements.indexOf( iterElem.constructor.name ) !== -1 ) {
				lastMatchedElement = iterElem;
			}
			iterElem = iterElem.parent();
		}
		return lastMatchedElement;
	};

	MarginTopContainer.prototype.applyTo = function( element ) {
		return this.getSupportedElement( element );
	};

	MarginTopContainer.prototype.canApply = function( element ) {
		if ( ! element ) {
			element = this.element;
		}
		element = this.getSupportedElement( element );
		if ( ! wp.hooks.applyFilters( 'pbs.overlay.margin_top_container.can_apply', true, element ) ) {
			return false;
		}
		if ( this.supportedElements.indexOf( element.constructor.name ) !== -1 ) {
			return true;
		}
		return false;
	};

	return MarginTopContainer;

} )( PBSEditor.MarginTop );

/* globals PBSEditor, __extends */

/**
 * This is the column width overlay (right side of a column)
 */
PBSEditor.OverlayColumnWidth = (function(_super) {
	__extends(OverlayColumnWidth, _super);

	function OverlayColumnWidth() {
		OverlayColumnWidth.__super__.constructor.call(this);
	}

	OverlayColumnWidth.prototype.createElement = function() {
		return document.createElement( 'DIV' );
	};

	OverlayColumnWidth.prototype.canApply = function( element ) {
		if ( ! OverlayColumnWidth.__super__.canApply.call(this, element) ) {
			return false;
		}
		if ( ! element ) {
			element = this.element;
		}
		if ( element.constructor.name === 'DivCol' ) {
			if ( element.parent().children.indexOf( element ) > 0 ) {
				return true;
			}
		}
		return false;
	};

	OverlayColumnWidth.prototype.onEnter = function() {
		this.element.parent().showOutline();
	};

	OverlayColumnWidth.prototype.onLeave = function() {
		this.element.parent().hideOutline();
	};

	OverlayColumnWidth.prototype.show = function( element ) {
		var rect = element._domElement.getBoundingClientRect();

		this._domElement.style.top = ( rect.top + window.scrollY ) + 'px';
		this._domElement.style.height = rect.height + 'px';
		this._domElement.style.left = ( rect.left - 10 ) + 'px';
		this._domElement.style.width = '20px';
	};

	OverlayColumnWidth.prototype.onMoveStart = function() {
		var cols = this.element.parent().children;
		var colIndex = cols.indexOf( this.element );

		this.leftInitialValue = this.normalizeFlexGrow( cols[ colIndex - 1 ] );
		this.initialValue = this.normalizeFlexGrow( this.element );

		this.element.parent().showOutline();
	};

	OverlayColumnWidth.prototype.normalizeFlexGrow = function( col ) {
		var flex = parseFloat( col.style( 'flex-grow' ) );
		var rowWidth = 0;
		var totalFlex = 0;
		for ( var i = 0; i < col.parent().children.length; i++ ) {
			var otherCol = col.parent().children[ i ];
			totalFlex += parseFloat( otherCol.style( 'flex-grow' ) );
			rowWidth += parseInt( otherCol._domElement.offsetWidth, 10 );
		}
		return Math.floor( flex / totalFlex * rowWidth );
	};

	OverlayColumnWidth.prototype.onMove = function() {
		var row = this.element.parent();
		var cols = row.children;
		var colIndex = cols.indexOf( this.element );
		var widths = [];

		this.element.parent().showOutline();

		// If the value is too small, stop resizing. This prevents columns from getting negative widths.
		if ( - this.deltaX + this.initialValue < 0 || this.deltaX + this.leftInitialValue < 0 ) {
			return;
		}

		// We use the flex-grow for columns, so we need to normalize the values.
		// Normalize means we convert them from 1-1 (for 2-column) to 200-200 (e.g. for a 400 width row)
		// so that adjusting using overlays can be done visually with pixel units.
		for ( var i = 0; i < cols.length; i++ ) {
			widths.push( this.normalizeFlexGrow( cols[ i ] ) );
		}
		for ( i = 0; i < cols.length; i++ ) {
			cols[ i ].style('flex-grow', widths[ i ] );
		}

		// When the shift button is down,
		var amount = this.deltaX;
		if ( window.PBSEditor.isShiftDown ) {
			var remainder = ( this.deltaX + this.initialValue ) % 10;
			amount -= remainder;
		}

		// Apply the new flex-grow values to change the column widths.
		widths[ colIndex ] = - amount + this.initialValue;
		widths[ colIndex - 1 ] = amount + this.leftInitialValue;

		cols[ colIndex - 1 ].style('flex-grow', widths[ colIndex - 1 ] );
		cols[ colIndex ].style('flex-grow', widths[ colIndex ] );
	};

	return OverlayColumnWidth;

})(PBSEditor.Overlay);


/**
 * This is the column width overlay (left side of a column)
 */
PBSEditor.OverlayColumnWidthRight = (function(_super) {
	__extends(OverlayColumnWidthRight, _super);

	function OverlayColumnWidthRight() {
		OverlayColumnWidthRight.__super__.constructor.call(this);
	}

	OverlayColumnWidthRight.prototype.canApply = function( element ) {
		if ( ! PBSEditor.OverlayColumnWidth.__super__.canApply.call(this, element) ) {
			return false;
		}
		if ( ! element ) {
			element = this.element;
		}
		if ( element.constructor.name === 'DivCol' ) {
			if ( element.parent().children.indexOf( element ) < element.parent().children.length - 1 ) {
				return true;
			}
		}
		return false;
	};

	OverlayColumnWidthRight.prototype.onEnter = function() {
		this.element.parent().showOutline();
	};

	OverlayColumnWidthRight.prototype.onLeave = function() {
		this.element.parent().hideOutline();
	};

	OverlayColumnWidthRight.prototype.show = function( element ) {
		var rect = element._domElement.getBoundingClientRect();

		this._domElement.style.top = ( rect.top + window.scrollY ) + 'px';
		this._domElement.style.height = rect.height + 'px';
		this._domElement.style.left = ( rect.left + rect.width - 10 ) + 'px';
		this._domElement.style.width = '20px';
	};

	OverlayColumnWidthRight.prototype.onMoveStart = function() {
		var cols = this.element.parent().children;
		var colIndex = cols.indexOf( this.element );

		this.rightInitialValue = this.normalizeFlexGrow( cols[ colIndex + 1 ] );
		this.initialValue = this.normalizeFlexGrow( this.element );

		this.element.parent().showOutline();
	};

	OverlayColumnWidthRight.prototype.onMove = function() {
		var row = this.element.parent();
		var cols = row.children;
		var colIndex = cols.indexOf( this.element );
		var widths = [];

		this.element.parent().showOutline();

		// If the value is too small, stop resizing. This prevents columns from getting negative widths.
		if ( this.deltaX + this.initialValue < 0 || - this.deltaX + this.rightInitialValue < 0 ) {
			return;
		}

		// We use the flex-grow for columns, so we need to normalize the values.
		// Normalize means we convert them from 1-1 (for 2-column) to 200-200 (e.g. for a 400 width row)
		// so that adjusting using overlays can be done visually with pixel units.
		for ( var i = 0; i < cols.length; i++ ) {
			widths.push( this.normalizeFlexGrow( cols[ i ] ) );
		}
		for ( i = 0; i < cols.length; i++ ) {
			cols[ i ].style('flex-grow', widths[ i ] );
		}

		// When the shift button is down,
		var amount = this.deltaX;
		if ( window.PBSEditor.isShiftDown ) {
			var remainder = ( this.deltaX + this.initialValue ) % 10;
			amount -= remainder;
		}

		// Apply the new flex-grow values to change the column widths.
		widths[ colIndex + 1 ] = - amount + this.rightInitialValue;
		widths[ colIndex ] = amount + this.initialValue;

		cols[ colIndex + 1 ].style('flex-grow', widths[ colIndex + 1 ] );
		cols[ colIndex ].style('flex-grow', widths[ colIndex ] );
	};

	return OverlayColumnWidthRight;

})(PBSEditor.OverlayColumnWidth);



/**
 * Column width labels. These don't do anything except show width percentages of each column.
 */
PBSEditor.OverlayColumnWidthLabels = (function(_super) {
   __extends(OverlayColumnWidthLabels, _super);

   function OverlayColumnWidthLabels() {
	   OverlayColumnWidthLabels.__super__.constructor.call(this);
   }

   OverlayColumnWidthLabels.prototype.createElement = function() {
	   return document.createElement( 'DIV' );
   };

   OverlayColumnWidthLabels.prototype.canApply = function( element ) {
	   if ( ! OverlayColumnWidthLabels.__super__.canApply.call(this, element) ) {
		   return false;
	   }
	   if ( ! element ) {
		   element = this.element;
	   }
	   var ret = false;
	   var row = element;
	   if ( element.constructor.name === 'DivCol' ) {
		   row = element.parent();
		   if ( element.parent().children.length > 1 ) {
			   ret = true;
		   }
	   } else if ( element.constructor.name === 'DivRow' ) {
		   if ( element.children.length > 1 ) {
			   ret = true;
		   }
	   }

	   // Create a label div in the overlay for each column.
	   if ( ret ) {
		   while ( this._domElement.children.length > row.children.length ) {
			   this._domElement.removeChild( this._domElement.firstChild );
		   }
		   while ( this._domElement.children.length < row.children.length ) {
			   var label = document.createElement( 'DIV' );
			   this._domElement.appendChild( label );
		   }
	   }

	   return ret;

   };

   OverlayColumnWidthLabels.prototype.show = function( element ) {

	   if ( element.constructor.name === 'DivCol' ) {
		   element = element.parent();
	   }

	   var rect = element._domElement.getBoundingClientRect();

	   this._domElement.style.top = ( rect.top + window.scrollY - 20 ) + 'px';
	   this._domElement.style.height = '20px';
	   this._domElement.style.left = rect.left + 'px';
	   this._domElement.style.width = rect.width + 'px';

	   var labelContainerLeft = rect.left;
	   var percentageCount = 0;
	   for ( var i = 0; i < element.children.length; i++ ) {
		   var label = this._domElement.children[ i ];
		   var percentage = Math.round( element.children[ i ]._domElement.offsetWidth / element._domElement.offsetWidth * 100 );

		   if ( element.children.length - 1 === i ) {
			   percentage = 100 - percentageCount;
		   }
		   percentageCount += percentage;

		   label.innerHTML = percentage + '%';

		   rect = element.children[ i ]._domElement.getBoundingClientRect();
		   label.style.left = ( rect.left - labelContainerLeft + rect.width / 2 ) + 'px';
	   }
   };

   return OverlayColumnWidthLabels;

})(PBSEditor.Overlay);

/* globals PBSEditor, __extends, pbsParams */

PBSEditor.OverlayMapHeight = (function(_super) {
	__extends(OverlayMapHeight, _super);

	function OverlayMapHeight() {
		OverlayMapHeight.__super__.constructor.call(this);
	}

	OverlayMapHeight.prototype.createElement = function() {
		var element = document.createElement( 'DIV' );
		var label = document.createElement( 'DIV' );
		element.appendChild( label );
		return element;
	};

	OverlayMapHeight.prototype.canApply = function( element ) {
		if ( ! OverlayMapHeight.__super__.canApply.call(this, element) ) {
			return false;
		}
		if ( ! element ) {
			element = this.element;
		}
		return element.constructor.name === 'Map';
	};

	OverlayMapHeight.prototype.show = function( element ) {
		var styles = getComputedStyle( element._domElement );
		var rect = element._domElement.getBoundingClientRect();

		this._domElement.style.top = ( rect.bottom + window.scrollY - 7.5 ) + 'px';
		this._domElement.style.left = ( rect.left + rect.width / 2 - 7.5 - 30 ) + 'px';

		var label = styles.height;
		if ( styles.height === '250px' ) {
			label = 'Auto';
		}
		this._domElement.firstChild.innerHTML = label;
	};

	OverlayMapHeight.prototype.onMoveStart = function() {
		var styles = getComputedStyle( this.element._domElement );
		this.initialValue = parseInt( styles.height, 10 );
	};

	OverlayMapHeight.prototype.onMove = function() {
		var height = this.deltaY + this.initialValue;
		if ( height < 0 ) {
			height = 0;
		}
		if ( window.PBSEditor.isShiftDown ) {
			var remainder = height % 10;
			height -= remainder;
		}
		this.element.style( 'height', height + 'px' );
		this.element.style( 'max-height', height + 'px' );
		var styles = getComputedStyle( this.element._domElement );

		var label = styles.height;
		if ( styles.height === '250px' ) {
			label = pbsParams.labels.auto;
			this.element.style( 'max-height', '' );
		}
		this._domElement.firstChild.innerHTML = label;
	};

	OverlayMapHeight.prototype.onClick = function() {
		if ( window.PBSEditor.isShiftDown && window.PBSEditor.isCtrlDown ) {
			this.element.style( 'height', '' );
			this.element.style( 'max-height', '' );
			this.onMoveStart();
			this._domElement.style.height = this.initialValue;
			this._domElement.firstChild.innerHTML = pbsParams.labels.auto;
			return;
		}
	};

	return OverlayMapHeight;

})(PBSEditor.Overlay);

window.addEventListener( 'DOMContentLoaded', function() {
	new PBSEditor.OverlayMapHeight();
});

/* globals ContentEdit, ContentSelect, PBSEditor */


/**
 * These are additional behavior adjustments for newly introduced block elements
 * for CT (e.g. Shortcode & Embed elements).
 *
 * Behaviors added are for handling keypresses when the element is selected, etc.
 */


/**
 * All elements are placed here. Helpful for specifying droppers for new elements.
 */
PBSEditor.allDroppers = {
	'Carousel': ContentEdit.Element._dropVert,
	'DivRow': ContentEdit.Element._dropVert,
	'Div': ContentEdit.Element._dropVert,
	'Embed': ContentEdit.Element._dropVert,
	'Hr': ContentEdit.Element._dropVert,
	'IFrame': ContentEdit.Element._dropVert,
	'Shortcode': ContentEdit.Element._dropVert,
	'Static': ContentEdit.Element._dropVert,
	'Text': ContentEdit.Element._dropVert,
	'Image': ContentEdit.Element._dropVert,
	'List': ContentEdit.Element._dropVert,
	'PreText': ContentEdit.Element._dropVert,
	'Table': ContentEdit.Element._dropVert,
	'Video': ContentEdit.Element._dropVert
};


/**
 * Check if this is one of our new elements.
 * Our new elements are all derived from the ContentEdit.Static class.
 */
PBSEditor.isNewStaticLikeElement = function( element ) {
	if ( element.constructor.name === 'Static' ) {
		return false;
	}
	if ( typeof element._content === 'undefined' ) {
		return false;
	}
	return true;
};


/********************************************************************************
 * Handle moving left/up into an element.
 ********************************************************************************/
ContentEdit.Text.prototype._elementOverrideKeyLeft = ContentEdit.Text.prototype._keyLeft;
ContentEdit.Text.prototype._keyLeft = function(ev) {
	var selection = ContentSelect.Range.query(this._domElement);

	if ( selection.get()[0] === 0 ) {
		var elem = this.previousContent();
		if ( elem ) {
			if ( PBSEditor.isNewStaticLikeElement( elem ) ) {
				ev.preventDefault();
				ev.stopPropagation(); // We need this or else the SC won't get focused
				elem.focus();
				return;
			}
		}
	}

	return this._elementOverrideKeyLeft(ev);
};


/********************************************************************************
 * Handle moving right/down into an element.
 ********************************************************************************/
ContentEdit.Text.prototype._elementOverrideKeyRight = ContentEdit.Text.prototype._keyRight;
ContentEdit.Text.prototype._keyRight = function(ev) {
	var selection = ContentSelect.Range.query(this._domElement);

	if ( this._atEnd(selection) ) {
		var elem = this.nextContent();
		if ( elem ) {
			if ( PBSEditor.isNewStaticLikeElement( elem ) ) {
				ev.preventDefault();
				ev.stopPropagation(); // We need this or else the SC won't get focused
				elem.focus();
				return;
			}
		}
	}

	return this._elementOverrideKeyRight(ev);
};


/*******************************************************************************************
 * Handle keypresses when an Element is focused.
 * We cannot handle keypresses inside the element since it cannot be focused.
 *******************************************************************************************/
window.addEventListener( 'DOMContentLoaded', function() {
	var editor = ContentEdit.Root.get();
	document.addEventListener('keydown', function(ev) {

		if ( ! editor.focused() ) {
			return;
		}

		if ( ! PBSEditor.isNewStaticLikeElement( editor.focused() ) ) {
			return;
		}

		// Only continue when nothing's selected
		if ( ['body', 'html'].indexOf( ev.target.tagName.toLowerCase() ) === -1 ) {
			return;
		}

		// Don't handle individual shift, alt, ctrl, command/window keypresses.
		if ( [16, 17, 18, 91, 92].indexOf( ev.which ) !== -1 ) {
			return;
		}

		var sc = editor.focused(), p, elem, parent, selection,
			index = sc.parent().children.indexOf( sc );

		// Don't double return
		if ( [13, 8, 46].indexOf( ev.which ) !== -1 ) {
			ev.preventDefault();
		}

		// Delete & backspace deletes the element then move to the next/prev element.

		// Backspace, focus on the end of the previous element.
		if ( ev.which === 8 ) {
			sc.blur();
			if ( sc.parent().children[ index - 1 ] ) {
				elem = sc.parent().children[ index - 1 ];
				elem.focus();
				if ( elem.content ) {
			        selection = new ContentSelect.Range(elem.content.length(), elem.content.length());
			        selection.select(elem._domElement);
				}
			} else if ( sc.parent().children[ index + 1 ] ) {
				elem = sc.parent().children[ index + 1 ];
				elem.focus();
				if ( elem.content ) {
			        selection = new ContentSelect.Range(elem.content.length(), elem.content.length());
			        selection.select(elem._domElement);
				}
			} else { // no children
				parent = sc.parent();
				setTimeout( function() {
					parent.children[0].focus();
				}, 1 );
			}

		// Delete, focus on the start of the next element.
		} else if ( ev.which === 46 ) {
			sc.blur();
			if ( sc.parent().children[ index + 1 ] ) {
				sc.parent().children[ index + 1 ].focus();
			} else if ( sc.parent().children[ index - 1 ] ) {
				sc.parent().children[ index - 1 ].focus();
			} else { // no children
				parent = sc.parent();
				setTimeout( function() {
					parent.children[0].focus();
				}, 1 );
			}
		}
		if ( ev.which === 8 || ev.which === 46 ) {
			sc.parent().detach( sc );
			return;
		}

		// On down & right keypress and there's a next element, focus on it.
		if ( ev.which === 40 || ev.which === 39 ) {
			if ( sc.nextContent() && sc.parent().children.indexOf( sc ) !== sc.parent().children.length - 1 ) {
				ev.preventDefault();
				sc.nextContent().focus();
				return;
			}
		}

		// On up & left keypress and there's a previous element, focus on it.
		if ( ev.which === 38 || ev.which === 37 ) {
			if ( sc.previousContent() && sc.parent().children.indexOf( sc ) !== 0 ) {
				ev.preventDefault();
				sc.previousContent().focus();
				return;
			}
		}

		// On keypress, create a new blank element and focus on it.
		// This is so that we can insert elements in other places
		if ( ev.which !== 38 && ev.which !== 37 ) { // Not up or left
			index++;
		}
		p = new ContentEdit.Text('p');
		sc.parent().attach( p, index );
		sc.blur();
		p.focus();
	});
});


/********************************************************************************
 * Include elements as previous content
 ********************************************************************************/
ContentEdit.Node.prototype._overridePreviousContent = ContentEdit.Node.prototype.previousContent;
ContentEdit.Node.prototype.previousContent = function() {
    var node = this.previousWithTest(function(node) {
		return node.content !== void 0 || PBSEditor.isNewStaticLikeElement( node );
    });
	return node;
};


/********************************************************************************
 * Include elements as next content
 ********************************************************************************/
ContentEdit.Node.prototype._overrideNextContent = ContentEdit.Node.prototype.nextContent;
ContentEdit.Node.prototype.nextContent = function() {
	return this.nextWithTest(function(node) {
		return node.content !== void 0 || PBSEditor.isNewStaticLikeElement( node );
	});
};

/* globals ContentEdit */

(function() {
	var proxied = ContentEdit.Static.prototype._onMouseUp;
	ContentEdit.Static.prototype._onMouseUp = function(ev) {
		proxied.call( this, ev );
		clearTimeout(this._dragTimeout);

		clearTimeout( this._doubleClickTimeout );
		this._doubleClickTimeout = setTimeout((function(_this) {
			return function() {
				_this._doubleClickCount = 0;
			};
		})(this), 500);
		this._doubleClickCount++;
	};
})();

(function() {
	var proxied = ContentEdit.Static.prototype._onMouseOut;
	ContentEdit.Static.prototype._onMouseOut = function(ev) {
		proxied.call( this, ev );
		this._doubleClickCount = 0;
		clearTimeout(this._dragTimeout);
	};
})();

(function() {
	var proxied = ContentEdit.Static.prototype._onMouseMove;
	ContentEdit.Static.prototype._onMouseMove = function(ev) {
		proxied.call( this, ev );
		this._doubleClickCount = 0;
	};
})();


(function() {
	var proxied = ContentEdit.Static.prototype._onMouseDown;
	ContentEdit.Static.prototype._onMouseDown = function(ev) {

		// We need to do this or else StaticDoubleClicks will go out of editing mode right after entering it.
		ev.preventDefault();
		ev.stopPropagation();

		proxied.call( this, ev );
		clearTimeout(this._dragTimeout);

		if ( this.domElement() !== ev.target ) {
			return;
		}

		this._dragTimeout = setTimeout((function(_this) {
			return function() {
				return _this.drag(ev.pageX, ev.pageY);
			};
		})(this), ContentEdit.DRAG_HOLD_DURATION / 2);

		clearTimeout( this._doubleClickTimeout );
		this._doubleClickTimeout = setTimeout((function(_this) {
			return function() {
				_this._doubleClickCount = 0;
			};
		})(this), 500);
		this._doubleClickCount++;


		// Call the _onDoubleClick handler if there is one.
		if ( this._doubleClickCount === 3 ) {
			clearTimeout(this._dragTimeout);
			this._doubleClickCount = 0;
			if ( typeof this._onDoubleClick === 'function' ) {
				this._onDoubleClick(ev);
			}
		}
	};
})();

/* globals ContentEdit, ContentSelect */

// Converts a static element into a text element containing a
// given text and returns the created text element.
ContentEdit.Static.prototype.convertToText = function( text, keepSize ) {

	if ( typeof keepSize === 'undefined' ) {
		keepSize = false;
	}

	var elem = document.createElement('P');
	elem.innerHTML = text;
	elem = ContentEdit.Text.fromDOMElement( elem );

	this.blur();

	var index = this.parent().children.indexOf( this );
	var rect = this._domElement.getBoundingClientRect();

	// Take note the space between this element and the next so we
	// can maintain the spacing after converting.
	var marginBottom = 0;
	if ( this._domElement.nextElementSibling ) {
		var nextRect = this._domElement.nextElementSibling.getBoundingClientRect();
		marginBottom = nextRect.top - rect.bottom;
	}

	this.parent().attach( elem, index );
	this.parent().detach( this );

	// Change the element's size & margin to that we won't move the
	// page contents while editing the shortcode.
	if ( keepSize ) {
		elem._domElement.style.minHeight = rect.height + 'px';
		elem._domElement.style.marginBottom = marginBottom + 'px';
	}

	// Focus & place cursor at the end
	elem.focus();

	( function( elem ) {
		setTimeout( function() {
	        var selection = new ContentSelect.Range(elem.content.length(), elem.content.length());
			if ( elem._domElement ) {
	        	selection.select(elem._domElement);
			}
		}, 1 );
	}( elem ) );

	return elem;
};

/* globals ContentEdit, __extends, PBSEditor */


ContentEdit.StaticEditable = (function(_super) {
	__extends(StaticEditable, _super);

	function StaticEditable(tagName, attributes, content) {
		this._doubleClickCount = 0;
		StaticEditable.__super__.constructor.call(this, tagName, attributes);
		this._content = content;
	}


	StaticEditable.droppers = PBSEditor.allDroppers;


    StaticEditable.prototype.blur = function() {
      var root = ContentEdit.Root.get();
      if (this.isFocused()) {
        this._removeCSSClass('ce-element--focused');
        root._focused = null;
        return root.trigger('blur', this);
      }
    };


    StaticEditable.prototype._onMouseOver = function(ev) {
      StaticEditable.__super__._onMouseOver.call(this, ev);
      return this._addCSSClass('ce-element--over');
    };


    StaticEditable.prototype.focus = function(supressDOMFocus) {
      var root;
      root = ContentEdit.Root.get();
      if (this.isFocused()) {
        return;
      }
      if (root.focused()) {
        root.focused().blur();
      }
      this._addCSSClass('ce-element--focused');
      root._focused = this;
      if (this.isMounted() && !supressDOMFocus) {
        this.domElement().focus();
      }
      return root.trigger('focus', this);
    };


	StaticEditable.prototype.cssTypeName = function() {
		return 'staticeditable';
	};


	StaticEditable.prototype.typeName = function() {
		return 'StaticEditable';
	};


	return StaticEditable;


})(ContentEdit.Static);

/* globals ContentEdit, ContentSelect, HTMLString */

(function() {
	var proxied = ContentEdit.Text.prototype._keyReturn;
	ContentEdit.Text.prototype._keyReturn = function(ev) {

		ev.preventDefault();

	    if ( this.content.isWhitespace() ) {
			return proxied.call( this, ev );
	    }

		// On shift/ctrl/command + enter, add a line break
		if ( ev.shiftKey || ev.metaKey || ev.ctrlKey ) {

	        ContentSelect.Range.query(this._domElement);
	        var selection = ContentSelect.Range.query(this._domElement);
	        var tip = this.content.substring(0, selection.get()[0]);
	        var tail = this.content.substring(selection.get()[1]);
			var cursor = selection.get()[0] + 1;
			var br = new HTMLString.String('<br><br>', true);

			// Only insert 1 br
			if ( tail.length() !== 0 ) {
				br = new HTMLString.String('<br>', true);
			}

			this.content = tip.concat(br, tail);
	        this.updateInnerHTML();
			selection.set(cursor, cursor);
			this.selection(selection);
			return this.taint();

		} else {
			return proxied.call( this, ev );
		}

	};
})();


/**
 * The new CT doesn't allow us to select empty paragraph tags inside divs,
 * this fixes it.
 */
(function() {
	// var proxied = ContentEdit.Text.prototype._onMouseDown;
    ContentEdit.Text.prototype._onMouseDown = function(ev) {
		if ( this.isFocused() && this.content.isWhitespace() ) {
			ev.preventDefault();
			return;
		}
		ContentEdit.Text.__super__._onMouseDown.call(this);
		clearTimeout(this._dragTimeout);
		return this._dragTimeout = setTimeout((function(_this) {
			return function() {
				return _this.drag(ev.pageX, ev.pageY);
			};
		})(this), ContentEdit.DRAG_HOLD_DURATION);
	};
})();


/**
 * Fix some caret and blurring problems.
 */
(function() {
	// If typing while the caret isn't in the text element, move it back.
	// This only happens when
	// var keydownHandler = function( ev ) {
	// 	var root = ContentEdit.Root.get();
	// 	var element = root.focused();
	// 	if ( ! element ) {
	// 		return;
	// 	}
	//
	// 	if ( element.content.isWhitespace() ) {
	// 		var selection = new ContentSelect.Range( 1, 1 );
	// 		selection.select( element.domElement() );
	// 	}
	// };

	// On semi-blur (clicking on another area that DOESN'T trigger a blur event),
	// bring back the caret to the original position.
	// Only entertain clicks on the area being edited.
	var bringBackState = false;
	var mouseDownHandler = function( ev ) {
		if ( ! ev.target._ceElement ) {
			if ( window.pbsSelectorMatches( ev.target, '[data-editable]' ) ) {
				var root = ContentEdit.Root.get();
				var element = root.focused();
				if ( ! element ) {
					return;
				}
				element.storeState();
				bringBackState = true;
			}
		}
	};
	var mouseUpHandler = function() {
		if ( bringBackState ) {
			bringBackState = false;

			var root = ContentEdit.Root.get();
			var element = root.focused();
			if ( ! element ) {
				return;
			}
			element.restoreState();
		}
	};

	var proxiedFocus = ContentEdit.Text.prototype.focus;
	ContentEdit.Text.prototype.focus = function( supressDOMFocus ) {
		var ret = proxiedFocus.call( this, supressDOMFocus );
		document.addEventListener( 'mousedown', mouseDownHandler );
		document.addEventListener( 'mouseup', mouseUpHandler );
		// document.addEventListener( 'keydown', keydownHandler );
		return ret;
	};
	var proxiedBlur = ContentEdit.Text.prototype.blur;
	ContentEdit.Text.prototype.blur = function() {
		var ret = proxiedBlur.call( this );
		// document.removeEventListener( 'keydown', keydownHandler );
		document.removeEventListener( 'mousedown', mouseDownHandler );
		document.removeEventListener( 'mouseup', mouseUpHandler );
		return ret;
	};
})();


/**
 * Better button handling.
 * Normally, with buttons (inline-blocks) & contenteditable,
 * putting the caret at the end and typing will put the text OUTSIDE the html tag, &
 * putting the caret at the start and typing will put the text OUTSIDE the html tag.
 * We make this experience better by adding '&nbsp;' at the ends when typing
 * so that what users type appear INSIDE the html tag, then move the caret inside
 * the html tag after or before the &nbsp;.
 */
(function() {
	var proxied = ContentEdit.Text.prototype._onKeyDown;
	ContentEdit.Text.prototype._onKeyDown = function(ev) {
		if ( [ 40, 37, 39, 38, 9, 8, 46, 13, 32 ].indexOf( ev.keyCode ) === -1 ) {
			var docRange = window.getSelection().getRangeAt(0);
			var n, range, sel;

			if ( docRange.startContainer.parentNode ) {
				if ( docRange.startContainer.nextSibling && docRange.startContainer.parentNode.tagName !== 'A' && docRange.startContainer.nextSibling.tagName === 'A' ) {

					if ( docRange.startOffset === docRange.startContainer.length ) {

						if ( ! docRange.startContainer.nextSibling.innerHTML.match( /^&nbsp;/ ) ) {
							n = document.createTextNode( '\u00A0' );
							docRange.startContainer.nextSibling.insertBefore( n, docRange.startContainer.nextSibling.firstChild );

							range = document.createRange();
							sel = window.getSelection();
							range.setStart( docRange.startContainer.nextSibling, 1 );
							range.collapse(true);
							sel.removeAllRanges();
							sel.addRange(range);
						}
					}
				}

				else if ( docRange.startContainer.parentNode.tagName === 'A' ) {

					if ( docRange.startOffset === docRange.startContainer.length ) {

						if ( ! docRange.startContainer.parentNode.innerHTML.match( /&nbsp;$/ ) ) {
							n = document.createTextNode( '\u00A0' );
							docRange.startContainer.parentNode.appendChild( n );
						}

						range = document.createRange();
						sel = window.getSelection();
						range.setStart( docRange.startContainer, docRange.startContainer.length );
						range.collapse(true);
						sel.removeAllRanges();
						sel.addRange(range);
					}
				}
			}
		}
		proxied.call( this, ev );
	};

})();



// Remove the &nbsp;s added in by the previous function on blur.
(function() {
	var proxiedBlur = ContentEdit.Text.prototype.blur;
	ContentEdit.Text.prototype.blur = function() {
		if ( this._domElement ) {
			var innerHTML = this._domElement.innerHTML;
			innerHTML = innerHTML.replace( /(\s|&nbsp;)+(<\/a>)/, '$2' );
			innerHTML = innerHTML.replace( /(<a\s[^>]+>)(&nbsp;|\s)+/, '$1' );
			if ( this._domElement.innerHTML !== innerHTML ) {
				this._domElement.innerHTML = innerHTML;
				this._syncContent();
			}
		}
		return proxiedBlur.call( this );
	};
})();


// Fixed: 'innerHTML' undefined errors encountered randomly when editing normal text.
(function() {
	var proxied = ContentEdit.Text.prototype._syncContent;
	ContentEdit.Text.prototype._syncContent = function(ev) {
		if ( this._domElement ) {
			if ( typeof this._domElement.innerHTML !== 'undefined' ) {
				return proxied.call( this, ev );
			}
		}
		return this._flagIfEmpty();
	};
})();



/* globals ContentEdit, HTMLString, pbsParams, __extends */



ContentEdit.Shortcode = (function(_super) {

	__extends(Shortcode, _super);



	Shortcode.sc_raw = '';

	Shortcode.sc_hash = '';

	Shortcode.sc_base = '';



	// Used for checking whether we should do an ajax update

	Shortcode.sc_prev_raw = '';



	function Shortcode(tagName, attributes, content) {

		this.sc_hash = attributes['data-shortcode'];

		this.sc_base = attributes['data-base'];

		this.sc_raw = atob( this.sc_hash );

		this.sc_prev_raw = this.sc_raw;

		this.model = new Backbone.Model({});

		this.parseShortcode();

		this.model.element = this;

		this.model.listenTo( this.model, 'change', this.modelChanged.bind(this) );



		this._doubleClickCount = 0;



		Shortcode.__super__.constructor.call(this, tagName, attributes);



		this._content = content;

	}



	Shortcode.btoa = function(str) {

	    return btoa( encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function(match, p1) {

	        return String.fromCharCode('0x' + p1);

	    }));

	};



	Shortcode.prototype.mount = function() {

		var ret = Shortcode.__super__.mount.call( this );



		var scStyles = getComputedStyle( this._domElement );

		if ( scStyles.height === '0px' ) {

			this._domElement.classList.add('pbs--blank');

		} else {

			this._domElement.classList.remove('pbs--blank');

		}



		return ret;

	};



	// Creates the base element of the shortcode div.

	// Does not have any contents, need to run `ajaxUpdate` after attaching to update.

	Shortcode.createShortcode = function( shortcode ) {



		var o = document.createElement('DIV');

		o.setAttribute( 'data-ce-moveable', '' );

		o.setAttribute( 'data-ce-tag', 'shortcode' );

		o.setAttribute( 'data-base', shortcode.shortcode.tag );

		// o.setAttribute( 'data-shortcode', btoa( shortcode.content ) );

		o.setAttribute( 'data-shortcode', Shortcode.btoa( shortcode.shortcode.string() ) );



		return ContentEdit.Shortcode.fromDOMElement( o );

	};



	Shortcode.prototype.convertToText = function() {

		var innerHTML = this._domElement.innerHTML;

		var elem = Shortcode.__super__.convertToText.call( this, this.sc_raw );



		elem.origShortcode = this.sc_raw;

		elem.origInnerHTML = innerHTML;

		elem.isShortcodeEditing = true;



		return elem;

	};



	Shortcode.prototype.parseShortcode = function() {

		var sc = wp.shortcode.next( this.sc_base, this.sc_raw, 0 );



		for ( var attributeName in sc.shortcode.attrs.named ) {

			if ( sc.shortcode.attrs.named.hasOwnProperty( attributeName ) ) {

				this.model.set( attributeName, sc.shortcode.attrs.named[ attributeName ], { silent: true } );

			}

		}



		for ( var i = 0; i < sc.shortcode.attrs.numeric.length; i++ ) {

			this.model.set( i, sc.shortcode.attrs.numeric[ i ], { silent: true } );

		}



		this.model.set( 'content', sc.shortcode.content, { silent: true } );

	};



	Shortcode.prototype._onDoubleClick = function() {

		if ( ! wp.hooks.applyFilters( 'pbs.shortcode.allow_raw_edit', true, this.sc_base, this ) ) {

			return;

		}

		this.convertToText();

	};



	Shortcode.prototype.cssTypeName = function() {

		return 'shortcode';

	};



	Shortcode.prototype.typeName = function() {

		return 'Shortcode';

	};



	Shortcode.prototype.clone = function() {

        var root = ContentEdit.Root.get();

        if (root.focused() === this) {

			root.focused().blur();

        }

		var clone = document.createElement('div');

		clone.innerHTML = this.html();

		var newElement = Shortcode.fromDOMElement( clone.childNodes[0] );

		var index = this.parent().children.indexOf( this );

		this.parent().attach( newElement, index + 1 );



		newElement.focus();

	};



	Shortcode.prototype.modelChanged = function() {

		this.updateSCRaw();

		this.updateSCHash();



		clearTimeout( this._scRefreshTrigger );

		var _this = this;

		this._scRefreshTrigger = setTimeout(function() {

			_this.ajaxUpdate();

		}, 500 );

	};



	Shortcode.prototype.setSCAttr = function( name, value ) {

		this.model.set( name, value );

	};



	Shortcode.prototype.setSCContent = function( value ) {

		this.model.set( 'content', value );

	};



	Shortcode.prototype.updateSCRaw = function() {

		var sc = '';

		sc += '[' + this.sc_base;



		var keys = this.model.keys();

		for ( var i = 0; i < keys.length; i++ ) {

			var attrName = keys[ i ];

			if ( attrName !== 'content' ) {

				var value = this.model.get( attrName ) || '';

				value = value.replace( /\n/g, '<br>' );

				sc += ' ' + attrName + '="' + value + '"';

			}

		}

		sc += ']';



		if ( this.model.get('content') ) {

			sc += this.model.get('content');

		}



		sc += '[/' + this.sc_base + ']';



		this.sc_raw = sc;

	};



	Shortcode.prototype.updateSCHash = function() {

		this.sc_hash = Shortcode.btoa( this.sc_raw );

		this.attr( 'data-shortcode', this.sc_hash );

	};



	Shortcode.prototype.ajaxUpdate = function( forceUpdate ) {



		// If nothing was changed, don't update.

		if ( this.sc_prev_raw === this.sc_raw && ! forceUpdate ) {

			return;

		}



		var payload = new FormData();

		payload.append( 'action', 'pbs_shortcode_render' );

		payload.append( 'shortcode', this.sc_hash );

		payload.append( 'nonce', pbsParams.shortcode_nonce );



		this._domElement.classList.add('pbs--rendering');



		var _this = this;

		var request = new XMLHttpRequest();

		request.open('POST', window.location.href );



		request.onload = function() {

			if (request.status >= 200 && request.status < 400) {



				var response = JSON.parse( request.responseText );



				// Create a dummy container for the scripts and styles the shortcode needs

				var enqueued = response.scripts + response.styles;

				var dummyContainer = document.createElement('div');

				dummyContainer.innerHTML = enqueued.trim();



				// Add the scripts & styles if they aren't in yet.

				var currentHead = document.querySelector('html').innerHTML;

				if ( enqueued.trim().length ) {

					for ( var i = dummyContainer.childNodes.length - 1; i >= 0; i-- ) {

						if ( dummyContainer.childNodes[i].getAttribute ) {

							var node = dummyContainer.childNodes[i];

							if ( currentHead.indexOf( node.outerHTML ) === -1 ) {

								document.body.appendChild( node );

							}

						}

					}

				}



				// Add the results

				var rendered = response.output.trim();

				_this._domElement.innerHTML = rendered;

				_this._content = rendered;



				// If the first element is floated, mimic the float so that the shortcode can be selectable.

				_this.style('float', '');

				if ( _this._domElement.children.length === 1 ) {

					try {

						var style = getComputedStyle( _this._domElement.firstChild );

						if ( style['float'] === 'left' || style['float'] === 'right' ) {

							_this.style('float', style['float']);

						}

					} catch ( err ) {}

				}



				// Trigger the shortcode to render.

				// This should be listened to by plugins/shortcodes so that they can render correctly upon showing up in the page

				document.dispatchEvent( new CustomEvent( 'pbs:shortcode-render', { detail: document.querySelector('.pbs--rendering') } ) );

			}

			_this._domElement.classList.remove('pbs--rendering');

			_this._domElement.classList.remove('pbs--blank');



			// Min-height is set during editing, remove it

			_this._domElement.style.minHeight = '';

			_this._domElement.style.marginBottom = '';



			// Take note of the new hash to prevent unnecessary updating.

			_this.sc_prev_raw = _this.sc_raw;



			var scStyles = getComputedStyle( _this._domElement );

			if ( scStyles.height === '0px' ) {

				_this._domElement.classList.add('pbs--blank');

			} else {

				_this._domElement.classList.remove('pbs--blank');

			}



		};



		// There was a connection error of some sort.

		request.onerror = function() {

			_this._domElement.classList.remove('pbs--rendering');



			// Min-height is set during editing, remove it

			_this._domElement.style.minHeight = '';

			_this._domElement.style.marginBottom = '';



			// Take note of the new hash to prevent unnecessary updating.

			_this.sc_prev_raw = _this.sc_raw;

		};

		request.send( payload );

	};



	return Shortcode;



})(ContentEdit.StaticEditable);



ContentEdit.TagNames.get().register(ContentEdit.Shortcode, 'shortcode');







/****************************************************************

 * Checks the contents of the element then converts shortcodes

 * into shortcode elements. Also retains normal text

 * into text elements.

 ****************************************************************/

ContentEdit.Text.prototype.convertShortcodes = function() {



	// Find shortcodes

	var html = this.content.html();

	var textParts = [];

	var shortcodes = [];



	if ( html.trim() === '' ) {

		return;

	}



	var shortcodeRegex = /\[([^\/][\w-_]+)[^\]]*\]/g;

	var shortcodeMatch = shortcodeRegex.exec( html );



	if ( ! shortcodeMatch ) {

		return;

	}



	var prevIndex = 0;

	while ( shortcodeMatch ) {



		// Don't render shortcodes that do not exist.

		if ( pbsParams.shortcodes.indexOf( shortcodeMatch[1] ) === -1 ) {

			shortcodeMatch = shortcodeRegex.exec( html );

			continue;

		}



		// The regex can capture nested shortcodes, ignore those and let the parent shortcode

		// handle the rendering

		if ( shortcodeMatch.index < prevIndex ) {

			shortcodeMatch = shortcodeRegex.exec( html );

			continue;

		}



		var base = shortcodeMatch[1];

		var sc = wp.shortcode.next( base, html, shortcodeMatch.index );

		textParts.push( html.substr( prevIndex, shortcodeMatch.index - prevIndex ) );

		shortcodes.push( sc );



		prevIndex = shortcodeMatch.index + sc.content.length;

		shortcodeMatch = shortcodeRegex.exec( html );

	}



	// Don't continue if no shortcodes are found.

	if ( shortcodes.length === 0 ) {

		return;

	}



	// Get the last part of the text.

	textParts.push( html.substr( prevIndex ) );



	var elem,

		insertAt = this.parent().children.indexOf( this ),

		parent = this.parent(),

		dom = this._domElement,

		minHeight, bottomMargin;



	if ( dom && dom.style.minHeight ) {

		minHeight = dom.style.minHeight;

		bottomMargin = dom.style.bottomMargin;

	}



	// Modify the current element and create the shortcodes seen.

	for ( var i = 0; i < textParts.length + shortcodes.length; i++ ) {



		var isShortcode = i % 2 === 1;

		elem = null;



		// The first element is always the original text element that will be altered.

		if ( i === 0 ) {

			this.content = new HTMLString.String( textParts[ i ], true);

			this.updateInnerHTML();

			this.taint();

			continue;

		}



		// Create either a shortcode or a text element.

		if ( isShortcode ) {

			elem = ContentEdit.Shortcode.createShortcode( shortcodes[ Math.floor( i / 2 ) ] );

		} else {

			// Don't create empty text elements.

			if ( textParts[ i / 2 ].trim() ) {

				elem = document.createElement('P');

				elem.innerHTML = textParts[ i / 2 ];

				elem = ContentEdit.Text.fromDOMElement( elem );

			}

		}



		// Attach the new elements.

		if ( elem ) {



			insertAt++;



			parent.attach( elem, insertAt );



			// If we just edited a shortcode (turned it into a text element), we will have a minHeight,

			// Copy it over to prevent the screen from jumping around because the heights are changing.

			// Only do this for the first shortcode.

			if ( i === 1 ) {

				if ( dom && minHeight ) {

					elem._domElement.style.minHeight = minHeight;

					elem._domElement.style.bottomMargin = bottomMargin;

				}

			}



			if ( elem.constructor.name === 'Shortcode' ) {



				// If we just edited a shortcode (turned it into a text element), we will have the original

				// shortcode remembered in this.origShortcode. If unedited, then just bring back the old

				// shortcode contents instead of doing an ajax call again.

				var doAjax = true;

				if ( i === 1 ) {

					if ( elem.sc_raw === this.origShortcode ) {

						elem._domElement.innerHTML = this.origInnerHTML;

						elem._content = this.origInnerHTML;



						var scStyles = getComputedStyle( elem._domElement );

						if ( scStyles.height === '0px' ) {

							elem._domElement.classList.add('pbs--blank');

						} else {

							elem._domElement.classList.remove('pbs--blank');

						}



						doAjax = false;

					}

				}



				if ( doAjax ) {

					elem.ajaxUpdate( true );

				}



			}

		}

	}



	// If the current element was converted into a blank, remove it.

	if ( this.parent() && this.content.isWhitespace() ) {

		this.parent().detach( this );

	}





};





/********************************************************************************

 * Event handlers to listen for typing shortcodes inside text elements

 ********************************************************************************/



// When hitting return.

(function() {

	var proxied = ContentEdit.Text.prototype._keyReturn;

	ContentEdit.Text.prototype._keyReturn = function(ev) {

		if ( this.isShortcodeEditing ) {

			this.blur();

			return this.convertShortcodes();

		}



		var ret = proxied.call( this, ev );

		this.convertShortcodes();

		return ret;

	};

})();



// On text element blur.

window.addEventListener( 'DOMContentLoaded', function() {

	ContentEdit.Root.get().bind('blur', function (element) {

		if ( element.constructor.name === 'Text' ) {

			element.convertShortcodes();

		}

	});



	// Saving WHILE shortcodes are being edited get an error, blur the text before being able to save to prevent this.

	document.querySelector('#wpadminbar').addEventListener('mouseover', function() {

		var root = ContentEdit.Root.get();

		var focused = root.focused();

		if ( focused ) {

			if ( focused.constructor.name === 'Text' ) {

				if ( focused.content ) {

					// Only do this IN shortcodes, or else the blur gets annoying.

					if ( focused.content.html().match( /\[\w+[^\]]+\]/ ) ) {

						focused.blur();

					}

				}

			}

		}

	});

});







/********************************************************************************

 * Float left/right shortcodes that have their only child as floated left/right.

 ********************************************************************************/

window.addEventListener( 'DOMContentLoaded', function() {



	// Carry over the float property to the parent shortcode div to make the behavior the same

	var shortcodes = document.querySelectorAll('[data-name="main-content"] [data-shortcode]');

	Array.prototype.forEach.call(shortcodes, function(el){

		if ( el.children.length === 1 ) {

			try {

				var style = getComputedStyle(el.firstChild);

				if ( style['float'] === 'left' || style['float'] === 'right' ) {

					el.style['float'] = style['float'];

				}

			} catch (err) {}

		}

	});



});


/* globals ContentEdit, __extends, PBSEditor */

ContentEdit.Hr = (function(_super) {
	__extends(Hr, _super);

	function Hr( tagName, attributes ) {
		this.model = new Backbone.Model({});

		Hr.__super__.constructor.call(this, tagName, attributes);

		this._content = '';
	}


    Hr.prototype.blur = function() {
      var root = ContentEdit.Root.get();
      if (this.isFocused()) {
        this._removeCSSClass('ce-element--focused');
        root._focused = null;
        return root.trigger('blur', this);
      }
    };


    Hr.droppers = PBSEditor.allDroppers;

    Hr.prototype.focus = function(supressDOMFocus) {
      var root;
      root = ContentEdit.Root.get();
      if (this.isFocused()) {
        return;
      }
      if (root.focused()) {
        root.focused().blur();
      }
      this._addCSSClass('ce-element--focused');
      root._focused = this;
      if (this.isMounted() && !supressDOMFocus) {
        this.domElement().focus();
      }
      return root.trigger('focus', this);
    };

	Hr.prototype.cssTypeName = function() {
		return 'hr';
	};

	Hr.prototype.typeName = function() {
		return 'Horizontal Rule';
	};


	return Hr;

})(ContentEdit.Static);

ContentEdit.TagNames.get().register(ContentEdit.Hr, 'hr');

/* globals ContentEdit, ContentTools, pbsParams, __extends */


ContentEdit.Embed = (function(_super) {
	__extends(Embed, _super);

	function Embed(tagName, attributes, content) {
		this.url = attributes['data-url'];
		this.model = new Backbone.Model({});

		this._doubleClickCount = 0;

		Embed.__super__.constructor.call(this, tagName, attributes);

		this._content = content;
	}

	// Creates the base element of the shortcode div.
	// Does not have any contents, need to run `ajaxUpdate` after attaching to update.
	Embed.create = function( url ) {

		var o = document.createElement('DIV');
		o.setAttribute( 'data-ce-moveable', '' );
		o.setAttribute( 'data-ce-tag', 'embed' );
		o.setAttribute( 'data-url', url );

		return ContentEdit.Embed.fromDOMElement( o );
	};


    Embed.prototype.mount = function() {
		var ret = Embed.__super__.mount.call( this );

		/*
		 * Use jQuery's html here since oEmbeds may have a script tag
		 * with them and that doesn't run with innerHTML.
		 */
		this._domElement.innerHTML = '';
		jQuery( this._domElement ).html( this._content );

		// Allow others to perform additional mounting functions.
		wp.hooks.doAction( 'pbs.embed.mount', this );

		return ret;
	};


	Embed.prototype._onDoubleClick = function() {
		this.convertToText( this.url, false );
	};

	Embed.prototype.cssTypeName = function() {
		return 'embed';
	};

	Embed.prototype.typeName = function() {
		return 'Embed';
	};


	Embed.updateEmbedContent = function( url, textElement ) {

		var payload = new FormData();
		payload.append( 'post_ID', pbsParams.post_id );
		payload.append( 'type', 'embed' );
		payload.append( 'action', 'parse-embed' );
		payload.append( 'shortcode', '[embed]' + url + '[/embed]' );

		// var _this = this;
		var request = new XMLHttpRequest();
		request.open('POST', pbsParams.ajax_url );

		request.onload = function() {
			if (request.status >= 200 && request.status < 400) {
				var response = JSON.parse( request.responseText );

				// Check if WP's check for embeddable URL failed.
				if ( ! response.success ) {
					return;
				}

				if ( ! textElement.parent() ) {
					return;
				}

				// If successful, convert the element into an Embed element.
				var elem = ContentEdit.Embed.create( url ),
					insertAt = textElement.parent().children.indexOf( textElement ),
					parent = textElement.parent();

				parent.attach( elem, insertAt );
				parent.detach( textElement );

				/*
				 * Use jQuery's html here since oEmbeds may have a script tag
				 * with them and that doesn't run with innerHTML.
				 */
				// _this._domElement.innerHTML = response.data.body;
				jQuery( elem._domElement ).html( '<p>' + response.data.body + '</p>' );
				elem._content = '<p>' + response.data.body + '</p>';

				elem._domElement.classList.remove('pbs--rendering');

				wp.hooks.doAction( 'pbs.embed.update_embed_content', elem );

			}
		};


		// There was a connection error of some sort.
		request.onerror = function() {
		};
		request.send( payload );
	};

	return Embed;

})(ContentEdit.StaticEditable);

ContentEdit.TagNames.get().register(ContentEdit.Embed, 'embed');



/****************************************************************
 * Checks the contents of the element then converts URLs
 * into oembed elements.
 ****************************************************************/
ContentEdit.Text.prototype.convertOEmbedURLs = function() {

	if ( this.content.isWhitespace() ) {
		return;
	}

	// Get the content
	var text = this.content.text();

	if ( ! text ) {
		return;
	}

	// Don't embed links.
	if ( this.content.html().match( /<a[^>]+/g ) ) {
		return;
	}

	text = text.trim();
	if ( ! text ) {
		return;
	}

	// Simple URL matching: @stephenhay
	// @see https://mathiasbynens.be/demo/url-regex
	if ( ! text.match( /^https?:\/\/[^\s/$.?#].[^\s]*$/ ) ) {
		return;
	}

	ContentEdit.Embed.updateEmbedContent( text, this );
};



// On text element blur.
window.addEventListener( 'DOMContentLoaded', function() {
	ContentEdit.Root.get().bind('blur', function (element) {
		if ( element.constructor.name === 'Text' ) {
			element.convertOEmbedURLs();
		}
	});
});



/**
 * When stopping the editor, the iframes get invalidated, re-run the scripts
 * included with the embeds to fix the iframes.
 */
window.addEventListener( 'DOMContentLoaded', function() {
	var editor = ContentTools.EditorApp.get();
	editor.bind('stop', function() {

		var shortcodes = document.querySelectorAll( '[data-ce-tag="embed"]' );
		Array.prototype.forEach.call(shortcodes, function(el){

			/*
			 * Use jQuery's html here since oEmbeds may have a script tag
			 * with them and that doesn't run with innerHTML.
			 */
			var html = el.innerHTML;
			el.innerHTML = '';
			jQuery( el ).html( html );

		});

	});
});

/* globals ContentEdit, ContentTools, ContentSelect, HTMLString, hljs */

( function() {

	// Updating the html contents removes all highlighting markup.
	ContentEdit.PreText.prototype.unhighlight = function() {
		this.updateInnerHTML();
	};

	// Turn on highlight syntaxing on the element.
	ContentEdit.PreText.prototype.rehighlight = function() {
		if ( typeof hljs !== 'undefined' ) {
			this.storeState();
			this.removeAllCSSClasses();
			hljs.highlightBlock( this._domElement );
			this.restoreState();
		}
	};

} )();


/**
 * When generating the html to save, don't include any markup. The additional
 * markup are the syntax highlighting stuff.
 */
( function() {
	var proxied = ContentEdit.PreText.prototype.html;
	ContentEdit.PreText.prototype.html = function( indent ) {
		proxied.call( this, indent );
		this._cached = this._cached.replace( /<\/?\w+[^>]*>/g, '' );
		return ( '' + indent + '<' + this._tagName + ( this._attributesToString() ) + '>' ) + ( '' + this._cached + '</' + this._tagName + '>' );
    };

} )();


/**
 * Remove all syntax highlighting when focsed on the element. Don't do syntax
 * highlighting during editing.
 */
( function() {
	var proxied = ContentEdit.PreText.prototype.focus;
    ContentEdit.PreText.prototype.focus = function() {
		var ret = proxied.call( this );
		this.unhighlight();
		return ret;
    };
} )();


/**
 * Re-apply the syntax highlighting during mounting.
 */
( function() {
	var proxied = ContentEdit.PreText.prototype.mount;
    ContentEdit.PreText.prototype.mount = function() {
		var ret = proxied.call( this );
		this.rehighlight();
		return ret;
    };
} )();


( function() {
	var proxied = ContentEdit.PreText.prototype.blur;
    ContentEdit.PreText.prototype.blur = function() {
		var ret = proxied.call( this );
		this.rehighlight();
		return ret;
    };
} )();


/**
 * When just starting out, remove all markup in the code. Assume those are all
 * syntax highlighting stuff.
 */
( function() {
	var proxied = ContentEdit.PreText.fromDOMElement;
    ContentEdit.PreText.fromDOMElement = function( domElement ) {
		domElement.innerHTML = domElement.innerHTML.replace( /<\/?\w+[^>]*>/g, '' );
		return proxied.call( this, domElement );
    };
} )();


/**
 * After we stop, turn on syntax highlighting since they will get removed.
 */
window.addEventListener( 'DOMContentLoaded', function() {
    var editor = ContentTools.EditorApp.get();
	editor.bind( 'stop', function () {
		if ( window.pbsInitAllPretext ) {
			window.pbsInitAllPretext();
		}
	} );
} );


/**
 * Support tabs inside PreText elements.
 */
( function() {
	var proxied = ContentEdit.PreText.prototype._onKeyDown;
    ContentEdit.PreText.prototype._onKeyDown = function( ev ) {
		if ( ev.keyCode === 9 ) {
			ev.preventDefault();
			ContentSelect.Range.query( this._domElement );
			var selection = ContentSelect.Range.query( this._domElement );
			var preserveWhitespace = this.content.preserveWhitespace();
			var insertAt;

			// TODO: When a string is selected, multi-indent:
			// 1. find the last \n before index 0, then turn into \n\t
			// 2. turn all \n into \n\t in the selected string.

			// if ( selection.isCollapsed() ) {
				insertAt = selection.get()[1];
				this.content = this.content.insert( insertAt, new HTMLString.String( '\t', preserveWhitespace ), preserveWhitespace );
				this.updateInnerHTML();
				insertAt += 1;
				selection = new ContentSelect.Range( insertAt, insertAt );
				selection.select( this.domElement() );
			// }
		}
		return proxied.call( this, ev );
    };
} )();

/* globals ContentTools */

/**
 * Videos can sometimes be unproportional in some themes.
 * IF FitVids is present, then use that to fix the video iframe dimensions,
 * otherwise there should be no problems. (e.g. Twenty Sixteen does not use fitvids.js)
 *
 * @see https://github.com/davatron5000/FitVids.js
 */


// Called when a Twitter embed element is mounted.
(function() {
	var fitVideos = function( element ) {

		if ( typeof jQuery === 'undefined' ) {
			return;
		}
		if ( typeof jQuery.fn.fitVids === 'undefined' ) {
			return;
		}

		var domElement = element._domElement || element;
		jQuery( domElement ).fitVids();
	};
	wp.hooks.addAction( 'pbs.embed.mount', fitVideos );
	wp.hooks.addAction( 'pbs.embed.update_embed_content', fitVideos );


	// Call Twitter API when the CT editor saves/stops because Twitter's iframe doesn't have a src.
	window.addEventListener( 'DOMContentLoaded', function() {
		var editor = ContentTools.EditorApp.get();
		editor.bind('stop', function() {

			var shortcodes = document.querySelectorAll( '[data-ce-tag="embed"] iframe' );
			Array.prototype.forEach.call(shortcodes, function(el){
				fitVideos( el.parentNode );
			});

		});
	});


})();

/* globals ContentTools, twttr */

/**
 * Twitter iframe embeds don't have a src attribute, so the iframe breaks when
 * CT/editor starts/stops, this script fixes the Twitter embeds by using
 * Twitter's Widget Library/API.
 *
 * @see https://dev.twitter.com/web/javascript/creating-widgets#create-tweet
 */


// Called when a Twitter embed element is mounted.
var pbsTwitterMount = function( element ) {

	var domElement = element._domElement || element;

	if ( domElement.querySelector( '[data-tweet-id]' ) ) {
		var tweetID = domElement.querySelector( '[data-tweet-id]' ).getAttribute( 'data-tweet-id' );

		domElement.innerHTML = '';
		twttr.widgets.createTweet( tweetID, domElement );

	}
};
wp.hooks.addAction( 'pbs.embed.mount', pbsTwitterMount );


// Call Twitter API when the CT editor saves/stops because Twitter's iframe doesn't have a src.
window.addEventListener( 'DOMContentLoaded', function() {
	var editor = ContentTools.EditorApp.get();
	editor.bind('stop', function() {

		var shortcodes = document.querySelectorAll( '[data-tweet-id]' );
		Array.prototype.forEach.call(shortcodes, function(el){
			pbsTwitterMount( el.parentNode );
		});

	});
});

/* globals ContentEdit, __extends */

ContentEdit.IFrame = (function(_super) {
	__extends(IFrame, _super);

	function IFrame(tagName, attributes, content) {
		this.model = new Backbone.Model({});

		IFrame.__super__.constructor.call(this, tagName, attributes);
		this._content = content;
	}


	IFrame.prototype.html = function() {
		return '<p>' + this._content + '</p>';
    };


	IFrame.prototype._onDoubleClick = function() {
		// Escape characters to prevent this from being read as html.
		var html = this._domElement.innerHTML.replace( /</g, '&lt;' ).replace( /<p>|<\/p>/g, '' ).replace( /data-ce-tag=['"]iframe['"]/, '' );
		var textElement = this.convertToText( html, false );
		textElement.isIframeEditing = true;
	};

	IFrame.prototype.cssTypeName = function() {
		return 'iframe';
	};

	IFrame.prototype.typeName = function() {
		return 'IFrame';
	};


	IFrame.convertTextToIFrame = function( html, textElement ) {
		// If successful, convert the element into an IFrame element.
		var elem = new ContentEdit.IFrame( 'P', [], html ),
			insertAt = textElement.parent().children.indexOf( textElement ),
			parent = textElement.parent();

		parent.attach( elem, insertAt );
		parent.detach( textElement );
	};

	return IFrame;

})(ContentEdit.StaticEditable);

ContentEdit.TagNames.get().register(ContentEdit.IFrame, 'iframe');


/**
 * Iframes are rendered inside paragraph tags. This handles the reading process of CT.
 */
(function() {
	var proxied = ContentEdit.Text.fromDOMElement;
	ContentEdit.Text.fromDOMElement = function( domElement ) {
		if ( domElement ) {
			if ( domElement.children && domElement.children.length === 1 && domElement.firstChild.tagName === 'IFRAME' ) {
				return new ContentEdit.IFrame(domElement.tagName, this.getDOMElementAttributes(domElement), domElement.innerHTML);
			}
		}
		return proxied.call( this, domElement );
	};
})();


/****************************************************************
 * Checks the contents of the element then converts URLs
 * into oiframe elements.
 ****************************************************************/
ContentEdit.Text.prototype.convertIFrameTags = function() {

	if ( this.content.isWhitespace() ) {
		return;
	}

	// Get the content
	var text = this.content.text();

	if ( ! text ) {
		return;
	}

	text = text.trim();
	if ( ! text ) {
		return;
	}

	if ( ! text.match( /^\s*<iframe.*/ ) ) {
		return;
	}

	ContentEdit.IFrame.convertTextToIFrame( text, this );
};



// On text element blur.
window.addEventListener( 'DOMContentLoaded', function() {
	ContentEdit.Root.get().bind('blur', function (element) {
		if ( element.constructor.name === 'Text' ) {
			element.convertIFrameTags();
		}
	});
});

// Saving WHILE shortcodes are being edited get an error, blur the text before being able to save to prevent this.
window.addEventListener( 'DOMContentLoaded', function() {
	document.querySelector('#wpadminbar').addEventListener('mouseover', function() {
		var root = ContentEdit.Root.get();
		var focused = root.focused();
		if ( focused ) {
			if ( focused.constructor.name === 'Text' ) {
				if ( focused.content ) {
					// Only do this for iframes.
					if ( focused.content.text().match( /^\s*<iframe.*/ ) ) {
						focused.blur();
					}
				}
			}
		}
	});
});


// When hitting return.
(function() {
	var proxied = ContentEdit.Text.prototype._keyReturn;
	ContentEdit.Text.prototype._keyReturn = function(ev) {
		if ( this.isIframeEditing ) {
			this.blur();
			return;
		}
		return proxied.call( this, ev );
	};
})();

/* globals ContentEdit, ContentSelect, pbsSelectorMatches, __extends, PBSEditor, ContentTools, HTMLString */

/**
 * Divs
 */
ContentEdit.Div = (function(_super) {
	__extends(Div, _super);

	function Div(tagName, attributes) {
		Div.__super__.constructor.call(this, tagName, attributes);
	}

	Div.prototype.cssTypeName = function() {
		return 'div';
	};
	Div.prototype.type = function() {
	  return 'Div';
	};
	Div.prototype.typeName = function() {
		return 'Div';
	};

    Div.prototype._onMouseUp = function(ev) {
		// Only do the event if we are the target, this is so that we won't bubble to other divs.
		if ( ev.target !== this._domElement ) {
			return;
		}

		Div.__super__._onMouseUp.call(this, ev);
		clearTimeout(this._dragTimeout);
	};

    Div.prototype._onMouseOut = function(ev) {
		Div.__super__._onMouseOut.call(this, ev);
		clearTimeout(this._dragTimeout);
	};

    Div.prototype._onMouseDown = function(ev) {
		// Only do the event if we are the target, this is so that we won't bubble to other divs.
		if ( ev.target !== this._domElement ) {
			return;
		}

		Div.__super__._onMouseDown.call(this, ev);
		clearTimeout(this._dragTimeout);
		if ( this.domElement() !== ev.target ) {
			return;
		}

		// This fixes dragging in Firefox.
		ev.preventDefault();

		return this._dragTimeout = setTimeout((function(_this) {
			return function() {
				return _this.drag(ev.pageX, ev.pageY);
			};
		})(this), ContentEdit.DRAG_HOLD_DURATION);
    };

	Div.prototype._onMouseOver = function(ev) {
		// Only do the event if we are the target, this is so that we won't bubble to other divs.
		if ( ev.target !== this._domElement ) {
			return;
		}

		Div.__super__._onMouseOver.call(this, ev);
	};

    Div.prototype._onMouseMove = function(ev) {
      Div.__super__._onMouseMove.call(this, ev);
    };

	Div.prototype.attach = function(component, index) {
		if ( this.children.length === 2 && typeof this.children[0].content !== 'undefined' && this.children[0].content.isWhitespace() ) {
			this.detach( this.children[0] );
		}
		if ( this.children.length === 2 && typeof this.children[1].content !== 'undefined' && this.children[1].content.isWhitespace() ) {
			this.detach( this.children[1] );
		}

		Div.__super__.attach.call(this, component, index);
	};

	Div.prototype.detach = function(element) {
		ContentEdit.NodeCollection.prototype.detach.call(this, element);

		// Make sure that we have at least 1 blank line, do not delete the last line.
		// Do this in a small timeout since this can trigger when a drop is cancelled.
		setTimeout( function() {
			if ( this.children.length === 0 ) {
				this.attach( new ContentEdit.Text('p'), 0);
			}
		}.bind( this ), 1 );
	};

	Div.prototype.focus = function() {

        var root = ContentEdit.Root.get();

		// Check if we have a text element we can select in the column.
		for ( var i = this.children.length - 1; i >= 0; i-- ) {
			if ( this.children[ i ].constructor ) {
				if ( this.children[ i ].constructor.name !== 'DivRow' ) {
					if ( this.children[ i ].isFocused() ) {
						return;
					}
					if ( root.focused() ) {
						root.focused().blur();
			        }
					if ( this.children[ i ].focus ) {
						this.children[ i ].focus();
					}
					return;
				}
			}
		}

		if ( this.children.length === 0 ) {
			this.attach( new ContentEdit.Text('p'), 0);
		}

		// Last resort, select the first element.
		if ( this.children[0].isFocused() ) {
			return;
		}
		if ( root.focused() ) {
			root.focused().blur();
        }
		this.children[0].focus();
	};

    Div.prototype.blur = function() {
      var root;
      root = ContentEdit.Root.get();
      if ( this.isFocused() ) {
        this._removeCSSClass('ce-element--focused');
        root._focused = null;
        return root.trigger('blur', this);
      }
    };

	Div._dropInside = function( element, target, placement ) {
		var insertIndex = 0;
		if (placement[0] === 'below') {
			insertIndex = target.children.length;
		}
		return target.attach(element, insertIndex);
	};

	Div.droppers = PBSEditor.allDroppers;

	Div._fromDOMElement = function(domElement) {
		var cls;

		var tagNames = ContentEdit.TagNames.get();
		if ( domElement.getAttribute('data-ce-tag') ) {
			cls = tagNames.match( domElement.getAttribute( 'data-ce-tag' ) );
		} else if ( domElement.classList.contains( 'pbs-row' ) ) {
			cls = tagNames.match( 'row' );
		} else if ( domElement.classList.contains( 'pbs-col' ) ) {
			cls = tagNames.match( 'column' );
		} else if ( domElement.getAttribute( 'data-shortcode' ) ) {
			cls = tagNames.match( 'shortcode' );
		} else if ( domElement.tagName === 'DIV' ) {
			// cls = tagNames.match('static');
			return null;
		} else {
			cls = tagNames.match(domElement.tagName);
		}

		return cls.fromDOMElement(domElement);
	};


	Div.fromDOMElement = function(domElement) {

		var element = this._fromDOMElement( domElement );
		if ( element ) {
			return element;
		}

		var c, childNode, childNodes, list, _i, _len;
		list = new this(domElement.tagName, this.getDOMElementAttributes(domElement));
		childNodes = (function() {
	        var _i, _len, _ref, _results;
	        _ref = domElement.childNodes;
	        _results = [];
	        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
				c = _ref[_i];
				_results.push(c);
	        }
			return _results;
		})();

		var tagNames = ContentEdit.TagNames.get();
		for (_i = 0, _len = childNodes.length; _i < _len; _i++) {
			childNode = childNodes[_i];
			if (childNode.nodeType !== 1) {
				continue;
			}

			var cls;
			if ( childNode.getAttribute('data-ce-tag') ) {
				cls = tagNames.match(childNode.getAttribute('data-ce-tag'));
			} else {
				cls = tagNames.match(childNode.tagName);
			}

			element = cls.fromDOMElement(childNode);
			if (element) {
				list.attach(element);
			}
		}

		// If the column doesn't contain anything, create a single blank paragraph tag
		if ( list.children.length === 0 ) {
			list.attach( new ContentEdit.Text('p'), 0);
		}
		return list;
	};

	return Div;

})(ContentEdit.ElementCollection);

ContentEdit.TagNames.get().register(ContentEdit.Div, 'div');




/**
 * Rows
 */
ContentEdit.DivRow = (function(_super) {
	__extends(DivRow, _super);

	function DivRow(tagName, attributes) {
		DivRow.__super__.constructor.call(this, tagName, attributes);
		this.isCompundElement = true;
	}

	DivRow.prototype.cssTypeName = function() {
		return 'row';
	};
	DivRow.prototype.type = function() {
	  return 'DivRow';
	};
	DivRow.prototype.typeName = function() {
		return 'Row';
	};

	DivRow.prototype.showOutline = function() {
		var currElem = this;
		while ( currElem ) {
			if ( currElem.constructor.name === 'DivRow' ) {
				currElem._addCSSClass( 'pbs-new-column' );
			}
			currElem = currElem.parent();
		}
	};

	DivRow.prototype.hideOutline = function() {
		var currElem = this;
		while ( currElem ) {
			if ( currElem.constructor.name === 'DivRow' ) {
				currElem._removeCSSClass( 'pbs-new-column' );
			}
			currElem = currElem.parent();
		}
	};

	// Don't show the mouse over highlight
	DivRow.prototype._onMouseOver = function(ev) {

		this._removeCSSClass( 'pbs-new-column' );

		var root = ContentEdit.Root.get();
		var dragging = root.dragging();

		// Don't allow rows to be dragged inside themselves
		if ( root._dropTarget !== null ) {
			if ( dragging && pbsSelectorMatches( root._dropTarget.domElement(), '.ce-element--dragging *' ) ) {
		        root._dropTarget._removeCSSClass('ce-element--drop');
		        root._dropTarget._removeCSSClass('ce-element--drop-above');
		        root._dropTarget._removeCSSClass('ce-element--drop-below');
		        root._dropTarget._removeCSSClass('ce-element--drop-center');
		        root._dropTarget._removeCSSClass('ce-element--drop-left');
		        root._dropTarget._removeCSSClass('ce-element--drop-right');
				root._dropTarget = null;
				return;
			}
		}

		DivRow.__super__._onMouseOver.call(this, ev);

		if ( ! ev.target.classList.contains('pbs-row') ) {
			this._removeCSSClass('ce-element--over');
		}
	};

	// Cancel the drag event on mouse up
	DivRow.prototype._onMouseUp = function(ev) {
		DivRow.__super__._onMouseUp.call(this, ev);
		clearTimeout(this._dragTimeout);

		// If we fall inside the check for a click between rows, check if
		// we should create an empty paragraph between rows.
		if ( this._checkForBetweenRowClick ) {
			this.testClickBetweenRows( ev );
		}
		clearTimeout( this._betweenRowSelectorTimeout );
	};

    DivRow.prototype._onMouseOut = function(ev) {
		DivRow.__super__._onMouseOut.call(this, ev);
		clearTimeout(this._dragTimeout);

		// We are no longer checking whether between rows are clicked.
		this._checkForBetweenRowClick = false;
		clearTimeout( this._betweenRowSelectorTimeout );
	};

	DivRow.prototype._onMouseMove = function(ev) {

		// We are no longer checking whether between rows are clicked.
		this._checkForBetweenRowClick = false;
		clearTimeout( this._betweenRowSelectorTimeout );

		var root = ContentEdit.Root.get();
		if ( root._dropTarget !== null ) {

			// Dragging a row inside a column should put it above/below the whole parent row
			if ( root._dropTarget.constructor.name === 'DivCol' && root.dragging().constructor.name === 'DivRow' ) {
				var row = root._dropTarget.parent();
				root._dropTarget._onMouseOut(ev);
				row._onOver(ev);
				return;
			}
			// Allow cancelling drag when hovering the currently dragged item.
			if ( ev.target === root.dragging()._domElement ) {
				root._dropTarget._removeCSSClass('ce-element--drop');
		        root._dropTarget._removeCSSClass('ce-element--drop-above');
		        root._dropTarget._removeCSSClass('ce-element--drop-below');
		        root._dropTarget._removeCSSClass('ce-element--drop-center');
		        root._dropTarget._removeCSSClass('ce-element--drop-left');
		        root._dropTarget._removeCSSClass('ce-element--drop-right');
				root._dropTarget = null;
				return;
			}
			// Don't allow rows to be dragged inside themselves
			if ( pbsSelectorMatches( root._dropTarget._domElement, '.ce-element--dragging *' ) ) {
				root._dropTarget._removeCSSClass('ce-element--drop');
		        root._dropTarget._removeCSSClass('ce-element--drop-above');
		        root._dropTarget._removeCSSClass('ce-element--drop-below');
		        root._dropTarget._removeCSSClass('ce-element--drop-center');
		        root._dropTarget._removeCSSClass('ce-element--drop-left');
		        root._dropTarget._removeCSSClass('ce-element--drop-right');
				root._dropTarget = null;
				return;
			}
		}

		DivRow.__super__._onMouseMove.call(this, ev);
		clearTimeout(this._dragTimeout);
	};

	// Allow dragging the column
    DivRow.prototype._onMouseDown = function(ev) {
		DivRow.__super__._onMouseDown.call(this, ev);
		clearTimeout(this._dragTimeout);

		// Check if between rows is clicked.
		this._checkForBetweenRowClick = true;
		clearTimeout( this._betweenRowSelectorTimeout );
		this._betweenRowSelectorTimeout = setTimeout(function() {
			this._checkForBetweenRowClick = false;
		}.bind(this), 300 );

		if ( this.domElement() !== ev.target ) {
			return;
		}

		// This fixes dragging in Firefox.
		ev.preventDefault();

		// return this.drag(ev.pageX, ev.pageY);
		return this._dragTimeout = setTimeout((function(_this) {
			return function() {
				return _this.drag(ev.pageX, ev.pageY);
			};
		})(this), ContentEdit.DRAG_HOLD_DURATION);
    };

	// Allow these elements to be dropped around Rows
	DivRow.droppers = PBSEditor.allDroppers;

	// Make sure all rows have the pbs-row class
	DivRow.prototype.mount = function() {
		DivRow.__super__.mount.call(this);
		this.addCSSClass('pbs-row');

		// Generate a unique class if there isn't one yet.
		var currentClass = this._domElement.getAttribute( 'class' );
		if ( ! currentClass.match( /pbs_row_uid_/ ) ) {
			this.addCSSClass( 'pbs_row_uid_' + Math.floor((1 + Math.random()) * 0x10000000).toString(36) );
		}

		// Full-width rows get busted when mounting, this fixes them.
		if ( window._pbsFixRowWidth ) {
			window._pbsFixRowWidth( this._domElement );
		}
	};


	// Create Row elements from dom elements
	DivRow.fromDOMElement = function(domElement) {
		var childNode, childNodes, list, _i, _len;

		list = new this(domElement.tagName, this.getDOMElementAttributes(domElement));
		childNodes = domElement.children;

		var tagNames = ContentEdit.TagNames.get();
		for (_i = 0, _len = childNodes.length; _i < _len; _i++) {
			childNode = childNodes[_i];
			if (childNode.nodeType !== 1) {
				continue;
			}

			// Only allow div columns to be placed inside rows
			if ( childNode.tagName.toLowerCase() !== 'div' && ! childNode.classList.contains( 'pbs-col' ) ) {
				continue;
			}

			var element = tagNames.match( 'column' ).fromDOMElement( childNode );
			if (element) {
				list.attach(element);
			}

		}

		return list;
	};

	DivRow.prototype.focus = function() {
		var overElem = document.querySelector('.ce-element--over');

		// If nothing's over, this means that we might be just starting the editor
		if ( overElem === null ) {
			if ( this.children[0].isFocused() ) {
				return;
			}
			this.children[0].focus();
		}

		// Select the last column when clicking directly on the row
		if ( document.querySelector('.ce-element--over') === this._domElement ) {
			if ( this.children[ this.children.length - 1 ].isFocused() ) {
				return;
			}
			this.children[ this.children.length - 1 ].focus();
		}
	};

	DivRow.prototype.addNewColumn = function( index ) {
		if ( typeof index === 'undefined' ) {
			index = this.children.length;
		}

		// If existing columns have a gap, copy it.
		var existingGap = this.hasColumnGap();

		var col = new ContentEdit.DivCol('div');
		var p = new ContentEdit.Text('p', {}, '');
		col.attach(p);
		this.attach( col, index );
		col.style('flex-grow', '1');

		// Apply existing column gap to the new column, or the previous column if adding on the end of the row.
		if ( existingGap && index !== this.children.length - 1 ) {
			col.style( 'margin-right', existingGap );
		} else if ( existingGap ) {
			this.children[ index - 1 ].style( 'margin-right', existingGap );
		}

		return col;
	};

	DivRow.prototype.adjustColumnNumber = function( numColumns ) {

		if ( this.children.length < numColumns ) {
			while ( this.children.length < numColumns ) {
				this.addNewColumn();
			}

		} else if ( this.children.length > numColumns ) {
			while ( this.children.length > numColumns ) {
				this.children[ numColumns ].blurIfFocused();
				this.children[ numColumns - 1 ].merge( this.children[ numColumns ] );
			}
		}
	};

	DivRow.prototype.adjustColumns = function( columnEquation ) {

		var arrWidths = columnEquation.replace(/(\s*\+\s*|\s+)/g, ' ').split(' ');

		this.adjustColumnNumber( arrWidths.length );

		var highestDenom = 1;
		for ( var i = 0; i < arrWidths.length; i++ ) {
			if ( arrWidths[i].indexOf('/') !== -1 ) {
				var denom = parseInt( arrWidths[i].split('/')[1], 10 );
				if ( denom > highestDenom ) {
					highestDenom = denom;
				}
			}
		}

		// Adjust the sizes
		for ( i = 0; i < arrWidths.length; i++ ) {
			var grow = 1;
			if ( arrWidths[i].indexOf('/') !== -1 ) {
				var nums = arrWidths[i].split('/');
				grow = nums[0] / nums[1] * highestDenom;
			} else {
				grow = parseInt( arrWidths[i], 10 );
			}
			this.children[i].style( 'flex-grow', grow );
		}

	};

	DivRow.prototype.clone = function() {
        this.blurIfFocused();
		var clone = document.createElement('div');
		clone.innerHTML = this.html();
		var newRow = ContentEdit.Div.fromDOMElement( clone.childNodes[0] );
		var index = this.parent().children.indexOf( this );
		this.parent().attach( newRow, index + 1 );
		newRow.focus();
		return newRow;
	};

	DivRow.prototype.getColumnEquation = function() {
		var col, colStyle, i, totalGrow = 0;

		for ( i = 0; i < this.children.length; i++ ) {
			col = this.children[ i ];
			colStyle = window.getComputedStyle( col._domElement );
			totalGrow += parseFloat( colStyle[ 'flex-grow' ] );
		}

		var equation = '';
		for ( i = 0; i < this.children.length; i++ ) {
			col = this.children[ i ];
			colStyle = window.getComputedStyle( col._domElement );
			equation += equation ? ' + ' : '';
			equation += parseFloat( colStyle[ 'flex-grow' ] ) + '/' + totalGrow;
		}

		return equation;
	};

	DivRow.prototype.blurIfFocused = function() {
        var root = ContentEdit.Root.get();
        if ( root.focused() ) {
			var currElem = root.focused();
			while ( currElem ) {
				if ( currElem === this ) {
					root.focused().blur();
					return;
				}
				currElem = currElem.parent();
			}
        }
	};

	DivRow.prototype.hasColumnGap = function() {
		var existingMargin = '';
		var currMargin = '';
		for ( var i = 0; i < this.children.length; i++ ) {
			if ( i < this.children.length - 1 ) {
				if ( currMargin === '' ) {
					currMargin = this.children[ i ]._domElement.style['margin-right'];
					existingMargin = currMargin;
				} else {
					if ( currMargin !== this.children[ i ]._domElement.style['margin-right'] ) {
						existingMargin = '';
					}
				}
			} else {
				if ( this.children[ i ]._domElement.style['margin-right'] !== '' ) {
					existingMargin = '';
				}
			}
		}
		return existingMargin;
	};

	DivRow.prototype.testClickBetweenRows = function(ev) {

		// Check if we're clicking on a row.
		if ( ! ev.target._ceElement ) {
			return;
		}
		if ( ev.target._ceElement.constructor.name !== 'DivCol' && ev.target._ceElement.constructor.name !== 'DivRow' ) {
			return;
		}
		if ( ev.target._ceElement.constructor.name === 'DivCol' ) {
			if ( ev.target._ceElement.parent() !== this ) {
				return;
			}
		}
		if ( ev.target._ceElement.constructor.name === 'DivRow' ) {
			if ( ev.target._ceElement !== this ) {
				return;
			}
		}
		// Prevent rows which are inside compound elements.
		if ( this.parent().constructor.name !== 'Region' && this.parent().constructor.name !== 'DivCol' ) {
			return;
		}

		// Check if we clicked near the edge.
		var clickedOnTop = false;
		var clickedOnBottom = false;
		if ( ev.offsetY < 10 ) {
			clickedOnTop = true;
		} else if ( ev.offsetY > ev.target.offsetHeight - 10 ) {
			clickedOnBottom = true;
		} else {
			return;
		}

		// Add the empty paragraph element if necessary.
		var index = this.parent().children.indexOf( this );
		var doAddEmpty = true, otherElement, p;
		if ( clickedOnTop ) {
			if ( index ) {
				otherElement = this.parent().children[ index - 1 ];
				if ( otherElement.type() === 'Text' ) {
					doAddEmpty = false;
				}
			}
			if ( doAddEmpty ) {
				p = new ContentEdit.Text( 'p', {}, '' );
				this.parent().attach( p, index );
				p.focus();
			}
		} else if ( clickedOnBottom ) {
			if ( index < this.parent().children.length - 1 ) {
				otherElement = this.parent().children[ index + 1 ];
				if ( otherElement.type() === 'Text' ) {
					doAddEmpty = false;
				}
			}
			if ( doAddEmpty ) {
				p = new ContentEdit.Text( 'p', {}, '' );
				this.parent().attach( p, index + 1 );
				p.focus();
			}
		}
	};

	return DivRow;

})(ContentEdit.ElementCollection);

ContentEdit.TagNames.get().register(ContentEdit.DivRow, 'row');


/**
 * Columns
 */
ContentEdit.DivCol = (function(_super) {
	__extends(DivCol, _super);

	function DivCol(tagName, attributes) {
		DivCol.__super__.constructor.call(this, tagName, attributes);
	}

	DivCol.prototype.cssTypeName = function() {
		return 'col';
	};
	DivCol.prototype.type = function() {
	  return 'DivRow';
	};
	DivCol.prototype.typeName = function() {
		return 'Column';
	};

	// Cancel the drag event on mouse up
	DivCol.prototype._onMouseUp = function(ev) {
		DivCol.__super__._onMouseUp.call(this, ev);
		clearTimeout(this._dragTimeout);
	};

    DivCol.prototype._onMouseOut = function(ev) {
		DivCol.__super__._onMouseOut.call(this, ev);
		clearTimeout(this._dragTimeout);
	};

    DivCol.prototype._onMouseDown = function(ev) {
		DivCol.__super__._onMouseDown.call(this, ev);

		clearTimeout(this._dragTimeout);
		if ( this.domElement() !== ev.target ) {
			return;
		}

		// This fixes dragging in Firefox.
		ev.preventDefault();

		// If we are in the drag row handle, drag the whole row
		// @see _onMouseMove
		// if ( this._domElement.classList.contains('pbs-drag-row') ) {
		// 	return this.parent().drag(ev.pageX, ev.pageY);
		// }

		if ( ! this.draggableParent ) {
			this.draggableParent = this.parent();
		}

		return this._dragTimeout = setTimeout((function(_this) {
			return function() {
				// Drag the column
				return _this.draggableParent.drag(ev.pageX, ev.pageY);
				// return _this.drag(ev.pageX, ev.pageY);
			};
		})(this), ContentEdit.DRAG_HOLD_DURATION);

	};


    DivCol.prototype._onMouseMove = function(ev) {
		DivCol.__super__._onMouseOver.call(this, ev);
		clearTimeout(this._dragTimeout);

		var root = ContentEdit.Root.get(),
			dragging = root.dragging();

		// When dragging into a column, drag over the parent row instead.
		if ( dragging && ev.target === this._domElement ) {

			this._onMouseOut(ev);
			this.parent()._onOver(ev);
			this.parent()._removeCSSClass( 'ce-element--over' );

		} else if ( ev.target !== this._domElement ) {

			this._removeCSSClass('ce-element--over');
		}
	};

	// No longer needed, but keep
	/*
	DivCol._dropColumn = function(element, target, placement) {

		var insertIndex;

		// If the column is dragged above/below a column, create a new row for the column then use that
		// but if the column is alone, bring the whole row to keep the styles.
		if ( target._domElement.classList.contains('pbs-drop-outside-row') ) {

			if ( element.parent().children.length === 1 ) {
				var row = element.parent();
				row.parent().detach( row );

				insertIndex = target.parent().parent().children.indexOf( target.parent() );
				if ( placement[0] === 'below' ) {
					insertIndex++;
				}

				return target.parent().parent().attach( row, insertIndex );

			} else {
				element.parent().detach( element );

				insertIndex = target.parent().parent().children.indexOf( target.parent() );
				if ( placement[0] === 'below' ) {
					insertIndex++;
				}

				var newRow;
				newRow = new ContentEdit.DivRow('div');
				newRow.attach( element );

				return target.parent().parent().attach( newRow, insertIndex );

			}

		} else {

			element.parent().detach(element);
			insertIndex = target.parent().children.indexOf(target);
			if (placement[1] === 'right' || placement[1] === 'center') {
				insertIndex++;
			}
			return target.parent().attach(element, insertIndex);
		}
	};
	*/

	// Not needed anymore, but keep
	/*
	DivCol._dropInsideOrOutside = function( element, target, placement ) {

		var row, insertIndex;

		// When dragging on the top/bottom edge of a column,
		// we'll have this class for dragging to before/after the parent row
		if ( target._domElement.classList.contains('pbs-drop-outside-row') ) {

			row = target.parent();
			element.parent().detach(element);
			insertIndex = row.parent().children.indexOf( row );
			if ( placement[0] === 'below' ) {
				insertIndex++;
			}
			return row.parent().attach( element, insertIndex );

		} else if ( element.constructor.name === 'DivCol' && target.constructor.name !== 'DivCol' ) {

			if ( element.parent().children.length === 1 ) {
				row = element.parent();
				row.parent().detach( row );

				insertIndex = target.parent().children.indexOf( target );
				if ( placement[0] === 'below' ) {
					insertIndex++;
				}

				return target.parent().attach( row, insertIndex );

			} else {
				element.parent().detach( element );

				insertIndex = target.parent().children.indexOf( target );
				if ( placement[0] === 'below' ) {
					insertIndex++;
				}

				var newRow;
				newRow = new ContentEdit.DivRow('div');
				newRow.attach( element );

				return target.parent().attach( newRow, insertIndex );
			}



		} else {
			return ContentEdit.Div._dropInside( element, target, placement );
		}
	};
	*/

	// Allow pressing tab / shift+tab to move between columns.
	DivCol.prototype._onKeyDown = function( ev ) {
		DivCol.__super__._onMouseDown.call(this, ev);

		// Add new column.
		var index;
		if ( ev.keyCode === 190 && ( ev.metaKey || ev.ctrlKey ) && ev.shiftKey ) {
			index = this.parent().children.indexOf( this );
			this.blurIfFocused();
			this.parent().addNewColumn( index + 1 ).focus();
			ev.preventDefault();
			return;
		}

		// Delete column.
		if ( ev.keyCode === 188 && ( ev.metaKey || ev.ctrlKey ) && ev.shiftKey ) {
			index = this.parent().children.indexOf( this );
			this.blurIfFocused();
			var parent = this.parent();
			parent.detach( this );
			if ( index > 0 && parent && parent.children.length ) {
				index--;
			}
			if ( parent && parent.children.length ) {
				parent.children[ index ].focus();
			}
			ev.preventDefault();
			return;
		}

		// Don't do this for lists & tables.
		if ( ev.target._ceElement ) {
			if ( ev.target._ceElement.constructor.name.toLowerCase().indexOf( 'list' ) !== -1 ) {
				return;
			} else if ( ev.target._ceElement.constructor.name.toLowerCase().indexOf( 'table' ) !== -1 ) {
				return;
			}
		}

		// Check if tab is pressed.
		if ( ev.keyCode === 9 ) {
			if ( ! ev.shiftKey && this.nextSibling() ) {
				this.nextSibling().focus();

				// Don't propagate to nested columns.
				ev.stopPropagation();
			} else if ( ev.shiftKey && this.previousSibling() ) {
				this.previousSibling().focus();

				// Don't propagate to nested columns.
				ev.stopPropagation();
			}

		}

	};

	DivCol.droppers = {};

	DivCol.prototype.mount = function() {
		DivCol.__super__.mount.call(this);

		// Make sure columns have a .pbs-col class
		this.addCSSClass('pbs-col');

		// Generate a unique class if there isn't one yet.
		var currentClass = this._domElement.getAttribute( 'class' );
		if ( ! currentClass.match( /pbs_col_uid_/ ) ) {
			this.addCSSClass( 'pbs_col_uid_' + Math.floor((1 + Math.random()) * 0x10000000).toString(36) );
		}

		// Check how many empty paragraphs are there.
		var numEmpties = 0;
		var numNonEmpties = 0;
		for ( var i = this.children.length - 1; i >= 0; i-- ) {
			if ( typeof this.children[i].content !== 'undefined' ) {
				if ( this.children[i].content.isWhitespace() ) {
					numEmpties++;
					continue;
				}
			}
			numNonEmpties++;
		}

		// Remove empty paragraph tags
		if ( numEmpties > 1 ) {
			for ( i = this.children.length - 1; i >= 0; i-- ) {
				if ( typeof this.children[i].content !== 'undefined' ) {
					if ( this.children[i].content.isWhitespace() ) {
						if ( numEmpties > 1 && numNonEmpties === 0 ) {
							this.detach( this.children[i] );
							numEmpties--;
						} else {
							this.detach( this.children[i] );
						}
					}
				}
			}
		}
	};

	DivCol.prototype.merge = function ( element ) {

		// Append the other column's content
		var len = element.children.length;
		for ( var i = 0; i < len; i++ ) {
			this.attach( element.children[0] );
		}

		// Remove the old column
		element.parent().detach( element );

		// Clean out the empty elements
		len = this.children.length;
		for ( i = len - 1; i >= 0; i-- ) {
			if ( this.children[i].content ) {
				if ( this.children[i].content.isWhitespace() ) {
					this.detach( this.children[i] );
				}
			}
		}

		return this.taint();
    };

	DivCol.fromDOMElement = function(domElement) {
		var c, childNode, childNodes, list, _i, _len;
		list = new this(domElement.tagName, this.getDOMElementAttributes(domElement));
		childNodes = (function() {
	        var _i, _len, _ref, _results;
	        _ref = domElement.childNodes;
	        _results = [];
	        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
				c = _ref[_i];
				_results.push(c);
	        }
			return _results;
		})();

		var tagNames = ContentEdit.TagNames.get();
		for (_i = 0, _len = childNodes.length; _i < _len; _i++) {
			childNode = childNodes[_i];
			if (childNode.nodeType !== 1) {
				continue;
			}

			var cls;
			if ( childNode.getAttribute('data-ce-tag') ) {
				cls = tagNames.match(childNode.getAttribute('data-ce-tag'));
			} else {
				cls = tagNames.match(childNode.tagName);
			}

			var element = cls.fromDOMElement(childNode);
			if (element) {
				list.attach(element);
			}
		}

		// If the column doesn't contain anything, create a single blank paragraph tag
		if ( list.children.length === 0 ) {
			list.attach( new ContentEdit.Text('p'), 0);
		}
		return list;
	};

	function selectAfterFocus( domElement, index ) {
		var selection = new ContentSelect.Range( index, index );
		selection.select(domElement);
	}

	DivCol.prototype.focus = function() {

        var root = ContentEdit.Root.get();

		// Check if we have a text element we can select in the column.
		// for ( var i = this.children.length - 1; i >= 0; i-- ) {
		for ( var i = 0; i < this.children.length; i++ ) {
			if ( this.children[ i ].constructor ) {
				if ( this.children[ i ].constructor.name !== 'DivRow' ) {
					if ( this.children[ i ].isFocused() ) {
						return;
					}

					if ( root.focused() ) {
						root.focused().blur();
					}
					if ( this.children[ i ].focus ) {
						this.children[ i ].focus();
					}

					// Select the element
					var index = 0;
					if ( this.children[ i ].content ) {
						index = this.children[ i ].content.length();
					}

					// Add the cursor, we need to do this at set timeout because
					// some other events are affecting the selection. We can't do
					// a preventDefault or else dragging to the screen edges won't work.
					var domElement = this.children[ i ]._domElement;
					setTimeout( selectAfterFocus, 1, domElement, index );
					return;
				}
			}
		}


		// If no text element and all children are compound elements, focus the column directly.
		if ( this.children.length ) {
			var allCompounds = true;
			for ( i = 0; i < this.children.length; i++ ) {
				if ( typeof this.children[ i ].isCompundElement === 'undefined' || ! this.children[ i ].isCompundElement ) {
					allCompounds = false;
				}
			}
			if ( allCompounds ) {
				if ( root.focused() ) {
					root.focused().blur();
				}

				this._addCSSClass( 'ce-element--focused' );
		        root._focused = this;
				this.domElement().focus();
				return root.trigger( 'focus', this );
			}
		}


		// If no text element and there's a row, select the first column inside it.
		for ( i = this.children.length - 1; i >= 0; i-- ) {
			if ( this.children[ i ].constructor ) {
				if ( this.children[ i ].constructor.name === 'DivRow' ) {
					if ( this.children[ i ].children[0].isFocused() ) {
						return;
					}
					if ( root.focused() ) {
						root.focused().blur();
					}
					this.children[ i ].children[0].focus();
					return;
				}
			}
		}

		if ( this.children.length === 0 ) {
			this.attach( new ContentEdit.Text('p'), 0);
		}

		// Last resort, select the first element.
		if ( this.children[0].isFocused() ) {
			return;
		}
		if ( root.focused() ) {
			root.focused().blur();
		}
		this.children[0].focus();
	};

	DivCol.prototype.clone = function() {
		var existingGap = this.parent().hasColumnGap();

		this.blurIfFocused();
		var clone = document.createElement('div');
		clone.innerHTML = this.html();
		var newCol = ContentEdit.Div.fromDOMElement( clone.childNodes[0] );
		var index = this.parent().children.indexOf( this );
		this.parent().attach( newCol, index + 1 );
		newCol.focus();

		// Remove existing column gap in the original column if there is one.
		if ( existingGap && this.style( 'margin-right' ) !== existingGap ) {
			this.style( 'margin-right', existingGap );
		}

		return newCol;
	};

	DivCol.prototype.blurIfFocused = function() {
        var root = ContentEdit.Root.get();
        if ( root.focused() ) {
			var currElem = root.focused();
			while ( currElem ) {
				if ( currElem === this ) {
					root.focused().blur();
					return;
				}
				currElem = currElem.parent();
			}
        }
	};

	return DivCol;

})(ContentEdit.Div);

ContentEdit.TagNames.get().register(ContentEdit.DivCol, 'column');


/**
 * Remove empty elements inside columns upon drop
 */
ContentEdit.Root.get().bind('drop', function (element, droppedElement) {
	if ( droppedElement === null ) {
		return;
	}
	if ( droppedElement.parent() === null ) {
		return;
	}
	var col, i;

	if ( droppedElement.parent().constructor.name === 'DivCol' || droppedElement.parent().constructor.name === 'Div' ) {
		col = droppedElement.parent();
		for ( i = 0; i < col.children.length; i++ ) {
			if ( col.children[i].content === null || typeof col.children[i].content === 'undefined' ) {
				continue;
			}
			if ( col.children.length > 1 && col.children[i].content.isWhitespace() && col.children[i] !== element ) {
				col.detach(col.children[i]);
			}
		}

	} else if ( droppedElement.parent().constructor.name === 'DivRow' ) {
		col = droppedElement;
		for ( i = 0; i < col.children.length; i++ ) {
			if ( col.children[i].content === null || typeof col.children[i].content === 'undefined' ) {
				continue;
			}
			if ( col.children.length > 1 && col.children[i].content.isWhitespace() && col.children[i] !== element ) {
				col.detach(col.children[i]);
			}
		}
	}
});


/**
 * Remove full-width attribute and styles when a Row becomes nested.
 */
ContentEdit.Root.get().bind('drop', function (element, droppedElement) {
	if ( droppedElement === null ) {
		return;
	}
	if ( droppedElement.parent() === null ) {
		return;
	}

	if ( element.constructor.name === 'DivRow'  ) {
		if ( element.parent().constructor.name === 'Div' || element.parent().constructor.name === 'DivCol' ) {

			if ( element.attr('data-width') ) {

				element.style('margin-right', '');
				element.style('margin-left', '');

				if ( element.attr('data-width') === 'full-width-retain-content' ) {
					element.style('padding-right', '');
					element.style('padding-left', '');
				}

				// Remove the width if nested.
				element.removeAttr( 'data-width' );
			}
		}
	}
});



/**
 * When pressing the return key at the end of a div, create a new paragraph outside the div
 */
// (function() {
// 	var proxied = ContentEdit.Text.prototype._keyReturn;
// 	ContentEdit.Text.prototype._keyReturn = function(ev) {
// 		ev.preventDefault();
//
// 		if ( ! this.content.isWhitespace() ) {
// 			return proxied.call( this, ev );
// 		}
//
// 		if ( ( this.parent().constructor.name === 'DivCol' || this.parent().constructor.name === 'Div' ) && this.parent().children.indexOf(this) === this.parent().children.length - 1 ) {
//
// 			var row = this.parent().parent();
// 			this.parent().detach(this);
// 			var index = row.parent().children.indexOf(row) + 1;
// 			var p = new ContentEdit.Text('p', {}, '');
// 			row.parent().attach(p, index );
// 			p.focus();
// 			return;
// 		}
//
// 		return proxied.call( this, ev );
// 	};
// })();


/**
 * When pressing the up key at the very start of a div, create a new paragraph before the div
 */
(function() {
	var proxied = ContentEdit.Text.prototype._keyUp;
	ContentEdit.Text.prototype._keyUp = function( ev ) {
	    var selection = ContentSelect.Range.query(this._domElement);
		// this.parent().parent().parent().children.indexOf( this.parent().parent() ) === 0
		if ( ( this.parent().constructor.name === 'DivCol' || this.parent().constructor.name === 'Div' ) && this.parent().children.indexOf(this) === 0 && selection.get()[0] === 0 ) {
			var row = this.parent().parent();
			var index = row.parent().children.indexOf(row);
			if ( index > 0 ) {
				if ( row.parent().children[ index - 1 ].content ) {
					row.parent().children[ index - 1 ].focus();
					return;
				}
			}
			var p = new ContentEdit.Text('p', {}, '');
			row.parent().attach( p, index );
			p.focus();
			return;
		}
		return proxied.call( this, ev );
	};
})();

/**
 * When pressing the down key at the very end of a div, create a new paragraph after the div
 */
(function() {
	var proxied = ContentEdit.Text.prototype._keyDown;
	ContentEdit.Text.prototype._keyDown = function( ev ) {
	    var selection = ContentSelect.Range.query(this._domElement);
		// this.parent().parent().parent().children.indexOf( this.parent().parent() ) === this.parent().parent().parent().children.length - 1
		if ( ( this.parent().constructor.name === 'DivCol' || this.parent().constructor.name === 'Div' ) && this.parent().children.indexOf(this) === this.parent().children.length - 1 && this._atEnd(selection) ) {
			var row = this.parent().parent();
			var index = row.parent().children.indexOf( row );
			if ( index < row.parent().children.length - 1 ) {
				if ( row.parent().children[ index + 1 ].content ) {
					row.parent().children[ index + 1 ].focus();
					return;
				}
			}
			var p = new ContentEdit.Text('p', {}, '');
			row.parent().attach( p, index + 1 );
			p.focus();
			return;
		}
		return proxied.call( this, ev );
	};
})();


/**
 * Don't triger an empty text dettach if the text is.
 */
(function() {
	var proxied = ContentEdit.Text.prototype.blur;
	ContentEdit.Text.prototype.blur = function( ev ) {
		if ( this.content.isWhitespace() ) {
			if ( this.parent() ) {
				if ( this.parent().constructor.name === 'Div' || this.parent().constructor.name === 'DivCol' ) {
					var otherWhitespaces = 0;
					var otherNonWhitespaces = 0;
					for ( var i = 0; i < this.parent().children.length; i++ ) {
						var sibling = this.parent().children[ i ];
						if ( sibling.content ) {
							if ( sibling.content.isWhitespace() ) {
								otherWhitespaces++;
								continue;
							}
						}
						otherNonWhitespaces++;
					}
					if ( otherWhitespaces === 1 && otherNonWhitespaces === 0 ) {
						var error;
						if ( this.isMounted() ) {
							this._syncContent();
						}
						if (this.isMounted()) {
							try {
								this._domElement.blur();
							} catch (_error) {
								error = _error;
							}
							this._domElement.removeAttribute('contenteditable');
						}
						return ContentEdit.Text.__super__.blur.call(this);
					}
				}
			}
		}
		return proxied.call( this, ev );
	};
})();


/**
 * When dragging a column on an element inside it, remove the effects to make it look like
 * nothing's happening.
 */
// ContentEdit.Element.prototype._onColOverrideMouseOver = ContentEdit.Element.prototype._onMouseOver;
// ContentEdit.Element.prototype._onMouseOver = function(ev) {
// 	var ret = this._onColOverrideMouseOver(ev);
//
// 	var root = ContentEdit.Root.get();
// 	var dragging = root.dragging();
//
// 	if ( dragging ) {
// 		if ( dragging.constructor.name === 'DivCol' ) {
// 			if ( pbsSelectorMatches( ev.target, '.ce-element--dragging *' ) ) {
// 				var over = document.querySelector('.ce-element--over');
// 				if ( over ) {
// 			        over._ceElement._removeCSSClass('ce-element--over');
// 					dragging._addCSSClass('ce-element--over');
// 				}
// 			}
// 		}
// 	}
//
// 	return ret;
// };


// Remove the computed widths on rows on saving.
wp.hooks.addFilter( 'pbs.save', function( html ) {

	html = html.replace(/(<[^>]+pbs-row[^>]+style=[^>]*[^-])(max-width:\s?[-0-9.\w]+;?\s?)([^>]+>)/g, '$1$3');
	html = html.replace(/(<[^>]+pbs-row[^>]+style\=[^>]*[^-])(width:\s?[-0-9.\w]+;?\s?)([^>]+>)/g, '$1$3');
	html = html.replace(/(<[^>]+pbs-row[^>]+style=[^>]*[^-])(left:\s?[-0-9.\w]+;?\s?)([^>]+>)/g, '$1$3');

	// Remove spaces surrounding divs.
	html = html.replace( /(<div[^>]+>)\s+/gm, '$1' );
	html = html.replace( /\s+(<\/div>)/gm, '$1' );

	// For full-width-retain-content,
	// Don't save left/right paddings & margins since those will be computed by the full-width script.
	html = html.replace( /<[^>]+pbs-row[^>]+data-width\=["']full-width-retain-content["'][^>]+>/g,
		function ( match ) {
			match = match.replace( /(padding:\s?)([\d\w.]+)\s([\d\w.]+)\s([\d\w.]+)\s([\d\w.]+)[;"']/, 'padding-top: $2; padding-bottom: $4;' );
			match = match.replace( /(padding:\s?)([\d\w.]+)\s([\d\w.]+)\s([\d\w.]+)[;"']/, 'padding-top: $2; padding-bottom: $4;' );
			match = match.replace( /(padding:\s?)([\d\w.]+)\s([\d\w.]+)[;"']/, 'padding-top: $2; padding-bottom: $2;' );
			match = match.replace( /(padding:\s?)([\d\w.]+)[;"']/, 'padding-top: $2; padding-bottom: $2;' );

			match = match.replace( /\s?padding-left:\s?[\d\w.]+;?\s?/g, '' );
			match = match.replace( /\s?padding-right:\s?[\d\w.]+;?\s?/g, '' );

			match = match.replace( /(margin:\s?)([\d\w.]+)\s([\d\w.]+)\s([\d\w.]+)\s([\d\w.]+)[;"']/, 'margin-top: $2; margin-bottom: $4;' );
			match = match.replace( /(margin:\s?)([\d\w.]+)\s([\d\w.]+)\s([\d\w.]+)[;"']/, 'margin-top: $2; margin-bottom: $4;' );
			match = match.replace( /(margin:\s?)([\d\w.]+)\s([\d\w.]+)[;"']/, 'margin-top: $2; margin-bottom: $2;' );
			match = match.replace( /(margin:\s?)([\d\w.]+)[;"']/, 'margin-top: $2; margin-bottom: $2;' );

			match = match.replace( /\s?margin-left:\s?[\d\w.-]+;?\s?/g, '' );
			match = match.replace( /\s?margin-right:\s?[\d\w.-]+;?\s?/g, '' );

			match = match.replace( /([^-])left:\s?[-\d\w.]+;?\s?/g, '$1' );
			return match;
		}
	);

	// For full-width,
	// Don't save left/right margins since those will be computed by the full-width script.
	html = html.replace( /<[^>]+pbs-row[^>]+data-width\=["']full-width["'][^>]+>/g,
		function ( match ) {
			match = match.replace( /(margin:\s?)([\d\w.]+)\s([\d\w.]+)\s([\d\w.]+)\s([\d\w.]+)[;"']/, 'margin-top: $2; margin-bottom: $4;' );
			match = match.replace( /(margin:\s?)([\d\w.]+)\s([\d\w.]+)\s([\d\w.]+)[;"']/, 'margin-top: $2; margin-bottom: $4;' );
			match = match.replace( /(margin:\s?)([\d\w.]+)\s([\d\w.]+)[;"']/, 'margin-top: $2; margin-bottom: $2;' );
			match = match.replace( /(margin:\s?)([\d\w.]+)[;"']/, 'margin-top: $2; margin-bottom: $2;' );

			match = match.replace( /\s?margin-left:\s?[\d\w.-]+;?\s?/g, '' );
			match = match.replace( /\s?margin-right:\s?[\d\w.-]+;?\s?/g, '' );

			match = match.replace( /([^-])left:\s?[-\d\w.]+;?\s?/g, '$1' );
			return match;
		}
	);


	return html;
} );


/**
 * Fixes issue: When pasting multiple lines of text inside a row, the text gets pasted OUTSIDE the row.
 * Problem: CT checks if the parent is not of type 'Region'
 * Solution: Check also if the parent is a 'DivRow'.
 * Most of this code comes from _EditorApp.prototype.paste
 */
(function() {
	var _EditorApp = ContentTools.EditorApp.getCls();
	var proxied = _EditorApp.prototype.paste;
	_EditorApp.prototype.paste = function(element, clipboardData) {
		var content, encodeHTML, i, insertAt, insertIn, insertNode, item, lastItem, line, lineLength, lines, type, _i, _len;
        content = clipboardData.getData('text/plain');
        lines = content.split('\n');
        lines = lines.filter(function(line) {
			return line.trim() !== '';
        });
        if (!lines) {
			return proxied.call( this, element, clipboardData );
        }
		encodeHTML = HTMLString.String.encode;
        type = element.type();
		if ( type === 'PreText' || type === 'ListItemText' || element.parent().type() !== 'DivRow' ) {
			return proxied.call( this, element, clipboardData );
		}
		// We're sure that the element is inside a Row.
		if ( lines.length > 1 || ! element.content ) {
            insertNode = element;
			insertIn = insertNode.parent();
			insertAt = insertIn.children.indexOf(insertNode) + 1;
			for (i = _i = 0, _len = lines.length; _i < _len; i = ++_i) {
				line = lines[i];
				line = encodeHTML(line);
				item = new ContentEdit.Text('p', {}, line);
				lastItem = item;
				insertIn.attach(item, insertAt + i);
			}
			lineLength = lastItem.content.length();
			lastItem.focus();
			return lastItem.selection(new ContentSelect.Range(lineLength, lineLength));
		}
		return proxied.call( this, element, clipboardData );
	};
})();

/* globals ContentEdit, __extends, PBSEditor, pbsParams */

ContentEdit.Icon = ( function( _super ) {
	__extends( Icon, _super );

	function Icon( tagName, attributes, content ) {

		if ( ! attributes['data-ce-tag'] ) {
			attributes['data-ce-tag'] = 'icon';
		}
		if ( ! attributes.role ) {
			attributes.role = 'presentation';
		}

		Icon.__super__.constructor.call(this, tagName, attributes);

        this._content = content;

        this._domSizeInfoElement = null;
        this._aspectRatio = 1;
	}

	Icon.prototype.cssTypeName = function() {
		return 'icon';
	};

	Icon.prototype.typeName = function() {
		return 'Icon';
	};

    Icon.fromDOMElement = function(domElement) {
		return new this(domElement.tagName, this.getDOMElementAttributes(domElement), domElement.innerHTML);
    };

    Icon.droppers = PBSEditor.allDroppers;

    Icon.prototype.focus = function(supressDOMFocus) {
		var root;
		root = ContentEdit.Root.get();
		if (this.isFocused()) {
			return;
		}
		if (root.focused()) {
			root.focused().blur();
		}
		this._addCSSClass('ce-element--focused');
		root._focused = this;
		if (this.isMounted() && !supressDOMFocus) {
			this.domElement().focus();
		}
		return root.trigger('focus', this);
    };

    Icon.prototype.blur = function() {
      var root;
      root = ContentEdit.Root.get();
    //   if ( this.isFocused() ) {
        this._removeCSSClass( 'ce-element--over' );
        this._removeCSSClass( 'ce-element--focused' );
        root._focused = null;
        return root.trigger( 'blur', this );
    //   }
    };

	Icon.prototype.mount = function() {
		var ret = Icon.__super__.mount.call( this );

		// Required attributes.
		var svg = this._domElement.children[0];
		svg.setAttribute( 'xmlns', 'http://www.w3.org/2000/svg' );
		svg.setAttributeNS( 'http://www.w3.org/2000/xmlns/', 'xmlns:xlink', 'http://www.w3.org/1999/xlink' );

		// We need to add a whitespace inside the svg tag or else
		// TinyMCE in the backend will remove the svg.
		// content = content.replace( /\s*\<\/svg>/g, ' </svg>' );
		svg.innerHTML = svg.innerHTML.trim() + ' ';

		this._content = this._domElement.innerHTML;

		this._domElement.setAttribute('data-ce-size', this._getSizeInfo());
		// if ( this._domElement. )

		return ret;
	};

	Icon.prototype.change = function( svg ) {
		this._domElement.innerHTML = svg.outerHTML;
		this._content = this._domElement.innerHTML;
		this.taint();
	};

	Icon.prototype.clone = function() {
		if ( this.isFocused() ) {
			this.blur();
		}
		var clone = document.createElement('div');
		clone.innerHTML = this.html();
		var newElem = ContentEdit.Div.fromDOMElement( clone.childNodes[0] );
		var index = this.parent().children.indexOf( this );
		this.parent().attach( newElem, index + 1 );
		newElem.focus();
		return newElem;
	};

	Icon.prototype._onMouseOver = function(ev) {
	  Icon.__super__._onMouseOver.call(this, ev);
	  return this._addCSSClass('ce-element--over');
	};

	Icon.droppers = PBSEditor.allDroppers;


    Icon.prototype.aspectRatio = function() {
      return this._aspectRatio;
    };

    Icon.prototype.maxSize = function() {
      var maxWidth;
      maxWidth = parseInt( this.attr('data-ce-max-width') || 0, 10 );
      if (!maxWidth) {
        maxWidth = ContentEdit.DEFAULT_MAX_ELEMENT_WIDTH;
      }
      maxWidth = Math.max(maxWidth, this.size()[0]);
      return [maxWidth, maxWidth * this.aspectRatio()];
    };

    Icon.prototype.minSize = function() {
      var minWidth;
      minWidth = parseInt( this.attr('data-ce-min-width') || 0, 10 );
      if (!minWidth) {
        minWidth = 20;
        //   minWidth = ContentEdit.DEFAULT_MIN_ELEMENT_WIDTH;
      }
      minWidth = Math.min(minWidth, this.size()[0]);
      return [minWidth, minWidth * this.aspectRatio()];
    };

    Icon.prototype.resize = function(corner, x, y) {
      if (!this.isMounted()) {
        return;
      }
      return ContentEdit.Root.get().startResizing(this, corner, x, y, true);
    };


	Icon.prototype._onDoubleClick = function() {
		PBSEditor.iconFrame.open({
			title: pbsParams.labels.icon_frame_change_title,
			button: pbsParams.labels.icon_frame_change_button,
			successCallback: function( frameView ) {
				this.change( frameView.selected.firstChild );
			}.bind( this )
		});
	};

    Icon.prototype.size = function(newSize) {
		var height, maxSize, minSize, width;
		if (!newSize) {
			width = parseInt( this.style( 'width' ) || 1, 10 );
			height = parseInt( this.style( 'height' ) || 1, 10 );
			return [width, height];
		}
		newSize[0] = parseInt( newSize[0], 10 );
		newSize[1] = parseInt( newSize[1], 10 );
		minSize = this.minSize();
		newSize[0] = Math.max(newSize[0], minSize[0]);
		newSize[1] = Math.max(newSize[1], minSize[1]);
		maxSize = this.maxSize();
		newSize[0] = Math.min(newSize[0], maxSize[0]);
		newSize[1] = Math.min(newSize[1], maxSize[1]);
		this.style( 'width', parseInt( newSize[0], 10 ) + 'px' );
		this.style( 'height', parseInt( newSize[1], 10 ) + 'px' );
		if (this.isMounted()) {
			this._domElement.style.width = newSize[0] + 'px';
			this._domElement.style.height = newSize[1] + 'px';
			return this._domElement.setAttribute('data-ce-size', this._getSizeInfo());
		}
    };

    Icon.prototype._onMouseDown = function(ev) {
      var corner;
      Icon.__super__._onMouseDown.call(this, ev);
      corner = this._getResizeCorner(ev.clientX, ev.clientY);
      if (corner) {

		  // Reset the size back to 100px x 100px in SHIFT+CTRL/CMD click.
		  if ( window.PBSEditor.isCtrlDown && window.PBSEditor.isShiftDown ) {
			  this.style( 'width', '100px' );
			  this.style( 'height', '100px' );
		  }

		  // Cancel the normal dragging behavior
        clearTimeout(this._dragTimeout);
        return this.resize(corner, ev.clientX, ev.clientY);
      } else {
        clearTimeout(this._dragTimeout);
        return this._dragTimeout = setTimeout((function(_this) {
          return function() {
            return _this.drag(ev.pageX, ev.pageY);
          };
        })(this), 150);
      }
    };

    Icon.prototype._onMouseMove = function(ev) {
      var corner;
      Icon.__super__._onMouseMove.call(this);
      this._removeCSSClass('ce-element--resize-top-left');
      this._removeCSSClass('ce-element--resize-top-right');
      this._removeCSSClass('ce-element--resize-bottom-left');
      this._removeCSSClass('ce-element--resize-bottom-right');
      corner = this._getResizeCorner(ev.clientX, ev.clientY);
      if (corner) {
        return this._addCSSClass('ce-element--resize-' + corner[0] + '-' + corner[1]);
      }
    };

    Icon.prototype._onMouseOut = function( ev ) {
		Icon.__super__._onMouseOut.call( this, ev );
		this._removeCSSClass('ce-element--resize-top-left');
		this._removeCSSClass('ce-element--resize-top-right');
		this._removeCSSClass('ce-element--resize-bottom-left');
		return this._removeCSSClass('ce-element--resize-bottom-right');
    };

    Icon.prototype._onMouseUp = function( ev ) {
		Icon.__super__._onMouseUp.call(this, ev );
		if (this._dragTimeout) {
			return clearTimeout(this._dragTimeout);
		}
    };

    Icon.prototype._getResizeCorner = function(x, y) {
      var corner, cornerSize, rect, size, _ref;
      rect = this._domElement.getBoundingClientRect();
      _ref = [x - rect.left, y - rect.top], x = _ref[0], y = _ref[1];
      size = this.size();
      cornerSize = ContentEdit.RESIZE_CORNER_SIZE;
      cornerSize = Math.min(cornerSize, Math.max( parseInt( size[0] / 4, 10 ), 1));
      cornerSize = Math.min(cornerSize, Math.max( parseInt( size[1] / 4, 10 ), 1));
      corner = null;
      if (x < cornerSize) {
        if (y < cornerSize) {
          corner = ['top', 'left'];
        } else if (y > rect.height - cornerSize) {
          corner = ['bottom', 'left'];
        }
      } else if (x > rect.width - cornerSize) {
        if (y < cornerSize) {
          corner = ['top', 'right'];
        } else if (y > rect.height - cornerSize) {
          corner = ['bottom', 'right'];
        }
	}
      return corner;
    };

    Icon.prototype._getSizeInfo = function() {
      var size;
      size = this.size();
      return 'w ' + size[0] + ' × h ' + size[1];
    };

	return Icon;

})(ContentEdit.Static);

ContentEdit.TagNames.get().register( ContentEdit.Icon, 'icon' );

/* globals ContentEdit, __extends, PBSEditor, pbsParams */

ContentEdit.Html = (function(_super) {
	__extends(Html, _super);

	function Html(tagName, attributes, content) {
		this.model = new Backbone.Model({});

		Html.__super__.constructor.call(this, tagName, attributes);
		this._content = content;
	}

	Html.prototype.openEditor = function() {
		PBSEditor.htmlFrame.open({
			title: pbsParams.labels.html,
			button: pbsParams.labels.html_frame_button,
			successCallback: function( frameView ) {
				var html = frameView.getHtml();
				this._domElement.innerHTML = html;
				this._content = html;

				if ( ! html ) {
					if ( this.nextContent() ) {
						this.nextContent().focus();
					} else if ( this.previousContent() ) {
						this.previousContent().focus();
					}
					this.parent().detach( this );
				}
			}.bind( this ),
			openCallback: function( frameView ) {
				frameView.setHtml( this._content );
			}.bind( this )
		});
	};


	Html.prototype._onDoubleClick = function() {
		this.openEditor();
	};

	Html.prototype.cssTypeName = function() {
		return 'html';
	};

	Html.prototype.typeName = function() {
		return 'Html';
	};

    Html.prototype.focus = function(supressDOMFocus) {
		var root;
		root = ContentEdit.Root.get();
		if (this.isFocused()) {
			return;
		}
		if (root.focused()) {
			root.focused().blur();
		}
		this._addCSSClass('ce-element--focused');
		root._focused = this;
		if (this.isMounted() && !supressDOMFocus) {
			this.domElement().focus();
		}
		return root.trigger('focus', this);
    };

    Html.prototype.blur = function() {
		var root;
		root = ContentEdit.Root.get();
        this._removeCSSClass( 'ce-element--over' );
        this._removeCSSClass( 'ce-element--focused' );
        root._focused = null;
        return root.trigger( 'blur', this );
    };

	Html.prototype._onMouseOver = function(ev) {
		Html.__super__._onMouseOver.call(this, ev);
		return this._addCSSClass('ce-element--over');
	};

	return Html;

})(ContentEdit.StaticEditable);

ContentEdit.TagNames.get().register( ContentEdit.Html, 'html' );

/**
 * Widgets are actually just shortcodes.
 */

/* globals pbsParams */

 // wp.hooks.addFilter( 'pbs.shortcode.allow_raw_edit', function( allow, scBase ) {
 //  if ( scBase === 'pbs_widget' ) {
 // 	 return false;
 //  }
 //  return allow;
 // } );

// wp.hooks.addFilter( 'pbs.toolbar.tools.allow', function( allow, target ) {
// 	if ( target.getAttribute('data-base') === 'pbs_widget' ) {
// 		return false;
// 	}
// 	return allow;
// } );

wp.hooks.addFilter( 'pbs.toolbar.shortcode.label', function( scBase ) {
	if ( scBase === 'pbs_sidebar' ) {
		return pbsParams.labels.sidebar;
	}
	return scBase;
} );

/* globals ContentEdit, __extends, PBSEditor, ContentTools, google */

ContentEdit.Map = (function(_super) {
	__extends(Map, _super);

	function Map( tagName, attributes ) {
		if ( ! attributes['data-ce-tag'] ) {
			attributes['data-ce-tag'] = 'map';
		}

		this.model = new Backbone.Model({});

		Map.__super__.constructor.call(this, tagName, attributes);

		this._content = '';
	}


    Map.prototype.blur = function() {
      var root = ContentEdit.Root.get();
      if (this.isFocused()) {
		  this._removeCSSClass( 'ce-element--over' );
        this._removeCSSClass('ce-element--focused');
        root._focused = null;
        return root.trigger('blur', this);
      }
    };

	Map.prototype._onMouseOver = function(ev) {
		Map.__super__._onMouseOver.call(this, ev);
		return this._addCSSClass('ce-element--over');
	};

    Map.prototype._onMouseUp = function( ev ) {
		Map.__super__._onMouseUp.call( this, ev );

		this.updateMapData();

		this._removeCSSClass( 'pbs-map-editing' );
		this._dragging = false;
		this._clicked = false;
		clearInterval( this._forceCentered );
    };

	Map.prototype.updateMapData = function() {

		if ( ! this._dragging ) {
			var latlng = this._domElement.map.getCenter();
			var center = latlng.lat().toFixed( 6 ) + ', ' + latlng.lng().toFixed( 6 );

			if ( this.attr( 'data-center' ) !== center ) {
				this.attr( 'data-center', center );
				this.attr( 'data-lat', latlng.lat().toFixed( 6 ) );
				this.attr( 'data-lng', latlng.lng().toFixed( 6 ) );
				this.model.set( 'data-center', center );

				// Move existing markers.
				if ( this._domElement.map.marker ) {
					this._domElement.map.marker.setPosition( this._domElement.map.getCenter() );
				}
			}
		}

		var zoom = this._domElement.map.getZoom();
		if ( parseInt( this.attr( 'data-zoom' ), 10 ) !== zoom ) {
			this.attr( 'data-zoom', zoom );
			this.model.trigger( 'change', this.model );
		}

	};

    Map.prototype._onMouseDown = function( ev ) {
		this._clicked = true;
		this.focus();
		clearTimeout( this._dragTimeout );
			return this._dragTimeout = setTimeout( ( function( _this ) {
				return function() {
					_this._dragging = true;
				return _this.drag( ev.pageX, ev.pageY );
			};
		} )( this ), ContentEdit.DRAG_HOLD_DURATION * 2 );
    };

    Map.prototype._onMouseMove = function( ev ) {
		if ( ! this._dragging ) {
			clearTimeout( this._dragTimeout );
		}
		if ( ! this._dragging && this._clicked ) {
			this._addCSSClass( 'pbs-map-editing' );
		}
		Map.__super__._onMouseMove.call(this, ev );

    };


    Map.droppers = PBSEditor.allDroppers;

    Map.prototype.focus = function(supressDOMFocus) {
		var root;
		root = ContentEdit.Root.get();
		if (this.isFocused()) {
			return;
		}
		if (root.focused()) {
			root.focused().blur();
		}
		this._addCSSClass('ce-element--focused');
		root._focused = this;
		if (this.isMounted() && !supressDOMFocus) {
			this.domElement().focus();
		}
		return root.trigger('focus', this);
    };

	Map.prototype.cssTypeName = function() {
		return 'map';
	};

	Map.prototype.typeName = function() {
		return 'Map';
	};

	Map.prototype.mount = function() {
		var ret = Map.__super__.mount.call( this );

		window.initPBSMaps( this._domElement, function() {
			google.maps.event.addListener( this._domElement.map, 'zoom_changed', _.throttle( function() {
				this.updateMapData();
			}.bind( this ), 2 ) );
			google.maps.event.addListener( this._domElement.map, 'drag', _.throttle( function() {
				this.updateMapData();
			}.bind( this ), 2 ) );
		}.bind( this ) );

		return ret;
	};

	Map.prototype.unmount = function() {
		google.maps.event.clearInstanceListeners( this._domElement.map );
		return Map.__super__.unmount.call( this );
	};


	// Creates the base element of the shortcode div.
	// Does not have any contents, need to run `ajaxUpdate` after attaching to update.
	Map.create = function() {

		var o = document.createElement('DIV');
		o.setAttribute( 'data-ce-tag', 'map' );
		o.setAttribute( 'data-ce-moveable', '' );
		// o.setAttribute( 'data-url', url );

		return ContentEdit.Map.fromDOMElement( o );
	};

	return Map;

})(ContentEdit.Static);

ContentEdit.TagNames.get().register(ContentEdit.Map, 'map');


window.addEventListener( 'DOMContentLoaded', function() {
	var editor = ContentTools.EditorApp.get();
	if ( window.initPBSMaps ) {

		// When we end editing, the DOM gets rebuilt, we need to re-init the maps.
		editor.bind( 'stop', window.initPBSMaps );
	}

	var mapRefreshInterval;
	if ( window.pbsMapsReCenter ) {
		editor.bind( 'start', function() {
			mapRefreshInterval = setInterval( function() {
				if ( document.querySelector( '.ce-element--dragging' ) || document.querySelector( '.pbs-map-editing' ) ) {
					return;
				}
				window.pbsMapsReCenter();
			}, 1000 );
		} );
		editor.bind( 'stop', function() {
			clearInterval( mapRefreshInterval );
		} );
	}
} );


/* globals ContentEdit, __extends, PBSEditor, ContentSelect */

ContentEdit.Tabs = ( function( _super ) {
	__extends( Tabs, _super );

	function Tabs( tagName, attributes ) {
		Tabs.__super__.constructor.call( this, tagName, attributes );
		this.isCompundElement = true;
	}

	Tabs.prototype.cssTypeName = function() {
		return 'tabs';
	};

	Tabs.prototype.type = function() {
		return 'Tabs';
	};

	Tabs.prototype.typeName = function() {
		return 'Tabs';
	};

	Tabs.fromDOMElement = function( domElement ) {

		var c, childNode, childNodes, list, _i, _len;
		list = new this( domElement.tagName, this.getDOMElementAttributes( domElement ) );
		childNodes = (function() {
			var _i, _len, _ref, _results;
			_ref = domElement.childNodes;
			_results = [];
			for (_i = 0, _len = _ref.length; _i < _len; _i++) {
				c = _ref[_i];
				_results.push(c);
			}
			return _results;
		})();

		var tagNames = ContentEdit.TagNames.get();
		for (_i = 0, _len = childNodes.length; _i < _len; _i++) {
			childNode = childNodes[_i];
			if (childNode.nodeType !== 1) {
				continue;
			}

			var cls;
			if ( childNode.getAttribute('data-ce-tag') ) {
				cls = tagNames.match(childNode.getAttribute('data-ce-tag'));
			} else {
				cls = tagNames.match(childNode.tagName);
			}

			var element = cls.fromDOMElement(childNode);
			if (element) {
				list.attach(element);
			}
		}

		return list;
	};

	Tabs.prototype.detachTabAndContent = function( tab ) {
		var inputID = tab._domElement.getAttribute( 'for' );
		var inputElem = this._domElement.querySelector( '[id="' + inputID + '"]' )._ceElement;
		var tabID = inputElem.attr( 'data-tab' );
		var tabRow = this._domElement.querySelector( '[data-panel="' + tabID + '"]' )._ceElement;
		inputElem.parent().detach( inputElem );
		tab.parent().detach( tab );
		tabRow.parent().detach( tabRow );
		this.reIndexTabs();
		return tabRow;
	};

	Tabs.prototype.attachTabAndContent = function( tab, index, row ) {
		var tabsID = this._domElement.getAttribute( 'class' ).match( /pbs-tabs-(\w+)/ )[0];

		var tabIndex = this.numTabs() + 1;

		var hash = window.PBSEditor.generateHash();
		while ( document.querySelector( '[id="pbs-tab-' + hash + '"]') ) {
			hash = window.PBSEditor.generateHash();
		}

		var radio = document.createElement( 'input' );
		radio.classList.add( 'pbs-tab-state' );
		radio.setAttribute( 'type', 'radio' );
		radio.setAttribute( 'name', tabsID );
		radio.setAttribute( 'id', 'pbs-tab-' + hash );
		radio.setAttribute( 'data-tab', tabIndex );
		radio.setAttribute( 'data-ce-tag', 'static' );
		this.attach( ContentEdit.Static.fromDOMElement( radio ), 0 );

		tab.attr( 'for', 'pbs-tab-' + hash );
		row.attr( 'data-panel', tabIndex );

		this._domElement.querySelector( '.pbs-tab-tabs' )._ceElement.attach( tab, index );
		this._domElement.querySelector( '.pbs-tab-panels' )._ceElement.attach( row );

	};

	/**
	 * Fixes the indices of the tabs.
	 * Only works when there is only 1 tab missing.
	 */
	Tabs.prototype.reIndexTabs = function() {
		var numTabs = this._domElement.querySelectorAll( '.pbs-tab-state' ).length;
		for ( var i = 1; i <= numTabs; i++ ) {
			var radio = this._domElement.querySelector( '[data-tab="' + i + '"]' );
			if ( ! radio ) {
				radio = this._domElement.querySelector( '[data-tab="' + ( i + 1 ) + '"]' );
				if ( radio ) {
					radio._ceElement.attr( 'data-tab', i );
					this._domElement.querySelector( '[data-panel="' + ( i + 1 ) + '"]' )._ceElement.attr( 'data-panel', i );
				}
			}
		}
	};

	Tabs.prototype.getOpenTab = function() {
		var radio = this._domElement.querySelector( '.pbs-tab-state:checked' )._ceElement;
		var panel = this._domElement.querySelector( '[data-panel="' + radio.attr( 'data-tab' ) + '"]' );
		if ( ! panel ) {
			panel = this._domElement.querySelector( '[data-panel]' );
		}
		return panel._ceElement;
	};

	Tabs.prototype.numTabs = function() {
		return this._domElement.querySelectorAll( '.pbs-tab-state' ).length;
	};

	Tabs.prototype.addTab = function() {
		var firstTab = this._domElement.querySelector( '.pbs-tab-state' )._ceElement;
		var radioID = 'pbs-tab-' + window.PBSEditor.generateHash();
		var tabNum = this.numTabs() + 1;
		var radio = new ContentEdit.TabRadio( 'input', {
			'data-ce-tag': 'tabradio',
			'class': 'pbs-tab-state',
			'data-tab': tabNum,
			'id': radioID,
			'name': firstTab.attr( 'name' ),
			'type': 'radio'
		} );
		this.attach( radio, 0 );

		var tab = new ContentEdit.Tab( 'label', {
			'data-ce-tag': 'tab',
			'for': radioID
		}, '<span>New Tab</span>' );

		var tabContainer = this._domElement.querySelector( '.pbs-tab-tabs' )._ceElement;
		tabContainer.attach( tab, tabContainer.children.length );

		var panelContainer = this._domElement.querySelector( '.pbs-tab-panels' )._ceElement;
		var row = new ContentEdit.DivRow( 'div', {
			'data-panel': tabNum
		} );
		panelContainer.attach( row );

		var col = new ContentEdit.DivCol('div');
		row.attach( col );

		var p = new ContentEdit.Text('p', {}, '');
		col.attach( p );

		tab.openTab();
		p.focus();
	};

	Tabs.prototype.removeTab = function( tab ) {
		if ( typeof tab === 'undefined' ) {
			var radio = this._domElement.querySelector( '.pbs-tab-state:checked' )._ceElement;
			tab = this._domElement.querySelector( 'label[for="' + radio.attr( 'id' ) + '"]' )._ceElement;
		}
		var otherTab = tab.nextSibling();
		if ( ! otherTab ) {
			otherTab = tab.previousSibling();
		}
		this.detachTabAndContent( tab );
		if ( otherTab ) {
			otherTab.openTab();
		} else {
			this.blur();
			var focusTo = this.nextSibling();
			if ( ! focusTo ) {
				focusTo = this.previousSibling();
			}
			if ( focusTo ) {
				focusTo.focus();
			}
			this.parent().detach( this );
		}
	};

	Tabs.droppers = PBSEditor.allDroppers;

	return Tabs;

})(ContentEdit.Div);


ContentEdit.TagNames.get().register(ContentEdit.Tabs, 'tabs');



ContentEdit.Tab = ( function( _super ) {
	__extends( Tab, _super );

	function Tab( tagName, attributes, content ) {
		Tab.__super__.constructor.call( this, tagName, attributes, content );
	}

	Tab.prototype.cssTypeName = function() {
		return 'tab';
	};

	Tab.prototype.type = function() {
		return 'Tab';
	};

	Tab.prototype.typeName = function() {
		return 'Tab';
	};

	Tab.prototype.parentTab = function() {
		return this.parent().parent();
	};

	Tab.prototype.setActiveTab = function() {
		var activeTab = this.parentTab()._domElement.querySelector( '.pbs-tab-tabs .pbs-tab-active' );
		if ( activeTab ) {
			activeTab._ceElement.removeCSSClass( 'pbs-tab-active' );
		}
		this.addCSSClass( 'pbs-tab-active' );
	};

	Tab.prototype._onMouseDown = function( ev ) {
		setTimeout( function() {
			this.setActiveTab();
		}.bind( this ), 1 );
		return Tab.__super__._onMouseDown.call( this, ev );
	};

	Tab.prototype.openTab = function() {
		this.parentTab()._domElement.querySelector( '[id="' + this.attr( 'for' ) + '"]' ).checked = true;
		this.setActiveTab();
	};

	Tab._dropTab = function( element, target, placement ) {
		var insertIndex = target.parent().children.indexOf( target );
		if ( placement[1] !== 'left' ) {
			insertIndex += 1;
		}

		// Different handling if the tab is dropped into another set of tabs.
		if ( element.parent() !== target.parent() ) {

			var originalTabElement = element.parentTab();

			// Get the closest tab.
			var otherTab = element.previousSibling();
			if ( ! otherTab ) {
				otherTab = element.nextSibling();
			}

			var tabRow = element.parentTab().detachTabAndContent( element );

			target.parentTab().attachTabAndContent( element, insertIndex, tabRow );
			element.openTab();

			// Open the other tab since a tab was removed.
			if ( otherTab ) {
				otherTab.openTab();
			} else {

				// If there are no more tabs, just remove the whole thing.
				originalTabElement.parent().detach( originalTabElement );
			}

			return;
		}

		element.parent().detach( element );
		return target.parent().attach( element, insertIndex );
	};

	Tab.prototype._onMouseOver = function( ev ) {
        var root = ContentEdit.Root.get();
        if ( root.dragging() ) {
			this.openTab();
		}
		return Tab.__super__._onMouseOver.call( this, ev );
	};

	Tab.droppers = {
		'Tab': Tab._dropTab
	};

	Tab.placements = [ 'left', 'right' ];

	// If a tab is focused, check the matching radio button since they are all disabled.
	Tab.prototype.focus = function() {
		this.openTab();
		return Tab.__super__.focus.call( this );
	};

	Tab.prototype._keyReturn = function( ev ) {
		ev.preventDefault();
		var next = this.nextSibling();
		if ( next ) {
			next.focus();
		}
	};

	Tab.prototype.isLastTab = function() {
		return this.parent().children.indexOf( this ) === this.parent().children.length - 1;
	};

	//
	Tab.prototype.getMatchingPanel = function() {
		var inputID = this.attr( 'for' );
		var inputElem = this.parentTab()._domElement.querySelector( '[id="' + inputID + '"]' )._ceElement;
		var tabID = inputElem.attr( 'data-tab' );
		return this.parentTab()._domElement.querySelector( '[data-panel="' + tabID + '"]' )._ceElement;
	};

	/**
	 * Make sure the saved HTML has the first tab active.
	 */
	Tab.prototype.html = function() {
		var ret = Tab.__super__.html.call( this );
		if ( this.parent().children.indexOf( this ) === 0 ) {
			if ( ! ret.match( /pbs-tab-active/ ) ) {
				var r = new RegExp( '(<' + this._tagName + '[^>]+class=[\'"])' );
				if ( ret.match( r ) ) {
					ret = ret.replace( r, '$1pbs-tab-active ' );
				} else {
					r = new RegExp( '(<' + this._tagName + ')' );
					ret = ret.replace( r, '$1 class="pbs-tab-active"' );
				}
			}
		} else {
			ret = ret.replace( /\s*pbs-tab-active\s*/g, '' );
			ret = ret.replace( /\s*class=[\'\"][\'\"]/g, '' );
		}
		return ret;
	};

	Tab.prototype._keyLeft = function( ev ) {
		if ( this.parent().children.indexOf( this ) === 0 ) {
			var selection = ContentSelect.Range.query( this._domElement );
			if ( selection.get()[0] === 0 && selection.isCollapsed() ) {
				this._keyUp( ev );
			}
		}
		return Tab.__super__._keyLeft.call( this, ev );
	};

	Tab.prototype._keyUp = function( ev ) {
		if ( this.parent().children.indexOf( this ) === 0 ) {
			var selection = ContentSelect.Range.query( this._domElement );
			if ( selection.get()[0] === 0 && selection.isCollapsed() ) {

				var tabs = this.parent().parent();
				var index = tabs.parent().children.indexOf( tabs );
				if ( index > 0 ) {
					if ( tabs.parent().children[ index - 1 ].content ) {
						var elem = tabs.parent().children[ index - 1 ];
						elem.focus();

				        selection = new ContentSelect.Range( elem.content.length(), elem.content.length() );
				        return selection.select( elem.domElement() );
					}
				}
				var p = new ContentEdit.Text('p', {}, '');
				tabs.parent().attach( p, index );
				p.focus();
			}
		}
		return Tab.__super__._keyUp.call( this, ev );
	};

	Tab.prototype._keyDown = function( ev ) {

		if ( this.parent().children.indexOf( this ) === this.parent().children.length - 1 ) {
			var selection = ContentSelect.Range.query(this._domElement);
			if (!(this._atEnd(selection) && selection.isCollapsed())) {
				return;
			}
			if ( this._atEnd( selection ) ) {
				ev.preventDefault();
				var row = this.getMatchingPanel();
				row.children[0].children[0].focus();
				return;
			}
		}
		return Tab.__super__._keyDown.call( this, ev );
	};

	Tab.prototype._keyRight = function( ev ) {

	      var selection = ContentSelect.Range.query(this._domElement);
	      if (!(this._atEnd(selection) && selection.isCollapsed())) {
	        return;
	      }
		  if ( this.isLastTab() ) {
			  ev.preventDefault();
			  var row = this.getMatchingPanel();
			  row.children[0].children[0].focus();
			  return;
		  }
		return Tab.__super__._keyRight.call( this, ev );
	};

	return Tab;

} )( ContentEdit.Text );

ContentEdit.TagNames.get().register( ContentEdit.Tab, 'tab' );


ContentEdit.TabContainer = ( function( _super ) {
	__extends( TabContainer, _super );

	function TabContainer( tagName, attributes ) {
		TabContainer.__super__.constructor.call( this, tagName, attributes );
		// this._content = '';
	}

	TabContainer.prototype.cssTypeName = function() {
		return 'tabcontainer';
	};

	TabContainer.prototype.type = function() {
		return 'TabContainer';
	};

	TabContainer.prototype.typeName = function() {
		return 'TabContainer';
	};

	TabContainer._dropOutside = function( element, target, placement ) {
		var insertIndex;
		element.parent().detach( element );
		insertIndex = target.parent().parent().children.indexOf( target.parent() );
		if ( placement[0] === 'below' ) {
			insertIndex += 1;
		}
		return target.parent().parent().attach( element, insertIndex );
    };

	TabContainer.prototype._onOver = function( ev ) {
		var ret = TabContainer.__super__._onOver.call( this, ev );
		if ( ret ) {
			var root = ContentEdit.Root.get();
			this._removeCSSClass( 'ce-element--drop' );
			this.parent()._addCSSClass( 'ce-element--drop' );
			return root._dropTarget = this.parent();
		}
		return ret;
	};

	TabContainer.droppers = {
		'*': TabContainer._dropOutside
	};

	// TabContainer.placements = [ 'above', 'below' ];

	// Cancel the drag event on mouse up
	TabContainer.prototype._onMouseUp = function(ev) {
		TabContainer.__super__._onMouseUp.call(this, ev);
		clearTimeout(this._dragTimeout);
	};

    TabContainer.prototype._onMouseOut = function(ev) {
		TabContainer.__super__._onMouseOut.call(this, ev);
		clearTimeout(this._dragTimeout);
	};

    TabContainer.prototype._onMouseDown = function(ev) {
		TabContainer.__super__._onMouseDown.call(this, ev);

		clearTimeout(this._dragTimeout);
		if ( this.domElement() !== ev.target ) {
			return;
		}

		// This fixes dragging in Firefox.
		ev.preventDefault();

		// If we are in the drag row handle, drag the whole row
		// @see _onMouseMove
		// if ( this._domElement.classList.contains('pbs-drag-row') ) {
		// 	return this.parent().drag(ev.pageX, ev.pageY);
		// }

		if ( ! this.draggableParent ) {
			this.draggableParent = this.parent();
		}

		return this._dragTimeout = setTimeout((function(_this) {
			return function() {
				// Drag the column
				return _this.draggableParent.drag(ev.pageX, ev.pageY);
				// return _this.drag(ev.pageX, ev.pageY);
			};
		})(this), ContentEdit.DRAG_HOLD_DURATION);

	};

	TabContainer.fromDOMElement = function(domElement) {

		var c, childNode, childNodes, list, _i, _len;
		list = new this(domElement.tagName, this.getDOMElementAttributes(domElement));
		childNodes = (function() {
			var _i, _len, _ref, _results;
			_ref = domElement.childNodes;
			_results = [];
			for (_i = 0, _len = _ref.length; _i < _len; _i++) {
				c = _ref[_i];
				_results.push(c);
			}
			return _results;
		})();

		var tagNames = ContentEdit.TagNames.get();
		for (_i = 0, _len = childNodes.length; _i < _len; _i++) {
			childNode = childNodes[_i];
			if (childNode.nodeType !== 1) {
				continue;
			}

			var cls;
			if ( childNode.getAttribute('data-ce-tag') ) {
				cls = tagNames.match(childNode.getAttribute('data-ce-tag'));
			} else {
				cls = tagNames.match(childNode.tagName);
			}

			var element = cls.fromDOMElement(childNode);
			if (element) {
				list.attach(element);
			}
		}

		return list;
	};

	return TabContainer;

} )( ContentEdit.Div );
ContentEdit.TagNames.get().register( ContentEdit.TabContainer, 'tabcontainer' );


ContentEdit.TabPanelContainer = ( function( _super ) {
	__extends( TabPanelContainer, _super );

	function TabPanelContainer( tagName, attributes ) {
		TabPanelContainer.__super__.constructor.call( this, tagName, attributes );
	}

	TabPanelContainer.prototype.cssTypeName = function() {
		return 'tabpanelcontainer';
	};

	TabPanelContainer.prototype.type = function() {
		return 'TabPanelContainer';
	};

	TabPanelContainer.prototype.typeName = function() {
		return 'TabPanelContainer';
	};

	TabPanelContainer.fromDOMElement = function(domElement) {

		var c, childNode, childNodes, list, _i, _len;
		list = new this(domElement.tagName, this.getDOMElementAttributes(domElement));
		childNodes = (function() {
			var _i, _len, _ref, _results;
			_ref = domElement.childNodes;
			_results = [];
			for (_i = 0, _len = _ref.length; _i < _len; _i++) {
				c = _ref[_i];
				_results.push(c);
			}
			return _results;
		})();

		var tagNames = ContentEdit.TagNames.get();
		for (_i = 0, _len = childNodes.length; _i < _len; _i++) {
			childNode = childNodes[_i];
			if (childNode.nodeType !== 1) {
				continue;
			}

			var cls;
			if ( childNode.getAttribute('data-ce-tag') ) {
				cls = tagNames.match(childNode.getAttribute('data-ce-tag'));
			} else {
				cls = tagNames.match(childNode.tagName);
			}

			var element = cls.fromDOMElement(childNode);
			if (element) {
				list.attach(element);
			}
		}

		return list;
	};

	return TabPanelContainer;

} )( ContentEdit.Div );
ContentEdit.TagNames.get().register( ContentEdit.TabPanelContainer, 'tabpanelcontainer' );


ContentEdit.TabRadio = ( function( _super ) {
	__extends( TabRadio, _super );

	function TabRadio( tagName, attributes ) {
		TabRadio.__super__.constructor.call( this, tagName, attributes );
	}

	TabRadio.prototype.cssTypeName = function() {
		return 'tabradio';
	};

	TabRadio.prototype.type = function() {
		return 'TabRadio';
	};

	TabRadio.prototype.typeName = function() {
		return 'TabRadio';
	};

	// Disable the radio buttons since when a tab is focused it is preventing text
	// keyboard navigation, since the radio buttons get focused.
	TabRadio.prototype.mount = function() {
		var ret = TabRadio.__super__.mount.call( this );
		this._domElement.setAttribute( 'disabled', 'disabled' );
		return ret;
	};

	// Re-enable all radio buttons or else we cannot switch tabs after editing.
	TabRadio.prototype.unmount = function() {
		this._domElement.removeAttribute( 'disabled' );
		return TabRadio.__super__.unmount.call( this );
	};

	return TabRadio;

} )( ContentEdit.Static );

ContentEdit.TagNames.get().register( ContentEdit.TabRadio, 'tabradio' );


wp.hooks.addFilter( 'pbs.overlay.margin_top.can_apply', function( apply, element ) {
	if ( element && element._domElement && element._domElement.parentNode && element._domElement.parentNode.classList ) {
		var parent = element._domElement.parentNode;
		if ( parent.classList && parent.classList.contains( 'pbs-tab-tabs' ) ) {
			return false;
		}
	}
	return apply;
} );
wp.hooks.addFilter( 'pbs.overlay.margin_bottom.can_apply', function( apply, element ) {
	if ( element && element._domElement && element._domElement.parentNode && element._domElement.parentNode.classList ) {
		var parent = element._domElement.parentNode;
		if ( parent.classList && parent.classList.contains( 'pbs-tab-tabs' ) ) {
			return false;
		}
	}
	return apply;
} );


/**
 * When pressing the up key at the very start of the current panel, put the cursor on the last tab.
 */
(function() {
	var proxied = ContentEdit.Text.prototype._keyUp;
	ContentEdit.Text.prototype._keyUp = function( ev ) {
	    var selection = ContentSelect.Range.query(this._domElement);
		if ( this.parent().constructor.name === 'DivCol' && this.parent().children.indexOf(this) === 0 && selection.get()[0] === 0 ) {
			if ( this.parent().parent().parent().constructor.name === 'TabPanelContainer' ) {
				ev.preventDefault();
				var tabs = this.parent().parent().parent().parent()._domElement.querySelector( '.pbs-tab-tabs' )._ceElement;
				var tab = tabs.children[ tabs.children.length - 1 ];
				tab.focus();

		        selection = new ContentSelect.Range( tab.content.length(), tab.content.length() );
		        return selection.select( tab.domElement() );
			}
		}
		return proxied.call( this, ev );
	};
})();

/**
 * When pressing the left key at the very start of the current panel, put the cursor on the last tab.
 */
(function() {
   var proxied = ContentEdit.Text.prototype._keyLeft;
   ContentEdit.Text.prototype._keyLeft = function( ev ) {
	   var selection = ContentSelect.Range.query(this._domElement);
	   if ( this.parent().constructor.name === 'DivCol' && this.parent().children.indexOf(this) === 0 && this.parent().parent().children.indexOf( this.parent() ) === 0 && selection.get()[0] === 0 ) {
		   if ( this.parent().parent().parent().constructor.name === 'TabPanelContainer' ) {
			   ev.preventDefault();
			   var tabs = this.parent().parent().parent().parent()._domElement.querySelector( '.pbs-tab-tabs' )._ceElement;
			   var tab = tabs.children[ tabs.children.length - 1 ];
			   tab.focus();

			   selection = new ContentSelect.Range( tab.content.length(), tab.content.length() );
			   return selection.select( tab.domElement() );
		   }
	   }
	   return proxied.call( this, ev );
   };
})();

/**
 * When pressing the down key at the very end of the current panel, put the cursor on the next text element, or create a new one.
 */
(function() {
   var proxied = ContentEdit.Text.prototype._keyDown;
   ContentEdit.Text.prototype._keyDown = function( ev ) {
	   var selection = ContentSelect.Range.query(this._domElement);
	   if ( this.parent().constructor.name === 'DivCol' && this.parent().children.indexOf(this) === this.parent().children.length - 1 && this._atEnd(selection) ) {
		   if ( this.parent().parent().parent().constructor.name === 'TabPanelContainer' ) {

			   var tabs = this.parent().parent().parent().parent();
	   			var index = tabs.parent().children.indexOf( tabs );
	   			if ( index < tabs.parent().children.length - 1 ) {
	   				if ( tabs.parent().children[ index + 1 ].content ) {
						ev.preventDefault();

	   					tabs.parent().children[ index + 1 ].focus();
						selection = new ContentSelect.Range( 0, 0 );
						return selection.select( tabs.parent().children[ index + 1 ]._domElement );
	   				}
	   			}
	   			var p = new ContentEdit.Text('p', {}, '');
	   			tabs.parent().attach( p, index + 1 );
	   			p.focus();
				return;
		   }
	   }
	   return proxied.call( this, ev );
   };
})();


/**
 * When pressing the right key at the very end of the current panel, put the cursor on the next text element, or create a new one.
 */
(function() {
   var proxied = ContentEdit.Text.prototype._keyRight;
   ContentEdit.Text.prototype._keyRight = function( ev ) {
	   var selection = ContentSelect.Range.query(this._domElement);
	   if ( this.parent().constructor.name === 'DivCol' && this.parent().children.indexOf(this) === this.parent().children.length - 1 && this.parent().parent().children.indexOf( this.parent() ) === this.parent().parent().children.length - 1 && this._atEnd(selection) ) {
		   if ( this.parent().parent().parent().constructor.name === 'TabPanelContainer' ) {

			   var tabs = this.parent().parent().parent().parent();
	   			var index = tabs.parent().children.indexOf( tabs );
	   			if ( index < tabs.parent().children.length - 1 ) {
	   				if ( tabs.parent().children[ index + 1 ].content ) {
						ev.preventDefault();
	   					tabs.parent().children[ index + 1 ].focus();
	   					return;
	   				}
	   			}
	   			var p = new ContentEdit.Text('p', {}, '');
	   			tabs.parent().attach( p, index + 1 );
	   			p.focus();
	   			return;
		   }
	   }
	   return proxied.call( this, ev );
   };
})();

/**
 * When pressing up key towards a tabs element, select the last element of the current tab.
 */
(function() {
	var proxied = ContentEdit.Node.prototype.previous;
	ContentEdit.Node.prototype.previous = function() {
		var node = proxied.call( this );

		if ( node && node._domElement && window.pbsSelectorMatches( node._domElement, '.pbs-tab-panels *' ) ) {

			// If not visible.
			if ( node._domElement.offsetWidth === 0 && node._domElement.offsetHeight === 0 ) {
				var tabs = node.parent().parent();
				while ( tabs && tabs.constructor.name !== 'Tabs' ) {
					tabs = tabs.parent();
				}
				if ( tabs ) {
					node = tabs.getOpenTab();

					var allVisibles = node._domElement.querySelectorAll( '*' );
					for ( var i = allVisibles.length - 1; i >= 0; i-- ) {
						if ( allVisibles[ i ]._ceElement ) {
							return allVisibles[ i ]._ceElement;
						}
					}
				}
			}
		}

		return node;
	};
})();


/**
 * Dragging columns inside tabs, drag the whole tabs element.
 */
( function() {
	var proxied = ContentEdit.DivCol.prototype._onMouseDown;
    ContentEdit.DivCol.prototype._onMouseDown = function( ev ) {
		if ( this.parent().parent()._domElement.classList.contains( 'pbs-tab-panels' ) ) {
			this.draggableParent = this.parent().parent().parent();
		}
		return proxied.call( this, ev );
	};
} )();


( function() {
	var proxied = ContentEdit.DivRow.prototype._onOver;
	ContentEdit.DivRow.prototype._onOver = function( ev ) {
		var ret = proxied.call( this, ev );
		if ( ret && this.parent().constructor.name === 'TabPanelContainer' ) {
			var root = ContentEdit.Root.get();
			this._removeCSSClass( 'ce-element--drop' );
			this.parent().parent()._addCSSClass( 'ce-element--drop' );
			return root._dropTarget = this.parent().parent();
		}
		return ret;
	};
} )();


/* globals ContentEdit, ContentTools */

// Remove the size class when resizing images, so that WP can detect
// that we now have a custom size.
var root = ContentEdit.Root.get();
root._overrideImageOnStopResizing = root._onStopResizing;
root._onStopResizing = function(ev) {

	if ( this._resizing.constructor.name === 'Image' ) {
		var match = this._resizing._attributes['class'].match( /size-\w+/ );
		if ( match ) {
			this._resizing.removeCSSClass( match[0] );
		}

		// Set the height style to auto, so that images & icons won't get smushed in responsive mode.
		this._resizing.style( 'height', 'auto' );
	}

	return this._overrideImageOnStopResizing(ev);
}.bind(root);



// Open the edit Media Manager window on double click
ContentEdit.Image.prototype._onDblclick = function() {
	this.openMediaManager();
};

ContentEdit.Image.prototype.openMediaManager = function() {
	var frame = wp.media.editor.open( 'edit', {
		frame: 'image',
		state: 'image-details',
		metadata: _pbsImageGetMetaData( this._domElement )
	});

	frame.state('image-details').on( 'update', function( imageData ) {
		_pbsUpdateNonCaptionedImageCTElement( this, imageData );
	}.bind(this) );

	// Delete the frame's state so that opening another frame won't have the settings
	// of the previous frame.
	frame.on('close', function() {
		wp.media.editor.remove( 'edit' );
		frame.detach();
	});
};


// Remove image edit event listener.
ContentEdit.Image.prototype._removeDOMEventListeners = function() {
	this._domElement.removeEventListener('dblclick', this._onDblClickBound);
	window.removeEventListener('keydown', this._onKeyDownBound );
};


// Simpler mounting, don't add an anchor tag.
ContentEdit.Image.prototype.mount = function() {

	var i;

	// Remove responsive attributes added in by WordPress since these are
	// dynamically added on creation.
	if ( this._attributes ) {
		var responsiveAttributes = [ 'srcset', 'sizes', 'data-lazy-loaded', 'data-lazy-src', 'data-pin-nopin', 'src-orig', 'scale' ];
		for ( i = 0; i < responsiveAttributes.length; i++ ) {
			if ( this._attributes[ responsiveAttributes[ i ] ] ) {
				delete this._attributes[ responsiveAttributes[ i ]  ];
			}
		}
	}

	// Remove alignnone. We won't support alignnone since they are problematic.
	if ( this._attributes ) {
		if ( this._attributes['class'] ) {
			var classes = this._attributes['class'].split( ' ' );
			if ( classes.indexOf( 'alignnone' ) !== -1 ) {
				classes[ classes.indexOf( 'alignnone' ) ] = 'aligncenter';
				this._attributes['class'] = classes.join( ' ' );
			}
		}
	}

  	this._domElement = document.createElement('img');
    for ( i in this._attributes ) {
		if ( this._attributes.hasOwnProperty( i ) ) {
			if ( this._attributes[ i ] ) {
				this._domElement.setAttribute( i, this._attributes[ i ] );
			}
		}
	}

	// Edit image edit event listener.
	this._onDblClickBound = this._onDblclick.bind(this);
	this._domElement.addEventListener('dblclick', this._onDblClickBound);

	// Character press event listener.
	this._onKeyDownBound = this._onKeyDown.bind(this);
	window.addEventListener('keydown', this._onKeyDownBound );

	return ContentEdit.Image.__super__.mount.call(this);
};


// If typed while an image is focused, create a new paragraph.
ContentEdit.Image.prototype._onKeyDown = function(ev) {
	// If ONLY shift is pressed, don't do anything.
	if ( ev.keyCode === 16 || ev.keyCode === 91 || ev.keyCode === 93 ) {
		return;
	}
	// If ctrl is pressed, don't do anything.
	if ( ev.ctrlKey || ev.metaKey ) {
		return;
	}
	// If something else is selected, don't do anything.
	if ( ['input', 'select', 'textarea', 'button'].indexOf( ev.target.tagName.toLowerCase() ) !== -1 ) {
		return;
	}
	if ( this.isFocused() ) {

		// This fixes the bug where an empty div is added when pressing enter.
		ev.preventDefault();

		ContentTools.Tools.Paragraph.apply(this, null, function() {});
	}
};


// Simpler droppers
ContentEdit.Image._dropBoth = function(element, target, placement) {
	var insertIndex;
	element.parent().detach(element);
	insertIndex = target.parent().children.indexOf(target);
	if (placement[0] === 'below' && placement[1] === 'center') {
		insertIndex += 1;
	}
	element.removeCSSClass('alignleft');
	element.removeCSSClass('alignright');
	element.removeCSSClass('aligncenter');
	element.removeCSSClass('alignnone');
	if (['left', 'right', 'center'].indexOf( placement[1] ) !== -1 ) {
		element.addCSSClass('align' + placement[1]);
	}
	return target.parent().attach(element, insertIndex);
};


// Override the droppers to allow for 'alignleft', 'alignright', 'aligncenter',
// classes instead of just 'align-left' and 'align-right'.
ContentEdit.Image.droppers = {
	'Image': ContentEdit.Image._dropBoth,
	'PreText': ContentEdit.Image._dropBoth,
	'Static': ContentEdit.Image._dropBoth,
	'Text': ContentEdit.Image._dropBoth
};


wp.hooks.addFilter( 'pbs.shortcode.allow_raw_edit', function( allow, scBase, element ) {
	if ( scBase === 'caption' ) {
		var target = element._domElement.querySelector( 'img' );

		var frame = wp.media.editor.open( 'edit', {
			frame: 'image',
			state: 'image-details',
			metadata: _pbsImageGetMetaData( target )
		});

		frame.state('image-details').on( 'update', function( imageData ) {
			_pbsUpdateNonCaptionedImage( target, imageData );
		} );

		// Delete the frame's state so that opening another frame won't have the settings
		// of the previous frame.
		frame.on('close', function() {
			wp.media.editor.remove( 'edit' );
			frame.detach();
		});
		return false;
	}
	return allow;
} );


/************************************************************************************
 * From updateImage function js/tinymce/plugins/wpeditimage/plugins.js
 ************************************************************************************/
var _pbsToolbarImageHasTextContent = function( node ) {
	return node && !! ( node.textContent || node.innerText );
};
var _pbsToolbarImageGetParent = function ( node, className ) {
	while ( node && node.parentNode ) {
		if ( node.className && ( ' ' + node.className + ' ' ).indexOf( ' ' + className + ' ' ) !== -1 ) {
			return node;
		}

		node = node.parentNode;
	}

	return false;
};
var _pbsUpdateNonCaptionedImage = function( imageNode, imageData ) {

	var classes, node, captionNode, id, attrs, linkAttrs, width, height, align;

	// classes = tinymce.explode( imageData.extraClasses, ' ' );
	classes = imageData.extraClasses.split( ' ' );

	if ( ! classes ) {
		classes = [];
	}

	if ( ! imageData.caption ) {
		classes.push( 'align' + imageData.align );
	}

	if ( imageData.attachment_id ) {
		classes.push( 'wp-image-' + imageData.attachment_id );
		if ( imageData.size && imageData.size !== 'custom' ) {
			classes.push( 'size-' + imageData.size );
		}
	}

	width = imageData.width;
	height = imageData.height;

	if ( imageData.size === 'custom' ) {
		width = imageData.customWidth;
		height = imageData.customHeight;
	}

	attrs = {
		src: imageData.url,
		width: width || null,
		height: height || null,
		alt: imageData.alt,
		title: imageData.title || null,
		'class': classes.join( ' ' ) || null
	};

	// dom.setAttribs( imageNode, attrs );
	for ( var key in attrs ) {
		if ( attrs.hasOwnProperty( key ) ) {
			imageNode.setAttribute( key, attrs[ key ] );
		}
	}

	linkAttrs = {
		href: imageData.linkUrl,
		rel: imageData.linkRel || null,
		target: imageData.linkTargetBlank ? '_blank': null,
		'class': imageData.linkClassName || null
	};

	if ( imageNode.parentNode && imageNode.parentNode.nodeName === 'A' && ! _pbsToolbarImageHasTextContent( imageNode.parentNode ) ) {
		// Update or remove an existing link wrapped around the image
		if ( imageData.linkUrl ) {

			// Update the attributes of the link
			// dom.setAttribs( imageNode.parentNode, linkAttrs );
			for ( key in linkAttrs ) {
				if ( linkAttrs.hasOwnProperty( key ) ) {
					if ( linkAttrs[ key ] !== null ) {
						imageNode.parentNode.setAttribute( key, linkAttrs[ key ] );
					}
				}
			}
		} else {

			// Unwrap the image from the link.
			// dom.remove( imageNode.parentNode, true );
			var oldA = imageNode.parentNode;
			oldA.parentNode.insertBefore( imageNode, oldA );
			oldA.parentNode.removeChild( oldA );

		}

	} else if ( imageData.linkUrl ) { // If a link was added to a non-linked image
		// if ( linkNode = dom.getParent( imageNode, 'a' ) ) {
		var linkNode = _pbsToolbarImageGetParent( imageNode, 'a' );
		if ( linkNode ) {
			// The image is inside a link together with other nodes,
			// or is nested in another node, move it out
			// dom.insertAfter( imageNode, linkNode );
			imageNode.parentNode.insertBefore( linkNode, imageNode.nextSibling);
		}

		// Add link wrapped around the image
		// linkNode = dom.create( 'a', linkAttrs );
		linkNode = document.createElement('a');
		for ( var i in linkAttrs ) {
			if ( linkAttrs.hasOwnProperty( i ) ) {
				if ( linkAttrs[ i ] !== null ) {
					linkNode.setAttribute( i, linkAttrs[ i ] );
				}
			}
		}
		imageNode.parentNode.insertBefore( linkNode, imageNode );
		linkNode.appendChild( imageNode );
	}

	// captionNode = editor.dom.getParent( imageNode, '.mceTemp' );
	captionNode = _pbsToolbarImageGetParent( imageNode, '.mceTemp' );

	if ( imageNode.parentNode && imageNode.parentNode.nodeName === 'A' && ! _pbsToolbarImageHasTextContent( imageNode.parentNode ) ) {
		node = imageNode.parentNode;
	} else {
		node = imageNode;
	}

	// Find the main Text element
	var textElement = null;
	var currElement = node;
	while ( currElement ) {
		if ( currElement._ceElement ) {
			textElement = currElement._ceElement;
			break;
		}
		currElement = currElement.parentNode;
	}


	// Captioned image.
	var parent, index, newElem;
	if ( imageData.caption ) {

		id = imageData.attachment_id ? 'attachment_' + imageData.attachment_id : null;
		align = 'align' + ( imageData.align || 'none' );

		// Default data
		var scData = {
			tag: 'caption',
			type: 'closed',
			content: node.outerHTML + ' ' + imageData.caption,
			attrs: {
				id: id,
				align: align,
				width: width
			}
		};

		// Generate the shortcode
		var shortcode = new wp.shortcode( scData ).string();
		parent = textElement.parent();
		index = parent.children.indexOf( textElement );

		shortcode = wp.shortcode.next( 'caption', shortcode, 0 );
		newElem = ContentEdit.Shortcode.createShortcode( shortcode );
		parent.attach( newElem, index );
		parent.detach( textElement );

		newElem.ajaxUpdate( true );
		newElem.focus();

		textElement = newElem;

	} else {

		// Normal image.
		parent = textElement.parent();
		index = parent.children.indexOf( textElement );
		newElem = ContentEdit.Image.fromDOMElement( node );
		parent.attach( newElem, index );
		parent.detach( textElement );
		newElem.focus();
	}
};
var _pbsToolbarImageGetParent = function ( node, className ) {
	while ( node && node.parentNode ) {
		if ( node.className && ( ' ' + node.className + ' ' ).indexOf( ' ' + className + ' ' ) !== -1 ) {
			return node;
		}

		node = node.parentNode;
	}

	return false;
};


var _pbsUpdateNonCaptionedImageCTElement = function( imageNode, imageData ) {

	var classes, id, attrs, linkAttrs, width, height, align;

	// classes = tinymce.explode( imageData.extraClasses, ' ' );
	classes = imageData.extraClasses.split( ' ' );

	if ( ! classes ) {
		classes = [];
	}

	if ( ! imageData.caption ) {
		classes.push( 'align' + imageData.align );
	}

	if ( imageData.attachment_id ) {
		classes.push( 'wp-image-' + imageData.attachment_id );
		if ( imageData.size && imageData.size !== 'custom' ) {
			classes.push( 'size-' + imageData.size );
		}
	}

	width = imageData.width;
	height = imageData.height;

	if ( imageData.size === 'custom' ) {
		width = imageData.customWidth;
		height = imageData.customHeight;
	}

	attrs = {
		src: imageData.url,
		width: width || null,
		height: height || null,
		alt: imageData.alt,
		title: imageData.title || null,
		'class': classes.join( ' ' ) || null
	};

	// The aspect ratio might have changed.
	imageNode._aspectRatio = height / width;
	imageNode.size([width, height]);

	// Add the classes
	imageNode.removeCSSClass('alignleft');
	imageNode.removeCSSClass('alignright');
	imageNode.removeCSSClass('aligncenter');
	imageNode.removeCSSClass('alignnone');
	for ( var i = 0; i < classes.length; i++ ) {
		if ( classes[ i ] ) {
			imageNode.addCSSClass( classes[ i ] );
		}
	}

	// Add the other attributes
	for ( var key in attrs ) {
		if ( ! attrs.hasOwnProperty( key ) ) {
			continue;
		}
		if ( key === 'class' ) {
			continue;
		}
		if ( attrs[ key ] !== null ) {
			imageNode.attr( key, attrs[ key ] );
		} else {
			imageNode.removeAttr( key );
		}
	}

	linkAttrs = {
		href: imageData.linkUrl,
		rel: imageData.linkRel || null,
		target: imageData.linkTargetBlank ? '_blank': null,
		'class': imageData.linkClassName || null
	};

	if ( imageNode.a ) {
		if ( imageData.linkUrl ) {
			// Update the attributes of the link
			// dom.setAttribs( imageNode.parentNode, linkAttrs );
			for ( key in linkAttrs ) {
				if ( linkAttrs.hasOwnProperty( key ) ) {
					if ( linkAttrs[ key ] !== null ) {
						imageNode.a[ key ] = linkAttrs[ key ];
					} else {
						delete imageNode.a[ key ];
					}
				}
			}
		} else {
			imageNode.a = null;
		}
	} else if ( imageData.linkUrl ) {
		imageNode.a = {};
		for ( key in linkAttrs ) {
			if ( linkAttrs.hasOwnProperty( key ) ) {
				if ( linkAttrs[ key ] !== null ) {
					imageNode.a[ key ] = linkAttrs[ key ];
				}
			}
		}
	}


	// We always come from a non-captioned image, transform into a caption shortcode and
	// never from a captioned image (that's another function)
	if ( imageData.caption ) {

		id = imageData.attachment_id ? 'attachment_' + imageData.attachment_id : null;
		align = 'align' + ( imageData.align || 'none' );

		// Default data
		var scData = {
			tag: 'caption',
			type: 'closed',
			content: imageNode.html() + ' ' + imageData.caption,
			attrs: {
				id: id,
				align: align,
				width: width
			}
		};

		// Generate the shortcode
		var shortcode = new wp.shortcode( scData );//.string();

		var newElem = ContentEdit.Shortcode.createShortcode( wp.shortcode.next( 'caption', shortcode.string(), 0 ) );
		var index = imageNode.parent().children.indexOf( imageNode );
		imageNode.parent().attach( newElem, index );
		imageNode.parent().detach( imageNode );
		newElem.ajaxUpdate( true );
		return;

	}

};


// From js/tinymce/plugins/wpeditimage/plugin.js
var _pbsImageGetMetaData = function( img ) {

	// Modified from extractImageData() in plugin.js
	var attachmentID = img.getAttribute('class').match(/wp-image-(\d+)/);
	var align = img.getAttribute('class').match(/align(\w+)/);
	var size = img.getAttribute('class').match(/size-(\w+)/);
	var i;

	var tmpClasses = img.getAttribute('class').split(' ');
	var extraClasses = [];

	var classRegex = /wp-image-\d+|align\w+|size-\w+|ce-element[-\w]*/;

	// Extract classes on Image Elements
	if ( img._ceElement ) {
		if ( img._ceElement.a && img._ceElement.a['class'] ) {
			var aClasses = img._ceElement.a['class'].split(' ');
			for ( i = 0; i < aClasses.length; i++ ) {
				if ( ! aClasses[ i ].match(classRegex) ) {
					extraClasses.push( aClasses[ i ] );
				}
			}
		}
	}

	for ( i = 0; i < tmpClasses.length; i++ ) {
		if ( ! tmpClasses[ i ].match(classRegex) ) {
			extraClasses.push( tmpClasses[ i ] );
		}
	}

	var metadata = {
		attachment_id: attachmentID ? attachmentID[1] : false,
		size: size ? size[1] : 'custom',
		caption: '',
		align: align ? align[1] : 'none',
		extraClasses: extraClasses.join(' '),
		link: false,
		linkUrl: '',
		linkClassName: '',
		linkTargetBlank: false,
		linkRel: '',
		title: ''
	};
	metadata.url = img.getAttribute('src');
	metadata.alt = img.getAttribute('alt');
	metadata.title = img.getAttribute('title');

	var width = img.getAttribute('width');
	var height = img.getAttribute('height');

	metadata.customWidth = metadata.width = width;
	metadata.customHeight = metadata.height = height;


	// Extract caption
	var captionClassName = [];
	var captionBlock = img.parentNode;
	while ( captionBlock !== null && typeof captionBlock.classList !== 'undefined' ) {

		if ( captionBlock.classList.contains( 'wp-caption' ) ) {
			break;
		}
		captionBlock = captionBlock.parentNode;
	}

	if ( captionBlock && captionBlock.classList ) {
		var classes = captionBlock.classList;

		for ( i = 0; i < classes.length; i++ ) {
			var c = classes.item( i );
			if ( /^align/.test( c ) ) {
				metadata.align = c.replace( 'align', '' );
			} else if ( c && c !== 'wp-caption' ) {
				captionClassName.push( c );
			}
		}

		metadata.captionClassName = captionClassName.join( ' ' );

		var caption = captionBlock.querySelector('.wp-caption-text');
		if ( caption ) {
			metadata.caption = caption.innerHTML.replace( /<br[^>]*>/g, '$&\n' ).replace( /^<p>/, '' ).replace( /<\/p>$/, '' );
		}
	}

	// Extract linkTo
	if ( img.parentNode && img.parentNode.nodeName === 'A' ) {
		var link = img.parentNode;
		metadata.linkUrl = link.getAttribute( 'href' );
		metadata.linkTargetBlank = link.getAttribute( 'target' ) === '_blank' ? true : false;
		metadata.linkRel = link.getAttribute( 'rel' );
		metadata.linkClassName = link.className;
	}
	// Extract linkTo for Image Elements
	if ( img._ceElement ) {
		if ( img._ceElement.a ) {
			metadata.linkUrl = img._ceElement.a.href;
			metadata.linkTargetBlank = img._ceElement.a.target === '_blank' ? true : false;
			metadata.linkRel = img._ceElement.a.rel;
			metadata.linkClassName = img._ceElement.a['class'];
		}
	}

	return metadata;
};



// Upon load, unwrap all images from their paragraph tags so that they can all be rendered as Image Elements.
/**
Scenarios:
<p><img>blahblah</p> --> <img><p>blahblah</p>
<p>start<img>end</p> --> <p>start</p><img><p>end</p>
*/
window.addEventListener( 'DOMContentLoaded', function() {
	if ( ! document.querySelector('[data-name="main-content"]') ) {
		return;
	}

	var editableArea = document.querySelector('[data-name="main-content"]');
	var selector = 'a:not([data-ce-tag]) > img.alignright, a:not([data-ce-tag]) > img.alignleft, a:not([data-ce-tag]) > img.aligncenter, a:not([data-ce-tag]) > img.alignnone, p > img.alignright, p > img.alignleft, p > img.aligncenter, p > img.alignnone';

	while ( editableArea.querySelector( selector ) ) {
		var el = editableArea.querySelector( selector );
		var mainImageNode = el;
		if ( el.parentNode.tagName === 'A' ) {
			mainImageNode = el.parentNode;
			mainImageNode.setAttribute('data-ce-tag', 'img');
		}

		if ( mainImageNode.parentNode.tagName === 'P' ) {
			var p = mainImageNode.parentNode;
			var startingIndex = p.innerHTML.indexOf( mainImageNode.outerHTML );
			var endingIndex = startingIndex + mainImageNode.outerHTML.length;
			var tip = p.innerHTML.substr(0, startingIndex).trim();
			var tail = p.innerHTML.substr(endingIndex).trim();

			var newContent = '';
			var clonedPNode;
			if ( tip !== '' ) {
				clonedPNode = p.cloneNode();
				clonedPNode.innerHTML = tip;
				newContent += clonedPNode.outerHTML;
			}
			newContent += mainImageNode.outerHTML;
			if ( tail !== '' ) {
				clonedPNode = p.cloneNode();
				clonedPNode.innerHTML = tail;
				newContent += clonedPNode.outerHTML;
			}
			p.outerHTML = newContent;
		}
	}

	// WordPress adds br tags after images in certain scenario, remove them
	// since we do not need them.
	while ( editableArea.querySelector('img ~ br, [data-ce-tag="img"] ~ br') ) {
		editableArea.querySelector('img ~ br, [data-ce-tag="img"] ~ br').remove();
	}
});


/*******************************************************************************
 * Clean image tags on saving.
 *******************************************************************************/
wp.hooks.addFilter( 'pbs.save', function( html ) {

	// Remove the data-ce-tag="img" left by CT.
	html = html.replace( /\sdata-ce-tag=["']img["']/g, '' );

	// Remove the empty class left by CT.
	html = html.replace( /(<a[^>]*)\sclass((\s|>)[^>]*>)/g, '$1$2' );

	// Put back images inside paragraph tags.
	html = html.replace( /((<a[^>]+>\s*)?<img[^>]*>(\s*<\/a>)?)\s*(<p[^\w>]*>)/g, '$4$1' );

	// Wrap images which aren't inside paragraph tags inside paragraph tags.
	html = html.replace( /(<[^pa][^>]*>\s*)(<img[^>]*>)/g, '$1<p>$2</p>' );
	html = html.replace( /(<[^p][^>]*>\s*)(<a[^>]+>\s*<img[^>]*>\s*<\/a>)/g, '$1<p>$2</p>' );

	// Remove br tags after images since WP sometimes adds them.
	html = html.replace( /((<a[^>]+>\s*)?<img[^>]*>(\s*<\/a>)?)\s*(<br[^>]*>)*/g, '$1' );

	return html;
} );

/**
 * Widgets are actually just shortcodes.
 */

/* globals pbsParams */

 // wp.hooks.addFilter( 'pbs.shortcode.allow_raw_edit', function( allow, scBase ) {
 //  if ( scBase === 'pbs_widget' ) {
 // 	 return false;
 //  }
 //  return allow;
 // } );

// wp.hooks.addFilter( 'pbs.toolbar.tools.allow', function( allow, target ) {
// 	if ( target.getAttribute('data-base') === 'pbs_widget' ) {
// 		return false;
// 	}
// 	return allow;
// } );

wp.hooks.addFilter( 'pbs.toolbar.shortcode.label', function( scBase ) {
	if ( scBase === 'pbs_widget' ) {
		return pbsParams.labels.widget;
	}
	return scBase;
} );


/**
 * Widgets which are (previously) used in the content, but have been disabled in the site will still
 * show up in the content. Their templates would not be available anymore, this would cause
 * errors, so override the section creation and disable it.
 *
 * Instead of displaying the widget settings in the inspector, it now reverts to just a normal shortcode.
 */
wp.hooks.addFilter( 'pbs.inspector.do_add_section_options', function( doContinue, optionName, model, divGroup, element, toolboxUI ) {
	if ( optionName === 'widgetSettings' && model && model.attributes && model.attributes.widget ) {

		// doContinue = true only if the widget template is there.
		doContinue = !! document.querySelector( '#tmpl-pbs-widget-' + model.attributes.widget );
		if ( ! doContinue ) {
			toolboxUI.addGenericShortcodeOptions( divGroup, element );
		}
	}
	return doContinue;
} );

/**
 * A collection of functions that extend the capabilities of HTMLString to
 * manipulate CSS styles.
 *
 * This is used by various formatting tools.
 */


/* globals HTMLString */

/**
 * Removes all inline styles from all the content.
 */
HTMLString.String.prototype.removeStyles = function() {
	var c, from, i, newString, to, _i, newStyles, tagName;
	from = arguments[0], to = arguments[1], tagName = arguments[2], newStyles = arguments[3];

	if ( to < 0 ) {
		to = this.length() + to + 1;
	}
	if ( from < 0 ) {
		from = this.length() + from;
	}

	newString = this.copy();
	for (i = _i = from; from <= to ? _i < to : _i > to; i = from <= to ? ++_i : --_i) {
		c = newString.characters[i];

		// Make sure we have a span tag for styling.
		if ( c._tags.length ) {

			// Remove all tags except for anchor tags.
			for ( var z = c._tags.length - 1; z >= 0; z-- ) {
				if ( c.tags()[ z ].name() !== 'a' ) {
					newString.characters[i].removeTags( c.tags()[ z ] );
				}
			}

		}
	}

	newString.optimize();

	return newString;
};


/**
 * Checks whether a specific style is present anywhere in the content.
 * If the style name is not given, the function checks if there is any style defined.
 */
HTMLString.String.prototype.hasStyle = function() {
	var c, from, i, to, _i, styleName = null;
	from = arguments[0], to = arguments[1];
	if ( arguments.length >= 3 ) {
		styleName = arguments[2];
	}

	if ( to < 0 ) {
		to = this.length() + to + 1;
	}
	if ( from < 0 ) {
		from = this.length() + from;
	}

	// newString = this.copy();
	for (i = _i = from; from <= to ? _i < to : _i > to; i = from <= to ? ++_i : --_i) {
		c = this.characters[i];

		// Make sure we have a span tag for styling.
		if ( ! c ) {
			continue;
		}
		if ( ! c._tags.length ) {
			continue;
		}

		if ( ! styleName ) {
			if ( ['b', 'strong', 'i', 'em'].indexOf( c.tags()[0].name() ) !== -1 ) {
				return true;
			}
			if ( c.tags()[0].attr('style') ) {
				return true;
			}
		} else {
			var currentStyles = window.cssToStyleObject( c.tags()[0].attr('style') );
			if ( typeof currentStyles[ styleName ] !== 'undefined' ) {
				return currentStyles[ styleName ];
			}
		}
	}

	return false;
};



/**
 * Applies a style to the content.
 */
HTMLString.String.prototype.style = function() {
	var c, from, i, newString, tags, to, _i, newStyles, tagName;
	from = arguments[0], to = arguments[1], tagName = arguments[2], newStyles = arguments[3];
	tags = new HTMLString.Tag('span');

	if ( to < 0 ) {
		to = this.length() + to + 1;
	}
	if ( from < 0 ) {
		from = this.length() + from;
	}

	// Create a dummy element where we can test styles.
	var dummy = document.createElement( tagName );
	dummy.style.display = 'none';
	document.body.appendChild( dummy );

	newString = this.copy();
	for (i = _i = from; from <= to ? _i < to : _i > to; i = from <= to ? ++_i : --_i) {
		c = newString.characters[i];

		// Make sure we have a span tag for styling.
		if ( ! c._tags.length ) {
			c.addTags( tags );
		}

		// Don't apply styles to BR tags.
		var isBr = false;
		for ( var z = 0; z < c._tags.length; z++ ) {
			if ( c._tags[ z ].name() === 'br' ) {
				isBr = true;
				break;
			}
		}
		if ( isBr ) {
			continue;
		}

		// Add the new styles to the existing styles.
		var currentStyles = window.cssToStyleObject( c.tags()[0].attr('style') );
		for ( var styleName in newStyles ) {
			if ( newStyles.hasOwnProperty( styleName ) && newStyles[ styleName ] ) {

				if ( typeof newStyles[ styleName ] === 'string' ) {
					newStyles[ styleName ] = [ '', newStyles[ styleName ] ];
				} else if ( newStyles[ styleName ][0] !== '' ) {
					newStyles[ styleName ].unshift( '' );
				}
				var expectedStyleValue = newStyles[ styleName ][ newStyles[ styleName ].length - 1 ];

				// Go through styles we want to apply.
				var applyStyle;
				for ( var k = 0; k < newStyles[ styleName ].length; k++ ) {
					applyStyle = newStyles[ styleName ][ k ];

					// Try it out if it works.
					var dummyStyleAttribute = '';
					if ( applyStyle ) {
						dummyStyleAttribute = 'style="' + styleName + ': ' + applyStyle + '"';
					}
					dummy.innerHTML = '<span ' + dummyStyleAttribute + '>' + c.c() + '</span>';
					var appliedStyles = window.getComputedStyle( dummy.firstChild );

					if ( appliedStyles[ styleName ] === expectedStyleValue ) {
						break;
					}
				}

				currentStyles[ styleName ] = applyStyle;

			} else {

				// Remove the style.
				delete currentStyles[ styleName ];
			}

			// If the style is blank, just don't include it.
			if ( currentStyles[ styleName ] === '' ) {
				delete currentStyles[ styleName ];
			}

		}

		// Apply the styles.
		newString.characters[i]._tags[0].attr('style', window.cssToStyleString( currentStyles ) );

		// Remove the span if it doesn't have any styles.
		if ( newString.characters[i]._tags[0].name() === 'span' ) {
			if ( newString.characters[i]._tags[0].attr('style').trim() === '' ) {
				newString.characters[i].removeTags();
			}
		}
	}

	// Remove the style tester.
	document.body.removeChild( dummy );

	newString.optimize();

	return newString;
};


/**
 * Gets the style of the content. This only returns the first encountered
 * style.
 */
HTMLString.String.prototype.getStyle = function( styleName, element ) {
	var dashedStyleName = styleName;
	styleName = styleName.replace(/-([a-z])/g, function (m, w) {
	    return w.toUpperCase();
	});

	// We check this node's styles.
	var nodeToCheck = element._domElement;

	// If the highlighted text is a node, find it in the element
	var nodeHTML = this.html();
	var foundNode = false;
	if ( nodeHTML.indexOf( '<' ) === 0 ) {
		for ( var i = 0; i < element._domElement.children.length; i++ ) {
			if ( element._domElement.children[ i ].outerHTML === nodeHTML ) {
				nodeToCheck = element._domElement.children[ i ];
				foundNode = true;
				break;
			}
		}
	}

	// If the node cannot be found, this means multiple nodes are selected,
	// use the first node's styles
	if ( ! foundNode && nodeHTML.indexOf( '<' ) === 0 ) {
		var styleRegex = new RegExp( '(<\\w+[^>]+style=[^>]*[^-]' + dashedStyleName + ':\\s*)([\\w.]+)' );
		var match = nodeHTML.match( styleRegex );
		if ( match ) {
			return match[2];
		}
	}

	return getComputedStyle( nodeToCheck )[ styleName ];
};


/**
 * Fixed: Edge bug where PBS did not start at all and was stuck in "Please Wait".
 * HACK: IE Edge sometimes sends an array containing an empty array to this method.
 *
 * @see https://github.com/GetmeUK/ContentTools/issues/258
 */
HTMLString.Character.prototype.addTags = function() {
	var tag, tags, _i, _len, _results;
	tags = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
	_results = [];
	for (_i = 0, _len = tags.length; _i < _len; _i++) {
		tag = tags[_i];

        // HACK: IE Edge sometimes sends an array containing an empty array to this method.
        if ( Array.isArray( tag ) ) {
			continue;
        }

		if (tag.selfClosing()) {
			if (!this.isTag()) {
				this._tags.unshift(tag.copy());
			}
			continue;
		}

		_results.push(this._tags.push(tag.copy()));
	}
	return _results;
};

/* globals PBSEditor, pbsParams */

/**
 * Usage:

	PBSEditor.openMediaManager( function( attachment ) {
		element.style( 'background-image', 'url(' + attachment.attributes.url + ')' );
		element.attr( 'data-bg-image-id', attachment.id );
	}, imageID );
 */

window.addEventListener( 'DOMContentLoaded', function() {
	wp.media.frames.pbsSelectImage = wp.media({
		title: pbsParams.labels.select_image,
		multiple: false,
		library: {
			type: 'image'
		},
		button: {
			text: pbsParams.labels.use_selected_image
		}
	});

	PBSEditor.openMediaManager = function( callback, selectedImageID ) {
		wp.media.frames.pbsSelectImage.callback = function( ) {

			// Remove event listeners.
			wp.media.frames.pbsSelectImage.off('close', wp.media.frames.pbsSelectImage.callback);
			wp.media.frames.pbsSelectImage.off('select', wp.media.frames.pbsSelectImage.callback);

			// Get selected image.
		    var selection = wp.media.frames.pbsSelectImage.state().get( 'selection' );

		    // Nothing selected, do nothing.
		    if ( ! selection ) {
		        return;
		    }

			// iterate through selected elements
			var ret = null;
	        selection.each(function(attachment) {
				ret = attachment;
	        });
			if ( ret ) {
				callback( ret );
			}
		};

		// Add new event handlers;
		wp.media.frames.pbsSelectImage.on('close', wp.media.frames.pbsSelectImage.callback);
		wp.media.frames.pbsSelectImage.on('select', wp.media.frames.pbsSelectImage.callback);

		wp.media.frames.pbsSelectImage._onOpen = function() {
			wp.media.frames.pbsSelectImage.off('open', wp.media.frames.pbsSelectImage._onOpen);

			var selection = wp.media.frames.pbsSelectImage.state().get( 'selection' );
			if ( ! selection ) {
				return;
			}

			while ( selection.length ) {
				selection.remove( selection.first() );
			}

			if ( selectedImageID ) {
				var attachment = wp.media.attachment( selectedImageID );

				if ( attachment ) {
					selection.add( attachment );
				}
			}
		};
		wp.media.frames.pbsSelectImage.on('open', wp.media.frames.pbsSelectImage._onOpen);

		wp.media.frames.pbsSelectImage.open();
	};

});

/* globals pbsParams */

/**
 * Loads widget templates in the DOM, we need to do this using Ajax since
 * Doing it via PHP enqueues scripts that may cause errors.
 */
window.addEventListener( 'DOMContentLoaded', function() {

	// Only do this if the editor is present.
	if ( ! document.querySelector( '[data-name="main-content"]' ) ) {
		return;
	}


	/**
	 * Appends all the widget templates into the page.
	 */
	var appendWidgetTemplates = function( ajaxResponse ) {

		// Store it so we won't have to do this next time.
		localStorage.setItem( 'pbs_get_widget_templates_hash', pbsParams.widget_list_hash );
		localStorage.setItem( 'pbs_get_widget_templates', ajaxResponse );

		// Append the templates into the body.
		var dummy = document.createElement( 'DIV' );
		dummy.innerHTML = ajaxResponse;

		while ( dummy.firstChild ) {
			document.body.appendChild( dummy.firstChild );
		}
	};


	/**
	 * Check if we have a stored set of widget templates from a previous page load,
	 * use those to make things faster.
	 */
	var storedWidgetHash = localStorage.getItem( 'pbs_get_widget_templates_hash' );
	var storedWidgets = localStorage.getItem( 'pbs_get_widget_templates' );

	if ( storedWidgetHash === pbsParams.widget_list_hash && storedWidgets ) {
		appendWidgetTemplates( storedWidgets );
		return;
	}


	/**
	 * Perform an ajax call to get all the widget templates.
	 */
	var payload = new FormData();
	payload.append( 'action', 'pbs_get_widget_templates' );
	payload.append( 'nonce', pbsParams.widget_nonce );

	var xhr = new XMLHttpRequest();

	xhr.onload = function() {
		if (xhr.status >= 200 && xhr.status < 400) {
			appendWidgetTemplates( xhr.responseText );
		}
	};

	xhr.open('POST', pbsParams.ajax_url );
	xhr.send( payload );

});

/* globals ContentEdit, ContentTools, PBSOption, pbsParams */


/***********************************************************************************************
 * Override the Toolbox to allow it to be docked on the left or right side of the screen.
 ***********************************************************************************************/

window.addEventListener( 'DOMContentLoaded', function() {
	if ( ! document.querySelector( '[data-name="main-content"]' ) ) {
		return;
	}

	var editor = ContentTools.EditorApp.get();

	// Remove added docking classes
	editor.bind('stop', function() {
		document.querySelector('html').classList.remove('pbs-inspector-docked-right');
		document.querySelector('html').classList.remove('pbs-inspector-docked-left');
	});

	// When first time opening the dock in the browser, make sure it's docked on the left.
	if ( window.localStorage.getItem( 'ct-toolbox-position' ) === null ) {
		window.localStorage.setItem( 'ct-toolbox-position', '0,32' );
	}

	// Allow left & right screen docking
	var toolbox = ContentTools.EditorApp.get()._toolbox;
	toolbox.__contain = toolbox._contain;
	toolbox._contain = function() {

		// Get the admin bar height.
		var adminBarTop = 32;
		if ( document.querySelector('#wpadminbar') ) {
			adminBarTop = parseInt( document.querySelector('#wpadminbar').clientHeight, 10 );
		}

		this._domElement.style.top = adminBarTop + 'px';

		if ( isNaN( parseInt( this._domElement.style.left, 10 ) ) ) {
			this._domElement.style.left = '0px';
		}

		var ret = toolbox.__contain();
		if ( window.innerWidth - this._domElement.offsetWidth <= parseInt( this._domElement.style.left, 10 ) + 5 ) {
			this._domElement.style.left = ( window.innerWidth - this._domElement.offsetWidth ) + 'px';
			document.querySelector('html').classList.add('pbs-inspector-docked-right');
			document.querySelector('html').classList.remove('pbs-inspector-docked-left');
		} else if ( 5 >= parseInt( this._domElement.style.left, 10 ) ) {
			this._domElement.style.left = '0px';
			document.querySelector('html').classList.add('pbs-inspector-docked-left');
			document.querySelector('html').classList.remove('pbs-inspector-docked-right');
		} else {
			document.querySelector('html').classList.remove('pbs-inspector-docked-right');
			document.querySelector('html').classList.remove('pbs-inspector-docked-left');
		}

		return ret;
	};


	/*******************************************************************************************
	 * When scrolling inside the inspector, prevent the page from scrolling.
	 *******************************************************************************************/
	var stopBodyScroll = function(ev) {
		var $ = jQuery;
	    var $this = $(this),
	        scrollTop = this.scrollTop,
	        scrollHeight = this.scrollHeight,
	        height = $this.height(),
	        delta = (ev.type === 'DOMMouseScroll' ?
	            ev.originalEvent.detail * -40 :
	            ev.originalEvent.wheelDelta),
	        up = delta > 0;

	    var prevent = function() {
	        ev.stopPropagation();
	        ev.preventDefault();
	        ev.returnValue = false;
	        return false;
	    };

	    if (!up && -delta > scrollHeight - height - scrollTop) {
	        // Scrolling down, but this will take us past the bottom.
	        $this.scrollTop(scrollHeight);
	        return prevent();
	    } else if (up && delta > scrollTop) {
	        // Scrolling up, but this will take us past the top.
	        $this.scrollTop(0);
	        return prevent();
	    }
	};
	editor.bind('start', function() {
		// Won't work if this isn't jQuery...
		jQuery('.ct-toolbox').on('DOMMouseScroll mousewheel', stopBodyScroll);
	});
	editor.bind('stop', function() {
		jQuery('.ct-toolbox').off('DOMMouseScroll mousewheel', stopBodyScroll);
	});
});




/***********************************************************************************************
 * Override the Toolbox to allow it to be docked on the left or right side of the screen.
 ***********************************************************************************************/

window.updateInspector = function( clickedElement ) {
	clearTimeout( window._updateInspectorTimeout );
	window._updateInspectorTimeout = setTimeout( function() {
		var domElement = document.getSelection().anchorNode;
		var editor = ContentTools.EditorApp.get();

		if ( clickedElement ) {
			domElement = clickedElement;
		}

		window._inspectorOrigScrollTop = document.querySelector('.ct-toolbox').scrollTop;
		editor._toolbox.addSection( domElement );
		document.querySelector('.ct-toolbox').scrollTop = window._inspectorOrigScrollTop;
	}, 10 );
};

window.addEventListener( 'DOMContentLoaded', function() {

	/**
	 * When the cursor has moved, update the inspector.
	 * This is different from the focus event below.
	 */
	document.addEventListener( 'mouseup', function(ev) {
		if ( ! window.PBSEditor.isEditing() ) {
			return;
		}

		// Only entertain clicks on the editor area.
		if ( window.pbsSelectorMatches( ev.target, '[data-name="main-content"] *' ) ) {
			window.updateInspector( ev.target );
		}
	});
	document.addEventListener( 'keyup', function(ev) {
		if ( ! window.PBSEditor.isEditing() ) {
			return;
		}
		// Only entertain keyups on the editor area.
		if ( ! window.pbsSelectorMatches( ev.target, '[data-name="main-content"] *' ) ) {
			return;
		}
		if ( [ 40, 37, 39, 38, 9, 8, 46, 13 ].indexOf( ev.keyCode ) !== -1 ) {
			window.updateInspector();
		}
	});

	// When something's focused, trigger the inspector to update
	ContentEdit.Root.get().bind('focus', function ( element ) {
		// var editor = ContentTools.EditorApp.get();

		if ( ! element.isFocused() ) {
			if ( element.focus ) {
				element.focus();
			}
		}

		var root = ContentEdit.Root.get();
		if ( ! root.focused() ) {
			return;
		}
		var domElement = null;
		if ( root.focused()._domElement )  {
			domElement = root.focused()._domElement;
		}
		window.updateInspector( domElement );
	});

	// When something's focused, trigger the inspector to update
	ContentEdit.Root.get().bind('drop', function ( element ) {
		// var editor = ContentTools.EditorApp.get();

		if ( ! element.isFocused() ) {
			if ( element.focus ) {
				element.focus();
			}
		}

		// setTimeout( function() {
		var root = ContentEdit.Root.get();
		if ( ! root.focused() ) {
			return;
		}
		var domElement = null;
		if ( root.focused()._domElement )  {
			domElement = root.focused()._domElement;
		}
		window.updateInspector( domElement );

	});

	// When something's blurred, clear the inspector
	ContentEdit.Root.get().bind('blur', function () {

		setTimeout( function() {
			// Remember the scroll position.
			window._inspectorOrigScrollTop = document.querySelector('.ct-toolbox').scrollTop;

			// var editor = ContentTools.EditorApp.get();
			// editor._toolbox.clearSections();
		}, 1 );

	});

});



ContentTools.ToolboxUI.prototype._pbsAddDesignMount = ContentTools.ToolboxUI.prototype.mount;
ContentTools.ToolboxUI.prototype.mount = function() {
	var ret = this._pbsAddDesignMount();

	for ( var i = 0; i < window.PBSEditor.toolHeadings.length; i++ ) {
		var toolHeader = window.PBSEditor.toolHeadings[ i ];
		var label = toolHeader.label;
		var cls = 'pbs-' + toolHeader['class'];

		if ( ! document.querySelectorAll('.ct-toolbox .ct-tool-group')[ i ] ) {
			continue;
		}

		var group = document.querySelectorAll('.ct-toolbox .ct-tool-group')[ i ];
		group.classList.add( cls + '-group' );

		var heading = document.createElement('div');
		heading.innerHTML = label;
		heading.classList.add( 'pbs-group-title' );
		heading.classList.add( 'pbs-collapsable-title' );
		heading.classList.add( cls + '-title' );
		group.insertBefore( heading, group.firstChild );
		wp.hooks.doAction( 'inspector.group_title.create', group );

		if ( toolHeader.tip ) {
			heading.appendChild( window.PBSEditor.createGroupTip( toolHeader.tip ) );
		}
	}

	return ret;
};

window.PBSEditor.createGroupTip = function( text ) {
	var tip = document.createElement( 'span' );
	tip.classList.add( 'pbs-group-tip' );
	tip.innerHTML = '?';
	var tipText = document.createElement( 'span' );
	tipText.classList.add( 'pbs-group-tip-details' );
	tipText.innerHTML = text;
	tip.appendChild( tipText );
	return tip;
};




var _pbsCreatedViews = [];
ContentTools.ToolboxUI.prototype.addSectionOptions = function( divGroup, option, element, model ) {
	if ( typeof model === 'undefined' ) {
		model = element.model;
	}

	for ( var optionName in PBSOption ) {
		if ( PBSOption.hasOwnProperty( optionName ) && option.type.toLowerCase() === optionName.toLowerCase() ) {

			var id = optionName.replace( /([a-z])([A-Z])/g, '$1-$2' ).toLowerCase();
			if ( element.constructor.name ) {
				id = element.constructor.name.replace( /([a-z])([A-Z])/g, '$1-$2' ).toLowerCase() + '-' + option.id;
			}
			var optionWrapper = document.createElement('DIV');
			optionWrapper.classList.add( 'ct-tool' );
			if ( option.type.toLowerCase() !== 'button' ) {
				optionWrapper.classList.add( 'pbs-tool-option' );
			}
			if ( option['class'] ) {
				optionWrapper.setAttribute( 'class', optionWrapper.getAttribute('class') + ' ' + option['class'] );
			}
			if ( optionName ) {
				optionWrapper.classList.add( 'pbs-' + optionName.replace( /([a-z])([A-Z])/g, '$1-$2' ).toLowerCase() );
			}
			if ( option.id ) {
				optionWrapper.setAttribute( 'id', id );
			}
			// divGroup.insertBefore( optionWrapper, divGroup.firstChild );

			// Add in group if there is a group specified.
			if ( option.group ) {
				var subGroupName = option.group.toLowerCase().trim().replace( /\"/g, '' );
				var subGroup = divGroup.querySelector( '[data-subgroup="' + subGroupName + '"]' );
				if ( ! subGroup ) {
					subGroup = document.createElement( 'DIV' );
					subGroup.setAttribute( 'data-subgroup', subGroupName );
					divGroup.appendChild( subGroup );

					// Create the group title (subtitle)
					if ( option.group !== 'default' ) {
						subGroup.innerHTML = '<div class="pbs-option-subtitle pbs-tool-option">' + option.group + '</div>';

						// For shortcodes, groupings are accordions. Make it collapsable.
						if ( element.constructor.name === 'Shortcode' ) {
							subGroup.firstChild.classList.add( 'pbs-collapsable-title' );

							// Grouping is applied to shortcodes to make them into an accordion,
							// Opening one, closes all the other settings.
							subGroup.setAttribute( 'data-collapse-group', element.constructor.name.toLowerCase() );
							if ( divGroup.querySelectorAll( '[data-subgroup]' ).length > 1 ) {
								window.pbsCollapseSection( subGroup );
							}
						}
					}
				}
				subGroup.appendChild( optionWrapper );

				if ( option['group-tip'] ) {
					if ( subGroup.querySelector( '.pbs-group-tip-details' ) ) {
						subGroup.querySelector( '.pbs-group-tip-details' ).innerHTML = option['group-tip'];
					} else {
						subGroup.querySelector( '.pbs-option-subtitle' ).appendChild( window.PBSEditor.createGroupTip( option['group-tip'] ) );
					}
				}

			} else {

				var firstSubGroup = divGroup.querySelector( '[data-subgroup]');
				if ( firstSubGroup ) {
					divGroup.insertBefore( optionWrapper, firstSubGroup );
				} else {
					divGroup.appendChild( optionWrapper );
				}

			}

			if ( ! wp.hooks.applyFilters( 'pbs.inspector.do_add_section_options', true, optionName, model, divGroup, element, this ) ) {
				return;
			}

			// this._domInspector.insertBefore( optionWrapper, this._domInspector.firstChild );
			var o = new PBSOption[ optionName ]({
				optionSettings: option,
				model: model,
				el: optionWrapper
			});
			_pbsCreatedViews.push( o.render() );

			divGroup.view = o;

			// Dependency.
			this.applyOptionDependencies( o );

			return;
		}
	}

};


ContentTools.ToolboxUI.prototype.applyOptionDependencies = function( view ) {
	if ( ! view.optionSettings.depends ) {
		return;
	}

	// We need an array for the input.
	var depends = view.optionSettings.depends;
	if ( typeof depends.length !== 'number' ) {
		depends = [ depends ];
	}

	// Listen to changes on attributes we are dependent on.
	view.listenTo( view.model, 'change', function() {
		var allConditions = [];
		for ( var i = 0; i < depends.length; i++ ) {
			if ( ! depends[ i ].id || ! depends[ i ].value ) {
				continue;
			}

			var id = depends[ i ].id;
			var value = depends[ i ].value;
			var currentValue = this.model.get( id );
			var makeVisible = false;

			// Put all normal strings into an array to combine the checking process later on for strings..
			// Turn all value: 'string' into value: [ 'string' ]
			if ( typeof value === 'string' ) {
				if ( value.toLowerCase().trim() !== '__not_empty' && value.toLowerCase().trim() !== '__empty' && ! value.match( /^(>=?|<=?|==|!=)(.*)/ ) ) {
					value = [ value ];
				}
			}

			/**
			 * Checkers.
			 */

			// value: false
			if ( value === false || ( typeof value === 'string' && value.toLowerCase().trim() === 'false' ) ) {
				if ( typeof currentValue === 'undefined' ) {
					makeVisible = true;
				} else if ( typeof currentValue === 'string' && currentValue.toLowerCase().trim() === 'false' ) {
					makeVisible = true;
				} else if ( typeof currentValue === 'string' && currentValue.toLowerCase().trim() === '' ) {
					makeVisible = true;
				} else if ( typeof currentValue === 'boolean' && ! currentValue ) {
					makeVisible = true;
				} else if ( ! currentValue ) {
					makeVisible = true;
				}

			// value: true
			} else if ( value === true || ( typeof value === 'string' && value.toLowerCase().trim() === 'true' ) ) {
				if ( typeof currentValue === 'string' && currentValue.toLowerCase().trim() === 'true' ) {
					makeVisible = true;
				} else if ( typeof currentValue === 'boolean' && currentValue ) {
					makeVisible = true;
				} else if ( currentValue ) {
					makeVisible = true;
				}

			// value: [ string, ... ]
			} else if ( typeof value === 'object' && typeof value.length === 'number' ) {
				var k;
				var brokenByUnmatch = false;
				var onceMatched = false;
				var allNegatives = true;
				for ( k = 0; k < value.length; k++ ) {
					if ( ! value[ k ].match( /^!(.*)/ ) ) {
						allNegatives = false;
						break;
					}
				}
				for ( k = 0; k < value.length; k++ ) {
					if ( value[ k ].match( /^!(.*)/ ) ) {
						var text = value[ k ].match( /^!(.*)/ );
						text = text[1];
						if ( text === currentValue ) {
							brokenByUnmatch = true;
							break;
						}
					} else {
						if ( value[ k ] === currentValue ) {
							onceMatched = true;
							break;
						}
					}
				}

				if ( allNegatives && ! brokenByUnmatch ) {
					makeVisible = true;
				} else if ( ! brokenByUnmatch && onceMatched ) {
					makeVisible = true;
				}

			// value: '__not_empty'
			} else if ( value.toLowerCase().trim() === '__not_empty' ) {
				if ( typeof currentValue === 'string' && currentValue.trim() !== '' ) {
					makeVisible = true;
				} else if ( typeof currentValue === 'boolean' && currentValue ) {
					makeVisible = true;
				}

			// value: '__empty'
			} else if ( value.toLowerCase().trim() === '__empty' ) {
				if ( typeof currentValue === 'undefined' ) {
					makeVisible = true;
				} else if ( currentValue.trim() === '' ) {
					makeVisible = true;
				}

			// value: '<num', '<=num', '>num', '>=num', '==num', '!=num'
			} else if ( value.match( /^(>=?|<=?|==|!=)(.*)/ ) ) {
				var matches = value.match( /^(>=?|<=?|==|!=)(.*)/ );
				var operator = matches[1];
				var num = matches[2];

				if ( num.match( /\./ ) ) {
					num = parseFloat( num );
				} else {
					num = parseInt( num, 10 );
				}

				if ( typeof currentValue === 'undefined' ) {
					currentValue = 0;
				} else if ( currentValue.match( /\./ ) ) {
					currentValue = parseFloat( currentValue );
				} else {
					currentValue = parseInt( currentValue, 10 );
				}

				if ( operator === '<' ) {
					makeVisible = currentValue < num;
				} else if ( operator === '<=' ) {
					makeVisible = currentValue <= num;
				} else if ( operator === '>' ) {
					makeVisible = currentValue > num;
				} else if ( operator === '>=' ) {
					makeVisible = currentValue >= num;
				} else if ( operator === '!=' ) {
					makeVisible = currentValue !== num;
				} else {
					makeVisible = currentValue === num;
				}

			}

			allConditions.push( makeVisible );
		}

		// Check if all the dependencies are met.
		var allTrue = true;
		for ( i = 0; i < allConditions.length; i++ ) {
			if ( ! allConditions[ i ] ) {
				allTrue = false;
			}
		}

		// Hide or show the option.
		if ( allTrue ) {
			this.$el.fadeIn();
		} else {
			this.$el.fadeOut();
		}


	} );

	view.model.trigger( 'change', view.model );
};


ContentTools.ToolboxUI.prototype.addGenericShortcodeOptions = function( divGroup, element ) {

	var view, keys, i, attributeName, hasOptions = false;

	// do matches
	keys = element.model.keys();
	for ( i = 0; i < keys.length; i++ ) {
		attributeName = keys[ i ];
		if ( attributeName !== 'content' ) {

			view = new PBSOption.GenericOption({
				attribute: attributeName,
				model: element.model
			});
			_pbsCreatedViews.push( view.render() );
			divGroup.appendChild( view.el );

			hasOptions = true;
		}
	}

	// do content
	if ( element.model.get('content') ) {

		view = new PBSOption.GenericOption({
			attribute: 'content',
			model: element.model
		});
		_pbsCreatedViews.push( view.render() );
		divGroup.appendChild( view.el );

		hasOptions = true;
	}

	if ( ! hasOptions ) {
		var note = document.createElement( 'SPAN' );
		note.innerHTML = pbsParams.labels.shortcodes_not_attributes_detected;
		note.classList.add( 'pbs-shortcode-no-options' );
		divGroup.appendChild( note );
	}

};




ContentTools.ToolboxUI.prototype.addSection = function( domElement ) {
	var currElem, i, k, group, heading, label,
		doneTypes = [];

	// Remember previous selected element.
	// Don't add the sections again for the same element.
	if ( this._previouslySelectedElement === domElement ) {
		return;
	}

	this._newGroups = [];
	this._currentGroupIndex = 0;
	if ( typeof this._oldGroups === 'undefined' ) {
		this._oldGroups = [];

		// Make sure the oldGroups don't carry over to the next editing session.
		var editor = ContentTools.EditorApp.get();
		editor.bind( 'start', function() {
			this._oldGroups = [];
		}.bind( this ) );
	}

	// this.clearSections();
	this._previouslySelectedElement = domElement;

	if ( typeof this._domInspectorGroups === 'undefined' ) {
		this._domInspectorGroups = [];
	}

	/**
	 * Create the inspector for the first DOM element selected if possible.
	 */
	if ( domElement ) {
		var currDomElement = null;
		while ( domElement ) {
			if ( domElement.tagName && domElement.tagName !== 'DIV' ) {
				if ( window.pbsSelectorMatches( domElement, '[data-name="main-content"] *' ) ) {
					currDomElement = domElement;
					break;
				}
			}
			domElement = domElement.parentNode;
		}

		var matchedPattern = '';
		label = '';
		if ( currDomElement ) {
			for ( var pattern in PBSShortcodes ) {
				if ( PBSShortcodes.hasOwnProperty( pattern ) ) {
					try {
						if ( window.pbsSelectorMatches( domElement, pattern ) ) {
							matchedPattern = pattern;
						}
					} catch (err) {
					}
				}
			}
		}

		if ( matchedPattern ) {
			if ( PBSShortcodes[ matchedPattern ].label ) {
				label = PBSShortcodes[ matchedPattern ].label;
			}
			if ( ! label ) {
				label = matchedPattern;
			}

			// Create the group.
			group = this.constructor.createDiv( ['ct-tool-group', 'pbs-inspector-group', 'pbs-dom-group'] );
			group.groupType = matchedPattern;

			// Create the title.
			heading = document.createElement('DIV');
			heading.classList.add( 'pbs-group-title' );
			heading.classList.add( 'pbs-collapsable-title' );
			heading.classList.add( 'pbs-dom-title' );
			heading.innerHTML = pbsParams.labels.inspector_title.replace( '%s', label );
			group.insertBefore( heading, group.firstChild );

			wp.hooks.doAction( 'inspector.group_title.create', group );
			this.placeGroup( group );


			currElemModel = new Backbone.Model({
				element: currDomElement
			});

			for ( i = 0; i < PBSShortcodes[ matchedPattern ].options.length; i++ ) {
				this.addSectionOptions( group, PBSShortcodes[ matchedPattern ].options[i], currDomElement, currElemModel );
			}
		}
	}


	/**
	 * Build the CT Element hierarchy.
	 */
	var root = ContentEdit.Root.get();
	var element = root.focused();
	if ( ! element ) {
		return;
	}
	currElem = element;
	var hierarchy = [];


	var finishedClasses = [];
	while ( currElem && currElem.constructor.name !== 'Region' ) {
		if ( finishedClasses.indexOf( currElem.constructor.name ) === -1 ) {
			hierarchy.push( currElem );
			finishedClasses.push( currElem.constructor.name );
		}
		currElem = currElem.parent();
	}


	// Adjust the order of the inspector. Make sure the row & column are last.
	var elem;
	for ( i = 0; i < hierarchy.length; i++ ) {
		if ( hierarchy[ i ].constructor.name === 'DivRow' ) {
			elem = hierarchy[ i ];
			hierarchy.splice( i, 1 );
			hierarchy.push( elem );
			break;
		}
	}
	for ( i = 0; i < hierarchy.length; i++ ) {
		if ( hierarchy[ i ].constructor.name === 'DivCol' ) {
			elem = hierarchy[ i ];
			hierarchy.splice( i, 1 );
			hierarchy.push( elem );
			break;
		}
	}


	var finishedElemTypes = [];
	var currElemModel;
	for ( i = 0; i < hierarchy.length; i++ ) {
		currElem = hierarchy[ i ];

		var elemType = currElem.constructor.name;
		var groupClasses;

		elemType = wp.hooks.applyFilters( 'pbs.inspector.elemtype', elemType, currElem );

		if ( finishedElemTypes.indexOf( elemType ) !== -1 ) {
			continue;
		}
		finishedElemTypes.push( elemType );

		// Get the title label.
		if ( elemType === 'Shortcode' ) {

			label = currElem._domElement.getAttribute('data-base');
			if ( typeof PBSShortcodes[ currElem.sc_base ] !== 'undefined' && typeof PBSShortcodes[ currElem.sc_base ].label !== 'undefined' ) {
				label = PBSShortcodes[ currElem.sc_base ].label;
			}

		} else if ( typeof PBSShortcodes[ elemType ] !== 'undefined' && doneTypes.indexOf( elemType ) === -1 ) {

			label = currElem.typeName();
			if ( PBSShortcodes[ elemType ].label ) {
				label = PBSShortcodes[ elemType ].label;
			}

 		} else {
			continue;
		}


		// Create the group.
		groupClasses = ['ct-tool-group', 'pbs-inspector-group', 'pbs-' + currElem.cssTypeName() + '-group'];
		if ( elemType === 'Shortcode' ) {
			groupClasses.push( 'pbs-shortcode-' + currElem.sc_base + '-group' );
		}
		group = this.constructor.createDiv( groupClasses );
		group.groupType = elemType;

		// Create the title.
		heading = document.createElement('DIV');
		heading.classList.add( 'pbs-group-title' );
		heading.classList.add( 'pbs-collapsable-title' );
		heading.classList.add( 'pbs-' + currElem.cssTypeName() + '-title' );
		heading.innerHTML = pbsParams.labels.inspector_title.replace( '%s', label );
		group.insertBefore( heading, group.firstChild );

		wp.hooks.doAction( 'inspector.group_title.create', group );
		this.placeGroup( group );


		// Create the options.
		if ( elemType === 'Shortcode' ) {

			var shortcodeBase = currElem.sc_base,
				shortcodeProperties = PBSShortcodes[ shortcodeBase ];

			if ( typeof shortcodeProperties !== 'undefined' && typeof shortcodeProperties.hidden !== 'undefined' ) {
				if ( shortcodeProperties.hidden ) {
					continue;
				}
			}

			if ( typeof shortcodeProperties !== 'undefined' && typeof shortcodeProperties.options !== 'undefined' ) {
				for ( k = 0; k < shortcodeProperties.options.length; k++ ) {
					this.addSectionOptions( group, shortcodeProperties.options[ k ], currElem );
				}
			} else {
				this.addGenericShortcodeOptions( group, currElem );
				heading.innerHTML += '<span>' + pbsParams.labels.note_options_are_detected + '</span>';
			}

			// Add note.
			var shortcodeNote = document.createElement( 'DIV' );
			shortcodeNote.classList.add( 'pbs-inspector-shortcode-note' );
			shortcodeNote.innerHTML = pbsParams.labels.note_shortcode_not_appearing;
			group.appendChild( shortcodeNote );

		} else if ( typeof PBSShortcodes[ elemType ] !== 'undefined' && doneTypes.indexOf( elemType ) === -1 ) {

			// currElemModel = new Backbone.Model({
			// 	element: currElem
			// });
			if ( ! currElem.model ) {
				currElemModel = new Backbone.Model({
					element: currElem
				});
			} else {
				currElemModel = currElem.model;
				currElemModel.set( 'element', currElem );
			}

			for ( k = 0; k < PBSShortcodes[ elemType ].options.length; k++ ) {
				this.addSectionOptions( group, PBSShortcodes[ elemType ].options[ k ], currElem, currElemModel );
			}

			wp.hooks.doAction( 'pbs.inspector.add_section', group, label );

 		} else {
			continue;
		}
	}




	for ( i = 0; i < this._oldGroups.length; i++ ) {
		var oldGroup = this._oldGroups[ i ];
		if ( typeof oldGroup.view !== 'undefined' ) {
			// oldGroup.view.remove();
		}



		oldGroup.style.height = window.getComputedStyle( oldGroup ).height;
		oldGroup.style.webkitTransition = 'height .3s ease-in-out';
		oldGroup.style.mozTransition = 'height .3s ease-in-out';
		oldGroup.style.msTransition = 'height .3s ease-in-out';
		oldGroup.style.transition = 'height .3s ease-in-out';
		oldGroup.style.overflow = 'hidden';
		oldGroup.offsetHeight; // force repaint
		oldGroup.style.height = 0;

		// Remove from dom after transition.
		oldGroup.addEventListener('transitionend', function transitionEnd(event) {
			if (event.propertyName === 'height') {
				this.removeEventListener('transitionend', transitionEnd, false);
				if ( typeof this.view !== 'undefined' ) {
					this.view.remove();
				}
				this.parentNode.removeChild( this );
			}
		}.bind(oldGroup), false);

		// Fallback, when fast switching, transitionend sometimes does not fire.
		setTimeout( function() {
			if ( typeof this.view !== 'undefined' ) {
				this.view.remove();
			}
			if ( this.parentNode ) {
				this.parentNode.removeChild( this );
			}
		}.bind(oldGroup), 350);
	}
	this._oldGroups = [];
	while ( this._newGroups.length ) {
		this._oldGroups.push( this._newGroups.pop() );
	}

};

ContentTools.ToolboxUI.prototype.clearSections = function() {

	while ( _pbsCreatedViews.length > 0 ) {
		var o = _pbsCreatedViews.pop();
		o.remove();
	}

	if ( this._domInspectorGroups ) {
		while ( this._domInspectorGroups.length ) {
			var elemToRemove = this._domInspectorGroups.shift();
			elemToRemove.parentNode.removeChild( elemToRemove );
		}
	}

	this._previouslySelectedElement = null;
};


/**
 * Places the section/group in the inspector.
 * If a similar group already exists (same type), then replace it's contents & resize it
 * If it's a new group, add it and animate it.
 */
ContentTools.ToolboxUI.prototype.placeGroup = function( group ) {
	this._newGroups.push( group );

	// Check the existing groups and replace if it already exists.
	for ( var i = 0; i < this._oldGroups.length; i++ ) {
		var oldGroup = this._oldGroups[ i ];
		if ( oldGroup.groupType === group.groupType ) {
			var startHeight = getComputedStyle( oldGroup ).height;
			group.style.overflow = 'hidden';
			group.style.height = startHeight;

			if ( typeof oldGroup.view !== 'undefined' ) {
				oldGroup.view.remove();
			}
			this._domElement.replaceChild( group, oldGroup );
			this._currentGroupIndex = i + 1;
			this._oldGroups.splice( i, 1 );

			setTimeout( function() { // jshint ignore:line
				this.style.height = 'auto';
				var endHeight = getComputedStyle(this).height;
				if ( this.classList.contains('pbs-collapse') ) {
					endHeight = getComputedStyle( this.querySelector( '.pbs-group-title' ) ).height;
				}
				this.style.height = startHeight;
				this.offsetHeight; // force repaint
				this.style.webkitTransition = 'height .3s ease-in-out';
				this.style.mozTransition = 'height .3s ease-in-out';
				this.style.msTransition = 'height .3s ease-in-out';
				this.style.transition = 'height .3s ease-in-out';
				this.style.overflow = 'hidden';
				this.style.height = endHeight;

				var didTransition = false;
				this.addEventListener('transitionend', function transitionEnd(event) {
					if (event.propertyName === 'height') {
						this.style.webkitTransition = '';
						this.style.mozTransition = '';
						this.style.msTransition = '';
						this.style.transition = '';
						if ( ! this.classList.contains('pbs-collapse') ) {
							this.style.height = 'auto';
							this.style.overflow = 'visible'; // Allow tooltips to overflow.
						}
						didTransition = true;
						this.removeEventListener('transitionend', transitionEnd, false);
					}
				}, false);

				// If another same element was previously selected, the transition above will not
				// trigger. Make sure the container can overflow or else our colorpickers and
				// tooltips will not display.
				setTimeout( function() {
					if ( ! didTransition && this ) {
						if ( ! this.classList.contains('pbs-collapse') ) {
							this.style.height = 'auto';
							this.style.overflow = 'visible';
						}
					}
				}.bind( this ), 350 );

			}.bind( group ), 1 );

			return;
		}
	}

	// Add the new group.
	group.style.height = 0;
	group.style.overflow = 'hidden';
	this._domElement.insertBefore( group, this._domElement.querySelectorAll( '.ct-tool-group' )[ this._currentGroupIndex + 1 ] );
	this._currentGroupIndex++;

	setTimeout( function() {
		this.style.height = 'auto';
		var endHeight = getComputedStyle(this).height;
		if ( this.classList.contains('pbs-collapse') ) {
			endHeight = getComputedStyle( this.querySelector( '.pbs-group-title' ) ).height;
		}
		this.style.height = 0;
		this.offsetHeight; // force repaint
		this.style.webkitTransition = 'height .3s ease-in-out';
		this.style.mozTransition = 'height .3s ease-in-out';
		this.style.msTransition = 'height .3s ease-in-out';
		this.style.transition = 'height .3s ease-in-out';
		this.style.overflow = 'hidden';
		this.style.height = endHeight;
		this.addEventListener('transitionend', function transitionEnd(event) {
			if (event.propertyName === 'height') {
				this.style.webkitTransition = '';
				this.style.mozTransition = '';
				this.style.msTransition = '';
				this.style.transition = '';
				if ( ! this.classList.contains('pbs-collapse') ) {
					this.style.height = 'auto';
					this.style.overflow = 'visible'; // Allow tooltips to overflow.
				}
				this.removeEventListener('transitionend', transitionEnd, false);
			}
		}, false);
	}.bind( group ), 1 );
};




/***********************************************************************************************
 * These are the inspector elements that we are supporting.
 ***********************************************************************************************/
window.pbsAddInspector = function( elemName, args ) {// options ) {
	if ( typeof args !== 'object' ) {
		return;
	}
	var i;

	// Support multiple element names given.
	if ( typeof elemName === 'object' ) {
		for ( i = 0; i < elemName.length; i++ ) {
			window.pbsAddInspector( elemName[ i ], args );
		}
		return;
	}

	if ( typeof PBSShortcodes[ elemName ] === 'undefined' ) {
		PBSShortcodes[ elemName ] = args;
		return;
	}
	for ( var argName in args ) {
		if ( args.hasOwnProperty( argName ) ) {
			if ( argName !== 'options' ) {
				PBSShortcodes[ elemName ][ argName ] = args[ argName ];
			} else {
				var options = args[ argName ];
				for ( i = 0; i < options.length; i++ ) {
					PBSShortcodes[ elemName ].options.push( options[ i ] );
				}
			}
		}
	}
};
var PBSShortcodes = {};

	// 'pbs_button': {
	// 	'name': 'Button',
	// 	'desc': 'Add a button',
	// 	'icon': pbsParams.default_icon
	// 	// 'options': [
	// 	// ],
	// }
// };


/*********************************************************************
 * Allow localize in PHP to add new shortcode options.
 *********************************************************************/
if ( pbsParams.additional_shortcodes ) {
	for ( var elemName in pbsParams.additional_shortcodes ) {
		if ( pbsParams.additional_shortcodes.hasOwnProperty( elemName ) ) {
			PBSShortcodes[ elemName ] = pbsParams.additional_shortcodes[ elemName ];
		}
	}
}



/**
 * Collapse transition.
 * @see http://n12v.com/css-transition-to-from-auto/ for animating the height from auto to 0.
 */
var storedCollapsed = [];
window.pbsCollapseSection = function( section ) {
	var classes;

	// Do collapse animation.
	if ( section.classList.contains( 'pbs-collapse' ) ) {

		// If data-collapse-group is present, then this means that the collapsable area
		// should act like an accordion.
		if ( section.getAttribute( 'data-collapse-group' ) ) {
			var openSections = document.querySelectorAll( '[data-collapse-group="' + section.getAttribute( 'data-collapse-group' ) + '"]:not(.pbs-collapse)' );
			Array.prototype.forEach.call( openSections, function(el) {
				window.pbsCollapseSection( el );
			});
		}

		var prevHeight = section.style.height;
		section.style.height = 'auto';
		var endHeight = getComputedStyle(section).height;
		section.style.height = prevHeight;
		section.offsetHeight; // force repaint
		section.style.webkitTransition = 'height .3s ease-in-out';
		section.style.mozTransition = 'height .3s ease-in-out';
		section.style.msTransition = 'height .3s ease-in-out';
		section.style.transition = 'height .3s ease-in-out';
		section.style.overflow = 'hidden';
		section.style.height = endHeight;
		section.addEventListener('transitionend', function transitionEnd(event) {
			if (event.propertyName === 'height') {
				section.style.webkitTransition = '';
				section.style.mozTransition = '';
				section.style.msTransition = '';
				section.style.transition = '';
				section.style.height = 'auto';
				section.style.overflow = 'visible'; // Allow tooltips to overflow.
				section.removeEventListener('transitionend', transitionEnd, false);
			}
		}, false);

		section.classList.remove( 'pbs-collapse' );

		classes = section.getAttribute( 'class' );
		classes = classes.replace( /\s*(ct-tool-group|pbs-collapse|pbs-inspector-group)\s*/g, '' );

		if ( storedCollapsed.indexOf( classes ) !== -1 ) {
			storedCollapsed.splice( storedCollapsed.indexOf( classes ), 1 );
			localStorage.setItem( 'pbs_collapsed_sections', JSON.stringify( storedCollapsed ) );
		}
	} else {

		// Do collapse animation.
		section.style.height = window.getComputedStyle( section ).height;
		section.style.webkitTransition = 'height .3s ease-in-out';
		section.style.mozTransition = 'height .3s ease-in-out';
		section.style.msTransition = 'height .3s ease-in-out';
		section.style.transition = 'height .3s ease-in-out';
		section.style.overflow = 'hidden';
		section.offsetHeight; // force repaint;
		section.style.height = window.getComputedStyle( section.firstChild ).height;
		section.addEventListener('transitionend', function transitionEnd(event) {
			if (event.propertyName === 'height') {
				section.removeEventListener('transitionend', transitionEnd, false);
			}
		}, false);

		section.classList.add( 'pbs-collapse' );

		classes = section.getAttribute( 'class' );
		classes = classes.replace( /\s*(ct-tool-group|pbs-collapse|pbs-inspector-group)\s*/g, '' );

		if ( storedCollapsed.indexOf( classes ) === -1 ) {
			storedCollapsed.push( classes );
			localStorage.setItem( 'pbs_collapsed_sections', JSON.stringify( storedCollapsed ) );
		}
	}
};
window.pbsOpenAllSections = function() {
	var sections = document.querySelectorAll( '.ct-tool-group' );
	Array.prototype.forEach.call( sections, function(el){
		if ( el.classList.contains('pbs-collapse') ) {
			window.pbsCollapseSection( el );
		}
	});
};
window.pbsOnlyOpenSection = function( sectionClass ) {
	var sections = document.querySelectorAll( '.ct-tool-group' );
	Array.prototype.forEach.call( sections, function(el){
		// Open the section we need.
		if ( sectionClass && el.classList.contains( sectionClass ) ) {
			if ( el.classList.contains('pbs-collapse') ) {
				window.pbsCollapseSection( el );
			}
		} else {
			// Close the rest.
			if ( ! el.classList.contains('pbs-collapse') ) {
				window.pbsCollapseSection( el );
			}
		}
	});
};

window.addEventListener( 'DOMContentLoaded', function() {
	if ( ! document.querySelector( '[data-name="main-content"]' ) ) {
		return;
	}

	// Load saved collapsed sections on start.
	var editor = ContentTools.EditorApp.get();
	editor.bind( 'start', function() {
		if ( typeof localStorage.getItem( 'pbs_collapsed_sections' ) !== 'undefined' && localStorage.getItem( 'pbs_collapsed_sections' ) ) {
			storedCollapsed = JSON.parse( localStorage.getItem( 'pbs_collapsed_sections' ) );

			for ( var i = 0; i < storedCollapsed.length; i++ ) {
				var groupClass = storedCollapsed[ i ].replace( /\s/g, '.' );
				if ( groupClass ) {
					var section = document.querySelector( '.ct-tool-group.' + groupClass );
					if ( section ) {
						section.classList.add( 'pbs-collapse' );
						section.style.height = window.getComputedStyle( section.firstChild ).height;
					}
				}
			}
		}
	} );

	// Handler for collapsing / uncollapsing.
	document.addEventListener('click', function(ev) {
		var section = ev.target;
		if ( ! ev.target.classList.contains( 'pbs-collapsable-title' ) ) {
			if ( ! ev.target.parentNode ) {
				return;
			}
			if ( ! ev.target.parentNode.classList ) {
				return;
			}
			if ( ! ev.target.parentNode.classList.contains( 'pbs-collapsable-title' ) ) {
				return;
			}
			section = ev.target.parentNode.parentNode;
		} else {
			section = ev.target.parentNode;
		}

		window.pbsCollapseSection( section );
	});
});
// Add collapse class for dynamically added inspector sections.
wp.hooks.addAction( 'inspector.group_title.create', function( section ) {
	var classes = section.getAttribute( 'class' );
	classes = classes.replace( /\s*(ct-tool-group|pbs-collapse|pbs-inspector-group)\s*/g, '' );

	if ( storedCollapsed.indexOf( classes ) !== -1 ) {
		section.classList.add( 'pbs-collapse' );

		// Add the actual height of the section. We need to do this in a timeout since
		// the title/subtitle is still being created.
		setTimeout( function() {
			section.style.height = window.getComputedStyle( section.firstChild ).height;
		}, 1 );
	}
} );

/* globals ContentEdit, ContentTools, pbsParams */


var PBSOption = {};


PBSOption.widgetSettings = Backbone.View.extend({

	className: 'pbs-tool-option',

	events: {
		'change input' : 'attributeChanged',
		'keyup input' : 'attributeChanged',
		'change textarea' : 'attributeChanged',
		'keyup textarea' : 'attributeChanged',
		'click input[type="radio"]' : 'attributeChanged',
		'click input[type="checkbox"]' : 'attributeChanged',
		'change select' : 'attributeChanged',
		'keyup select' : 'attributeChanged'
	},

	initialize: function(options) {
		// _.extend(this, _.pick(options, 'optionSettings', 'attribute'));
		this.optionSettings = _.clone( options.optionSettings );
		this.attribute = _.clone( options.attribute );

		if ( typeof this.model.attributes.widget === 'undefined' ) {
			this.model.attributes.widget = 'WP_Widget_Text';
		}
		this.template = wp.template( 'pbs-widget-' + this.model.attributes.widget );
	},

	render: function() {
		var data = _.extend( {}, this.model.attributes, this.optionSettings );
	    this.$el.html( this.template( data ) );

		// Adjust the inspector title.
		var widgetInfo = pbsParams.widget_list[ this.model.attributes.widget ];
		var inspectorContainer = this.el.parentNode.querySelector( '.pbs-group-title' );
		inspectorContainer.innerHTML = pbsParams.labels.widget_properties_title.replace( '%s', widgetInfo.name ) + '<span>' + widgetInfo.description + '</span>';

		// Assign the current settings of the widget.
		for (var attributeName in this.model.attributes ) {
			if ( ! this.model.attributes.hasOwnProperty( attributeName ) ) {
				continue;
			}

			var option = this.el.querySelector( '#widget-' + widgetInfo.id_base + '--' + attributeName );
			if ( option ) {
				if ( option.tagName === 'TEXTAREA' ) {
					option.value = this.model.attributes[  attributeName ].replace( /<br>/g, '\n' );
				} else if ( option.tagName === 'INPUT' && option.getAttribute( 'type' ) === 'checkbox' ) {
					if ( this.model.attributes[ attributeName ] ) {
						option.checked = true;
					}
				} else {
					option.value = this.model.attributes[  attributeName ];
				}
			}
		}

		// The only way to get the default values of widgets is using the form.
		// At the start trigger the form fields to save so we can get the default values.
		var fields = this.el.querySelectorAll( '[id^=widget-' + widgetInfo.id_base + '--' );
		Array.prototype.forEach.call( fields, function(el) {
			this.attributeChanged( { target: el } );
		}.bind( this ) );

	    return this;
	},

	attributeChanged: function(e) {

		var widgetInfo = pbsParams.widget_list[ this.model.attributes.widget ];
		var attribute = e.target.getAttribute( 'id' ).replace( 'widget-' + widgetInfo.id_base + '--', '' );

		if ( e.target.tagName === 'INPUT' && e.target.getAttribute( 'type' ) === 'checkbox' ) {
			this.model.set( attribute, e.target.checked ? e.target.value : '' );
		} else {
			this.model.set( attribute, e.target.value );
		}
	}
});


PBSOption.Button = Backbone.View.extend({

	events: {
		'click': 'click',
		'mouseenter': 'mouseenter',
		'mouseleave': 'mouseleave',
		'mousedown': 'mousedown',
		'mouseup': 'mouseup'
	},

	initialize: function(options) {
		// _.extend(this, _.pick(options, 'optionSettings', 'attribute'));
		this.optionSettings = _.clone( options.optionSettings );
		this.attribute = _.clone( options.attribute );
		if ( this.optionSettings.initialize ) {
			this.optionSettings.initialize( this.model.get('element'), this );
		}
		this._canApplyUpdater();
	},

	render: function() {
		if ( this.optionSettings.name ) {
			this.el.setAttribute( 'data-tooltip', this.optionSettings.name );
		}
		if ( this.optionSettings.render ) {
			this.optionSettings.render( this.model.get('element'), this );
		}
		this._tooltipUpdater();
		this._isAppliedUpdater();
		this._canApplyUpdater();
	    return this;
	},

	click: function() {
		if ( this.el.classList.contains( 'ct-tool--disabled' ) ) {
			return;
		}
		if ( this.optionSettings.click ) {
			this.optionSettings.click( this.model.get('element'), this );
		}
		this._tooltipUpdater();
		this._isAppliedUpdater();
		this._canApplyUpdater();

		// Restore the caret position.
		if ( this._selectedElement && this._selectedElement.restoreState ) {
			this._selectedElement.restoreState();
		}
	},

	updateTooltip: function( value ) {
		if ( ! value ) {
			value = '';
		}
		if ( window.PBSEditor.isCtrlDown && window.PBSEditor.isShiftDown ) {
			if ( this.optionSettings['tooltip-reset'] ) {
				this.el.setAttribute( 'data-tooltip', this.optionSettings['tooltip-reset'].replace( '{0}', value ) );
				return;
			}
		} else if ( window.PBSEditor.isCtrlDown ) {
			if ( this.optionSettings['tooltip-down'] ) {
				this.el.setAttribute( 'data-tooltip', this.optionSettings['tooltip-down'].replace( '{0}', value ) );
				return;
			}
		} else {
			if ( this.optionSettings.tooltip ) {
				this.el.setAttribute( 'data-tooltip', this.optionSettings.tooltip.replace( '{0}', value ) );
				return;
			}
		}
		if ( this.optionSettings.tooltip ) {
			this.el.setAttribute( 'data-tooltip', this.optionSettings.tooltip );
		} else if ( this.optionSettings.name ) {
			this.el.setAttribute( 'data-tooltip', this.optionSettings.name );
		}
	},

	_tooltipUpdater: function() {
		if ( this.optionSettings.tooltipValue && this.model.get('element') ) {
			this.updateTooltip( this.optionSettings.tooltipValue( this.model.get('element'), this ) );
		} else {
			this.updateTooltip();
		}
	},

	updateIsApplied: function( value ) {
		this.el.classList.remove( 'ct-tool--applied' );

		if ( value ) {
			this.el.classList.add( 'ct-tool--applied' );
		}
	},

	_canApplyUpdater: function() {
		this.el.classList.remove( 'ct-tool--disabled' );
		if ( this.optionSettings.canApply && this.model.get('element') && this.model.get('element')._domElement ) {
			if ( ! this.optionSettings.canApply( this.model.get('element'), this ) ) {
				this.el.classList.add( 'ct-tool--disabled' );
			}
		}
	},

	_isAppliedUpdater: function() {
		if ( this.optionSettings.isApplied && this.model.get('element') && this.model.get('element')._domElement ) {
			this.updateIsApplied( this.optionSettings.isApplied( this.model.get('element'), this ) );
		}
	},

	mouseenter: function() {
		if ( this.optionSettings.mouseenter && this.model.get('element') && this.model.get('element')._domElement ) {
			this.optionSettings.mouseenter( this.model.get('element'), this );
		}
		if ( this.optionSettings.hold ) {
			clearTimeout( this._holdTimeout );
			clearInterval( this._holdInterval );
		}
		if ( this.model.get('element') && this.model.get('element')._domElement ) {
			this.model.get('element')._domElement.classList.add('ce-element--over');
		}
		this._tooltipUpdaterInterval = setInterval( this._tooltipUpdater.bind(this), 100 );
	},

	mouseleave: function() {
		if ( this.optionSettings.mouseleave && this.model.get('element') && this.model.get('element')._domElement ) {
			this.optionSettings.mouseleave( this.model.get('element'), this );
		}
		if ( this.optionSettings.hold ) {
			clearTimeout( this._holdTimeout );
			clearInterval( this._holdInterval );
		}
		if ( this.model.get('element') ) {
			if ( this.model.get('element')._domElement ) {
				this.model.get('element')._domElement.classList.remove('ce-element--over');
			}
		}
		clearInterval( this._tooltipUpdaterInterval );
	},

	mousedown: function() {

		// Store the cursor state.
		var root = ContentEdit.Root.get();
		var selectedElement = root.focused();
		if ( selectedElement && selectedElement.storeState ) {
			selectedElement.storeState();
		}
		if ( selectedElement ) {
			this._selectedElement = selectedElement;
		}

		if ( this.optionSettings.hold ) {
			clearTimeout( this._holdTimeout );
			clearInterval( this._holdInterval );

			this._holdTimeout = setTimeout(function() {
				this._holdInterval = setInterval( function() {
					this.optionSettings.hold( this.model.get('element'), this );
					this._tooltipUpdater();
					this._isAppliedUpdater();
				}.bind(this), 30 );
			}.bind(this), 500);
		}
	},

	mouseup: function() {
		if ( this.optionSettings.hold ) {
			clearTimeout( this._holdTimeout );
			clearInterval( this._holdInterval );
		}
	}
});



PBSOption.GenericOption = Backbone.View.extend({
	template: wp.template( 'pbs-shortcode-generic-option' ),

	className: 'pbs-tool-option',

	events: {
		'change input' : 'attributeChanged',
		'keyup input' : 'attributeChanged',
		'change textarea' : 'attributeChanged',
		'keyup textarea' : 'attributeChanged'
	},

	initialize: function(options) {
		// _.extend(this, _.pick(options, 'optionSettings', 'attribute'));
		this.optionSettings = _.clone( options.optionSettings );
		this.attribute = _.clone( options.attribute );

		if ( this.attribute === 'content' ) {
			this.template = wp.template( 'pbs-shortcode-generic-content' );
		}
	},

	render: function() {
		var data = _.extend( {}, this.model.attributes, this.optionSettings );
		data.value = this.model.get( this.attribute );
		data.attr = this.attribute;

	    this.$el.html( this.template( data ) );

	    return this;
	},

	attributeChanged: function(e) {
		this.model.set( this.attribute, e.target.value );
	}
});


PBSOption.Border = Backbone.View.extend({
	template: wp.template( 'pbs-option-border' ),

	events: {
		'change select' : 'styleChanged',
		'change .width' : 'widthChanged',
		'keyup .width' : 'widthChanged',
		'change .radius' : 'radiusChanged',
		'keyup .radius' : 'radiusChanged',
		'click .pbs-color-preview': 'togglePicker',
		'change .pbs-color-popup input' : 'colorChanged',
		'keyup .pbs-color-popup input' : 'colorChanged'
	},

	initialize: function(options) {
		// _.extend(this, _.pick(options, 'optionSettings'));
		this.optionSettings = _.clone( options.optionSettings );
		this.randomID = this.optionSettings.id + '-' + _.random(0, 10000);
		// this.model.set( this.optionSettings.id, this.optionSettings.value( this.model.get('element') ) );

		this._hidePickerBound = this.hidePicker.bind(this);
		document.querySelector('.ct-toolbox').addEventListener('mouseleave', this._hidePickerBound);
	},

	render: function() {
		var data = _.extend( {}, this.model.attributes, this.optionSettings );
		data.id = this.randomID;
		// data.value = this.optionSettings.value( this.model.get('element' ) );


		var styles = window.getComputedStyle( this.model.get('element')._domElement );
		var stylesToAdd = [ 'border-color', 'border-style', 'border-width', 'border-radius' ];

		for ( var i = 0; i < stylesToAdd.length; i++ ) {
			this.model.set( stylesToAdd[ i ], styles[ stylesToAdd[ i ] ], { silent: true } );
		}

	    this.$el.html( this.template( data ) );

		var _this = this;
		jQuery('#' + this.randomID).iris({
			// or in the data-default-color attribute on the input
			defaultColor: true,
			// a callback to fire whenever the color changes to a valid color
			change: function(){
				_this.colorChanged();
			},
			// a callback to fire when the input is emptied or an invalid color
			clear: function() {},
			// hide the color picker controls on load
			hide: false,
			// Add our own pretty colors
			palettes: [ '#000', '#fff', '#CF000F', '#D2527F', '#F89406', '#F9BF3B', '#2ECC71', '#19B5FE', '#8E44AD' ]
		});
	    return this;


	},

	remove: function(){
		jQuery('#' + this.randomID).iris('destroy');
		document.querySelector('.ct-toolbox').removeEventListener('mouseleave', this._hidePickerBound);
        Backbone.View.prototype.remove.apply(this, arguments);
    },

	colorChanged: function() {
		var inputColor = this.el.querySelector('.pbs-color-popup input').value;
		var color = jQuery(this.el.querySelector('#' + this.randomID)).iris( 'color' );

		if ( inputColor === 'transparent' || inputColor === '' ) {
			color = inputColor;
		}

		this.model.get('element').style( 'border-color', color );
		if ( color === 'transparent' ) {
			color = '';
		}
		this.el.querySelector('.pbs-color-preview').style.background = color;
	},

	styleChanged: function(e) {

		this.model.get('element').style( 'border-style', e.target.value );

		// If all borders are 0px, then make them into 1px if !== none
		// If none, turn all borders to 0px.

		var newBorder = '0px';
		if ( e.target.value !== 'none' ) {
			newBorder = '1px';
		}

		var allBordersZero = true;
		if ( parseInt( this.model.get( 'border-top-width' ), 10 ) ) {
			allBordersZero = false;
		}
		if ( parseInt( this.model.get( 'border-right-width' ), 10 ) ) {
			allBordersZero = false;
		}
		if ( parseInt( this.model.get( 'border-bottom-width' ), 10 ) ) {
			allBordersZero = false;
		}
		if ( parseInt( this.model.get( 'border-left-width' ), 10 ) ) {
			allBordersZero = false;
		}

		// Apply the border widths.
		if ( ( allBordersZero && e.target.value !== 'none' ) || e.target.value === 'none' ) {
			this.model.set( 'border-top-width', newBorder );
			this.model.set( 'border-right-width', newBorder );
			this.model.set( 'border-bottom-width', newBorder );
			this.model.set( 'border-left-width', newBorder );
			this.model.get('element').style( 'border-width', newBorder );
			this.model.trigger('change', this.model);
		}
	},

	widthChanged: function(e) {
		var value = e.target.value;
		if ( ! isNaN( value ) && value.trim() !== '' ) {
			value = value + 'px';
		}
		this.model.get('element').style( 'border-width', value );
	},

	radiusChanged: function(e) {
		var value = e.target.value;
		if ( ! isNaN( value ) && value.trim() !== '' ) {
			value = value + 'px';
		}
		this.model.get('element').style( 'border-radius', value );
	},

	togglePicker: function() {
		if ( this.el.querySelector('.pbs-color-popup').style.display === 'block' ) {
			this.el.querySelector('.pbs-color-popup').style.display = '';
		} else {
			this.el.querySelector('.pbs-color-popup').style.display = 'block';
		}
	},

	hidePicker: function() {
		this.el.querySelector('.pbs-color-popup').style.display = '';
	}
});



PBSOption.Color = Backbone.View.extend({
	template: wp.template( 'pbs-option-color' ),

	events: {
		'mouseenter': 'mouseenter',
		'mouseleave': 'mouseleave',
		'change input' : 'selectChanged',
		'keyup input' : 'selectChanged',
		'click .pbs-color-preview': 'togglePicker',
		'mousedown .iris-square-handle': 'mousedownPicker',
		'mouseup .iris-square-handle': 'mouseupPicker'
	},

	initialize: function(options) {
		// _.extend(this, _.pick(options, 'optionSettings'));
		this.optionSettings = _.clone( options.optionSettings );
		this.randomID = this.optionSettings.id + '-' + _.random(0, 10000);

		if ( this.optionSettings.value ) {
			this.model.set( this.optionSettings.id, this.optionSettings.value( this.model.get('element') ) );
		}

		this._hidePickerBound = this.hidePicker.bind(this);
		document.querySelector('.ct-toolbox').addEventListener('mouseleave', this._hidePickerBound);

		if ( this.optionSettings.initialize ) {
			this.optionSettings.initialize( this.model.get('element'), this );
		}

		this._canApplyUpdater();
	},

	_canApplyUpdater: function() {
		this.el.classList.remove( 'ct-tool--disabled' );
		if ( this.optionSettings.canApply ) {
			if ( ! this.optionSettings.canApply( this.model.get('element'), this ) ) {
				this.el.classList.add( 'ct-tool--disabled' );
			}
		}
	},

	updateColor: function( color ) {
		if ( this.el.querySelector('.pbs-color-preview').style.background !== color ) {
			this.el.querySelector('.pbs-color-preview').style.background = color;
			this.el.querySelector('input').value = color;
			jQuery( '#' + this.randomID ).iris( 'color', color );
		}
	},

	updateTooltip: function( value ) {
		if ( ! value ) {
			if ( this.optionSettings.value ) {
				value = this.optionSettings.value( this.model.get('element' ) );
			} else if ( this.optionSettings.id ) {
				value = this.model.get( this.optionSettings.id );
			}
		}
		if ( window.PBSEditor.isCtrlDown && window.PBSEditor.isShiftDown ) {
			if ( this.optionSettings['tooltip-reset'] ) {
				this.el.setAttribute( 'data-tooltip', this.optionSettings['tooltip-reset'].replace( '{0}', value ) );
				return;
			}
		} else if ( window.PBSEditor.isCtrlDown ) {
			if ( this.optionSettings['tooltip-down'] ) {
				this.el.setAttribute( 'data-tooltip', this.optionSettings['tooltip-down'].replace( '{0}', value ) );
				return;
			}
		} else {
			if ( this.optionSettings.tooltip ) {
				this.el.setAttribute( 'data-tooltip', this.optionSettings.tooltip.replace( '{0}', value ) );
				return;
			}
		}
		if ( this.optionSettings.tooltip ) {
			this.el.setAttribute( 'data-tooltip', this.optionSettings.tooltip );
		} else if ( this.optionSettings.name ) {
			this.el.setAttribute( 'data-tooltip', this.optionSettings.name );
		}
	},

	render: function() {
		var data = _.extend( {}, this.model.attributes, this.optionSettings );
		data.id = this.randomID;

		if ( this.optionSettings.value ) {
			data.value = this.optionSettings.value( this.model.get('element' ) );
		} else if ( this.optionSettings.id ) {
			data.value = this.model.get( this.optionSettings.id );
		}

	    this.$el.html( this.template( data ) );
		this.el.classList.add( 'pbs-button' );

		this.updateTooltip( data.value );

		var _this = this;
		jQuery( '#' + this.randomID ).iris({
			// or in the data-default-color attribute on the input
			defaultColor: true,
			// a callback to fire whenever the color changes to a valid color
			change: function(){
				// Change fires when Iris initializes, prevent change calls.
				if ( ! _this._justInit ) {
					_this._justInit = true;
					return;
				}
				_this.selectChanged();
			},
			// a callback to fire when the input is emptied or an invalid color
			clear: function() {},
			// hide the color picker controls on load
			hide: false,
			// Add our own pretty colors
			palettes: [ '#000', '#fff', '#CF000F', '#D2527F', '#F89406', '#F9BF3B', '#2ECC71', '#19B5FE', '#8E44AD' ]
		});

		this._canApplyUpdater();

	    return this;
	},

	remove: function(){
		jQuery('#' + this.randomID).iris('destroy');
		document.querySelector('.ct-toolbox').removeEventListener('mouseleave', this._hidePickerBound);
        Backbone.View.prototype.remove.apply(this, arguments);
    },

	selectChanged: function( forceColor ) {
		var input = this.el.querySelector('input');
		var color = jQuery( input ).iris( 'color' );

		if ( forceColor ) {
			color = input.value;
		}

		if ( input.value === '' || input.value === 'transparent' ) {
			color = input.value;
		}

		if ( this.optionSettings.change ) {
			this.optionSettings.change( this.model.get('element'), color, this );
		}
		if ( this.optionSettings.id ) {
			this.model.set( this.optionSettings.id, color );
		}

		if ( color === 'transparent' ) {
			color = '';
		}
		this.el.querySelector('.pbs-color-preview').style.background = color;
	},

	togglePicker: function() {

		// Remove the current image with shift+ctrl+click
		if ( window.PBSEditor.isCtrlDown && window.PBSEditor.isShiftDown ) {
			var input = this.el.querySelector('input');
			input.value = '';
			this.selectChanged();

			jQuery( '#' + this.randomID ).iris( 'color', 'transparent' );
			return;
		}

		var popup = this.el.querySelector('.pbs-color-popup');
		var otherPopups = document.querySelectorAll( '.pbs-color-popup' );
		Array.prototype.forEach.call( otherPopups, function( el ) {
			if ( el !== popup ) {
				el.style.display = '';
			}
		} );

		if ( popup.style.display === 'block' ) {
			popup.style.display = '';
		} else {
			// Let others know that we're going to open a popup.
			wp.hooks.doAction( 'pbs.tool.popup.open' );
			popup.style.display = 'block';
		}

		// Close popup if other popups open.
		wp.hooks.addAction( 'pbs.tool.popup.open', function() {
			popup.style.display = '';
		}.bind(this));
	},

	hidePicker: function() {
		this.el.querySelector('.pbs-color-popup').style.display = '';
	},

	mouseenter: function() {
		if ( this.optionSettings.mouseenter ) {
			this.optionSettings.mouseenter( this.model.get('element'), this );
		}
		this._tooltipUpdaterInterval = setInterval( this.updateTooltip.bind(this), 100 );
	},

	mouseleave: function() {
		if ( this.optionSettings.mouseleave ) {
			this.optionSettings.mouseleave( this.model.get('element'), this );
		}
		clearInterval( this._tooltipUpdaterInterval );
	},

	mousedownPicker: function() {
        ContentTools.EditorApp.get().history.stopWatching();
	},

	mouseupPicker: function() {
        ContentTools.EditorApp.get().history.watch();
	}
});


PBSOption.ColorButton = PBSOption.Color.extend({});


PBSOption.Select = Backbone.View.extend({
	template: wp.template( 'pbs-option-select' ),

	events: {
		'change select' : 'selectChanged'
	},

	initialize: function(options) {
		// _.extend(this, _.pick(options, 'optionSettings'));
		this.optionSettings = _.clone( options.optionSettings );

		this.listenTo( this.model, 'change', this.render );
		if ( this.optionSettings.value ) {
			this.model.set( this.optionSettings.id, this.optionSettings.value( this.model.get('element') ) );
		} else {
			var value = this.model.element.model.attributes[ this.optionSettings.id ] || '';
			this.model.set( this.optionSettings.id, value );
		}
		if ( this.optionSettings.initialize ) {
			this.optionSettings.initialize( this.model.get('element'), this );
		}
	},

	render: function() {
		var data = _.extend( {}, this.model.attributes, this.optionSettings );
		if ( this.optionSettings.value ) {
			data.value = this.optionSettings.value( this.model.get('element' ), this );
		} else {
			data.value = this.model.element.model.attributes[ this.optionSettings.id ] || '';
		}
	    this.$el.html( this.template( data ) );
	    return this;
	},

	selectChanged: function(e) {
		if ( this.optionSettings.change ) {
			this.optionSettings.change( this.model.get('element'), e.target.value, this );
		}
		this.model.set( this.optionSettings.id, e.target.value );
	}
});


PBSOption.Checkbox = Backbone.View.extend({
	template: wp.template( 'pbs-option-checkbox' ),

	events: {
		'change input' : 'selectChanged',
		// 'click input' : 'click'
	},

	initialize: function(options) {
		this.optionSettings = _.clone( options.optionSettings );

		if ( this.optionSettings.initialize ) {
			this.optionSettings.initialize( this.model.get('element'), this );
		}

		this.listenTo( this.model, 'change', this.render );
		if ( this.optionSettings.value ) {
			this.model.set( this.optionSettings.id, this.optionSettings.value( this.model.get('element') ) );
		}
	},

	render: function() {
		var data = _.extend( {}, this.model.attributes, this.optionSettings );
		data.value = '';

		if ( this.optionSettings.value ) {
			data.value = this.optionSettings.value( this.model.get('element' ) );
		} else if ( this.optionSettings.id ) {
			data.value = this.model.get( this.optionSettings.id );
		}

		// Add the template if it doesn't exist yet.
    	this.$el.html( this.template( data ) );
	    return this;
	},

	selectChanged: function(e) {
		var value = false;
		if ( this.optionSettings.unchecked ) {
			value = this.optionSettings.unchecked;
		}
		if ( e.target.checked ) {
			value = true;
			if ( this.optionSettings.checked ) {
				value = this.optionSettings.checked;
			}
		}
		if ( this.optionSettings.change ) {
			this.optionSettings.change( this.model.get('element'), value );
		}
		this.model.set( this.optionSettings.id, value );
	},

	click: function(e) {
		if ( this.optionSettings.click ) {
			this.optionSettings.click( this.model.get('element'), e.target.value );
		}
	}
});


PBSOption.Text = Backbone.View.extend({
	template: wp.template( 'pbs-option-text' ),

	events: {
		'change input' : 'selectChanged',
		'keyup input' : 'selectChanged',
		'click input' : 'click'
	},

	initialize: function(options) {
		this.optionSettings = _.clone( options.optionSettings );

		if ( this.optionSettings.initialize ) {
			this.optionSettings.initialize( this.model.get('element'), this );
		}

		this.listenTo( this.model, 'change', this.render );
		if ( this.optionSettings.value ) {
			this.model.set( this.optionSettings.id, this.optionSettings.value( this.model.get('element') ) );
		}
	},

	render: function() {
		var data = _.extend( {}, this.model.attributes, this.optionSettings );
		data.value = '';

		if ( this.optionSettings.value ) {
			data.value = this.optionSettings.value( this.model.get('element' ) );
		} else if ( this.optionSettings.id ) {
			data.value = this.model.get( this.optionSettings.id );
		}

		// Add the template if it doesn't exist yet.
		if ( ! this.$el.html() ) {
	    	this.$el.html( this.template( data ) );
		// If it exists, only update the value so that we don't lose focus on the field.
		} else if ( this.$el.find( 'input[type="text"]' ).val() !== data.value ) {
			this.$el.find( 'input[type="text"]' ).val( data.value );
		}
	    return this;
	},

	selectChanged: function(e) {
		if ( this.optionSettings.change ) {
			this.optionSettings.change( this.model.get('element'), e.target.value, this );
		}
		this.model.set( this.optionSettings.id, e.target.value );
	},

	click: function(e) {
		if ( this.optionSettings.click ) {
			this.optionSettings.click( this.model.get('element'), e.target.value );
		}
	}
});



PBSOption.Textarea = PBSOption.Text.extend({
	template: wp.template( 'pbs-option-textarea' ),

	events: {
		'change textarea' : 'selectChanged',
		'keyup textarea' : 'selectChanged',
		'click textarea' : 'click'
	}
} );

PBSOption.Number = PBSOption.Text.extend({});


PBSOption.MarginsAndPaddings = Backbone.View.extend({
	template: wp.template( 'pbs-option-margins-and-paddings' ),

	events: {
		'keyup input' : 'inputChanged',
		'change input': 'inputChanged',
		'blur input': 'fixBlankValue',
		'keydown input': 'incrementDecrementValue'
	},

	initialize: function(options) {
		// _.extend(this, _.pick(options, 'optionSettings'));
		this.optionSettings = _.clone( options.optionSettings );
		this.listenTo( this.model, 'change', this.render );
	},

	render: function() {

		var element = this.model.get('element')._domElement;
		var styles = window.getComputedStyle( element );
		var stylesToAdd = [
			'margin-top', 'margin-right', 'margin-bottom', 'margin-left',
			'border-top-width', 'border-right-width', 'border-bottom-width', 'border-left-width',
			'padding-top', 'padding-right', 'padding-bottom', 'padding-left'
		];

		for ( var i = 0; i < stylesToAdd.length; i++ ) {
			// Use the inline style if set, else use the computed style.
			if ( element.style[ stylesToAdd[ i ] ] ) {
				this.model.set( stylesToAdd[ i ], element.style[ stylesToAdd[ i ] ], { silent: true } );
			} else {
				this.model.set( stylesToAdd[ i ], styles[ stylesToAdd[ i ] ], { silent: true } );
			}
		}

		// Only disable stuff for the currently selected row, the width data comes from the main/parent row.
		if ( element.getAttribute('data-width') === 'full-width-retain-content' || element.getAttribute('data-width') === 'full-width' ) {
			if ( this.model.get('width') === 'full-width-retain-content' ) {
				this.model.set('disableHorizontalPaddings', true );
			} else {
				this.model.unset('disableHorizontalPaddings' );
			}
			if ( this.model.get('width') === 'full-width-retain-content' || this.model.get('width') === 'full-width' ) {
				this.model.set('disableHorizontalMargins', true );
			} else {
				this.model.unset('disableHorizontalMargins' );
			}
		} else {
			this.model.unset('disableHorizontalPaddings' );
			this.model.unset('disableHorizontalMargins' );
		}

		var data = _.extend( {}, this.model.attributes, this.optionSettings );
	    this.$el.html( this.template( data ) );
	    return this;
	},

	inputChanged: function(e) {
		var value = e.target.value;
		var styleName = e.target.getAttribute('data-style');
		if ( ! isNaN( value ) && value.trim() !== '' ) {
			value = value + 'px';
		}
		this.model.get('element').style( styleName, value );
		this.model.set( styleName, value, {silent: true} );
	},

	incrementDecrementValue: function(e) {
		var regex = /^(\-?\d+)([^\d]*)$/;
		var match = regex.exec( e.target.value );
		if ( match && ( e.which === 38 || e.which === 40 ) ) {
			if ( e.which === 38 ) {
				match[1]++;
				if ( e.ctrlKey || e.metaKey || e.shiftKey ) {
					match[1]++;
					match[1]++;
					match[1]++;
					match[1]++;
				}
			} else {
				match[1]--;
				if ( e.ctrlKey || e.metaKey || e.shiftKey ) {
					match[1]--;
					match[1]--;
					match[1]--;
					match[1]--;
				}
			}
			e.target.value = match[1] + match[2];

			// Fire the change
			e.target.dispatchEvent( new CustomEvent( 'change' ) );
		}
	},

	fixBlankValue: function(e) {
		// Update the text input.
		var style = e.target.getAttribute('data-style');
		var styleCamel = style.replace( /-([a-z])/g, function (m, w) {
		    return w.toUpperCase();
		});

		// Get the inline style.
		var cssValue = this.model.get('element')._domElement.style[ styleCamel ];

		// If inline style isn't available, get the computed style.
		if ( ! cssValue ) {
			var values = window.getComputedStyle( this.model.get('element')._domElement );
			cssValue = values[ style ];
		}

		e.target.value = cssValue;
		this.model.set( style, cssValue, {silent: true} );
	}

});



PBSOption.CustomClass = Backbone.View.extend({
	template: wp.template( 'pbs-option-text' ),

	events: {
		'change input' : 'selectChanged',
		'keyup input' : 'selectChanged'
	},

	getClasses: function() {
		var element = this.model.get('element');
		if ( typeof element.attr( 'class' ) === 'undefined' ) {
			return '';
		}

		var classes = element.attr( 'class' );

		// Allow regex matched classes from being edited.
		if ( this.optionSettings.ignoredClasses ) {
			var currentClasses = classes.trim().split( ' ' );
			classes = '';
			this.staticClasses = [];
			var staticClassRegex = new RegExp( this.optionSettings.ignoredClasses, 'i' );
			for ( var i = 0; i < currentClasses.length; i++ ) {
				if ( staticClassRegex.test( currentClasses[ i ] ) ) {
					this.staticClasses.push( currentClasses[ i ] );
				} else {
					classes += classes.length === 0 ? '' : ' ';
					classes += currentClasses[ i ];
				}
			}
		}

		return classes;
	},

	change: function( element, value ) {
		var i;
		value = value.toLowerCase();

		// Remove all class names.
		if ( typeof element.attr( 'class' ) !== 'undefined' ) {
			var currentClasses = element.attr( 'class' ).split( ' ' );
			for ( i = 0; i < currentClasses.length; i++ ) {
				element.removeCSSClass( currentClasses[ i ] );
			}
		}

		// Add the new class names.
		if ( value.trim() !== '' ) {
			var newClasses = value.trim().split( ' ' );
			for ( i = 0; i < newClasses.length; i++ ) {
				element.addCSSClass( newClasses[ i ] );
			}
		}

		// If there are regex matched class names, add them again.
		if ( this.staticClasses.length ) {
			for ( i = 0; i < this.staticClasses.length; i++ ) {
				element.addCSSClass( this.staticClasses[ i ] );
			}
		}

		element.taint();
	},

	initialize: function(options) {
		// _.extend(this, _.pick(options, 'optionSettings'));
		this.optionSettings = _.clone( options.optionSettings );
		this.staticClasses = [];

		if ( this.optionSettings.initialize ) {
			this.optionSettings.initialize( this.model.get('element'), this );
		}

		this.listenTo( this.model, 'change', this.render );
		this.model.set( this.optionSettings.id, this.getClasses( this.model.get('element') ) );
	},

	render: function() {
		var data = _.extend( {}, this.model.attributes, this.optionSettings );
		data.value = this.getClasses( this.model.get('element' ) );
	    this.$el.html( this.template( data ) );
	    return this;
	},

	selectChanged: function(e) {
		this.change( this.model.get('element'), e.target.value );
		this.model.set( this.optionSettings.id, e.target.value );
	}
});


PBSOption.CustomID = Backbone.View.extend({
	template: wp.template( 'pbs-option-text' ),

	events: {
		'change input' : 'selectChanged',
		'keyup input' : 'selectChanged'
	},

	getID: function() {
		var element = this.model.get('element');
		if ( typeof element.attr( 'id' ) === 'undefined' ) {
			return '';
		}

		return element.attr( 'id' );
	},

	change: function( element, value ) {
		element.attr( 'id', value );
		element.taint();
	},

	initialize: function(options) {
		// _.extend(this, _.pick(options, 'optionSettings'));
		this.optionSettings = _.clone( options.optionSettings );
		this.staticClasses = [];

		if ( this.optionSettings.initialize ) {
			this.optionSettings.initialize( this.model.get('element'), this );
		}

		this.listenTo( this.model, 'change', this.render );
		this.model.set( this.optionSettings.id, this.getID( this.model.get('element') ) );
	},

	render: function() {
		var data = _.extend( {}, this.model.attributes, this.optionSettings );
		data.value = this.getID( this.model.get('element' ) );
	    this.$el.html( this.template( data ) );
	    return this;
	},

	selectChanged: function(e) {
		this.change( this.model.get('element'), e.target.value );
		this.model.set( this.optionSettings.id, e.target.value );
	}
});



/* globals PBSEditor, pbsParams */



window.pbsAddInspector( 'Icon', {

	'label': 'Icon',

	'options': [

		{

			'name': pbsParams.labels.choose_icon,

			'tooltip': pbsParams.labels.choose_icon,

			'type': 'button',

			'class': 'ct-tool--icon',

			'click': function( element ) {

				PBSEditor.iconFrame.open({

					title: pbsParams.labels.choose_icon,

					button: pbsParams.labels.choose_icon,

					successCallback: function( frameView ) {

						element.change( frameView.selected.firstChild );

					}

				});

			}

		},

		{

			'tooltip': pbsParams.labels.change_icon_color,

			'tooltip-reset': pbsParams.labels.reset_icon_color,

			'type': 'colorButton',

			'initialize': function( element, view ) {

				view.listenTo( view.model, 'change:fill', view.optionSettings.modelChanged );

			},

			'modelChanged': function() {

				this.updateColor( this.model.get( 'element' )._domElement.style.fill );

			},

			'value': function( element ) {

				return element._domElement.style.fill;

			},

			'change': function( element, value, view ) {

				element.style( 'fill', value );

				view.model.set( 'fill', value );

			}

		},

		{

			'name': pbsParams.labels.increase_size,

			'tooltip': pbsParams.labels.increase_size + ' {0}',

			'tooltip-down': pbsParams.labels.decrease_size + ' {0}',

			'tooltip-reset': pbsParams.labels.reset_size,

			'type': 'button',

			'class': 'ct-tool--font-up',

			'initialize': function( element, view ) {

				view.listenTo( view.model, 'change:width', view.render );

			},

			'tooltipValue': function ( element ) {

				return element._domElement.style.width;

			},

			'isApplied': function ( element ) {

				return element._domElement.style.width;

			},

			'click': function( element, view ) {

				var margin = element._domElement.style.width;



				var defaultMargin = parseInt( element.defaultStyle( 'width' ), 10 );

				if ( margin === '' ) {

					margin = defaultMargin;

				} else {

					margin = parseInt( margin, 10 );

				}



				if ( window.PBSEditor.isCtrlDown && window.PBSEditor.isShiftDown ) {

					margin = defaultMargin;

				} else if ( window.PBSEditor.isCtrlDown ) {

					margin--;

				} else {

					margin++;

				}



				if ( margin === defaultMargin ) {

					margin = '';

				} else {

					margin += 'px';

				}



				element.style( 'width', margin );

				element.style( 'height', margin );

				view.model.set( 'width', margin );

				view.model.set( 'height', margin );

			},

			'hold': function( element, view ) {

				view.optionSettings.click( element, view );

			}

		}

	]

} );


/* globals pbsParams */

window.pbsAddInspector('pbs_widget', {
	'label': pbsParams.labels.widget,
	'desc': pbsParams.labels.widget_inspector_desc,
	'options': [
		{
			'type': 'widgetSettings'
		}
	]
});


window.pbsAddInspector('divider_advanced', {
	'label': 'Champion - Advanced Divider Line',
	'desc': 'A more customizable divider.',
	'options': [
		{
			'name': 'Color',
			'type': 'color',
			'id': 'color',
			'desc': 'The divider&apos;s color',
			'default': ''
		},
		{
			'name': 'Top Padding',
			'type': 'text',
			'id': 'paddingtop',
			'desc': 'in px',
			'default': '20'
		},
		{
			'name': 'Bottom Padding',
			'type': 'text',
			'id': 'paddingbottom',
			'desc': 'in px',
			'default': 'false'
		},
		{
			'name': 'Thickness',
			'type': 'text',
			'id': 'thickness',
			'desc': 'in px',
			'default': 'false'
		},
		{
			'name': 'Width',
			'type': 'text',
			'id': 'width',
			'desc': 'add units, e.g. px or %',
			'default': 'false'
		},
		{
			'name': 'Go to top link',
			'type': 'checkbox',
			'id': 'top',
			'checked': 'true',
			'unchecked': 'false',
			'default': 'false'
		}
	]
});

window.pbsAddInspector('divider_arrow', {
	'label': 'Champion - Divider Arrow',
	'desc': 'A customizable divider with arrows.',
	'options': [
		{
			'name': 'Color',
			'type': 'color',
			'id': 'color',
			'desc': 'The divider&apos;s color',
			'group': 'Colors',
			'default': ''
		},
		{
			'name': 'Background Color',
			'type': 'color',
			'id': 'bgcolor',
			'desc': 'The divider&apos;s background color',
			'group': 'Colors',
			'default': ''
		},
		{
			'name': 'Arrow Width Left',
			'type': 'text',
			'id': 'widthleft',
			'desc': 'in px',
			'group': 'Arrow',
			'default': ''
		},
		{
			'name': 'Arrow Width Right',
			'type': 'text',
			'id': 'widthright',
			'desc': 'in px',
			'group': 'Arrow',
			'default': ''
		},
		{
			'name': 'Arrow Height',
			'type': 'text',
			'id': 'height',
			'desc': 'in px',
			'group': 'Arrow',
			'default': '30'
		},
		{
			'name': 'Arrow Horizontal Position',
			'type': 'text',
			'id': 'horizontal',
			'desc': 'add units, e.g. px or %',
			'group': 'Arrow',
			'default': ''
		},
		{
			'name': 'Arrow Offset',
			'type': 'text',
			'id': 'offset',
			'desc': 'in px',
			'group': 'Arrow',
			'default': ''
		},
		{
			'name': 'Arrow Type',
			'type': 'select',
			'id': 'arrow',
			'options': {
				'down': 'Down Arrow',
				'up': 'Up Arrow'
			},
			'desc': 'The direction of the arrow',
			'group': 'Arrow',
			'default': 'down'
		},
		{
			'name': 'Divider Line Thickness',
			'type': 'text',
			'id': 'thickness',
			'desc': 'in px',
			'group': 'Line',
			'default': ''
		},
		{
			'name': 'Divider Line Color',
			'type': 'color',
			'id': 'linecolor',
			'desc': '',
			'group': 'Line',
			'default': '',
			'depends': [
				{
					'id': 'thickness',
					'value': '__not_empty'
				}
			]
		},
		{
			'name': 'Optional Class',
			'type': 'text',
			'id': 'class',
			'desc': '',
			'group': 'Advanced',
			'default': ''
		},
		{
			'name': 'Visible Screen Size',
			'type': 'select',
			'id': 'visible',
			'options': {
				'all': 'All',
				'320': '0-320',
				'480': '0-480',
				'568': '0-568',
				'768': '0-768',
				'980': '0-980',
				'-480': '480-all',
				'-568': '568-all',
				'-768': '768-all',
				'-980': '980-all'
			},
			'desc': '',
			'group': 'Advanced',
			'default': 'all'
		}
	]
});

/* globals pbsParams */

window.pbsAddInspector('pbs_sidebar', {
	'label': pbsParams.labels.sidebar,
	'desc': pbsParams.labels.sidebar_inspector_desc,
	'options': [
		{
			'type': 'select',
			'name': pbsParams.labels.select_a_sidebar,
			'id': 'id',
			'options': pbsParams.sidebar_list,
			'desc': pbsParams.sidebar_label_id
		}
	]
});



/* globals pbsParams, PBSEditor */



window.pbsAddInspector( 'DivRow', {

	'label': pbsParams.labels.row,

	'options': [

		{

			'name': pbsParams.labels.change_row_width,

			'tooltip': pbsParams.labels.change_row_width + ': {0}',

			'tooltip-down': pbsParams.labels.change_row_width + ': {0}',

			'tooltip-reset': pbsParams.labels.reset_row_width,

			'id': 'width',

			'type': 'button',

			'class': 'pbs-button-row-width',

			'initialize': function( element, view ) {

				view.listenTo( view.model, 'change', view.render );

			},

			'getRootRow': function( element ) {

				var rootRow = element;



				// Get the root row element, we can only set the root row as full width

				var currElem = element._domElement;

				while ( currElem && currElem._ceElement ) {

					if ( currElem.classList.contains( 'pbs-row' ) ) {

						rootRow = currElem._ceElement;

					}

					currElem = currElem.parentNode;

				}



				return rootRow;

			},

			'canApply': function ( element ) {

				return wp.hooks.applyFilters( 'inspector.row.change_width.can_apply', true, element );

			},

			'tooltipValue': function ( element, view ) {

				var width = view.optionSettings.getRootRow( element )._domElement.getAttribute( 'data-width' );

				if ( width === 'full-width' ) {

					return pbsParams.labels.full_width;

				} else if ( width === 'full-width-retain-content' ) {

					return pbsParams.labels.full_width_retained_content_width;

				}

				return pbsParams.labels.normal;

			},

			'isApplied': function ( element, view  ) {

				return !! view.optionSettings.getRootRow( element )._domElement.getAttribute( 'data-width' );

			},

			'render': function( element, view ) {

				// Get the root row element, we can only set the root row as full width.

				var rootRow = view.optionSettings.getRootRow( element );



				var val = rootRow._domElement.getAttribute('data-width');

				if ( ! val ) {

					val = '';

				}



				view.el.classList.remove('full');

				view.el.classList.remove('full-retain');

				if ( val === 'full-width' ) {

					view.el.classList.add('full');

				} else if ( val === 'full-width-retain-content' ) {

					view.el.classList.add('full-retain');

				}



				// Set the model width so other views can detect the value.

				view.model.set( view.optionSettings.id, val );

			},

			'click': function( element, view ) {

				// Get the root row element, we can only set the root row as full width.

				var rootRow = view.optionSettings.getRootRow( element );



				var val = rootRow._domElement.getAttribute('data-width');

				if ( ! val ) {

					val = '';

				}



				rootRow.style('margin-left', '');

				rootRow.style('margin-right', '');

				rootRow.style('padding-left', '');

				rootRow.style('padding-right', '');



				view.el.classList.remove('full');

				view.el.classList.remove('full-retain');

				if ( window.PBSEditor.isCtrlDown && window.PBSEditor.isShiftDown ) {

					val = '';

				} else if ( window.PBSEditor.isCtrlDown ) {

					if ( val === 'full-width' ) {

						val = 'full-width-retain-content';

						view.el.classList.add('full-retain');

					} else if ( val === 'full-width-retain-content' ) {

						val = '';

					} else {

						val = 'full-width';

						view.el.classList.add('full');

					}

				} else {

					if ( val === 'full-width' ) {

						val = '';

					} else if ( val === 'full-width-retain-content' ) {

						val = 'full-width';

						view.el.classList.add('full');

					} else {

						val = 'full-width-retain-content';

						view.el.classList.add('full-retain');

					}

				}



				rootRow.attr('data-width', val);

				window._pbsFixRowWidth( rootRow._domElement );

				rootRow.taint();



				view.model.set( view.optionSettings.id, val );

			}

		},

		{

			'tooltip': pbsParams.labels.background_color,

			'tooltip-reset': pbsParams.labels.reset_background_color,

			'type': 'colorButton',

			'group': pbsParams.labels.background,

			'initialize': function( element, view ) {

				view.listenTo( view.model, 'change:background-color', view.optionSettings.modelChanged );

			},

			'modelChanged': function() {

				this.updateColor( this.model.get( 'element' )._domElement.style.backgroundColor );

			},

			'value': function( element ) {

				return element._domElement.style.backgroundColor;

			},

			'change': function( element, value, view ) {

				element.style( 'background-color', value );

				view.model.set( 'background-color', value );

				if ( pbsParams.is_lite ) {

					element.style( 'background-image', '' );

				}

				wp.hooks.doAction( 'pbs.inspector.row.color.change', element );

			}

		},

		{

			'name': pbsParams.labels.background_image,

			'tooltip': pbsParams.labels.background_image,

			'tooltip-reset': pbsParams.labels.remove_background_image,

			'type': 'button',

			'class': 'pbs-button-background-image',

			'group': pbsParams.labels.background,

			'initialize': function( element, view ) {

				view.listenTo( view.model, 'change', view.render );

			},

			'tooltipValue': function ( element, view ) {

				var value = element._domElement.style['background-image'];

				if ( value ) {

					view.el.setAttribute( 'style', 'background-image: ' + value + ' !important;' );

				} else {

					view.el.setAttribute( 'style', '' );

				}

			},

			'isApplied': function ( element ) {

				return !! element._domElement.style['background-image'];

			},

			'click': function( element, view ) {

				var imageID = element._domElement.getAttribute( 'data-bg-image-id' );



				if ( window.PBSEditor.isCtrlDown && window.PBSEditor.isShiftDown ) {

					element.style( 'background-image', '' );

					element.attr( 'data-bg-image-id', '' );

					view.model.set( 'background-image', '' );

					return;

				}



				// Remember the cursor position. We need to do this in a setTimeout since

				// options do restoreState after a click.

				setTimeout( function() {

					if ( view._selectedElement && view._selectedElement.storeState ) {

						view._selectedElement.storeState();

					}

				}, 1 );



				PBSEditor.openMediaManager( function( attachment ) {



					var currBgImage = element._domElement.style['background-image'];

					var currBgColor = element._domElement.style['background-color'];



					// If there's a linear gradient, just replace the URL in it.

					if ( currBgImage.indexOf( 'gradient' ) !== -1 && currBgColor ) {

						element.style( 'background-image', 'linear-gradient(' + currBgColor + ', ' + currBgColor + '), url(' + attachment.attributes.url + ')' );

					} else {

						element.style( 'background-image', 'url(' + attachment.attributes.url + ')' );

					}



					element.attr( 'data-bg-image-id', attachment.id );

					view.model.set( 'background-image', 'url(' + attachment.attributes.url + ')' );



					// Restore the caret position.

					if ( view._selectedElement && view._selectedElement.restoreState ) {

						view._selectedElement.restoreState();

					}



				}, imageID );

			}

		}

	]

} );





window.pbsAddInspector( 'DivCol', {

	'label': pbsParams.labels.column,

	'options': [

		{

			'tooltip': pbsParams.labels.background_color,

			'tooltip-reset': pbsParams.labels.reset_background_color,

			'type': 'colorButton',

			'group': pbsParams.labels.background,

			'initialize': function( element, view ) {

				view.listenTo( view.model, 'change:background-color', view.optionSettings.modelChanged );

			},

			'modelChanged': function() {

				this.updateColor( this.model.get( 'element' )._domElement.style.backgroundColor );

			},

			'value': function( element ) {

				return element._domElement.style.backgroundColor;

			},

			'change': function( element, value, view ) {

				element.style( 'background-color', value );

				view.model.set( 'background-color', value );

				if ( pbsParams.is_lite ) {

					element.style( 'background-image', '' );

				}

			}

		},

		{

			'name': pbsParams.labels.background_image,

			'tooltip': pbsParams.labels.background_image,

			'tooltip-reset': pbsParams.labels.remove_background_image,

			'type': 'button',

			'class': 'pbs-button-background-image',

			'group': pbsParams.labels.background,

			'initialize': function( element, view ) {

				view.listenTo( view.model, 'change', view.render );

			},

			'tooltipValue': function ( element, view ) {

				var value = element._domElement.style['background-image'];

				if ( value ) {

					view.el.setAttribute( 'style', 'background-image: ' + value + ' !important;' );

				} else {

					view.el.setAttribute( 'style', '' );

				}

			},

			'isApplied': function ( element ) {

				return !! element._domElement.style['background-image'];

			},

			'click': function( element, view ) {

				var imageID = element._domElement.getAttribute( 'data-bg-image-id' );



				if ( window.PBSEditor.isCtrlDown && window.PBSEditor.isShiftDown ) {

					element.style( 'background-image', '' );

					element.attr( 'data-bg-image-id', '' );

					view.model.set( 'background-image', '' );

					return;

				}



				// Remember the cursor position. We need to do this in a setTimeout since

				// options do restoreState after a click.

				setTimeout( function() {

					if ( view._selectedElement && view._selectedElement.storeState ) {

						view._selectedElement.storeState();

					}

				}, 1 );



				PBSEditor.openMediaManager( function( attachment ) {

					var currBgImage = element._domElement.style['background-image'];

					var currBgColor = element._domElement.style['background-color'];



					// If there's a linear gradient, just replace the URL in it.

					if ( currBgImage.indexOf( 'gradient' ) !== -1 && currBgColor ) {

						element.style( 'background-image', 'linear-gradient(' + currBgColor + ', ' + currBgColor + '), url(' + attachment.attributes.url + ')' );

					} else {

						element.style( 'background-image', 'url(' + attachment.attributes.url + ')' );

					}



					element.attr( 'data-bg-image-id', attachment.id );

					view.model.set( 'background-image', 'url(' + attachment.attributes.url + ')' );



					// Restore the caret position.

					if ( view._selectedElement && view._selectedElement.restoreState ) {

						view._selectedElement.restoreState();

					}



				}, imageID );

			}

		}

	]

} );




/* globals pbsParams */



window.pbsAddInspector( 'DivRow', {

	'label': pbsParams.labels.row,

	'options': [

		{

			'name': pbsParams.labels.increase_top_spacing,

			'tooltip': pbsParams.labels.increase_top_spacing + ' {0}',

			'tooltip-down': pbsParams.labels.decrease_top_spacing + ' {0}',

			'tooltip-reset': pbsParams.labels.reset_top_spacing,

			'type': 'button',

			'class': 'pbs-button-row-margin-top-increase',

			'group': pbsParams.labels.spacing,

			'initialize': function( element, view ) {

				view.listenTo( view.model, 'change:margin-top', view.render );

			},

			'tooltipValue': function ( element ) {

				return element._domElement.style['margin-top'];

			},

			'canApply': function ( element ) {

				return wp.hooks.applyFilters( 'inspector.row.add_top_spacing.can_apply', true, element );

			},

			'isApplied': function ( element ) {

				return element._domElement.style['margin-top'];

			},

			'click': function( element, view ) {

				var margin = element._domElement.style['margin-top'];



				view.el.classList.remove( 'ct-tool--applied' );



				var defaultMargin = parseInt( element.defaultStyle( 'margin-top' ), 10 );

				if ( margin === '' ) {

					margin = defaultMargin;

				} else {

					margin = parseInt( margin, 10 );

				}



				if ( window.PBSEditor.isCtrlDown && window.PBSEditor.isShiftDown ) {

					margin = defaultMargin;

				} else if ( window.PBSEditor.isCtrlDown ) {

					margin--;

				} else {

					margin++;

				}



				if ( margin === defaultMargin ) {

					margin = '';

				} else {

					margin += 'px';

				}



				element.style( 'margin-top', margin );

				view.model.set( 'margin-top', margin );

			},

			'hold': function( element, view ) {

				view.optionSettings.click( element, view );

			}

		},

		{

			'name': pbsParams.labels.increase_bottom_spacing,

			'tooltip': pbsParams.labels.increase_bottom_spacing + ' {0}',

			'tooltip-down': pbsParams.labels.decrease_bottom_spacing + ' {0}',

			'tooltip-reset': pbsParams.labels.reset_bottom_spacing,

			'type': 'button',

			'class': 'pbs-button-row-margin-bottom-increase',

			'group': pbsParams.labels.spacing,

			'initialize': function( element, view ) {

				view.listenTo( view.model, 'change:margin-bottom', view.render );

			},

			'tooltipValue': function ( element ) {

				return element._domElement.style['margin-bottom'];

			},

			'canApply': function ( element ) {

				return wp.hooks.applyFilters( 'inspector.row.add_bottom_spacing.can_apply', true, element );

			},

			'isApplied': function ( element ) {

				return element._domElement.style['margin-bottom'];

			},

			'click': function( element, view ) {

				var margin = element._domElement.style['margin-bottom'];



				view.el.classList.remove( 'ct-tool--applied' );



				var defaultMargin = parseInt( element.defaultStyle( 'margin-bottom' ), 10 );

				if ( margin === '' ) {

					margin = defaultMargin;

				} else {

					margin = parseInt( margin, 10 );

				}



				if ( window.PBSEditor.isCtrlDown && window.PBSEditor.isShiftDown ) {

					margin = defaultMargin;

				} else if ( window.PBSEditor.isCtrlDown ) {

					margin--;

				} else {

					margin++;

				}



				if ( margin === defaultMargin ) {

					margin = '';

				} else {

					margin += 'px';

				}



				element.style( 'margin-bottom', margin );

				view.model.set( 'margin-bottom', margin );

			},

			'hold': function( element, view ) {

				  view.optionSettings.click( element, view );

			}

		},

		{

			'name': pbsParams.labels.increase_top_thickness,

			'tooltip': pbsParams.labels.increase_top_thickness + ' {0}',

			'tooltip-down': pbsParams.labels.decrease_top_thickness + ' {0}',

			'tooltip-reset': pbsParams.labels.reset_top_thickness,

			'type': 'button',

			'class': 'pbs-button-row-padding-top',

			'group': pbsParams.labels.row_thickness,

			'initialize': function( element, view ) {

				view.listenTo( view.model, 'change:margin-top', view.render );

			},

			'tooltipValue': function ( element ) {

				return element._domElement.style['padding-top'];

			},

			'isApplied': function ( element ) {

				return element._domElement.style['padding-top'];

			},

			'click': function( element, view ) {

				var padding = element._domElement.style['padding-top'];



				view.el.classList.remove( 'ct-tool--applied' );



				var defaultPadding = parseInt( element.defaultStyle( 'padding-top' ), 10 );

				if ( padding === '' ) {

					padding = defaultPadding;

				} else {

					padding = parseInt( padding, 10 );

				}



				if ( window.PBSEditor.isCtrlDown && window.PBSEditor.isShiftDown ) {

					padding = defaultPadding;

				} else if ( window.PBSEditor.isCtrlDown ) {

					padding -= 5;

				} else {

					padding += 5;

				}



				if ( padding === defaultPadding ) {

					padding = '';

				} else {

					padding += 'px';

				}



				element.style( 'padding-top', padding );

				view.model.set( 'padding-top', padding );

			},

			'hold': function( element, view ) {

				  view.optionSettings.click( element, view );

			}

		},

		{

			'name': pbsParams.labels.increase_bottom_thickness,

			'tooltip': pbsParams.labels.increase_bottom_thickness + ' {0}',

			'tooltip-down': pbsParams.labels.decrease_bottom_thickness + ' {0}',

			'tooltip-reset': pbsParams.labels.reset_bottom_thickness,

			'type': 'button',

			'class': 'pbs-button-row-padding-bottom',

			'group': pbsParams.labels.row_thickness,

			'initialize': function( element, view ) {

				view.listenTo( view.model, 'change:margin-bottom', view.render );

			},

			'tooltipValue': function ( element ) {

				return element._domElement.style['padding-bottom'];

			},

			'isApplied': function ( element ) {

				return element._domElement.style['padding-bottom'];

			},

			'click': function( element, view ) {

				var padding = element._domElement.style['padding-bottom'];



				view.el.classList.remove( 'ct-tool--applied' );



				var defaultPadding = parseInt( element.defaultStyle( 'padding-bottom' ), 10 );

				if ( padding === '' ) {

					padding = defaultPadding;

				} else {

					padding = parseInt( padding, 10 );

				}



				if ( window.PBSEditor.isCtrlDown && window.PBSEditor.isShiftDown ) {

					padding = defaultPadding;

				} else if ( window.PBSEditor.isCtrlDown ) {

					padding -= 5;

				} else {

					padding += 5;

				}



				if ( padding === defaultPadding ) {

					padding = '';

				} else {

					padding += 'px';

				}



				element.style( 'padding-bottom', padding );

				view.model.set( 'padding-bottom', padding );

			},

			'hold': function( element, view ) {

				  view.optionSettings.click( element, view );

			}

		},

		{

			'name': pbsParams.labels.increase_left_thickness,

			'tooltip': pbsParams.labels.increase_left_thickness + ' {0}',

			'tooltip-down': pbsParams.labels.decrease_left_thickness + ' {0}',

			'tooltip-reset': pbsParams.labels.reset_left_thickness,

			'type': 'button',

			'class': 'pbs-button-row-padding-left',

			'group': pbsParams.labels.row_thickness,

			'initialize': function( element, view ) {

				view.listenTo( view.model, 'change', view.render );

			},

			'tooltipValue': function ( element ) {

				return element._domElement.style['padding-left'];

			},

			'isApplied': function ( element ) {

				return element._domElement.style['padding-left'];

			},

			'canApply': function ( element ) {

				// Disable the button if full-width w/ restrained content width, since the padding is computed dynamically.

				if ( element._domElement.getAttribute( 'data-width' ) ) {

					if ( element._domElement.getAttribute( 'data-width' ) === 'full-width-retain-content' ) {

						return false;

					}

				}

				return true;

			},

			'click': function( element, view ) {

				var padding = element._domElement.style['padding-left'];



				view.el.classList.remove( 'ct-tool--applied' );



				var defaultPadding = parseInt( element.defaultStyle( 'padding-left' ), 10 );

				if ( padding === '' ) {

					padding = defaultPadding;

				} else {

					padding = parseInt( padding, 10 );

				}



				if ( window.PBSEditor.isCtrlDown && window.PBSEditor.isShiftDown ) {

					padding = defaultPadding;

				} else if ( window.PBSEditor.isCtrlDown ) {

					padding -= 5;

				} else {

					padding += 5;

				}



				if ( padding === defaultPadding ) {

					padding = '';

				} else {

					padding += 'px';

				}



				element.style( 'padding-left', padding );

				view.model.set( 'padding-left', padding );

			},

			'hold': function( element, view ) {

				  view.optionSettings.click( element, view );

			}

		},

		{

			'name': pbsParams.labels.increase_right_thickness,

			'tooltip': pbsParams.labels.increase_right_thickness + ' {0}',

			'tooltip-down': pbsParams.labels.decrease_right_thickness + ' {0}',

			'tooltip-reset': pbsParams.labels.reset_right_thickness,

			'type': 'button',

			'class': 'pbs-button-row-padding-right',

			'group': pbsParams.labels.row_thickness,

			'initialize': function( element, view ) {

				view.listenTo( view.model, 'change', view.render );

			},

			'tooltipValue': function ( element ) {

				return element._domElement.style['padding-right'];

			},

			'isApplied': function ( element ) {

				return element._domElement.style['padding-right'];

			},

			'canApply': function ( element ) {

				// Disable the button if full-width w/ restrained content width, since the padding is computed dynamically.

				if ( element._domElement.getAttribute( 'data-width' ) ) {

					if ( element._domElement.getAttribute( 'data-width' ) === 'full-width-retain-content' ) {

						return false;

					}

				}

				return true;

			},

			'click': function( element, view ) {

				var padding = element._domElement.style['padding-right'];



				view.el.classList.remove( 'ct-tool--applied' );



				var defaultPadding = parseInt( element.defaultStyle( 'padding-right' ), 10 );

				if ( padding === '' ) {

					padding = defaultPadding;

				} else {

					padding = parseInt( padding, 10 );

				}



				if ( window.PBSEditor.isCtrlDown && window.PBSEditor.isShiftDown ) {

					padding = defaultPadding;

				} else if ( window.PBSEditor.isCtrlDown ) {

					padding -= 5;

				} else {

					padding += 5;

				}



				if ( padding === defaultPadding ) {

					padding = '';

				} else {

					padding += 'px';

				}



				element.style( 'padding-right', padding );

				view.model.set( 'padding-right', padding );

			},

			'hold': function( element, view ) {

				  view.optionSettings.click( element, view );

			}

		}

	]

} );







window.pbsAddInspector( 'DivCol', {

	'label': pbsParams.labels.column,

	'options': [

		/*

		{

			'name': pbsParams.labels.increase_column_width,

			'tooltip': pbsParams.labels.increase_column_width + ' {0}',

			'tooltip-down': pbsParams.labels.decrease_column_width + ' {0}',

			'tooltip-reset': pbsParams.labels.reset_column_width,

			'type': 'button',

			'class': 'pbs-button-col-width-increase',

			'group': pbsParams.labels.spacing_and_widths,

			'initialize': function( element, view ) {

				view.listenTo( view.model, 'change', view.render );

			},

			'tooltipValue': function ( element ) {

				return element._domElement.style['flex-grow'];

			},

			'canApply': function( element ) {

				var col = element;

				while ( col.constructor.name !== 'DivCol' ) {

					col = col.parent();

				}

				return col.parent()._domElement.children.length > 1;

			},

			'isApplied': function ( element ) {

				return !! element._domElement.style['flex-grow'];

			},

			'click': function( element, view ) {

				var value = element._domElement.style['flex-grow'];



				if ( value === '' ) {

					value = parseInt( parseFloat( element.defaultStyle( 'flex-grow' ) ) * 10, 10 );

				} else {

					value = parseInt( parseFloat( value ) * 10, 10 );

				}



				if ( window.PBSEditor.isCtrlDown && window.PBSEditor.isShiftDown ) {

					value = parseInt( parseFloat( element.defaultStyle( 'flex-grow' ) ) * 10, 10 );

				} else if ( window.PBSEditor.isCtrlDown ) {

					value -= 1;

				} else {

					value += 1;

				}

				value /= 10;



				var defaultValue = parseInt( parseFloat( element.defaultStyle( 'flex-grow' ) ) * 10, 10 ) / 10;

				if ( value === defaultValue ) {

					value = '';

				}



				element.style( 'flex-grow', value );

				view.model.set( 'flex-grow', value );

			},

			'hold': function( element, view ) {

				  view.optionSettings.click( element, view );

			}

		},

		*/

		// {

		// 	'name': 'Column Width Decrease',

		// 	'type': 'button',

		// 	'class': 'pbs-button-col-width-decrease',

		// 	'group': pbsParams.labels.spacing_and_widths

		// 	'initialize': function( element, view ) {

		// 		view.listenTo( view.model, 'change', view.render );

		// 	},

		// 	'render': function( element, view ) {

		// 		var value = element._domElement.style['flex-grow'];

		// 		view.el.classList.remove( 'ct-tool--applied' );

		//

		// 		if ( value ) {

		// 			view.el.classList.add( 'ct-tool--applied' );

		// 			view.el.setAttribute( 'data-tooltip', this.name + ': ' + value );

		// 		} else {

		// 			view.el.setAttribute( 'data-tooltip', this.name );

		// 		}

		// 	},

		// 	'click': function( element, view ) {

		// 		var value = element._domElement.style['flex-grow'];

		//

		// 		view.el.classList.remove( 'ct-tool--applied' );

		//

		// 		if ( value === '' ) {

		// 			value = parseInt( parseFloat( element.defaultStyle( 'flex-grow' ) ) * 10, 10 );

		// 		} else {

		// 			value = parseInt( parseFloat( value ) * 10, 10 );

		// 		}

		//

		// 		if ( value > 2 ) {

		// 			value -= 1;

		// 		}

		// 		value /= 10;

		//

		// 		var defaultValue = parseInt( parseFloat( element.defaultStyle( 'flex-grow' ) ) * 10, 10 ) / 10;

		// 		if ( value === defaultValue ) {

		// 			value = '';

		// 		}

		//

		// 		element.style( 'flex-grow', value );

		// 		view.model.set( 'flex-grow', value );

		//

		// 		// Update the tooltip.

		// 		if ( value ) {

		// 			view.el.classList.add( 'ct-tool--applied' );

		// 			view.el.setAttribute( 'data-tooltip', this.name + ': ' + value );

		// 		} else {

		// 			view.el.setAttribute( 'data-tooltip', this.name );

		// 		}

		// 	},

		// 	'hold': function( element, view ) {

		// 		  view.optionSettings.click( element, view );

		// 	},

		// 	'mouseenter': function( element, view ) {

		// 		view.optionSettings.render( element, view );

		// 		element._domElement.classList.add('ce-element--over');

		// 	},

		// 	'mouseleave': function( element ) {

		// 		element._domElement.classList.remove('ce-element--over');

		// 	}

		// },

		{

			'name': pbsParams.labels.increase_horizontal_content_padding,

			'tooltip': pbsParams.labels.increase_horizontal_content_padding + ' {0}',

			'tooltip-down': pbsParams.labels.decrease_horizontal_content_padding + ' {0}',

			'tooltip-reset': pbsParams.labels.reset_horizontal_content_padding,

			'type': 'button',

			'class': 'pbs-button-col-padding-horizontal',

			'group': pbsParams.labels.spacing_and_widths,

			'initialize': function( element, view ) {

				view.listenTo( view.model, 'change:padding-left change:padding-right', view.render );

			},

			'tooltipValue': function ( element ) {

				return element._domElement.style['padding-left'];

			},

			'isApplied': function ( element ) {

				return !! element._domElement.style['padding-left'];

			},

			'click': function( element, view ) {

				var padding = element._domElement.style['padding-left'];



				var defaultPadding = parseInt( element.defaultStyle( 'padding-left' ), 10 );

				if ( padding === '' ) {

					padding = defaultPadding;

				} else {

					padding = parseInt( padding, 10 );

				}



				if ( window.PBSEditor.isCtrlDown && window.PBSEditor.isShiftDown ) {

					padding = defaultPadding;

				} else if ( window.PBSEditor.isCtrlDown ) {

					padding -= 1;

				} else {

					padding += 1;

				}



				if ( padding === defaultPadding ) {

					padding = '';

				} else {

					padding += 'px';

				}



				element.style( 'padding-left', padding );

				element.style( 'padding-right', padding );

				view.model.set( 'padding-left', padding );

				view.model.set( 'padding-right', padding );

			},

			'hold': function( element, view ) {

				view.optionSettings.click( element, view );

			}

		},

		{

			'name': pbsParams.labels.increase_vertical_content_padding,

			'tooltip': pbsParams.labels.increase_vertical_content_padding + ' {0}',

			'tooltip-down': pbsParams.labels.decrease_vertical_content_padding + ' {0}',

			'tooltip-reset': pbsParams.labels.reset_vertical_content_padding,

			'type': 'button',

			'class': 'pbs-button-col-padding-vertical',

			'group': pbsParams.labels.spacing_and_widths,

			'initialize': function( element, view ) {

				view.listenTo( view.model, 'change:padding-top change:padding-bottom', view.render );

			},

			'tooltipValue': function ( element ) {

				return element._domElement.style['padding-top'];

			},

			'isApplied': function ( element ) {

				return !! element._domElement.style['padding-top'];

			},

			'click': function( element, view ) {

				var padding = element._domElement.style['padding-top'];



				var defaultPadding = parseInt( element.defaultStyle( 'padding-top' ), 10 );

				if ( padding === '' ) {

					padding = defaultPadding;

				} else {

					padding = parseInt( padding, 10 );

				}



				if ( window.PBSEditor.isCtrlDown && window.PBSEditor.isShiftDown ) {

					padding = defaultPadding;

				} else if ( window.PBSEditor.isCtrlDown ) {

					padding -= 1;

				} else {

					padding += 1;

				}



				if ( padding === defaultPadding ) {

					padding = '';

				} else {

					padding += 'px';

				}



				element.style( 'padding-top', padding );

				element.style( 'padding-bottom', padding );

				view.model.set( 'padding-top', padding );

				view.model.set( 'padding-bottom', padding );

			},

			'hold': function( element, view ) {

				  view.optionSettings.click( element, view );

			}

		},

		{

			'name': pbsParams.labels.increase_column_gap,

			'tooltip': pbsParams.labels.increase_column_gap + ' {0}',

			'tooltip-down': pbsParams.labels.decrease_column_gap + ' {0}',

			'tooltip-reset': pbsParams.labels.reset_column_gap,

			'type': 'button',

			'class': 'pbs-button-column-gap',

			'group': pbsParams.labels.spacing_and_widths,

			'tooltipValue': function ( element ) {

				var row = element.parent();

				return row.hasColumnGap();

			},

			'isApplied': function ( element ) {

				var row = element.parent();

				return !! row.hasColumnGap();

			},

			'click': function( element, view ) {

				var row = element.parent();

				var margin = row.hasColumnGap();



				if ( row.children.length === 1 ) {

					return;

				}



				margin = parseInt( margin, 10 );

				if ( ! margin ) {

					margin = 0;

				}



				if ( window.PBSEditor.isCtrlDown && window.PBSEditor.isShiftDown ) {

					margin = 0;

				} else if ( window.PBSEditor.isCtrlDown ) {

					margin -= 1;

				} else {

					margin += 1;

				}



				if ( ! margin ) {

					margin = '';

				} else if ( margin < 0 ) {

					margin = '';

				} else {

					margin += 'px';

				}



				for ( var i = 0; i < row.children.length; i++ ) {

					if ( i < row.children.length - 1 ) {

						row.children[ i ].style( 'margin-right', margin );

					} else {

						row.children[ i ].style( 'margin-right', '' );

					}

				}



				view.model.set( 'margin-right', margin );

			},

			'hold': function( element, view ) {

				  view.optionSettings.click( element, view );

			}

		}

	]

} );


/* globals ContentEdit, pbsParams */

window.pbsAddInspector( 'DivRow', {
	'label': pbsParams.labels.row,
	'options': [
		{
			'name': pbsParams.labels.add_column,
			'type': 'button',
			'class': 'pbs-button-add-column',
			'click': function( element ) {
				var overElement = element._domElement.querySelector( '.ce-element--over' );
				if ( overElement ) {
					overElement.classList.remove('ce-element--over');
				}
				var root = ContentEdit.Root.get();
				var index = element.children.length;
				var col;
				if ( root.focused() ) {
					col = root.focused();
					while ( col.constructor.name !== 'Region' && col.constructor.name !== 'DivRow' ) {
						if ( col.constructor.name === 'DivCol' ) {
							index = element.children.indexOf( col ) + 1;
							break;
						}
						col = col.parent();
					}
				}
				col = element.addNewColumn( index );
				col.focus();
				col._domElement.classList.add('ce-element--over');
			},
			'mouseenter': function( element ) {
				element._domElement.classList.add('ce-element--over');
			},
			'mouseleave': function( element ) {
				element._domElement.classList.remove('ce-element--over');
			}
		},
		{
			'name': pbsParams.labels.clear_all_row_styles,
			'type': 'button',
			'class': 'pbs-clear-formatting',
			'click': function( element, view ) {
				var i;
				var styles = element.attr('style').replace( /(^\s*;|;\s*$)/g, '').split(';');
				var stylesToTrigger = [];
				for ( i = 0; i < styles.length; i++ ) {
					if ( styles[ i ].indexOf( ':' ) !== -1 ) {
						stylesToTrigger.push( styles[ i ].match( /\s*([^:]+)/ )[0] );
					}
				}

				element.attr( 'style', '' );
				element.attr( 'data-width', '' );

				for ( i = 0; i < stylesToTrigger.length; i++ ) {
					view.model.set( stylesToTrigger[ i ].trim(), '' );
				}
			},
			'mouseenter': function( element ) {
				element._domElement.classList.add('ce-element--over');
			},
			'mouseleave': function( element ) {
				element._domElement.classList.remove('ce-element--over');
			}
		},
		{
			'name': pbsParams.labels.clone_row,
			'type': 'button',
			'class': 'pbs-button-clone',
			'click': function( element ) {
				var newRow = element.clone();
				window._pbsFixRowWidth( newRow._domElement );
			},
			'canApply': function ( element ) {
				return wp.hooks.applyFilters( 'inspector.row.clone.can_apply', true, element );
			},
			'mouseenter': function( element ) {
				element._domElement.classList.add('ce-element--over');
			},
			'mouseleave': function( element ) {
				element._domElement.classList.remove('ce-element--over');
			}
		},
		{
			'name': pbsParams.labels.delete_row,
			'type': 'button',
			'class': 'ct-tool--remove',
			'click': function( element ) {
				element.blurIfFocused();
				var otherElement = element.nextSibling();
				if ( ! otherElement ) {
					otherElement = element.previousSibling();
				}
				element.parent().detach( element );
				if ( otherElement ) {
					otherElement.focus();
				}
			},
			'canApply': function ( element ) {
				return wp.hooks.applyFilters( 'inspector.row.delete.can_apply', true, element );
			}
		}
	]
} );


window.pbsAddInspector( 'DivCol', {
	'label': pbsParams.labels.column,
	'options': [
		{
			'name': pbsParams.labels.clear_all_column_styles,
			'type': 'button',
			'class': 'pbs-clear-formatting',
			'click': function( element, view ) {
				var existingMarginRight = element._domElement.style['margin-right'];
				var existingMarginLeft = element._domElement.style['margin-left'];
				var i;

				var styles = element.attr('style').replace( /(^\s*;|;\s*$)/g, '').split(';');
				var stylesToTrigger = [];
				for ( i = 0; i < styles.length; i++ ) {
					if ( styles[ i ].indexOf( ':' ) !== -1 ) {
						var styleName = styles[ i ].match( /\s*([^:]+)/ )[0];
						if ( styleName !== 'margin-right' && styleName !== 'margin-left' ) {
							stylesToTrigger.push( styleName );
						}
					}
				}

				element.attr( 'style', '' );

				if ( existingMarginRight ) {
					element.style( 'margin-right', existingMarginRight );
				}
				if ( existingMarginLeft ) {
					element.style( 'margin-left', existingMarginLeft );
				}

				for ( i = 0; i < stylesToTrigger.length; i++ ) {
					view.model.set( stylesToTrigger[ i ].trim(), '' );
				}
			},
			'mouseenter': function( element ) {
				element._domElement.classList.add('ce-element--over');
			},
			'mouseleave': function( element ) {
				element._domElement.classList.remove('ce-element--over');
			}
		},
		// {
		// 	'name': 'Add Column',
		// 	'type': 'button',
		// 	'class': 'pbs-button-add-column',
		// 	'click': function( element ) {
		// 		element._domElement.classList.remove('ce-element--over');
		// 		var col = element.parent().addNewColumn( element.parent().children.indexOf( element ) + 1 );
		// 		col.focus();
		// 		col._domElement.classList.add('ce-element--over');
		// 	},
		// 	'mouseenter': function( element ) {
		// 		element._domElement.classList.add('ce-element--over');
		// 	},
		// 	'mouseleave': function( element ) {
		// 		element._domElement.classList.remove('ce-element--over');
		// 	}
		// },
		{
			'name': pbsParams.labels.clone_column,
			'type': 'button',
			'class': 'pbs-button-clone',
			'click': function( element ) {
				element._domElement.classList.remove('ce-element--over');
				var col = element.clone();
				col.focus();
				col._domElement.classList.add('ce-element--over');
			},
			'mouseenter': function( element ) {
				element._domElement.classList.add('ce-element--over');
			},
			'mouseleave': function( element ) {
				element._domElement.classList.remove('ce-element--over');
			}
		},
		{
			'name': pbsParams.labels.delete_column,
			'type': 'button',
			'class': 'ct-tool--remove',
			'click': function( element ) {
				// Get the next column / element to focus on.
				var parent = element.parent();
				var parentSibling = parent.nextSibling();
				var index = parent.children.indexOf( element );
				if ( index === parent.children.length - 1 ) {
					index--;

					// Remove last column gap.
					var existingGap = parent.hasColumnGap();
					if ( existingGap ) {
						parent.children[ index ].style( 'margin-right', '' );
					}
				}

				element.blurIfFocused();
				parent.detach( element );

				// Focus on the next column. If not possible, focus on the next element.
				if ( parent ) {
					if ( parent.children.length ) {
						parent.children[ index ].focus();
					} else if ( parentSibling ) {
						parentSibling.focus();
					}
				}

				wp.hooks.doAction( 'pbs.inspector.column.delete.click', element );
			},
			'canApply': function ( element ) {
				return wp.hooks.applyFilters( 'inspector.column.delete.can_apply', true, element );
			},
			'mouseenter': function( element ) {
				element._domElement.classList.add('ce-element--over');
			},
			'mouseleave': function( element ) {
				element._domElement.classList.remove('ce-element--over');
			}
		}
	]
} );


/* globals ContentEdit, pbsParams */

window.pbsAddInspector( 'DivRow', {
	'label': pbsParams.labels.row,
	'options': [
		{
			'tooltip': pbsParams.labels.border_color,
			'tooltip-reset': pbsParams.labels.remove_border,
			'type': 'colorButton',
			'group': pbsParams.labels.borders,
			'id': 'border-color',
			'initialize': function( element, view ) {
				view.listenTo( view.model, 'change:border-color', view.optionSettings.modelChanged );
			},
			'modelChanged': function() {
				this.updateColor( this.model.get( 'element' )._domElement.style.borderColor );
			},
			'value': function( element ) {
				return element._domElement.style.borderColor;
			},
			'change': function( element, value, view ) {
				element.style( 'border-color', value );
				if ( value === 'transparent' ) {
					value = '';
				}
				if ( value ) {
					value = element._domElement.style['border-style'];
					if ( ! value || value === 'none' ) {
						value = 'solid';
						element.style( 'border-style', value );
						view.model.set( 'border-style', value );
					}
					value = element._domElement.style['border-width'];
					if ( ! value ) {
						value = '1px';
						element.style( 'border-width', value );
						view.model.set( 'border-width', value );
					}
				} else {
					element.style( 'border-style', '' );
					view.model.set( 'border-style', '' );
					element.style( 'border-width', '' );
					view.model.set( 'border-width', '' );
				}
			}
		},
		{
			'name': pbsParams.labels.border_style,
			'tooltip': pbsParams.labels.border_style + ' {0}',
			'tooltip-down': pbsParams.labels.border_style + ' {0}',
			'tooltip-reset': pbsParams.labels.remove_border,
			'type': 'button',
			'class': 'pbs-button-col-border-style',
			'group': pbsParams.labels.borders,
			'initialize': function( element, view ) {
				view.listenTo( view.model, 'change:border-style', view.render );
			},
			'tooltipValue': function ( element ) {
				return element._domElement.style['border-style'];
			},
			'isApplied': function ( element ) {
				return !! element._domElement.style['border-style'];
			},
			'click': function( element, view ) {
				var value = element._domElement.style['border-style'];

				if ( window.PBSEditor.isCtrlDown && window.PBSEditor.isShiftDown ) {
					value = '';
				} else if ( window.PBSEditor.isCtrlDown ) {
					if ( value === 'dashed' ) {
						value = 'solid';
					} else if ( value === 'solid' ) {
						value = '';
					} else {
						value = 'solid';
					}
				} else {
					if ( value === '' ) {
						value = 'solid';
					} else if ( value === 'solid' ) {
						value = 'dashed';
					} else {
						value = '';
					}
				}

				element.style( 'border-style', value );
				view.model.set( 'border-style', value );

				if ( ! value ) {
					return;
				}

				value = element._domElement.style['border-width'];
				if ( ! value ) {
					value = '1px';
					element.style( 'border-width', value );
					view.model.set( 'border-width', value );
				}
				value = element._domElement.style['border-color'];
				if ( ! value ) {
					value = '#000000';
					element.style( 'border-color', value );
					view.model.set( 'border-color', value );
				}
			},
			'hold': function( element, view ) {
				  view.optionSettings.click( element, view );
			}
		},
		{
			'name': pbsParams.labels.increase_border_thickness,
			'tooltip': pbsParams.labels.increase_border_thickness + ' {0}',
			'tooltip-down': pbsParams.labels.decrease_border_thickness + ' {0}',
			'tooltip-reset': pbsParams.labels.remove_border,
			'type': 'button',
			'class': 'pbs-button-col-border-width',
			'group': pbsParams.labels.borders,
			'initialize': function( element, view ) {
				view.listenTo( view.model, 'change:border-width', view.render );
			},
			'tooltipValue': function ( element ) {
				return element._domElement.style['border-width'];
			},
			'isApplied': function ( element ) {
				return element._domElement.style['border-width'];
			},
			'click': function( element, view ) {
				var value = element._domElement.style['border-width'];

				if ( ! value ) {
					value = 0;
				} else {
					value = parseInt( value, 10 );
				}

				if ( window.PBSEditor.isCtrlDown && window.PBSEditor.isShiftDown ) {
					value = '';
				} else if ( window.PBSEditor.isCtrlDown ) {
					value -= 1;
				} else {
					value += 1;
				}

				if ( value ) {
					value += 'px';
				} else {
					value = '';
				}

				element.style( 'border-width', value );
				view.model.set( 'border-width', value );

				if ( ! value ) {
					element.style( 'border-style', '' );
					view.model.set( 'border-style', '' );
					element.style( 'border-color', '' );
					view.model.set( 'border-color', '' );
					return;
				}

				value = element._domElement.style['border-style'];
				if ( ! value || value === 'none' ) {
					value = 'solid';
					element.style( 'border-style', value );
					view.model.set( 'border-style', value );
				}
				value = element._domElement.style['border-color'];
				if ( ! value ) {
					value = '#000000';
					element.style( 'border-color', value );
					view.model.set( 'border-color', value );
				}
			},
			'hold': function( element, view ) {
				  view.optionSettings.click( element, view );
			}
		},
		{
			'name': pbsParams.labels.increase_border_radius,
			'tooltip': pbsParams.labels.increase_border_radius + ' {0}',
			'tooltip-down': pbsParams.labels.decrease_border_radius + ' {0}',
			'tooltip-reset': pbsParams.labels.remove_border_radius,
			'type': 'button',
			'class': 'pbs-button-col-border-radius',
			'group': pbsParams.labels.borders,
			'initialize': function( element, view ) {
				view.listenTo( view.model, 'change:border-radius', view.render );
			},
			'tooltipValue': function ( element ) {
				return element._domElement.style['border-radius'];
			},
			'isApplied': function ( element ) {
				return element._domElement.style['border-radius'];
			},
			'click': function( element, view ) {
				var value = element._domElement.style['border-radius'];

				if ( ! value ) {
					value = 0;
				} else {
					value = parseInt( value, 10 );
				}

				if ( window.PBSEditor.isShiftDown && window.PBSEditor.isCtrlDown ) {
					value = 0;
				} else if ( window.PBSEditor.isCtrlDown ) {
					value--;
				} else {
					value++;
				}

				if ( ! value ) {
					value = '';
				} else {
					value += 'px';
				}

				element.style( 'border-radius', value );
				view.model.set( 'border-radius', value );
			},
			'hold': function( element, view ) {
				  view.optionSettings.click( element, view );
			}
		}
	]
} );


window.pbsAddInspector( 'DivCol', {
	'label': pbsParams.labels.column,
	'options': [
		{
			'tooltip': pbsParams.labels.border_color,
			'tooltip-reset': pbsParams.labels.remove_border,
			'type': 'colorButton',
			'group': pbsParams.labels.borders,
			'id': 'border-color',
			'initialize': function( element, view ) {
				view.listenTo( view.model, 'change:border-color', view.optionSettings.modelChanged );
			},
			'modelChanged': function() {
				this.updateColor( this.model.get( 'element' )._domElement.style.borderColor );
			},
			'value': function( element ) {
				return element._domElement.style.borderColor;
			},
			'change': function( element, value, view ) {
				element.style( 'border-color', value );
				if ( value === 'transparent' ) {
					value = '';
				}
				if ( value ) {
					value = element._domElement.style['border-style'];
					if ( ! value || value === 'none' ) {
						value = 'solid';
						element.style( 'border-style', value );
						view.model.set( 'border-style', value );
					}
					value = element._domElement.style['border-width'];
					if ( ! value ) {
						value = '1px';
						element.style( 'border-width', value );
						view.model.set( 'border-width', value );
					}
				} else {
					element.style( 'border-style', '' );
					view.model.set( 'border-style', '' );
					element.style( 'border-width', '' );
					view.model.set( 'border-width', '' );
				}
			}
		},
		{
			'name': pbsParams.labels.border_style,
			'tooltip': pbsParams.labels.border_style + ' {0}',
			'tooltip-down': pbsParams.labels.border_style + ' {0}',
			'tooltip-reset': pbsParams.labels.remove_border,
			'type': 'button',
			'class': 'pbs-button-col-border-style',
			'group': pbsParams.labels.borders,
			'initialize': function( element, view ) {
				view.listenTo( view.model, 'change:border-style', view.render );
			},
			'tooltipValue': function ( element ) {
				return element._domElement.style['border-style'];
			},
			'isApplied': function ( element ) {
				return !! element._domElement.style['border-style'];
			},
			'click': function( element, view ) {
				var value = element._domElement.style['border-style'];

				if ( window.PBSEditor.isCtrlDown && window.PBSEditor.isShiftDown ) {
					value = '';
				} else if ( window.PBSEditor.isCtrlDown ) {
					if ( value === 'dashed' ) {
						value = 'solid';
					} else if ( value === 'solid' ) {
						value = '';
					} else {
						value = 'solid';
					}
				} else {
					if ( value === '' ) {
						value = 'solid';
					} else if ( value === 'solid' ) {
						value = 'dashed';
					} else {
						value = '';
					}
				}

				element.style( 'border-style', value );
				view.model.set( 'border-style', value );

				if ( ! value ) {
					element.style( 'border-style', '' );
					view.model.set( 'border-style', '' );
					element.style( 'border-color', '' );
					view.model.set( 'border-color', '' );
					return;
				}

				value = element._domElement.style['border-width'];
				if ( ! value ) {
					value = '1px';
					element.style( 'border-width', value );
					view.model.set( 'border-width', value );
				}
				value = element._domElement.style['border-color'];
				if ( ! value ) {
					value = '#000000';
					element.style( 'border-color', value );
					view.model.set( 'border-color', value );
				}
			},
			'hold': function( element, view ) {
				  view.optionSettings.click( element, view );
			}
		},
		{
			'name': pbsParams.labels.increase_border_thickness,
			'tooltip': pbsParams.labels.increase_border_thickness + ' {0}',
			'tooltip-down': pbsParams.labels.decrease_border_thickness + ' {0}',
			'tooltip-reset': pbsParams.labels.remove_border,
			'type': 'button',
			'class': 'pbs-button-col-border-width',
			'group': pbsParams.labels.borders,
			'initialize': function( element, view ) {
				view.listenTo( view.model, 'change:border-width', view.render );
			},
			'tooltipValue': function ( element ) {
				return element._domElement.style['border-width'];
			},
			'isApplied': function ( element ) {
				return element._domElement.style['border-width'];
			},
			'click': function( element, view ) {
				var value = element._domElement.style['border-width'];

				if ( ! value ) {
					value = 0;
				} else {
					value = parseInt( value, 10 );
				}

				if ( window.PBSEditor.isCtrlDown && window.PBSEditor.isShiftDown ) {
					value = '';
				} else if ( window.PBSEditor.isCtrlDown ) {
					value -= 1;
				} else {
					value += 1;
				}

				if ( value ) {
					value += 'px';
				} else {
					value = '';
				}

				element.style( 'border-width', value );
				view.model.set( 'border-width', value );

				if ( ! value ) {
					return;
				}

				value = element._domElement.style['border-style'];
				if ( ! value || value === 'none' ) {
					value = 'solid';
					element.style( 'border-style', value );
					view.model.set( 'border-style', value );
				}
				value = element._domElement.style['border-color'];
				if ( ! value ) {
					value = '#000000';
					element.style( 'border-color', value );
					view.model.set( 'border-color', value );
				}
			},
			'hold': function( element, view ) {
				  view.optionSettings.click( element, view );
			}
		},
		{
			'name': pbsParams.labels.increase_border_radius,
			'tooltip': pbsParams.labels.increase_border_radius + ' {0}',
			'tooltip-down': pbsParams.labels.decrease_border_radius + ' {0}',
			'tooltip-reset': pbsParams.labels.remove_border_radius,
			'type': 'button',
			'class': 'pbs-button-col-border-radius',
			'group': pbsParams.labels.borders,
			'initialize': function( element, view ) {
				view.listenTo( view.model, 'change:border-radius', view.render );
			},
			'tooltipValue': function ( element ) {
				return element._domElement.style['border-radius'];
			},
			'isApplied': function ( element ) {
				return element._domElement.style['border-radius'];
			},
			'click': function( element, view ) {
				var value = element._domElement.style['border-radius'];

				if ( ! value ) {
					value = 0;
				} else {
					value = parseInt( value, 10 );
				}

				if ( window.PBSEditor.isShiftDown && window.PBSEditor.isCtrlDown ) {
					value = 0;
				} else if ( window.PBSEditor.isCtrlDown ) {
					value--;
				} else {
					value++;
				}

				if ( ! value ) {
					value = '';
				} else {
					value += 'px';
				}

				element.style( 'border-radius', value );
				view.model.set( 'border-radius', value );
			},
			'hold': function( element, view ) {
				  view.optionSettings.click( element, view );
			}
		}
	]
} );


/**
 * Remove other border styles on blur if the border style was removed.
 * We need to do this or else the border will come back when focusing again.
 */
window.addEventListener( 'DOMContentLoaded', function() {
	ContentEdit.Root.get().bind('blur', function (element) {

		var row = null;
		var col = null;

		while ( element && element.constructor.name !== 'Region' ) {
			if ( element.constructor.name === 'DivRow' ) {
				row = element;
			}
			if ( element.constructor.name === 'DivCol' ) {
				col = element;
			}
			element = element.parent();
		}

		if ( row ) {
			if ( row.style( 'border-style' ) === 'none' ) {
				if ( row.style( 'border-width' ) !== '0px' ) {
					row.style( 'border-width', '' );
				}
				if ( row.style( 'border-color' ) !== '' ) {
					row.style( 'border-color', '' );
				}
			}
		}
		if ( col ) {
			if ( col.style( 'border-style' ) === 'none' ) {
				if ( col.style( 'border-width' ) !== '0px' ) {
					col.style( 'border-width', '' );
				}
				if ( col.style( 'border-color' ) !== '' ) {
					col.style( 'border-color', '' );
				}
			}
		}

	});
} );


/* globals google, pbsParams, PBSEditor */

 window.pbsAddInspector( 'Map', {
 	'label': pbsParams.labels.map,
 	'options': [
		{
			'name': pbsParams.labels.hide_map_controls,
			'tooltip': pbsParams.labels.hide_map_controls,
			'tooltip-reset': pbsParams.labels.reset_map_controls,
			'type': 'button',
			'class': 'pbs-button-map-ui',
			'isApplied': function ( element ) {
				return element._domElement.getAttribute( 'data-disable-ui' );
			},
			'click': function( element ) {
				var value = element._domElement.getAttribute( 'data-disable-ui' ) || false;

				var enableControls = value || ( window.PBSEditor.isShiftDown && window.PBSEditor.isCtrlDown );
				if ( enableControls ) {
					element.attr( 'data-disable-ui', '' );
				} else {
					element.attr( 'data-disable-ui', '1' );
				}

				element._domElement.map.setOptions( { disableDefaultUI: ! enableControls } );
			}
		},
		{
			'name': pbsParams.labels.latitude_longitude_and_address,
			'type': 'text',
			'desc': pbsParams.labels.latitude_longitude_desc,
			'initialize': function( element, view ) {
				view.listenTo( view.model, 'change:data-center', view.render );
			},
			'value': function( element ) {
				return element.attr( 'data-center' );
			},
			'change': _.debounce( function( element, value, view ) {
				if ( element.attr( 'data-center' ) === value ) {
					return;
				}
				element.attr( 'data-center', value );

				view.$el.find( 'input' ).removeClass( 'pbs-option-error' );

				var center = value.trim() || '37.09024, -95.712891';

				// Remove all existing markers.
				if ( element._domElement.map.marker ) {
					element._domElement.map.marker.setMap( null );
					delete( element._domElement.map.marker );
				}

				var latLonMatch = center.match( /^([-+]?\d{1,2}([.]\d+)?)\s*,?\s*([-+]?\d{1,3}([.]\d+)?)$/ );
				if ( latLonMatch ) {
					element.attr( 'data-lat', latLonMatch[1] );
					element.attr( 'data-lng', latLonMatch[3] );
					center = { lat: parseFloat( latLonMatch[1] ), lng: parseFloat( latLonMatch[3] ) };
					element._domElement.map.setCenter( center );

					// Put back the map marker.
					if ( element.attr( 'data-marker-image' ) ) {
						element._domElement.map.marker = new google.maps.Marker({
							position: element._domElement.map.getCenter(),
							map: element._domElement.map,
							icon: element.attr( 'data-marker-image' )
						});
					} else if ( element.attr( 'data-marker' ) ) {
						element._domElement.map.marker = new google.maps.Marker({
						    position: element._domElement.map.getCenter(),
						    map: element._domElement.map
						});
					}

				} else {
					var geocoder = new google.maps.Geocoder();
					geocoder.geocode( { 'address': center }, function( results, status ) {
					    if ( status === google.maps.GeocoderStatus.OK ) {
							element.attr( 'data-lat', results[0].geometry.location.lat() );
							element.attr( 'data-lng', results[0].geometry.location.lng() );
							center = { lat: results[0].geometry.location.lat(), lng: results[0].geometry.location.lng() };
							element._domElement.map.setCenter( center );

							// Put back the map marker.
							if ( element.attr( 'data-marker-image' ) ) {
								element._domElement.map.marker = new google.maps.Marker({
									position: element._domElement.map.getCenter(),
									map: element._domElement.map,
									icon: element.attr( 'data-marker-image' )
								});
							} else if ( element.attr( 'data-marker' ) ) {
								element._domElement.map.marker = new google.maps.Marker({
								    position: element._domElement.map.getCenter(),
								    map: element._domElement.map
								});
							}
						} else {
							view.$el.find( 'input' ).addClass( 'pbs-option-error' );
					    }
					});
				}

			}, 300 )
		}
	]
} );

/**
 * TODO:
 add tab
 remove tab
tab:
	 icon
 Tabs:
	 General
	 	horizontal / vertical
	 	tab alignment (left, center, right, stretch or when vertical top, center, bottom, stretch)
   	 	icon location
	style buttons:
		tab active accent color
	 	panel bg color (will also carry to the bg color of the active tab)
	 	enable/disable border effect
		 style
		 	- classic tabs
			- modern tabs
			- minimalist (line with arrow)
			- minimalist (clean with underline)
*/



/* globals pbsParams */

window.pbsAddInspector( 'Tabs', {
	'label': pbsParams.labels.tabs,
	'options': [
		{
			'name': pbsParams.labels.add_tab,
			'type': 'button',
			'class': 'pbs-button-carousel-add-slide',
			'click': function( element ) {
				element.addTab();
			}
		},
		{
			'name': pbsParams.labels.remove_tab,
			'type': 'button',
			'class': 'pbs-button-carousel-remove-slide',
			'click': function( element ) {
				element.removeTab();
			}
		},
		{
			'name': pbsParams.labels.delete_tabs,
			'type': 'button',
			'class': 'ct-tool--remove',
			'click': function( element ) {
				element.blur();
				element.parent().detach( element );
			}
		}
	]
} );

/* globals ContentTools, __extends */

/**
 * This serves as the base for all big element buttons
 */
ContentTools.Tools.ElementButton = ( function( _super ) {
	__extends( ElementButton, _super );

	function ElementButton() {
		return ElementButton.__super__.constructor.apply( this, arguments );
	}

	ElementButton.canApply = function( element ) {
		if ( element.constructor.name === 'Tab' ) {
			return false;
		}
    	return true;
    };

	return ElementButton;

} )( ContentTools.Tool );

/* globals ContentTools, ContentEdit, HTMLString, pbsParams */

/***************************************************************************
 * Change the left/center/right align tools.
 ***************************************************************************/
ContentTools.Tools.AlignCenter.className = '';
ContentTools.Tools.AlignCenter.apply = function(element, selection, callback) {
  var _ref;
  if ((_ref = element.constructor.name) === 'ListItemText' || _ref === 'TableCellText') {
    element = element.parent();
  }
  element.style('textAlign', 'center');
  return callback(true);
};

ContentTools.Tools.AlignLeft.className = '';
ContentTools.Tools.AlignLeft.apply = function(element, selection, callback) {
  var _ref;
  if ((_ref = element.constructor.name) === 'ListItemText' || _ref === 'TableCellText') {
    element = element.parent();
  }
  element.style('textAlign', 'left');
  return callback(true);
};

ContentTools.Tools.AlignRight.className = '';
ContentTools.Tools.AlignRight.apply = function(element, selection, callback) {
  var _ref;
  if ((_ref = element.constructor.name) === 'ListItemText' || _ref === 'TableCellText') {
    element = element.parent();
  }
  element.style('textAlign', 'right');
  return callback(true);
};
ContentTools.Tools.AlignLeft.isApplied = function(element, selection) {
	var _ref;
	if ( ! this.canApply( element ) ) {
		return false;
	}
	if ( ( _ref = element.type() ) === 'ListItemText' || _ref === 'TableCellText' ) {
		element = element.parent();
	}
	return element.style( 'textAlign' ) === 'left' || element.style( 'textAlign' ) === 'start';
};
ContentTools.Tools.AlignCenter.isApplied = function(element, selection) {
	var _ref;
	if ( ! this.canApply( element ) ) {
		return false;
	}
	if ( ( _ref = element.type() ) === 'ListItemText' || _ref === 'TableCellText' ) {
		element = element.parent();
	}
	return element.style( 'textAlign' ) === 'center';
};
ContentTools.Tools.AlignRight.isApplied = function(element, selection) {
	var _ref;
	if ( ! this.canApply( element ) ) {
		return false;
	}
	if ( ( _ref = element.type() ) === 'ListItemText' || _ref === 'TableCellText' ) {
		element = element.parent();
	}
	return element.style( 'textAlign' ) === 'right' || element.style( 'textAlign' ) === 'end';
};




/***************************************************************************
 * Allow headings inside divs
 ***************************************************************************/
ContentTools.Tools.Heading._canApply = ContentTools.Tools.Heading.canApply;
ContentTools.Tools.Heading.canApply = function(element, selection) {
	var origReturn = ContentTools.Tools.Heading._canApply( element, selection );
	if ( element.constructor.name === 'ListItemText' ) {
		return false;
	}
	if ( element.content !== void 0 && element.parent().tagName ) {
		return origReturn || element.parent().tagName() === 'div';
	}
	return origReturn;
};



/***************************************************************************
 * Applied state for the paragraph tool.
 ***************************************************************************/
ContentTools.Tools.Paragraph.isApplied = function(element) {
	return element.tagName() === this.tagName;
};



/***************************************************************************
 * Allow lists to be placed inside divs.
 ***************************************************************************/
ContentTools.Tools.UnorderedList.canApply = function(element, selection) {
	var ret = ContentTools.Tools.Heading1.canApply( element, selection );
   	if ( element.parent() ) {
		if ( element.parent().tagName ) {
	   		if ( element.parent().tagName() === 'li' ) {
	   			return true;
	   		}
		}
   	}
	return ret;
};
ContentTools.Tools.OrderedList.canApply = ContentTools.Tools.UnorderedList.canApply;


/***************************************************************************
 * Applied state for the list tools.
 ***************************************************************************/
ContentTools.Tools.UnorderedList.isApplied = function( element ) {
	if ( element.parent() ) {
		if ( element.parent().parent() ) {
			if ( element.parent().parent().tagName ) {
				if ( element.parent().parent().tagName() === this.listTag ) {
					return true;
				}
			}
		}
	}
	return false;
};
ContentTools.Tools.OrderedList.isApplied = ContentTools.Tools.UnorderedList.isApplied;


/***************************************************************************
 * Allow lists to be removed when clicking the list tool again.
 ***************************************************************************/

(function() {
	var proxied = ContentTools.Tools.UnorderedList.apply;
	ContentTools.Tools.UnorderedList.apply = function(element, selection, callback) {
		if ( this.isApplied( element ) ) {
			element.parent().unindent();

		// If the element has no content, then add the new element after it.
		} else if ( element.parent().type() !== 'ListItem' && ! element.content ) {
			var listItemText = new ContentEdit.ListItemText( '' );
			var listItem = new ContentEdit.ListItem();
			listItem.attach( listItemText );
			var list = new ContentEdit.List( this.listTag, {} );
			list.attach( listItem );
			element.parent().attach( list, element.parent().children.indexOf( element ) + 1 );
			listItemText.focus();
			return callback(true);

		} else {
			var ret = proxied.call( this, element, selection, callback );

			// Switching between numbered & bullet list does not refresh the inspector.
			// Trigger a focus on the element to refresh it.
			if ( element.parent() && element.parent().type() === 'ListItem' ) {
				ContentEdit.Root.get().trigger( 'focus', element );
			}

			return ret;
		}
	};
})();

(function() {
	var proxied = ContentTools.Tools.OrderedList.apply;
	ContentTools.Tools.OrderedList.apply = function(element, selection, callback) {
		if ( this.isApplied( element ) ) {
			element.parent().unindent();

		// If the element has no content, then add the new element after it.
		} else if ( element.parent().type() !== 'ListItem' && ! element.content ) {
			var listItemText = new ContentEdit.ListItemText( '' );
			var listItem = new ContentEdit.ListItem();
			listItem.attach( listItemText );
			var list = new ContentEdit.List( this.listTag, {} );
			list.attach( listItem );
			element.parent().attach( list, element.parent().children.indexOf( element ) + 1 );
			listItemText.focus();
			return callback(true);

		} else {
			var ret = proxied.call( this, element, selection, callback );

			// Switching between numbered & bullet list does not refresh the inspector.
			// Trigger a focus on the element to refresh it.
			if ( element.parent() && element.parent().type() === 'ListItem' ) {
				ContentEdit.Root.get().trigger( 'focus', element );
			}

			return ret;
		}
	};
})();


/***************************************************************************
 * Adjust the behavior of preformatted text to be able to be toggled.
 ***************************************************************************/
ContentTools.Tools.Preformatted.canApply = function(element, selection) {
	return ContentTools.Tools.Heading1.canApply( element, selection );
};

(function() {
	var proxied = ContentTools.Tools.Preformatted.apply;
	ContentTools.Tools.Preformatted.apply = function(element, selection, callback) {
		if ( this.isApplied( element ) ) {
			window.PBSEditor.getToolUI( 'paragraph' ).apply( element, selection );
			return;
		}

		// If the element has no content, then add the new element after it.
		if ( ! element.content ) {
			var heading = new ContentEdit.Text( this.tagName );
			element.parent().attach( heading, element.parent().children.indexOf( element ) + 1 );
			heading.focus();
			return callback(true);
		}

		return proxied.call( this, element, selection, callback );
	};
})();

ContentTools.Tools.Preformatted.isApplied = function(element) {
	return element.tagName() === this.tagName;
};




/***************************************************************************
 * Change Bold tool. Instead of just adding a `<b>` tag,
 * use font-weight styles.
 ***************************************************************************/
ContentTools.Tools.Bold.canApply = function(element, selection) {
	if ( ! element.content) {
	  return false;
	}
	return selection;
	// return selection && !selection.isCollapsed();
};

ContentTools.Tools.Bold.isApplied = function(element, selection) {
 	var from = 0, to = 0, _ref;
 	if (element.content === void 0 || !element.content.length()) {
 		return false;
 	}
 	if ( selection ) {
 		_ref = selection.get(), from = _ref[0], to = _ref[1];
 	}

 	// If nothing is selected, adjust the whole element
 	if ( from === to ) {
 		from = 0;
 		to = element.content.length();
 	}

 	var styledString = element.content.substring( from, to );
 	var fontWeight = styledString.getStyle( 'font-weight', element );

	// Support if formatted using `strong` & `b` tags.
	if ( styledString.hasTags( 'strong', true ) || styledString.hasTags( 'b', true ) ) {
		return true;
	}

	// Support numbered font-weights.
	var fontWeightNum = parseInt( fontWeight, 10 );
	if ( ! isNaN( fontWeightNum ) ) {
		return fontWeightNum > 400;
	}

 	return fontWeight === 'bold';
};

ContentTools.Tools.Bold.apply = function(element, selection, callback) {
 	this.tagName = 'span';

 	var from = 0, to = 0, _ref;
 	element.storeState();
 	if ( selection ) {
 		_ref = selection.get(), from = _ref[0], to = _ref[1];
 	}

 	// If nothing is selected, adjust the whole element
 	if ( from === to ) {
 		from = 0;
 		to = element.content.length();
 	}

 	// Get the current styles and add a font-weight
 	var styledString = element.content.substring(from, to);

	// Also support if stuff are bolded using `strong` & `b` tags.
	if ( styledString.hasTags( 'strong', true ) ) {
		element.content = element.content.unformat( from, to, new HTMLString.Tag( 'strong' ) );

	} else if ( styledString.hasTags( 'b', true ) ) {
		element.content = element.content.unformat( from, to, new HTMLString.Tag( 'b' ) );

	} else {

	 	var fontWeight = styledString.getStyle('font-weight', element );
	 	if ( ! fontWeight || fontWeight === 'normal' ) {
	 		fontWeight = 'bold';
		// If the font-weight is a number.
		} else if ( ! isNaN( parseInt( fontWeight, 10 ) ) ) {
			if ( parseInt( fontWeight, 10 ) <= 400 ) {
				fontWeight = 'bold';
			} else {
				fontWeight = 'normal';
			}
	 	} else {
	 		fontWeight = 'normal';
	 	}

		// For normal weights, use the original weight value if it's below 0-300.
		if ( fontWeight === 'normal' ) {
			var defaultFontWeight = element.defaultStyle( 'font-weight' );
			if ( ! isNaN( parseInt( defaultFontWeight, 10 ) ) ) {
				if ( parseInt( defaultFontWeight, 10 ) < 400 ) {
					fontWeight = defaultFontWeight;
				}
			}
		}

	 	var newStyle = { 'font-weight': fontWeight };

	 	element.content = element.content.style( from, to, element._tagName, newStyle );

	}

 	element.updateInnerHTML();
 	element.taint();
 	element.restoreState();
 	return callback(true);
};




/***************************************************************************
 * Change Italic tool. Instead of just adding an `<i>` tag,
 * use font-style styles.
 ***************************************************************************/
ContentTools.Tools.Italic.canApply = function(element, selection) {
 	return ContentTools.Tools.Bold.canApply( element, selection );
};

ContentTools.Tools.Italic.isApplied = function(element, selection) {
 	var from = 0, to = 0, _ref;
 	if (element.content === void 0 || !element.content.length()) {
 		return false;
 	}
 	if ( selection ) {
 		_ref = selection.get(), from = _ref[0], to = _ref[1];
 	}

 	// If nothing is selected, adjust the whole element
 	if ( from === to ) {
 		from = 0;
 		to = element.content.length();
 	}

 	var styledString = element.content.substring(from, to);
 	var fontStyle = styledString.getStyle('font-style', element );

	// Support if formatted using `em` & `i` tags.
	if ( styledString.hasTags( 'em', true ) || styledString.hasTags( 'i', true ) ) {
		return true;
	}

 	return fontStyle === 'italic';
};

ContentTools.Tools.Italic.apply = function(element, selection, callback) {
 	this.tagName = 'span';

 	var from = 0, to = 0, _ref;
 	element.storeState();
 	if ( selection ) {
 		_ref = selection.get(), from = _ref[0], to = _ref[1];
 	}

 	// If nothing is selected, adjust the whole element
 	if ( from === to ) {
 		from = 0;
 		to = element.content.length();
 	}

 	// Get the current styles and add a font-weight
 	var styledString = element.content.substring(from, to);

	// Also support if stuff are bolded using `em` & `i` tags.
	if ( styledString.hasTags( 'em', true ) ) {
		element.content = element.content.unformat( from, to, new HTMLString.Tag( 'em' ) );

	} else if ( styledString.hasTags( 'i', true ) ) {
		element.content = element.content.unformat( from, to, new HTMLString.Tag( 'i' ) );

	} else {

	 	var fontStyle = styledString.getStyle('font-style', element );
	 	if ( ! fontStyle || fontStyle === 'normal' ) {
	 		fontStyle = 'italic';
	 	} else {
	 		fontStyle = 'normal';
	 	}
	 	var newStyle = { 'font-style': fontStyle };

	 	element.content = element.content.style( from, to, element._tagName, newStyle );
	}

 	element.updateInnerHTML();
 	element.taint();
 	element.restoreState();
 	return callback(true);
};




/***************************************************************************
 * Fix Link tool.
 * Because we changed the Bold tool above, the link tool gets changed too.
 * Bring it back to the original behavior.
 ***************************************************************************/
ContentTools.Tools.Link.isApplied = function(element, selection) {
 	// From Link.isApplied
 	if (element.constructor.name === 'Image') {
 		return element.a;
 	} else if ( selection ) {

 		// From the original Bold.isApplied
 		var from, to, _ref;
 		if (element.content === void 0 || !element.content.length()) {
 			return false;
 		}
 		_ref = selection.get(), from = _ref[0], to = _ref[1];
 		if (from === to) {
 			to += 1;
 		}
 		return element.content.slice(from, to).hasTags(this.tagName, true);
 	}
};



/***************************************************************************
 * Clicking the paragraph tool when an image is focused adds a paragraph
 * in the Region only, this makes it support divs.
 * @see ContentTools.Tools.Paragraph.apply
 ***************************************************************************/
 (function() {
 	var proxied = ContentTools.Tools.Paragraph.apply;
	ContentTools.Tools.Paragraph.apply = function(element, selection, callback) {
		var app, forceAdd, paragraph, region;
		app = ContentTools.EditorApp.get();
		forceAdd = app.ctrlDown();
		if ( ContentTools.Tools.Heading.canApply(element) && ! forceAdd ) {
		} else {
			if ( element.parent().constructor.name === 'DivCol' || element.parent().constructor.name === 'Div' ) {
				region = element.parent();
				paragraph = new ContentEdit.Text('p');
				region.attach(paragraph, region.children.indexOf(element) + 1);
				paragraph.focus();
				return callback(true);
			}
		}
		return proxied.call( this, element, selection, callback );
	};
})();




/***************************************************************************
 * Add a down hold (click and hold down the button) action for all tools.
 * To use this, you'll need to add a `doHold` function on the tool class.
 * @see line-height tool & margin tools
 ***************************************************************************/
 (function() {
 	var proxied = ContentTools.ToolUI.prototype._onMouseDown;
	ContentTools.ToolUI.prototype._onMouseDown = function(ev) {

		var ret = proxied.call( this, ev );

		if ( ! this.tool.doHold ) {
			return ret;
		}

		clearTimeout( this._holdTimeout );
		clearInterval( this._holdInterval );

		var interval = 30;
		if ( this.tool.holdInterval ) {
			interval = this.tool.holdInterval;
		}

		var element, selection;
		if (this._mouseDown) {
			element = ContentEdit.Root.get().focused();
			if (!(element && element.isMounted())) {
				return;
			}
			selection = null;
			if (element.selection) {
				selection = element.selection();
			}

			this._holdTimeout = setTimeout(function() {
				this._holdInterval = setInterval( function() {
					this.tool.doHold( element, selection );
				}.bind(this), interval );
			}.bind(this), 500);

		}

		return ret;
	};
})();

(function() {
	var proxied = ContentTools.ToolUI.prototype._onMouseUp;
	ContentTools.ToolUI.prototype._onMouseUp = function(ev) {

		clearTimeout( this._holdTimeout );
		clearInterval( this._holdInterval );

		return proxied.call( this, ev );
	};
})();


ContentTools.Tool.refreshTooltip = function( value ) {

	var buttonElement = window.PBSEditor.getToolUI( this.icon )._domElement;

	if ( ! value ) {
		value = '';
	}

	var tooltip;
	if ( window.PBSEditor.isCtrlDown && window.PBSEditor.isShiftDown ) {
		tooltip = this.labelReset.replace( '{0}', value );
	} else if ( window.PBSEditor.isCtrlDown ) {
		tooltip = this.labelDown.replace( '{0}', value );
	} else {
		tooltip = this.label.replace( '{0}', value );
	}

	if ( buttonElement.getAttribute( 'data-tooltip' ) !== tooltip ) {
		buttonElement.setAttribute('data-tooltip', tooltip );
	}

};


/**
 * Display element buttons as large buttons.
 */
(function() {
   var proxied = ContentTools.ToolUI.prototype.mount;
   ContentTools.ToolUI.prototype.mount = function( domParent, before ) {
	   var ret = proxied.call( this, domParent, before );

	   if ( this.tool.buttonName ) {
		   this._domElement.classList.add( 'pbs-tool-large' );
		   var label = document.createElement( 'div' );
		   label.classList.add( 'pbs-tool-title' );
		   label.textContent = this.tool.buttonName;
		   this._domElement.appendChild( label );

		   if ( this.tool.premium && pbsParams.is_lite ) {
			   this._domElement.classList.add( 'pbs-tool-is-premium' );
			   var star = document.createElement( 'div' );
			   star.classList.add( 'pbs-tool-premium' );
			   this._domElement.appendChild( star );

			   this._domElement.addEventListener( 'mouseover', function(ev) {
				   ev.target.setAttribute( 'data-tooltip', 'Available only in Premium.' );
			   }.bind(this) );
			   this._domElement.addEventListener( 'click', function(ev) {
				   var preview = document.createElement( 'DIV' );
				   preview.innerHTML = wp.template( 'pbs-preview-premium-element' )( {
					   'title': this.tool.title || this.tool.icon,
					   'description': this.tool.description,
					   'image': pbsParams.plugin_url + 'page_builder_sandwich/images/preview-' + this.tool.icon + '.gif'
				   } );
				   preview.addEventListener( 'click', function(ev) {
					   if ( [ 'IMG', 'DIV' ].indexOf( ev.target.tagName ) !== -1 ) {
						   preview.parentNode.removeChild( preview );
					   }
				   } );
				   document.body.appendChild( preview );
			   }.bind(this) );
		   }
	   }

	   return ret;
   };
})();



/**
 * Move Undo & Redo to the adminbar.
 */
(function() {
	var proxied = ContentTools.ToolUI.prototype.mount;
	ContentTools.ToolUI.prototype.mount = function( domParent, before ) {
		var ret = proxied.call( this, domParent, before );

		// Mounting forces the _domElement to be added into the toolbox.
		// Remove them and bring back Undo into the adminbar.
		if ( this.tool.name === 'Undo' || this.tool.name === 'Redo' ) {
			document.querySelector('#wp-admin-bar-root-default').appendChild( this._domElement );
		}

		return ret;
	};
})();
(function() {
	var proxied = ContentTools.ToolUI.createDiv;
	ContentTools.ToolUI.createDiv = function( classNames, attributes, content ) {

		// Don't create the div for Undo & Redo, use the ones in the adminbar.
		var elem;
		if ( classNames.indexOf( 'ct-tool--undo' ) !== -1 ) {
			elem = document.querySelector( '#wp-admin-bar-pbs_adminbar_undo' );
		}
		if ( classNames.indexOf( 'ct-tool--redo' ) !== -1 ) {
			elem = document.querySelector( '#wp-admin-bar-pbs_adminbar_redo' );
		}
		if ( elem ) {

			// Since the button is in the adminbar, prevent the default scroll to top movement.
			elem.addEventListener('click', function(ev) {
				ev.preventDefault();
			});

			if ( classNames && classNames.length > 0 ) {
				if ( elem.getAttribute( 'class' ) ) {
					classNames.push( elem.getAttribute( 'class' ) );
				}
				elem.setAttribute( 'class', classNames.join( ' ' ) );
	        }
	        if ( attributes ) {
				for ( var name in attributes ) {
					if ( attributes.hasOwnProperty( name ) ) {
						var value = attributes[ name ];
						elem.setAttribute( name, value );
					}
				}
	        }
			return elem;
		}

		return proxied.call( this, classNames, attributes, content );
	};
})();


/**
 * Hide the table element in lite.
 */
(function() {
	var proxied = ContentTools.Tools.Table.apply;
	ContentTools.Tools.Table.apply = function( element, selection, callback ) {
	};
	ContentTools.Tools.Table.premium = true;
	ContentTools.Tools.Table.buttonName = pbsParams.labels.table;
	ContentTools.Tools.Table.label = pbsParams.labels.table;

})();


/**
 * Inherit Table.canApply on the ElementButton.
 */
( function() {
	ContentTools.Tools.Table.canApply = ContentTools.Tools.ElementButton.canApply;
} )();

/* globals ContentTools, ContentEdit, pbsParams */

ContentTools.Tools.AlignRight.shortcut = 'ctrl+r';
ContentTools.Tools.AlignCenter.shortcut = 'ctrl+e';
ContentTools.Tools.AlignLeft.shortcut = 'ctrl+l';
ContentTools.Tools.Italic.shortcut = 'ctrl+i';
ContentTools.Tools.Bold.shortcut = 'ctrl+b';
ContentTools.Tools.Link.shortcut = 'ctrl+k';
ContentTools.Tools.Paragraph.shortcut = 'ctrl+1';
ContentTools.Tools.UnorderedList.shortcut = 'ctrl+.';
ContentTools.Tools.OrderedList.shortcut = 'ctrl+/';
ContentTools.Tools.OrderedList.shortcut = 'ctrl+/';
ContentTools.Tools.Preformatted.shortcut = 'ctrl+8';
ContentTools.Tools.Undo.label = pbsParams.labels.undo + ' (ctrl+Z)';
ContentTools.Tools.Redo.label = navigator.appVersion.indexOf('Mac') !== -1 ? pbsParams.labels.redo + ' (ctrl+shift+Z)' : pbsParams.labels.redo + ' (ctrl+y)';

(function() {

	var shortcuts = {};

	var gatherShortcutKeys = function( toolboxUI ) {

		// Do this if the shortcuts object is still empty.
		if ( Object.keys( shortcuts ).length ) {
			return;
		}

		// Loop through all the tools
		for ( var toolUI in toolboxUI._toolUIs ) {
			if ( ! toolboxUI._toolUIs.hasOwnProperty( toolUI ) ) {
				continue;
			}
			var tool = toolboxUI._toolUIs[ toolUI ].tool;

			if ( tool.shortcut ) {
				var key = '';
				var sc = tool.shortcut.replace( /\s/, '' ).toLowerCase();

				if ( sc.indexOf( 'ctrl' ) !== -1 ) {
					key += 'ctrl';
				}
				if ( sc.indexOf( 'shift' ) !== -1 ) {
					key += key ? '+' : '';
					key += 'shift';
				}
				sc = sc.replace( /(ctrl|shift|\+)/g, '' );
				if ( ! sc ) {
					key = '';
				}
				if ( key ) {
					if ( sc === 'space' ) {
						sc = 32;
					} else if ( sc === 'up' ) {
						sc = 38;
					} else if ( sc === 'right' ) {
						sc = 39;
					} else if ( sc === 'down' ) {
						sc = 40;
					} else if ( sc === 'left' ) {
						sc = 37;
					} else if ( sc === 'tab' ) {
						sc = 9;
					} else if ( sc === 'enter' ) {
						sc = 13;
					} else if ( sc === '.' ) {
						sc = 190;
					} else if ( sc === '/' ) {
						sc = 191;
					} else if ( sc === '=' ) {
						sc = 187;
					} else if ( sc === '-' ) {
						sc = 189;
					} else if ( sc === 'delete' ) {
						sc = 8;
					}
					if ( typeof sc === 'number' ) {
						key += '+' + sc;
					} else {
						sc = sc.match( /[a-z]/ ) ? sc.toUpperCase() : sc;
						key += '+' + sc.charCodeAt(0);
					}

					shortcuts[ key ] = tool;
				}
			}
		}
	};

	var getShortcutKey = function( ev ) {
		var key = '';
		if ( ev.metaKey || ev.ctrlKey ) {
			key += 'ctrl';
		}
		if ( ev.shiftKey ) {
			key += key ? '+' : '';
			key += 'shift';
		}
		if ( ! key ) {
			return;
		}
		key += '+' + ev.keyCode;

		return key;
	};

	var shortcutListener = function(ev) {

		var key = getShortcutKey( ev );
		var element = ContentEdit.Root.get().focused();

		if ( wp.hooks.applyFilters( 'pbs.shortcuts', false, key, element ) ) {
			ev.preventDefault();
			return;
		}

		if ( ! element ) {
			return;
		}

		// Apply the tool if the shortcut matched.
		if ( shortcuts[ key ] ) {
			var tool = shortcuts[ key ];

			if ( ! ( element && element.isMounted() ) ) {
				return;
			}

			var selection = null;
			if ( element.selection ) {
				selection = element.selection();
			}

			if ( tool.canApply( element, selection ) ) {
				var temp1 = window.PBSEditor.isCtrlDown;
				var temp2 = window.PBSEditor.isShiftDown;
				window.PBSEditor.isCtrlDown = false;
				window.PBSEditor.isShiftDown = false;
				tool.apply( element, selection, function() {}, true );
				window.PBSEditor.isCtrlDown = temp1;
				window.PBSEditor.isShiftDown = temp2;
			}

			ev.preventDefault();
			ev.stopPropagation();
			return false;
		}

	};


	// Because we're listening on the document keydown event, some shortcuts will might
	// not trigger correctly and might continue with their default behavior (e.g. navigating columns),
	// this fixes this by handling the call from the Text Element level.
	var elementKeyDownProxy = ContentEdit.Text.prototype._onKeyDown;
	ContentEdit.Text.prototype._onKeyDown = function( ev ) {
		gatherShortcutKeys( this );

		if ( shortcuts ) {
			var key = getShortcutKey( ev );
			if ( shortcuts[ key ] ) {
				shortcutListener( ev );
				return;
			}
		}

		elementKeyDownProxy.call( this, ev );
	};


	var addDomEventListenersProxy = ContentTools.ToolboxUI.prototype._addDOMEventListeners;
	ContentTools.ToolboxUI.prototype._addDOMEventListeners = function() {
		// Gather all shortcut keys
		gatherShortcutKeys( this );

		document.addEventListener( 'keydown', shortcutListener );
		return addDomEventListenersProxy.call( this );
	};

	var removeDomEventListenersProxy = ContentTools.ToolboxUI.prototype._removeDOMEventListeners;
	ContentTools.ToolboxUI.prototype._removeDOMEventListeners = function() {
		document.removeEventListener( 'keydown', shortcutListener );
		return removeDomEventListenersProxy.call( this );
	};


	var toolUIMountProxy = ContentTools.ToolUI.prototype.mount;
	ContentTools.ToolUI.prototype.mount = function( domParent, before ) {

	  if ( typeof this.tool.shortcut !== 'undefined' ) {
		  if ( this.tool.shortcut !== '' ) {

			// Create the shortcut label, single letters are capitalized.
			var sc = this.tool.shortcut;
			sc = sc.replace( /\+(.)$/, function ( match ) {
				return match.toUpperCase();
			} );

			if ( this.tool.label ) {
				if ( ! this.tool._origLabel ) {
					this.tool._origLabel = this.tool.label;
				}
				this.tool.label = this.tool._origLabel + ' (' + sc + ')';
			}
			if ( this.tool.labelDown ) {
				if ( ! this.tool._origLabelDown ) {
					this.tool._origLabelDown = this.tool.labelDown;
				}
				this.tool.labelDown = this.tool._origLabelDown + ' (' + sc + ')';
			}
			if ( this.tool.labelReset ) {
				if ( ! this.tool._origLabelReset ) {
					this.tool._origLabelReset = this.tool.labelReset;
				}
				this.tool.labelReset = this.tool._origLabelReset + ' (' + sc + ')';
			}

		  }
	  }

	  var ret = toolUIMountProxy.call( this, domParent, before );

	  // At the start create the default tooltip first.
	  this._domElement.setAttribute('data-tooltip', ContentEdit._(this.tool.label.replace( '{0}', '' )));

	  return ret;
	};

})();


/**
 * Adminbar shortcuts.
 */
window.addEventListener( 'DOMContentLoaded', function() {
	document.addEventListener( 'keydown', function(ev) {
		if ( ! window.PBSEditor.isEditing() ) {

			// Edit.
			if ( ( ev.metaKey || ev.ctrlKey ) && ev.keyCode === 69 ) {
				document.querySelector( '#wp-admin-bar-gambit_builder_edit' ).dispatchEvent( new CustomEvent( 'click' ) );
				ev.preventDefault();
			}

		} else {

			if ( ( ev.metaKey || ev.ctrlKey ) && ( ev.keyCode === 83 || ev.keyCode === 27 ) ) {
				ev.preventDefault();

				var element = ContentEdit.Root.get().focused();
				if ( element ) {
					element.blur();
				}

				// Save.
				if ( ev.keyCode === 83 ) {
					document.querySelector( '#wp-admin-bar-gambit_builder_save' ).dispatchEvent( new CustomEvent( 'click' ) );

				// Cancel.
				} else {
					document.querySelector( '#wp-admin-bar-gambit_builder_cancel' ).dispatchEvent( new CustomEvent( 'click' ) );
				}

			} else if ( ( ev.metaKey || ev.ctrlKey ) && ev.shiftKey && ev.keyCode === 82 ) {

				// New reload shortcut.
				ev.preventDefault();
				location.reload();

			}
		}
	});
} );

/* globals ContentTools, ContentEdit, __extends */

ContentTools.Tools.AddElementButton = (function(_super) {
	__extends(AddElementButton, _super);

	function AddElementButton() {
		return AddElementButton.__super__.constructor.apply(this, arguments);
	}

	AddElementButton.isAddElementButton = true;

	// This is the list that is paired with this button tool.
	AddElementButton.listTool = '';

	AddElementButton.icon = 'add-element-button';

	AddElementButton.canApply = function() {
		return true;
	};

    AddElementButton.isApplied = function() {
		if ( this.listTool ) {
			var tool = window.PBSEditor.getToolUI( this.listTool );
			if ( tool ) {
				return tool._domElement.style.display === 'block';
			}
		}
		return false;
    };

	AddElementButton.apply = function(element, selection, callback) {
		return callback(true);
	};

	return AddElementButton;

})(ContentTools.Tool);



ContentTools.Tools.AddElementList = (function(_super) {
	__extends(AddElementList, _super);

	function AddElementList() {
		return AddElementList.__super__.constructor.apply(this, arguments);
	}

	AddElementList.type = 'design-elements-list';
	AddElementList.icon = 'design-elements-list';
	AddElementList.label = '';

	// Override me
	AddElementList.populateList = function( domToolContainer ) { }; // jshint ignore:line

	// Override me
	AddElementList.addClickedItem = function( domItemClicked, elemFocused ) { }; // jshint ignore:line

	AddElementList.canApply = function() {
		return true;
	};
    AddElementList.isApplied = function() {
		return false;
    };

	AddElementList.toggleList = function() {
		if ( this._ceElement._domElement.style.display ) {
			this.hideList();
		} else {
			this.showList();
		}
	};

	AddElementList.init = function() {
		var toolDomElement = this._ceElement._domElement;
		if ( ! toolDomElement.children.length ) {

			toolDomElement.classList.add( 'pbs-add-element-list' );

			this.populateList( toolDomElement );

			for ( var i = 0; i < toolDomElement.children.length; i++ ) {
				var el = toolDomElement.children[ i ];
				el.classList.add( 'pbs-add-element-list-item' );
				el.setAttribute( 'data-search-terms', el.textContent.trim().toLowerCase() );
				el.addEventListener( 'click', this._onClick.bind( this ) );
			}

			// Create the search field.
			var elem = document.createElement( 'INPUT' );
			elem.setAttribute( 'type', 'search' );
			elem.setAttribute( 'placeholder', 'Type to search...' );
			toolDomElement.insertBefore( elem, toolDomElement.firstChild );
			elem.addEventListener( 'keyup', this._doSearch.bind( this ) );

			// Create the none-found label.
			elem = document.createElement( 'SPAN' );
			elem.classList.add( 'pbs-add-element-list-none-found' );
			elem.innerHTML = 'Nothing found';
			toolDomElement.insertBefore( elem, toolDomElement.firstChild );
		}
	};

	AddElementList._onClick = function(e) {

		// Add the shortcode after the currently selected element
		var root = ContentEdit.Root.get();
		if ( root.focused() ) {

			// The clicked target isn't necessarily the one with data-shortcode,
			// it may be a child of the element, find the data-shortcode.
			var currTarget = e.target;
			while ( ! currTarget.classList.contains( 'pbs-add-element-list-item' ) && currTarget.parentNode ) {
				currTarget = currTarget.parentNode;
			}

			this.addClickedItem( currTarget, root.focused() );
		}

	};

	AddElementList.showList = function() {

		this._ceElement._domElement.style.display = 'block';

		var search = this._ceElement._domElement.querySelector('[type="search"]');
		search.focus();
		search.select();

	};

	AddElementList.hideList = function() {
		this._ceElement._domElement.style.display = '';
	};

	AddElementList._doSearch = function( ev ) {
		var elements,
			searchString = ev.target.value.trim().toLowerCase(),
			noneFoundLabel = this._ceElement._domElement.querySelector( '.pbs-add-element-list-none-found' );

		noneFoundLabel.style.display = 'none';

		if ( searchString === '' ) {
			elements = ev.target.parentNode.querySelectorAll( '[data-search-terms]' );
			Array.prototype.forEach.call( elements, function( el ) {
				el.style.display = '';
			} );
			return;
		}

		elements = ev.target.parentNode.querySelectorAll( '[data-search-terms]' );
		Array.prototype.forEach.call( elements, function( el ) {
			el.style.display = 'none';
		} );
		elements = ev.target.parentNode.querySelectorAll( '[data-search-terms*="' + searchString + '"]' );
		Array.prototype.forEach.call( elements, function( el ) {
			el.style.display = '';
		} );

		if ( ! elements.length ) {
			noneFoundLabel.style.display = 'block';
		}
	};

	return AddElementList;

})(ContentTools.Tool);




// Initialize the tool to create all the buttons inside it upon mounting.
(function() {
	var proxied = ContentTools.ToolboxUI.prototype.mount;
	ContentTools.ToolboxUI.prototype.mount = function() {
		var ret = proxied.call( this );
		for ( var i in this._toolUIs ) {
			if ( ! this._toolUIs.hasOwnProperty( i ) ) {
				continue;
			}
			if ( this._toolUIs[ i ].tool.init ) {
				this._toolUIs[ i ].tool.init();
			}
		}
		return ret;
	};
} )();



// Remove the existing event handlers for the tool. We are going to use our own
(function() {
	var proxied = ContentTools.ToolUI.prototype._addDOMEventListeners;
	ContentTools.ToolUI.prototype._addDOMEventListeners = function() {

		if ( this.tool.__super__ && this.tool.__super__.constructor.name === 'AddElementButton' ) {

			// Cancel the mouse down event to prevent focusing
	        this._domElement.addEventListener('mousedown', function(e) {
				if ( e.target.classList.contains('ct-tool') ) {
					e.preventDefault();
				}
			});

			// Show the element picker on click
	        this._domElement.addEventListener('click', function(e) {
				if ( e.target.classList.contains('ct-tool') ) {
					var tool = window.PBSEditor.getToolUI( this.tool.listTool );
					// var tool = ContentTools.EditorApp.get()._toolbox._toolUIs[ 'design-elements-list' ];
					if ( typeof tool !== 'undefined' ) {
						tool.tool.toggleList();
					}
				}
	        }.bind(this) );

		} else if ( this.tool.__super__ && this.tool.__super__.constructor.name === 'AddElementList' ) {
		// } else if ( this.tool.name === 'DesignElementsList' ) {

			// Cancel the mouse down event to prevent focusing
	        this._domElement.addEventListener('mousedown', function(e) {
				if ( e.target.classList.contains('ct-tool') ) {
					e.preventDefault();
				}
			});

		// Normal process
		} else {
			return proxied.call( this );
		}
	};
})();

/* globals ContentTools, ContentEdit, PBSShortcodes, __extends, PBSEditor, pbsParams */

ContentTools.Tools.Shortcode = (function(_super) {
	__extends(Shortcode, _super);

	function Shortcode() {
		return Shortcode.__super__.constructor.apply(this, arguments);
	}

	ContentTools.ToolShelf.stow(Shortcode, 'shortcode');

	Shortcode.label = pbsParams.labels.shortcode;

	Shortcode.icon = 'shortcode';

	Shortcode.tagName = 'shortcode';

	Shortcode.buttonName = pbsParams.labels.shortcode;

	Shortcode.apply = function(element, selection, callback) {

		PBSEditor.shortcodeFrame.open({
			title: pbsParams.labels.insert_shortcode,
			button: pbsParams.labels.insert_shortcode,
			successCallback: function( view ) {

				var root = ContentEdit.Root.get();
				var elemFocused = null;
		        if ( root.focused() ) {
					elemFocused = root.focused();
				} else {
					var mainRegion = ContentTools.EditorApp.get().regions()['main-content'];
					if ( mainRegion.children ) {
						elemFocused = mainRegion.children[0];
					}
				}

				var base = view.selected.getAttribute( 'data-shortcode-tag' );
				var shortcodeRaw = this.createInsertedShortcode( base );
				var shortcode = wp.shortcode.next( base, shortcodeRaw, 0 );

				// Insert the RAW shortcode.
				var elem = new ContentEdit.Text( 'p', {}, shortcode.shortcode.string() );
				var index = elemFocused.parent().children.indexOf( elemFocused );
				elemFocused.parent().attach( elem, index + 1 );

				elem.focus();

				elem.origShortcode = '';
				elem.origInnerHTML = '';
				elem.isShortcodeEditing = true;
			}.bind( this )
		});
		return callback( true );
	};

	Shortcode.createInsertedShortcode = function( base ) {

		// Default data
		var scData = {
			tag: base,
			type: 'closed',
			content: '',
			attrs: {}
		};

		// Include shortcode API data if it exists
		if ( PBSShortcodes[ base ] && PBSShortcodes[ base ].options ) {
			for ( var i = 0; i < PBSShortcodes[ base ].options.length; i++ ) {
				var option = PBSShortcodes[ base ].options[ i ];
				if ( option.id && option['default'] ) {
					scData.attrs[ option.id ] = option['default'];
				}
			}
		}

		// Generate the shortcode
		return new wp.shortcode( scData ).string();
	};

	return Shortcode;

} )( ContentTools.Tools.ElementButton );


/* globals ContentTools, ContentEdit, PBS, pbsSelectorMatches */

/**
 * The Toolbar API
 */
window.addEventListener( 'DOMContentLoaded', function() {

	var _toolbar = new PBS.Toolbar();
	_toolbar.init();

	// Add/remove the event listeners to the editor.
	ContentTools.EditorApp.get().bind('start', function () {
		_toolbar.start();
	});
	ContentTools.EditorApp.get().bind('stop', function () {
		_toolbar.stop();
	});

});


PBS.Toolbar = (function() {
    function Toolbar() {
		this._domElement = null;
		this.tools = [];
    }

	Toolbar.prototype.init = function() {
		this._domElement = document.createElement('DIV');
		this._domElement.classList.add('pbs-toolbar');
		this._offsetAdminBar = document.querySelector('#wpadminbar').offsetHeight;
		document.body.appendChild( this._domElement );

		this._addEventListeners();


		this._onMouseOverBound = this._onMouseOver.bind(this);
		this._onMouseMoveBound = this._onMouseMove.bind(this);
		this._onMouseOutBound = this._onMouseOut.bind(this);
		this._updatePositionBound = this._updatePosition.bind(this);
	};

	Toolbar.prototype._addEventListeners = function() {

		// Remove the toolbar when leaving the main parent
		this._domElement.addEventListener('mouseout', function(e) {
			if ( this._parent !== e.relatedTarget ) {
				this._onMouseOut(e);
			}
		}.bind(this));

		// When the mouse goes out of the toolbar, trigger a mouse over in another
		// to make sure that the toolbar location gets refreshed.
		// This fixes the bug where the toolbar does not appear again when hovering into another
		// adjacent element with a toolbar.
		this._domElement.addEventListener('mouseout', function(e) {
			if ( e.relatedTarget ) {
				e.relatedTarget.dispatchEvent( new CustomEvent( 'mouseover' ) );
			}
		});

		// Hide the toolbar when dragging.
		ContentEdit.Root.get().bind('drag', function () {
		    this.hide();
		}.bind(this));

		// Hide the toolbar when dragging.
		ContentEdit.Root.get().bind('blur', function () {
			this.hide();
		}.bind(this));
	};

	Toolbar.prototype._onMouseOver = function(e) {

		// Only do this for elements inside the editable area.
		var editorArea = document.querySelector('[data-editable]');
		if ( ! editorArea.contains( e.target ) ) {
			return;
		}

		// Don't do anything when hovering over the toolbar.
		if ( e.relatedTarget ) {
			if ( e.relatedTarget.classList ) {
				if ( e.relatedTarget.classList.contains('pbs-toolbar') || e.relatedTarget.classList.contains('pbs-tool') ) {
					return;
				}
			}
		}

		// Don't display the toolbar if forced.
		if ( e.target.classList ) {
			if ( e.target.classList.contains( 'pbs-no-toolbar' ) ) {
				return;
			}
		}

		// Don't show the toolbar when dragging.
	    if ( ContentEdit.Root.get().dragging() ) {
			return;
		}

		// Get the toolbar selectors to watch for.
		var selectors = wp.hooks.applyFilters( 'pbs.has_toolbar_selectors', [] );

		this._clearTools();

		// Go through each selector and check if we are over a selector (or it's children), then display the toolbar.
		for ( var i = 0; i < selectors.length; i++ ) {

			// Check if the target matches an exact selector.
			if ( pbsSelectorMatches( e.target, selectors[ i ] ) ) {
				this._parent = e.target;
				if ( this._addTools( e.target ) ) {
					this._domElement.classList.add('pbs-show');
					this._domElement.style.opacity = 1;
					this._updatePosition();
				}
				return;
			}

			// Check whether the element matches a child of the selector.
			var childSelector = selectors[ i ].split(',').join(' *,').concat(' *');

			// If a child matches, find the parent that matches the original selector.
			if ( pbsSelectorMatches( e.target, childSelector ) ) {

				// If it matches a child, we need to find the originating parent selector,
				// so we can make the toolbar appear on the top-center of the parent.
				var parentElement = e.target.parentNode;
				while ( parentElement && parentElement.tagName !== 'BODY' ) {
					if ( pbsSelectorMatches( parentElement, selectors[ i ] ) ) {
						this._parent = parentElement;
						if ( this._addTools( parentElement ) ) {
							this._domElement.classList.add('pbs-show');
							this._domElement.style.opacity = 1;
							this._updatePosition();
						}
						return;
					}
					parentElement = parentElement.parentNode;
				}
			}
		}
	};

	Toolbar.prototype._onMouseMove = function(e) {
		if ( this._parent ) {
			if ( ! this._domElement.classList.contains( 'pbs-show' ) ) {
				this._onMouseOver(e);
			}
			this._updatePosition();
		}
	};

	Toolbar.prototype._onMouseOut = function(e) {
		if ( e.relatedTarget ) {
			if ( e.relatedTarget.classList ) {
				if ( e.relatedTarget.classList.contains('pbs-toolbar') || e.relatedTarget.classList.contains('pbs-tool') ) {
					return;
				}
			}
		}
		this.hide();
	};

	Toolbar.prototype._addTools = function( targetElement ) {
		// Add the toolbar tools
		var tools = wp.hooks.applyFilters( 'pbs.toolbar_tools', [], this._domElement, targetElement );
		if ( ! tools.length ) {
			return;
		}

		// Clear the toolbar
		while ( this._domElement.firstChild ) {
			this._domElement.removeChild( this._domElement.firstChild );
		}

		// Add the toolbar tools
		for ( var i = 0; i < tools.length; i++ ) {
			this._domElement.appendChild( tools[ i ] );
			this.tools.push( tools[ i ] );
			this.tools[ this.tools.length - 1 ].addEventListener( 'click', this._updatePositionBound );
		}

		return tools.length;
	};

	Toolbar.prototype._updatePosition = function() {
		var rect = this._parent.getBoundingClientRect();
		var style = getComputedStyle( document.querySelector('html') );
		this._domElement.style.left = parseInt( rect.right - rect.width / 2 - this._domElement.offsetWidth / 2 - parseInt( style['margin-left'], 10 ), 10 ) + 'px';
		this._domElement.style.top = parseInt( rect.top + window.pageYOffset - this._offsetAdminBar - this._domElement.offsetHeight + 1, 10 ) + 'px';
	};

	Toolbar.prototype.start = function() {
		document.addEventListener( 'mouseover', this._onMouseOverBound );
		document.addEventListener( 'mousemove', this._onMouseMoveBound );
		document.addEventListener( 'mouseout', this._onMouseOutBound );
	};

	Toolbar.prototype.stop = function() {
		document.removeEventListener( 'mouseover', this._onMouseOverBound );
		document.removeEventListener( 'mousemove', this._onMouseMoveBound );
		document.removeEventListener( 'mouseout', this._onMouseOutBound );
	};

	Toolbar.prototype._clearTools = function() {
		for ( var i = 0; i < this.tools; i++ ) {
			this.tools[ i ].removeEventListener( 'click', this._updatePositionBound );
		}

		while ( this._domElement.firstChild ) {
			this._domElement.removeChild( this._domElement.firstChild );
		}

		this.tools = [];
	};

	Toolbar.prototype.hide = function() {
		this._domElement.classList.remove('pbs-show');
		this._clearTools();
	};


	return Toolbar;

})();

/* globals ContentTools, __extends, ContentEdit, pbsParams */

ContentTools.Tools.Heading1 = (function(_super) {
	__extends(Heading1, _super);

	function Heading1() {
		return Heading1.__super__.constructor.apply(this, arguments);
	}

	ContentTools.ToolShelf.stow(Heading1, 'h1');

	Heading1.label = pbsParams.labels.heading_label.replace( '%d', '1' );

	Heading1.icon = 'h1';

	Heading1.tagName = 'h1';

	Heading1.shortcut = 'ctrl+1';

	Heading1.canApply = function(element, selection) {
		if ( element.constructor.name === 'ListItemText' ) {
			return false;
		}
		if ( element.constructor.name === 'TableCellText' ) {
			return false;
		}
		return ContentTools.Tools.Paragraph.canApply( element, selection );
	};

	Heading1.apply = function(element, selection, callback) {
		if ( this.isApplied( element ) ) {
			window.PBSEditor.getToolUI( 'paragraph' ).apply( element, selection );
			return;
		}
		// If the element has no content, then add the new element after it.
		if ( ! element.content ) {
			var heading = new ContentEdit.Text( this.tagName );
			element.parent().attach( heading, element.parent().children.indexOf( element ) + 1 );
			heading.focus();
			return callback(true);
		}
		return Heading1.__super__.constructor.apply.call(this, element, selection, callback);
	};

	Heading1.isApplied = function(element) {
		return element.tagName() === this.tagName;
	};

	  return Heading1;

})(ContentTools.Tools.Heading);


ContentTools.Tools.Heading2 = (function(_super) {
	__extends(Heading2, _super);

	function Heading2() {
		return Heading2.__super__.constructor.apply(this, arguments);
	}

	ContentTools.ToolShelf.stow(Heading2, 'h2');

	Heading2.label = pbsParams.labels.heading_label.replace( '%d', '2' );

	Heading2.icon = 'h2';

	Heading2.tagName = 'h2';

	Heading2.shortcut = 'ctrl+2';

	return Heading2;

})(ContentTools.Tools.Heading1);

ContentTools.Tools.Heading3 = (function(_super) {
	__extends(Heading3, _super);

	function Heading3() {
		return Heading3.__super__.constructor.apply(this, arguments);
	}

	ContentTools.ToolShelf.stow(Heading3, 'h3');

	Heading3.label = pbsParams.labels.heading_label.replace( '%d', '3' );

	Heading3.icon = 'h3';

	Heading3.tagName = 'h3';

	Heading3.shortcut = 'ctrl+3';

	return Heading3;

})(ContentTools.Tools.Heading1);


ContentTools.Tools.Heading4 = (function(_super) {
	__extends(Heading4, _super);

	function Heading4() {
		return Heading4.__super__.constructor.apply(this, arguments);
	}

	ContentTools.ToolShelf.stow(Heading4, 'h4');

	Heading4.label = pbsParams.labels.heading_label.replace( '%d', '4' );

	Heading4.icon = 'h4';

	Heading4.tagName = 'h4';

	Heading4.shortcut = 'ctrl+4';

	return Heading4;

})(ContentTools.Tools.Heading1);


ContentTools.Tools.Heading5 = (function(_super) {
	__extends(Heading5, _super);

	function Heading5() {
		return Heading5.__super__.constructor.apply(this, arguments);
	}

	ContentTools.ToolShelf.stow(Heading5, 'h5');

	Heading5.label = pbsParams.labels.heading_label.replace( '%d', '5' );

	Heading5.icon = 'h5';

	Heading5.tagName = 'h5';

	Heading5.shortcut = 'ctrl+5';

	return Heading5;

})(ContentTools.Tools.Heading1);


ContentTools.Tools.Heading6 = (function(_super) {
	__extends(Heading6, _super);

	function Heading6() {
		return Heading6.__super__.constructor.apply(this, arguments);
	}

	ContentTools.ToolShelf.stow(Heading6, 'h6');

	Heading6.label = pbsParams.labels.heading_label.replace( '%d', '6' );

	Heading6.icon = 'h6';

	Heading6.tagName = 'h6';

	Heading6.shortcut = 'ctrl+6';

	return Heading6;

})(ContentTools.Tools.Heading1);

/* globals ContentTools, __extends, pbsParams */

ContentTools.Tools.Blockquote = (function(_super) {
  __extends(Blockquote, _super);

  function Blockquote() {
	return Blockquote.__super__.constructor.apply(this, arguments);
  }

  ContentTools.ToolShelf.stow(Blockquote, 'blockquote');

  Blockquote.label = pbsParams.labels.blockquote;

  Blockquote.icon = 'blockquote';

  Blockquote.tagName = 'blockquote';

  Blockquote.shortcut = 'ctrl+7';

  return Blockquote;

})(ContentTools.Tools.Heading1);



/* globals ContentTools, __extends, pbsParams */



ContentTools.Tools.ClearFormatting = (function(_super) {

  __extends(ClearFormatting, _super);



  function ClearFormatting() {

    return ClearFormatting.__super__.constructor.apply(this, arguments);

  }



  ContentTools.ToolShelf.stow(ClearFormatting, 'clear-formatting');



  ClearFormatting.label = pbsParams.labels.clear_formatting;



  ClearFormatting.icon = 'clear-formatting';



  ClearFormatting.tagName = 'span';





  /**

   * Disable the button if there's NO styling applied in the content.

   */

  ClearFormatting.canApply = function(element, selection) {

  	if ( ! ContentTools.Tools.Bold.canApply( element, selection ) ) {

		return false;

	}



	var from = 0, to = 0, _ref;

	if (element.content === void 0 || ! element.content.length()) {

		return false;

	}



	if ( selection ) {

		_ref = selection.get(), from = _ref[0], to = _ref[1];

	}



	// If nothing is selected, adjust the whole element

	if ( from === to ) {

		from = 0;

		to = element.content.length();

	}



	return element.content.hasStyle(from, to);

  };



  ClearFormatting.apply = function(element, selection, callback) {

	  var from, to, _ref;

	  element.storeState();



	  _ref = selection.get(), from = _ref[0], to = _ref[1];



	  // If nothing is selected, adjust the whole element

	  if ( from === to ) {

		  from = 0;

		  to = element.content.length();

	  }



  	  element.content = element.content.removeStyles( from, to );



  	  element.updateInnerHTML();

  	  element.taint();

  	  element.restoreState();

  	  return callback(true);

  };



  return ClearFormatting;



})(ContentTools.Tool);


/* globals ContentTools, HTMLString, __extends, pbsParams */

ContentTools.Tools.Code = (function(_super) {
	__extends(Code, _super);

	function Code() {
		return Code.__super__.constructor.apply(this, arguments);
	}

	ContentTools.ToolShelf.stow(Code, 'code');

	Code.label = pbsParams.labels.code;

	Code.icon = 'code';

	Code.tagName = 'code';

	Code.shortcut = '';

	// This is the original apply function of Bold that ONLY uses tags.
	Code.apply = function(element, selection, callback) {
		var from, to, _ref;
		element.storeState();
		_ref = selection.get(), from = _ref[0], to = _ref[1];
		if (this.isApplied(element, selection)) {
			element.content = element.content.unformat(from, to, new HTMLString.Tag(this.tagName));
		} else {
			element.content = element.content.format(from, to, new HTMLString.Tag(this.tagName));
		}
		element.updateInnerHTML();
		element.taint();
		element.restoreState();
		return callback(true);
	};

	Code.isApplied = function( element, selection ) {
	 	if ( selection ) {

	 		// From the original Bold.isApplied
	 		var from, to, _ref;
	 		if (element.content === void 0 || !element.content.length()) {
	 			return false;
	 		}
	 		_ref = selection.get(), from = _ref[0], to = _ref[1];
	 		if (from === to) {
	 			to += 1;
	 		}
	 		return element.content.slice(from, to).hasTags(this.tagName, true);
	 	}

		return false;
	};

  return Code;

})(ContentTools.Tools.Bold);

/* globals ContentTools, ContentEdit, __extends, pbsParams */

ContentTools.Tools.Color = (function(_super) {
	__extends(Color, _super);

	function Color() {
		return Color.__super__.constructor.apply(this, arguments);
	}

	ContentTools.ToolShelf.stow(Color, 'color');

	Color.label = pbsParams.labels.color;

	Color.icon = 'color';

	Color.tagName = 'span';

	Color.canApply = function(element, selection) {
		// Don't do anything when there's no text
		if ( ! element.content ) {
			return false;
		}

		var from, to;
		var apply = selection && !selection.isCollapsed();
		var color = '';

		// Find the selected text, if nothing's selected, make the whole area selected.
		if ( apply ) {
			var _ref = selection.get();
			from = _ref[0];
			to = _ref[1];
			if (from === to) {
				to += 1;
			}
		} else {
			from = 0;
			to = element.content.length();
		}

		// Find the color from the span
		var selectedContent = element.content.slice(from, to).html();
		var matches = selectedContent.match( /^<span[^>]style[^>]+['"\s;]color:\s?([#().,\w]+)/ );
		if ( matches ) {
			color = matches[1];
		} else {
		}

		// Change the tool's color to the color found
		if ( ! color ) {
			if ( typeof this._defaultBodyTextColor === 'undefined' ) {
				var s = getComputedStyle( document.body );
				this._defaultBodyTextColor = s.color;
			}
			color = this._defaultBodyTextColor;
		}

		if ( this._ceElement._domElement.style.backgroundColor !== color ) {
			this._ceElement._domElement.style.backgroundColor = color;
		}

		if ( color ) {
			window.PBSEditor.getToolUI( this.icon )._domElement.setAttribute('data-tooltip', this.label + ': ' + color );
		} else {
			window.PBSEditor.getToolUI( this.icon )._domElement.setAttribute('data-tooltip', this.label );
		}


		return true;
	};

	Color.isApplied = function() {
		return false;
	};

	Color.apply = function(element, selection, callback) {
		var from, to, _ref;
		element.storeState();

		// When text has been selected before, change that (the text loses focus when manually entering a color, the text is stored here).
		if ( this.rememberedSelection ) {
			selection = this.rememberedSelection;
		}

		_ref = selection.get(), from = _ref[0], to = _ref[1];

		// If nothing is selected, color the whole element
		if ( from === to ) {
			from = 0;
			to = element.content.length();
		}

		// Get the iris color
		var currColor = jQuery(this._ceElement._domElement.querySelector('input')).iris('color');
		if ( this._ceElement._domElement.querySelector('input').value === '' ) {
			currColor = '';
		}

		// Apply the new color
		element.content = element.content.style( from, to, element._tagName, { 'color': currColor } );

		element.updateInnerHTML();
		element.taint();
		element.restoreState();

		wp.hooks.doAction( 'pbs.tool.color.applied', element );

		return callback(true);
	};


	Color._colorPickerMount = function() {
		var _this = this;
		var d = document.createElement('DIV');
		var o = document.createElement('INPUT');

		// When the input field is clicked, remember if we had text selected before since we lose the focus on that one.
		o.addEventListener('mousedown', function() {
			var element = ContentEdit.Root.get().focused();
	        var selection = null;
	        if (element.selection) {
	          selection = element.selection();
	        }
			var _ref = selection.get(), from = _ref[0], to = _ref[1];
			if ( ! ( from === 0 && to === 0 ) ) {
				_this.rememberedSelection = selection;
			}
		});

		// When typing in the input field, trigger the color to be cleared when empty.
		o.addEventListener('keyup', function(e) {
			if ( e.target.value === '' ) {
				_this.selectedColor = e.target.value;
				_this._ceElement._mouseDown = true; // Stop other tool behavior.
				_this._ceElement._onMouseUp();
				jQuery(_this._ceElement._domElement.querySelector('input')).iris('color', _this.selectedColor);
			}
		});

		// Iris colorpicker makes us lose focus in the input field, always bring it back
		o.addEventListener('blur', function() {
			_this._ceElement._domElement.querySelector('input').focus();
		});

		o.classList.add('color-picker');
		o.setAttribute('data-alpha', 'true');
		d.appendChild(o);
		this._ceElement._domElement.appendChild(d);

		// Initialize the color picker
		jQuery(o).iris({
			defaultColor: this._ceElement._domElement.style.backgroundColor,
			change: function(event){
				if ( ! _this._ceElement._justShowedPicker ) {
					_this.selectedColor = event.target.value;
					_this._ceElement._mouseDown = true;
					_this._ceElement._onMouseUp(event);
				}
				_this._ceElement._justShowedPicker = undefined;
			},
			// a callback to fire when the input is emptied or an invalid color (doesn't work)
			clear: function() {},
			// hide the color picker controls on load
			hide: false,
			// Add our own pretty colors
			palettes: [ '#000', '#fff', '#CF000F', '#D2527F', '#F89406', '#F9BF3B', '#2ECC71', '#19B5FE', '#8E44AD' ]
		});

		// Hide the colorpicker when going out of the inspector
		document.querySelector('.ct-toolbox').addEventListener('mouseleave', function() {
			_this.hidePicker();
		});

		// Close popup if other popups open.
		wp.hooks.addAction( 'pbs.tool.popup.open', function() {
			this.hidePicker();
		}.bind(this));

	};


	Color.hidePicker = function() {
		// Hide the colorpicker container.
		this._ceElement._domElement.firstChild.style.display = '';

		// Forget the previously selected text.
		this.rememberedSelection = null;
	};

	return Color;

})(ContentTools.Tool);



// If another element is selected, hide the color picker
ContentEdit.Root.get().bind('blur', function() {
	var tool = ContentTools.EditorApp.get()._toolbox._toolUIs.color;
	if ( typeof tool !== 'undefined' ) {
		tool.tool.hidePicker();
	}
});


// Implement our own mount event handler.
ContentTools.ToolUI.prototype._colorPickerMountOverride = ContentTools.ToolUI.prototype.mount;
ContentTools.ToolUI.prototype.mount = function(domParent, before) {
	var ret = this._colorPickerMountOverride( domParent, before );
	this.tool._ceElement = this;
	if ( typeof this.tool._colorPickerMount !== 'undefined' ) {
		this.tool._colorPickerMount();
	}
	return ret;
};


// Remove the existing event handlers for the color tool. We are going to use our own
ContentTools.ToolUI.prototype._toolColorAddDOMEventListeners = ContentTools.ToolUI.prototype._addDOMEventListeners;
ContentTools.ToolUI.prototype._addDOMEventListeners = function() {
	if ( this.tool.name === 'Color' ) {
		var _this = this;

		// Cancel the mouse down event to prevent focusing
        this._domElement.addEventListener('mousedown', function(e) {
			if ( e.target.classList.contains('ct-tool') ) {
				e.preventDefault();
			}
		});

		// Show the colorpicker on click
        this._domElement.addEventListener('click', function(e) {
			if ( e.target.classList.contains('ct-tool') ) {

				// Set the input field's value
				_this._domElement.querySelector('input').value = _this._domElement.style.backgroundColor;

				// Set the color
				_this._justShowedPicker = true; // Do not implement the selected color when just showing the picker
				jQuery(_this._domElement.querySelector('input')).iris('color', _this._domElement.style.backgroundColor);

				// Let others know that we're going to open a popup.
				if ( _this._domElement.firstChild.style.display === '' ) {
					wp.hooks.doAction( 'pbs.tool.popup.open' );
				}

				// Show the color picker
				_this._domElement.firstChild.style.display = _this._domElement.firstChild.style.display ? '' : 'block';

				// Don't lose the focus when a palette color is clicked
				var elements = _this._domElement.querySelectorAll('.iris-palette');
				Array.prototype.forEach.call(elements, function(el){
					if ( typeof el._pbsInitDone === 'undefined' ) {
						el._pbsInitDone = true;
						el.addEventListener('mousedown', function(e) {
							e.preventDefault();
						});
					}
				});
			}
        });

	// Normal process
	} else {
		return this._toolColorAddDOMEventListeners();
	}
};

/* globals ContentEdit, ContentTools, __extends, pbsParams, PBSEditor */

ContentTools.Tools.TwoColumn = (function(_super) {
	__extends(OneColumn, _super);

	function OneColumn() {
		return OneColumn.__super__.constructor.apply(this, arguments);
	}

	ContentTools.ToolShelf.stow(OneColumn, 'onecolumn');

	OneColumn.label = pbsParams.labels.one_column;

	OneColumn.icon = 'onecolumn';

	OneColumn.tagName = 'onecolumn';

	OneColumn.buttonName = pbsParams.labels.one_column;

	OneColumn.apply = function(element, selection, callback) {
		var row = new ContentEdit.DivRow('div');
		var col = new ContentEdit.DivCol('div');
		var p = new ContentEdit.Text('p', {}, '');
		var index = element.parent().children.indexOf(element);

		element.parent().attach( row, index + 1 );
		row.attach(col);
		col.attach(p);

		element.blur();
		p.focus();

		row.showOutline();

		wp.hooks.doAction( 'pbs.tool.row.applied', row );
		return callback( true );
	};

	return OneColumn;

} )( ContentTools.Tools.ElementButton );


ContentTools.Tools.TwoColumn = (function(_super) {
	__extends(TwoColumn, _super);

	function TwoColumn() {
		return TwoColumn.__super__.constructor.apply(this, arguments);
	}

	ContentTools.ToolShelf.stow(TwoColumn, 'twocolumn');

	TwoColumn.label = pbsParams.labels.two_column;

	TwoColumn.icon = 'twocolumn';

	TwoColumn.tagName = 'twocolumn';

	TwoColumn.buttonName = pbsParams.labels.two_column;

	TwoColumn.apply = function(element, selection, callback) {

		var row = new ContentEdit.DivRow('div');
		var col = new ContentEdit.DivCol('div');
		var p = new ContentEdit.Text('p', {}, '');
		var index = element.parent().children.indexOf(element);

		element.parent().attach( row, index + 1 );
		row.attach(col);
		col.attach(p);

		element.blur();
		p.focus();

		col = new ContentEdit.DivCol('div');
		p = new ContentEdit.Text('p', {}, '');

		row.attach(col);
		col.attach(p);

		row.showOutline();
		return callback( true );
	};

	return TwoColumn;

} )( ContentTools.Tools.ElementButton );


ContentTools.Tools.ThreeColumn = (function(_super) {
	__extends(ThreeColumn, _super);

	function ThreeColumn() {
		return ThreeColumn.__super__.constructor.apply(this, arguments);
	}

	ContentTools.ToolShelf.stow(ThreeColumn, 'threecolumn');

	ThreeColumn.label = pbsParams.labels.three_column;

	ThreeColumn.icon = 'threecolumn';

	ThreeColumn.tagName = 'threecolumn';

	ThreeColumn.buttonName = pbsParams.labels.three_column;

	ThreeColumn.apply = function(element, selection, callback) {

		var row = new ContentEdit.DivRow('div');
		var col = new ContentEdit.DivCol('div');
		var p = new ContentEdit.Text('p', {}, '');
		var index = element.parent().children.indexOf(element);

		element.parent().attach( row, index + 1 );
		row.attach(col);
		col.attach(p);

		element.blur();
		p.focus();

		col = new ContentEdit.DivCol('div');
		p = new ContentEdit.Text('p', {}, '');

		row.attach(col);
		col.attach(p);

		col = new ContentEdit.DivCol('div');
		p = new ContentEdit.Text('p', {}, '');

		row.attach(col);
		col.attach(p);

		row.showOutline();
		return callback( true );
	};

	return ThreeColumn;

} )( ContentTools.Tools.ElementButton );


ContentTools.Tools.FourColumn = (function(_super) {
	__extends(FourColumn, _super);

	function FourColumn() {
		return FourColumn.__super__.constructor.apply(this, arguments);
	}

	ContentTools.ToolShelf.stow(FourColumn, 'fourcolumn');

	FourColumn.label = pbsParams.labels.four_column;

	FourColumn.icon = 'fourcolumn';

	FourColumn.tagName = 'fourcolumn';

	FourColumn.buttonName = pbsParams.labels.four_column;

	FourColumn.apply = function(element, selection, callback) {

		var row = new ContentEdit.DivRow('div');
		var col = new ContentEdit.DivCol('div');
		var p = new ContentEdit.Text('p', {}, '');
		var index = element.parent().children.indexOf(element);

		element.parent().attach( row, index + 1 );
		row.attach(col);
		col.attach(p);

		element.blur();
		p.focus();

		col = new ContentEdit.DivCol('div');
		p = new ContentEdit.Text('p', {}, '');

		row.attach(col);
		col.attach(p);

		col = new ContentEdit.DivCol('div');
		p = new ContentEdit.Text('p', {}, '');

		row.attach(col);
		col.attach(p);

		col = new ContentEdit.DivCol('div');
		p = new ContentEdit.Text('p', {}, '');

		row.attach(col);
		col.attach(p);

		row.showOutline();
		return callback( true );
	};

	return FourColumn;

} )( ContentTools.Tools.ElementButton );




/* globals ContentTools, ContentEdit, __extends, pbsParams */
/*
ContentTools.Tools.Row = (function(_super) {
	__extends(Row, _super);

	function Row() {
		return Row.__super__.constructor.apply(this, arguments);
	}

	ContentTools.ToolShelf.stow(Row, 'row');

	Row.label = pbsParams.labels.add_row;

	Row.icon = 'row';

	Row.tagName = 'div';

	Row.shortcut = 'ctrl+shift+1';

	Row.canApply = function() {
		return true;
	};

	Row.apply = function(element, selection, callback) {

		var row = new ContentEdit.DivRow('div');
		var col = new ContentEdit.DivCol('div');
		var p = new ContentEdit.Text('p', {}, '');
		var index = element.parent().children.indexOf(element);

		element.parent().attach( row, index + 1 );
		row.attach(col);
		col.attach(p);

		element.blur();
		p.focus();

		row.showOutline();

		wp.hooks.doAction( 'pbs.tool.row.applied', row );

		return callback(true);
	};

	return Row;

})(ContentTools.Tool);


ContentTools.Tools.Column2 = (function(_super) {
	__extends(Column2, _super);

	function Column2() {
		return Column2.__super__.constructor.apply(this, arguments);
	}

	ContentTools.ToolShelf.stow(Column2, 'column2');

	Column2.label = pbsParams.labels.add_2_column_row;

	Column2.icon = 'column-2';

	Column2.tagName = 'div';

	Column2.shortcut = 'ctrl+shift+2';

	Column2.canApply = function() {
		return true;
	};

	Column2.apply = function(element, selection, callback) {

		var row = new ContentEdit.DivRow('div');
		var col = new ContentEdit.DivCol('div');
		var p = new ContentEdit.Text('p', {}, '');
		var index = element.parent().children.indexOf(element);

		element.parent().attach( row, index + 1 );
		row.attach(col);
		col.attach(p);

		element.blur();
		p.focus();

		col = new ContentEdit.DivCol('div');
		p = new ContentEdit.Text('p', {}, '');

		row.attach(col);
		col.attach(p);

		row.showOutline();

		return callback(true);
	};

	return Column2;

})(ContentTools.Tool);


ContentTools.Tools.Column3 = (function(_super) {
	__extends(Column3, _super);

	function Column3() {
		return Column3.__super__.constructor.apply(this, arguments);
	}

	ContentTools.ToolShelf.stow(Column3, 'column3');

	Column3.label = pbsParams.labels.add_3_column_row;

	Column3.icon = 'column-3';

	Column3.tagName = 'div';

	Column3.shortcut = 'ctrl+shift+3';

	Column3.canApply = function() {
		return true;
	};

	Column3.apply = function(element, selection, callback) {

		var row = new ContentEdit.DivRow('div');
		var col = new ContentEdit.DivCol('div');
		var p = new ContentEdit.Text('p', {}, '');
		var index = element.parent().children.indexOf(element);

		element.parent().attach( row, index + 1 );
		row.attach(col);
		col.attach(p);

		element.blur();
		p.focus();

		col = new ContentEdit.DivCol('div');
		p = new ContentEdit.Text('p', {}, '');

		row.attach(col);
		col.attach(p);

		col = new ContentEdit.DivCol('div');
		p = new ContentEdit.Text('p', {}, '');

		row.attach(col);
		col.attach(p);

		row.showOutline();

		return callback(true);
	};

	return Column3;

})(ContentTools.Tool);


ContentTools.Tools.Column4 = (function(_super) {
	__extends(Column4, _super);

	function Column4() {
		return Column4.__super__.constructor.apply(this, arguments);
	}

	ContentTools.ToolShelf.stow(Column4, 'column4');

	Column4.label = pbsParams.labels.add_4_column_row;

	Column4.icon = 'column-4';

	Column4.tagName = 'div';

	Column4.shortcut = 'ctrl+shift+4';

	Column4.canApply = function() {
		return true;
	};

	Column4.apply = function(element, selection, callback) {

		var row = new ContentEdit.DivRow('div');
		var col = new ContentEdit.DivCol('div');
		var p = new ContentEdit.Text('p', {}, '');
		var index = element.parent().children.indexOf(element);

		element.parent().attach( row, index + 1 );
		row.attach(col);
		col.attach(p);

		element.blur();
		p.focus();

		col = new ContentEdit.DivCol('div');
		p = new ContentEdit.Text('p', {}, '');

		row.attach(col);
		col.attach(p);

		col = new ContentEdit.DivCol('div');
		p = new ContentEdit.Text('p', {}, '');

		row.attach(col);
		col.attach(p);

		col = new ContentEdit.DivCol('div');
		p = new ContentEdit.Text('p', {}, '');

		row.attach(col);
		col.attach(p);

		row.showOutline();

		return callback(true);
	};

	return Column4;

})(ContentTools.Tool);


ContentTools.Tools.Column233 = (function(_super) {
	__extends(Column233, _super);

	function Column233() {
		return Column233.__super__.constructor.apply(this, arguments);
	}

	ContentTools.ToolShelf.stow(Column233, 'column233');

	Column233.label = pbsParams.labels.add_23_13_column_row;

	Column233.icon = 'column-23-3';

	Column233.tagName = 'div';

	Column233.shortcut = 'ctrl+shift+5';

	Column233.canApply = function() {
		return true;
	};

	Column233.apply = function(element, selection, callback) {

		var row = new ContentEdit.DivRow('div');
		var col = new ContentEdit.DivCol('div');
		var p = new ContentEdit.Text('p', {}, '');
		var index = element.parent().children.indexOf(element);

		element.parent().attach( row, index + 1 );
		row.attach(col);
		col.attach(p);

		col.style( 'flex-grow', '2' );

		element.blur();
		p.focus();

		col = new ContentEdit.DivCol('div');
		p = new ContentEdit.Text('p', {}, '');

		row.attach(col);
		col.attach(p);

		row.showOutline();

		return callback(true);
	};

	return Column233;

})(ContentTools.Tool);


ContentTools.Tools.Column323 = (function(_super) {
	__extends(Column323, _super);

	function Column323() {
		return Column323.__super__.constructor.apply(this, arguments);
	}

	ContentTools.ToolShelf.stow(Column323, 'column323');

	Column323.label = pbsParams.labels.add_13_23_column_row;

	Column323.icon = 'column-3-23';

	Column323.tagName = 'div';

	Column323.canApply = function() {
		return true;
	};

	Column323.apply = function(element, selection, callback) {

		var row = new ContentEdit.DivRow('div');
		var col = new ContentEdit.DivCol('div');
		var p = new ContentEdit.Text('p', {}, '');
		var index = element.parent().children.indexOf(element);

		element.parent().attach( row, index + 1 );
		row.attach(col);
		col.attach(p);

		element.blur();
		p.focus();

		col = new ContentEdit.DivCol('div');
		p = new ContentEdit.Text('p', {}, '');

		row.attach(col);
		col.attach(p);

		col.style( 'flex-grow', '2' );

		row.showOutline();

		return callback(true);
	};

	return Column323;

})(ContentTools.Tool);


ContentTools.Tools.Column424 = (function(_super) {
	__extends(Column424, _super);

	function Column424() {
		return Column424.__super__.constructor.apply(this, arguments);
	}

	ContentTools.ToolShelf.stow(Column424, 'column424');

	Column424.label = pbsParams.labels.add_14_12_14_column_row;

	Column424.icon = 'column-4-2-4';

	Column424.tagName = 'div';

	Column424.shortcut = 'ctrl+shift+6';

	Column424.canApply = function() {
		return true;
	};

	Column424.apply = function(element, selection, callback) {

		var row = new ContentEdit.DivRow('div');
		var col = new ContentEdit.DivCol('div');
		var p = new ContentEdit.Text('p', {}, '');
		var index = element.parent().children.indexOf(element);

		element.parent().attach( row, index + 1 );
		row.attach(col);
		col.attach(p);

		col = new ContentEdit.DivCol('div');
		p = new ContentEdit.Text('p', {}, '');

		row.attach(col);
		col.attach(p);

		col.style( 'flex-grow', '2' );

		col = new ContentEdit.DivCol('div');
		p = new ContentEdit.Text('p', {}, '');

		row.attach(col);
		col.attach(p);

		element.blur();
		p.focus();

		row.showOutline();

		return callback(true);
	};

	return Column424;

})(ContentTools.Tool);


ContentTools.Tools.ColumnCustom = (function(_super) {
	__extends(ColumnCustom, _super);

	function ColumnCustom() {
		return ColumnCustom.__super__.constructor.apply(this, arguments);
	}

	ContentTools.ToolShelf.stow(ColumnCustom, 'column-custom');

	ColumnCustom.label = pbsParams.labels.add_n_column_row;

	ColumnCustom.icon = 'column-custom';

	ColumnCustom.tagName = 'div';

	ColumnCustom.canApply = function() {
		return true;
	};

	ColumnCustom.apply = function(element, selection, callback) {

		var row = new ContentEdit.DivRow('div');
		var col = new ContentEdit.DivCol('div');
		var p = new ContentEdit.Text('p', {}, '');
		var index = element.parent().children.indexOf(element);

		element.parent().attach( row, index + 1 );
		row.attach(col);
		col.attach(p);

		element.blur();
		p.focus();

		col = new ContentEdit.DivCol('div');
		p = new ContentEdit.Text('p', {}, '');

		row.attach(col);
		col.attach(p);

		row.showOutline();

		return callback(true);
	};

	return ColumnCustom;

})(ContentTools.Tool);
*/

/* globals ContentTools, __extends, pbsParams */

ContentTools.Tools.AlignJustify = (function(_super) {
	__extends(AlignJustify, _super);

	function AlignJustify() {
		return AlignJustify.__super__.constructor.apply(this, arguments);
	}

	ContentTools.ToolShelf.stow( AlignJustify, 'align-justify' );

	AlignJustify.label = pbsParams.labels.justify;

	AlignJustify.icon = 'align-justify';

	AlignJustify.className = '';

	AlignJustify.apply = function(element, selection, callback) {
		var _ref;
		if ((_ref = element.constructor.name) === 'ListItemText' || _ref === 'TableCellText') {
			element = element.parent();
		}
		element.style( 'textAlign', 'justify' );
		return callback(true);
	};

 	AlignJustify.isApplied = function(element, selection) {
  		var _ref;
		if ( ! this.canApply( element ) ) {
			return false;
		}
		if ( ( _ref = element.type() ) === 'ListItemText' || _ref === 'TableCellText' ) {
			element = element.parent();
		}
		return element.style( 'textAlign' ) === 'justify';
	};

	return AlignJustify;

})(ContentTools.Tools.AlignLeft);

/* globals ContentEdit, ContentTools, __extends, pbsParams */

ContentTools.Tools.Sidebar = (function(_super) {
	__extends(Sidebar, _super);

	function Sidebar() {
		return Sidebar.__super__.constructor.apply( this, arguments );
	}

	ContentTools.ToolShelf.stow( Sidebar, 'sidebar' );

	Sidebar.label = pbsParams.labels.sidebar_or_widget_area;

	Sidebar.icon = 'sidebar';

	Sidebar.tagName = 'sidebar';

	Sidebar.buttonName = pbsParams.labels.sidebar;

	Sidebar.apply = function(element, selection, callback) {

		var defaultSidebar = '';
		for ( var sidebarID in pbsParams.sidebar_list ) {
			if ( sidebarID ) {
				if ( pbsParams.sidebar_list.hasOwnProperty( sidebarID ) ) {
					defaultSidebar = sidebarID;
					break;
				}
			}
		}

		var shortcode = wp.shortcode.next( 'pbs_sidebar', '[pbs_sidebar id="' + defaultSidebar + '"][/pbs_sidebar]', 0 );
		var newElem = ContentEdit.Shortcode.createShortcode( shortcode );

		var index = element.parent().children.indexOf( element );
		element.parent().attach( newElem, index + 1 );

		newElem.ajaxUpdate( true );
		newElem.focus();

		return callback(true);
	};

	return Sidebar;

} )( ContentTools.Tools.ElementButton );


/* globals ContentEdit, ContentTools, __extends, pbsParams */

ContentTools.Tools.Hr = (function(_super) {
	__extends(Hr, _super);

	function Hr() {
		return Hr.__super__.constructor.apply(this, arguments);
	}

	ContentTools.ToolShelf.stow(Hr, 'hr');

	Hr.label = pbsParams.labels.horizontal_rule;

	Hr.icon = 'hr';

	Hr.tagName = 'hr';

	Hr.shortcut = 'ctrl+h';

	Hr.canApply = function() {
		return true;
	};

	Hr.apply = function(element, selection, callback) {

		var hr = new ContentEdit.Hr('hr');
		var index = element.parent().children.indexOf(element);

		element.parent().attach( hr, index + 1 );

		hr.focus();

		return callback(true);
	};

	return Hr;

})(ContentTools.Tool);

/* globals ContentEdit, ContentTools, __extends, pbsParams, PBSEditor */

ContentTools.Tools.Icon = (function(_super) {
	__extends(Icon, _super);

	function Icon() {
		return Icon.__super__.constructor.apply(this, arguments);
	}

	ContentTools.ToolShelf.stow(Icon, 'icon');

	Icon.label = pbsParams.labels.icon;

	Icon.icon = 'icon';

	Icon.tagName = 'icon';

	Icon.buttonName = pbsParams.labels.icon;

	Icon.apply = function(element, selection, callback) {

		PBSEditor.iconFrame.open({
			title: pbsParams.labels.insert_icon,
			button: pbsParams.labels.use_icon,
			successCallback: function( view ) {
				var newElem = new ContentEdit.Icon( 'div', {}, view.selected.innerHTML );
				var index = element.parent().children.indexOf( element );
				element.parent().attach( newElem, index + 1 );
				newElem.focus();
			}
		});
		return callback( true );
	};

	return Icon;

} )( ContentTools.Tools.ElementButton );

/* globals ContentTools, wpLink, HTMLString, ContentSelect */


/**
 * Allow links to be placed when nothin is selected for link insertion.
 */
ContentTools.Tools.Link._pbsToolLinkOverrideCanApply = ContentTools.Tools.Link.canApply;
ContentTools.Tools.Link.canApply = function(element, selection) {
	var ret = this._pbsToolLinkOverrideCanApply( element, selection );
	if ( ! ret ) {
		if ( element.content && selection ) {
			var _ref = selection.get(), from = _ref[0], to = _ref[1];
			if ( from === to ) {
				return true;
			}
		}
	}
	return ret;
};


ContentTools.Tools.Link.getSelectedLink = function( element, from, to ) {
	// The start should be the start of the link block if possible.
	if ( from < element.content.characters.length && from >= 0 ) {
		if ( element.content.characters[ from ].hasTags( 'a' ) ) {
			while ( from > 0 ) {
				from--;
				if ( ! element.content.characters[ from ].hasTags( 'a' ) ) {
					from++;
					break;
				}
			}
		}
	}

	// The end should be the end of the link block is possible.
	if ( to < element.content.characters.length && to >= 0 ) {
		if ( element.content.characters[ to ].hasTags( 'a' ) ) {
			while ( to < element.content.characters.length ) {
				if ( ! element.content.characters[ to ].hasTags( 'a' ) ) {
					break;
				}
				to++;
			}
		}
	}

	return { from: from, to: to };
};

/**
 * Open the link dialog when clicking the link tool.
 */
ContentTools.Tools.Link.apply = function(element, selection, callback) {

	if (element.constructor.name === 'Image') {
		element.openMediaManager();
		return;
	}

	// Get the selected text.
	var _ref = selection.get(), from = _ref[0], to = _ref[1];

	var selected = this.getSelectedLink( element, from, to );
	from = selected.from;
	to = selected.to;

	// Adjust the selection since for links we are selecting whole blocks of links.
	selection = new ContentSelect.Range( from, to );

	// Get the details of the link.
	var tag = this.getTag( element, selection );
	var url = '', target = '', text = '', existingClass = '', existingStyles = '';

	if ( tag ) {
		// Editing an existing link
		if ( tag.attr( 'href' ) ) {
			url = tag.attr( 'href' );
		}
		if ( tag.attr( 'target' ) ) {
			target = tag.attr( 'target' );
		}
		if ( tag.attr( 'class' ) ) {
			existingClass = tag.attr( 'class' );
		}
		if ( tag.attr( 'style' ) ) {
			existingStyles = tag.attr( 'style' );
		}
	}

	text = element.content.unformat( from, to, 'a' );
	text = text.slice( from, to );

	// Remember the cursor position.
	if ( element.storeState ) {
		element.storeState();
	}

	// Open the link dialog box.
	// @see http://stackoverflow.com/questions/11812929/use-wordpress-link-insert-dialog-in-metabox
	wpLink.open( 'dummy-wplink-textarea' );

	// If the selected text is plain (without formatting), display the text.
	if ( text.html().trim() === text.text().trim() ) {
		document.querySelector( '#wp-link-wrap' ).classList.add( 'has-text-field' );
		text = text.text();
	} else {
		document.querySelector( '#wp-link-wrap' ).classList.remove( 'has-text-field' );
		text = '';
	}

	// Set the field values.
	document.querySelector('#wp-link-url').value = url;
	document.querySelector('#wp-link-text').value = text;
	document.querySelector('#wp-link-target').checked = target !== '';

	window._pbsCurrentLink = {
		element: element,
		selection: selection,
		existingClass: existingClass,
		existingStyles: existingStyles,
		type: this.name
	};

	return callback(true);
};


/**
 * Save the link when the link modal save button is clicked.
 */
window.addEventListener( 'DOMContentLoaded', function() {
	document.addEventListener( 'click', function(ev) {
		if ( ev.target.getAttribute( 'id' ) === 'wp-link-submit' ) {

			var element = window._pbsCurrentLink.element,
				selection = window._pbsCurrentLink.selection,
				existingClass = window._pbsCurrentLink.existingClass,
				existingStyles = window._pbsCurrentLink.existingStyles,
				linkType = window._pbsCurrentLink.type;

			// Remove any old links.
			var _ref = selection.get(), from = _ref[0], to = _ref[1];
			// var currentSelection = element.content.substring(from, to);
			// if ( currentSelection.hasTags( 'a' ) ) {
			// 	var tags = currentSelection.charAt(0).tags();
			// 	for ( var i = 0; i < tags.length; i++ ) {
			// 		if ( tags[ i ].name() === 'a' ) {
			// 			if ( tags[ i ].attr( 'class' ) ) {
			// 				existingClass += existingClass ? ' ' : '';
			// 				existingClass += tags[ i ].attr( 'class' );
			// 				break;
			// 			}
			// 		}
			// 	}
			// }
			element.content = element.content.unformat(from, to, 'a');

			var url = document.querySelector('#wp-link-url').value,
				text = document.querySelector('#wp-link-text').value,
				target = document.querySelector('#wp-link-target').checked;

			if ( url ) {
				var args = {
					href: url
				};
				if ( target ) {
					args.target = '_blank';
				}
				if ( existingClass ) {
					args['class'] = existingClass;
				}
				if ( existingStyles ) {
					args['style'] = existingStyles;
				}

				args = wp.hooks.applyFilters( 'pbs.tool.' + linkType.toLowerCase() + '.args', args );

				// If we CAN edit the text (meaning the text doesn't have fancy formatting),
				// and it's blank, use the URL as the text instead. This is WP's behavior.
				if ( document.querySelector( '#wp-link-wrap' ).classList.contains( 'has-text-field' ) && text.trim() === '' ) {
					text = url;
				}

				if ( text ) {

					// Create the new content.
					var content = new HTMLString.String( text, element.constructor.name === 'PreText' );
					content = content.format( 0, content.characters.length, new HTMLString.Tag( 'a', args ) );

					// Replace the old content with the new one.
					var tip = element.content.substring(0, selection.get()[0]);
					var tail = element.content.substring(selection.get()[1]);
					element.content = tip.concat(content);
					element.content = element.content.concat(tail, false);

					if ( from === to ) {
						to += content.length();
					}

				} else {
					// Just format it.
					element.content = element.content.format( from, to, new HTMLString.Tag( 'a', args ) );
				}

			} else {
				element.content = element.content.unformat( from, to, 'a' );
			}

			delete window._pbsCurrentLink;
			wp.hooks.doAction( 'pbs.tool.' + linkType.toLowerCase() + '.applied', element, from, to );

			element.updateInnerHTML();
			element.taint();

			// Restore the caret position.
			if ( element.restoreState ) {
				element.restoreState();
			}

			// Update the inspector.
			window.updateInspector();

			wpLink.close();
		}
	} );
} );


/**
 * Originally from Link.getHref, modified to get the Tag object only.
 */
ContentTools.Tools.Link.getTag = function(element, selection) {
  var c, from, selectedContent, tag, to, _i, _j, _len, _len1, _ref, _ref1, _ref2;
  if (element.constructor.name === 'Image') {
	if (element.a) {
	  return element.a;
	}
  } else {
	_ref = selection.get(), from = _ref[0], to = _ref[1];
	selectedContent = element.content.slice(from, to);
	_ref1 = selectedContent.characters;
	for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
	  c = _ref1[_i];
	  if (!c.hasTags('a')) {
		continue;
	  }
	  _ref2 = c.tags();
	  for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
		tag = _ref2[_j];
		if (tag.name() === 'a') {
			return tag;
		}
	  }
	}
  }
  return null;
};

/* globals ContentEdit, ContentTools, __extends, PBSEditor, pbsParams */

ContentTools.Tools.Widget = (function(_super) {
	__extends(Widget, _super);

	function Widget() {
		return Widget.__super__.constructor.apply(this, arguments);
	}

	ContentTools.ToolShelf.stow(Widget, 'widget');

	Widget.label = pbsParams.labels.widget;

	Widget.icon = 'widget';

	Widget.tagName = 'widget';

	Widget.buttonName = pbsParams.labels.widget;

	Widget.apply = function(element, selection, callback) {
		PBSEditor.widgetFrame.open({
			title: pbsParams.labels.insert_widget,
			button: pbsParams.labels.insert_widget,
			successCallback: function( view ) {

				var root = ContentEdit.Root.get();
				var elemFocused = null;
		        if ( root.focused() ) {
					elemFocused = root.focused();
				} else {
					var mainRegion = ContentTools.EditorApp.get().regions()['main-content'];
					if ( mainRegion.children ) {
						elemFocused = mainRegion.children[0];
					}
				}

				var base = 'pbs_widget';
				var widgetSlug = view.selected.getAttribute( 'data-widget-slug' );
				var shortcodeRaw = '[pbs_widget widget="' + widgetSlug + '" ]';
				var shortcode = wp.shortcode.next( base, shortcodeRaw, 0 );
				var elem = ContentEdit.Shortcode.createShortcode( shortcode );

				var index = elemFocused.parent().children.indexOf( elemFocused );
				elemFocused.parent().attach( elem, index + 1 );

				elem.focus();

				setTimeout( function() {
					elem.ajaxUpdate( true );
				}, 20 );
			}
		});
		return callback( true );
	};

	return Widget;

} )(ContentTools.Tools.ElementButton );

/* globals ContentEdit, ContentTools, __extends, pbsParams */

ContentTools.Tools.Html = (function(_super) {
	__extends(Html, _super);

	function Html() {
		return Html.__super__.constructor.apply(this, arguments);
	}

	ContentTools.ToolShelf.stow(Html, 'html');

	Html.label = pbsParams.labels.html;

	Html.icon = 'html';

	Html.tagName = 'html';

	Html.buttonName = pbsParams.labels.html;

	Html.apply = function(element, selection, callback) {

		var root = ContentEdit.Root.get();
		var elemFocused = null;
        if ( root.focused() ) {
			elemFocused = root.focused();
		} else {
			var mainRegion = ContentTools.EditorApp.get().regions()['main-content'];
			if ( mainRegion.children ) {
				elemFocused = mainRegion.children[0];
			}
		}

		var dummy = document.createElement( 'DIV' );
		dummy.setAttribute( 'data-ce-tag', 'html' );
		var elem = ContentEdit.Html.fromDOMElement( dummy );
		var index = elemFocused.parent().children.indexOf( elemFocused );
		elemFocused.parent().attach( elem, index + 1 );

		elem.focus();
		elem.openEditor();

		return callback( true );
	};

	return Html;

} )( ContentTools.Tools.ElementButton );

/* globals ContentEdit, ContentTools, __extends, pbsParams */

ContentTools.Tools.Map = ( function( _super ) {
	__extends( Map, _super );

	function Map() {
		return Map.__super__.constructor.apply( this, arguments );
	}

	ContentTools.ToolShelf.stow( Map, 'map' );

	Map.label = pbsParams.labels.map;

	Map.icon = 'map';

	Map.tagName = 'div';

	Map.shortcut = '';

	Map.buttonName = pbsParams.labels.map;

	// Map.premium = true;

	Map.apply = function( element, selection, callback ) {

		var newElem = ContentEdit.Map.create();

		var index = element.parent().children.indexOf( element );

		element.parent().attach( newElem, index + 1 );

		newElem.focus();

		return callback( true );
	};

	return Map;

} )( ContentTools.Tools.ElementButton );

/* globals ContentEdit, ContentTools, __extends, pbsParams */

ContentTools.Tools.Tabs = ( function( _super ) {
	__extends( Tabs, _super );

	function Tabs() {
		return Tabs.__super__.constructor.apply( this, arguments );
	}

	ContentTools.ToolShelf.stow( Tabs, 'tabs' );

	Tabs.label = pbsParams.labels.tabs;

	Tabs.icon = 'tabs';

	Tabs.tagName = 'tabs';

	Tabs.buttonName = pbsParams.labels.tabs;

	Tabs.premium = true;

	Tabs.apply = function(element, selection, callback) {

		var hashes = [];
		while ( hashes.length < 4 ) {
			var hash = window.PBSEditor.generateHash();
			if ( document.querySelector( '.pbs-tabs-' + hash ) ) {
				continue;
			}
			if ( document.querySelector( '[id="pbs-tabs-' + hash + '"]' ) ) {
				continue;
			}
			if ( hashes.indexOf( hash ) !== -1 ) {
				continue;
			}
			hashes.push( hash );
		}

		var elem = document.createElement( 'div' );
		elem.classList.add( 'pbs-tabs-' + hashes[0] );
		elem.setAttribute( 'data-ce-tag', 'tabs' );

		/* jshint multistr: true */
		elem.innerHTML =
			'<input class="pbs-tab-state" type="radio" name="pbs-tabs-' + hashes[0] + '" id="pbs-tab-' + hashes[1] + '" data-tab="1" data-ce-tag="tabradio" checked />' +
			'<input class="pbs-tab-state" type="radio" name="pbs-tabs-' + hashes[0] + '" id="pbs-tab-' + hashes[2] + '" data-tab="2" data-ce-tag="tabradio" />' +
			'<input class="pbs-tab-state" type="radio" name="pbs-tabs-' + hashes[0] + '" id="pbs-tab-' + hashes[3] + '" data-tab="3" data-ce-tag="tabradio" />' +
			'<div class="pbs-tab-tabs" data-ce-tag="tabcontainer">' +
		        '<label for="pbs-tab-' + hashes[1] + '" data-ce-tag="tab" class="pbs-tab-active"><span style="font-weight: bold;">Tab 1</span></label>' +
		        '<label for="pbs-tab-' + hashes[2] + '" data-ce-tag="tab"><span style="font-weight: bold;">Tab 2</span></label>' +
		        '<label for="pbs-tab-' + hashes[3] + '" data-ce-tag="tab"><span style="font-weight: bold;">Tab 3</span></label>' +
		    '</div>' +
			'<div class="pbs-tab-panels" data-ce-tag="tabpanelcontainer">' +
				'<div class="pbs-row" data-panel="1"><div class="pbs-col"><p>Tab 1 content</p></div></div>' +
				'<div class="pbs-row" data-panel="2"><div class="pbs-col"><p>Tab 2 content</p></div></div>' +
				'<div class="pbs-row" data-panel="3"><div class="pbs-col"><p>Tab 3 content</p></div></div>' +
			'</div>';

		var newElem = ContentEdit.Tabs.fromDOMElement( elem );

		// Don't allow tabs to be created inside tabs, create it after the current tabs.
		if ( window.pbsSelectorMatches( element._domElement, '[data-ce-tag="tabs"] *' ) ) {
			while ( element && element.constructor.name !== 'Tabs' ) {
				element = element.parent();
			}
		}

		var index = element.parent().children.indexOf( element );
		element.parent().attach( newElem, index + 1 );

		newElem.focus();

		return callback(true);
	};

	return Tabs;

} )( ContentTools.Tools.ElementButton );



/* globals ContentTools, ContentEdit, ContentSelect, __extends, pbsParams */



// The Media Manager window needs to know our post ID so that Insert from URL will work.

if ( wp.media.view.settings.post ) {

	wp.media.view.settings.post.id = pbsParams.post_id;

}



ContentTools.Tools.pbsMedia = (function(_super) {

	__extends(pbsMedia, _super);



	function pbsMedia() {

		return pbsMedia.__super__.constructor.apply(this, arguments);

	}



	ContentTools.ToolShelf.stow(pbsMedia, 'pbs-media');



	pbsMedia.label = pbsParams.labels.media;



	pbsMedia.icon = 'image';



	pbsMedia.shortcut = 'ctrl+m';



	pbsMedia.buttonName = pbsParams.labels.media;



	pbsMedia.apply = function(element, selection) {

		if ( this._isOpen() ) {

			return;

		}



		var root = ContentEdit.Root.get();

		var elem = root.focused();



        ContentSelect.Range.query(elem._domElement);

        selection = ContentSelect.Range.query(elem._domElement);

		window._tempSelection = selection;



		// We override the insert function to make this insert in CT.

		window._pbsAddMediaOrigInsert = wp.media.editor.insert;

		wp.media.editor.insert = this.pbsAddMediaOverrideInsert;



		wp.media.editor.open();

	};



	pbsMedia._isOpen = function() {

		// The editor is not present at the start.

		if ( ! wp.media.editor.get() ) {

			return false;

		}



		// Check if the media manager window is visible.

		var el = wp.media.editor.get().el;

		return ! ( el.offsetWidth === 0 && el.offsetHeight === 0 );

	};



	pbsMedia.pbsAddMediaOverrideInsert = function( html ) {



	    var index, newElem, root = ContentEdit.Root.get();



		// Blur the currently selected element.

	    if ( root.focused() ) {

			var elem = root.focused();



			// If adding an image, add an Image Element.

			var addedImage = false;

			if ( ! html.match( /^\[/ ) ) {

				var dummy = document.createElement('p');

				dummy.innerHTML = html;

				newElem = ContentEdit.Image.fromDOMElement( dummy.firstChild );

				if ( newElem ) {

					index = elem.parent().children.indexOf( elem );

					elem.parent().attach( newElem, index + 1 );

					addedImage = true;

					newElem.focus();

				}



			} else {



				var base = html.match( /^\[(\w+)/ );

				base = base[1];

				var shortcode = wp.shortcode.next( base, html, 0 );

				newElem = ContentEdit.Shortcode.createShortcode( shortcode );

				index = elem.parent().children.indexOf( elem );

				elem.parent().attach( newElem, index + 1 );



				newElem.ajaxUpdate( true );

				newElem.focus();



			}

	    }



		// Revert to the original insert function.

		wp.media.editor.insert = window._pbsAddMediaOrigInsert;

		delete window._pbsAddMediaOrigInsert;

	};





	return pbsMedia;



} )( ContentTools.Tools.ElementButton );





/**

 * Open the media tool when an image gets dragged into the screen.

 */

(function() {

	var dragEnterHandler = function() {

		var root = ContentEdit.Root.get();

		var elem = root.focused();

		if ( elem ) {

			window.PBSEditor.getToolUI( 'pbs-media' ).apply( elem, null );

		}

	};



	window.addEventListener( 'DOMContentLoaded', function() {

		var editor = ContentTools.EditorApp.get();

		editor.bind('start', function() {

			document.addEventListener('dragenter', dragEnterHandler);

		});

		editor.bind('stop', function() {

			document.removeEventListener('dragenter', dragEnterHandler);

		});

	});

})();


////= include _tool-toggle-advanced.js
/* globals ContentTools, __extends, pbsParams */

ContentTools.Tools.Underline = (function(_super) {
  __extends(Underline, _super);

  function Underline() {
    return Underline.__super__.constructor.apply(this, arguments);
  }

  ContentTools.ToolShelf.stow(Underline, 'underline');

  Underline.label = pbsParams.labels.underline;

  Underline.icon = 'underline';

  Underline.tagName = 'span';

  Underline.shortcut = 'ctrl+u';

  Underline.canApply = function(element, selection) {
  	return ContentTools.Tools.Bold.canApply( element, selection );
  };

  Underline.isApplied = function(element, selection) {
  	var from = 0, to = 0, _ref;
  	if (element.content === void 0 || !element.content.length()) {
  		return false;
  	}
  	if ( selection ) {
  		_ref = selection.get(), from = _ref[0], to = _ref[1];
  	}

  	// If nothing is selected, adjust the whole element
  	if ( from === to ) {
  		from = 0;
  		to = element.content.length();
  	}

	return element.content.substring(from, to).getStyle('text-decoration', element ) === 'underline';
  };

  Underline.apply = function(element, selection, callback) {
	  var from, to, _ref;
	  element.storeState();

	  _ref = selection.get(), from = _ref[0], to = _ref[1];

	  // If nothing is selected, adjust the whole element
	  if ( from === to ) {
		  from = 0;
		  to = element.content.length();
	  }

	  var style = element.content.substring(from, to).getStyle('text-decoration', element );
	  if ( ! style || style === 'none' || style === 'line-through' ) {
		  style = 'underline';
	  } else {
		  style = 'none';
	  }
	  var newStyle = { 'text-decoration': style };

	  element.content = element.content.style( from, to, element._tagName, newStyle );

	  element.updateInnerHTML();
	  element.taint();
	  element.restoreState();
	  return callback(true);
  };

  return Underline;

})(ContentTools.Tool);

/* globals ContentTools, ContentEdit, __extends, pbsParams */
ContentTools.Tools.paragraphPicker = (function(_super) {
	__extends(paragraphPicker, _super);

	function paragraphPicker() {
		return paragraphPicker.__super__.constructor.apply(this, arguments);
	}

	ContentTools.ToolShelf.stow(paragraphPicker, 'paragraphPicker');

	paragraphPicker.label = pbsParams.labels.text_style;

	paragraphPicker.icon = 'paragraph-picker';

	paragraphPicker.tagName = 'p';

	paragraphPicker.types = {
		p: { className: 'Paragraph', label: pbsParams.labels.paragraph },
		h1: { className: 'Heading1', label: pbsParams.labels.heading_1 },
		h2: { className: 'Heading2', label: pbsParams.labels.heading_2 },
		h3: { className: 'Heading3', label: pbsParams.labels.heading_3 },
		h4: { className: 'Heading4', label: pbsParams.labels.heading_4 },
		h5: { className: 'Heading5', label: pbsParams.labels.heading_5 },
		h6: { className: 'Heading6', label: pbsParams.labels.heading_6 },
		blockquote: { className: 'Blockquote', label: '"' + pbsParams.labels.blockquote + '"' },
		pre: { className: 'Preformatted', label: pbsParams.labels.preformatted }
	};

	paragraphPicker.canApply = function(element) {
		if ( this.types.hasOwnProperty( element.tagName() ) ) {
			for ( var tag in this.types ) {
				if ( ! this.types.hasOwnProperty( tag ) ) {
					continue;
				}
				if ( element.tagName() === tag ) {
					continue;
				}
				if ( this._ceElement._domElement.classList.contains( 'pbs-paragraph-picker-type-' + tag ) ) {
					this._ceElement._domElement.classList.remove( 'pbs-paragraph-picker-type-' + tag );
				}
			}
			if ( ! this._ceElement._domElement.classList.contains( 'pbs-paragraph-picker-type-' + element.tagName() ) ) {
				this._ceElement._domElement.classList.add( 'pbs-paragraph-picker-type-' + element.tagName() );
				this._ceElement._domElement.firstChild.textContent = this.types[ element.tagName() ].label;
			}
		}
  		return element !== void 0;
	};

	paragraphPicker.isApplied = function() {
		return ! this._ceElement._domElement.classList.contains( 'pbs-paragraph-picker-type-p' );
	};

	paragraphPicker.apply = function(element, selection, callback) {
		var app, forceAdd, paragraph, region;
		app = ContentTools.EditorApp.get();
		forceAdd = app.ctrlDown();
		if (ContentTools.Tools.Heading.canApply(element) && !forceAdd) {
			return ContentTools.Tools[ this._selectedClass ].apply( element, selection, callback );
		} else {
		  if (element.parent().type() !== 'Region') {
			element = element.closest(function(node) {
			  return node.parent().type() === 'Region';
			});
		  }
		  region = element.parent();
		  paragraph = new ContentEdit.Text( this._selectedType );
		  region.attach(paragraph, region.children.indexOf(element) + 1);
		  paragraph.focus();
		  return callback(true);
		}
	};


	paragraphPicker._paragraphPickerMount = function() {
		var _this = this;
		var d = document.createElement('DIV');
		for ( var tag in this.types ) {
			if ( ! this.types.hasOwnProperty( tag ) ) {
				continue;
			}

			var label = document.createElement( tag );
			label.innerHTML = this.types[ tag ].label;
			label.setAttribute( 'data-tag', tag );
			label.setAttribute( 'data-class', this.types[ tag ].className );
			d.appendChild( label );

			label.addEventListener( 'mousedown', function(ev) {
				ev.preventDefault();
				this._selectedType = ev.target.getAttribute( 'data-tag' );
				this._selectedClass = ev.target.getAttribute( 'data-class' );
				this._ceElement._mouseDown = true;
				this._ceElement._onMouseUp();
			}.bind( this ) );

		}

		this._ceElement._domElement.innerHTML = pbsParams.labels.paragraph;
		this._ceElement._domElement.appendChild(d);

		// Hide the paragraphpicker when going out of the inspector
		document.querySelector('.ct-toolbox').addEventListener('mouseleave', function() {
			_this.hidePicker();
		});

		// Close popup if other popups open.
		wp.hooks.addAction( 'pbs.tool.popup.open', function() {
			this.hidePicker();
		}.bind(this));
	};


	paragraphPicker.hidePicker = function() {
		// Hide the paragraphpicker container.
		this._ceElement._domElement.querySelector('div').style.display = '';

		// Forget the previously selected text.
		this.rememberedSelection = null;
	};

	return paragraphPicker;

})(ContentTools.Tool);



// If another element is selected, hide the paragraph picker
ContentEdit.Root.get().bind('blur', function() {
	var tool = ContentTools.EditorApp.get()._toolbox._toolUIs.paragraph;
	if ( typeof tool !== 'undefined' ) {
		tool.tool.hidePicker();
	}
});


// Implement our own mount event handler.
(function() {
	var proxied = ContentTools.ToolUI.prototype.mount;
	ContentTools.ToolUI.prototype.mount = function(domParent, before) {
		var ret = proxied.call( this, domParent, before );
		this.tool._ceElement = this;
		if ( typeof this.tool._paragraphPickerMount !== 'undefined' ) {
			this.tool._paragraphPickerMount();
		}
		return ret;
	};
})();


// Remove the existing event handlers for the paragraph tool. We are going to use our own
(function() {
	var proxied = ContentTools.ToolUI.prototype._addDOMEventListeners;
 	ContentTools.ToolUI.prototype._addDOMEventListeners = function() {
		if ( this.tool.name === 'paragraphPicker' ) {
			var _this = this;

			// Cancel the mouse down event to prevent focusing
	        this._domElement.addEventListener('mousedown', function(e) {
				if ( e.target.classList.contains('ct-tool') ) {
					e.preventDefault();
				}
			});

			// Show the paragraphpicker on click
	        this._domElement.addEventListener('click', function(e) {
				if ( e.target.classList.contains('ct-tool') ) {

					// Let others know that we're going to open a popup.
					if ( _this._domElement.querySelector('div').style.display === '' ) {
						wp.hooks.doAction( 'pbs.tool.popup.open' );
					}

					// Show the paragraph picker
					_this._domElement.querySelector('div').style.display = _this._domElement.querySelector('div').style.display ? '' : 'block';

				}
	        });

		// Normal process
		} else {
			return proxied.call( this );
		}
	};
})();

/* globals ContentTools, __extends, pbsParams */

ContentTools.Tools.Strikethrough = (function(_super) {
  __extends(Strikethrough, _super);

  function Strikethrough() {
    return Strikethrough.__super__.constructor.apply(this, arguments);
  }

  ContentTools.ToolShelf.stow(Strikethrough, 'strikethrough');

  Strikethrough.label = pbsParams.labels.strikethrough;

  Strikethrough.icon = 'strikethrough';

  Strikethrough.tagName = 'span';

  Strikethrough.canApply = function(element, selection) {
  	return ContentTools.Tools.Bold.canApply( element, selection );
  };

  Strikethrough.isApplied = function(element, selection) {
  	var from = 0, to = 0, _ref;
  	if (element.content === void 0 || !element.content.length()) {
  		return false;
  	}
  	if ( selection ) {
  		_ref = selection.get(), from = _ref[0], to = _ref[1];
  	}

  	// If nothing is selected, adjust the whole element
  	if ( from === to ) {
  		from = 0;
  		to = element.content.length();
  	}

	return element.content.substring(from, to).getStyle('text-decoration', element ) === 'line-through';
  };

  Strikethrough.apply = function(element, selection, callback) {
	  var from, to, _ref;
	  element.storeState();

	  _ref = selection.get(), from = _ref[0], to = _ref[1];

	  // If nothing is selected, adjust the whole element
	  if ( from === to ) {
		  from = 0;
		  to = element.content.length();
	  }

	  var style = element.content.substring(from, to).getStyle('text-decoration', element );
	  if ( ! style || style === 'none' || style === 'underline' ) {
		  style = 'line-through';
	  } else {
		  style = 'none';
	  }
	  var newStyle = { 'text-decoration': style };

	  element.content = element.content.style( from, to, element._tagName, newStyle );

	  element.updateInnerHTML();
	  element.taint();
	  element.restoreState();
	  return callback(true);
  };

  return Strikethrough;

})(ContentTools.Tool);



/* globals pbsParams */



wp.hooks.addFilter( 'pbs.has_toolbar_selectors', function( selector ) {

	selector.push( '[data-ce-tag="embed"]' );

	return selector;

} );



wp.hooks.addFilter( 'pbs.toolbar_tools', function( tools, toolbar, target ) {



	if ( target.getAttribute( 'data-ce-tag' ) !== 'embed' ) {

		return tools;

	}



	var o = document.createElement('DIV');

	o.classList.add('pbs-tool');

	o.classList.add('pbs-image-edit');

	o.setAttribute('data-tooltip', pbsParams.labels.edit_embed );

	o.addEventListener('click', function() {

		target._ceElement._onDoubleClick();

	});

	tools.push( o );



	o = document.createElement('DIV');

	o.classList.add('pbs-tool');

	o.classList.add('pbs-image-remove');

	o.setAttribute('data-tooltip', pbsParams.labels.remove );

	o.addEventListener('click', function() {

		target._ceElement.parent().detach( target._ceElement );

	});

	tools.push( o );



	return tools;

} );


/* globals pbsParams */

wp.hooks.addFilter( 'pbs.has_toolbar_selectors', function( selector ) {
	selector.push( '.ce-element--type-iframe' );
	return selector;
} );

wp.hooks.addFilter( 'pbs.toolbar_tools', function( tools, toolbar, target ) {

	if ( ! target.classList.contains( 'ce-element--type-iframe' ) ) {
		return tools;
	}

	var o = document.createElement('DIV');
	o.classList.add('pbs-tool');
	o.classList.add('pbs-image-edit');
	o.setAttribute('data-tooltip', pbsParams.labels.edit_embed);
	o.addEventListener('click', function() {
		target._ceElement._onDoubleClick();
	});
	tools.push( o );

	o = document.createElement('DIV');
	o.classList.add('pbs-tool');
	o.classList.add('pbs-image-remove');
	o.setAttribute('data-tooltip', pbsParams.labels.remove);
	o.addEventListener('click', function() {
		target._ceElement.parent().detach( target._ceElement );
	});
	tools.push( o );

	return tools;
} );

/* globals pbsParams */

wp.hooks.addFilter( 'pbs.has_toolbar_selectors', function( selector ) {
	selector.push( '[data-ce-tag="html"]' );
	return selector;
} );

wp.hooks.addFilter( 'pbs.toolbar_tools', function( tools, toolbar, target ) {

	if ( target.getAttribute( 'data-ce-tag' ) !== 'html' ) {
		return tools;
	}

	var o = document.createElement('DIV');
	o.classList.add('pbs-tool-label');
	o.innerHTML = pbsParams.labels.html;
	o.addEventListener('click', function() {
	});
	tools.push( o );

	o = document.createElement('DIV');
	o.classList.add('pbs-tool');
	o.classList.add('pbs-image-edit');
	o.setAttribute('data-tooltip', pbsParams.labels.edit_html);
	o.addEventListener('click', function() {
		target._ceElement.openEditor();
	});
	tools.push( o );

	o = document.createElement('DIV');
	o.classList.add('pbs-tool');
	o.classList.add('pbs-image-remove');
	o.setAttribute('data-tooltip', pbsParams.labels.remove);
	o.addEventListener('click', function() {
        if ( target._ceElement.isFocused() ) {
			target._ceElement.blur();
			if ( target._ceElement.nextContent() ) {
				target._ceElement.nextContent().focus();
			} else if ( target._ceElement.previousContent().focus() ) {
				target._ceElement.previousContent().focus();
			}
		}
		target._ceElement.parent().detach( target._ceElement );
	});
	tools.push( o );

	return tools;
} );

/* globals pbsParams */

wp.hooks.addFilter( 'pbs.has_toolbar_selectors', function( selector ) {
	selector.push( '.ce-element--type-icon' );
	return selector;
} );

wp.hooks.addFilter( 'pbs.toolbar_tools', function( tools, toolbar, target ) {

	if ( ! target.classList ) {
		return tools;
	}
	if ( ! target.classList.contains( 'ce-element--type-icon' ) ) {
		return tools;
	}

	var o;

	o = document.createElement('DIV');
	o.classList.add('pbs-tool');
	o.classList.add('pbs-image-align-left');
	o.setAttribute('data-tooltip', pbsParams.labels.align_left );
	if ( target.classList.contains( 'alignleft' ) ) {
		o.classList.add('pbs-toolbar-highlight');
	}
	o.addEventListener('click', function() {
		target._ceElement.removeCSSClass( 'alignleft' );
		target._ceElement.removeCSSClass( 'alignright' );
		target._ceElement.removeCSSClass( 'aligncenter' );
		target._ceElement.addCSSClass( 'alignleft' );
		target._ceElement.taint();
	});
	tools.push( o );

	o = document.createElement('DIV');
	o.classList.add('pbs-tool');
	o.classList.add('pbs-image-align-center');
	o.setAttribute('data-tooltip', pbsParams.labels.align_center );
	if ( target.classList.contains( 'aligncenter' ) ) {
		o.classList.add('pbs-toolbar-highlight');
	}
	o.addEventListener('click', function() {
		target._ceElement.removeCSSClass( 'alignleft' );
		target._ceElement.removeCSSClass( 'alignright' );
		target._ceElement.removeCSSClass( 'aligncenter' );
		target._ceElement.addCSSClass( 'aligncenter' );
		target._ceElement.taint();
	});
	tools.push( o );

	o = document.createElement('DIV');
	o.classList.add('pbs-tool');
	o.classList.add('pbs-image-align-right');
	o.setAttribute('data-tooltip', pbsParams.labels.align_right );
	if ( target.classList.contains( 'alignright' ) ) {
		o.classList.add('pbs-toolbar-highlight');
	}
	o.addEventListener('click', function() {
		target._ceElement.removeCSSClass( 'alignleft' );
		target._ceElement.removeCSSClass( 'alignright' );
		target._ceElement.removeCSSClass( 'aligncenter' );
		target._ceElement.addCSSClass( 'alignright' );
		target._ceElement.taint();
	});
	tools.push( o );

	o = document.createElement('DIV');
	o.classList.add('pbs-tool');
	o.classList.add('pbs-image-edit');
	o.setAttribute('data-tooltip', pbsParams.labels.edit);
	o.addEventListener('click', function() {
		target._ceElement._onDoubleClick();
	});
	tools.push( o );

	o = document.createElement('DIV');
	o.classList.add('pbs-tool');
	o.classList.add('pbs-image-clone');
	o.setAttribute('data-tooltip', pbsParams.labels.clone);
	o.addEventListener('click', function() {
		target._ceElement.clone();
	});
	tools.push( o );

	o = document.createElement('DIV');
	o.classList.add('pbs-tool');
	o.classList.add('pbs-image-remove');
	o.setAttribute('data-tooltip', pbsParams.labels.remove);
	o.addEventListener('click', function() {
		target._ceElement.parent().detach( target._ceElement );
	});
	tools.push( o );

	return tools;
} );

/* globals HTMLString, pbsParams */

wp.hooks.addFilter( 'pbs.has_toolbar_selectors', function( selector ) {
	selector.push( 'img.alignright,img.alignleft,img.alignnone,img.aligncenter,img[class*="wp-image-"]' );
	return selector;
} );

wp.hooks.addFilter( 'pbs.toolbar_tools', function( tools, toolbar, target ) {

	if ( target.tagName !== 'IMG' && target.tagName !== 'DL' ) {
		return tools;
	}
	if ( ! target.classList.contains( 'alignleft' ) && ! target.classList.contains( 'alignright' ) && ! target.classList.contains( 'aligncenter' ) && ! target.classList.contains( 'alignnone' ) ) {
		if ( ! target.getAttribute('class') ) {
			return tools;
		}
		if ( target.getAttribute('class').indexOf('wp-image-') === -1 ) {
			return tools;
		}
	}

	var o;

	o = document.createElement('DIV');
	o.classList.add('pbs-tool');
	o.classList.add('pbs-image-align-left');
	o.setAttribute('data-tooltip', pbsParams.labels.align_left);
	if ( target.classList.contains( 'alignleft' ) ) {
		o.classList.add('pbs-toolbar-highlight');
	}
	o.addEventListener('click', function() {
		if ( target._ceElement && target._ceElement.constructor.name === 'Image' ) {
			target._ceElement.removeCSSClass( 'alignleft' );
			target._ceElement.removeCSSClass( 'alignright' );
			target._ceElement.removeCSSClass( 'aligncenter' );
			target._ceElement.removeCSSClass( 'alignnone' );
			target._ceElement.addCSSClass( 'alignleft' );
			return;
		}
		target.classList.remove('alignleft','alignright','alignnone','aligncenter');
		target.classList.add('alignleft');

		_pbsImageTriggerParentChange( target );
	});
	tools.push( o );

	o = document.createElement('DIV');
	o.classList.add('pbs-tool');
	o.classList.add('pbs-image-align-center');
	o.setAttribute('data-tooltip', pbsParams.labels.align_center );
	if ( target.classList.contains( 'aligncenter' ) ) {
		o.classList.add('pbs-toolbar-highlight');
	}
	o.addEventListener('click', function() {
		if ( target._ceElement && target._ceElement.constructor.name === 'Image' ) {
			target._ceElement.removeCSSClass( 'alignleft' );
			target._ceElement.removeCSSClass( 'alignright' );
			target._ceElement.removeCSSClass( 'aligncenter' );
			target._ceElement.removeCSSClass( 'alignnone' );
			target._ceElement.addCSSClass( 'aligncenter' );
			return;
		}
		target.classList.remove('alignleft','alignright','alignnone','aligncenter');
		target.classList.add('aligncenter');

		_pbsImageTriggerParentChange( target );
	});
	tools.push( o );

	o = document.createElement('DIV');
	o.classList.add('pbs-tool');
	o.classList.add('pbs-image-align-right');
	o.setAttribute('data-tooltip', pbsParams.labels.align_right );
	if ( target.classList.contains( 'alignright' ) ) {
		o.classList.add('pbs-toolbar-highlight');
	}
	o.addEventListener('click', function() {
		if ( target._ceElement && target._ceElement.constructor.name === 'Image' ) {
			target._ceElement.removeCSSClass( 'alignleft' );
			target._ceElement.removeCSSClass( 'alignright' );
			target._ceElement.removeCSSClass( 'aligncenter' );
			target._ceElement.removeCSSClass( 'alignnone' );
			target._ceElement.addCSSClass( 'alignright' );
			return;
		}
		target.classList.remove('alignleft','alignright','alignnone','aligncenter');
		target.classList.add('alignright');

		_pbsImageTriggerParentChange( target );
	});
	tools.push( o );

	// o = document.createElement('DIV');
	// o.classList.add('pbs-tool');
	// o.classList.add('pbs-image-align-none');
	// o.setAttribute('data-tooltip', 'Align none');
	// if ( target.classList.contains( 'alignnone' ) ) {
	// 	o.classList.add('pbs-toolbar-highlight');
	// }
	// o.addEventListener('click', function() {
	// 	if ( target._ceElement && target._ceElement.constructor.name === 'Image' ) {
	// 		target._ceElement.removeCSSClass( 'alignleft' );
	// 		target._ceElement.removeCSSClass( 'alignright' );
	// 		target._ceElement.removeCSSClass( 'aligncenter' );
	// 		target._ceElement.removeCSSClass( 'alignnone' );
	// 		target._ceElement.addCSSClass( 'alignnone' );
	// 		return;
	// 	}
	// 	target.classList.remove('alignleft','alignright','alignnone','aligncenter');
	// 	target.classList.add('alignnone');
	//
	// 	_pbsImageTriggerParentChange( target );
	// });
	// tools.push( o );

	o = document.createElement('DIV');
	o.classList.add('pbs-tool');
	o.classList.add('pbs-image-edit');
	o.setAttribute('data-tooltip', pbsParams.labels.edit );
	o.addEventListener('click', function() {

		// Images
		if ( target._ceElement ) {
			if ( target._ceElement.openMediaManager ) {
				target._ceElement.openMediaManager();
				return;
			} else {
				target._ceElement._onDoubleClick();
			}
		}

	});
	tools.push( o );

	o = document.createElement('DIV');
	o.classList.add('pbs-tool');
	o.classList.add('pbs-image-remove');
	o.setAttribute('data-tooltip', pbsParams.labels.remove );
	o.addEventListener('click', function() {
		var parentNode = target.parentNode;
		if ( target._ceElement && target._ceElement.constructor.name === 'Image' ) {
			target._ceElement.parent().detach( target._ceElement );
			return;
		}

		if ( parentNode.tagName === 'A' ) {
			parentNode = parentNode.parentNode;
			parentNode.removeChild( target.parentNode );
		} else {
			parentNode.removeChild( target );
		}

		_pbsImageTriggerParentChange( parentNode );

	});
	tools.push( o );

	return tools;
} );


wp.hooks.addFilter( 'pbs.has_toolbar_selectors', function( selector ) {
	selector.push( '[data-base="caption"]' );
	return selector;
} );


wp.hooks.addFilter( 'pbs.toolbar_tools', function( tools, toolbar, target ) {

	if ( target.getAttribute('data-base') !== 'caption' ) {
		return tools;
	}

	var o = document.createElement('DIV');
	o.classList.add('pbs-tool');
	o.classList.add('pbs-image-align-left');
	o.setAttribute('data-tooltip', pbsParams.labels.align_left );
	if ( target._ceElement.model.get('align') === 'alignleft' ) {
		o.classList.add('pbs-toolbar-highlight');
	}
	o.addEventListener('click', function() {
		target._ceElement.setSCAttr( 'align', 'alignleft' );
	});
	tools.push( o );

	o = document.createElement('DIV');
	o.classList.add('pbs-tool');
	o.classList.add('pbs-image-align-center');
	o.setAttribute('data-tooltip', pbsParams.labels.align_center );
	if ( target._ceElement.model.get('align') === 'aligncenter' ) {
		o.classList.add('pbs-toolbar-highlight');
	}
	o.addEventListener('click', function() {
		target._ceElement.setSCAttr( 'align', 'aligncenter' );
	});
	tools.push( o );

	o = document.createElement('DIV');
	o.classList.add('pbs-tool');
	o.classList.add('pbs-image-align-right');
	o.setAttribute('data-tooltip', pbsParams.labels.align_right );
	if ( target._ceElement.model.get('align') === 'alignright' ) {
		o.classList.add('pbs-toolbar-highlight');
	}
	o.addEventListener('click', function() {
		target._ceElement.setSCAttr( 'align', 'alignright' );
	});
	tools.push( o );

	o = document.createElement('DIV');
	o.classList.add('pbs-tool');
	o.classList.add('pbs-image-align-none');
	o.setAttribute('data-tooltip', pbsParams.labels.align_none );
	if ( target._ceElement.model.get('align') === 'alignnone' ) {
		o.classList.add('pbs-toolbar-highlight');
	}
	o.addEventListener('click', function() {
		target._ceElement.setSCAttr( 'align', 'alignnone' );
	});
	tools.push( o );

	o = document.createElement('DIV');
	o.classList.add('pbs-tool');
	o.classList.add('pbs-image-edit');
	o.setAttribute('data-tooltip', pbsParams.labels.edit );
	o.addEventListener('click', function() {

		target._ceElement._onDoubleClick();


	});
	tools.push( o );

	o = document.createElement('DIV');
	o.classList.add('pbs-tool');
	o.classList.add('pbs-image-remove');
	o.setAttribute('data-tooltip', pbsParams.labels.remove );
	o.addEventListener('click', function() {
		target._ceElement.parent().detach( target._ceElement );
	});
	tools.push( o );

	return tools;
}, 999);





// TODO add gallery shortcode toolbar



// Triggers the parent Text Element to update itself (undo will start working).
var _pbsImageTriggerParentChange = function( domElement ) {
	var currElement = domElement;
	while ( currElement ) {
		if ( currElement._ceElement ) {
			var ctElem = currElement._ceElement;
			if ( ctElem.content ) {
				ctElem.content = new HTMLString.String( currElement.innerHTML, ctElem.content.preserveWhitespace() );
				ctElem.updateInnerHTML();
				ctElem.taint();
				break;
			}
		}
		currElement = currElement.parentNode;
	}
};

/* globals ContentSelect, ContentTools, pbsParams */

wp.hooks.addFilter( 'pbs.has_toolbar_selectors', function( selector ) {
	selector.push( 'a[href]:not(.pbs-button)' );
	return selector;
} );

wp.hooks.addFilter( 'pbs.toolbar_tools', function( tools, toolbar, target ) {

	if ( target.tagName !== 'A' ) {
		return tools;
	}
	if ( target.classList.contains( 'pbs-button' ) ) {
		return tools;
	}
	if ( ! target.getAttribute( 'href' ) ) {
		return tools;
	}
	if ( target.innerHTML.match( /<img/g ) ) {
		return tools;
	}

	var o = document.createElement('DIV');
	o.classList.add('pbs-tool-label');
	o.classList.add('pbs-tool-label-link');
	o.innerHTML = target.getAttribute( 'href' );
	tools.push( o );

	o = document.createElement('DIV');
	o.classList.add('pbs-tool');
	o.classList.add('pbs-link-visit');
	o.setAttribute('data-tooltip', pbsParams.labels.visit_link );
	o.addEventListener('click', function() {
		window.open( target.getAttribute( 'href' ), '_linktool');
	});
	tools.push( o );

	o = document.createElement('DIV');
	o.classList.add('pbs-tool');
	o.classList.add('pbs-image-edit');
	o.setAttribute('data-tooltip', pbsParams.labels.edit_link );
	o.addEventListener('click', function() {

		// Find ce-element parent
		var domElement = target;
		while ( ! domElement._ceElement ) {
			domElement = domElement.parentNode;
		}

		// Select the link.
		var index = domElement._ceElement.content.indexOf( target.innerHTML );
		var selection = new ContentSelect.Range( index, index );
		selection.select( domElement );

		// Open the link editor.
		window.PBSEditor.getToolUI( 'link' ).apply( domElement._ceElement, selection, function() { } );
	});
	tools.push( o );

	o = document.createElement('DIV');
	o.classList.add('pbs-tool');
	o.classList.add('pbs-link-unlink');
	o.setAttribute('data-tooltip', pbsParams.labels.unlink );
	o.addEventListener('click', function() {

		// Find ce-element parent
		var domElement = target;
		while ( ! domElement._ceElement ) {
			domElement = domElement.parentNode;
		}

		// Get the link position.
		var index = domElement._ceElement.content.indexOf( target.innerHTML );

		// The start should be the start of the link block.
		var selected = ContentTools.Tools.Link.getSelectedLink( domElement._ceElement, index, index );
		var from = selected.from;
		var to = selected.to;

		// Remove the link.
		domElement._ceElement.content = domElement._ceElement.content.unformat( from, to, 'a' );
		domElement._ceElement.updateInnerHTML();
		domElement._ceElement.taint();
	});
	tools.push( o );

	return tools;
} );


/* globals pbsParams, PBSShortcodes */

wp.hooks.addFilter( 'pbs.has_toolbar_selectors', function( selector ) {
	selector.push( '[data-shortcode]' );
	return selector;
} );

wp.hooks.addFilter( 'pbs.toolbar_tools', function( tools, toolbar, target ) {

	if ( ! target.getAttribute( 'data-shortcode' ) ) {
		return tools;
	}
	if ( target.getAttribute('data-base') === 'caption' ) {
		return tools;
	}
	if ( ! wp.hooks.applyFilters( 'pbs.toolbar.tools.allow', true, target ) ) {
		return tools;
	}

	var o = document.createElement('DIV');
	// o.classList.add('pbs-image-edit');
	// o.setAttribute('data-tooltip', 'Edit Shortcode');
	o.classList.add('pbs-tool-label');
	o.innerHTML = wp.hooks.applyFilters( 'pbs.toolbar.shortcode.label', target.getAttribute('data-base') );

	// Use the label of the shortcode if it is provided.
	if ( PBSShortcodes[ target.getAttribute('data-base') ] ) {
		if ( PBSShortcodes[ target.getAttribute('data-base') ].label ) {
			o.innerHTML = wp.hooks.applyFilters( 'pbs.toolbar.shortcode.label', PBSShortcodes[ target.getAttribute('data-base') ].label );
		}
	}

	o.addEventListener('click', function() {
	});
	tools.push( o );

	// var o = document.createElement('DIV');
	// o.classList.add('pbs-tool');
	// o.classList.add('pbs-image-move');
	// o.setAttribute('data-tooltip', 'Move');
	// o.addEventListener('mousedown', function(e) {
	// 	// Start dragging
	// 	target._ceElement.drag(e.x, e.y);
	// 	//
	// 	target.addEventListener( 'mouseup', _toolbarShortcodeDragCancelled );
	// });
	// tools.push( o );

	o = document.createElement('DIV');
	o.classList.add('pbs-tool');
	o.classList.add('pbs-image-edit');
	o.setAttribute('data-tooltip', pbsParams.labels.edit_shortcode );
	o.addEventListener('click', function() {
		target._ceElement.convertToText();
	});
	tools.push( o );

	o = document.createElement('DIV');
	o.classList.add('pbs-tool');
	o.classList.add('pbs-image-clone');
	o.setAttribute('data-tooltip', pbsParams.labels.clone );
	o.addEventListener('click', function() {
		target._ceElement.clone();
	});
	tools.push( o );

	o = document.createElement('DIV');
	o.classList.add('pbs-tool');
	o.classList.add('pbs-image-remove');
	o.setAttribute('data-tooltip', pbsParams.labels.remove );
	o.addEventListener('click', function() {
		if ( target._ceElement ) {

	        if ( target._ceElement.isFocused() ) {
				target._ceElement.blur();
			}

			target._ceElement.parent().detach( target._ceElement );
		} else if ( target.parentNode._ceElement ) {

	        if ( target.parentNode._ceElement.isFocused() ) {
				target.parentNode._ceElement.blur();
			}

			target.parentNode._ceElement.parent().detach( target.parentNode._ceElement );
		} else {
			target.parentNode.removeChild( target );
		}
	});
	tools.push( o );

	return tools;
} );

/* globals pbsParams */

wp.hooks.addFilter( 'pbs.has_toolbar_selectors', function( selector ) {
	selector.push( '[data-ce-tag="map"]' );
	return selector;
} );

wp.hooks.addFilter( 'pbs.toolbar_tools', function( tools, toolbar, target ) {

	if ( target.getAttribute( 'data-ce-tag' ) !== 'map' ) {
		return tools;
	}
	
	var o = document.createElement('DIV');
	o.classList.add( 'pbs-tool' );
	o.classList.add( 'pbs-image-remove' );
	o.setAttribute( 'data-tooltip', pbsParams.labels.remove );
	o.addEventListener( 'click', function() {
		target._ceElement.parent().detach( target._ceElement );
	} );
	tools.push( o );

	return tools;
} );


/* globals ContentTools, __extends, pbsParams */


/**
 * The main "Get Premium" button class.
 */
ContentTools.Tools.GetPremium = (function(_super) {
	__extends(GetPremium, _super);
	function GetPremium() {
		return GetPremium.__super__.constructor.apply(this, arguments);
	}
	ContentTools.ToolShelf.stow(GetPremium, 'get-premium');
	GetPremium.type = 'get-premium';
	return GetPremium;
})(ContentTools.Tool);


/**
 * Add the special behavior of the "Get Premium" button.
 */
(function() {
	var proxied = ContentTools.ToolUI.prototype.mount;
	ContentTools.ToolUI.prototype.mount = function( domParent, before ) {
		var ret = proxied.call( this, domParent, before );

		if ( this.tool.type === 'get-premium' ) {
			this._domElement.classList.remove( 'ct-tool' );
			this._domElement.classList.add( 'pbs-get-more-features' );
			this._domElement.classList.add( 'pbs-get-more-features-dark' );
			this._domElement.innerHTML = '<a href="https://pagebuildersandwich.com/?utm_source=lite-plugin&utm_medium=inspector-top&utm_campaign=Page%20Builder%20Sandwich" target="_blank">' + pbsParams.labels.get_the_premium_plugin + '</a>';
		}

		return ret;
	};
})();


/**
 * Create "Get Premium" buttons on the end of inspector areas.
 */
// wp.hooks.addAction( 'pbs.inspector.add_section', function( container, label ) {
// 	var getMore = document.createElement( 'div' );
// 	getMore.classList.add( 'pbs-get-more-features' );
// 	// if ( label.toLowerCase() === 'row' ) {
// 	// 	getMore.innerHTML = '<a href="https://pagebuildersandwich.com/?utm_source=lite-plugin&utm_medium=inspector-row&utm_campaign=Page%20Builder%20Sandwich" target="_blank">Get more tools like full-width rows, image, parallax, and video backgrounds</a>';
// 	// } else if ( label.toLowerCase() === 'column' ) {
// 	// 	getMore.innerHTML = '<a href="https://pagebuildersandwich.com/?utm_source=lite-plugin&utm_medium=inspector-column&utm_campaign=Page%20Builder%20Sandwich" target="_blank">Get more column styling tools with the Premium Plugin</a>';
// 	// } else {
// 		getMore.innerHTML = '<a href="https://pagebuildersandwich.com/?utm_source=lite-plugin&utm_medium=inspector-' + label.toLowerCase() + '&utm_campaign=Page%20Builder%20Sandwich" target="_blank">Get the Premium Plugin to get more ' + label + ' tools and features</a>';
// 	// }
// 	container.appendChild( getMore );
// } );


/**
 * Click handler for the "Get Premium" Admin bar button.
 */
document.addEventListener( 'DOMContentLoaded', function() {
	document.querySelector( '#wp-admin-bar-pbs_go_premium' ).addEventListener( 'click', function() {
		var win = window.open( 'https://pagebuildersandwich.com/?utm_source=lite-plugin&utm_medium=adminbar&utm_campaign=Page%20Builder%20Sandwich', '_blank');
  		win.focus();
	});
});

/**! hopscotch - v0.2.5
*
* Copyright 2015 LinkedIn Corp. All rights reserved.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*     http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
(function(context, factory) {
  'use strict';

  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define([], factory);
  } else if (typeof exports === 'object') {
    // Node/CommonJS
    module.exports = factory();
  } else {
    var namespace = 'hopscotch';
    // Browser globals
    if (context[namespace]) {
      // Hopscotch already exists.
      return;
    }
    context[namespace] = factory();
  }
}(this, (function() {
  var Hopscotch,
      HopscotchBubble,
      HopscotchCalloutManager,
      HopscotchI18N,
      customI18N,
      customRenderer,
      customEscape,
      templateToUse = 'bubble_default',
      Sizzle = window.Sizzle || null,
      utils,
      callbacks,
      helpers,
      winLoadHandler,
      defaultOpts,
      winHopscotch,
      undefinedStr      = 'undefined',
      waitingToStart    = false, // is a tour waiting for the document to finish
                                 // loading so that it can start?
      hasJquery         = (typeof jQuery !== undefinedStr),
      hasSessionStorage = false,
      isStorageWritable = false,
      document          = window.document,
      validIdRegEx      = /^[a-zA-Z]+[a-zA-Z0-9_-]*$/,
      rtlMatches        = {
        left: 'right',
        right: 'left'
      };

  // If cookies are disabled, accessing sessionStorage can throw an error.
  // sessionStorage could also throw an error in Safari on write (even though it exists).
  // So, we'll try writing to sessionStorage to verify it's available.
  try {
    if(typeof window.sessionStorage !== undefinedStr){
      hasSessionStorage = true;
      sessionStorage.setItem('hopscotch.test.storage', 'ok');
      sessionStorage.removeItem('hopscotch.test.storage');
      isStorageWritable = true;
    }
  } catch (err) {}

  defaultOpts       = {
    smoothScroll:    true,
    scrollDuration:  1000,
    scrollTopMargin: 200,
    showCloseButton: true,
    showPrevButton:  false,
    showNextButton:  true,
    bubbleWidth:     280,
    bubblePadding:   15,
    arrowWidth:      20,
    skipIfNoElement: true,
    isRtl:           false,
    cookieName:      'hopscotch.tour.state'
  };

  if (!Array.isArray) {
    Array.isArray = function(obj) {
      return Object.prototype.toString.call(obj) === '[object Array]';
    };
  }

  /**
   * Called when the page is done loading.
   *
   * @private
   */
  winLoadHandler = function() {
    if (waitingToStart) {
      winHopscotch.startTour();
    }
  };

  /**
   * utils
   * =====
   * A set of utility functions, mostly for standardizing to manipulate
   * and extract information from the DOM. Basically these are things I
   * would normally use jQuery for, but I don't want to require it for
   * this framework.
   *
   * @private
   */
  utils = {
    /**
     * addClass
     * ========
     * Adds one or more classes to a DOM element.
     *
     * @private
     */
    addClass: function(domEl, classToAdd) {
      var domClasses,
          classToAddArr,
          setClass,
          i,
          len;

      if (!domEl.className) {
        domEl.className = classToAdd;
      }
      else {
        classToAddArr = classToAdd.split(/\s+/);
        domClasses = ' ' + domEl.className + ' ';
        for (i = 0, len = classToAddArr.length; i < len; ++i) {
          if (domClasses.indexOf(' ' + classToAddArr[i] + ' ') < 0) {
            domClasses += classToAddArr[i] + ' ';
          }
        }
        domEl.className = domClasses.replace(/^\s+|\s+$/g,'');
      }
    },

    /**
     * removeClass
     * ===========
     * Remove one or more classes from a DOM element.
     *
     * @private
     */
    removeClass: function(domEl, classToRemove) {
      var domClasses,
          classToRemoveArr,
          currClass,
          i,
          len;

      classToRemoveArr = classToRemove.split(/\s+/);
      domClasses = ' ' + domEl.className + ' ';
      for (i = 0, len = classToRemoveArr.length; i < len; ++i) {
        domClasses = domClasses.replace(' ' + classToRemoveArr[i] + ' ', ' ');
      }
      domEl.className = domClasses.replace(/^\s+|\s+$/g,'');
    },

    /**
     * hasClass
     * ========
     * Determine if a given DOM element has a class.
     */
    hasClass: function(domEl, classToCheck){
      var classes;

      if(!domEl.className){ return false; }
      classes = ' ' + domEl.className + ' ';
      return (classes.indexOf(' ' + classToCheck + ' ') !== -1);
    },

    /**
     * @private
     */
    getPixelValue: function(val) {
      var valType = typeof val;
      if (valType === 'number') { return val; }
      if (valType === 'string') { return parseInt(val, 10); }
      return 0;
    },

    /**
     * Inspired by Python... returns val if it's defined, otherwise returns the default.
     *
     * @private
     */
    valOrDefault: function(val, valDefault) {
      return typeof val !== undefinedStr ? val : valDefault;
    },

    /**
     * Invokes a single callback represented by an array.
     * Example input: ["my_fn", "arg1", 2, "arg3"]
     * @private
     */
    invokeCallbackArrayHelper: function(arr) {
      // Logic for a single callback
      var fn;
      if (Array.isArray(arr)) {
        fn = helpers[arr[0]];
        if (typeof fn === 'function') {
          return fn.apply(this, arr.slice(1));
        }
      }
    },

    /**
     * Invokes one or more callbacks. Array should have at most one level of nesting.
     * Example input:
     * ["my_fn", "arg1", 2, "arg3"]
     * [["my_fn_1", "arg1", "arg2"], ["my_fn_2", "arg2-1", "arg2-2"]]
     * [["my_fn_1", "arg1", "arg2"], function() { ... }]
     * @private
     */
    invokeCallbackArray: function(arr) {
      var i, len;

      if (Array.isArray(arr)) {
        if (typeof arr[0] === 'string') {
          // Assume there are no nested arrays. This is the one and only callback.
          return utils.invokeCallbackArrayHelper(arr);
        }
        else { // assume an array
          for (i = 0, len = arr.length; i < len; ++i) {
            utils.invokeCallback(arr[i]);
          }
        }
      }
    },

    /**
     * Helper function for invoking a callback, whether defined as a function literal
     * or an array that references a registered helper function.
     * @private
     */
    invokeCallback: function(cb) {
      if (typeof cb === 'function') {
        return cb();
      }
      if (typeof cb === 'string' && helpers[cb]) { // name of a helper
        return helpers[cb]();
      }
      else { // assuming array
        return utils.invokeCallbackArray(cb);
      }
    },

    /**
     * If stepCb (the step-specific helper callback) is passed in, then invoke
     * it first. Then invoke tour-wide helper.
     *
     * @private
     */
    invokeEventCallbacks: function(evtType, stepCb) {
      var cbArr = callbacks[evtType],
          callback,
          fn,
          i,
          len;

      if (stepCb) {
        return this.invokeCallback(stepCb);
      }

      for (i=0, len=cbArr.length; i<len; ++i) {
        this.invokeCallback(cbArr[i].cb);
      }
    },

    /**
     * @private
     */
    getScrollTop: function() {
      var scrollTop;
      if (typeof window.pageYOffset !== undefinedStr) {
        scrollTop = window.pageYOffset;
      }
      else {
        // Most likely IE <=8, which doesn't support pageYOffset
        scrollTop = document.documentElement.scrollTop;
      }
      return scrollTop;
    },

    /**
     * @private
     */
    getScrollLeft: function() {
      var scrollLeft;
      if (typeof window.pageXOffset !== undefinedStr) {
        scrollLeft = window.pageXOffset;
      }
      else {
        // Most likely IE <=8, which doesn't support pageXOffset
        scrollLeft = document.documentElement.scrollLeft;
      }
      return scrollLeft;
    },

    /**
     * @private
     */
    getWindowHeight: function() {
      return window.innerHeight || document.documentElement.clientHeight;
    },

    /**
     * @private
     */
    addEvtListener: function(el, evtName, fn) {
      if(el) {
        return el.addEventListener ? el.addEventListener(evtName, fn, false) : el.attachEvent('on' + evtName, fn);
      }
    },

    /**
     * @private
     */
    removeEvtListener: function(el, evtName, fn) {
      if(el) {
        return el.removeEventListener ? el.removeEventListener(evtName, fn, false) : el.detachEvent('on' + evtName, fn);
      }
    },

    documentIsReady: function() {
      return document.readyState === 'complete';
    },

    /**
     * @private
     */
    evtPreventDefault: function(evt) {
      if (evt.preventDefault) {
        evt.preventDefault();
      }
      else if (event) {
        event.returnValue = false;
      }
    },

    /**
     * @private
     */
    extend: function(obj1, obj2) {
      var prop;
      for (prop in obj2) {
        if (obj2.hasOwnProperty(prop)) {
          obj1[prop] = obj2[prop];
        }
      }
    },

    /**
     * Helper function to get a single target DOM element. We will try to
     * locate the DOM element through several ways, in the following order:
     *
     * 1) Passing the string into document.querySelector
     * 2) Passing the string to jQuery, if it exists
     * 3) Passing the string to Sizzle, if it exists
     * 4) Calling document.getElementById if it is a plain id
     *
     * Default case is to assume the string is a plain id and call
     * document.getElementById on it.
     *
     * @private
     */
    getStepTargetHelper: function(target){
      var result = document.getElementById(target);

      //Backwards compatibility: assume the string is an id
      if (result) {
        return result;
      }
      if (hasJquery) {
        result = jQuery(target);
        return result.length ? result[0] : null;
      }
      if (Sizzle) {
        result = new Sizzle(target);
        return result.length ? result[0] : null;
      }
      if (document.querySelector) {
        try {
          return document.querySelector(target);
        } catch (err) {}
      }
      // Regex test for id. Following the HTML 4 spec for valid id formats.
      // (http://www.w3.org/TR/html4/types.html#type-id)
      if (/^#[a-zA-Z][\w-_:.]*$/.test(target)) {
        return document.getElementById(target.substring(1));
      }

      return null;
    },

    /**
     * Given a step, returns the target DOM element associated with it. It is
     * recommended to only assign one target per step. However, there are
     * some use cases which require multiple step targets to be supplied. In
     * this event, we will use the first target in the array that we can
     * locate on the page. See the comments for getStepTargetHelper for more
     * information.
     *
     * @private
     */
    getStepTarget: function(step) {
      var queriedTarget;

      if (!step || !step.target) {
        return null;
      }

      if (typeof step.target === 'string') {
        //Just one target to test. Check and return its results.
        return utils.getStepTargetHelper(step.target);
      }
      else if (Array.isArray(step.target)) {
        // Multiple items to check. Check each and return the first success.
        // Assuming they are all strings.
        var i,
            len;

        for (i = 0, len = step.target.length; i < len; i++){
          if (typeof step.target[i] === 'string') {
            queriedTarget = utils.getStepTargetHelper(step.target[i]);

            if (queriedTarget) {
              return queriedTarget;
            }
          }
        }
        return null;
      }

      // Assume that the step.target is a DOM element
      return step.target;
    },

    /**
     * Convenience method for getting an i18n string. Returns custom i18n value
     * or the default i18n value if no custom value exists.
     *
     * @private
     */
    getI18NString: function(key) {
      return customI18N[key] || HopscotchI18N[key];
    },

    // Tour session persistence for multi-page tours. Uses HTML5 sessionStorage if available, then
    // falls back to using cookies.
    //
    // The following cookie-related logic is borrowed from:
    // http://www.quirksmode.org/js/cookies.html

    /**
     * @private
     */
    setState: function(name,value,days) {
      var expires = '',
          date;

      if (hasSessionStorage && isStorageWritable) {
        try{
          sessionStorage.setItem(name, value);
        }
        catch(err){
          isStorageWritable = false;
          this.setState(name, value, days);
        }
      }
      else {
        if(hasSessionStorage){
          //Clear out existing sessionStorage key so the new value we set to cookie gets read.
          //(If we're here, we've run into an error while trying to write to sessionStorage).
          sessionStorage.removeItem(name);
        }
        if (days) {
          date = new Date();
          date.setTime(date.getTime()+(days*24*60*60*1000));
          expires = '; expires='+date.toGMTString();
        }
        document.cookie = name+'='+value+expires+'; path=/';
      }
    },

    /**
     * @private
     */
    getState: function(name) {
      var nameEQ = name + '=',
          ca = document.cookie.split(';'),
          i,
          c,
          state;

      //return value from session storage if we have it
      if (hasSessionStorage) {
        state = sessionStorage.getItem(name);
        if(state){
          return state;
        }
      }

      //else, try cookies
      for(i=0;i < ca.length;i++) {
        c = ca[i];
        while (c.charAt(0)===' ') {c = c.substring(1,c.length);}
        if (c.indexOf(nameEQ) === 0) {
          state = c.substring(nameEQ.length,c.length);
          break;
        }
      }

      return state;
    },

    /**
     * @private
     */
    clearState: function(name) {
      if (hasSessionStorage) {
        sessionStorage.removeItem(name);
      }
      else {
        this.setState(name,'',-1);
      }
    },

    /**
     * Originally called it orientation, but placement is more intuitive.
     * Allowing both for now for backwards compatibility.
     * @private
     */
    normalizePlacement: function(step) {
      if (!step.placement && step.orientation) {
        step.placement = step.orientation;
      }
    },

    /**
     * If step is right-to-left enabled, flip the placement and xOffset, but only once.
     * @private
     */
    flipPlacement: function(step){
      if(step.isRtl && !step._isFlipped){
        var props = ['orientation', 'placement'], prop, i;
        if(step.xOffset){
          step.xOffset = -1 * this.getPixelValue(step.xOffset);
        }
        for(i in props){
          prop = props[i];
          if(step.hasOwnProperty(prop) && rtlMatches.hasOwnProperty(step[prop])) {
            step[prop] = rtlMatches[step[prop]];
          }
        }
        step._isFlipped = true;
      }
    }
  };

  utils.addEvtListener(window, 'load', winLoadHandler);

  callbacks = {
    next:  [],
    prev:  [],
    start: [],
    end:   [],
    show:  [],
    error: [],
    close: []
  };

  /**
   * helpers
   * =======
   * A map of functions to be used as callback listeners. Functions are
   * added to and removed from the map using the functions
   * Hopscotch.registerHelper() and Hopscotch.unregisterHelper().
   */
  helpers = {};

  HopscotchI18N = {
    stepNums: null,
    nextBtn: 'Next',
    prevBtn: 'Back',
    doneBtn: 'Done',
    skipBtn: 'Skip',
    closeTooltip: 'Close'
  };

  customI18N = {}; // Developer's custom i18n strings goes here.

  /**
   * HopscotchBubble
   *
   * @class The HopscotchBubble class represents the view of a bubble. This class is also used for Hopscotch callouts.
   */
  HopscotchBubble = function(opt) {
    this.init(opt);
  };

  HopscotchBubble.prototype = {
    isShowing: false,

    currStep: undefined,

    /**
     * setPosition
     *
     * Sets the position of the bubble using the bounding rectangle of the
     * target element and the orientation and offset information specified by
     * the JSON.
     */
    setPosition: function(step) {
      var bubbleBoundingHeight,
          bubbleBoundingWidth,
          boundingRect,
          top,
          left,
          arrowOffset,
          verticalLeftPosition,
          targetEl     = utils.getStepTarget(step),
          el           = this.element,
          arrowEl      = this.arrowEl,
          arrowPos     = step.isRtl ? 'right' : 'left';

      utils.flipPlacement(step);
      utils.normalizePlacement(step);

      bubbleBoundingWidth = el.offsetWidth;
      bubbleBoundingHeight = el.offsetHeight;
      utils.removeClass(el, 'fade-in-down fade-in-up fade-in-left fade-in-right');

      // SET POSITION
      boundingRect = targetEl.getBoundingClientRect();

      verticalLeftPosition = step.isRtl ? boundingRect.right - bubbleBoundingWidth : boundingRect.left;

      if (step.placement === 'top') {
        top = (boundingRect.top - bubbleBoundingHeight) - this.opt.arrowWidth;
        left = verticalLeftPosition;
      }
      else if (step.placement === 'bottom') {
        top = boundingRect.bottom + this.opt.arrowWidth;
        left = verticalLeftPosition;
      }
      else if (step.placement === 'left') {
        top = boundingRect.top;
        left = boundingRect.left - bubbleBoundingWidth - this.opt.arrowWidth;
      }
      else if (step.placement === 'right') {
        top = boundingRect.top;
        left = boundingRect.right + this.opt.arrowWidth;
      }
      else {
        throw new Error('Bubble placement failed because step.placement is invalid or undefined!');
      }

      // SET (OR RESET) ARROW OFFSETS
      if (step.arrowOffset !== 'center') {
        arrowOffset = utils.getPixelValue(step.arrowOffset);
      }
      else {
        arrowOffset = step.arrowOffset;
      }
      if (!arrowOffset) {
        arrowEl.style.top = '';
        arrowEl.style[arrowPos] = '';
      }
      else if (step.placement === 'top' || step.placement === 'bottom') {
        arrowEl.style.top = '';
        if (arrowOffset === 'center') {
          arrowEl.style[arrowPos] = Math.floor((bubbleBoundingWidth / 2) - arrowEl.offsetWidth/2) + 'px';
        }
        else {
          // Numeric pixel value
          arrowEl.style[arrowPos] = arrowOffset + 'px';
        }
      }
      else if (step.placement === 'left' || step.placement === 'right') {
        arrowEl.style[arrowPos] = '';
        if (arrowOffset === 'center') {
          arrowEl.style.top = Math.floor((bubbleBoundingHeight / 2) - arrowEl.offsetHeight/2) + 'px';
        }
        else {
          // Numeric pixel value
          arrowEl.style.top = arrowOffset + 'px';
        }
      }

      // HORIZONTAL OFFSET
      if (step.xOffset === 'center') {
        left = (boundingRect.left + targetEl.offsetWidth/2) - (bubbleBoundingWidth / 2);
      }
      else {
        left += utils.getPixelValue(step.xOffset);
      }
      // VERTICAL OFFSET
      if (step.yOffset === 'center') {
        top = (boundingRect.top + targetEl.offsetHeight/2) - (bubbleBoundingHeight / 2);
      }
      else {
        top += utils.getPixelValue(step.yOffset);
      }

      // ADJUST TOP FOR SCROLL POSITION
      if (!step.fixedElement) {
        top += utils.getScrollTop();
        left += utils.getScrollLeft();
      }

      // ACCOUNT FOR FIXED POSITION ELEMENTS
      el.style.position = (step.fixedElement ? 'fixed' : 'absolute');

      el.style.top = top + 'px';
      el.style.left = left + 'px';
    },

    /**
     * Renders the bubble according to the step JSON.
     *
     * @param {Object} step Information defining how the bubble should look.
     * @param {Number} idx The index of the step in the tour. Not used for callouts.
     * @param {Function} callback Function to be invoked after rendering is finished.
     */
    render: function(step, idx, callback) {
      var el = this.element,
          tourSpecificRenderer,
          customTourData,
          unsafe,
          currTour,
          totalSteps,
          totalStepsI18n,
          nextBtnText,
          isLast,
          opts;

      // Cache current step information.
      if (step) {
        this.currStep = step;
      }
      else if (this.currStep) {
        step = this.currStep;
      }

      // Check current tour for total number of steps and custom render data
      if(this.opt.isTourBubble){
        currTour = winHopscotch.getCurrTour();
        if(currTour){
          customTourData = currTour.customData;
          tourSpecificRenderer = currTour.customRenderer;
          step.isRtl = step.hasOwnProperty('isRtl') ? step.isRtl :
            (currTour.hasOwnProperty('isRtl') ? currTour.isRtl : this.opt.isRtl);
          unsafe = currTour.unsafe;
          if(Array.isArray(currTour.steps)){
            totalSteps = currTour.steps.length;
            totalStepsI18n = this._getStepI18nNum(this._getStepNum(totalSteps - 1));
            isLast = (this._getStepNum(idx) === this._getStepNum(totalSteps - 1));
          }
        }
      }else{
        customTourData = step.customData;
        tourSpecificRenderer = step.customRenderer;
        unsafe = step.unsafe;
        step.isRtl = step.hasOwnProperty('isRtl') ? step.isRtl : this.opt.isRtl;
      }

      // Determine label for next button
      if(isLast){
        nextBtnText = utils.getI18NString('doneBtn');
      } else if(step.showSkip) {
        nextBtnText = utils.getI18NString('skipBtn');
      } else {
        nextBtnText = utils.getI18NString('nextBtn');
      }

      utils.flipPlacement(step);
      utils.normalizePlacement(step);

      this.placement = step.placement;

      // Setup the configuration options we want to pass along to the template
      opts = {
        i18n: {
          prevBtn: utils.getI18NString('prevBtn'),
          nextBtn: nextBtnText,
          closeTooltip: utils.getI18NString('closeTooltip'),
          stepNum: this._getStepI18nNum(this._getStepNum(idx)),
          numSteps: totalStepsI18n
        },
        buttons:{
          showPrev: (utils.valOrDefault(step.showPrevButton, this.opt.showPrevButton) && (this._getStepNum(idx) > 0)),
          showNext: utils.valOrDefault(step.showNextButton, this.opt.showNextButton),
          showCTA: utils.valOrDefault((step.showCTAButton && step.ctaLabel), false),
          ctaLabel: step.ctaLabel,
          showClose: utils.valOrDefault(this.opt.showCloseButton, true)
        },
        step:{
          num: idx,
          isLast: utils.valOrDefault(isLast, false),
          title: (step.title || ''),
          content: (step.content || ''),
          isRtl: step.isRtl,
          placement: step.placement,
          padding: utils.valOrDefault(step.padding, this.opt.bubblePadding),
          width: utils.getPixelValue(step.width) || this.opt.bubbleWidth,
          customData: (step.customData || {})
        },
        tour:{
          isTour: this.opt.isTourBubble,
          numSteps: totalSteps,
          unsafe: utils.valOrDefault(unsafe, false),
          customData: (customTourData || {})
        }
      };

      // Render the bubble's content.
      // Use tour renderer if available, then the global customRenderer if defined.
      if(typeof tourSpecificRenderer === 'function'){
        el.innerHTML = tourSpecificRenderer(opts);
      }
      else if(typeof tourSpecificRenderer === 'string'){
        if(!winHopscotch.templates || (typeof winHopscotch.templates[tourSpecificRenderer] !== 'function')){
          throw new Error('Bubble rendering failed - template "' + tourSpecificRenderer + '" is not a function.');
        }
        el.innerHTML = winHopscotch.templates[tourSpecificRenderer](opts);
      }
      else if(customRenderer){
        el.innerHTML = customRenderer(opts);
      }
      else{
        if(!winHopscotch.templates || (typeof winHopscotch.templates[templateToUse] !== 'function')){
          throw new Error('Bubble rendering failed - template "' + templateToUse + '" is not a function.');
        }
        el.innerHTML = winHopscotch.templates[templateToUse](opts);
      }

      // Find arrow among new child elements.
      children = el.children;
      numChildren = children.length;
      for (i = 0; i < numChildren; i++){
        node = children[i];

        if(utils.hasClass(node, 'hopscotch-arrow')){
          this.arrowEl = node;
        }
      }

      // Set z-index and arrow placement
      el.style.zIndex = (typeof step.zindex === 'number') ? step.zindex : '';
      this._setArrow(step.placement);

      // Set bubble positioning
      // Make sure we're using visibility:hidden instead of display:none for height/width calculations.
      this.hide(false);
      this.setPosition(step);

      // only want to adjust window scroll for non-fixed elements
      if (callback) {
        callback(!step.fixedElement);
      }

      return this;
    },
    /**
     * Get step number considering steps that were skipped because their target wasn't found
     *
     * @private
     */
    _getStepNum: function(idx) {
      var skippedStepsCount = 0,
          stepIdx,
          skippedSteps = winHopscotch.getSkippedStepsIndexes(),
          i,
          len = skippedSteps.length;
      //count number of steps skipped before current step
      for(i = 0; i < len; i++) {
        stepIdx = skippedSteps[i];
        if(stepIdx<idx) {
          skippedStepsCount++;
        }
      }
      return idx - skippedStepsCount;
    },
    /**
     * Get the I18N step number for the current step.
     *
     * @private
     */
    _getStepI18nNum: function(idx) {
      var stepNumI18N = utils.getI18NString('stepNums');
      if (stepNumI18N && idx < stepNumI18N.length) {
        idx = stepNumI18N[idx];
      }
      else {
        idx = idx + 1;
      }
      return idx;
    },

    /**
     * Sets which side the arrow is on.
     *
     * @private
     */
    _setArrow: function(placement) {
      utils.removeClass(this.arrowEl, 'down up right left');

      // Whatever the orientation is, we want to arrow to appear
      // "opposite" of the orientation. E.g., a top orientation
      // requires a bottom arrow.
      if (placement === 'top') {
        utils.addClass(this.arrowEl, 'down');
      }
      else if (placement === 'bottom') {
        utils.addClass(this.arrowEl, 'up');
      }
      else if (placement === 'left') {
        utils.addClass(this.arrowEl, 'right');
      }
      else if (placement === 'right') {
        utils.addClass(this.arrowEl, 'left');
      }
    },

    /**
     * @private
     */
    _getArrowDirection: function() {
      if (this.placement === 'top') {
        return 'down';
      }
      if (this.placement === 'bottom') {
        return 'up';
      }
      if (this.placement === 'left') {
        return 'right';
      }
      if (this.placement === 'right') {
        return 'left';
      }
    },

    show: function() {
      var self      = this,
          fadeClass = 'fade-in-' + this._getArrowDirection(),
          fadeDur   = 1000;

      utils.removeClass(this.element, 'hide');
      utils.addClass(this.element, fadeClass);
      setTimeout(function() {
        utils.removeClass(self.element, 'invisible');
      }, 50);
      setTimeout(function() {
        utils.removeClass(self.element, fadeClass);
      }, fadeDur);
      this.isShowing = true;
      return this;
    },

    hide: function(remove) {
      var el = this.element;

      remove = utils.valOrDefault(remove, true);
      el.style.top = '';
      el.style.left = '';

      // display: none
      if (remove) {
        utils.addClass(el, 'hide');
        utils.removeClass(el, 'invisible');
      }
      // opacity: 0
      else {
        utils.removeClass(el, 'hide');
        utils.addClass(el, 'invisible');
      }
      utils.removeClass(el, 'animate fade-in-up fade-in-down fade-in-right fade-in-left');
      this.isShowing = false;
      return this;
    },

    destroy: function() {
      var el = this.element;

      if (el) {
        el.parentNode.removeChild(el);
      }
      utils.removeEvtListener(el, 'click', this.clickCb);
    },

    _handleBubbleClick: function(evt){
      var action;

      // Override evt for IE8 as IE8 doesn't pass event but binds it to window
      evt = evt || window.event; // get window.event if argument is falsy (in IE)

      // get srcElement if target is falsy (IE)
      var targetElement = evt.target || evt.srcElement;

      //Recursively look up the parent tree until we find a match
      //with one of the classes we're looking for, or the triggering element.
      function findMatchRecur(el){
        /* We're going to make the assumption that we're not binding
         * multiple event classes to the same element.
         * (next + previous = wait... err... what?)
         *
         * In the odd event we end up with an element with multiple
         * possible matches, the following priority order is applied:
         * hopscotch-cta, hopscotch-next, hopscotch-prev, hopscotch-close
         */
         if(el === evt.currentTarget){ return null; }
         if(utils.hasClass(el, 'hopscotch-cta')){ return 'cta'; }
         if(utils.hasClass(el, 'hopscotch-next')){ return 'next'; }
         if(utils.hasClass(el, 'hopscotch-prev')){ return 'prev'; }
         if(utils.hasClass(el, 'hopscotch-close')){ return 'close'; }
         /*else*/ return findMatchRecur(el.parentElement);
      }

      action = findMatchRecur(targetElement);

      //Now that we know what action we should take, let's take it.
      if (action === 'cta'){
        if (!this.opt.isTourBubble) {
          // This is a callout. Close the callout when CTA is clicked.
          winHopscotch.getCalloutManager().removeCallout(this.currStep.id);
        }
        // Call onCTA callback if one is provided
        if (this.currStep.onCTA) {
          utils.invokeCallback(this.currStep.onCTA);
        }
      }
      else if (action === 'next'){
        winHopscotch.nextStep(true);
      }
      else if (action === 'prev'){
        winHopscotch.prevStep(true);
      }
      else if (action === 'close'){
        if (this.opt.isTourBubble){
          var currStepNum   = winHopscotch.getCurrStepNum(),
              currTour      = winHopscotch.getCurrTour(),
              doEndCallback = (currStepNum === currTour.steps.length-1);

          utils.invokeEventCallbacks('close');

          winHopscotch.endTour(true, doEndCallback);
        } else {
          if (this.opt.onClose) {
            utils.invokeCallback(this.opt.onClose);
          }
          if (this.opt.id && !this.opt.isTourBubble) {
            // Remove via the HopscotchCalloutManager.
            // removeCallout() calls HopscotchBubble.destroy internally.
            winHopscotch.getCalloutManager().removeCallout(this.opt.id);
          }
          else {
            this.destroy();
          }
        }

        utils.evtPreventDefault(evt);
      }
      //Otherwise, do nothing. We didn't click on anything relevant.
    },

    init: function(initOpt) {
      var el              = document.createElement('div'),
          self            = this,
          resizeCooldown  = false, // for updating after window resize
          onWinResize,
          appendToBody,
          children,
          numChildren,
          node,
          i,
          currTour,
          opt;

      //Register DOM element for this bubble.
      this.element = el;

      //Merge bubble options with defaults.
      opt = {
        showPrevButton: defaultOpts.showPrevButton,
        showNextButton: defaultOpts.showNextButton,
        bubbleWidth:    defaultOpts.bubbleWidth,
        bubblePadding:  defaultOpts.bubblePadding,
        arrowWidth:     defaultOpts.arrowWidth,
        isRtl:          defaultOpts.isRtl,
        showNumber:     true,
        isTourBubble:   true
      };
      initOpt = (typeof initOpt === undefinedStr ? {} : initOpt);
      utils.extend(opt, initOpt);
      this.opt = opt;

      //Apply classes to bubble. Add "animated" for fade css animation
      el.className = 'hopscotch-bubble animated';
      if (!opt.isTourBubble) {
        utils.addClass(el, 'hopscotch-callout no-number');
      } else {
        currTour = winHopscotch.getCurrTour();
        if(currTour){
          utils.addClass(el, 'tour-' + currTour.id);
        }
      }

      /**
       * Not pretty, but IE8 doesn't support Function.bind(), so I'm
       * relying on closures to keep a handle of "this".
       * Reset position of bubble when window is resized
       *
       * @private
       */
      onWinResize = function() {
        if (resizeCooldown || !self.isShowing) {
          return;
        }

        resizeCooldown = true;
        setTimeout(function() {
          self.setPosition(self.currStep);
          resizeCooldown = false;
        }, 100);
      };

      //Add listener to reset bubble position on window resize
      utils.addEvtListener(window, 'resize', onWinResize);

      //Create our click callback handler and keep a
      //reference to it for later.
      this.clickCb = function(evt){
        self._handleBubbleClick(evt);
      };
      utils.addEvtListener(el, 'click', this.clickCb);

      //Hide the bubble by default
      this.hide();

      //Finally, append our new bubble to body once the DOM is ready.
      if (utils.documentIsReady()) {
        document.body.appendChild(el);
      }
      else {
        // Moz, webkit, Opera
        if (document.addEventListener) {
          appendToBody = function() {
            document.removeEventListener('DOMContentLoaded', appendToBody);
            window.removeEventListener('load', appendToBody);

            document.body.appendChild(el);
          };

          document.addEventListener('DOMContentLoaded', appendToBody, false);
        }
        // IE
        else {
          appendToBody = function() {
            if (document.readyState === 'complete') {
              document.detachEvent('onreadystatechange', appendToBody);
              window.detachEvent('onload', appendToBody);
              document.body.appendChild(el);
            }
          };

          document.attachEvent('onreadystatechange', appendToBody);
        }
        utils.addEvtListener(window, 'load', appendToBody);
      }
    }
  };

  /**
   * HopscotchCalloutManager
   *
   * @class Manages the creation and destruction of single callouts.
   * @constructor
   */
  HopscotchCalloutManager = function() {
    var callouts = {},
        calloutOpts = {};

    /**
     * createCallout
     *
     * Creates a standalone callout. This callout has the same API
     * as a Hopscotch tour bubble.
     *
     * @param {Object} opt The options for the callout. For the most
     * part, these are the same options as you would find in a tour
     * step.
     */
    this.createCallout = function(opt) {
      var callout;

      if (opt.id) {
        if(!validIdRegEx.test(opt.id)) {
          throw new Error('Callout ID is using an invalid format. Use alphanumeric, underscores, and/or hyphens only. First character must be a letter.');
        }
        if (callouts[opt.id]) {
          throw new Error('Callout by that id already exists. Please choose a unique id.');
        }
        if (!utils.getStepTarget(opt)) {
          throw new Error('Must specify existing target element via \'target\' option.');
        }
        opt.showNextButton = opt.showPrevButton = false;
        opt.isTourBubble = false;
        callout = new HopscotchBubble(opt);
        callouts[opt.id] = callout;
        calloutOpts[opt.id] = opt;
        callout.render(opt, null, function() {
          callout.show();
          if (opt.onShow) {
            utils.invokeCallback(opt.onShow);
          }
        });
      }
      else {
        throw new Error('Must specify a callout id.');
      }
      return callout;
    };

    /**
     * getCallout
     *
     * Returns a callout by its id.
     *
     * @param {String} id The id of the callout to fetch.
     * @returns {Object} HopscotchBubble
     */
    this.getCallout = function(id) {
      return callouts[id];
    };

    /**
     * removeAllCallouts
     *
     * Removes all existing callouts.
     */
    this.removeAllCallouts = function() {
      var calloutId;

      for (calloutId in callouts) {
        if (callouts.hasOwnProperty(calloutId)) {
          this.removeCallout(calloutId);
        }
      }
    };

    /**
     * removeCallout
     *
     * Removes an existing callout by id.
     *
     * @param {String} id The id of the callout to remove.
     */
    this.removeCallout = function(id) {
      var callout = callouts[id];

      callouts[id] = null;
      calloutOpts[id] = null;
      if (!callout) { return; }

      callout.destroy();
    };

    /**
     * refreshCalloutPositions
     *
     * Refresh the positions for all callouts known by the
     * callout manager. Typically you'll use
     * hopscotch.refreshBubblePosition() to refresh ALL
     * bubbles instead of calling this directly.
     */
    this.refreshCalloutPositions = function(){
      var calloutId,
          callout,
          opts;

      for (calloutId in callouts) {
        if (callouts.hasOwnProperty(calloutId) && calloutOpts.hasOwnProperty(calloutId)) {
          callout = callouts[calloutId];
          opts = calloutOpts[calloutId];
          if(callout && opts){
            callout.setPosition(opts);
          }
        }
      }
    };
  };

  /**
   * Hopscotch
   *
   * @class Creates the Hopscotch object. Used to manage tour progress and configurations.
   * @constructor
   * @param {Object} initOptions Options to be passed to `configure()`.
   */
  Hopscotch = function(initOptions) {
    var self       = this, // for targetClickNextFn
        bubble,
        calloutMgr,
        opt,
        currTour,
        currStepNum,
        skippedSteps = {},
        cookieTourId,
        cookieTourStep,
        cookieSkippedSteps = [],
        _configure,

    /**
     * getBubble
     *
     * Singleton accessor function for retrieving or creating bubble object.
     *
     * @private
     * @param setOptions {Boolean} when true, transfers configuration options to the bubble
     * @returns {Object} HopscotchBubble
     */
    getBubble = function(setOptions) {
      if (!bubble || !bubble.element || !bubble.element.parentNode) {
        bubble = new HopscotchBubble(opt);
      }
      if (setOptions) {
        utils.extend(bubble.opt, {
          bubblePadding:   getOption('bubblePadding'),
          bubbleWidth:     getOption('bubbleWidth'),
          showNextButton:  getOption('showNextButton'),
          showPrevButton:  getOption('showPrevButton'),
          showCloseButton: getOption('showCloseButton'),
          arrowWidth:      getOption('arrowWidth'),
          isRtl:           getOption('isRtl')
        });
      }
      return bubble;
    },

    /**
     * Destroy the bubble currently associated with Hopscotch.
     * This is done when we end the current tour.
     *
     * @private
     */
    destroyBubble = function() {
      if(bubble){
        bubble.destroy();
        bubble = null;
      }
    },

    /**
     * Convenience method for getting an option. Returns custom config option
     * or the default config option if no custom value exists.
     *
     * @private
     * @param name {String} config option name
     * @returns {Object} config option value
     */
    getOption = function(name) {
      if (typeof opt === 'undefined') {
        return defaultOpts[name];
      }
      return utils.valOrDefault(opt[name], defaultOpts[name]);
    },

    /**
     * getCurrStep
     *
     * @private
     * @returns {Object} the step object corresponding to the current value of currStepNum
     */
    getCurrStep = function() {
      var step;

      if (!currTour || currStepNum < 0 || currStepNum >= currTour.steps.length) {
        step = null;
      }
      else {
        step = currTour.steps[currStepNum];
      }

      return step;
    },

    /**
     * Used for nextOnTargetClick
     *
     * @private
     */
    targetClickNextFn = function() {
      self.nextStep();
    },

    /**
     * adjustWindowScroll
     *
     * Checks if the bubble or target element is partially or completely
     * outside of the viewport. If it is, adjust the window scroll position
     * to bring it back into the viewport.
     *
     * @private
     * @param {Function} cb Callback to invoke after done scrolling.
     */
    adjustWindowScroll = function(cb) {
      var bubble         = getBubble(),

          // Calculate the bubble element top and bottom position
          bubbleEl       = bubble.element,
          bubbleTop      = utils.getPixelValue(bubbleEl.style.top),
          bubbleBottom   = bubbleTop + utils.getPixelValue(bubbleEl.offsetHeight),

          // Calculate the target element top and bottom position
          targetEl       = utils.getStepTarget(getCurrStep()),
          targetBounds   = targetEl.getBoundingClientRect(),
          targetElTop    = targetBounds.top + utils.getScrollTop(),
          targetElBottom = targetBounds.bottom + utils.getScrollTop(),

          // The higher of the two: bubble or target
          targetTop      = (bubbleTop < targetElTop) ? bubbleTop : targetElTop,
          // The lower of the two: bubble or target
          targetBottom   = (bubbleBottom > targetElBottom) ? bubbleBottom : targetElBottom,

          // Calculate the current viewport top and bottom
          windowTop      = utils.getScrollTop(),
          windowBottom   = windowTop + utils.getWindowHeight(),

          // This is our final target scroll value.
          scrollToVal    = targetTop - getOption('scrollTopMargin'),

          scrollEl,
          yuiAnim,
          yuiEase,
          direction,
          scrollIncr,
          scrollTimeout,
          scrollTimeoutFn;

      // Target and bubble are both visible in viewport
      if (targetTop >= windowTop && (targetTop <= windowTop + getOption('scrollTopMargin') || targetBottom <= windowBottom)) {
        if (cb) { cb(); } // HopscotchBubble.show
      }

      // Abrupt scroll to scroll target
      else if (!getOption('smoothScroll')) {
        window.scrollTo(0, scrollToVal);

        if (cb) { cb(); } // HopscotchBubble.show
      }

      // Smooth scroll to scroll target
      else {
        // Use YUI if it exists
        if (typeof YAHOO             !== undefinedStr &&
            typeof YAHOO.env         !== undefinedStr &&
            typeof YAHOO.env.ua      !== undefinedStr &&
            typeof YAHOO.util        !== undefinedStr &&
            typeof YAHOO.util.Scroll !== undefinedStr) {
          scrollEl = YAHOO.env.ua.webkit ? document.body : document.documentElement;
          yuiEase = YAHOO.util.Easing ? YAHOO.util.Easing.easeOut : undefined;
          yuiAnim = new YAHOO.util.Scroll(scrollEl, {
            scroll: { to: [0, scrollToVal] }
          }, getOption('scrollDuration')/1000, yuiEase);
          yuiAnim.onComplete.subscribe(cb);
          yuiAnim.animate();
        }

        // Use jQuery if it exists
        else if (hasJquery) {
          jQuery('body, html').animate({ scrollTop: scrollToVal }, getOption('scrollDuration'), cb);
        }

        // Use my crummy setInterval scroll solution if we're using plain, vanilla Javascript.
        else {
          if (scrollToVal < 0) {
            scrollToVal = 0;
          }

          // 48 * 10 == 480ms scroll duration
          // make it slightly less than CSS transition duration because of
          // setInterval overhead.
          // To increase or decrease duration, change the divisor of scrollIncr.
          direction = (windowTop > targetTop) ? -1 : 1; // -1 means scrolling up, 1 means down
          scrollIncr = Math.abs(windowTop - scrollToVal) / (getOption('scrollDuration')/10);
          scrollTimeoutFn = function() {
            var scrollTop = utils.getScrollTop(),
                scrollTarget = scrollTop + (direction * scrollIncr);

            if ((direction > 0 && scrollTarget >= scrollToVal) ||
                (direction < 0 && scrollTarget <= scrollToVal)) {
              // Overshot our target. Just manually set to equal the target
              // and clear the interval
              scrollTarget = scrollToVal;
              if (cb) { cb(); } // HopscotchBubble.show
              window.scrollTo(0, scrollTarget);
              return;
            }

            window.scrollTo(0, scrollTarget);

            if (utils.getScrollTop() === scrollTop) {
              // Couldn't scroll any further.
              if (cb) { cb(); } // HopscotchBubble.show
              return;
            }

            // If we reached this point, that means there's still more to scroll.
            setTimeout(scrollTimeoutFn, 10);
          };

          scrollTimeoutFn();
        }
      }
    },

    /**
     * goToStepWithTarget
     *
     * Helper function to increment the step number until a step is found where
     * the step target exists or until we reach the end/beginning of the tour.
     *
     * @private
     * @param {Number} direction Either 1 for incrementing or -1 for decrementing
     * @param {Function} cb The callback function to be invoked when the step has been found
     */
    goToStepWithTarget = function(direction, cb) {
      var target,
          step,
          goToStepFn;

      if (currStepNum + direction >= 0 &&
          currStepNum + direction < currTour.steps.length) {

        currStepNum += direction;
        step = getCurrStep();

        goToStepFn = function() {
          target = utils.getStepTarget(step);

          if (target) {
            //this step was previously skipped, but now its target exists,
            //remove this step from skipped steps set
            if(skippedSteps[currStepNum]) {
              delete skippedSteps[currStepNum];
            }
            // We're done! Return the step number via the callback.
            cb(currStepNum);
          }
          else {
            //mark this step as skipped, since its target wasn't found
            skippedSteps[currStepNum] = true;
            // Haven't found a valid target yet. Recursively call
            // goToStepWithTarget.
            utils.invokeEventCallbacks('error');
            goToStepWithTarget(direction, cb);
          }
        };

        if (step.delay) {
          setTimeout(goToStepFn, step.delay);
        }
        else {
          goToStepFn();
        }
      }
      else {
        cb(-1); // signal that we didn't find any step with a valid target
      }
    },

    /**
     * changeStep
     *
     * Helper function to change step by going forwards or backwards 1.
     * nextStep and prevStep are publicly accessible wrappers for this function.
     *
     * @private
     * @param {Boolean} doCallbacks Flag for invoking onNext or onPrev callbacks
     * @param {Number} direction Either 1 for "next" or -1 for "prev"
     */
    changeStep = function(doCallbacks, direction) {
      var bubble = getBubble(),
          self = this,
          step,
          origStep,
          wasMultiPage,
          changeStepCb;

      bubble.hide();

      doCallbacks = utils.valOrDefault(doCallbacks, true);

      step = getCurrStep();

      if (step.nextOnTargetClick) {
        // Detach the listener when tour is moving to a different step
        utils.removeEvtListener(utils.getStepTarget(step), 'click', targetClickNextFn);
      }

      origStep = step;
      if (direction > 0) {
        wasMultiPage = origStep.multipage;
      }
      else {
        wasMultiPage = (currStepNum > 0 && currTour.steps[currStepNum-1].multipage);
      }

      /**
       * Callback for goToStepWithTarget
       *
       * @private
       */
      changeStepCb = function(stepNum) {
        var doShowFollowingStep;

        if (stepNum === -1) {
          // Wasn't able to find a step with an existing element. End tour.
          return this.endTour(true);
        }

        if (doCallbacks) {
          if (direction > 0) {
            doShowFollowingStep = utils.invokeEventCallbacks('next', origStep.onNext);
          }
          else {
            doShowFollowingStep = utils.invokeEventCallbacks('prev', origStep.onPrev);
          }
        }

        // If the state of the tour is updated in a callback, assume the client
        // doesn't want to go to next step since they specifically updated.
        if (stepNum !== currStepNum) {
          return;
        }

        if (wasMultiPage) {
          // Update state for the next page
           setStateHelper();

          // Next step is on a different page, so no need to attempt to render it.
          return;
        }

        doShowFollowingStep = utils.valOrDefault(doShowFollowingStep, true);

        // If the onNext/onPrev callback returned false, halt the tour and
        // don't show the next step.
        if (doShowFollowingStep) {
          this.showStep(stepNum);
        }
        else {
          // Halt tour (but don't clear state)
          this.endTour(false);
        }
      };

      if (!wasMultiPage && getOption('skipIfNoElement')) {
        goToStepWithTarget(direction, function(stepNum) {
          changeStepCb.call(self, stepNum);
        });
      }
      else if (currStepNum + direction >= 0 && currStepNum + direction < currTour.steps.length) {
        // only try incrementing once, and invoke error callback if no target is found
        currStepNum += direction;
        step = getCurrStep();
        if (!utils.getStepTarget(step) && !wasMultiPage) {
          utils.invokeEventCallbacks('error');
          return this.endTour(true, false);
        }
        changeStepCb.call(this, currStepNum);
      } else if (currStepNum + direction === currTour.steps.length) {
        return this.endTour();
      }

      return this;
    },

    /**
     * loadTour
     *
     * Loads, but does not display, tour.
     *
     * @private
     * @param tour The tour JSON object
     */
    loadTour = function(tour) {
      var tmpOpt = {},
          prop,
          tourState,
          tourStateValues;

      // Set tour-specific configurations
      for (prop in tour) {
        if (tour.hasOwnProperty(prop) &&
            prop !== 'id' &&
            prop !== 'steps') {
          tmpOpt[prop] = tour[prop];
        }
      }

      //this.resetDefaultOptions(); // reset all options so there are no surprises
      // TODO check number of config properties of tour
      _configure.call(this, tmpOpt, true);

      // Get existing tour state, if it exists.
      tourState = utils.getState(getOption('cookieName'));
      if (tourState) {
        tourStateValues     = tourState.split(':');
        cookieTourId        = tourStateValues[0]; // selecting tour is not supported by this framework.
        cookieTourStep      = tourStateValues[1];

        if(tourStateValues.length > 2) {
          cookieSkippedSteps = tourStateValues[2].split(',');
        }

        cookieTourStep    = parseInt(cookieTourStep, 10);
      }

      return this;
    },

    /**
     * Find the first step to show for a tour. (What is the first step with a
     * target on the page?)
     */
    findStartingStep = function(startStepNum, savedSkippedSteps, cb) {
      var step,
          target;

      currStepNum = startStepNum || 0;
      skippedSteps = savedSkippedSteps || {};
      step        = getCurrStep();
      target      = utils.getStepTarget(step);

      if (target) {
        // First step had an existing target.
        cb(currStepNum);
        return;
      }

      if (!target) {
        // Previous target doesn't exist either. The user may have just
        // clicked on a link that wasn't part of the tour. Another possibility is that
        // the user clicked on the correct link, but the target is just missing for
        // whatever reason. In either case, we should just advance until we find a step
        // that has a target on the page or end the tour if we can't find such a step.
        utils.invokeEventCallbacks('error');

        //this step was skipped, since its target does not exist
        skippedSteps[currStepNum] = true;

        if (getOption('skipIfNoElement')) {
          goToStepWithTarget(1, cb);
          return;
        }
        else {
          currStepNum = -1;
          cb(currStepNum);
        }
      }
    },

    showStepHelper = function(stepNum) {
      var step         = currTour.steps[stepNum],
          bubble       = getBubble(),
          targetEl     = utils.getStepTarget(step);

      function showBubble() {
        bubble.show();
        utils.invokeEventCallbacks('show', step.onShow);
      }

      if (currStepNum !== stepNum && getCurrStep().nextOnTargetClick) {
        // Detach the listener when tour is moving to a different step
        utils.removeEvtListener(utils.getStepTarget(getCurrStep()), 'click', targetClickNextFn);
      }

      // Update bubble for current step
      currStepNum = stepNum;

      bubble.hide(false);

      bubble.render(step, stepNum, function(adjustScroll) {
        // when done adjusting window scroll, call showBubble helper fn
        if (adjustScroll) {
          adjustWindowScroll(showBubble);
        }
        else {
          showBubble();
        }

        // If we want to advance to next step when user clicks on target.
        if (step.nextOnTargetClick) {
          utils.addEvtListener(targetEl, 'click', targetClickNextFn);
        }
      });

      setStateHelper();
    },

    setStateHelper = function() {
      var cookieVal = currTour.id + ':' + currStepNum,
        skipedStepIndexes = winHopscotch.getSkippedStepsIndexes();

      if(skipedStepIndexes && skipedStepIndexes.length > 0) {
        cookieVal += ':' + skipedStepIndexes.join(',');
      }

      utils.setState(getOption('cookieName'), cookieVal, 1);
    },

    /**
     * init
     *
     * Initializes the Hopscotch object.
     *
     * @private
     */
    init = function(initOptions) {
      if (initOptions) {
        //initOptions.cookieName = initOptions.cookieName || 'hopscotch.tour.state';
        this.configure(initOptions);
      }
    };

    /**
     * getCalloutManager
     *
     * Gets the callout manager.
     *
     * @returns {Object} HopscotchCalloutManager
     *
     */
    this.getCalloutManager = function() {
      if (typeof calloutMgr === undefinedStr) {
        calloutMgr = new HopscotchCalloutManager();
      }

      return calloutMgr;
    };

    /**
     * startTour
     *
     * Begins the tour.
     *
     * @param {Object} tour The tour JSON object
     * @stepNum {Number} stepNum __Optional__ The step number to start from
     * @returns {Object} Hopscotch
     *
     */
    this.startTour = function(tour, stepNum) {
      var bubble,
          currStepNum,
          skippedSteps = {},
          self = this;

      // loadTour if we are calling startTour directly. (When we call startTour
      // from window onLoad handler, we'll use currTour)
      if (!currTour) {
        
        // Sanity check! Is there a tour?
        if(!tour){
          throw new Error('Tour data is required for startTour.');
        }

        // Check validity of tour ID. If invalid, throw an error.
        if(!tour.id || !validIdRegEx.test(tour.id)) {
          throw new Error('Tour ID is using an invalid format. Use alphanumeric, underscores, and/or hyphens only. First character must be a letter.');
        }

        currTour = tour;
        loadTour.call(this, tour);

      }

      if (typeof stepNum !== undefinedStr) {
        if (stepNum >= currTour.steps.length) {
          throw new Error('Specified step number out of bounds.');
        }
        currStepNum = stepNum;
      }

      // If document isn't ready, wait for it to finish loading.
      // (so that we can calculate positioning accurately)
      if (!utils.documentIsReady()) {
        waitingToStart = true;
        return this;
      }

      if (typeof currStepNum === "undefined" && currTour.id === cookieTourId && typeof cookieTourStep !== undefinedStr) {
        currStepNum = cookieTourStep;
        if(cookieSkippedSteps.length > 0){
          for(var i = 0, len = cookieSkippedSteps.length; i < len; i++) {
            skippedSteps[cookieSkippedSteps[i]] = true;
          }
        }
      }
      else if (!currStepNum) {
        currStepNum = 0;
      }

      // Find the current step we should begin the tour on, and then actually start the tour.
      findStartingStep(currStepNum, skippedSteps, function(stepNum) {
        var target = (stepNum !== -1) && utils.getStepTarget(currTour.steps[stepNum]);

        if (!target) {
          // Should we trigger onEnd callback? Let's err on the side of caution
          // and not trigger it. Don't want weird stuff happening on a page that
          // wasn't meant for the tour. Up to the developer to fix their tour.
          self.endTour(false, false);
          return;
        }

        utils.invokeEventCallbacks('start');

        bubble = getBubble();
        // TODO: do we still need this call to .hide()? No longer using opt.animate...
        // Leaving it in for now to play it safe
        bubble.hide(false); // make invisible for boundingRect calculations when opt.animate == true

        self.isActive = true;

        if (!utils.getStepTarget(getCurrStep())) {
          // First step element doesn't exist
          utils.invokeEventCallbacks('error');
          if (getOption('skipIfNoElement')) {
            self.nextStep(false);
          }
        }
        else {
          self.showStep(stepNum);
        }
      });

      return this;
    };

    /**
     * showStep
     *
     * Skips to a specific step and renders the corresponding bubble.
     *
     * @stepNum {Number} stepNum The step number to show
     * @returns {Object} Hopscotch
     */
    this.showStep = function(stepNum) {
      var step = currTour.steps[stepNum];
      if(!utils.getStepTarget(step)) {
        return;
      }

      if (step.delay) {
        setTimeout(function() {
          showStepHelper(stepNum);
        }, step.delay);
      }
      else {
        showStepHelper(stepNum);
      }
      return this;
    };

    /**
     * prevStep
     *
     * Jump to the previous step.
     *
     * @param {Boolean} doCallbacks Flag for invoking onPrev callback. Defaults to true.
     * @returns {Object} Hopscotch
     */
    this.prevStep = function(doCallbacks) {
      changeStep.call(this, doCallbacks, -1);
      return this;
    };

    /**
     * nextStep
     *
     * Jump to the next step.
     *
     * @param {Boolean} doCallbacks Flag for invoking onNext callback. Defaults to true.
     * @returns {Object} Hopscotch
     */
    this.nextStep = function(doCallbacks) {
      changeStep.call(this, doCallbacks, 1);
      return this;
    };

    /**
     * endTour
     *
     * Cancels out of an active tour.
     *
     * @param {Boolean} clearState Flag for clearing state. Defaults to true.
     * @param {Boolean} doCallbacks Flag for invoking 'onEnd' callbacks. Defaults to true.
     * @returns {Object} Hopscotch
     */
    this.endTour = function(clearState, doCallbacks) {
      var bubble     = getBubble(),
        currentStep;

      clearState     = utils.valOrDefault(clearState, true);
      doCallbacks    = utils.valOrDefault(doCallbacks, true);

      //remove event listener if current step had it added
      if(currTour) {
        currentStep = getCurrStep();
        if(currentStep && currentStep.nextOnTargetClick) {
          utils.removeEvtListener(utils.getStepTarget(currentStep), 'click', targetClickNextFn);
        }
      }

      currStepNum    = 0;
      cookieTourStep = undefined;

      bubble.hide();
      if (clearState) {
        utils.clearState(getOption('cookieName'));
      }
      if (this.isActive) {
        this.isActive = false;

        if (currTour && doCallbacks) {
          utils.invokeEventCallbacks('end');
        }
      }

      this.removeCallbacks(null, true);
      this.resetDefaultOptions();
      destroyBubble();

      currTour = null;

      return this;
    };

    /**
     * getCurrTour
     *
     * @return {Object} The currently loaded tour.
     */
    this.getCurrTour = function() {
      return currTour;
    };

    /**
     * getCurrTarget
     *
     * @return {Object} The currently visible target.
     */
    this.getCurrTarget = function() {
      return utils.getStepTarget(getCurrStep());
    };

    /**
     * getCurrStepNum
     *
     * @return {number} The current zero-based step number.
     */
    this.getCurrStepNum = function() {
      return currStepNum;
    };

    /**
     * getSkippedStepsIndexes
     *
     * @return {Array} Array of skipped step indexes
     */
    this.getSkippedStepsIndexes = function() {
      var skippedStepsIdxArray = [],
         stepIds;

      for(stepIds in skippedSteps){
        skippedStepsIdxArray.push(stepIds);
      }

      return skippedStepsIdxArray;
    };

    /**
     * refreshBubblePosition
     *
     * Tell hopscotch that the position of the current tour element changed
     * and the bubble therefore needs to be redrawn. Also refreshes position
     * of all Hopscotch Callouts on the page.
     *
     * @returns {Object} Hopscotch
     */
    this.refreshBubblePosition = function() {
      var currStep = getCurrStep();
      if(currStep){
        getBubble().setPosition(currStep);
      }
      this.getCalloutManager().refreshCalloutPositions();
      return this;
    };

    /**
     * listen
     *
     * Adds a callback for one of the event types. Valid event types are:
     *
     * @param {string} evtType "start", "end", "next", "prev", "show", "close", or "error"
     * @param {Function} cb The callback to add.
     * @param {Boolean} isTourCb Flag indicating callback is from a tour definition.
     *    For internal use only!
     * @returns {Object} Hopscotch
     */
    this.listen = function(evtType, cb, isTourCb) {
      if (evtType) {
        callbacks[evtType].push({ cb: cb, fromTour: isTourCb });
      }
      return this;
    };

    /**
     * unlisten
     *
     * Removes a callback for one of the event types, e.g. 'start', 'next', etc.
     *
     * @param {string} evtType "start", "end", "next", "prev", "show", "close", or "error"
     * @param {Function} cb The callback to remove.
     * @returns {Object} Hopscotch
     */
    this.unlisten = function(evtType, cb) {
      var evtCallbacks = callbacks[evtType],
          i,
          len;

      for (i = 0, len = evtCallbacks.length; i < len; ++i) {
        if (evtCallbacks[i] === cb) {
          evtCallbacks.splice(i, 1);
        }
      }
      return this;
    };

    /**
     * removeCallbacks
     *
     * Remove callbacks for hopscotch events. If tourOnly is set to true, only
     * removes callbacks specified by a tour (callbacks set by external calls
     * to hopscotch.configure or hopscotch.listen will not be removed). If
     * evtName is null or undefined, callbacks for all events will be removed.
     *
     * @param {string} evtName Optional Event name for which we should remove callbacks
     * @param {boolean} tourOnly Optional flag to indicate we should only remove callbacks added
     *    by a tour. Defaults to false.
     * @returns {Object} Hopscotch
     */
    this.removeCallbacks = function(evtName, tourOnly) {
      var cbArr,
          i,
          len,
          evt;

      // If evtName is null or undefined, remove callbacks for all events.
      for (evt in callbacks) {
        if (!evtName || evtName === evt) {
          if (tourOnly) {
            cbArr = callbacks[evt];
            for (i=0, len=cbArr.length; i < len; ++i) {
              if (cbArr[i].fromTour) {
                cbArr.splice(i--, 1);
                --len;
              }
            }
          }
          else {
            callbacks[evt] = [];
          }
        }
      }
      return this;
    };

    /**
     * registerHelper
     * ==============
     * Registers a helper function to be used as a callback function.
     *
     * @param {String} id The id of the function.
     * @param {Function} id The callback function.
     */
    this.registerHelper = function(id, fn) {
      if (typeof id === 'string' && typeof fn === 'function') {
        helpers[id] = fn;
      }
    };

    this.unregisterHelper = function(id) {
      helpers[id] = null;
    };

    this.invokeHelper = function(id) {
      var args = [],
          i,
          len;

      for (i = 1, len = arguments.length; i < len; ++i) {
        args.push(arguments[i]);
      }
      if (helpers[id]) {
        helpers[id].call(null, args);
      }
    };

    /**
     * setCookieName
     *
     * Sets the cookie name (or sessionStorage name, if supported) used for multi-page
     * tour persistence.
     *
     * @param {String} name The cookie name
     * @returns {Object} Hopscotch
     */
    this.setCookieName = function(name) {
      opt.cookieName = name;
      return this;
    };

    /**
     * resetDefaultOptions
     *
     * Resets all configuration options to default.
     *
     * @returns {Object} Hopscotch
     */
    this.resetDefaultOptions = function() {
      opt = {};
      return this;
    };

    /**
     * resetDefaultI18N
     *
     * Resets all i18n.
     *
     * @returns {Object} Hopscotch
     */
    this.resetDefaultI18N = function() {
      customI18N = {};
      return this;
    };

    /**
     * hasState
     *
     * Returns state from a previous tour run, if it exists.
     *
     * @returns {String} State of previous tour run, or empty string if none exists.
     */
    this.getState = function() {
      return utils.getState(getOption('cookieName'));
    };

    /**
     * _configure
     *
     * @see this.configure
     * @private
     * @param options
     * @param {Boolean} isTourOptions Should be set to true when setting options from a tour definition.
     */
    _configure = function(options, isTourOptions) {
      var bubble,
          events = ['next', 'prev', 'start', 'end', 'show', 'error', 'close'],
          eventPropName,
          callbackProp,
          i,
          len;

      if (!opt) {
        this.resetDefaultOptions();
      }

      utils.extend(opt, options);

      if (options) {
        utils.extend(customI18N, options.i18n);
      }

      for (i = 0, len = events.length; i < len; ++i) {
        // At this point, options[eventPropName] may have changed from an array
        // to a function.
        eventPropName = 'on' + events[i].charAt(0).toUpperCase() + events[i].substring(1);
        if (options[eventPropName]) {
          this.listen(events[i],
                      options[eventPropName],
                      isTourOptions);
        }
      }

      bubble = getBubble(true);

      return this;
    };

    /**
     * configure
     *
     * <pre>
     * VALID OPTIONS INCLUDE...
     *
     * - bubbleWidth:     Number   - Default bubble width. Defaults to 280.
     * - bubblePadding:   Number   - DEPRECATED. Default bubble padding. Defaults to 15.
     * - smoothScroll:    Boolean  - should the page scroll smoothly to the next
     *                               step? Defaults to TRUE.
     * - scrollDuration:  Number   - Duration of page scroll. Only relevant when
     *                               smoothScroll is set to true. Defaults to
     *                               1000ms.
     * - scrollTopMargin: NUMBER   - When the page scrolls, how much space should there
     *                               be between the bubble/targetElement and the top
     *                               of the viewport? Defaults to 200.
     * - showCloseButton: Boolean  - should the tour bubble show a close (X) button?
     *                               Defaults to TRUE.
     * - showPrevButton:  Boolean  - should the bubble have the Previous button?
     *                               Defaults to FALSE.
     * - showNextButton:  Boolean  - should the bubble have the Next button?
     *                               Defaults to TRUE.
     * - arrowWidth:      Number   - Default arrow width. (space between the bubble
     *                               and the targetEl) Used for bubble position
     *                               calculation. Only use this option if you are
     *                               using your own custom CSS. Defaults to 20.
     * - skipIfNoElement  Boolean  - If a specified target element is not found,
     *                               should we skip to the next step? Defaults to
     *                               TRUE.
     * - onNext:          Function - A callback to be invoked after every click on
     *                               a "Next" button.
     * - isRtl:           Boolean  - Set to true when instantiating in a right-to-left
     *                               language environment, or if mirrored positioning is
     *                               needed.
     *                               Defaults to FALSE.
     *
     * - i18n:            Object   - For i18n purposes. Allows you to change the
     *                               text of button labels and step numbers.
     * - i18n.stepNums:   Array\<String\> - Provide a list of strings to be shown as
     *                               the step number, based on index of array. Unicode
     *                               characters are supported. (e.g., ['&#x4e00;',
     *                               '&#x4e8c;', '&#x4e09;']) If there are more steps
     *                               than provided numbers, Arabic numerals
     *                               ('4', '5', '6', etc.) will be used as default.
     * // =========
     * // CALLBACKS
     * // =========
     * - onNext:          Function - Invoked after every click on a "Next" button.
     * - onPrev:          Function - Invoked after every click on a "Prev" button.
     * - onStart:         Function - Invoked when the tour is started.
     * - onEnd:           Function - Invoked when the tour ends.
     * - onClose:         Function - Invoked when the user closes the tour before finishing.
     * - onError:         Function - Invoked when the specified target element doesn't exist on the page.
     *
     * // ====
     * // I18N
     * // ====
     * i18n:              OBJECT      - For i18n purposes. Allows you to change the text
     *                                  of button labels and step numbers.
     * i18n.nextBtn:      STRING      - Label for next button
     * i18n.prevBtn:      STRING      - Label for prev button
     * i18n.doneBtn:      STRING      - Label for done button
     * i18n.skipBtn:      STRING      - Label for skip button
     * i18n.closeTooltip: STRING      - Text for close button tooltip
     * i18n.stepNums:   ARRAY<STRING> - Provide a list of strings to be shown as
     *                                  the step number, based on index of array. Unicode
     *                                  characters are supported. (e.g., ['&#x4e00;',
     *                                  '&#x4e8c;', '&#x4e09;']) If there are more steps
     *                                  than provided numbers, Arabic numerals
     *                                  ('4', '5', '6', etc.) will be used as default.
     * </pre>
     *
     * @example hopscotch.configure({ scrollDuration: 1000, scrollTopMargin: 150 });
     * @example
     * hopscotch.configure({
     *   scrollTopMargin: 150,
     *   onStart: function() {
     *     alert("Have fun!");
     *   },
     *   i18n: {
     *     nextBtn: 'Forward',
     *     prevBtn: 'Previous'
     *     closeTooltip: 'Quit'
     *   }
     * });
     *
     * @param {Object} options A hash of configuration options.
     * @returns {Object} Hopscotch
     */
    this.configure = function(options) {
      return _configure.call(this, options, false);
    };

    /**
     * Set the template that should be used for rendering Hopscotch bubbles.
     * If a string, it's assumed your template is available in the
     * hopscotch.templates namespace.
     *
     * @param {String|Function(obj)} The template to use for rendering.
     * @returns {Object} The Hopscotch object (for chaining).
     */
    this.setRenderer = function(render){
      var typeOfRender = typeof render;

      if(typeOfRender === 'string'){
        templateToUse = render;
        customRenderer = undefined;
      }
      else if(typeOfRender === 'function'){
        customRenderer = render;
      }
      return this;
    };

    /**
     * Sets the escaping method to be used by JST templates.
     *
     * @param {Function} - The escape method to use.
     * @returns {Object} The Hopscotch object (for chaining).
     */
    this.setEscaper = function(esc){
      if (typeof esc === 'function'){
        customEscape = esc;
      }
      return this;
    };

    init.call(this, initOptions);
  };

  winHopscotch = new Hopscotch();

// Template includes, placed inside a closure to ensure we don't
// end up declaring our shim globally.
(function(){
var _ = {};
/*
 * Adapted from the Underscore.js framework. Check it out at
 * https://github.com/jashkenas/underscore
 */
_.escape = function(str){
  if(customEscape){ return customEscape(str); }
  
  if(str == null) return '';
  return ('' + str).replace(new RegExp('[&<>"\']', 'g'), function(match){
    if(match == '&'){ return '&amp;' }
    if(match == '<'){ return '&lt;' }
    if(match == '>'){ return '&gt;' }
    if(match == '"'){ return '&quot;' }
    if(match == "'"){ return '&#x27;' }
  });
}
this["templates"] = this["templates"] || {};

this["templates"]["bubble_default"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {


  function optEscape(str, unsafe){
    if(unsafe){
      return _.escape(str);
    }
    return str;
  }
;
__p += '\n<div class="hopscotch-bubble-container" style="width: ' +
((__t = ( step.width )) == null ? '' : __t) +
'px; padding: ' +
((__t = ( step.padding )) == null ? '' : __t) +
'px;">\n  ';
 if(tour.isTour){ ;
__p += '<span class="hopscotch-bubble-number">' +
((__t = ( i18n.stepNum )) == null ? '' : __t) +
'</span>';
 } ;
__p += '\n  <div class="hopscotch-bubble-content">\n    ';
 if(step.title !== ''){ ;
__p += '<h3 class="hopscotch-title">' +
((__t = ( optEscape(step.title, tour.unsafe) )) == null ? '' : __t) +
'</h3>';
 } ;
__p += '\n    ';
 if(step.content  !== ''){ ;
__p += '<div class="hopscotch-content">' +
((__t = ( optEscape(step.content, tour.unsafe) )) == null ? '' : __t) +
'</div>';
 } ;
__p += '\n  </div>\n  <div class="hopscotch-actions">\n    ';
 if(buttons.showPrev){ ;
__p += '<button class="hopscotch-nav-button prev hopscotch-prev">' +
((__t = ( i18n.prevBtn )) == null ? '' : __t) +
'</button>';
 } ;
__p += '\n    ';
 if(buttons.showCTA){ ;
__p += '<button class="hopscotch-nav-button next hopscotch-cta">' +
((__t = ( buttons.ctaLabel )) == null ? '' : __t) +
'</button>';
 } ;
__p += '\n    ';
 if(buttons.showNext){ ;
__p += '<button class="hopscotch-nav-button next hopscotch-next">' +
((__t = ( i18n.nextBtn )) == null ? '' : __t) +
'</button>';
 } ;
__p += '\n  </div>\n  ';
 if(buttons.showClose){ ;
__p += '<button class="hopscotch-bubble-close hopscotch-close">' +
((__t = ( i18n.closeTooltip )) == null ? '' : __t) +
'</button>';
 } ;
__p += '\n</div>\n<div class="hopscotch-bubble-arrow-container hopscotch-arrow">\n  <div class="hopscotch-bubble-arrow-border"></div>\n  <div class="hopscotch-bubble-arrow"></div>\n</div>';

}
return __p
};
}.call(winHopscotch));

  return winHopscotch;

})));
/* globals pbsParams, hopscotch, ContentTools, ContentEdit */


/**
 * Plays the tour. Should be only called when the editor is running.
 */
window.pbsPlayTour = function() {

	var helloListener = function() {
		if ( ! hopscotch.getCurrTour() ) {
			return;
		}
		if ( hopscotch.getCurrTour().id === 'editor-tour' && hopscotch.getCurrStepNum() === 0 ) {
			var root = ContentEdit.Root.get();
			if ( root.focused() ) {
				if ( root.focused().content ) {
					if ( root.focused().content.text().match( /sandwich/i ) ) {
						hopscotch.nextStep();
					}
				}
			}
		}
	};

	var nextStepHandler = function() {
		hopscotch.nextStep();
	};

	var newRowHandler = function( row ) {
		row._addCSSClass( 'pbs_tour_new_row' );
		hopscotch.nextStep();
	};

	hopscotch.endTour();

	// Add dummy content area for the tour.
	var mainRegion = ContentTools.EditorApp.get().regions()['main-content'];
	var createEmptyParagraph = true;
	if ( mainRegion.children.length > 0 ) {
		if ( mainRegion.children[0].constructor.name === 'Text' ) {
			if ( mainRegion.children[0].content.isWhitespace() ) {
				createEmptyParagraph = false;
			}
		}
	}

	// Create the starting area for the tour.
	if ( createEmptyParagraph ) {
		var startingParagraph = new ContentEdit.Text( 'p' );
		mainRegion.attach( startingParagraph, 0 );
		startingParagraph.focus();
	}

	var tour2 = {
		id: 'editor-tour',
  		i18n: {
  			doneBtn: pbsParams.labels.next
  		},
		steps: []
	};

	tour2.steps.push( {
		title: pbsParams.labels.tour_content_area_title,
		content: pbsParams.labels.tour_content_area_body,
		delay: 500,
		target: '.ce-element--type-text',
		placement: 'bottom',
		onShow: function() {
			window.pbsOnlyOpenSection();
			document.querySelector( '.ce-element--type-text' )._ceElement.focus();
			document.addEventListener( 'keyup', helloListener );
		},
		onNext: function() {
			document.removeEventListener( 'keyup', helloListener );
		}
	} );

	tour2.steps.push( {
		title: pbsParams.labels.tour_inspector_title,
		content: pbsParams.labels.tour_inspector_body,
		target: document.querySelector( '.ct-toolbox' ),
		placement: 'right',
		fixedElement: true,
		yOffset: 30,
		onShow: function() {
			window.pbsOnlyOpenSection( 'pbs-text-formatting-group' );
			document.querySelector( '.pbs-text-formatting-group' ).addEventListener( 'mouseover', nextStepHandler );
			// document.querySelector( '.pbs-text-formatting-group' ).style.animation = 'pbs-tour-glow-red infinite 2s';
		},
		onNext: function() {
			document.querySelector( '.pbs-text-formatting-group' ).removeEventListener( 'mouseover', nextStepHandler );
			// document.querySelector( '.pbs-text-formatting-group' ).style.animation = '';
		},
		onEnd: function() {
			// document.querySelector( '.pbs-text-formatting-group' ).style.animation = '';
		}
	} );

	if ( ! pbsParams.is_lite ) {
		tour2.steps.push( {
			title: 'Let&apos;s Try It Out',
			content: 'For starters, go ahead and click on this <strong>Increase Font Size</strong> button to make your text larger.<br><br>You can also hold down the ' + ( navigator.appVersion.indexOf('Mac') !== -1 ? 'Command' : 'CTRL' ) + ' key while clicking to decrease instead.<br><br><em>Try it out now.</em>',
			target: document.querySelector('.ct-tool--font-up'),
			onShow: function() {
				document.querySelector( '.ct-tool--font-up' ).addEventListener( 'mousedown', nextStepHandler );
				document.querySelector( '.ct-tool--font-up' ).style.animation = 'pbs-tour-glow-red infinite 2s';
			},
			onNext: function() {
				document.querySelector( '.ct-tool--font-up' ).removeEventListener( 'mousedown', nextStepHandler );
				document.querySelector( '.ct-tool--font-up' ).style.animation = '';
			},
			onEnd: function() {
				document.querySelector( '.ct-tool--font-up' ).style.animation = '';
			},
			placement: 'right',
			fixedElement: true,
			yOffset: -15
		} );
	} else {
		tour2.steps.push( {
			title: 'Let&apos;s Try It Out',
			content: 'For starters, go ahead and click on this <strong>Bold</strong> button to make your text bold.<br><br><em>Try it out now.</em>',
			target: document.querySelector('.ct-tool--bold'),
			onShow: function() {
				document.querySelector( '.ct-tool--bold' ).addEventListener( 'mousedown', nextStepHandler );
			},
			onNext: function() {
				document.querySelector( '.ct-tool--bold' ).removeEventListener( 'mousedown', nextStepHandler );
			},
			placement: 'right',
			fixedElement: true,
			yOffset: -15
		} );
	}

	if ( ! pbsParams.is_lite ) {
		tour2.steps.push( {
			title: 'Keep Clicking That Button',
			content: 'You&apos;ll be able to see your changes live. Hold down your mouse button to continuously increase the font size.<br><br>You can also try decreasing the size by holding the ' + ( navigator.appVersion.indexOf('Mac') !== -1 ? 'Command' : 'CTRL' ) + ' key while clicking the button. Or hold SHIFT+' + ( navigator.appVersion.indexOf('Mac') !== -1 ? 'Command' : 'CTRL' ) + ' keys to reset it to the original size.<br><br><em>Now try and click on the text color tool. It&apos;s the upper-left most button in the inspector.</em>',
			target: '.ce-element--type-text',
			placement: 'bottom',
			onShow: function() {
				document.querySelector( '.ct-tool--color' ).addEventListener( 'click', nextStepHandler );
				document.querySelector( '.ct-tool--color' ).style.animation = 'pbs-tour-glow-red infinite 2s';
			},
			onNext: function() {
				document.querySelector( '.ct-tool--color' ).removeEventListener( 'click', nextStepHandler );
				document.querySelector( '.ct-tool--color' ).style.animation = '';
			},
			onEnd: function() {
				document.querySelector( '.ct-tool--color' ).style.animation = '';
			}
		} );
	} else {
		tour2.steps.push( {
			title: 'You&apos;ll Be Able to See Your Changes Live',
			content: 'Clicking on the bold button again would remove the style.<br><br><em>Now try and click on the text color tool. It&apos;s the upper-left most button in the inspector.</em>',
			target: '.ce-element--type-text',
			placement: 'bottom',
			onShow: function() {
				document.querySelector( '.ct-tool--color' ).addEventListener( 'click', nextStepHandler );
				document.querySelector( '.ct-tool--color' ).style.animation = 'pbs-tour-glow-red infinite 2s';
			},
			onNext: function() {
				document.querySelector( '.ct-tool--color' ).removeEventListener( 'click', nextStepHandler );
				document.querySelector( '.ct-tool--color' ).style.animation = '';
			},
			onEnd: function() {
				document.querySelector( '.ct-tool--color' ).style.animation = '';
			}
		} );
	}

	tour2.steps.push( {
		title: 'Use This Color Picker to Change Colors',
		content: 'Clicking on different tools do different things. Color tools bring up color pickers, and some buttons toggle between different values.<br><br><em>Now drag the circular handle to change the color of your heading to proceed. Pick any color you like</em>',
		target: document.querySelector( '.ct-tool--color > *' ),
		placement: 'right',
		fixedElement: true,
		yOffset: 0,
		onShow: function() {
			wp.hooks.addAction( 'pbs.tool.color.applied', _.once( nextStepHandler ) );
		}
	} );
	tour2.steps.push( {
		title: 'How to Undo',
		content: 'Hmmm, hold on. I&apos;m not sure I like that color. Let&apos;s go back to the previous one. You can use the undo shortcut ' + ( navigator.appVersion.indexOf('Mac') !== -1 ? 'Command+Z' : 'CTRL+Z' ) + ' to revert your changes.<br><br><em>Try undoing the color changes to proceed.</em>',
		target: '.ce-element--type-text',
		placement: 'bottom',
		delay: 500,
		onShow: function() {
			wp.hooks.addAction( 'pbs.undo', _.once( nextStepHandler ) );
		},
		onNext: function() {
			window.pbsOnlyOpenSection( 'pbs-interactive-elements-group' );
		}
	} );
	tour2.steps.push( {
		title: 'Rows & Columns',
		content: 'You can also organize your content into different sections by adding rows & columns. You can place your content inside them and style the rows and columns to get a unique look.<br><br><em>Try adding a row with a single column now by clicking on the <strong>Add Row</strong> button.</em>',
		target: document.querySelector( '.ct-tool--onecolumn' ),
		placement: 'right',
		delay: 700,
		fixedElement: true,
		yOffset: 30,
		onShow: function() {
			wp.hooks.addAction( 'pbs.tool.row.applied', _.once( newRowHandler ) );
			document.querySelector( '.ct-tool--onecolumn' ).style.animation = 'pbs-tour-glow-red infinite 2s';
		},
		onNext: function() {
			document.querySelector( '.ct-tool--onecolumn' ).style.animation = '';
			// wp.hooks.removeAction( 'pbs.tool.row.applied', nextStepHandler );
		},
		onEnd: function() {
			document.querySelector( '.ct-tool--onecolumn' ).style.animation = '';
		}
	} );
	tour2.steps.push( {
		title: 'Rows Are Outlined',
		content: 'This is the row you just created. You can start typing right away to add content to it. But first let&apos;s try dragging the text above inside this row.<br><br><em>Click and hold your mouse on the &quot;Sandwich&quot; text we typed in earlier to start dragging it. (Tip: hold your mouse button for a long period)</em>',
		target: '.pbs_tour_new_row',
		placement: 'bottom',
		onShow: function() {
			document.querySelector( '.ce-element--type-text' ).addEventListener( 'mousedown', nextStepHandler );
		},
		onNext: function() {
			document.querySelector( '.pbs_tour_new_row' ).classList.remove( 'pbs_tour_new_row' );
			document.querySelector( '.ce-element--type-text' ).removeEventListener( 'mousedown', nextStepHandler );
		}
	} );
	tour2.steps.push( {
		title: 'Now Drag This into the Row',
		content: 'Drag it inside the row, the area you are dragging to will become highlighted with arrows. If the entire row is highlighted, this will drop your item before or after the row. If the items inside the row get highlighted, then it will be dropped <strong>inside</strong> the row.<br><br><em>Drop the text inside the row to continue.</em>',
		target: '.ce-element--type-text',
		placement: 'bottom',
		onShow: function() {
			document.addEventListener( 'mouseup', nextStepHandler );
		},
		onNext: function() {
			document.removeEventListener( 'mouseup', nextStepHandler );
			jQuery('.ct-toolbox').animate( {
				scrollTop: document.querySelector( '.pbs-row-group' ).offsetTop - 40
			}, 600 );
		}
	} );
	tour2.steps.push( {
		title: 'Properties Area',
		content: 'Since our row is currently selected, additional properties are shown in the inspector. These new buttons will help you further style your row.<br><br>Additional buttons are also available when other elements are selected.<br><br><em>Try it out now, add a border on your row by clicking on the <strong>border style</strong> button. Do this to proceed.</em>',
		target: '.pbs-row-group',
		delay: 700,
		placement: 'right',
		fixedElement: true,
		yOffset: 30,
		onShow: function() {
			var oneStepHandler = _.once( nextStepHandler );
			document.querySelector( '.pbs-button-col-border-style' ).addEventListener( 'mouseup', oneStepHandler );
			document.querySelector( '.pbs-button-col-border-width' ).addEventListener( 'mouseup', oneStepHandler );
			document.querySelector( '.pbs-button-col-border-style' ).style.animation = 'pbs-tour-glow-white infinite 2s';
		},
		onNext: function() {
			jQuery('.ct-toolbox').animate( {
				scrollTop: document.querySelector( '.pbs-interactive-elements-group' ).offsetTop - 40
			}, 600 );
			document.querySelector( '.pbs-button-col-border-style' ).style.animation = '';
		},
		onEnd: function() {
			document.querySelector( '.pbs-button-col-border-style' ).style.animation = '';
		}
	} );
	tour2.steps.push( {
		title: 'More Elements',
		content: 'Aside from text, rows and columns, there are other elements that you can add to your content like images, buttons and carousels.<br><br>' + ( pbsParams.is_lite ? 'Some elements are only available in the premium version of the plugin.<br><br>' : '' ) + '<em>' + ( pbsParams.is_lite ? 'Click on next to proceed.' : 'Click on the carousel button to add a carousel to proceed.' ) + '</em>',
		target: '.pbs-interactive-elements-group',
		delay: 700,
		placement: 'right',
		fixedElement: true,
		yOffset: 30,
		onShow: function() {
			if ( document.querySelector( '.ct-tool--carousel' ) ) {
				document.querySelector( '.ct-tool--carousel' ).addEventListener( 'mouseup', nextStepHandler );
				document.querySelector( '.ct-tool--carousel' ).style.animation = 'pbs-tour-glow-red infinite 2s';
			}
		},
		onNext: function() {
			if ( document.querySelector( '.ct-tool--carousel' ) ) {
				document.querySelector( '.ct-tool--carousel' ).removeEventListener( 'mouseup', nextStepHandler );
				document.querySelector( '.ct-tool--carousel' ).style.animation = '';
			}
		},
		onEnd: function() {
			document.querySelector( '.ct-tool--carousel' ).style.animation = '';
		}
	} );
	tour2.steps.push( {
		title: 'Using Interactive Elements',
		content: 'Some elements like this carousel are interactive. For carousels, in order to edit the other slides, you&apos;ll have to click on the bullets to navigate to them.<br><br><em>Click on the <strong>other bullets</strong> on this carousel to proceed.</em>',
		target: '.ce-element--type-carousel',
		placement: 'bottom',
		onShow: function() {
			var oneStepHandler = _.once( nextStepHandler );
			setTimeout(function() {
				document.querySelectorAll( '.ce-element--type-carousel .glide__bullet' )[1].addEventListener( 'mouseup', oneStepHandler );
				document.querySelectorAll( '.ce-element--type-carousel .glide__bullet' )[2].addEventListener( 'mouseup', oneStepHandler );
				document.querySelectorAll( '.ce-element--type-carousel .glide__bullet' )[2].style.animation = 'pbs-tour-glow-red infinite 2s';
			}, 100 );
		},
		onNext: function() {
			document.querySelectorAll( '.ce-element--type-carousel .glide__bullet' )[2].style.animation = '';
		},
		onEnd: function() {
			document.querySelectorAll( '.ce-element--type-carousel .glide__bullet' )[2].style.animation = '';
		}
	} );

	tour2.steps.push( {
		title: 'Need Help?',
		content: 'If you need additional help, click on this help button to bring up the online documentation.<br><br>You can also find tips on the button on the right.',
		target: '#wp-admin-bar-pbs_help_docs',
		nextOnTargetClick: true,
		placement: 'left',
		xOffset: -10,
		fixedElement: true
	} );

	tour2.steps.push( {
		title: pbsParams.labels.tour_done_title,
		content: pbsParams.labels.tour_done_body,
		target: '#wp-admin-bar-gambit_builder_save',
		nextOnTargetClick: true,
		placement: 'bottom',
		xOffset: 50,
		fixedElement: true,
		onShow: function() {
			window.pbsOpenAllSections();
			jQuery('.ct-toolbox').animate( {
				scrollTop: 0
			}, 600 );
		}
	} );

	hopscotch.startTour( tour2 );

	var editor = ContentTools.EditorApp.get();
	editor.unbind( 'start', window.pbsPlayTour );
};


/**
 * Start the tour if it's the first time playing.
 */
wp.hooks.addAction( 'pbs.ct.ready', function() {
	if ( typeof hopscotch === 'undefined' ) {
		return;
	}
	if ( ! pbsParams.do_intro ) {
		return;
	}

	// If the tour has started before, possible from another page, don't show it again.
	// Helpful for the PBS demo site.
	if ( localStorage ) {
		if ( localStorage.getItem( 'pbs_did_intro' ) ) {
			return;
		}
		localStorage.setItem( 'pbs_did_intro', 1 );
	}

	var tour = {
		id: 'start-editing',
		i18n: {
			doneBtn: pbsParams.labels.close
		},
		steps: [
			{
				title: pbsParams.labels.tour_intro_title,
				content: pbsParams.labels.tour_intro_body,
				target: document.querySelector( '#wp-admin-bar-gambit_builder_edit' ),
				placement: 'bottom',
				fixedElement: true
			}
		]
	};
	hopscotch.startTour(tour);


	var editor = ContentTools.EditorApp.get();
	editor.bind( 'start', window.pbsPlayTour );
});

/**
 * Stop the tour when the editor stops.
 */
window.addEventListener( 'DOMContentLoaded', function() {
	if ( typeof hopscotch === 'undefined' ) {
		return;
	}

	var editor = ContentTools.EditorApp.get();
	editor.bind( 'stop', function() {
		hopscotch.endTour();
	} );
});

/**
 * Tracks usage. Pings backend every 15 seconds while editing.
 * Presents a rate us notice after 60, 120, 180 minutes of usage.
 */

/* globals pbsParams, ContentTools */
window.addEventListener( 'DOMContentLoaded', function() {
	if ( ! pbsParams.is_lite ) {
		return;
	}
	if ( pbsParams.lite_tracking_rated ) {
		return;
	}

    var editor = ContentTools.EditorApp.get();
	var trackerInterval;

	editor.bind( 'start', function() {
		if ( pbsParams.lite_tracking_rated ) {
			return;
		}
		trackerInterval = setInterval( function() {
			if ( ! isHidden ) {
				sendPing();
			}
		}, 15000 );
	} );

	editor.bind( 'stop', function() {
		clearInterval( trackerInterval );
	} );

	var sendPing = function() {
		var request = new XMLHttpRequest();
		request.open( 'POST', pbsParams.ajax_url, true );
		request.setRequestHeader( 'Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8' );
		request.onload = function() {
			if (request.status >= 200 && request.status < 400) {
				if ( request.responseText === 'show' ) {
					showRateBox();
				}
			}
		};
		request.send( 'action=pbs_lite_tracking_ping&nonce=' + pbsParams.lite_tracking_nonce );
	};

	var showRateBox = function() {
		document.querySelector( '#wp-admin-bar-pbs_rate' ).classList.remove( 'pbs-hidden' );
	};

	var rated = function() {
		var request = new XMLHttpRequest();
		request.open( 'POST', pbsParams.ajax_url, true );
		request.setRequestHeader( 'Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8' );
		request.send( 'action=pbs_lite_tracking_rated&nonce=' + pbsParams.lite_tracking_nonce );

		pbsParams.lite_tracking_rated = '1';
		clearInterval( trackerInterval );

		window.open( 'https://wordpress.org/plugins/page-builder-sandwich/', '_blank' );
	};

	/**
	 * Use Visibility API to detect whether the page is focused.
	 * @from https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API
	 */

	// Set the name of the hidden property and the change event for visibility
	var hidden, visibilityChange, isHidden = false;
	if ( typeof document.hidden !== 'undefined' ) { // Opera 12.10 and Firefox 18 and later support
		hidden = 'hidden';
		visibilityChange = 'visibilitychange';
	} else if (typeof document.mozHidden !== 'undefined') {
		hidden = 'mozHidden';
		visibilityChange = 'mozvisibilitychange';
	} else if (typeof document.msHidden !== 'undefined') {
		hidden = 'msHidden';
		visibilityChange = 'msvisibilitychange';
	} else if (typeof document.webkitHidden !== 'undefined') {
		hidden = 'webkitHidden';
		visibilityChange = 'webkitvisibilitychange';
	}

	// If the page is hidden, pause the video;
	// if the page is shown, play the video
	function handleVisibilityChange() {
		isHidden = !! document[ hidden ];
	}

	// Warn if the browser doesn't support addEventListener or the Page Visibility API
	if ( typeof document.addEventListener === 'undefined' || typeof document[ hidden ] === 'undefined' ) {
	} else {
		// Handle page visibility change
		document.addEventListener( visibilityChange, handleVisibilityChange, false );
	}

	/**
	 * Rate box click handlers
	 */

 	 document.querySelector( '#pbs-rate-no' ).addEventListener( 'click', function() {
 		 document.querySelector( '#wp-admin-bar-pbs_rate' ).classList.add( 'pbs-hidden' );
 	 } );
 	 document.querySelector( '#pbs-rate-go' ).addEventListener( 'click', function() {
 		 document.querySelector( '#wp-admin-bar-pbs_rate' ).classList.add( 'pbs-hidden' );
		 rated();
 	 } );
} );

/**
 * This script is in charge of displaying and sending the answer to opt-in or out
 * of stats tracking by PBS.com.
 *
 * @since 2.11
 *
 * @see class-stats-tracking.php
 */

/* globals ContentTools, pbsParams */

window.addEventListener( 'DOMContentLoaded', function() {

	// Sends the opt-in answer.
	var doOptin = function( yesno, callback ) {

	    // Collect the contents of each region into a FormData instance
	    var payload = new FormData();
		payload.append( 'action', 'pbs_optin_answer' );
		payload.append( 'optin', yesno );
		payload.append( 'nonce', pbsParams.optin_nonce );

	    var xhr = new XMLHttpRequest();

		xhr.onload = function() {
			if ( xhr.status >= 200 && xhr.status < 400 ) {
				if ( typeof callback !== 'undefined' ) {
					callback();
				}
			} else {
				window.alert( pbsParams.labels.optin_error );
			}
		};

	    xhr.open('POST', pbsParams.ajax_url );
	    xhr.send( payload );
	};


    var editor = ContentTools.EditorApp.get();
	editor.bind('start', function() {
		if ( typeof pbsParams.show_opt_in_stats_track === 'undefined' ) {
			return;
		}
		if ( ! pbsParams.show_opt_in_stats_track ) {
			return;
		}

		// Show opt-in message.
		var div = document.createElement( 'DIV' );
		div.innerHTML = wp.template( 'pbs-stats-tracking-optin' )();
		div.classList.add( 'pbs-stats-tracking-optin-wrapper' );
		document.body.appendChild( div );

		// Fade in the modal.
		var optin = document.querySelector( '.pbs-stats-tracking-optin-wrapper' );
		setTimeout( function() {
			optin.classList.add( 'pbs-show' );
		}, 10 );

		// Optin answer listeners.
		document.querySelector( '.pbs-stats-tracking-optin-yes' ).addEventListener( 'click', function(ev) {
			doOptin( 'yes', function() {
				optin.parentNode.removeChild( optin );
				delete pbsParams.show_opt_in_stats_track;
			} );
		} );

		document.querySelector( '.pbs-stats-tracking-optin-no' ).addEventListener( 'click', function(ev) {
			doOptin( 'no', function() {
				optin.parentNode.removeChild( optin );
				delete pbsParams.show_opt_in_stats_track;
			} );
		} );

	} );
} );

/**
 * Fix for scenario:
 * Some themes, such as "eighties" don't open the Media Manager (or any modal view),
 * in the frontend. This can be tested by running the command: `wp.media.editor.open()`
 * in the browser console.
 *
 * Cause:
 * The cause of this is in the Modal open function in media-views.js. The line that
 * checks for visibility: `if ( $el.is(':visible') )` returns TRUE, even though the element
 * isn't visible yet - a false positive.
 *
 * Fix:
 * An unobtrusive & least conflicting fix is to override jQuery's `is` method ONLY
 * when checking the visibility of a Modal, and replace it with a working visibility check:
 * http://stackoverflow.com/a/33456469/174172
 *
 * It seems that the modal is always `<div tabindex="0"></div>`.
 */
(function() {
	var proxied = jQuery.fn.is;
	jQuery.fn.is = function( selector ) {
		var ret = proxied.call( this, selector );
		if ( ret ) {
			var elem = this[0];
			if ( elem.outerHTML === '<div tabindex="0"></div>' ) {
				return !!( elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length );
			}
		}
		return ret;
	};
})();

if ( ! window.PBSEditor ) {
	window.PBSEditor = {};
}


/**
 * Converts a hex color to its RGB components.
 *
 * @see http://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
 */
window.PBSEditor.hexToRgb = function( hex ) {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
        return r + r + g + g + b + b;
    });

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
};


/**
 * Converts an RGB color to HSL.
 *
 * @see http://axonflux.com/handy-rgb-to-hsl-and-rgb-to-hsv-color-model-c
 */
window.PBSEditor.rgbToHsl = function( r, g, b ) {
    r /= 255, g /= 255, b /= 255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;

    if ( max === min ) {
        h = s = 0; // achromatic
    } else {
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch(max){
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    return { h: h, s: s, l: l };
};


/***************************************************************************
 * These are the tools in the inspector, overriding the defaults of CT.
 ***************************************************************************/
ContentTools.DEFAULT_TOOLS = [
	[
		'paragraphPicker',
		'color',
		'clear-formatting',
		'remove',
		'bold',
		'italic',
		'underline',
		'link',
		'strikethrough',
		// 'blockquote',
		'hr',
		'align-left',
		'align-center',
		'align-right',
		'align-justify',
		'indent',
		'unindent',
		'unordered-list',
		'ordered-list',



		'code',
		'undo', 'redo'				// These are automatically moved into the admin bar.
	],
	// [
		// 'paragraph',
		// 'h1',
		// 'h2',
		// 'h3',
		// 'h4',
		// 'h5',
		// 'h6',
		// 'video',
		// 'blockquote',
		// 'preformatted',
		// 'unordered-list',
		// 'ordered-list',
	// ],







	[
		'pbs-media',

		'widget',
		'sidebar',
		'icon',



		'shortcode',
		'html',

		'map',
		'tabs',
		'onecolumn',
		'twocolumn',
		'threecolumn',
		'fourcolumn'
	// [
	// 	'row', 'column2', 'column3', 'column4', 'column233', 'column424'
	// ],
	],								// LITE-ONLY
	[								// LITE-ONLY
		'get-premium'				// LITE-ONLY
	]
];

window.PBSEditor.toolHeadings = [
	{ 'label': pbsParams.labels.text_formatting, 'class': 'text-formatting' },
	// { 'label': pbsParams.labels.change_type, 'class': 'change-type' },
	{ 'label': pbsParams.labels.insert_content, 'class': 'interactive-elements' }
	// { 'label': pbsParams.labels.rows_and_columns, 'class': 'rows-columns' }
];

window.PBSEditor.advancedTools = [
	'h3', 'h4', 'h5', 'h6', 'table', 'preformatted', 'indent', 'unindent', 'code', 'align-justify', 'uppercase', 'strikethrough',
	'pbs-advanced-formatting-group',
	'pbs-shortcodes-group'
	//, 'pbs-rows-columns-group'
];

window.addEventListener( 'DOMContentLoaded', function() {
	new PBSEditor.MarginBottom();
	new PBSEditor.MarginTop();
	new PBSEditor.MarginBottomContainer();
	new PBSEditor.MarginTopContainer();
	new PBSEditor.OverlayColumnWidth();
	new PBSEditor.OverlayColumnWidthRight();
	new PBSEditor.OverlayColumnWidthLabels();
});
