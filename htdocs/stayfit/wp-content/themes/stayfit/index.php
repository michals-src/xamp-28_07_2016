<?php get_header(); ?>



<div class="prez">
	<div class="prez-wall">
		<video width="100%" poster="<?php echo get_template_directory_uri(); ?>/images/d78e8d.png" autobuffer autoplay loop>
		  <source src="<?php echo get_template_directory_uri(); ?>/images/wall.mp4" type="video/mp4">
		</video>
	</div>
	<div class="prez-wall-adn">
		<img src="<?php echo get_template_directory_uri(); ?>/images/_c84ujd.png" class="hidden-sm hidden-xs">
	</div>
	<header class="header-normal" role="main">
			<picture class="logo logo-normal">
				<img src="<?php echo get_template_directory_uri(); ?>/images/logo-normal.png" alt="StayFit Białystok">
			</picture>
			<nav class="menu">
				<div class="_ic-nav">
					<div class="_no">
						<div class="glyphicon glyphicon-menu-hamburger"></div>
					</div>
					<div class="_nc">
						<div class="glyphicon glyphicon-remove _ic"></div>
					</div>
				</div>
				<?php 
					wp_nav_menu(array(
						'theme_location' => 'primary',
						'menu_class' => 'nav header-nav'
					));
				?>
			</nav>
	</header>
	<div class="container text-center site-wrapper">
		<div class="site-wrapper-inner">
				<div class="container">
					<div class="text-wall">
						<h1>Klub fitness StayFit</h1>
						<p class="lead">Profesjonalni instruktorzy, kamerlane grupy fitness, miła atmosfera</p>
					</div>
				</div>
		</div>
	</div>
	<div class="clearfix"></div>
</div>
<div class="oferta _i01-00">
<?php 

	$a = [
		[
			'nazwa' => 'Trening wyszczuplający',
			'opis' => 'Podczas ćwiczeń angażowane są wszystkie grupy mięśniowe powodują ich wzmocnienie i wytrzymałość. Zajęcia są prowadzone w tempie zmiennym (interwał) dzięki czemu poprzez wyższe tętno jest spalane więcej tkanki tłuszczowej.'
		],
		[
			'nazwa' => 'Mix odchudzający',
			'opis' => 'Podczas ćwiczeń angażowane są wszystkie grupy mięśniowe powodują ich wzmocnienie i wytrzymałość a także ćwiczenia te mają na celu przyspieszenie spalania tkanki tłuszczowej . W trakcie ćwiczeń pracuje się z wieloma przyrządami: ciężarki, gumy gimnastyczne, piłkami i stepami.'
		],
		[
			'nazwa' => 'Brzuch, uda, pośladki',
			'opis' => 'Zestaw ćwiczeń których głównym celem jest rzeźbienie wzmacnianie oraz zmniejszenie obwodu z ud i pośladków oraz pobudzenie tkanki tłuszczowej do spalania z okolic brzucha.'
		],
		[
			'nazwa' => 'Pilates',
			'opis' => 'Metoda Pilates proponuje trening oparty na stopniowej odbudowie i rozbudowie prawidłowych wzorców pobudzeń mięśniowych, których występowanie jest podstawą i bezwzględnym warunkiem dla przystąpienia do innych bardziej obciążających ćwiczeń siłowych.'
		],
		[
			'nazwa' => 'Aktywne spalnie',
			'opis' => 'Polega na wykonywaniu prostej kombinacji ćwiczeń, które angażują wszystkie partie mięśniowe oraz poprawiają wydolność organizmu. Każda kombinacja jest wykonywana w trzech różnych tempach i na trzech poziomach trudności. Zalecane jest wykonywanie wszystkich powtórzeń, ale każda osoba może indywidualnie dopasować poziom dla siebie.'
		],
		[
			'nazwa' => 'Zdrowy kręgosłup',
			'opis' => 'Zajęcia wzmacniające mięśnie stabilizujące kręgosłup, to forma ćwiczeń fitness przeznaczona dla wszystkich, którzy profilaktycznie chcą dbać o swoją postawę kręgosłup. Bez obciążania stawów, bez podskoków i bez dynamicznych ruchów. Ćwiczenia wzmacniają główne mięśnie głębokie, wykonywane precyzyjnie, powoli i w pełnym skupieniu.'
		]
	];

