<?php

namespace Montessori\Admin\Settings;

use Montessori\Admin\MontessoriFacebook;

Class Settings extends  DefOptions {

	/**
	 * @var array
	 */
	protected $options;

	/**
	 * @var array
	 */
	protected $opt;

	/**
	 * @var string
	 */
	protected $sec;

	/**
	 * @var object
	 */
	static $instance;

	/**
	 * @var object
	 */
	protected $montessoriFb;

	public function __construct(){

		parent::__construct();

		foreach ( $this->defaults as $key => $value ){

			$option = get_option( $key ) ? get_option( $key ) : $value;
			$this->options[ $key ] = $this->getOption( $key );

		}

		$this->opt['general'] = 'montessori-options-general';
		$this->opt['facebook'] = 'montessori-options-facebook';
		$this->opt['articles'] = 'montessori-options-articles';
		$this->opt['page_404'] = 'montessori-options-page_404';
		$this->opt['events'] = 'montessori-options-events';
		$this->opt['gallery'] = 'montessori-options-gallery';
		$this->sec = 'montessori-section';

	}

	public function actions(){

		add_action( 'admin_menu', array( $this, 'add_to_menu' ) );
		add_action( 'admin_init', array( $this, 'page_init' ) );
		add_action( 'admin_enqueue_scripts', array( $this, 'load_admin_scripts' ) );

	}

	public static function getInstance(){

		if( self::$instance === null ) self::$instance = new Self;
		return self::$instance;

	}

	public function page_init(){

		$this->montessoriFb = MontessoriFacebook::getInstance();

		$fields = array(
			'montessori_logo'	=> array(
				'type'	=> 'image',
				'label'	=> 'Logo',
				'desc'	=> 'Wymagane wymiary obrazu: <strong> szerokość 100px | wysokość 260px </strong>',
				'section'	=> 'general',
				'isWidth'	=> 100,
				'isHeight'	=> 260
			),
			'montessori_adress_street'	=> array(
				'type'	=> 'text',
				'label'	=> 'Ulica',
				'desc'	=> 'Informacja o lokalizacji',
				'section'	=> 'general'
			),
			'montessori_adress_postal-code'	=> array(
				'type'	=> 'text',
				'label'	=> 'Kod pocztowy',
				'section'	=> 'general'
			),
			'montessori_adress_phone'	=> array(
				'type'	=> 'text',
				'label'	=> 'Telefon',
				'section'	=> 'general'
			),
			'montessori_show_social_icons'	=> array(
				'type'	=> 'checkbox',
				'label'	=> 'Pokaż ikony stron społecznościowych',
				'section'	=> 'general'
			),
			'montessori_show_social_icon_fb'	=> array(
				'type'	=> 'checkbox',
				'label'	=> 'Pokaż ikonę Facebook',
				'section'	=> 'general'
			),
			'montessori_show_social_icon_yt'	=> array(
				'type'	=> 'checkbox',
				'label'	=> 'Pokaż ikonę Youtube',
				'section'	=> 'general'
			),
			'montessori_social_icon_fb_url'	=> array(
				'type'	=> 'url',
				'label'	=> 'Adres url dla ikony facebook',
				'section'	=> 'general'
			),
			'montessori_social_icon_yt_url'	=> array(
				'type'	=> 'url',
				'label'	=> 'Adres url dla ikony youtube',
				'section'	=> 'general'
			),
			'montessori_facebook_app_id'	=> array(
				'type'	=> 'text',
				'label'	=> 'Facebook App_id',
				'section'	=> 'facebook'
			),
			'montessori_facebook_app_secret'	=> array(
				'type'	=> 'text',
				'label'	=> 'Facebook App_secret',
				'section'	=> 'facebook'
			),
			'montessori_facebook_page_target'	=> array(
				'type'	=> 'select',
				'label'	=> 'Docelowa strona',
				'section'	=> 'facebook'
			),
			'montessori_facebook_auto_post'	=> array(
				'type'	=> 'checkbox',
				'label'	=> 'Czy artykuł mają być dodawane automatycznie na docelową stronę na facebooku',
				'section'	=> 'facebook'
			),
			'montessori_facebook_article_content'	=> array(
				'type'	=> 'fb_article_field',
				'label'	=> 'Treść artykułu dla facebooka',
				'section'	=> 'facebook'
			),
			'montessori_post_more_tag'	=> array(
				'type'	=> 'checkbox',
				'label'	=> 'Czy znacznik "czytaj więcej" ma być dodawany automatycznie ',
				'section'	=> 'articles'
			),
			'montessori_post_more_tag_int'	=> array(
				'type'	=> 'number',
				'max'	=> 2000,
				'min'	=> 1,
				'label'	=> 'Ilość znaków po której zostanie umieszoczny znacznik czytaj więcej',
				'section'	=> 'articles'
			),
			'montessori_post_more_info'	=> array(
				'type'	=> 'checkbox',
				'label'	=> 'Czy informacja o znaczniku "czytaj więcej" ma być wyświetlana',
				'section'	=> 'articles'
			),
			'montessori_main_page_title'	=> array(
				'type'	=> 'text',
				'label'	=> 'Tytuł aktualności na stronie głównej',
				'section'	=> 'articles',
				'max'	=> 21
			),
			'montessori_post_type_ft_info'	=> array(
				'type'	=> 'checkbox',
				'label'	=> 'Czy informacja o rodzaju artykułu ma zostać wyświetlona',
				'section'	=> 'articles'
			),
			'montessori_post_page_error_title'	=> array(
				'type'	=> 'text',
				'label'	=> 'Tytuł informacji o braku artykułów',
				'section'	=> 'articles'
			),
			'montessori_post_page_error_desc'	=> array(
				'type'	=> 'text',
				'label'	=> 'Treść informacji o braku artykułów',
				'section'	=> 'articles'
			),
			'montessori_page_404_title'	=> array(
				'type'	=> 'text',
				'label'	=> 'Nagłówek strony 404',
				'section'	=> 'page_404'
			),
			'montessori_page_404_desc'	=> array(
				'type'	=> 'text',
				'label'	=> 'Treść strony 404',
				'section'	=> 'page_404'
			),
			'montessori_events_limit'	=> array(
				'type'	=> 'number',
				'max'	=> 10,
				'min'	=> 1,
				'label'	=> 'Limit wyświetalnych wydarzeń',
				'desc'	=> 'Wydarzenia',
				'section'	=> 'events'
			),
			'montessori_events_date_range'	=> array(
				'type'	=> 'select',
				'label'	=> 'Zakres daty wyświetalnia wydarzeń',
				'options' => array(
					'+1 week' => '+ 1 tydzeń',
					'+2 weeks' => '+ 2 tygodnie',
					'+3 weeks' => '+ 3 tygodnie',
					'+1 month' => '+ 1 miesiąc',
					'+2 months' => '+ 2 miesiące',
					'+3 months' => '+ 3 miesiące',
					'+4 months' => '+ 4 miesiące',
					'+5 months' => '+ 5 miesięcy'
				),
				'desc'	=> 'Wydarzenia',
				'section'	=> 'events'
			),
			'montessori_events_archive_limit'	=> array(
				'type'	=> 'number',
				'max'	=> 10,
				'min'	=> 1,
				'label'	=> 'Limit wyświetalnych wydarzeń archiwalnych',
				'desc'	=> 'Wydarzenia',
				'section'	=> 'events'
			),
			'montessori_events_archive_date_range'	=> array(
				'type'	=> 'select',
				'label'	=> 'Zakres daty wyświetalnia wydarzeń archiwalnych',
				'options' => array(
					'-1 week' => '- 1 tydzeń',
					'-2 weeks' => '- 2 tygodnie',
					'-3 weeks' => '- 3 tygodnie',
					'-1 month' => '- 1 miesiąc',
					'-2 months' => '- 2 miesiące',
					'-3 months' => '- 3 miesiące',
					'-4 months' => '- 4 miesiące',
					'-5 months' => '- 5 miesięcy'
				),
				'desc'	=> 'Wydarzenia',
				'section'	=> 'events'
			),
			'montessori_events_archive_show'	=> array(
				'type'	=> 'checkbox',
				'label'	=> 'Wyświetalnie wydarzeń archiwalnych',
				'desc'	=> 'Wydarzenia',
				'section'	=> 'events'
			),
			'montessori_events_no'	=> array(
				'type'	=> 'text',
				'label'	=> 'Informacja o braku wydarzeń',
				'desc'	=> 'Wydarzenia',
				'section'	=> 'events'
			),
			'montessori_events_archive_title'	=> array(
				'type'	=> 'text',
				'label'	=> 'Tytuł wydarzeń archiwalnych',
				'desc'	=> 'Wydarzenia',
				'section'	=> 'events'
			),
			'montessori_gallery_albums_limit'	=> array(
				'type'	=> 'number',
				'max'	=> 15,
				'min'	=> 3,
				'label'	=> 'Limit wyświetalnych albumów na jednej stronie',
				'desc'	=> 'Galeria',
				'section'	=> 'gallery'
			),
			'montessori_gallery_albums_no'	=> array(
				'type'	=> 'text',
				'label'	=> 'Informacja o braku albumów',
				'desc'	=> 'Galeria',
				'section'	=> 'gallery'
			),
			'montessori_gallery_images_no'	=> array(
				'type'	=> 'text',
				'label'	=> 'Informacja o braku zdjęć',
				'desc'	=> 'Galeria',
				'section'	=> 'gallery'
			),
		);

		if( $this->montessoriFb->getSession() ){
			$pages = $this->montessoriFb->getObject( '/me?fields=accounts{app_id,name}' )->asArray();
			if( ! empty( $pages['accounts'] ) ){
				foreach ($pages['accounts'] as $key => $value) {
					$fields['montessori_facebook_page_target']['options'][$value['id']] = $value['name'];
				}
			}else{
				$fields['montessori_facebook_page_target']['options']['brak'] = 'Brak'; 
				$fields['montessori_facebook_page_target']['disabled'] = true; 
			}
		}else{
			$fields['montessori_facebook_page_target']['options']['brak'] = 'Brak'; 
			$fields['montessori_facebook_page_target']['disabled'] = true; 
		}

		foreach( $this->opt as $slug => $opt ){
			add_settings_section( $this->sec, '', null, $opt );
		}

		foreach( $fields as $slug => $field ){

			add_settings_field(
				$slug,
				$field['label'],
				array( $this, 'display_form_field'),
				$this->opt[ $field['section'] ],
				$this->sec,
				array(
					'type'	=> $field['type'],
					'slug'	=> $slug,
					'desc'	=> (!empty($field['desc'])) ? $field['desc'] : '',
					'options' => (!empty($field['options'])) ? $field['options'] : '',
					'max' => (!empty($field['max'])) ? $field['max'] : '',
					'min' => (!empty($field['min'])) ? $field['min'] : '',
					'isWidth' => (!empty($field['isWidth'])) ? $field['isWidth'] : '',
					'isHeight' => (!empty($field['isHeight'])) ? $field['isHeight'] : '',
					'disabled'	=> (!empty($field['disabled'])) ? $field['disabled'] : '',
				)
			);

			register_setting( $this->sec, $slug );

		}

	}

	public function display_form_field( $opt ){

		switch ($opt['type']) {

			case 'text':
				
				$min = ( ! empty( $opt['min']) ) ? ' minlength="' . $opt['min'] . '"' : '';
				$max = ( ! empty( $opt['max']) ) ? ' maxlength="' . $opt['max'] . '"' : '';
				$disabled = ( ! empty( $opt['disabled'] ) ) ? ' disabled="disabled"' : '';

				echo '<input type="text" name="'.$opt['slug'].'" id="'.$opt['slug'].'" value="'.$this->options[$opt['slug']].'" ' . $min . ' ' . $max . ' ' . $disabled . ' required>';
				
				break;

			case 'url':
				
				$min = ( ! empty( $opt['min']) ) ? ' minlength="' . $opt['min'] . '"' : '';
				$max = ( ! empty( $opt['max']) ) ? ' maxlength="' . $opt['max'] . '"' : '';
				$disabled = ( ! empty( $opt['disabled'] ) ) ? ' disabled="disabled"' : '';

				echo '<input type="url" name="'.$opt['slug'].'" id="'.$opt['slug'].'" value="'.$this->options[$opt['slug']].'" ' . $min . ' ' . $max . ' ' . $disabled . ' required>';
				
				break;

			case 'number':

				$min = ( ! empty( $opt['min']) ) ? ' min="' . $opt['min'] . '"' : '';
				$max = ( ! empty( $opt['max']) ) ? ' max="' . $opt['max'] . '"' : '';
				$disabled = ( ! empty( $opt['disabled'] ) ) ? ' disabled="disabled"' : '';
				
				echo '<input type="number" name="'.$opt['slug'].'" id="'.$opt['slug'].'" ' . $min . ' ' . $max . ' value="'.$this->options[$opt['slug']].'" ' . $disabled . ' required>';
				
				break;

			case 'checkbox':
				
				$checked = ($this->options[$opt['slug']]) ? 'checked' : '';
				$disabled = ( ! empty( $opt['disabled'] ) ) ? ' disabled="disabled"' : '';

				echo '<input type="checkbox" name="'.$opt['slug'].'" id="'.$opt['slug'].'" value="1" ' . $checked . ' ' . $disabled . '>';
				
				break;

			case 'select':

				$disabled = ( ! empty( $opt['disabled'] ) ) ? 'disabled="disabled"' : '';

				echo '<select name="'.$opt['slug'].'" id="'.$opt['slug'].'" '. $disabled .'>';
				if(!empty($opt['options'])){
					foreach($opt['options'] as $name => $value){

						$selected = ($this->options[$opt['slug']] === $name) ? 'selected' : '';
						echo '<option value="'.$name.'" '.$selected.'>'.$value.'</option>';
					}
				}
				echo '</select>';

				if( $opt['slug'] === 'montessori_facebook_page_target' && $this->montessoriFb->getSession() && ! array_key_exists($this->options[$opt['slug']], $opt['options']) && $this->options[$opt['slug']] !== 'brak' ){
					echo '<div style="color: red;">Docelowa strona jest już ustalona, ale zalogowany użytkownik facebook nie jest z nią połączony.</div>';
				}

				break;

			case 'image':

				$width_o = (!empty( $opt['isWidth'] ) ) ? '  width="' . $opt['isWidth'] . '"' : '';
				$width = ( !empty( $opt['max'] ) ) ? '  width="' . $opt['max'] . '"' : '';
				$max_width = ( !empty( $opt['max'] ) ) ? ' data-max-width="' . $opt['max'] . '"' : '';
				$is_width = ( !empty( $opt['isWidth'] ) ) ? ' data-is-width="' . $opt['isWidth'] . '"' : '';
				$is_height = ( !empty( $opt['isHeight'] ) ) ? ' data-is-height="' . $opt['isHeight'] . '"' : '';

				$content = '<input type="hidden" name="hidden-'.$opt['slug'].'" id="hidden-'.$opt['slug'].'" class="hidden-' . $opt['slug'] . '" value="'.$this->options[$opt['slug']].'">';
				$content .= '<div class="image-preview preview-' . $opt['slug'] . '"><img src="'.$this->options[$opt['slug']].'" title="Montessori logo" ' . $width . $width_o . '></div>';
				$content .= '<button class="button montessori-image-button" name="'.$opt['slug'].'" id="'.$opt['slug'].'" ' . $max_width .' '. $is_width .' '. $is_height . '>Zmień obraz</button>';
				$content .= '<p>' . $opt['desc'] . '</p>';
				echo $content;

				break;

			case 'fb_article_field':

				$min = ( ! empty( $opt['min']) ) ? ' minlength="' . $opt['min'] . '"' : '';
				$max = ( ! empty( $opt['max']) ) ? ' maxlength="' . $opt['max'] . '"' : '';
				$disabled = ( ! empty( $opt['disabled'] ) ) ? 'disabled="disabled"' : '';

				echo '<textarea type="text" name="'.$opt['slug'].'" id="'.$opt['slug'].'" ' . $min . ' ' . $max . ' ' . $disabled . ' required>'.$this->options[$opt['slug']].'</textarea>';

				break;

		}

		//$this->a = new MontessoriFacebook();

	}

	public function settings_page(){

	  ?>
	  <div class="admin-form-options montessori-admin-form">
	  <div class="metabox-holder columns-2">
		  <div class="content-primary postbox-container">

				<form action="options.php" method="post">
				<?php settings_fields($this->sec); ?>
				<div class="postbox ">
					<h2 class="hndle"><span>Ustawienia główne</span></h2>
					<div class="ms_settings_wrap">
						<div class="inside">
						
							<?php
								
								do_settings_sections($this->opt['general']);
								
							?>

						</div>
					</div>
				</div>	
				<div class="postbox ">
					<h2 class="hndle"><span>Facebook</span></h2>
					<div class="ms_settings_wrap">
						<div class="inside">
						
							<?php
								
								$this->montessoriFb->content();
				

								do_settings_sections($this->opt['facebook']);
								
							?>

						</div>
					</div>
				</div>	
				<div class="postbox ">
					<h2 class="hndle"><span>Ustawienia artykułów</span></h2>
					<div class="ms_settings_wrap">
						<div class="inside">
						
							<?php
								
								do_settings_sections($this->opt['articles']);
								
							?>

						</div>
					</div>
				</div>		
				<div class="postbox ">
					<h2 class="hndle"><span>Ustawienia strony <strong>404</strong></span></h2>
					<div class="ms_settings_wrap">
						<div class="inside">
						
							<?php
								
								do_settings_sections($this->opt['page_404']);
								
							?>

						</div>
					</div>
				</div>				
				<div class="postbox ">
					<h2 class="hndle"><span>Ustawienia wydarzeń</span></h2>
					<div class="ms_settings_wrap">
						<div class="inside">
						
							<?php

								do_settings_sections($this->opt['events']);
								
							?>

						</div>
					</div>
				</div>			
				<div class="postbox ">
					<h2 class="hndle"><span>Ustawienia galerii</span></h2>
					<div class="ms_settings_wrap">
						<div class="inside">
						
							<?php

								do_settings_sections($this->opt['gallery']);
								
							?>

						</div>
					</div>
				</div>
				
				<?php submit_button(); ?>
				</form>
		</div>
	</div>
	</div>

	  <?php

	}

	public function load_admin_scripts(){	

		//== css
		wp_enqueue_style('montessori-szablon-ustawienia', get_template_directory_uri() . '/inc/admin/settings/css/settings-style.css');

		//== js
		wp_enqueue_media();

		wp_enqueue_style( 'jquery', 'http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.2/themes/smoothness/jquery-ui.css', array(), '1.8.2', 'all');

		wp_enqueue_script('montessori-szablon-ustawienia', get_template_directory_uri() . '/inc/admin/settings/js/settings-admin-script.js', array( 'jquery' ), '1.0.0', true);
	
	}

	public function add_to_menu(){

		add_theme_page(
			'Ustawienia szablonu',
			'Ustawienia szablonu',
			'manage_options',
			'ustawienia_szablonu',
			array($this, 'settings_page')
		);

	}

}

$settings = Settings::getInstance();
$settings->actions();