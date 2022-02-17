<?php get_header(); ?>
<div class="prez _vf-kontakt">
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

			<div class="text-wall">
				<div class="_lt text-center" style="margin-top:0;">
						<h1>Skontaktuj się z nami</h1>
						<div class="_i01-01">
						<p>W celu uzyskania informacji istnieje możliwość skontaktowania się z nami drogą mailową korzystając z formularza. Jeżeli przez dłuższy czas nie została przesłana odpowiedź proszę skontaktować się z nami na facebooku .</p>
					</div>
				</div>
			</div>

		</div>
	</div>
	<div class="clearfix"></div>
</div>
<div class="kontakt _pvf-kontakt">
<div class="_i01-01">


	<form action="#" method="post" style="form-horizontal">
	<?php 
		wp_nonce_field(basename(__FILE__), 'contant-send-secure');
	?>
		<div class="form-group row">
			<label for="imie" class="col-xs-12 control-label">Imię i nazwisko</label>
			<div class="col-sm-5 col-xs-5">
				<input type="text" id="imie" name="personName" placeholder="Imię" class="form-control" required />
			</div>
			<div class="col-xs-7">
				<input type="text" id="nazwisko" name="personSurname" placeholder="Nazwisko" class="form-control" required />
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
				<textarea type="text" id="content" name="personContent" placeholder="Treść" class="form-control"required></textarea>
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
			<h1>Mapa</h1>
			<p>Sprawdź naszą dokładną lokalizację</p>
		</header>
		<div class="content">
			<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d598.7134694935106!2d23.145828829260328!3d53.11281599874568!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x471ffe7f63f304ed%3A0x552993490380c851!2sStayFit!5e0!3m2!1spl!2spl!4v1474201950512" width="600" height="450" frameborder="0" style="border:0" allowfullscreen></iframe>
		</div>
	</div>
</div>



<?php get_footer(); ?>