?>
<div class="box-list">
	<div class="row">
		<div class="col-xs-12 col-sm-6 col-md-3 box box-1 pre-field" pre-href="#oferta-slider">
			<div class="pre-title">
				<h2>Zajęcia grupowe</h2>
			</div>
			<div class="pre-text"></div>
		</div>
		<div class="col-xs-12 col-sm-6 col-md-3 box box-2 pre-field">
			<div class="pre-title">
				<h2>Trening personalny</h2>
			</div>
			<div class="pre-text">
				Niesie ze sobą wiele korzyści. Jest indywidualnie dopasowany do każdego uczestnika, do jego możliwości, kondycji, stanu zdrowia czy wreszcie samopoczucia.Praktycznie 100% czasu treningu poświęcone jest na osiągnięcie indywidualnych celów treningowych.Trener osobisty dostosowuje plan treningu do Twoich oczekiwań ale i możliwości zdrowotnych oraz kondycyjnych. Trener czuwa nad poprawnością i skutecznością wykonywanych przez Ciebie ćwiczeń, w razie potrzeby eliminuje błędy. Trener motywuje do wysiłku, dba o bezpieczeństwo wykonywanych ćwiczeń. Trener sprawia, że aktywność fizyczna jest przyjemną formą spędzania wolnego czasu (choć pewnie nie zawsze:)) Trener stale wymyśla coś nowego. Nie ma nudy. Trener pomaga maksymalnie wykorzystać każdą minutę Twojego cennego czasu. Trening skupia się na tym na czym Ci najbardziej zależy, ale również na tym co jest Twoją najsłabszą stroną. Trening personalny połączony z odpowiednią dietą to najszybsza i najbardziej efektywna droga do sprawnego i zdrowego ciała. Trener odpowiada na Twoje pytania dotyczące ćwiczeń, odżywiania, spędzania czasu w sposób aktywny. Twój trener staje się Twoim przyjacielem a jednocześnie "katem i batem"
			</div>
		</div>
		<div class="col-xs-12 col-sm-6 col-md-3 box box-3 pre-field">
			<div class="pre-title">
				<h2>Masaż sportowo / relaksacyjny</h2>
			</div>
			<div class="pre-text">
				Masaż relaksacyjny to idealny sposób na zmęczenie zarówno fizyczne, jak i psychiczne. Szybkie tempo życia, codzienne troski i problemy, ciągłe napięcie psychiczne - wszystko to sprawia, że czujemy się przemęczeni i pozbawieni energii. W takiej chwili dobry masaż relaksacyjny leczy obolałe i napięte mięśnie, a także jest prawdziwą przyjemnością dla ciała i dla ducha. Masowanie pleców i karku sprawia, że można się w pełni odprężyć, choć na chwilę zapomnieć o kłopotach i nabrać energii tak potrzebnej do codziennego funkcjonowania.
			</div>
		</div>
		<div class="col-xs-12 col-sm-6 col-md-3 box box-4 pre-field">
			<div class="pre-title">
				<h2>Kinesiotaping</h2>
			</div>
			<div class="pre-text">
				<strong>W jakim celu stosuje się „tejpy”?</strong>
				Kinesiotaping ma bezpośrednie oddziaływanie na skórę  zwiększając przestrzeń pomiędzy skórą właściwą a powięzią - błoną osłaniającą mięśnie (głównie na mechanoreceptory  tzw. zakończenia Ruffiniego, receptory bólu i czucia głębokiego), na układ limfatyczny, mięśnie oraz stawy. Bazuje on na kinezjologii i istniejącym w organizmie procesie samoleczenia, dlatego jego działanie jest długofalowe. Dodatkowym atutem tej metody jest fakt, że technika ta nie ogranicza ruchów w stawach i nie stanowi żadnej przeszkody w prowadzeniu dotychczasowego stylu życia.
				Podstawowe funkcje kinesiotapingu to przede wszystkim:
				<ul class="list-dotted">
					<li>redukcja bólu,</li>
					<li>rozluźnienie bądź aktywacja mięśni,</li>
					<li>poprawa funkcji grup mięśniowych nadmiernie rozciągniętych,</li>
					<li>zwiększenie zakresu ruchu i korekcja powięzi,</li>
					<li>pełni także nieocenioną rolę w poprawie czucia propriocetywnego (czucia głębokiego) ciała.</li>
				</ul>
				Lorem ipsum dolor sit amet, consectetur adipisicing elit. Placeat ipsum qui praesentium quibusdam dicta provident inventore libero laudantium, molestiae nostrum, unde ullam saepe officia? Expedita vel, quibusdam illo molestiae voluptatibus.
			</div>
		</div>
	</div>
