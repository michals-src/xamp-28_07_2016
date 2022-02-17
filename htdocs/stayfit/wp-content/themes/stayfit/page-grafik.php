<?php get_header(); ?>
<div class="prez _v01-01">
	<div class="prez-s-wall">
		<img class="hidden-sm hidden-xs" src="<?php echo get_template_directory_uri(); ?>/images/_bv01-01.png"/>
		<img class="hidden-md hidden-lg" src="<?php echo get_template_directory_uri(); ?>/images/_bv01-01sm.png"/>
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
						<h1>Grafik</h1>
						<p class="lead">Aktualny plan zajęć</p>
					</div>
				</div>
		</div>
	</div>
	<div class="clearfix"></div>
</div>
<?php 

$a = [
	'9' => [
		'Poniedziałek' => [
			'nazwa' => 'Trening obwodowy',
			'color' => 'orange'
		],
		'Wtorek' => [
			'nazwa' => '',
			'color' => ''
		],
		'Środa' => [
			'nazwa' => 'Aktywny poranek',
			'color' => 'yellow'
		],
		'Czwartek' => [
			'nazwa' => '',
			'color' => ''
		],
		'Piątek' => [
			'nazwa' => 'Aktywny poranek',
			'color' => 'orange'
		]
	],
	'18' => [
		'Poniedziałek' => [
			'nazwa' => 'Perfect body',
			'color' => 'yellow'
		],
		'Wtorek' => [
			'nazwa' => '',
			'color' => ''
		],
		'Środa' => [
			'nazwa' => 'Gimnastyka dla dzieci',
			'color' => 'pink'
		],
		'Czwartek' => [
			'nazwa' => 'Zdrowy kręgosłup',
			'color' => 'green'
		],
		'Piątek' => [
			'nazwa' => '',
			'color' => ''
		]
	],
	'19' => [
		'Poniedziałek' => [
			'nazwa' => 'Mix odchudzający',
			'color' => 'purple'
		],
		'Wtorek' => [
			'nazwa' => 'Zdrowy kręgosłup',
			'color' => 'green'
		],
		'Środa' => [
			'nazwa' => 'Brzuch uda pośladki',
			'color' => 'orange'
		],
		'Czwartek' => [
			'nazwa' => 'Mix odchudzający',
			'color' => 'purple'
		],
		'Piątek' => [
			'nazwa' => 'Pilates / Power fitness',
			'color' => 'orange'
		]
	],
	'20' => [
		'Poniedziałek' => [
			'nazwa' => 'Brzuch, uda, pośladki',
			'color' => 'blue'
		],
		'Wtorek' => [
			'nazwa' => 'Płaski brzuch',
			'color' => 'orange'
		],
		'Środa' => [
			'nazwa' => 'Mix odchudzający',
			'color' => 'purple'
		],
		'Czwartek' => [
			'nazwa' => 'Płaski brzuch',
			'color' => 'orange'
		],
		'Piątek' => [
			'nazwa' => 'Brzuch, uda, pośladki',
			'color' => 'blue'
		]
	]
];

?>
<div class="grafik _i01-00">
	<div class="container">
		<div class="grafik-v01-00 hidden-sm hidden-xs">
		<table class="_j49">
			<thead>
				<th></th>
				<th>Poniedziałek</th>
				<th>Wtorek</th>
				<th>Środa</th>
				<th>Czwartek</th>
				<th>Piątek</th>
			</thead>
			<tbody>
				<?php foreach ($a as $key => $value): ?>
					<tr class="rowTable">
						<td><?php echo $key; ?>:00</td>
						<?php foreach ($value as $key => $inside): ?>
							<td class="item <?php echo $inside['color']; ?>"><?php echo $inside['nazwa']; ?></td>
						<?php endforeach; ?>
					</tr>
				<?php endforeach; ?>
			</tbody>
		</table>
		</div>
		<div class="_list01-00 _grafik-sm hidden-md hidden-lg">
			<ul class="_list-inner-zakladki">
			<?php foreach (['Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek'] as $key => $day): ?>
				<li class="3yegd">
					<header>
						<h2><?php echo $day; ?></h2>
						<div class="glyphicon glyphicon-remove _ic"></div>
					</header>
					<p class="row">
							<?php foreach ($a as $k => $value): ?>
								<span class="col-xs-12 _itm">
									<strong class="godzina"><?php echo $k; ?>:00</strong>
									<span class="_ritm <?php echo $value[$day]['color']; ?>"><?php echo $value[$day]['nazwa']; ?></span>
								</span>
							<?php endforeach; ?>
					</p>
				</li>
			<?php endforeach; ?>
			</ul>
		</div>
		<div class="legenda">
			<div class="row">
				<div class="col-sm-4 col-xs-12 _litm">
					<div class="col-sm-2 col-xs-2 _lbc green"></div>
					<p class="col-sm-10 col-xs-10">Spokojne, prozdrowotne, 50min</p>
				</div>
				<div class="col-sm-4 col-xs-12 _litm">
					<div class="col-sm-2 col-xs-2 _lbc yellow"></div>
					<p class="col-sm-10 col-xs-10">Średnio intensywne, poprawa kondycji, modelowanie sylwetki, 50 min</p>
				</div>
				<div class="col-sm-4 col-xs-12 _litm">
					<div class="col-sm-2 col-xs-2 _lbc orange"></div>
					<p class="col-sm-10 col-xs-10">Intensywne, wyszczuplenie, wzmocnienie, 50min</p>
				</div>
				<div class="col-sm-4 col-xs-12 _litm">
					<div class="col-sm-2 col-xs-2 _lbc purple"></div>
					<p class="col-sm-10 col-xs-10">Bardzo intensywne, spalanie, modelowanie sylwetki, 50min</p>
				</div>
				<div class="col-sm-4 col-xs-12 _litm">
					<div class="col-sm-2 col-xs-2 _lbc pink"></div>
					<p class="col-sm-10 col-xs-10">Bardzo intensywne, wzmacanianie, 50min</p>
				</div>
				<div class="col-sm-4 col-xs-12 _litm">
					<div class="col-sm-2 col-xs-2 _lbc blue"></div>
					<p class="col-sm-10 col-xs-10">Intensywne, wyszczuplenie, 30min</p>
				</div>
				<div class="col-sm-12 col-xs-12 _litm" style="margin-top: 35px;">
					<p style="display:block;">Zajęcia <strong>Pilates</strong> odbywają się w 1 i 3 Piątek miesiąca</p>
					<p style="display:block;">Zajęcia <strong>Power Pilates</strong> odbywają się w 2 i 4 Piątek miesiąca</p>
				</div>
			</div>
		</div>
	</div>
</div>



<?php get_footer(); ?>