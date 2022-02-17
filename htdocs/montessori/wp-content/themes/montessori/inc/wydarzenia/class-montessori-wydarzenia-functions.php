<?php

function montessori_get_event_date(){

	$event = new Montessori\WydarzeniaValues( get_the_ID() );

	$time = strtotime( $event->getDate() );
	$timezone = get_option( 'timezone_string' ) ? get_option( 'timezone_string' ) : date_default_timezone_get();
	date_default_timezone_set( $timezone );

	if( ! empty( $event->getSettings()['shortDate'] ) ){
		$option = 'm';
	}else{
		$option = 'd.m';
	}

	return date_i18n( $option, $time );

}

function montessori_event_date(){

	echo montessori_get_event_date();

}