</div>

<div id="oferta-slider" class="_oferta-lg hidden-sm hidden-xs">
	<div class="oferta-pokaz">
		<header>
			<h2>Oferta zajęć</h2>
		</header>
		<div class="site-wrapper oferta-entry-content">
			<ul class="oferta-slides site-wrapper-inner _luner">
			<?php foreach ($a as $key => $value): $value = (object) $value; ?>
				<li class="3yegd _lune">
					<h2><?php echo $value->nazwa; ?></h2>
					<p>
						<?php echo $value->opis; ?>
					</p>
				</li>
			<?php endforeach; ?>
			</ul>
			<div class="_luner-loader">
				<div class="visual-timer"></div>
			</div>
		</div>
	</div>
	<nav class="_luner-nav">
			<a href="#" class="_luner-previous">&larr; Poprzedni</a>
			<a href="#" class="_luner-next">Następny &rarr;</a>
	</nav>
</div>

<div class="_list01-00 _oferta-sm hidden-md hidden-lg">
	<h1 class="_t01-00">Oferta zajęć</h1>
	<ul class="_list-inner-zakladki">
	<?php foreach ($a as $key => $value): $value = (object) $value; ?>
		<li class="3yegd">
			<header>
				<h2><?php echo $value->nazwa; ?></h2>
				<div class="glyphicon glyphicon-remove _ic"></div>
			</header>
			<p>
				<?php echo $value->opis; ?>
			</p>
		</li>
	<?php endforeach; ?>
	</ul>
</div>

</div>
<div class="onas _lt _i01-00">
	<div class="container">
		<div class="row">
			<div class="col-xs-12 col-sm-12 col-md-7 col-lg-7">
				<div class="section-title">
					<h1>O nas</h1>
				</div>
				<p>
					Klub prowadzi szereg zajęć fitness poprawiające wygląd sylwetki, wzmocnienia mięśni, zmniejszenia obwodu ud, ujędrnienia ciała, pozbycia się cellulitu czy poprawy kondycji. Można również skorzystać z treningów personalnych pod okiem doświadczonych trenerów, treningu obwodowego oraz zajęć wzmacniających mięśnie kręgosłupa. Nasz klub wyróżnia się mniejszymi grupami dzięki czemu instruktor może poświecić więcej czasu dla osoby ćwiczącej. Doświadczeni instruktorzy pomogą dla Twojego ciała i zdrowia nabrać swietnej kondycji oraz wspaniałego wyglądu.
				</p>
			</div>
			<div class="onas-image hidden-xs hidden-sm col-md-4 col-lg-4 col-md-offset-1">
				<img src="<?php echo get_template_directory_uri(); ?>/images/i006.png" alt="o nas (obraz)">
			</div>
		</div>
	</div>
</div>
<div class="aktualnosci _i01-00" id="aktualnosci">
<?php 

	use fb\fb;
	$fb = new fb();

	$me = $fb->me(['feed.limit(5){message,created_time,from}', 'link', 'name', 'fan_count', 'about']);

?>
	<div class="container aktualnosci-content">
	  <div class="row">

	<header class="aktualnosci-header col-md-5">
		<div class="aktualnosci-text">
			<div class="section-title">
				<h1>Aktualności</h1>
				<p>Informacje StayFit z Facebooka</p>
			</div>
		</div>
		<div class="fb-bar">
			<h1><?php echo $me->fan_count; ?></h1>
			<p>Osób lubi StayFit Białystok</p>
			<div class="fb-like" data-href="http://facebook.pl/stayfit.bialystok" data-layout="button" data-action="like" data-size="large" data-show-faces="true" data-share="true"></div>
			
		</div>
	</header>

	<div class="col-md-offset-1 col-md-6 aktualnosci-field">
