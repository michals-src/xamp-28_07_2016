<?php

Class Combat_Theme_Customize{
	
	private $customize;
	private $section_id;

	public function __construct( $section_id = false ){

		$this->section_id = (!empty($section_id)) ? $section_id : '';

		$this->actions();
	}

	protected function actions()
	{
		
		add_action( 'customize_register', array( $this, 'setup' ));
		add_action( 'wp_head', array( $this, 'combat_theme_customize_css' ));

	}

	public function combat_theme_customize_css()
	{

		?>
		
		<style type="text/css">
		<?php if(get_theme_mod('header_image')): ?>
			.container-fluid[role="main"] header[role="presentation"]{
				background: #000 url(<?php echo get_theme_mod('header_image'); ?>) center top no-repeat;
			}
		<?php endif; ?>
		</style>

		<?php

	}

	public function combat_theme_customize_preview()
	{
    ?>
    <script type="text/javascript">
        ( function( $ ) {

            wp.customize('text_header',function( value ) {
                value.bind(function(v) {
                    $('#napis_naglowek').html( v );
                });
            });

            wp.customize('small_text_header',function( value ) {
                value.bind(function(v) {
                    $('#maly_napis_naglowek').html( v );
                });
            });

            wp.customize('header_image',function( value ) {
                value.bind(function(v) {
                	$('header[role="presentation"]').css({'background-image': 'url('+v+')'});
                });
            });

            wp.customize('scroll_text_animation_header', function( value ) {
            	value.bind(function(v) {
           			if(!v){
                    	$('#scroll_down_button').removeClass( 'blink' );
                	}else if(v){
                		$('#scroll_down_button').addClass( 'blink' );
                	}
                });
            });

            wp.customize('numer_tel', function( value ) {
            	value.bind(function(v) {
           			$('#phone').html( v );
                });
            });
            wp.customize('adres_email', function( value ) {
            	value.bind(function(v) {
           			$('#email').html( v );
                });
            });

            wp.customize('ulica', function( value ) {
            	value.bind(function(v) {
           			$('#st').html( v );
                });
            });
            wp.customize('kod', function( value ) {
            	value.bind(function(v) {
           			$('#cde').html( v );
                });
            });

            wp.customize('grupa_dzieci1', function( value ) {
            	value.bind(function(v) {
           			$('#t_g1').html( v );
                });
            });
            wp.customize('grupa_dzieci2', function( value ) {
            	value.bind(function(v) {
           			$('#t_g2').html( v );
                });
            });
            wp.customize('grupa_doroslych', function( value ) {
            	value.bind(function(v) {
           			$('#t_g3').html( v );
                });
            });

        } )( jQuery )
    </script>
    <?php
	}

	public function setup($wp_customize)
	{
		$this->customize = $wp_customize;

		return $this->creator();
	}

	private function _continue($arg = false){
		$arg = (!empty($arg)) ? $arg : '';
		return new Self($arg);
	}

	private function create_panel( $panel_id, $args )
	{
		$this->customize->add_panel( $panel_id, $args );
	}

	private function create_section( $section_id, $args )
	{
		$this->customize->add_section( $section_id, $args );
	}

	private function create_setting( $section_id, $args )
	{
		$this->section_id = $section_id;
		$this->customize->add_setting( $section_id, $args );

		return $this;
	}

	private function create_control( $args )
	{	
		$this->customize->add_control( $this->section_id, $args );
	}

	private function create_controlClass( $args )
	{	
		$this->customize->add_control( $args );
	}

	protected function creator()
	{
		if ( $this->customize->is_preview() ) {
		    add_action( 'wp_footer', array($this, 'combat_theme_customize_preview'), 21);
		}

	$this->create_section(
			'header_section',
        	array(
        	'title' => 'Nagłówek - ustawienia',
        	'description' => 'Zarządaj elementami nagłówka.',
        	'priority' => 35,
        )
	);

	    $this->create_setting('text_header',
		    array(
		        'default' => 'Modern combat hosin - sul',
		        'transport' => 'postMessage'
		    )
		)
			->create_control(
				array(
					'label' => 'Tekst w nagłówku',
					'section' => 'header_section',
					'type' => 'text',
				)
			);

		$this->create_setting('small_text_header',
			array(
		        'default' => 'Białystok',
		        'transport' => 'postMessage'
		    )
		)
			->create_control(
				array(
			        'label' => 'Mniejszy tekst w nagłówku',
			        'section' => 'header_section',
			        'type' => 'text',
			    )
			);

		$this->create_setting('header_image',
			array(
		        'default' => 'http://combat.waw.pl/wp-content/uploads/2016/02/shutterstock_125962484.png',
		        'transport' => 'postMessage'
		    )
		)
			->create_controlClass( new WP_Customize_Image_Control($this->customize, 'logo',
		        	array(
		        		'label'      => 'Obraz nagłówka',
		        		'section'    => 'header_section',
		        		'settings'   => $this->section_id
		        	)
				)
			);

		$this->create_setting('scroll_text_header',
			array(
		        'default' => 'Przejdź niżej',
		        'transport' => 'postMessage'
		    )
		)
			->create_control(
				array(
				 	'label' => 'Tekst przycisku przewijania strony',
				  	'section' => 'header_section',
				 	'type' => 'text'
				)
			);


		$this->create_setting('scroll_text_animation_header',
			array(
		        'default' => true,
		        'transport' => 'postMessage'
		    )
		)
			->create_control(
				array(
				 	'label' => 'Animacja przycisku przewijania strony',
				  	'section' => 'header_section',
				 	'type' => 'checkbox'
				)
			);

		$this->create_panel(
				'images_section',
	        	array(
		        	'title' => 'Obrazy',
		        	'description' => 'Zarządaj obrazami.',
		        	'priority' => 35,
	        )
		);
			$this->create_section(
					'zdjecia_osobowe',
		        	array(
			        	'title' => 'Obrazy osobowe',
			        	'description' => 'Zarządaj obrazami.',
			        	'priority' => 35,
			        	'panel' => 'images_section'
		        )
			);

				$this->create_setting('avatar_image',
					array(
				        'default' => get_template_directory_uri() . '/images/avatar.jpg',
				        'transport' => 'postMessage'
				    )
				)
					->create_controlClass( new WP_Customize_Image_Control($this->customize, 'avatar',
				        	array(
				        		'label'      => 'Avatar',
				        		'section'    => 'zdjecia_osobowe',
				        		'settings'   => 'avatar_image'
				        	)
						)
					);

				for($x=0;$x<10;$x++):

				$this->create_setting('dokument_image_' . $x,
					array(
				        'default' => get_template_directory_uri() . '/images/dokument'.($x + 1).'.jpg',
				        'transport' => 'postMessage'
				    )
				)
					->create_controlClass( new WP_Customize_Image_Control($this->customize, 'dokument'.$x,
				        	array(
				        		'label'      => 'Dokument ' . ($x + 1),
				        		'section'    => 'zdjecia_osobowe',
				        		'settings'   =>  $this->section_id
				        	)
						)
					);

				endfor;

				$this->create_section(
						'zdjecia_sali',
			        	array(
				        	'title' => 'Obrazy sali',
				        	'description' => 'Zarządaj obrazami.',
				        	'priority' => 35,
				        	'panel' => 'images_section'
			        )
				);

				for($x=0;$x<3;$x++):

				$this->create_setting('sala_image_' . $x,
					array(
				        'transport' => 'postMessage'
				    )
				)
					->create_controlClass( new WP_Customize_Image_Control($this->customize, 'sala'.$x,
				        	array(
				        		'label'      => 'Zdjęcie ' . ($x + 1),
				        		'section'    => 'zdjecia_sali',
				        		'settings'   =>  $this->section_id
				        	)
						)
					);

				endfor;

		$this->create_section(
				'ustawienia_personalne',
	        	array(
		        	'title' => 'Ustawienia personalne',
		        	'description' => 'Adres email, numer tel. itp.',
		        	'priority' => 55
	        )
		);
			$this->create_setting('numer_tel',
				array(
			        'default' => '606 283 051',
			        'transport' => 'postMessage'
			    )
			)
				->create_control(
					array(
					 	'label' => 'Numer kontaktowy',
					  	'section' => 'ustawienia_personalne',
					 	'type' => 'input'
					)
				);

			$this->create_setting('adres_email',
				array(
			        'default' => 'mateuszes@gmail.com',
			        'transport' => 'postMessage'
			    )
			)
				->create_control(
					array(
					 	'label' => 'Adres email',
					  	'section' => 'ustawienia_personalne',
					 	'type' => 'email'
					)
				);

			$this->create_setting('ulica',
				array(
			        'default' => 'Warszawska 79',
			        'transport' => 'postMessage'
			    )
			)
				->create_control(
					array(
					 	'label' => 'Ulica',
					  	'section' => 'ustawienia_personalne',
					 	'type' => 'input'
					)
				);

			$this->create_setting('kod',
				array(
			        'default' => '15-063 Białystok',
			        'transport' => 'postMessage'
			    )
			)
				->create_control(
					array(
					 	'label' => 'Kod',
					  	'section' => 'ustawienia_personalne',
					 	'type' => 'input'
					)
				);

			$this->create_setting('grupa_dzieci1',
				array(
			        'default' => '16:30 - 17:30',
			        'transport' => 'postMessage'
			    )
			)
				->create_control(
					array(
					 	'label' => 'Godziny zajęć Grupa dzieci I',
					  	'section' => 'ustawienia_personalne',
					 	'type' => 'input'
					)
				);
			$this->create_setting('grupa_dzieci2',
				array(
			        'default' => '17:30 - 18:30',
			        'transport' => 'postMessage'
			    )
			)
				->create_control(
					array(
					 	'label' => 'Godziny zajęć Grupa dzieci II',
					  	'section' => 'ustawienia_personalne',
					 	'type' => 'input'
					)
				);			
			$this->create_setting('grupa_doroslych',
				array(
			        'default' => '20:00 - 21:00',
			        'transport' => 'postMessage'
			    )
			)
				->create_control(
					array(
					 	'label' => 'Godziny zajęć Grupa dorosłych',
					  	'section' => 'ustawienia_personalne',
					 	'type' => 'input'
					)
				);

	
	}


}

$combat_customize = new Combat_Theme_Customize();