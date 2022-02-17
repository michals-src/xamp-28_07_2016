<?php 

/**
 * Template name: Strona główna
 * 
 * @subpackage Combat
 */

get_header();

?>

	<section class="container-fluid" role="main" id="start">

		<header role="presentation">
			<div class="container hl">
				<a href="#" class="brand">Combat</a>
				<a href="https://www.facebook.com/combat.bialystok.samoobrona/" target="_blank">
					<img src="<?php echo get_template_directory_uri() . '/images/hl.png'; ?>">
				</a>
			</div>
			<!-- Nawigacja -->
			<nav class="clearfix" role="primary">
				<div class="container">
					<div class="nav-hamburger">
							<i class="glyphicon glyphicon-menu-hamburger nav-hamburger-icon"></i>
					</div>
				</div>
				<?php 

					wp_nav_menu(array(
						'theme_location' 	=> 'primary-navigation',
						'menu_class'		=> 'nav',
						'container_class'	=> '_pnv nav-content clearfix',
						'container_id'		=> 'navbar',
						'walker'			 => new WPDocs_Walker_Nav_Menu()
					));


				?>
			</nav>
			<!-- / Nawigacja -->

			<div class="container" style="height:100%;display:table;margin-top:-35px;">

				<div class="_mco _bc">
					<div class="_mcc">

							<div class="_mctc">
								<h1 class="_st text-center" id="napis_naglowek"> <?php echo get_theme_mod('text_header', 'Modern Combat Hosin - Sul'); ?> </h1>
								<h3 class="_st text-center" id="maly_napis_naglowek"> <?php echo get_theme_mod('small_text_header', 'Białystok'); ?> </h3>
							</div>

					</div>
				</div>

			</div>

			<div class="scroll-down text-center">
				<a href="#contentScroll" data-scroll="smooth" <?php if(get_theme_mod('scroll_text_animation_header')): ?> class="blink" <?php endif; ?> id="scroll_down_button">
					<p><strong> <?php echo get_theme_mod('scroll_text_header', 'Przejdź niżej'); ?> </strong></p>
					<i class="glyphicon glyphicon-chevron-down"></i>
				</a>
			</div>

		</header>

	</section>
	<section class="container-fluid" id="contentScroll" style="padding:0;" data-spy="scroll" data-target="#navbar-example">

		<section class="_s onas" style="position:relative;" id="po_co_cwiczymy">

			<div class="container">
				<div class="row">
						
					<div class="col-lg-7 col-md-6 col-sm-12 col-xs-12">
				
					<h2 class="_st _wst"> Po co ćwiczymy </h2>

						<div class="_pd-v">
								
								<p>
									W dzisiejszym świecie dotykają nas coraz częściej różnego rodzaju zagrożenia. Samoobrona to umiejętność, którą można wyćwiczyć tak samo, jak każdą inną. Nauka ma za zadanie wypracować automatyczne reakcje obronne, jak również dzięki licznym zadaniom treningowym opanować taktykę samoobrony. Celem jest niedopuszczenie do sytuacji stresowych oraz skutecznie im przeciwdziałanie, jeżeli wystąpią. Proste i skuteczne – na początku uczymy się prostych i skutecznych technik, następnie w ramach rozwoju opanowujemy bardziej skomplikowane rozwiązania – tu nie ma miejsca na nudę. Wraz z wiedzą rośnie pewność siebie – wiesz jak się zachować, co zrobić w sytuacji stresowej, jak sobie z nią radzić – poznajesz siebie. Już od pierwszych spotkań wzrasta bezpieczeństwo osobiste poprzez rozwój pewności siebie. Podczas zajęć wspólnie zadbamy o poprawę kondycji fizycznej i proporcji ciała, redukcję masy oraz wzmocnienie charakteru.
								</p>

						</div>
						<div class="_pd-v _of _pcl text-center">
							Więcej o systemie Combat Hosin-Sul na stronie internetowej <a href="http://combat.waw.pl/">combat.waw.pl</a>
						</div>
					</div>
				
				</div>

			</div><!-- container -->

		</section>

		<section class="_s _dsb" style="position:relative;">

			<div class="container">
				<h2 class="_st _wst"> Grupy </h2>

				<div class="_pd-v group" id="elitarne_grupy">
					<h2 class="_of">Elitarne grupy</h2>
					<p>Czy byłeś kiedyś na zajęciach, w których uczestniczyło dwadzieścia osób i instruktor nie miał czasu Cię poprawić? W naszej grupie ćwiczy maksymalnie 10 osób, podyktowane jest to głównie względami praktycznymi oraz bezpieczeństwem. Kameralna atmosfera pozwala (mimo charakteru zajęć grupowych) bardzo indywidualnie podchodzić do każdego uczestnika – dzięki temu gwarantujemy pełną satysfakcję ze szkolenia.</p>
				</div>

			</div><!-- container -->
			
			<div class="separator"></div>
			
			<div class="container">

				<div class="_pd-v groups">
					
					<div class="row" style="margin-bottom:25px;" id="grupa_dzieci">
					
						<div class="col-lg-6 col-md-6 col-sm-12 col-xs-12 group">
							<header>
								<h2 class="_of">Grupa dzieci I</h2>
								<span class="_ocl">wiek adepta: 5-6 lat</span>
							</header>
							<p>Autorski program samoobrony oparty jest na wieloletnim doświadczeniu w prowadzeniu zajęć z elementami sztuk walki dla najmłodszych przez wykształconego pedagoga. Zajęcia o szczególnym charakterze – łączące ogólnorozwojowy aspekt rozwoju fizycznego z nauką podstawowych elementów sztuk walki, w tym nauki bezpiecznego padania. Treningi kształtują zdolności fizyczne – koordynację, wytrzymałość i poprawę kondycji, a jednocześnie społeczno-psychiczne – naukę zachowania w sytuacjach stresowych, koncentrację oraz pamięć. Ważna jest  również umiejętność pracy w grupie i dążenia do wyznaczonego celu. Dodatkowe ćwiczenia wyprostne i przeciw płaskostopiu pozwalają także pracować nad prawidłową postawą ciała. Zajęcia cechuje wysoki stopień zdyscyplinowania, co jest konieczne ze względu na występujące elementy sztuk walki i  prawidłowy przebieg tego typu treningów. Dodatkowo wpływa to korzystnie na uczestniczących, którzy przestrzegając konkretnych zasad, kształtują swój charakter i mogą skupić się na wykonywaniu określonych ćwiczeń.</p>
						</div>
						<div class="col-lg-6 col-md-6 col-sm-12 col-xs-12 group">
							<header>
								<h2 class="_of">Grupa dzieci II</h2>
								<span class="_ocl">wiek adepta: 7–11 lat</span>
							</header>
							<p>Autorski program nauki samoobrony użytkowej dla dzieci, to przede wszystkim zajęcia ogólnorozwojowo-sportowe z miksu sztuk walki.  Przede wszystkim jest to nauka oraz doskonalenie umiejętności bezpiecznego padania, technik uwolnień oraz prostych unieruchomień. Zajęcia kształtują odpowiedzialność i skupienie oraz poprzez wysoką dyscyplinę świetnie wpisują się w koncepcję wychowania przez obcowanie ze sztukami walki. Dzięki temu rozwiązywanie trudnych sytuacji w szkole czy na podwórku odbywa się bez agresji, a w przypadku jej wystąpienia adepci skutecznie mogą jej przeciwdziałać.</p>
						</div>

					</div>

					<div class="separator"></div>

					<div class="row" style="margin-bottom:25px;" id="grupa_doroslych">
					
						<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 group">
							<header>
								<h2 class="_of">Grupa dorosłych</h2>
								<span class="_ocl">wiek adepta: 18 (16) - ? </span>
							</header>
							<p>Zajęcia sportowe z miksu sztuk walki - metodyka Modern Combat przebiega etapowo, na początku to głównie nauka Samoobrony. Następnie Adepci uczą się walki wręcz na przykładzie Taekwon-Do, Hapkido, Boksu, Kick Boxingu. Kolejnym etapem jest uporządkowanie wiedzy w ramach nauki techniki i taktyki podejmowania interwencji.</p>
						</div>
						<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 group">
							<header>
								<h2 class="_of">Treningi Personalne </h2>
							</header>
							<p>Informacje indywidualnie u instruktora w zależności od potrzeb, mogą być to zajęcia redukcyjne z elementami sztuk walki lub konsultacje techniczne.</p>
						</div>

					</div>
				</div>

			</div><!-- container -->


		</section>

		<section class="_s" id="instruktor">

			<div class="container">
				
				<h2 class="_st">Instruktor – BIO</h2>
			
				<div class="_pd-v">

					<div class="row">
						
						<div class="col-lg-6 col-md-6 col-xs-12 col-sm-12" style="padding:0;">
							<field style="display:block;margin-bottom:10px;">
								<picture style="background-color:#fff;height:450px;display:block;padidng:0;overflow:hidden;">
									<img src="<?php echo get_theme_mod('avatar_image', get_template_directory_uri() . '/images/avatar.jpg'); ?>" alt="zdjęcie Mateusz Stankiewicz" title="Mateusz Stankiewicz" style="width:100%;">
								</picture>
								<button class="btn btn-default sdoc" style="margin-top:10px;width:100%;">Zobacz dokumenty</button>
							</field>
							<div class="row" style="margin:0;">
								<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
									<div class="_sig row" style="display:none;">
									<?php for($x=0;$x<10;$x++): ?>
										<div class="dd doc-<?php echo $x; ?>" style="height:150px;width:150px;overflow:hidden;"><a href="<?php echo get_theme_mod('dokument_image_' . $x, get_template_directory_uri() . '/images/dokument'.($x + 1).'.jpg'); ?>" style="background-color:#fff;overflow:hidden;display:block;width:100%;" data-lightbox="Dokument"><img src="<?php echo get_theme_mod('dokument_image_' . $x, get_template_directory_uri() . '/images/dokument'.($x + 1).'-300x200.jpg'); ?>" alt=""></a></div>
									<?php endfor; ?>
									</div>
								</div>
							</div>
						</div>

						<div class="col-lg-6 col-md-6 col-xs-12 col-sm-12" style="padding:25px;">

							<h2 class="_ocl _of">Mateusz Stankiewicz</h2>
							<p><strong>
							Moja przygoda ze sztukami walki zaczęła się w 2000 roku. Pierwszą pasją było Aikido, którego praktyka doprowadziła mnie do uzyskania stopnia mistrzowskiego II DAN (2013 rok). 
							<br/><br/>
							Praktyka Aikido była ściśle powiązana z rozwojem umiejętności trenerskich. 
							Pierwszym krokiem było odbycie szkolenia oraz zdanie egzaminu i uzyskanie  Państwowych Uprawnień Instruktorskich Rekreacji Ruchowej o specjalności samoobrona wydaną przez Wyższą Szkołę Trenerów Sportu w Warszawie (2011r.) 
							<br/><br/>
							Kolejnym etapem rozwoju był Intensywny Kurs instruktorski Combat prowadzony przez Twórcę systemu Combat Hosin-Sul – Grzegorza Wyszomierskiego, zakończony nadaniem uprawnień instruktorskich rekreacji ruchowej o specjalności Combat. (2014r.)
							<br/><br/>
							Kolejnym etapem było odbycie kursu Trener Personalny. Podczas zajęć opracowałem zagadnienia z obszaru Fitness, Bosu, Natural Stretching, Pilates, odżywiania i odnowy biologicznej. Kurs zakończyłem egzaminem teoretycznym oraz praktycznym i uzyskałem Dyplom OM Trener Personalny (2015r.). 
							<br/><br/>
							Od 2009 roku jestem instruktorem grupy dzieci oraz dorosłych w Akademii Aikido Białystok. Od 2014 roku prowadzę grupy dzieci i dorosłych w Systemie Modern Combat Hosin-Sul w Białymstoku.

							</strong></p>

						</div>

					</div>

				</div>

			</div>

		</section>

		<section class="_s _dsb" id="informacje">

			<div class="container text-center">
				<div class="_st">Gdzie i kiedy ćwiczymy</div>
				
				<div class="_pd-v _pig">
					<div class="row">
						<div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
							<fieldset>
								<div class="google-map">
									<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d771.6891741868432!2d23.179998535342985!3d53.12808408457574!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x471ffeaf7e7ab5e5%3A0x481cba22cb2d9c0e!2sWarszawska+79%2C+Bia%C5%82ystok!5e0!3m2!1spl!2spl!4v1472040781176" width="100%" height="400" frameborder="0" style="border:0" allowfullscreen></iframe>
								</div>
							</fieldset>
						</div>
						<div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
							<dl class="dl-horizontal grafik">
							  <dt>Kiedy ćwiczymy</dt>
							  <dd>Poniedziałki i środy</dd>

							  <dt>Grupa dzieci I</dt>
							  <dd id="t_g1"><?php echo get_theme_mod('grupa_dzieci1', '16:30 - 17:30'); ?></dd>
							  <dt>Grupa dzieci II</dt>
							  <dd id="t_g2"><?php echo get_theme_mod('grupa_dzieci2', '17:30 - 18:30'); ?></dd>
							  <dt >Grupa dorosłych</dt>
							  <dd id="t_g3"><?php echo get_theme_mod('grupa_doroslych', '20:00 - 21:00'); ?></dd>

							</dl>

							<div class="row obrazy">
								<div class="text-left col-lg-12">
									<p style="margin-bottom:0;" id="cde">15-063 Białystok</p>
									<p class="lead" style="color:#fff;">ul. <span id="st" style="color:#fff;">Warszawska 79</span></p>
								</div>
								<?php for($x=0;$x<2;$x++): ?>
									<?php if(get_theme_mod("sala_image_{$x}")): ?>
										<div class="col-lg-6 col-md-6 col-sm-6 col-xs-6" style="height:150px;padding:6px;overflow:hidden;">
											<a href="<?php echo get_theme_mod('sala_image_' . $x); ?>" style="background-color:#fff;overflow:hidden;display:block;width:100%;" data-lightbox="Dokument"><img src="<?php echo get_theme_mod('sala_image_' . $x); ?>" alt="" width="270px"></a>
										</div>
									<?php endif; ?>
								<?php endfor; ?>
							</div>

						</div>
					</div>
					</div>

			</div>

		</section>

		<section class="_s kontakt" id="kontakt">

			<div class="container text-center">
				<div class="_st">Kontakt i zapisy</div>
				<p class="_ocl">Mateusz Stankiewicz</p>
				<div class="lower">
					<p><span id="email"><?php echo get_theme_mod('adres_email', 'mateuszes@gmail.com'); ?></span></p>
					<p>Tel. <span id="phone"><?php echo get_theme_mod('numer_tel', '606 283 051'); ?></span></p>
				</div>

			</div>

		</section>



	</section>

<?php get_footer(); ?>