<?php

	foreach ($me->feed as $key => $item) {

	$message = preg_replace('|(https?://([\d\w\.-]+\.[\d\w\.]{2,3}\/)([\w\d\-]+)\/[^\s\.-]+)|i', '<a href="$1">$1</a>', $item['message']);
	$from = $fb->getFields($item['from'], ['link','name']);

?>
			<article class="col-xs-12">
				<header>
					<a href="<?php echo $from->link; ?>"><?php echo $from->name; ?></a>
					<date><a href="https://www.facebook.com/<?php echo $item['id']; ?>" target="_blank"><?php echo $item['created_time']->format('d M Y'); ?></a></date>
				</header>
				
				<p><?php echo nl2br($message); ?></p>
			
					<?php 
						$attachments = $fb->getFields($item, array('attachments'))->attachments[0];
						if($attachments['type'] === 'photo'){
							
							$images = $fb->getImage($attachments['target']);

							$num = count($images->images) - 4;

							echo '<picture><img src="' . $images->images[$num]['source'] . '"  class="_ai"/></picture>';
							
							preg_match('/^.{0,340}(?:.*?)\b/siu', $images->name, $matches);

							//echo '<p>'. nl2br($images->name) .'</p>';
						}elseif($attachments['type'] === 'video_inline'){
							$vid = $attachments['target'];
							$video = $fb->getFields($vid, ['source']);
						?>
							<video controls>
								<source src="<?php echo $video->source; ?>" type="video/mp4">
								Twoja przeglądarka nie obługuje tagu video
							</video>

						<?php
						}

						if($item['story'] && $item['story'] !== $item['message']){
							echo '<div class="_astx">' . $item['story'] . '</div>';
						}

					?>

			</article>
<?php } ?>

		</div>

	  </div>
	</div>
</div>
<div class="kontakt">
<div class="_i01-01">
	<div class="_lt text-center">
		<div class="_i01-01">
			<div class="section-title">
				<h1>Skontaktuj się z nami</h1>
			</div>
			<p>W celu uzyskania informacji istnieje możliwość skontaktowania się z nami drogą mailową korzystając z formularza. Jeżeli przez dłuższy czas nie została przesłana odpowiedź proszę skontaktować się z nami na facebooku .</p>
		</div>
	</div>

	<form action="#" method="post" style="form-horizontal">
	<?php 
		wp_nonce_field(basename(__FILE__), 'contant-send-secure');
	?>
		<div class="form-group row">
			<label for="imie" class="col-xs-12 control-label">Imię i nazwisko</label>
			<div class="col-sm-5 col-xs-5">
				<input type="text" id="imie" name="personName" placeholder="Imię" class="form-control" required/>
			</div>
			<div class="col-xs-7">
				<input type="text" id="nazwisko" name="personSurname" placeholder="Nazwisko" class="form-control" required/>
			</div>
		</div>
		<div class="form-group row">
			<label for="email" class="col-xs-12 control-label">Adres email</label>
			<div class="col-xs-12">
				<input type="email" id="email" name="personEmail" placeholder="Adres email" class="form-control" required>
			</div>
		</div>
		<div class="form-group row">
			<label for="content" class="col-xs-12 control-label">Treść wiadomości</label>
			<div class="col-xs-12">
				<textarea type="text" id="content" name="personContent" placeholder="Treść" class="form-control" required></textarea>
			</div>
		</div>
		<div class="form-group row">
			<div class="col-xs-12">
				<input type="submit" name="contact-send" class="btn btn-_bi00-01" value="Wyślij wiadomość" />	
			</div>
		</div>
	</form>
</div>
</div>
<div class="info-view">
	<div class="container">
		<div class="row item-list">
			<div class="col-sm-6 item">
				<i class="glyphicon glyphicon-map-marker"></i>
				<p class="lead">ul. Kręta 2 lok. 4</p>
			</div>
			<div class="col-sm-6 item">
				<i class="glyphicon glyphicon-earphone"></i>
				<p class="lead">510 231 237</p>
			</div>
		</div>
	</div>
</div>
<div class="mapa _i01-00">
	<div class="blok">
		<header>
		<div class="section-title">
		 	<h1>Mapa</h1>
			<p>Sprawdź naszą dokładną lokalizację</p>
		</div>
		</header>
		<div class="content">
			<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d598.7134694935106!2d23.145828829260328!3d53.11281599874568!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x471ffe7f63f304ed%3A0x552993490380c851!2sStayFit!5e0!3m2!1spl!2spl!4v1474201950512" width="600" height="450" frameborder="0" style="border:0" allowfullscreen></iframe>
		</div>
	</div>
</div>



<?php get_footer(); ?>