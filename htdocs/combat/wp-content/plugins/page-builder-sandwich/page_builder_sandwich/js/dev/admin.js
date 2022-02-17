/* globals pbsParams*/

jQuery(document).ready(function($) {
	'use strict';

	if ( $('.pbs-plugin-placeholder').length ) {
		$('.pbs-plugin-placeholder').parent().parent().append( wp.template( 'pbs-license-field' )() );
	}

	$('body').on('keyup keypress', '#pbs-license-field-key', function(ev) {
		if ( ! $(this).parent().hasClass( 'pbs-valid' ) ) {
			if ( ev.keyCode === 13 || ev.which === 13 ) {
				ev.preventDefault();
				ev.stopPropagation();
				$('#pbs-license-field-submit').trigger('click');
				return false;
			}
		}
	});
	$('body').on('click', '#pbs-license-field-submit', function() {
		$(this).attr( 'disabled', 'disabled' );
		wp.ajax.send( 'pbs_activate_license', {
		    success: function( response ) {
				$('#pbs-license-field-submit').removeAttr( 'disabled' );
				if ( response === 'valid' ) {
					$('[for="pbs-license-field-key"]').text( pbsParams.license_active_label );
					$('#pbs-license-field-submit').attr( 'value', pbsParams.license_active_button );
					$('#pbs-license-field').addClass('pbs-valid');
					$('#pbs-license-field-key').attr('disabled', 'disabled');
					window.alert( pbsParams.licence_active_message );
				} else if ( response === 'deactivated' ) {
					$('[for="pbs-license-field-key"]').text( pbsParams.license_label );
					$('#pbs-license-field-submit').attr( 'value', pbsParams.license_button );
					$('#pbs-license-field').removeClass('pbs-valid');
					$('#pbs-license-field-key').removeAttr('disabled');
					window.alert( pbsParams.licence_deactive_message );
				}
			},
		    error: function( response ) {
				$('#pbs-license-field-submit').removeAttr( 'disabled' );
				window.alert( response );
			},
		    data: {
				nonce: $('#pbs-license-field-nonce').val(),
				key: $('#pbs-license-field-key').val()
		    }
		});
		return false;
	});


});

/* globals pbsParams, tinymce */

jQuery(document).ready(function($) {
	'use strict';
	
	if ( typeof pbsParams === 'undefined' ) {
		return;
	}
	if ( typeof pbsParams.is_editing === 'undefined' ) {
		return;
	}

	var originalContent = '';
	var hasAutosave = false;
	if ( typeof wp !== 'undefined' && typeof wp.autosave !== 'undefined' && typeof wp.autosave.getCompareString !== 'undefined' ) {
		originalContent = wp.autosave.getCompareString();
		hasAutosave = true;
	}

	var isDirty = function() {
		if ( ! hasAutosave ) {
			return true;
		}
		if ( tinymce && tinymce.activeEditor ) {
			if ( tinymce.activeEditor.isDirty() ) {
				return true;
			} else if ( originalContent !== wp.autosave.getCompareString() ) {
				return true;
			} else if ( ! tinymce.activeEditor.isHidden() ) {
				return tinymce.activeEditor.isDirty();
			}
		}
		return originalContent !== wp.autosave.getCompareString();
	};

	$('body').on( 'click', '#pbs-admin-edit-with-pbs', function(ev) {
		ev.preventDefault();

		// Prompt PBS to open when the page loads.
		if ( localStorage ) {
			localStorage.setItem( 'pbs-open-' + pbsParams.post_id, '1' );
		}

		if ( isDirty() ) {
			$('#preview-action a').trigger('click');
		} else {
			window.location.href = pbsParams.meta_permalink;
		}

		return false;
	});

});

/* globals pbsParams*/

jQuery(document).ready(function($) {
	'use strict';

	if ( ! pbsParams.is_lite ) {
		return;
	}

	var showDeactivationModal = function(ev) {
		$('body').off('click', 'tr[id*="page-builder-sandwich"] .deactivate a', showDeactivationModal );

		var div = document.createElement( 'DIV' );
		div.innerHTML = wp.template( 'pbs-deactivate-question' )();
		div.classList.add( 'pbs-deactivate-question-wrapper' );
		document.body.appendChild( div );
		window._pbsDeactivate = ev.target.getAttribute( 'href' );

		return false;
	};

	$('body').on('click', 'tr[id*="page-builder-sandwich"] .deactivate a', showDeactivationModal );

	$('body').on('click', '.pbs-deactivate-question-wrapper', function(ev) {
		if ( ev.target.classList.contains( 'pbs-deactivate-question-wrapper' ) ) {
			ev.target.parentNode.removeChild( ev.target );
			$('body').on('click', 'tr[id*="page-builder-sandwich"] .deactivate a', showDeactivationModal );
		}
	});

	$('body').on('change', '[name="pbs_reason"]', function(ev) {
		if ( ev.target.value === 'error' ) {
			$( '#pbs_description_label' ).html( pbsParams.deactivate_textarea_error_label );
			$( '#pbs_email_label' ).html( pbsParams.deactivate_email_error_label );
		} else if ( ev.target.value === 'missing_feature' ) {
			$( '#pbs_description_label' ).html( pbsParams.deactivate_textarea_feature_label );
			$( '#pbs_email_label' ).html( pbsParams.deactivate_email_feature_label );
		} else if ( ev.target.value === 'found_alternative' ) {
			$( '#pbs_description_label' ).html( pbsParams.deactivate_textarea_alternative_label );
			$( '#pbs_email_label' ).html( pbsParams.deactivate_email_alternative_label );
		} else if ( ev.target.value === 'other' ) {
			$( '#pbs_description_label' ).html( pbsParams.deactivate_textarea_other_label );
			$( '#pbs_email_label' ).html( pbsParams.deactivate_email_other_label );
		} else {
			$( '#pbs_description_label' ).html( pbsParams.deactivate_textarea_feedback_label );
			$( '#pbs_email_label' ).html( pbsParams.deactivate_email_feedback_label );
		}

		var elements = document.querySelectorAll('.pbs-deactivate-advanced');
		Array.prototype.forEach.call(elements, function(el){
			el.style.height = 'auto';
		});

		document.querySelector( '#pbs_description' ).focus();
	});

	$('body').on('click', '.pbs-button-deactivate-yes', function(ev) {
		$('.pbs-button-deactivate-yes').attr( 'disabled', 'disabled' );
		$('.pbs-button-deactivate-no').attr( 'disabled', 'disabled' );

		if ( ! document.querySelector('[name=pbs_reason]:checked') ) {
			window.location.href = window._pbsDeactivate;
			return false;
		}

		wp.ajax.send( 'pbs_deactivate_answer', {
		    success: function( response ) {
				window.location.href = window._pbsDeactivate;
			},
		    error: function( response ) {
				window.location.href = window._pbsDeactivate;
			},
		    data: {
				nonce: $('#pbs_deactivate_nonce').val(),
				reason: $('[name="pbs_reason"]:checked').val(),
				description: $('#pbs_description').val(),
				email: $('#pbs_email').val()
		    }
		});
		return false;
	});

	$('body').on('click', '.pbs-button-deactivate-no', function(ev) {
		$('.pbs-button-deactivate-yes').attr( 'disabled', 'disabled' );
		$('.pbs-button-deactivate-no').attr( 'disabled', 'disabled' );

		window.location.href = window._pbsDeactivate;
		return false;
	});

});

