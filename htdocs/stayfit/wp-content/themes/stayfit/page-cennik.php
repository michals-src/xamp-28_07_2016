<?php get_header(); ?>
<div class="prez _v01-01">
	<div class="prez-s-wall">
		<img src="<?php echo get_template_directory_uri(); ?>/images/_bv01-00.png" />
	</div>
	<header class="header-horizontal" role="main">
			<nav>
			<picture class="logo logo-horizontal">
				<img src="<?php echo get_template_directory_uri(); ?>/images/logo-horizontal.png" alt="StayFit Białystok">
			</picture>
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
						'menu_class' => 'nav header-nav',
						'container_class' => 'navigation-brand-horizontal'
					));
				?>
			</nav>
	</header>
	<div class="container text-center site-wrapper">
		<div class="site-wrapper-inner">
				<div class="container">
					<div class="text-wall">
						<h1>Cennik</h1>
						<p class="lead">Zapoznaj się z naszą ofertą cenową</p>
					</div>
				</div>
		</div>
	</div>
	<div class="clearfix"></div>
</div>
<?php 

	$a = [
		[
			'nazwa' => 'Wstęp miesięczny 3x / tydzień',
			'cena' => '130 zł',
			'inne' => '12 zajęć fitness',
		],
		[
			'nazwa' => 'Wstęp miesięczny 2x / tydzień',
			'cena' => '99 zł',
			'inne' => '8 zajęć fitness',
		],
		[
			'nazwa' => 'Wstęp miesięczny 1x / tydzień',
			'cena' => '69 zł',
			'inne' => '4 zajęć fitness',
		],
		[
			'nazwa' => 'Jednorazowe wejście',
			'cena' => '20 zł',
			'inne' => 'Cena dotyczy jednego wejścia',
		],
	];

	$b = [
		[
			'nazwa' => 'Trening personalny',
			'cena' => '60 zł',
			'inne' => '&nbsp;',
		],
		[
			'nazwa' => 'Masaż sportowo / relaksacyjny',
			'cena' => '60 zł',
			'inne' => '&nbsp;',
		],
		[
			'nazwa' => 'Kinesiotaping',
			'cena' => 'od 20 zł',
			'inne' => 'W zależności od partii mięśnowej',
		],
	];

?>
<div class="cennik _i01-00">
	<div class="container">
	<div class="informacja">
		<picture>
			<img src="<?php echo get_template_directory_uri(); ?>/images/info001.png" style="width: 90%;">
		</picture>
	</div>
		<div class="row">

		<div class="column-nr-1 col-md-6">
			<?php foreach($a as $key => $value): ?>
				<article class="col-md-12 col-xs-12">
					
					<div class="title"> <?php echo $value['nazwa']; ?> </div>
					<div class="content">
						<div class="price"> <?php echo $value['cena']; ?> </div>
						<div class="lbl"> <?php echo $value['inne']; ?> </div>
					</div>

				</article>
			<?php endforeach; ?>
		</div>

		<div class="column-nr-2 col-md-6">
			<?php foreach($b as $key => $value): ?>
				<article class="col-md-12 col-xs-12">
					
					<div class="title"> <?php echo $value['nazwa']; ?> </div>
					<div class="content">
						<div class="price"> <?php echo $value['cena']; ?> </div>
						<div class="lbl"> <?php echo $value['inne']; ?> </div>
					</div>

				</article>
			<?php endforeach; ?>
		</div>

		</div>
		<p class="date-info">Karnet jest ważny miesiąc czasu od daty zakupu</p>
		<div class="cards">
			<div class="section-title">
				<h1>Akceptujemy karty</h1>
			</div>
			<picture>
					<img src="http://basen-bytow.pl/wp-content/uploads/2014/10/fit-profit-300x203.jpg" alt="fitprofit" alt="fitprofit" style="width: 150px;height: 100px;">
			</picture>
		</div>

	</div>
</div>



<?php get_footer(); ?>