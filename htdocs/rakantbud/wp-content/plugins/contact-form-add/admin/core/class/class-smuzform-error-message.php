<?php
/**
Return error and form validation messages.

Apply filters for modular code.
**/

class SmuzForm_Error_Msg {

	function __construct(){}


	public static function get( $code, $form_id = null, $lang = 'pl' ) {

		if ( ! is_int( $code ) )
			return null;

		$errors = self::getAll( $form_id, $lang );

		return apply_filters( 'smuzform_get_error_msg', $errors[$code], $code, $form_id, $lang );

	}

	public static function getAll( $form_id = null, $lang = 'pl' ) {

		$errors = array( 
			
			SMUZFORM_ERROR_FIELD_REQUIRED => smuzform_translate( 'To pole jest wymagane.'),

			SMUZFORM_ERROR_FIELD_MINIMUM_LENGTH => smuzform_translate( 'Umieszczona treść jest za krótka. Minimalna długość to ' ),

			SMUZFORM_ERROR_FIELD_MAXIMUM_LENGTH => smuzform_translate( 'Umieszczona treść jest za długa. Maksymalna długość to ' ),

			SMUZFORM_ERROR_FIELD_NO_DUPLICATE => smuzform_translate( 'Umieściłeś treść która już istnieje.' ),

			SMUZFORM_ERROR_FIELD_NUMBER_MINIMUM_LENGTH => smuzform_translate( 'Umieszczone cyfry powinny być większe niż '),

			SMUZFORM_ERROR_FIELD_NUMBER_MAXIMUM_LENGTH => smuzform_translate( 'Umieszczone cyfry powinny być mniejsze niż '),

			SMUZFORM_ERROR_FIELD_TEXTAREA_MINIMUM_LENGTH => smuzform_translate( 'Umieszczone słowa powinny być większe niż '),

			SMUZFORM_ERROR_FIELD_TEXTAREA_MAXIMUM_LENGTH => smuzform_translate( 'Umieszczone słowa powinny być mniejsze niż '),

			SMUZFORM_ERROR_FIELD_NOT_NUMERIC => smuzform_translate( 'Umieszczona treść nie jest cyframi' ),

			SMUZFORM_ERROR_FIELD_NOT_EMAIL => smuzform_translate( 'Proszę wpisać prawidłowy Email.' ),

			SMUZFORM_ERROR_FIELD_INVALID_DATE => smuzform_translate( 'Data nie jest prawidłowa.' ),

			SMUZFORM_ERROR_FIELD_NOT_URL => smuzform_translate( 'URL nie jest prawidłowy.' )

		 );
		
		return apply_filters( 'smuzform_get_errors', $errors, $form_id, $lang );

	}


} 