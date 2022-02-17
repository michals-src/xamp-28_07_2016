<?php
/**
 * Theme settings
 *
 * @subpackage rakantbud
 * @version 1.0.0
 */

Class RakantbudSettings{

	protected $fields;
	protected static $values = array();

	public function __construct()
	{

		$defaults = array(
			'rb_st_name'			=> 'Rakant - bud',
			'rb_st_tag'				=> 'Ocieplenia i remonty',
			'rb_st_logo'			=> get_template_directory_uri() . '/images/ltnvb.png',
			'rb_st_phone'			=> '603 153 582',
			'rb_st_email'			=> 'adres@email.pl',
			'rb_st_bigHeadertext'	=> '',
			'rb_st_smallHeadertext'	=> ''
		);

		foreach ($defaults as $k => $v) {
			self::$values[$k] = get_option($k) ? get_option($k) : $v;
		}


		$this->fields();

		add_action('admin_menu', array($this, 'add_to_menu'));
		add_action('admin_init', array($this, 'init'));
		add_action('admin_enqueue_scripts', array($this, 'enqueue_scripts'));

		add_shortcode( 'opcja', array($this, 'getOption') );

	}

	protected function fields()
	{
		$this->fields = array(

			'rb_st_name' => array(
				'type' => 'text',
				'label' => 'Nazwa strony',
				'placeholder' => 'Nazwa strony'
			),
			'rb_st_tag' => array(
				'type' => 'text',
				'label' => 'Podpis strony',
				'placeholder' => 'Podpis strony'
			),
			'rb_st_logo' => array(
				'type' => 'image',
				'label' => 'Logo strony'
			),
			'rb_st_phone' => array(
				'type' => 'tel',
				'label' => 'Numer tel.',
				'placeholder' => 'Podpis strony'
			),
			'rb_st_email' => array(
				'type' => 'email',
				'label' => 'Adres email',
				'placeholder' => 'Podpis strony'
			),
			'rb_st_bigHeadertext' => array(
				'type' => 'text',
				'label' => 'Duży tekst nagłówkowy',
				'placeholder' => 'Tekst nagłówkowy'
			),
			'rb_st_smallHeadertext' => array(
				'type' => 'text',
				'label' => 'Mały tekst nagłówkowy',
				'placeholder' => 'Tekst nagłówkowy'
			),

		);
	}

	public function init()
	{
		add_settings_section(
			'themesettings-section',
			'Ustawienia strony',
			null,
			'themesettings-options'
		);

		foreach ($this->fields as $slug => $v) {
			add_settings_field(
				$slug,
				$v['label'],
				array($this, 'do_field'),
				'themesettings-options',
				'themesettings-section',
				array(
					'slug'			=> $slug,
					'type'			=> $v['type'],
					'placeholder'	=> (!empty($v['placeholder'])) ? $v['placeholder'] : '',
				)
			);
			register_setting('themesettings-section', $slug);
		}

		add_editor_style(get_template_directory_uri() . '/css/style.css');
		add_editor_style(get_template_directory_uri() . '/css/bootstrap.min.css');
		add_editor_style(get_template_directory_uri() . '/inc/css/themesettings.css');

	}

	public function add_to_menu()
	{
		add_theme_page(
			'Ustawienia szablonu',
			'Ustawienia szablonu',
			'manage_options',
			'ustawiemia_szablonu',
			array($this, 'settings_page')
		);

	}

	public function do_field($args)
	{

		switch ($args['type']) {

			case 'text':
				echo $this->_text($args);
				break;
			case 'email':
				echo $this->_email($args);
				break;
			case 'tel':
				echo $this->_tel($args);
				break;
			case 'image':
				echo $this->_image($args);
				break;

		}

	}

	private function _text($args)
	{
		$field = '<input type="text" name="'.$args['slug'].'" placeholder="'.$args['placeholder'].'" value="'.self::$values[$args['slug']].'" style="width:50%">';

		return $field;
	}

	private function _email($args)
	{
		$field = '<input type="email" name="'.$args['slug'].'" placeholder="'.$args['placeholder'].'" value="'.self::$values[$args['slug']].'" style="width:50%">';

		return $field;
	}

	private function _tel($args)
	{
		$field = '<input type="tel" name="'.$args['slug'].'" placeholder="'.$args['placeholder'].'" value="'.self::$values[$args['slug']].'" style="width:50%">';

		return $field;
	}

	private function _image($args)
	{
		$field = '<div class="prev">';
		$field .= '<div class="imgPrev">';
		$field .= (!empty(self::$values[$args['slug']])) ? '<img src="'.self::$values[$args['slug']].'" />' : 'Nie dodano obrazu';
		$field .= '</div>';
		$field .= '<div class="wp-core-ui"><button class="uploader button">Zmień logo</button></div>';
		$field .= '<input type="hidden" name="'.$args['slug'].'" class="img-data" value="'.self::$values[$args['slug']].'">';
		$field .= '</div>';

		return $field;
	}

	public function settings_page()
	{
	  ?>
		<div class="postbox">
			<div class="inside" style="padding: 25px;">
			<form action="options.php" method="post">
				<?php
					settings_fields('themesettings-section');
					do_settings_sections('themesettings-options');
					submit_button();
				?>
			</form>
			</div>
		</div>
	  <?php
	}

	public function enqueue_scripts()
	{
		wp_enqueue_media();
		wp_enqueue_script( 'themesettings.js', get_template_directory_uri() . '/inc/js/themesettings.js', array(), '1.0.0', true );
	}

	public static function get( $option )
	{
		return self::$values[$option];
	}

	public function getOption( $atts )
	{

		$a = $atts;

		if(empty($a['indeks'])){
			return 'Należy podać indeks opcji';
		}

		return self::get($a['indeks']);

	}

}

$ustawienia = new RakantbudSettings();