<?php

if($_POST['contact-send']){
	
	$is_valid_nonce = (isset($_POST['contant-send-secure']) && wp_verify_nonce($_POST['contant-send-secure'], basename(__FILE__))) ? "true" : "false";

	if(!$is_valid_nonce){ return; }

	$imie = (!empty($_POST['personName'])) ? $_POST['personName'] : '';
	$nazwisko = (!empty($_POST['personSurname'])) ? $_POST['personSurname'] : '';
	$email = (!empty($_POST['personEmail'])) ? $_POST['personEmail'] : '';
	$tresc = (!empty($_POST['personContent'])) ? $_POST['personContent'] : '';

	$from = $email; // sender
    $subject = 'Stayfit - kontakt: '.ucfirst($imie).' '.ucfirst($nazwisko);
    $message = wordwrap($tresc, 70);
    $headers  = 'MIME-Version: 1.0' . "\r\n";
	$headers .= 'Content-type: text/html; charset=utf-8' . "\r\n";
	$headers .= 'From:'.$from . "\r\n";
    // message lines should not exceed 70 characters (PHP rule), so wrap it
    // send mail
    mail("stayfit.bialystok@wp.pl",$subject,$message,$headers);
    wp_redirect('/');
}