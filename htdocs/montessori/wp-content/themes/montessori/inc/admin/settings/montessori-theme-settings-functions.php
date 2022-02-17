<?php

/**
 * Funkcje ustawień szablonu
 */

function montessori_information_logo(){

	global $montessori_template_settings;
	return $montessori_template_settings->logo();

}

function montessori_information_street(){

	global $montessori_template_settings;
	return $montessori_template_settings->street();

}

function montessori_information_postal_code(){

	global $montessori_template_settings;
	return $montessori_template_settings->postal_code();

}

function montessori_information_phone(){

	global $montessori_template_settings;
	return $montessori_template_settings->phone();

}

function home_page_title(){

	global $montessori_template_settings;
	return $montessori_template_settings->home_page_title();

}

function montessori_post_page_error(){

	global $montessori_template_settings;
	return $montessori_template_settings->post_page_error();

}

function montessori_page_404(){

	global $montessori_template_settings;
	return $montessori_template_settings->page_404();

}

function montessori_has_post_format(){

	global $montessori_template_settings;
	return $montessori_template_settings->option('montessori_post_type_ft_info');

}

function montessori_has_social_icons(){

	global $montessori_template_settings;
	return $montessori_template_settings->option('montessori_show_social_icons');

}

function montessori_has_social_icon_fb(){

	global $montessori_template_settings;
	return $montessori_template_settings->option('montessori_show_social_icon_fb');

}

function montessori_has_social_icon_yt(){

	global $montessori_template_settings;
	return $montessori_template_settings->option('montessori_show_social_icon_yt');

}

function montessori_get_social_icon_fb_url(){

	global $montessori_template_settings;
	return $montessori_template_settings->option('montessori_social_icon_fb_url');

}

function montessori_get_social_icon_yt_url(){

	global $montessori_template_settings;
	return $montessori_template_settings->option('montessori_social_icon_yt_url');

}
//wp_die(print_r(montessori_page_404()));