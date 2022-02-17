<?php

namespace Montessori\Admin\Settings;

abstract class DefOptions{

	/**
	 * @var array
	 */
	protected $defaults;

	/**
	 * @var array
	 */
	protected $checkbox;

	public function __construct(){

		/**
		 *  Wartości dla ustawień jeżeli nie są ustawione
		 */
		$this->defaults = array(
			// Główne
			'montessori_logo'							=> get_template_directory_uri() . '/images/img004.png',
			'montessori_adress_street'					=> 'ul. Ks. Abp. E. Kisiela 8',
			'montessori_adress_postal-code'				=> '15-361 Białystok',
			'montessori_adress_phone'					=> '85 742-34-57',
			'montessori_show_social_icons'				=> 1,
			'montessori_show_social_icon_fb'			=> 1,
			'montessori_show_social_icon_yt'			=> 1,
			'montessori_social_icon_fb_url'				=> 'https://www.facebook.com',
			'montessori_social_icon_yt_url'				=> 'https://www.youtube.com',
			//Facebook
			'montessori_facebook_app_id'				=> '777146465768072',
			'montessori_facebook_app_secret'			=> 'd3677d3278aa1fc015dcb751b28f3dc1',
			'montessori_facebook_page_target'			=> 'brak',
			'montessori_facebook_auto_post'				=> true,
			'montessori_facebook_article_content'		=> '{{wstęp_artykułu}}&#13;&#10;{{odnośnik_artykułu}}',
			// Artykuł
			'montessori_post_more_tag'					=> 1,
			'montessori_post_more_tag_int'				=> 185,
			'montessori_post_more_info'					=> 1,
			'montessori_main_page_title'				=> 'Najnowsze aktualności',
			'montessori_post_type_ft_info'				=> 1,
			'montessori_post_page_error_title'			=> 'Nie znaleziono artykułów',
			'montessori_post_page_error_desc'			=> 'Wygląda na to, że nie dodano jeszcze żadnego artykułu',
			//Strona 404
			'montessori_page_404_title'					=> 'Nie znaleziono strony',
			'montessori_page_404_desc'					=> 'Wygląda na to, że nie znaleziono podanej lokalizacji. Sprawdź czy adres url jest prawidłowy.',
			// Wydarzenia
			'montessori_events_limit'					=> 6,
			'montessori_events_date_range'				=> '+2 months',
			'montessori_events_archive_limit'			=> 3,
			'montessori_events_archive_date_range'		=> '-2 months',
			'montessori_events_archive_show'			=> 1,
			'montessori_events_no'						=> 'Aktualnie nie ma wydarzeń',
			'montessori_events_archive_title'			=> 'Archiwalne wydarzenia',
			// Galeria
			'montessori_gallery_albums_limit'			=> 6,
			'montessori_gallery_albums_no'				=> 'Nie znaleziono albumów',
			'montessori_gallery_images_no'				=> 'Nie znaleziono zdjęć',
		);


		$this->checkbox = array(
			'montessori_show_social_icons',
			'montessori_show_social_icon_fb',
			'montessori_show_social_icon_yt',
			'montessori_facebook_auto_post',
			'montessori_post_more_tag',
			'montessori_post_more_info',
			'montessori_post_type_ft_info',
			'montessori_events_archive_show'
		);

		foreach ($this->defaults as $key => $default) {
			$option = $this->getOption( $key );
			if( $default !== $option ){
				$this->defaults[$key] = $option;
			}
		}

	}

	public function getOption( $name = false ){

		if( ! empty( $name ) ){
			if( array_key_exists ( $name, $this->defaults ) && ! empty( $this->defaults[ $name ] ) ){
				return $this->verification( $name );
			}
		}

	}

	protected function verification( $name ){

		if( in_array( $name, $this->checkbox ) && get_option( $name ) === '' ){
			return '0';
		}else{
			return ( ! empty ( get_option( $name ) ) ) ? get_option( $name ) : $this->defaults[ $name ];
		}

	}

}